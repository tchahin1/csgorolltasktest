'use client';
import { ApiError } from '@ankora/api-client';
import { Coach, Player, PlayerCoach } from '@ankora/models';
import { Button, Loader } from '@ankora/ui-library';
import {
  AutocompleteDropdown,
  Input,
  MultipleDatepicker,
  TagList,
} from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SEX } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';
import { v4 as uuid } from 'uuid';

const Schema = z.object({
  fullName: z.string().min(1, { message: 'This field is required' }),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  zip: z.string(),
  sex: z.string().optional(),
  plays: z.any(),
  dateOfBirth: z.date().optional(),
  height: z.string(),
  weight: z.string(),
  coaches: z.array(z.string({ required_error: 'This field is required' })),
});

type FormSchemaType = z.infer<typeof Schema>;

interface EditPlayerFormProps {
  handleCreateSuccess: () => void;
  player: Player;
  coaches?: Coach[];
}

const EditPlayerForm = ({
  handleCreateSuccess,
  coaches,
  player,
}: EditPlayerFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    control,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      fullName: player.user.fullName,
      coaches: player.playerCoaches?.map(
        (playerCoach: PlayerCoach) => playerCoach?.coachId,
      ),
      dateOfBirth: dayjs(player.dateOfBirth).toDate(),
      address: player.user.address || '',
      city: player.user.city || '',
      zip: player.user.zip || '',
      phone: player.user.phone || '',
      height: player.height || '',
      weight: player.weight || '',
      sex: player.sex || '',
      plays: player.plays?.map((play) => ({ id: uuid(), value: play })) || [],
    },
  });

  const editPlayer = useMutation(
    (data: FormSchemaType) => {
      const {
        fullName,
        phone,
        address,
        city,
        zip,
        sex,
        plays,
        dateOfBirth,
        height,
        weight,
        coaches,
      } = data;

      const requestBody = {
        fullName,
        phone,
        address,
        city,
        zip,
        sex,
        plays: plays?.map((play: { id: string; value: string }) => play.value),
        dateOfBirth: dayjs(dateOfBirth).format('MM DD YYYY'),
        height,
        weight,
        coaches,
      };

      return apiClient.user.updatePlayer({
        email: player.user.email,
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Player edited successfuly');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Player could not be updated. ${e.body.message}`);
      },
    },
  );

  const handleEditPlayerFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => editPlayer.mutate(data);

  return (
    <form onSubmit={handleSubmit(handleEditPlayerFormSubmit)}>
      <div className='p-4'>
        <Input
          label='Full name'
          variant='dark'
          placeholder='Full name'
          className='mb-6'
          {...register('fullName')}
          error={errors['fullName']?.message}
          shouldScaleOnFocus={false}
        />
        <AutocompleteDropdown
          items={
            coaches?.map((coach) => ({
              label: coach.user.fullName,
              value: coach.id,
            })) || []
          }
          {...register('coaches')}
          value={watch('coaches')}
          className='mb-6 mt-2'
          placeholder='Select coaches...'
          error={!!errors['coaches']?.message && 'This field is required'}
          label='Coaches'
          multiselect
          errorClassname='!bottom-[-27px]'
        />

        <MultipleDatepicker
          control={control}
          name='dateOfBirth'
          inputVariant='dark'
          error={errors['dateOfBirth']?.message as string}
          datepickerPopperClassname='multipledate'
          label='Date of birth'
          placeholder='Date of birth...'
        />
        <div className='flex gap-4'>
          <Input
            label='Address'
            variant='dark'
            placeholder='Address'
            className='mb-6 w-full'
            {...register('address')}
            error={errors['address']?.message}
            shouldScaleOnFocus={false}
          />
          <Input
            label='Phone'
            variant='dark'
            placeholder='Phone'
            className='mb-6 w-full'
            {...register('phone')}
            error={errors['phone']?.message}
            shouldScaleOnFocus={false}
          />
        </div>

        <div className='flex gap-4'>
          <Input
            label='City'
            variant='dark'
            placeholder='City'
            className='mb-6 w-full'
            {...register('city')}
            error={errors['city']?.message}
            shouldScaleOnFocus={false}
          />
          <Input
            label='Zip'
            variant='dark'
            placeholder='Zip'
            className='mb-6 w-full'
            {...register('zip')}
            error={errors['zip']?.message}
            shouldScaleOnFocus={false}
          />
        </div>
        <div className='flex gap-4'>
          <Input
            type='number'
            label='Height (cm)'
            variant='dark'
            placeholder='Height'
            className='mb-6 w-full'
            {...register('height')}
            error={errors['height']?.message}
            shouldScaleOnFocus={false}
          />
          <Input
            type='number'
            label='Weight (kg)'
            variant='dark'
            placeholder='Weight'
            className='mb-6 w-full'
            {...register('weight')}
            error={errors['weight']?.message}
            shouldScaleOnFocus={false}
          />
        </div>

        <AutocompleteDropdown
          items={[
            { label: 'Male', value: SEX.MALE },
            { label: 'Female', value: SEX.FEMALE },
          ]}
          {...register('sex')}
          value={watch('sex')}
          className='mb-6 mt-2'
          placeholder='Select'
          error={errors['sex']?.message}
          label='Sex'
        />

        <TagList
          label='Plays'
          {...register('plays')}
          value={watch('plays')}
          full
          placeholder='Right handed, left handed...'
        />

        <Button
          className='mt-4'
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
export default EditPlayerForm;
