import { Plan } from '@ankora/models';
import { Avatars, Separator } from '@ankora/ui-library';
import { useMemo } from 'react';

interface PlanCardProps {
  plan?: Plan;
}

const getInitials = function (string) {
  const names = string.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

const PlanCard = ({ plan }: PlanCardProps) => {
  const avatars: { fullName: string; imageUrl: string }[] = useMemo(
    () =>
      plan?.playerPlans?.map((el) => {
        const initials = getInitials(el.player.user.fullName);
        return {
          fullName: initials,
          imageUrl: el.player.user.profileImage,
        };
      }),
    [plan],
  );

  return (
    <div className='max-w-[325px] w-full border rounded-lg border-solid border-gray-600 h-[160px]'>
      <p className='text-white text-sm bg-gray-900 px-3 py-2 rounded-t-lg'>
        {plan.name}
      </p>
      <div className='p-3'>
        <p className='text-white text-xs mb-2'>
          {plan.playerPlans?.length ? 'Assigned:' : 'Not assigned'}
        </p>
        <Avatars avatars={avatars} limit={3} />
      </div>
      <Separator variant='dark' className='my-0' />
      <p className='p-4 text-xs text-white'>
        <strong>Duration:</strong> {plan.weeklyPlans.length}{' '}
        {plan.weeklyPlans.length > 1 ? 'weeks' : 'week'}
      </p>
    </div>
  );
};

export default PlanCard;
