'use client';
import { ApiError } from '@ankora/api-client';
import { Button, Loader, Textarea } from '@ankora/ui-library';
import {
  AutocompleteDropdown,
  Datepicker,
  Input,
} from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRACTICE_TYPE } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';

const Schema = z.object({
  title: z.string().min(1, { message: 'This field is required' }),
  practice: z.string({ required_error: 'This field is required' }),
  from: z.date({ required_error: 'This field is required' }),
  to: z.date({ required_error: 'This field is required' }),
  description: z.string(),
});

type FormSchemaType = z.infer<typeof Schema>;

interface CreatePlayerObjectiveFormProps {
  handleCreateSuccess: () => void;
  playerId: string;
}

const CreatePlayerObjectiveForm = ({
  handleCreateSuccess,
  playerId,
}: CreatePlayerObjectiveFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  const createPlayerObjective = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        title: data.title,
        startDate: dayjs(data.from).format('MM DD YYYY'),
        endDate: dayjs(data.to).format('MM DD YYYY'),
        practiceType: data.practice,
        description: data.description,
      };

      return apiClient.objective.createObjectiveForPlayer({
        id: playerId,
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Player objective created successfuly');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Player objective could not be updated. ${e.body.message}`);
      },
    },
  );

  const handleCreatePlayerObjectiveFormSubmit: SubmitHandler<
    FormSchemaType
  > = async (data) => createPlayerObjective.mutate(data);

  return (
    <form onSubmit={handleSubmit(handleCreatePlayerObjectiveFormSubmit)}>
      <div className='p-4'>
        <Input
          dataCy='Title_input'
          label='Title'
          variant='dark'
          placeholder='Title'
          className='mb-6'
          {...register('title')}
          error={errors['title']?.message}
        />

        <AutocompleteDropdown
          dataCy='Practice_dropdown'
          items={[
            { label: 'Tennis', value: PRACTICE_TYPE.TENNIS },
            { label: 'Assessment', value: PRACTICE_TYPE.ASSESSMENT },
            { label: 'Fitness', value: PRACTICE_TYPE.FITNESS },
            { label: 'Mental', value: PRACTICE_TYPE.MENTAL },
            { label: 'Physio', value: PRACTICE_TYPE.PHYSIO },
          ]}
          {...register('practice')}
          value={watch('practice')}
          className='mb-6 mt-2'
          placeholder='Select type of practice'
          label='Practice'
          error={errors['practice']?.message}
        />

        <Datepicker
          dataCy='Datepicker-start-date'
          className='mb-6 mt-2'
          label='From'
          {...register('from')}
          value={watch('from')?.toString()}
          placeholderText='Select date'
          error={errors['from']?.message}
        />

        <Datepicker
          dataCy='Datepicker-end-date'
          className='mb-6 mt-2'
          label='To'
          {...register('to')}
          value={watch('to')?.toString()}
          placeholderText='Select date'
          error={errors['to']?.message}
        />

        <Textarea
          dataCy='Textarea'
          label='Description'
          placeholder='Description'
          className='mb-6'
          {...register('description')}
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
export default CreatePlayerObjectiveForm;
