/* eslint-disable @typescript-eslint/no-explicit-any */
import { QUESTION_TYPE } from '../constants/tempPlayerOverview';

export const getAnswers = (
  type: QUESTION_TYPE,
  question: any,
  answer: string | boolean,
) => {
  switch (type) {
    case QUESTION_TYPE.RADIO:
      return (
        <div className='flex justify-between items-center mb-4'>
          <p className='text-gray-50 text-sm'>{question.question}</p>
          <p className='text-primary-500 text-sm'>
            {
              question?.options?.find((option) => option.value === answer)
                ?.label
            }
          </p>
        </div>
      );
    case QUESTION_TYPE.SLIDER:
      return (
        <div className='flex justify-between items-center mb-4'>
          <p className='text-gray-50 text-sm'>{question.question}</p>
          <p className='text-primary-500 text-sm'>{answer}%</p>
        </div>
      );
    case QUESTION_TYPE.RICH_TEXT:
      return (
        <div className='mb-4'>
          <p className='text-gray-50 font-medium text-sm mb-3 break-keep'>
            {question.question}
          </p>
          <p className='text-gray-200 text-sm font-normal break-keep'>
            {answer}
          </p>
        </div>
      );
  }
};
