'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AutocompleteDropdown,
  MultipleDatepicker,
} from '@ankora/ui-library/client';
import { Button, Loader } from '@ankora/ui-library';
import { Player, Practice } from '@ankora/models';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { toast } from 'react-toastify';
import { ApiError } from '@ankora/api-client';
import dayjs from 'dayjs';

const Schema = z.object({
  practice: z.string({ required_error: 'This field is required' }),
  dates: z.date({ required_error: 'This field is required' }).array(),
  players: z.array(z.string({ required_error: 'This field is required' })),
});

type FormSchemaType = z.infer<typeof Schema>;

interface CreatePracticeFormProps {
  handleCreateSuccess: () => void;
  practices?: Practice[];
  players?: Player[];
}

const AssignPracticeForm = ({
  handleCreateSuccess,
  practices,
  players,
}: CreatePracticeFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset,
    control,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  const assignPractice = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        playerIds: data.players,
        dates: data.dates.map((date) => dayjs(date).toISOString()),
      };

      return apiClient.practice.assignPractice({
        id: data.practice,
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Practice assigned successfuly');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Practice could not be assigned. ${e.body.message}`);
      },
    },
  );

  const handleAssignPracticeFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    assignPractice.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleAssignPracticeFormSubmit)}>
        <div className='p-4'>
          <AutocompleteDropdown
            items={
              practices?.map((practice) => ({
                label: practice.name,
                value: practice.id,
              })) || []
            }
            {...register('practice')}
            value={watch('practice')}
            className='mb-6 mt-2'
            placeholder={practices?.[0]?.name || 'Select practice'}
            label='Select Practice'
            error={errors['practice']?.message}
            errorClassname='!bottom-[-27px]'
          />

          <AutocompleteDropdown
            items={
              players?.map((player) => {
                return {
                  label: player.user?.fullName || '',
                  value: player.id,
                  status: !player.isInjured,
                };
              }) || []
            }
            {...register('players')}
            value={watch('players')}
            className='mb-6 mt-2'
            placeholder='Select'
            multiselect
            label='Assign to players'
            error={errors['players']?.message}
            dataCy='Players_dropdown'
            errorClassname='!bottom-[-27px]'
          />

          <MultipleDatepicker
            multiple
            control={control}
            name='dates'
            inputVariant='dark'
            error={errors['dates']?.message as string}
            datepickerPopperClassname='multipledate'
            label='Dates'
            placeholder='Select dates...'
            errorClassname='bottom-[-17px]'
          />

          <Button
            className='mb-2 mt-6'
            dataCy='submit_button'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader size='sm' /> : <p>Assign</p>}
          </Button>
        </div>
      </form>
    </>
  );
};

export default AssignPracticeForm;
