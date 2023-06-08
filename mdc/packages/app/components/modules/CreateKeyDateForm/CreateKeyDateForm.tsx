'use client';
import { ApiError } from '@ankora/api-client';
import { Button, Loader } from '@ankora/ui-library';
import { Datepicker, Input } from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';

const Schema = z.object({
  title: z.string().min(1, { message: 'This field is required' }),
  date: z.date({ required_error: 'This field is required' }),
});

type FormSchemaType = z.infer<typeof Schema>;

interface CreateKeyDateFormProps {
  handleCreateSuccess: () => void;
  playerId: string;
}

const CreateKeyDateForm = ({
  handleCreateSuccess,
  playerId,
}: CreateKeyDateFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  const createKeyDate = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        title: data.title,
        startsAt: dayjs(data.date).format('MM DD YYYY'),
      };

      return apiClient.keyDate.create({
        playerId,
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Key Date created successfuly');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Key date could not be updated. ${e.body.message}`);
      },
    },
  );

  const handleCreateKeyEventFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => createKeyDate.mutate(data);

  return (
    <form onSubmit={handleSubmit(handleCreateKeyEventFormSubmit)}>
      <div className='p-4'>
        <Input
          dataCy='Picker_input'
          label='Title'
          variant='dark'
          placeholder='Title'
          className='mb-6'
          {...register('title')}
          error={errors['title']?.message}
        />

        <Datepicker
          dataCy='Date_picker'
          className='mb-6 mt-2'
          label='Date'
          {...register('date')}
          value={watch('date')?.toString()}
          placeholderText='Select date'
          error={errors['date']?.message}
        />

        <Button
          className='mb-2'
          dataCy='submit_button'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader size='sm' /> : <p>Save</p>}
        </Button>
      </div>
    </form>
  );
};
export default CreateKeyDateForm;
