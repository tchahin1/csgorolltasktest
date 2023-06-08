'use client';
import { ApiResponse, UserLoginDto } from '@ankora/api-client';
import { firebaseEmailLogin } from '@ankora/firebase';
import { Input } from '@ankora/ui-library/client';
import { Button, Checkbox, Loader } from '@ankora/ui-library';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';
import TOKEN from '../../../lib/token';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/providers';

const Schema = z.object({
  email: z.string().email({ message: 'Please insert a valid email' }),
  rememberMe: z.boolean().optional(),
  password: z
    .string()
    .min(6, { message: 'Password should contain at least 6 characters' }),
});

type FormSchemaType = z.infer<typeof Schema>;

const LoginForm = () => {
  const { onUserLoginSuccess } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(Schema) });

  const router = useRouter();

  const loginUser = useMutation(
    async (requestBody: UserLoginDto) => {
      const res = apiClient.auth.userLogin({
        requestBody,
      });
      return res;
    },
    {
      onSuccess: ({ data }: ApiResponse<string>) => {
        TOKEN.set(data);
        onUserLoginSuccess(data);
        router.push('/');
      },
      onError: () => {
        toast.error('User credentials are invalid');
      },
    },
  );

  const handleLoginFormSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const { email, password } = data;

    const user = await apiClient.user.getUser({
      email: email,
    });

    if (
      (user && user?.data?.role === 'COACH') ||
      user?.data?.role === 'SUPER_COACH'
    ) {
      const loginWithEmailData = await firebaseEmailLogin(email, password);
      if (loginWithEmailData.error) {
        console.log(loginWithEmailData.error);
      } else {
        loginUser.mutateAsync({ firebaseToken: loginWithEmailData.token });
      }
    } else {
      if (user?.data?.role === 'PLAYER') {
        toast.error("Can't sign in as a player");
      } else {
        toast.error('Invalid credentials');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLoginFormSubmit)}>
      <Input
        {...register('email')}
        label='Email'
        placeholder='name@flowbite.com'
        disabled={isSubmitting}
        error={errors['email']?.message}
        variant='light'
        dataCy='email_input'
        className='mb-6'
      />

      <Input
        {...register('password')}
        label='Password'
        placeholder='••••••••••'
        disabled={isSubmitting}
        error={errors['password']?.message}
        variant='light'
        type='password'
        dataCy='password_input'
        className='mb-6'
      />

      <div className='flex justify-between w-full'>
        <Checkbox
          {...register('rememberMe')}
          label='Remember me'
          error={errors['terms']?.message}
          styles='w-full'
          dataCy='Remember-me_button'
        />
        <Link
          href='auth/forgot-password'
          className='text-xs leading-5 text-primary-600 hover:text-primary-800 w-full text-end'
        >
          Forgot password?
        </Link>
      </div>

      <Button
        className='mb-2'
        dataCy='submit_button'
        type='submit'
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader size='sm' /> : <p>Sign In</p>}
      </Button>
      <p className='text-gray-500 text-xs'>
        Don&apos;t have an account yet?{' '}
        <Link
          href='/auth/signup'
          className='text-primary-600 hover:text-primary-800'
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};
export default LoginForm;
