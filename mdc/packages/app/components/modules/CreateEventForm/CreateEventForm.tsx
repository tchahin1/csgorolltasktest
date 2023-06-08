'use client';
import { ApiError } from '@ankora/api-client';
import { Button, Loader, Radio, Textarea } from '@ankora/ui-library';
import {
  AutocompleteDropdown,
  Datepicker,
  Input,
} from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRACTICE_TYPE, ROLE } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import listIcon from '../../../assets/practice-list.svg';
import { apiClient } from '../../../lib/apiClient';
import { get } from 'lodash';
import dayjs from 'dayjs';

const Schema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, { message: 'This field is required' }),
    practice: z.string({ required_error: 'This field is required' }),
    date: z.date({ required_error: 'This field is required' }),
    startTime: z.date({ required_error: 'This field is required' }),
    endTime: z.date({ required_error: 'This field is required' }),
    court: z.string().optional(),
    teamOrPlayers: z.string(),
    team: z.string().optional(),
    players: z.array(z.string()).optional(),
    objectives: z.string(),
  })
  .refine((data) => !dayjs(data.endTime).isBefore(dayjs(data.startTime)), {
    message: 'End date cannot be earlier than start date.',
    path: ['endTime'],
  });

const SuperCoachSchema = z.intersection(
  Schema,
  z.object({
    coachIds: z.array(z.string({ required_error: 'This field is required' })),
  }),
);

type FormSchemaType = z.infer<typeof Schema>;
type FormSuperCoachSchemaType = z.infer<typeof SuperCoachSchema>;

interface CreateEventFormProps {
  handleCreateSuccess: () => void;
  initialValues?: FormSchemaType | FormSuperCoachSchemaType;
  id?: string;
  role?: string;
  assessmentId?: string;
}

