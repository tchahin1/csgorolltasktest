import { binIcon, checklist, questions, video } from '@ankora/ui-library';
import { Draggable } from '@hello-pangea/dnd';
import { MODALITY } from '@prisma/client';
import Image from 'next/image';

interface WeeklyPlanRowProps {
  name?: string;
  index: number;
  id: string;
  modality?: MODALITY;
  onDelete: (practiceIndex: number) => void;
  dataCy?: string;
}
const WeeklyPlanRow = ({
  index,
  id,
  name,
  modality,
  onDelete,
  dataCy,
}: WeeklyPlanRowProps) => {
  const renderModalityPracticeImage = () => {
    switch (modality) {
      case MODALITY.VIDEO:
        return video;
      case MODALITY.QUESTION:
        return questions;
      case MODALITY.TODO:
        return checklist;
    }
  };
  return (
    <Draggable draggableId={`video_table_row_${id}_${index}`} index={index}>
      {(draggableProvided) => (
        <div
          {...draggableProvided.dragHandleProps}
          {...draggableProvided.draggableProps}
          ref={draggableProvided.innerRef}
          data-cy={dataCy}
        >
          <div className='flex justify-between py-3 pr-3'>
            <div className='flex w-full items-center gap-3'>
              <div className='w-[94px] h-[69px] bg-gray-800 rounded-lg flex justify-center items-center'>
                <Image
                  src={renderModalityPracticeImage()}
                  alt={name}
                  width={24}
                  height={24}
                />
              </div>
              <p className='text-white text-sm'>{name}</p>
            </div>
            <Image
              data-cy='Delete_plan-button'
              src={binIcon}
              alt='bin'
              className='cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(index);
              }}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default WeeklyPlanRow;
