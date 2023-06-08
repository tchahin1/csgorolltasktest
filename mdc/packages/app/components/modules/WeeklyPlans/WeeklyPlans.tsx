import { Practice } from '@ankora/models';
import { Button } from '@ankora/ui-library';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { Control, FieldError, useFieldArray } from 'react-hook-form';
import { FormSchemaType } from './types';
import WeeklyPlan from './WeeklyPlan';

interface WeeklyPlansProps {
  control: Control<FormSchemaType, null>;
  errors: FieldError;
  allPractices: Practice[];
}

type WeeklyPlansHandle = {
  addPractice: (week: number, day: number, practiceId: string) => void;
};
const WeeklyPlans = forwardRef<WeeklyPlansHandle, WeeklyPlansProps>(
  ({ control, allPractices }: WeeklyPlansProps, ref) => {
    const {
      fields: weeks,
      append,
      remove,
      update,
    } = useFieldArray<FormSchemaType, 'weeklyPlans'>({
      control,
      name: 'weeklyPlans',
    });

    useImperativeHandle(ref, () => ({
      addPractice(week: number, day: number, practiceId: string) {
        update(week - 1, {
          ...weeks[week - 1],
          dailyPlanPractices: [
            ...weeks[week - 1].dailyPlanPractices,
            {
              day,
              ...allPractices.find((practice) => practice.id === practiceId),
            },
          ],
        });
      },
    }));

    const handleAddWeek = useCallback(() => {
      append({ order: weeks.length + 1, dailyPlanPractices: [] });
    }, [append, weeks]);

    const handleCopyWeek = (index: number) => {
      append({ ...weeks[index], order: weeks.length + 1 });
    };

    const handleDeleteWeek = (index: number) => {
      remove(index);
    };

    const handleDeletePractice = (
      week: number,
      day: number,
      practiceIndex: number,
    ) => {
      const selectedDayPractices = weeks[week - 1].dailyPlanPractices.filter(
        (practice) => practice.day === day,
      );
      selectedDayPractices.splice(practiceIndex, 1);

      const restPractices = weeks[week - 1].dailyPlanPractices.filter(
        (practice) => practice.day !== day,
      );

      update(week - 1, {
        ...weeks[week - 1],
        dailyPlanPractices: [...restPractices, ...selectedDayPractices],
      });
    };

    return (
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-white'>WEEKLY PLAN</h2>
          <Button
            dataCy='Add_week-button'
            onClick={handleAddWeek}
            className='!py-2 !px-3 rounded-lg !w-auto'
          >
            <p className='text-xs font-medium'>Add week</p>
          </Button>
        </div>
        {weeks.length &&
          weeks.map((week, index) => (
            <WeeklyPlan
              key={week.order}
              weekNum={week.order}
              onCopy={() => handleCopyWeek(index)}
              onDelete={() => handleDeleteWeek(index)}
              practices={
                week.dailyPlanPractices as (Practice & { day: number })[]
              }
              onDeletePractice={handleDeletePractice}
              isDeleteDisabled={weeks.length === 1 && index === 0}
              weekIndex={index}
            />
          ))}
      </div>
    );
  },
);
export default WeeklyPlans;
