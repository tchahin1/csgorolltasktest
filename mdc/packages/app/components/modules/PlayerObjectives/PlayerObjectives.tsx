'use client';

import { ModalComponent, ObjectiveCard } from '@ankora/ui-library';
import { Objective } from '@prisma/client';
import dayjs from 'dayjs';
import { useState } from 'react';
import EditPlayerObjectiveForm from '../CreatePlayerObjectiveForm.tsx/EditPlayerObjectiveForm';
import AddPlayerObjective from './AddPlayerObjective';
import humanizeDuration from 'humanize-duration';

interface PlayerObjectivesProps {
  objectives?: Objective[];
  playerId: string;
}

export const PlayerObjectives = ({
  objectives = [],
  playerId,
}: PlayerObjectivesProps) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const handleClick = (id: string) => {
    setOpenDrawer(!openDrawer);
    setSelectedCard(id);
  };

  return (
    <div className='bg-gray-800 w-full p-4 rounded-lg mb-4'>
      <AddPlayerObjective playerId={playerId} />
      {objectives.length ? (
        <div className='flex gap-4 mt-3 flex-wrap'>
          {objectives.map((objective) => {
            const {
              id,
              title,
              description,
              practiceType,
              progress,
              endDate,
              startDate,
            } = objective;
            return (
              <ObjectiveCard
                id={id}
                key={title}
                title={title}
                duration={humanizeDuration(
                  parseInt(
                    dayjs(endDate).diff(startDate, 'ms', false).toString(),
                    10,
                  ),
                  { largest: 1 },
                )}
                description={description}
                practiceType={practiceType}
                progress={progress}
                endsAt={endDate}
                onClick={handleClick}
              />
            );
          })}
        </div>
      ) : (
        <div className='h-[80px] flex justify-center items-center'>
          <h2 className='text-gray-400 italic'>Objectives list is empty</h2>
        </div>
      )}
      {selectedCard && (
        <ModalComponent
          title='Edit objective'
          isVisible={openDrawer}
          onClose={() => setOpenDrawer(false)}
          variant='drawer'
        >
          <EditPlayerObjectiveForm
            handleCloseDrawer={() => setOpenDrawer(false)}
            objectiveId={selectedCard}
          />
        </ModalComponent>
      )}
    </div>
  );
};
