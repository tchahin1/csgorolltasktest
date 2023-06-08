import { KeyDateCard } from '@ankora/ui-library';
import AddKeyDates from './AddKeyDates';

interface KeyDatesProps {
  keyDates?: { title: string; startsAt: Date }[];
  playerId: string;
  dataCy?: string;
}

export const KeyDates = ({
  keyDates = [],
  playerId,
  dataCy,
}: KeyDatesProps) => {
  return (
    <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
      <AddKeyDates playerId={playerId} />
      {keyDates.length ? (
        <div className='flex gap-4 mt-3 flex-wrap'>
          {keyDates.map((keyDate) => (
            <KeyDateCard
              key={keyDate.title}
              title={keyDate.title}
              date={keyDate.startsAt}
              data-cy={dataCy}
            />
          ))}
        </div>
      ) : (
        <div className='h-[80px] flex justify-center items-center'>
          <h2 className='text-gray-400 italic'>Key Dates list is empty</h2>
        </div>
      )}
    </div>
  );
};
