import { Button } from '@ankora/ui-library';
import Image from 'next/image';
import noPlans from '../../../assets/no-plans.svg';

interface EmptyPlansCollectionProps {
  onClick: () => void;
}

const EmptyPlansCollection = ({ onClick }: EmptyPlansCollectionProps) => {
  return (
    <div className='w-full h-[calc(100%_-_124px)] flex justify-center items-center'>
      <div className='flex flex-col items-center'>
        <Image src={noPlans} alt='No plans' className='mb-4' />
        <h2 className='text-white font-bold text-xl mb-1 leading-8'>
          No plans created.
        </h2>
        <p className='text-white text-xs mb-8 hidden lg:block'>
          Use the button below to create a plan.
        </p>
        <Button
          variant='primary'
          className='max-w-[130px] hidden lg:block'
          onClick={onClick}
          dataCy='Add_a_Plan-button'
        >
          Add a Plan
        </Button>
      </div>
    </div>
  );
};

export default EmptyPlansCollection;
