'use client';
import { ApiError } from '@ankora/api-client';
import { Button, Loader, Textarea } from '@ankora/ui-library';
import { Input } from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';

const Schema = z.object({
  title: z.string().min(1, { message: 'This field is required' }),
  description: z.string().min(1, { message: 'This field is required' }),
  notes: z.string().min(1, { message: 'This field is required' }),
});

type FormSchemaType = z.infer<typeof Schema>;

interface CreateAssessmentFormProps {
  handleCreateSuccess: () => void;
  playerId: string;
}

const CreateAssessmentForm = ({
  handleCreateSuccess,
  playerId,
}: CreateAssessmentFormProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  const createAssessment = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        playerId,
        title: data.title,
        description: data.description,
        notes: data.notes,
      };

      return apiClient.assessment.createAssessment({
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Assessment created successfuly');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Assessment could not be updated. ${e.body.message}`);
      },
    },
  );

  const handleCreateKeyEventFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => createAssessment.mutate(data);

  return (
    <form onSubmit={handleSubmit(handleCreateKeyEventFormSubmit)}>
      <div className='p-4'>
        <Input
          dataCy='Title_input'
          label='Title'
          variant='dark'
          placeholder='Title'
          className='mb-6'
          {...register('title')}
          error={errors['title']?.message}
        />
        <Input
          dataCy='Description_input'
          label='Description'
          variant='dark'
          placeholder='Robert vs Rune match assessment.'
          className='mb-6'
          {...register('description')}
          error={errors['description']?.message}
        />

        <Textarea
          dataCy='Notes_textarea'
          label='Notes'
          placeholder='Write text here ...'
          className='mb-6'
          {...register('notes')}
          error={errors['notes']?.message}
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
export default CreateAssessmentForm;
