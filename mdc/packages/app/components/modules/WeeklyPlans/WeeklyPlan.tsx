import { Practice } from '@ankora/models';
import {
  arrowDown,
  binIcon,
  Button,
  copyIcon,
  Separator,
  uploadIcon,
} from '@ankora/ui-library';
import { WeeklyDayBox } from '@ankora/ui-library/client';
import { Droppable, DroppableStateSnapshot } from '@hello-pangea/dnd';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import Collapsible from 'react-collapsible';
import WeeklyPlanRow from './WeeklyPlanRow';

interface WeeklyPlanProps {
  onDelete: () => void;
  onCopy: () => void;
  weekNum: number;
  practices: (Practice & { day: number })[];
  onDeletePractice: (week: number, day: number, practiceIndex: number) => void;
  isDeleteDisabled?: boolean;
  weekIndex: number;
}

const WeeklyPlan = ({
  onDelete,
  onCopy,
  weekNum,
  practices = [],
  onDeletePractice,
  isDeleteDisabled,
  weekIndex,
}: WeeklyPlanProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const getTableHeight = useCallback(
    (droppableSnapshot: DroppableStateSnapshot) => {
      let heightOfTable = practices ? practices.length * 90 : 90;

      if (
        droppableSnapshot.draggingOverWith &&
        !droppableSnapshot.draggingOverWith.includes('video_table_row')
      )
        heightOfTable += 150;

      return heightOfTable;
    },
    [practices],
  );

  const [selectedDay, setSelectedDay] = useState(0);

  const selectedDayPractices = useMemo(
    () => practices.filter((practice) => practice.day === selectedDay),
    [practices, selectedDay],
  );

  const weekDays = useMemo(() => {
    return [...Array(7).keys()].map((index) => {
      return {
        label: `Day ${index + 1}`,
        onClick: () => setSelectedDay(index),
        selected: selectedDay === index,
      };
    });
  }, [selectedDay]);

  return (
    <Collapsible
      transitionTime={100}
      trigger={
        <div
          className='w-full py-2 px-3 flex flex-row items-center justify-between bg-gray-800 border-b border-gray-600'
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className='text-sm text-white font-medium'>WEEK {weekIndex + 1}</p>
          <div className='flex flex-row w-max items-center gap-5'>
            <Button
              dataCy='Delete_week-button'
              variant='empty'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleteDisabled}
            >
              <Image src={binIcon} alt='bin' className='h-5 w-5' />
            </Button>
            <Button
              dataCy='Copy_week-button'
              variant='empty'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopy();
              }}
            >
              <Image src={copyIcon} alt='copy' className='h-5 w-5' />
            </Button>
            <Image src={arrowDown} alt='arrow_down' data-cy='arrow_down' />
          </div>
        </div>
      }
      open={isOpen}
    >
      <div className='bg-gray-800 rounded-md'>
        <div className='min-h-[52px] w-full flex bg-gray-800'>
          {weekDays.map((weekday, index) => {
            const { label, selected, onClick } = weekday;
            return (
              <WeeklyDayBox
                dataCy={label}
                key={label}
                label={label}
                selected={selected}
                onClick={onClick}
                hideSeparator={index === 6}
              />
            );
          })}
        </div>
      </div>
      {isOpen && (
        <Droppable droppableId={`practice_table_${weekNum}_${selectedDay}`}>
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
                {!selectedDayPractices.length && (
                  <div className='w-full h-[228px] bg-gray-700 my-4 border-2 border-gray-600 border-dashed rounded-lg justify-center items-center flex flex-col'>
                    <Image
                      data-cy='upload'
                      src={uploadIcon}
                      alt='upload'
                      className='mb-2'
                    />
                    <p className='text-sm text-gray-400 font-semibold'>
                      Drag and Drop practice here
                    </p>
                  </div>
                )}
                {selectedDayPractices?.map((element, index) => {
                  return (
                    <>
                      <WeeklyPlanRow
                        dataCy={element.name}
                        key={element.id}
                        id={element.id}
                        name={element.name}
                        index={index}
                        modality={element.modality}
                        onDelete={(practiceIndex: number) =>
                          onDeletePractice(weekNum, selectedDay, practiceIndex)
                        }
                      />
                      <Separator variant='dark' className='m-0' />
                    </>
                  );
                })}
              </div>
            );
          }}
        </Droppable>
      )}
    </Collapsible>
  );
};

export default WeeklyPlan;