const CreateEventForm = ({
  handleCreateSuccess,
  initialValues,
  id,
  role = 'COACH',
  assessmentId,
}: CreateEventFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormSchemaType | FormSuperCoachSchemaType>(
    role === ROLE.SUPER_COACH
      ? {
          resolver: zodResolver(SuperCoachSchema),
          defaultValues: {
            teamOrPlayers: 'players',
          },
        }
      : {
          resolver: zodResolver(Schema),
          defaultValues: {
            teamOrPlayers: 'players',
          },
        },
  );

  const [initialValuesReset, setInitialValuesReset] = useState(false);

  const date = watch('date');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  const startDate = useMemo(() => {
    if (!date || !startTime) return new Date().toString();

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
    ).toString();
  }, [date, startTime]);

  const endDate = useMemo(() => {
    if (!date || !endTime) return new Date().toString();

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
    ).toString();
  }, [date, endTime]);

  const upsertAppointment = useMutation(
    (data: FormSchemaType | FormSuperCoachSchemaType) => {
      const requestBody = {
        practice: data.practice,
        players: data.teamOrPlayers === 'players' ? data.players : undefined,
        team: data.teamOrPlayers === 'team' ? data.team : undefined,
        title: data.title,
        objectives: data.objectives,
        startDate,
        endDate,
        court: data.court,
        coachIds: get(data, 'coachIds'),
        assessmentId,
      };

      if (data.id) {
        // Update appointment
        if (role === 'SUPER_COACH') {
          return apiClient.appointment.updateWithCoachIds({
            id: data.id,
            requestBody,
          });
        }
        return apiClient.appointment.update({
          id: data.id,
          requestBody,
        });
      } else {
        // Create new appointment
        if (role === 'SUPER_COACH') {
          return apiClient.appointment.createWithCoachIds({ requestBody });
        }
        return apiClient.appointment.create({
          requestBody,
        });
      }
    },
    {
      onSuccess() {
        toast.success(
          id
            ? 'Practice updated successfully'
            : 'Practice created successfully',
        );
        handleCreateSuccess();
      },
      onError(e: ApiError) {
        toast.error(
          id
            ? `Practice could not be updated. ${e.body.message}`
            : `Practice could not be created. ${e.body.message}`,
        );
      },
    },
  );

  const handleCreateEventFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    upsertAppointment.mutate(data);
  };

  const { data: courtData } = useQuery(['court', startDate, endDate], () =>
    apiClient.court.getAvailableCourtsForOrganization({
      startDate,
      endDate,
      ignoreAppointmentId: id,
    }),
  );

  const { data: playersData } = useQuery(
    ['players', startDate, endDate],
    () => {
      if (role === ROLE.SUPER_COACH) {
        return apiClient.player.getAllPlayersByOrganization();
      } else {
        return apiClient.player.getAvailablePlayersForCoach({
          startDate,
          endDate,
          ignoreAppointmentId: id,
        });
      }
    },
  );

  const { data: teamsData } = useQuery(['teams', startDate, endDate], () =>
    apiClient.team.getCoachTeams({
      startDate,
      endDate,
      ignoreAppointmentId: id,
    }),
  );

  const { data: coachesData } = useQuery(['coaches'], () =>
    apiClient.coach.getAllCoachesForOrganization(),
  );

  useEffect(() => {
    if (initialValues && !initialValuesReset) {
      reset({ ...initialValues, id });
      setInitialValuesReset(true);
    }
  }, [id, initialValues, initialValuesReset, reset]);

  return (
    <form onSubmit={handleSubmit(handleCreateEventFormSubmit)}>
      <div className='p-4'>
        <Input
          dataCy='Practice-title_input'
          label='Title'
          variant='dark'
          placeholder='Event title'
          className='mb-6'
          {...register('title')}
          error={errors['title']?.message}
          disabled={!!initialValues?.title}
        />
        {role === 'SUPER_COACH' && (
          <AutocompleteDropdown
            items={
              coachesData?.data?.map((coach) => ({
                label: coach.user.fullName,
                value: coach.id,
              })) || []
            }
            {...register('coachIds')}
            value={watch('coachIds')}
            className='mb-6 mt-2'
            placeholder='Select coach'
            label='Coach'
            multiselect
            error={errors['coach']?.message}
            dataCy='Event_dropdown'
          />
        )}
        <AutocompleteDropdown
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
          dataCy='Event_dropdown'
          errorClassname='!bottom-[-27px]'
        />

        <Datepicker
          className='mb-6 mt-2'
          label='Date'
          {...register('date')}
          value={watch('date')?.toString()}
          placeholderText='Select date'
          error={errors['date']?.message}
          minDate={new Date()}
          dataCy='Datepicker'
        />

        <div className='flex gap-4 mb-6 mt-2'>
          <Datepicker
            label='Start'
            {...register('startTime')}
            value={watch('startTime')?.toString()}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption='Time'
            dateFormat='h:mm aa'
            placeholderText='Select start time'
            error={errors['startTime']?.message}
            timePicker
            dataCy='Start-time_picker'
          />
          <Datepicker
            label='End'
            {...register('endTime')}
            value={watch('endTime')?.toString()}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeCaption='Time'
            dateFormat='h:mm aa'
            placeholderText='Select end time'
            error={errors['endTime']?.message}
            timePicker
            dataCy='End-time_picker'
          />
        </div>

        <AutocompleteDropdown
          items={
            courtData?.data?.map((court) => ({
              label: court.name,
              value: court.id,
            })) || []
          }
          {...register('court')}
          value={watch('court')}
          className='mb-6 mt-2'
          placeholder='Select court'
          label='Court'
          error={errors['court']?.message}
          disabled={!(date && startTime && endTime)}
          dataCy='Court_dropdown'
        />

        <h2 className='font-semibold text-lg text-white mb-6'>
          Add Teams or Players
        </h2>
        <Radio
          dataCy='TeamOrPlayers_radio'
          className='mb-2'
          {...register('teamOrPlayers')}
          options={[
            { label: 'Team', value: 'team' },
            { label: 'Players', value: 'players' },
          ]}
          value={watch('teamOrPlayers')}
          disabled={!!initialValues?.teamOrPlayers}
        />

        {watch('teamOrPlayers') === 'players' ? (
          <AutocompleteDropdown
            items={
              playersData?.data?.map((player) => {
                return {
                  label: player.user?.fullName || '',
                  value: player.id,
                  status: !player.isInjured,
                };
              }) || []
            }
            {...register('players')}
            value={watch('players')}
            className='mb-6'
            placeholder='Select'
            multiselect
            error={errors['players']?.message}
            disabled={!(date && startTime && endTime)}
            dataCy='Players_dropdown'
          />
        ) : (
          <AutocompleteDropdown
            items={
              teamsData?.data?.map((team) => ({
                label: team.name,
                value: team.id,
              })) || []
            }
            {...register('team')}
            value={watch('team')}
            className='mb-6'
            placeholder='Select'
            error={errors['team']?.message}
            disabled={!(date && startTime && endTime)}
            dataCy='Teams_dropdown'
          />
        )}

        <Textarea
          dataCy='Objectives_textarea'
          label='Add objectives'
          placeholder='Objectives'
          className='mb-6'
          {...register('objectives')}
        />
        <div className='flex justify-end'>
          <Button
            className='mb-2 max-w-[170px]'
            dataCy='Submit_button'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader size='sm' />
            ) : (
              <div className='flex gap-4 items-center justify-center'>
                <Image src={listIcon} alt='list icon' width={20} height={20} />
                <p>{id ? 'Edit event' : 'Add event'}</p>
              </div>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default CreateEventForm;
