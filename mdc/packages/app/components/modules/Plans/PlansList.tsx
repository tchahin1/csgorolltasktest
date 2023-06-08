import { Plan } from '@ankora/models';
import PlanCard from '../PlanCard/PlanCard';

interface PlansListProps {
  plans?: Plan[];
}

const PlansList = ({ plans }: PlansListProps) => {
  return plans.length ? (
    <div className='mt-6 flex gap-4 flex-wrap'>
      {plans.map((plan) => (
        <PlanCard key={plan.name} plan={plan} />
      ))}
    </div>
  ) : (
    <div className='h-[80px] flex justify-center items-center'>
      <h2 className='text-gray-400 italic'>Plans list is empty</h2>
    </div>
  );
};

export default PlansList;
