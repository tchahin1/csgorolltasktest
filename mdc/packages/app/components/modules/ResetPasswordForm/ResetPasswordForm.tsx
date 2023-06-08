'use client';
import { Button, Loader } from '@ankora/ui-library';
import { Input } from '@ankora/ui-library/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { ResetPasswordDto } from '@ankora/api-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Schema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password should contain at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password should contain at least 6 characters' }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords should match',
        path: ['confirmPassword'],
      });
    }
  });

type FormSchemaType = z.infer<typeof Schema>;

const ResetPasswordForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(Schema) });

  const token = useSearchParams().toString().split('=')[1];
  const router = useRouter();

  const resetPassword = useMutation((data: ResetPasswordDto) =>
    apiClient.auth.resetPassword({
      requestBody: {
        password: data.password,
        confirmPassword: data.confirmPassword,
        token: data.token,
      },
    }),
  );

  const handleResetPassword: SubmitHandler<FormSchemaType> = async (data) => {
    resetPassword.mutate(
      {
        password: data.password,
        confirmPassword: data.confirmPassword,
        token,
      },
      {
        onSuccess: () => {
          toast.success('New password is set successfuly');
          router.push('/auth/login');
        },
        onError: () => toast.error('Something went wrong'),
      },
    );
  };
  return (
    <form onSubmit={handleSubmit(handleResetPassword)}>
      <Input
        {...register('password')}
        label='New password'
        placeholder='••••••••••'
        disabled={isSubmitting}
        error={errors['password']?.message}
        variant='light'
        type='password'
        className='mb-6'
      />{' '}
      <Input
        {...register('confirmPassword')}
        label='Confirm password'
        placeholder='••••••••••'
        disabled={isSubmitting}
        error={errors['confirmPassword']?.message}
        variant='light'
        type='password'
        className='mt-2 mb-6'
      />
      <Button type='submit'>
        {resetPassword.isLoading ? <Loader /> : <p>Reset password</p>}
      </Button>
    </form>
  );
};
export default ResetPasswordForm;
