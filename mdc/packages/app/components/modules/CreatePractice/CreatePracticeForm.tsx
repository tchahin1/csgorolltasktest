'use client';
import { Button, Loader, Textarea } from '@ankora/ui-library';
import { AutocompleteDropdown, Input } from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { MODALITY, PRACTICE_TYPE } from '@prisma/client';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { BuildPractice } from '../BuildPractice/BuildPractice';

const Schema = z.object({
  title: z.string().min(1, { message: 'This field is required' }),
  practice: z.string({ required_error: 'This field is required' }),
  description: z.string({ required_error: 'This field is required' }),
  modality: z.string({ required_error: 'This field is required' }),
});

type FormSchemaType = z.infer<typeof Schema>;

interface CreatePracticeFormProps {
  handleCreateSuccess: () => void;
}

const CreatePracticeForm = ({
  handleCreateSuccess,
}: CreatePracticeFormProps) => {
  const [modalityContent, setModalityContent] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  const handleCreatePracticeFormSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    setModalityContent({
      title: data.title,
      modality: data.modality,
      practice: data.practice,
      description: data.description,
    });
  };

  const handleSuccess = () => {
    setModalityContent(null);
    handleCreateSuccess();
  };
  return (
    <>
      <form onSubmit={handleSubmit(handleCreatePracticeFormSubmit)}>
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

          <AutocompleteDropdown
            dataCy='Practice_dropdown'
            items={[
              { label: 'Tennis', value: PRACTICE_TYPE.TENNIS },
              { label: 'Assessment', value: PRACTICE_TYPE.ASSESSMENT },
              { label: 'Fitness', value: PRACTICE_TYPE.FITNESS },
              { label: 'Mental', value: PRACTICE_TYPE.MENTAL },
              { label: 'Physio', value: PRACTICE_TYPE.PHYSIO },
            ]}
            {...register('practice')}
            value={watch('practice')}
            className='mb-6 mt-2'
            placeholder='Select type of practice'
            label='Practice'
            error={errors['practice']?.message}
            errorClassname='!bottom-[-27px]'
          />

          <Textarea
            dataCy='Textarea'
            label='Description'
            placeholder='Description'
            className='mb-6'
            {...register('description')}
          />

          <AutocompleteDropdown
            dataCy='Modality_dropdown'
            items={[
              { label: 'Video of Movements', value: MODALITY.VIDEO },
              { label: 'Questions', value: MODALITY.QUESTION },
              { label: 'Checklist', value: MODALITY.TODO },
            ]}
            {...register('modality')}
            value={watch('modality')}
            className='mb-6 mt-2'
            placeholder='Select type of practice'
            label='Modality'
            error={errors['modality']?.message}
            errorClassname='!bottom-[-27px]'
          />

          <Button
            className='mb-2'
            dataCy='Start_building-button'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader size='sm' /> : <p>Start building</p>}
          </Button>
        </div>
      </form>
      {modalityContent && (
        <BuildPractice
          initialValues={{
            name: modalityContent.title,
            description: modalityContent.description,
            practiceType: modalityContent.practice,
            modality: modalityContent.modality,
          }}
          handleCreateSuccess={handleSuccess}
          handleClose={() => setModalityContent(null)}
        />
      )}
    </>
  );
};

export default CreatePracticeForm;
