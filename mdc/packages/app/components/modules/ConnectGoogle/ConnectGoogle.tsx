'use client';
import { ROLE } from '@prisma/client';
import { firebaseGoogleLogin } from '@ankora/firebase';
import { Button } from '@ankora/ui-library';
import Image from 'next/image';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import googleLogo from '../../../assets/google_logo.svg';
import { apiClient } from '../../../lib/apiClient';
import { useRouter } from 'next/navigation';
import { UserSignupDto, ApiResponse, UserLoginDto } from '@ankora/api-client';
import TOKEN from '../../../lib/token';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/providers';

interface ConnectGoogleProps {
  withRegistration: boolean;
}
const ConnectGoogle = ({ withRegistration }: ConnectGoogleProps) => {
  const { onUserLoginSuccess } = useAuth();

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
        router.push('/');
      },
      onError: () => {
        toast.error('Something went wrong');
      },
    },
  );

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

  const loginWithGoogle = async () => {
    const result = await firebaseGoogleLogin();

    if (withRegistration) {
      await createUser.mutateAsync({
        email: result.user.email,
        fullName: result.user.displayName,
        role: ROLE.COACH,
        firebaseToken: result.token,
      });
    } else {
      await loginUser.mutateAsync({ firebaseToken: result.token });
    }
  };
  return (
    <Button variant='ghost' onClick={loginWithGoogle}>
      <div className='flex justify-center gap-2'>
        <Image src={googleLogo} alt='Googe Logo' />
        <p>Sign in with Google</p>
      </div>
    </Button>
  );
};

export default ConnectGoogle;
