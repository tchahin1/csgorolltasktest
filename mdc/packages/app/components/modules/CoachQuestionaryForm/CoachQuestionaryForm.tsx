'use client';
import { ApiError } from '@ankora/api-client';
import { Button, Loader, Textarea, Radio } from '@ankora/ui-library';
import { Slider } from '@ankora/ui-library/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROLE } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { QUESTION_TYPE } from '../../../constants/tempPlayerOverview';
import { apiClient } from '../../../lib/apiClient';

const Schema = z.lazy(() =>
  z.union([
    z.string().min(1, { message: 'This field is required' }),
    z.boolean(),
    z.number(),
    z.record(Schema),
  ]),
);

type FormSchemaType = z.infer<typeof Schema>;

interface CreateAssessmentFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: Record<string, any>[];
  handleCreateSuccess: () => void;
  assessmentId: string;
}

const CoachQuestionaryForm = ({
  questions,
  handleCreateSuccess,
  assessmentId,
}: CreateAssessmentFormProps) => {
  const {
    handleSubmit,
    register,
    watch,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
    defaultValues: Object.assign(
      {},
      ...questions
        .filter(
          (question) =>
            (question.type === QUESTION_TYPE.RADIO ||
              question.type === QUESTION_TYPE.SLIDER) &&
            question.role === ROLE.COACH,
        )
        .map((question) => ({ [question.slug]: question.options[0].value })),
    ),
  });

  const coachFeedback = useMutation(
    (data: FormSchemaType) => {
      const answers = Object.keys(data).map((key) => ({
        questionSlug: key,
        answer: data[key],
      }));

      return apiClient.assessment.addCoachAnswers({
        id: assessmentId,
        requestBody: { answers },
      });
    },
    {
      onSuccess() {
        toast.success('Coach feedback added successfuly');
        handleCreateSuccess();
        reset();
      },
      onError(e: ApiError) {
        toast.error(`Coach feedback could not be updated. ${e.body.message}`);
      },
    },
  );

  const handleCoachQuestionaryFormSubmit: SubmitHandler<
    FormSchemaType
  > = async (data) => coachFeedback.mutate(data);

  // Not moving this function to helper since it uses
  // register from hook form

  const getCoachFormField = (
    type: QUESTION_TYPE,
    question: string,
    slug: string,
    options: { label: string; value: unknown }[] = [],
  ) => {
    switch (type) {
      case QUESTION_TYPE.RICH_TEXT:
        return (
          <Textarea
            label={question}
            placeholder='Write text here ...'
            className='mb-4'
            {...register(slug)}
            error={errors[slug]?.message as string}
          />
        );
      case QUESTION_TYPE.RADIO:
        return (
          <div>
            <p className='text-sm leading-5 font-medium text-white mb-3'>
              {question}
            </p>
            <Radio
              className='mb-2'
              {...register(slug)}
              options={options as { label: string; value: string }[]}
              value={watch(slug)}
            />
          </div>
        );
      case QUESTION_TYPE.SLIDER:
        return (
          <div className='mb-6'>
            <Slider
              options={options as { label: string; value: number }[]}
              label='How well did my player respect this pre-match goal?'
              {...register(slug)}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCoachQuestionaryFormSubmit)}>
      <div>
        {questions.map((questionary) => {
          const { role, slug, title, type, question, options } = questionary;

          return (
            role === ROLE.COACH && (
              <div key={slug}>
                {title && <p className='text-white mb-3'>{title}</p>}
                {getCoachFormField(
                  type as QUESTION_TYPE,
                  question,
                  slug,
                  options,
                )}
              </div>
            )
          );
        })}
        <div className='flex justify-end'>
          <Button
            className='mb-2 max-w-[190px]'
            dataCy='submit_button'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader size='sm' /> : <p>Schedule Debrief Call</p>}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default CoachQuestionaryForm;
