'use client';
import { ApiError } from '@ankora/api-client';
import { Coach } from '@ankora/models';
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

const Schema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field is required' })
    .email('Please insert a valid email.'),
  password: z
    .string()
    .min(1, { message: 'This field is required' })
    .min(6, { message: 'Password should contain at least 6 characters' }),
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

interface CreatePlayerFormProps {
  handleCreateSuccess: () => void;
  coaches: Coach[];
  currentCoach: Coach;
}

const CreatePlayerForm = ({
  handleCreateSuccess,
  coaches,
  currentCoach,
}: CreatePlayerFormProps) => {
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
      coaches: [currentCoach?.id],
      sex: SEX.MALE,
    },
  });

  const createPlayer = useMutation(
    (data: FormSchemaType) => {
      const {
        email,
        password,
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
        email,
        password,
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

      return apiClient.user.createPlayer({
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Player created successfuly');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Player could not be created. ${e.body.message}`);
      },
    },
  );

  const handleCreatePlayerFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => createPlayer.mutate(data);

  return (
    <form onSubmit={handleSubmit(handleCreatePlayerFormSubmit)}>
      <div className='p-4'>
        <Input
          label='Email'
          variant='dark'
          placeholder='Email'
          className='mb-6'
          {...register('email')}
          error={errors['email']?.message}
          shouldScaleOnFocus={false}
        />
        <Input
          label='Password'
          variant='dark'
          placeholder='Password'
          className='mb-6'
          {...register('password')}
          error={errors['password']?.message}
          shouldScaleOnFocus={false}
          type='password'
        />
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
export default CreatePlayerForm;
