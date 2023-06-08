'use client';
import { ApiResponse, UserSignupDto } from '@ankora/api-client';
import { firebaseRegisterEmail } from '@ankora/firebase';
import { Button, Checkbox, Loader } from '@ankora/ui-library';
import { Input } from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROLE } from '@prisma/client';
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
  name: z.string().min(1, { message: 'This field is required' }),
  email: z.string().email({ message: 'Please insert a valid email' }),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept Terms and Conditions.' }),
  }),
  password: z
    .string()
    .min(6, { message: 'Password should contain at least 6 characters' }),
});

type FormSchemaType = z.infer<typeof Schema>;

const RegisterForm = () => {
  const { onUserLoginSuccess } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(Schema) });

  const router = useRouter();

  const createUser = useMutation(
    async (requestBody: UserSignupDto) => {
      const res = apiClient.auth.userSignup({
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
        toast.error('Something went wrong');
      },
    },
  );

  const handleRegisterFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    const { email, password, name } = data;
    const loginWithEmailData = await firebaseRegisterEmail(email, password);

    if (loginWithEmailData.error) {
      console.log(loginWithEmailData.error);
    } else {
      await createUser.mutateAsync({
        email: email,
        fullName: name,
        role: ROLE.COACH,
        firebaseToken: loginWithEmailData.token,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(handleRegisterFormSubmit)}>
      <Input
        {...register('name')}
        label='What shoud we call you?'
        placeholder='e.g Bonnie Green'
        disabled={isSubmitting}
        error={errors['name']?.message}
        variant='light'
        dataCy='name_input'
        className='mb-6'
      />
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

      <Checkbox
        {...register('terms')}
        label='By signing up, you are creating an account, and you agree to Coaching Portal Terms of Use and Privacy Policy.'
        error={errors['terms']?.message}
        styles='mt-8 mb-3'
        dataCy='terms_checkbox'
      />

      <Button
        className='mb-2'
        dataCy='submit_button'
        type='submit'
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader size='sm' /> : <p>Sign Up</p>}
      </Button>

      <p className='text-gray-500 text-xs'>
        Already have an account.{' '}
        <Link
          href='/auth/login'
          className='text-primary-600 hover:text-primary-800'
        >
          Login here
        </Link>
      </p>
    </form>
  );
};
export default RegisterForm;
