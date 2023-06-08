'use client';
import { useState } from 'react';
import { firebaseEmailLogin } from '@ankora/firebase';

const LoginWithEmail = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginWithEmailData = await firebaseEmailLogin(email, password);
    if (loginWithEmailData.error) {
      console.log(loginWithEmailData.error);
    } else {
      localStorage.setItem('token', loginWithEmailData.token);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='email'>Email:</label>
      <input
        type='email'
        id='email'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor='password'>Password:</label>
      <input
        type='password'
        id='password'
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type='submit'>Login</button>
    </form>
  );
};
export default LoginWithEmail;
