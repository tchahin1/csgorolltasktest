'use client';

import { Button, Loader } from '@ankora/ui-library';
import { Input } from '@ankora/ui-library/client';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CreateExerciseDto } from '@ankora/api-client';
import { apiClient } from '../../../lib/apiClient';
import { toast } from 'react-toastify';
import { uploadFile } from '../../../helpers/awsFileUpload';
import { useRouter } from 'next/navigation';
import file from '../../../assets/file.svg';
import Image from 'next/image';
const Schema = z.object({
  name: z.string().min(1, { message: 'This field is required' }),
  description: z.string({ required_error: 'This field is required' }),
});

type FormSchemaType = z.infer<typeof Schema>;

interface AddExerciseFormProps {
  closeDrawer: () => void;
}

const AddExerciseForm = ({ closeDrawer }: AddExerciseFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  const [awsData, setAwsData] = useState(null);
  const handleCreateExerciseFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    if (awsData) {
      const requestBody = {
        name: data.name,
        description: data.description,
        videoUrl: awsData.url,
        awsKey: awsData.key,
        duration: awsData.duration,
      };
      await createSesstion.mutateAsync(requestBody);
    } else {
      toast.error(`Please select video`);
    }
  };

  const createSesstion = useMutation(
    async (requestBody: CreateExerciseDto) => {
      return apiClient.exercise.create({ requestBody });
    },
    {
      onSuccess: () => {
        router.refresh();
        toast.success('Exercise created successfully!');
        setIsLoading(false);
        closeDrawer();
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
    if (uploadToAws.uploaded) {
      toast.success(`Video uploaded successfully!`);
      setIsLoading(false);
      setAwsData(uploadToAws);
    } else {
      toast.error(`Invalid file type!`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateExerciseFormSubmit)}>
        <div className='p-4 h-full flex flex-col'>
          <div className='mb-4'>
            <Input
              dataCy='Name_input'
              label='Name'
              variant='dark'
              placeholder='Name'
              className='mb-6'
              {...register('name')}
              error={errors['name']?.message}
            />
            <Input
              dataCy='Description_input'
              label='Description'
              variant='dark'
              placeholder='Description'
              className='mb-6'
              {...register('description')}
              error={errors['description']?.message}
            />
            {awsData ? (
              <div className='flex'>
                {' '}
                <Image src={file} width={20} height={20} alt='file' />
                <p className='w-[inherit] text-white font-semibold text-sm ml-2'>
                  {awsData.filename}
                </p>
              </div>
            ) : (
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
            )}
          </div>
          <div className='mt-auto flex flex-row gap-4'>
            <Button className='mb-2' dataCy='submit_button' type='submit'>
              <p>Save</p>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddExerciseForm;
