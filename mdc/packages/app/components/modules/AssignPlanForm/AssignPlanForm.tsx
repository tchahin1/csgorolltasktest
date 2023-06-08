'use client';
import { Plan } from '@ankora/models';
import { Button, Loader } from '@ankora/ui-library';
import {
  AutocompleteDropdown,
  Datepicker,
  FilterDropdown,
} from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROLE } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { ApiError } from 'next/dist/server/api-utils';

const Schema = z.object({
  planId: z.string({ required_error: 'This field is required' }),
  startDate: z.date({ required_error: 'This field is required' }),
  assignedPlayers: z.union([
    z.object({
      playerIds: z
        .array(z.string())
        .nonempty({ message: 'This field is required' }),
      teamIds: z.array(z.string()).optional(),
    }),
    z.object({
      playerIds: z.array(z.string()).optional(),
      teamIds: z
        .array(z.string())
        .nonempty({ message: 'This field is required' }),
    }),
  ]),
});

type FormSchemaType = z.infer<typeof Schema>;

interface AssignPlanFormProps {
  handleCreateSuccess: () => void;
  plans?: Plan[];
  role: ROLE;
}

const AssignPlanForm = ({
  handleCreateSuccess,
  plans,
  role,
}: AssignPlanFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      assignedPlayers: { playerIds: [], teamIds: [] },
    },
  });

  const { data: playersData } = useQuery(['players'], () => {
    return apiClient.player.getAllPlayerForCoach({ order: 'asc' });
  });

  const { data: teamsData } = useQuery(['teams'], () =>
    apiClient.team.getTeams(),
  );

  const tabs = useMemo(
    () => [
      {
        label: 'Players',
        key: 'playerIds',
        options: playersData?.data?.map((player) => ({
          label: player.user.fullName,
          value: player.id,
        })),
      },
      {
        label: 'Teams',
        key: 'teamIds',
        options: teamsData?.data?.map((team) => ({
          label: team.name,
          value: team.id,
        })),
      },
    ],
    [playersData?.data, teamsData?.data],
  );

  const upsertAppointment = useMutation(
    (data: FormSchemaType) => {
      return apiClient.plan.assignPlayer({
        requestBody: {
          playerIds: data.assignedPlayers.playerIds,
          teamIds: data.assignedPlayers.teamIds,
          planId: data.planId,
          startDate: data.startDate.toString(),
        },
      });
    },
    {
      onSuccess() {
        toast.success('Plan assigned successfully');
        handleCreateSuccess();
      },
      onError(e: ApiError) {
        toast.error('Plan could not be assigned');
      },
    },
  );

  const handleAssignPlanFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => upsertAppointment.mutate(data);

  return (
    <form onSubmit={handleSubmit(handleAssignPlanFormSubmit)}>
      <div className='p-4'>
        <AutocompleteDropdown
          items={
            plans?.map((plan) => ({
              label: plan.name,
              value: plan.id,
            })) || []
          }
          {...register('planId')}
          value={watch('planId')}
          className='mb-6 mt-2'
          placeholder={plans?.[0]?.name || 'Search by name or tags'}
          label='Search for a plan'
          error={errors['planId']?.message}
          errorClassname='!bottom-[-27px]'
        />

        <FilterDropdown
          tabs={tabs}
          {...register('assignedPlayers')}
          value={watch('assignedPlayers')}
          className='mb-6 mt-2'
          placeholder='Search for people'
          label='Search for players'
          error={
            errors['assignedPlayers']?.playerIds?.message ||
            errors['assignedPlayers']?.teamIds?.message
          }
          errorClassname='!bottom-[-27px]'
        />

        <Datepicker
          className='mb-6 mt-2'
          label='Start Date'
          {...register('startDate')}
          value={watch('startDate')?.toString()}
          placeholderText='Select date'
          error={errors['startDate']?.message}
          minDate={new Date()}
          dataCy='Datepicker'
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
export default AssignPlanForm;
