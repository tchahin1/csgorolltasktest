'use client';
import { Button, Checkbox, Loader } from '@ankora/ui-library';
import { Input } from '@ankora/ui-library/client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { toast } from 'react-toastify';

const Schema = z.object({
  email: z.string().email({ message: 'Please insert a valid email' }),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept Terms and Conditions.' }),
  }),
});

type FormSchemaType = z.infer<typeof Schema>;

const ForgotPasswordForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(Schema) });

  const forgotPassword = useMutation((email: string) =>
    apiClient.auth.forgotPassword({
      requestBody: {
        email,
      },
    }),
  );

  const handleForgotPassword: SubmitHandler<FormSchemaType> = async (data) => {
    forgotPassword.mutate(data.email, {
      onError: () => toast.error('Something went wrong'),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)}>
      {forgotPassword.isSuccess && (
        <p className='mb-4 text-gray-500 italic text-center break-keep'>
          Password reset request has been sent to your email and it should
          arrive shortly
        </p>
      )}

      <Input
        {...register('email')}
        label='Email'
        placeholder='name@flowbite.com'
        disabled={isSubmitting}
        error={errors['email']?.message}
        variant='light'
        className='mb-6'
      />

      <Checkbox
        {...register('terms')}
        label='I agree to Coach Portal Terms of Use and Privacy Policy.'
        error={errors['terms']?.message}
      />
      <Button type='submit' className='mb-2'>
        {forgotPassword.isLoading ? <Loader /> : <p> Reset password</p>}
      </Button>
      <Link
        href='/auth/login'
        className='text-primary-600 hover:text-primary-800 text-xs'
      >
        I can&apos;t recover my account using this page
      </Link>
    </form>
  );
};
export default ForgotPasswordForm;
