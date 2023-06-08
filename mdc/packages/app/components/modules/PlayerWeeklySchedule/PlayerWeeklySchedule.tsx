'use client';

import { Appointment, Player } from '@ankora/models';
import {
  getMonday,
  ScheduleCard,
  WeekPicker,
  noEvents,
} from '@ankora/ui-library';
import { DayBox } from '@ankora/ui-library/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
interface PlayerWeeklyScheduleProps {
  player: Player;
  playerAppointments: Appointment[];
}

const PlayerWeeklySchedule = ({
  player,
  playerAppointments,
}: PlayerWeeklyScheduleProps) => {
  const today = dayjs();
  const isTodayWeekend = today.day() === 0 && today.day() === 6;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const [startDate, setStartDate] = useState(
    isTodayWeekend
      ? dayjs().add(1, 'weeks').set('day', 1)
      : dayjs().subtract(today.day() - 1, 'day'),
  );
  const [selectedDate, setSelectedDate] = useState(
    isTodayWeekend ? startDate : today,
  );

  const weekDays = useMemo(() => {
    return [...Array(5).keys()].map((day, index) => {
      const weekDate = startDate.add(index, 'days');
      return {
        label: weekDate.format('dddd'),
        day: weekDate.date(),
        onClick: () => setSelectedDate(weekDate),
        selected: selectedDate.isSame(weekDate),
        hideSeparator: index === 4,
      };
    });
  }, [selectedDate, startDate]);

  useEffect(() => {
    params.set('start-date', startDate.format('MM-DD-YYYY'));
    router.replace(`${pathname}?${params}`);
  }, [params, pathname, router, searchParams, startDate]);

  const handleNext = () => {
    setStartDate(startDate.add(1, 'weeks'));
    setSelectedDate(selectedDate.add(1, 'weeks'));
    params.set('start-date', startDate.add(1, 'weeks').format('MM-DD-YYYY'));
    router.replace(`${pathname}?${params}`);
  };

  const handlePrevious = () => {
    setStartDate(startDate.subtract(1, 'weeks'));
    setSelectedDate(selectedDate.subtract(1, 'weeks'));
    params.set(
      'start-date',
      startDate.subtract(1, 'weeks').format('MM-DD-YYYY'),
    );
    router.replace(`${pathname}?${params}`);
  };

  const events = useMemo(() => {
    return playerAppointments?.filter(
      (appointment) =>
        dayjs(appointment.startDate).format('DD MM YYYY') ===
        selectedDate.format('DD MM YYYY'),
    );
  }, [playerAppointments, selectedDate]);

  return (
    <div className='px-3 py-4 bg-gray-800 min-h-[350px] mb-6 rounded-lg'>
      <div className='flex flex-col md:flex-row justify-between mb-6'>
        <p className='text-white mb-4 md:mb-0'>Weekly schedule</p>
        <WeekPicker
          label={getMonday(selectedDate.toDate())}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
      <div className='border border-solid border-gray-700 rounded-lg min-h-[273px]'>
        <div className='min-h-[52px] w-full border-b border-b-solid border-gray-700 flex'>
          {weekDays.map((weekday) => {
            const { label, day, selected, onClick, hideSeparator } = weekday;
            return (
              <DayBox
                key={label}
                label={label}
                day={day}
                selected={selected}
                onClick={onClick}
                hideSeparator={hideSeparator}
              />
            );
          })}
        </div>
        <div className='px-3 py-6 flex  gap-4 overflow-x-auto'>
          {events?.length ? (
            events?.map((appointment) => (
              <ScheduleCard
                key={appointment.id}
                appointment={appointment}
                player={player}
              />
            ))
          ) : (
            <div className='w-full h-full flex flex-col justify-center items-center'>
              <div className='w-[155px] md:w-[180px] h-[155px] md:h-[180px] relative'>
                <Image
                  src={noEvents}
                  alt='There are no scheduled events on this day.'
                  fill
                />
              </div>
              <p className='text-gray-400 italic text-center break-keep'>
                There are no scheduled events on this day.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerWeeklySchedule;
