import PracticeVideoTableRow from './PracticeVideoTableRow';
import { binIcon, Button, copyIcon, uploadIcon } from '@ankora/ui-library';
import Image from 'next/image';
import classNames from 'classnames';
import { Droppable, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { useCallback } from 'react';
import { Control, FieldError, FieldValues } from 'react-hook-form';
import { DnDItem } from '../../../types/dnd';

interface PracticeVideoTableProps {
  practiceExercises: DnDItem[];
  selectedPracticesIds: string[];
  setSelectedPracticesIds: (itemId: string, itemState: boolean) => void;
  onDelete: () => void;
  onCopy: () => void;
  onAddRest: () => void;
  control: Control<FieldValues, null>;
  errors: FieldError[];
}
const PracticeVideoTable = ({
  practiceExercises,
  selectedPracticesIds,
  setSelectedPracticesIds,
  onAddRest,
  onCopy,
  onDelete,
  control,
  errors,
}: PracticeVideoTableProps) => {
  const getTableHeight = useCallback(
    (droppableSnapshot: DroppableStateSnapshot) => {
      let heightOfTable = practiceExercises
        ? practiceExercises.length * 90
        : 90;

      // In case we are dragging video from video
      // collection we need to make this div bigger
      // Those draggables do not have video_table_row in their ids
      if (
        droppableSnapshot.draggingOverWith &&
        !droppableSnapshot.draggingOverWith.includes('video_table_row')
      )
        heightOfTable += 150;

      return heightOfTable;
    },
    [practiceExercises],
  );

  return (
    <div>
      <div
        className={classNames('bg-gray-700  ', {
          'rounded-t-lg': practiceExercises,
          'rounded-lg': !practiceExercises,
        })}
      >
        <div className='w-full py-2 px-3 border-b border-gray-600 flex flex-row items-center justify-between'>
          <p className=' text-sm text-white font-medium'>Exercises</p>
          <div className='flex flex-row w-max items-center gap-5'>
            <Button
              onClick={onAddRest}
              className='!py-2 !px-3 rounded-lg !w-auto'
            >
              <p className='text-xs font-medium'>Add rest</p>
            </Button>
            <Button
              variant='empty'
              onClick={onDelete}
              disabled={!selectedPracticesIds.length}
              className={!selectedPracticesIds.length && 'opacity-30'}
            >
              <Image src={binIcon} alt='bin' className='h-5 w-5' />
            </Button>
            <Button
              variant='empty'
              onClick={onCopy}
              disabled={!selectedPracticesIds.length}
              className={!selectedPracticesIds.length && 'opacity-30'}
            >
              <Image src={copyIcon} alt='copy' className='h-5 w-5' />
            </Button>
          </div>
        </div>
        <div
          className={classNames('py-4 px-3 w-full  flex flex-row', {
            'rounded-b-lg': !practiceExercises,
            'border-b border-gray-600': practiceExercises,
          })}
        >
          <div className='w-[72px] '></div>
          <p className='text-xs font-semibold text-gray-400 w-[50%] '>
            EXERCISE NAME
          </p>
          <p className='text-xs font-semibold text-gray-400 w-[10%] '>REPS</p>
          <p className='text-xs font-semibold text-gray-400 '>DURATION</p>
        </div>
      </div>
      <Droppable droppableId='video_table'>
        {(droppableProvided, droppableSnapshot) => {
          return (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              // Needed to use style because it's being calculated dynamically
              style={{
                height:
                  droppableSnapshot.isDraggingOver &&
                  getTableHeight(droppableSnapshot),
                minHeight: 228,
              }}
            >
              {!practiceExercises.length && (
                <div className='w-full h-[228px] bg-gray-700 my-4 border-2 border-gray-600 border-dashed rounded-lg justify-center items-center flex flex-col'>
                  <Image src={uploadIcon} alt='upload' className='mb-2' />
                  <p className='text-sm text-gray-400 font-semibold'>
                    Drag and Drop exercise here
                  </p>
                </div>
              )}
              {practiceExercises?.map((element, index) => {
                return (
                  <PracticeVideoTableRow
                    key={element.id}
                    id={element.id}
                    index={index}
                    url={element.exercise?.file?.url}
                    title={element.exercise?.name}
                    type={element.type}
                    onSelectStateChange={(itemId, itemState) =>
                      setSelectedPracticesIds(itemId, itemState)
                    }
                    isSelected={
                      selectedPracticesIds.findIndex(
                        (elem) => elem === element.id,
                      ) !== -1
                    }
                    control={control}
                    errors={errors?.[index]}
                  />
                );
              })}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
export default PracticeVideoTable;
