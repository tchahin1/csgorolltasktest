import { ApiError } from '@ankora/api-client';
import { Practice } from '@ankora/models';
import {
  binIcon,
  Button,
  Loader,
  plusIcon,
  Textarea,
} from '@ankora/ui-library';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { apiClient } from '../../../lib/apiClient';

const Schema = z.object({
  questions: z
    .object({ value: z.string().min(1, { message: 'This field is required' }) })
    .array(),
});

type FormSchemaType = z.infer<typeof Schema>;

interface PracticeQuestionsFormProps {
  handleCreateSuccess: () => void;
  initialFormData?: Partial<Practice>;
}

const PracticeQuestionsForm = ({
  initialFormData,
  handleCreateSuccess,
}: PracticeQuestionsFormProps) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      questions: initialFormData.questions
        ? initialFormData.questions[0]['options'].map((option) => ({
            value: option,
            id: uuid(),
          }))
        : [{ value: '' }],
    },
  });
  const { fields, remove, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'questions', // unique name for your Field Array
  });

  const createPracticeQuestionary = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        name: initialFormData.name,
        description: initialFormData.description,
        practiceType: initialFormData.practiceType,
        modality: initialFormData.modality,
        questions: {
          options: data.questions.map((question) => question.value),
        },
      };

      return apiClient.practice.create({
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Practice created successfully');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Practice could not be updated. ${e.body.message}`);
      },
    },
  );

  const updatePracticeQuestionary = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        questions: {
          options: data.questions.map((question) => question.value),
        },
      };

      return apiClient.practice.updatePractice({
        id: initialFormData.id,
        requestBody,
      });
    },
    {
      onSuccess() {
        toast.success('Practice updated successfully');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Practice could not be updated. ${e.body.message}`);
      },
    },
  );

  const handlePracticeQuestionsSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    if (initialFormData.id) updatePracticeQuestionary.mutate(data);
    else createPracticeQuestionary.mutate(data);
  };

  const addNewQuestion = (index: number) => {
    insert(index, { value: '' });
  };

  const deleteQuestion = (index: number) => {
    remove(index);
  };

  return (
    <form
      onSubmit={handleSubmit(handlePracticeQuestionsSubmit)}
      className='w-full items-center justify-between rounded-b-lg flex flex-col h-full'
    >
      <div className='mt-8 px-7 w-full'>
        {fields.map((element, index) => {
          return (
            <div
              key={element.id}
              className='w-full flex flex-row items-end mb-8'
            >
              <Controller
                render={({ field }) => (
                  <Textarea
                    dataCy='Question-textarea'
                    {...field}
                    className='w-[85%]'
                    label={`${index + 1}. Question`}
                    error={errors?.questions?.[index]?.value?.message}
                  />
                )}
                defaultValue={element[index]?.value}
                name={`questions.${index}.value`}
                control={control}
              />

              <Button
                dataCy='Add_question-button'
                className='max-w-[32px] h-[32px] hover:scale-110 hover:bg-primary-800'
                variant='plus'
                onClick={() => addNewQuestion(index + 1)}
              >
                <Image src={plusIcon} alt={'plus'} />
              </Button>

              {index !== 0 && (
                <Button
                  dataCy='Delete-button'
                  variant='delete'
                  className='max-w-[32px] h-[32px] hover:scale-110 hover:bg-red-900'
                  onClick={() => deleteQuestion(index)}
                >
                  <Image src={binIcon} alt={'bin'} />
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <div className='flex w-full justify-end p-4 rounded-b-lg bg-gray-700'>
        <Button
          className='mb-2 max-w-[190px]'
          dataCy='Submit_button'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader size='sm' /> : <p>Save</p>}
        </Button>
      </div>
    </form>
  );
};

export default PracticeQuestionsForm;
