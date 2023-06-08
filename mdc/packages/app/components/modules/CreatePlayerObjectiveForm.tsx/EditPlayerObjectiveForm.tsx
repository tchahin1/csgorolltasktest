'use client';
import { Button, Loader, Textarea } from '@ankora/ui-library';
import {
  AutocompleteDropdown,
  Datepicker,
  Input,
} from '@ankora/ui-library/client';
import { ApiError } from '@ankora/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRACTICE_TYPE } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Schema = z.object({
  title: z.string().min(1, { message: 'This field is required' }),
  practiceType: z.string({ required_error: 'This field is required' }),
  startDate: z.date({ required_error: 'This field is required' }),
  endDate: z.date({ required_error: 'This field is required' }),
  description: z.string(),
});

type FormSchemaType = z.infer<typeof Schema>;

interface EditPlayerObjectiveFormProps {
  handleCloseDrawer: () => void;
  objectiveId: string;
}

const EditPlayerObjectiveForm = ({
  handleCloseDrawer,
  objectiveId,
}: EditPlayerObjectiveFormProps) => {
  const {
    data: objective,
    refetch,
    remove,
  } = useQuery(
    ['objective'],
    () => apiClient.objective.getObjectiveById({ id: objectiveId }),
    {
      enabled: !!objectiveId,
    },
  );

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  useEffect(() => {
    if (objectiveId) refetch();
  }, [objectiveId, refetch]);

  useEffect(() => {
    if (objective?.data) {
      reset({
        ...objective.data,
        startDate: new Date(objective.data.startDate),
        endDate: new Date(objective.data.endDate),
      });
    }
  }, [objective?.data, reset]);

  const router = useRouter();

  const deleteObjective = useMutation(
    (id: string) => {
      return apiClient.objective.deleteObjectiveById({
        id,
      });
    },
    {
      onSuccess() {
        toast.success('Player objective deleted successfuly');
        reset();
        remove();
        router.refresh();
        handleCloseDrawer();
      },
      onError(e: ApiError) {
        toast.error(`Player objective could not be deleted. ${e.body.message}`);
      },
    },
  );

  const editPlayerObjective = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        ...data,
        startDate: dayjs(data.startDate).format('MM DD YYYY'),
        endDate: dayjs(data.endDate).format('MM DD YYYY'),
      };

      return apiClient.objective.editObjectiveById({
        id: objectiveId,
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Player objective edited successfuly');
        router.refresh();
        reset();
        refetch();
        handleCloseDrawer();
      },
      onError(e: ApiError) {
        toast.error(`Player objective could not be updated. ${e.body.message}`);
      },
    },
  );

  const handleDeleteObjective = () => deleteObjective.mutate(objectiveId);

  const handleCreateKeyEventFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => editPlayerObjective.mutate(data);

  return (
    <form onSubmit={handleSubmit(handleCreateKeyEventFormSubmit)}>
      <div className='p-4'>
        <Input
          label='Title'
          variant='dark'
          placeholder='Title'
          className='mb-6'
          {...register('title')}
          error={errors['title']?.message}
        />

        <AutocompleteDropdown
          items={[
            { label: 'Tennis', value: PRACTICE_TYPE.TENNIS },
            { label: 'Assessment', value: PRACTICE_TYPE.ASSESSMENT },
            { label: 'Fitness', value: PRACTICE_TYPE.FITNESS },
            { label: 'Mental', value: PRACTICE_TYPE.MENTAL },
            { label: 'Physio', value: PRACTICE_TYPE.PHYSIO },
          ]}
          {...register('practiceType')}
          value={watch('practiceType')}
          className='mb-6 mt-2'
          placeholder='Select type of practice'
          label='Practice'
          error={errors['practice']?.message}
        />

        <Datepicker
          dataCy='Datepicker'
          className='mb-6 mt-2'
          label='From'
          {...register('startDate')}
          value={watch('startDate')?.toString()}
          placeholderText='Select date'
          error={errors['from']?.message}
        />

        <Datepicker
          className='mb-6 mt-2'
          label='To'
          {...register('endDate')}
          value={watch('endDate')?.toString()}
          placeholderText='Select date'
          error={errors['to']?.message}
        />

        <Textarea
          label='Description'
          placeholder='Description'
          className='mb-6'
          {...register('description')}
        />

        <Button
          className='mb-4'
          dataCy='submit_button'
          type='button'
          disabled={isSubmitting}
          variant='black'
          onClick={handleDeleteObjective}
        >
          <p>Archive</p>
        </Button>

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
export default EditPlayerObjectiveForm;
