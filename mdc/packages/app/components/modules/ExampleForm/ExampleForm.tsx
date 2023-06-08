'use client';

import { Button } from '@ankora/ui-library';
import { Input } from '@ankora/ui-library/client';
import { useForm } from 'react-hook-form';

const ExampleForm = () => {
  const { handleSubmit, register } = useForm({
    defaultValues: { firstName: 'Temp' },
  });

  const handleExampleFormSubmit = (data: { firstName: string }) =>
    console.log('TODO: DATA', data);

  return (
    <form onSubmit={handleSubmit(handleExampleFormSubmit)}>
      <Input {...register('firstName')} />
      <Button type='submit'>Save</Button>
    </form>
  );
};

export default ExampleForm;
