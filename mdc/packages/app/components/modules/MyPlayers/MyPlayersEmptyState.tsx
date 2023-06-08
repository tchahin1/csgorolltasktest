import { PlayerCardSkeleton } from '@ankora/ui-library';

const MyPlayersEmptyState = () => (
  <div className=' p-8'>
    <h1 className='text-gray-400 pb-4 text-lg italic'>
      You do not have players assigned yet
    </h1>
    <div className='w-fit grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <PlayerCardSkeleton />
      <PlayerCardSkeleton />
      <PlayerCardSkeleton />
    </div>
  </div>
);

export default MyPlayersEmptyState;
