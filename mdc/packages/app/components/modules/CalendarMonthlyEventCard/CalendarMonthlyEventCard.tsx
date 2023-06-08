/* eslint-disable no-constant-condition */
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { EventWrapperProps } from 'react-big-calendar';
import { CalendarEvent } from '../../../types/event';

interface CalendarMonthlyEventCardProps extends EventWrapperProps {
  event: CalendarEvent;
  dataCy?: string;
}

const CalendarMonthlyEventCard = ({
  event,
  dataCy,
}: CalendarMonthlyEventCardProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const specifiedElement = document.getElementById(
    `card-${event?.id?.replace(/-/g, '')}`,
  );

  document.addEventListener('click', function (event) {
    if (specifiedElement) {
      const isClickedInside =
        specifiedElement.contains(event.target as Node) ||
        specifiedElement === event.target;
      setTooltipOpen(isClickedInside);
    }
  });

  const renderEventTitle = useCallback(() => {
    if (!event.appointment) return event.title;
    if (event?.teamName) {
      return `${event?.coachNames.join(' & ')} & ${event?.teamName}`;
    } else {
      return `${event?.coachNames.join(' & ')} 
        & 
        ${event?.playerNames.join(' & ')}`;
    }
  }, [
    event.appointment,
    event?.coachNames,
    event?.playerNames,
    event?.teamName,
    event.title,
  ]);

  return (
    <div
      data-cy={dataCy}
      id={`card-${event.id.replace(/-/g, '')}`}
      key={event.id}
      // Using style here since tailwind does not support passing props dynamically
      style={{
        width: `165px`,
      }}
      className='px-2 py-1 cursor-pointer relative z-10 w-full max-w-[inherit]'
    >
      <div
        style={{ width: '165px' }}
        id={`card-${event?.id?.replace(/-/g, '')}`}
        onClick={toggleTooltip}
      >
        {event.appointment ? (
          <p className='text-xs text-white break-keep'>
            {dayjs(event.start.toString()).format('hh:mm')} {renderEventTitle()}
          </p>
        ) : (
          <p className='text-xs text-white flex flex-row items-center break-keep'>
            <div className='w-2 h-2 bg-primary-600 rounded-full mr-1'></div>
            {renderEventTitle()}
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarMonthlyEventCard;
