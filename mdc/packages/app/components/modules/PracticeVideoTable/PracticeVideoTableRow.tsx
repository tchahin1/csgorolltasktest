import {
  Checkbox,
  CheckboxVariants,
  dragIcon,
  RestCard,
  VideoPlayerVariants,
} from '@ankora/ui-library';
import {
  AutocompleteDropdown,
  Input,
  VideoPlayer,
} from '@ankora/ui-library/client';
import { Draggable } from '@hello-pangea/dnd';
import { EXERCISE_TYPE } from '@prisma/client';
import classNames from 'classnames';
import Image from 'next/image';
import { Control, Controller, FieldError, FieldValues } from 'react-hook-form';

interface PracticeVideoTableRowProps {
  url?: string;
  title?: string;
  type: EXERCISE_TYPE;
  index: number;
  id: string;
  onSelectStateChange: (id: string, state: boolean) => void;
  isSelected: boolean;
  control: Control<FieldValues, null>;
  errors: FieldError;
}
const PracticeVideoTableRow = ({
  url,
  title,
  type,
  index,
  id,
  onSelectStateChange,
  isSelected,
  control,
  errors,
}: PracticeVideoTableRowProps) => {
  return (
    <Draggable draggableId={`video_table_row_${id}_${index}`} index={index}>
      {(draggableProvided) => (
        <div
          {...draggableProvided.dragHandleProps}
          {...draggableProvided.draggableProps}
          ref={draggableProvided.innerRef}
        >
          <div className='flex flex-row border-b border-gray-600 py-2 items-center px-3'>
            <Checkbox
              styles='w-min flex items-center px-4'
              variant={CheckboxVariants.Dark}
              onChange={() => onSelectStateChange(id, !isSelected)}
              checked={isSelected}
            />
            <div className='w-[50%]'>
              {type === EXERCISE_TYPE.EXERCISE ? (
                <VideoPlayer
                  url={url}
                  variant={VideoPlayerVariants.Small}
                  title={title}
                />
              ) : (
                <RestCard />
              )}
            </div>
            <div className='w-[10%]'>
              <Controller
                render={({ field }) => (
                  <Input
                    {...field}
                    type='number'
                    variant='video'
                    placeholder='3'
                    className={classNames('mr-8 w-[40px]', {
                      hidden: type === 'REST',
                    })}
                    error={errors?.['reps']?.message}
                  />
                )}
                name={`exercises.${index}.reps`}
                control={control}
              />
            </div>

            <div className='w-[20%] items-start'>
              <Controller
                render={({ field }) => (
                  <AutocompleteDropdown
                    {...field}
                    items={dropdownSecsItems}
                    className='bg-gray-700 text-sm max-w-[90%]'
                    name={`dropdown_${id}`}
                    disableAutocomplete
                    removeAvatar
                    placeholder='90 sec'
                    error={errors?.['duration']?.message}
                    errorClassname='bottom-[-27px]'
                  />
                )}
                name={`exercises.${index}.duration`}
                control={control}
              />
            </div>
            <div className=' flex-1 flex justify-end'>
              <div className='bg-gray-700 w-max h-max px-2 py-2 rounded-lg'>
                <Image src={dragIcon} alt='drag' />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const dropdownSecsItems = [
  { label: '30 sec', value: '30' },
  { label: '90 sec', value: '90' },
  { label: '120 sec', value: '120' },
  { label: '180 sec', value: '180' },
];

export default PracticeVideoTableRow;
