'use client';

import { Button, Loader } from '@ankora/ui-library';
import { useState } from 'react';
import { uploadFile } from '../../../helpers/awsFileUpload';
import { VIDEO_STATUS } from '@prisma/client';
import { apiClient } from '../../../lib/apiClient';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { CreateSessionDto } from '@ankora/api-client';
import { useRouter } from 'next/navigation';
interface UploadSessionProps {
  playerId: string;
}

const UploadSession = ({ playerId }: UploadSessionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createSesstion = useMutation(
    async (requestBody: CreateSessionDto) => {
      return apiClient.session.createSessionFromCoach({ requestBody });
    },
    {
      onSuccess: () => {
        toast.success('Video uploaded successfully!');
        setIsLoading(false);
        router.refresh();
      },
      onError: () => {
        toast.error(`Something went wrong.`);
        setIsLoading(false);
      },
    },
  );
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsLoading(true);
    const uploadToAws = await uploadFile(event);
    if (uploadToAws?.uploaded) {
      const requestBody = {
        playerId: playerId,
        videoUrl: uploadToAws.url,
        name: uploadToAws.filename,
        duration: uploadToAws.duration,
        videoStatus: VIDEO_STATUS.IN_REVIEW,
        awsKey: uploadToAws.key,
      };
      await createSesstion.mutateAsync(requestBody);
    } else {
      toast.error(`Invalid file type!`);
      setIsLoading(false);
    }
  };
  return (
    <div className='flex justify-between items-center'>
      <p className='text-white'>Sessions</p>
      <Button
        variant='primary'
        className='max-w-[140px] relative overflow-hidden'
      >
        {isLoading ? (
          <Loader size='sm' />
        ) : (
          <p>
            Upload Video
            <input
              type='file'
              accept='video/*'
              onChange={handleFileSelect}
              className='opacity-0 absolute left-0 top-0 cursor-pointer'
            />
          </p>
        )}
      </Button>
    </div>
  );
};

export default UploadSession;
