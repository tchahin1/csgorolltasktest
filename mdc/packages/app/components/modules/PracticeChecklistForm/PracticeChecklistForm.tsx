import {
  binIcon,
  Button,
  Loader,
  plusIcon,
  Textarea,
} from '@ankora/ui-library';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SubmitHandler,
  useFieldArray,
  useForm,
  Controller,
} from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Input } from '@ankora/ui-library/client';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import { toast } from 'react-toastify';
import { ApiError } from '@ankora/api-client';
import { Practice } from '@ankora/models';
import { v4 as uuid } from 'uuid';

const Schema = z.object({
  taskTitle: z.string().min(1, { message: 'This field is required' }),
  tasks: z
    .object({ value: z.string().min(1, { message: 'This field is required' }) })
    .array(),
});

type FormSchemaType = z.infer<typeof Schema>;

interface PracticeChecklistFormProps {
  handleCreateSuccess: () => void;
  initialFormData?: Partial<Practice>;
}

const PracticeChecklistForm = ({
  handleCreateSuccess,
  initialFormData,
}: PracticeChecklistFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: {
      taskTitle: initialFormData.questions
        ? initialFormData.questions[0]['title']
        : '',
      tasks: initialFormData.questions
        ? initialFormData.questions[0]['options'].map((option) => ({
            value: option,
            id: uuid(),
          }))
        : [{ value: '' }],
    },
  });

  const { fields, remove, insert } = useFieldArray({
    control,
    name: 'tasks',
  });

  const createPracticeChecklist = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        name: initialFormData.name,
        description: initialFormData.description,
        practiceType: initialFormData.practiceType,
        modality: initialFormData.modality,
        questions: {
          title: data.taskTitle,
          options: data.tasks.map((task) => task.value),
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

  const updatePracticeChecklist = useMutation(
    (data: FormSchemaType) => {
      const requestBody = {
        questions: {
          title: data.taskTitle,
          options: data.tasks.map((question) => question.value),
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

  const handlePracticeChecklistSubmit: SubmitHandler<FormSchemaType> = async (
    data,
  ) => {
    if (initialFormData.id) updatePracticeChecklist.mutate(data);
    else createPracticeChecklist.mutate(data);
  };

  const addNewTask = (index: number) => {
    insert(index, { value: '' });
  };

  const deleteTask = (index: number) => {
    remove(index);
  };

  return (
    <form
      onSubmit={handleSubmit(handlePracticeChecklistSubmit)}
      className='w-full items-center justify-center rounded-b-lg flex flex-col h-full mb-0'
    >
      <div className='mt-7 px-7 w-full h-full overflow-x-auto'>
        <Textarea
          label={'Task Title'}
          className='w-[85%] mb-8'
          {...register('taskTitle')}
          error={errors['taskTitle']?.message as string}
        />

        {fields.map((element, index) => {
          return (
            <div
              key={element.id}
              className='w-full flex flex-row items-end mb-8'
            >
              <Controller
                render={({ field }) => (
                  <Input
                    {...field}
                    variant='dark'
                    label={`Task ${index + 1}`}
                    className='w-[85%]'
                    error={errors?.tasks?.[index]?.value?.message}
                    shouldScaleOnFocus={false}
                  />
                )}
                defaultValue={element[index]?.value}
                name={`tasks.${index}.value`}
                control={control}
              />

              <Button
                className='max-w-[32px] h-[32px] hover:scale-110 hover:bg-primary-800'
                variant='plus'
                onClick={() => addNewTask(index + 1)}
              >
                <Image src={plusIcon} alt={'plus'} />
              </Button>

              {index !== 0 && (
                <Button
                  variant='delete'
                  onClick={() => deleteTask(index)}
                  className='max-w-[32px] h-[32px] hover:scale-110 hover:bg-red-900'
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

export default PracticeChecklistForm;
