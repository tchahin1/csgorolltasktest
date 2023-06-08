/* eslint-disable no-constant-condition */
import { Appointment } from '@ankora/models';
import { getPracticeColoration } from '@ankora/ui-library';
import { EventTooltip, useWindowSize } from '@ankora/ui-library/client';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { EventWrapperProps } from 'react-big-calendar';
import { CalendarEvent } from '../../../types/event';

interface CalendarEventCardProps extends EventWrapperProps {
  event: CalendarEvent;
  handleEditAppointment: (event: Appointment) => void;
  handleDeleteAppointment: (event: Appointment) => void;
  isViewOnly?: boolean;
  dataCy?: string;
  onCardClick: () => void;
}

const CalendarEventCard = ({
  event,
  handleEditAppointment,
  handleDeleteAppointment,
  isViewOnly,
  dataCy,
  onCardClick,
  ...rest
}: CalendarEventCardProps) => {
  const { width } = useWindowSize();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };
  const handleCardClick = useCallback(() => {
    specifiedElement = document.getElementById(
      `tooltip-${event?.id?.replace(/-/g, '')}`,
    );
    onCardClick();
  }, [onCardClick]);

  // This condition is pointing on events that are between 1024 and 1492px, which were
  // overflowing their parent (which is calendar component and we cannot affect it)

  const durationMins = useMemo(
    () =>
      Math.abs(
        (dayjs(event.end).valueOf() - dayjs(event.start).valueOf()) / 60000,
      ),
    [event.end, event.start],
  );

  const edgeScreenSize = useMemo(() => {
    return !!(
      ((width < 1024 || width > 1492) && durationMins <= 30) ||
      durationMins > 30
    );
  }, [durationMins, width]);
  let specifiedElement = document.getElementById(
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
        top: `${parseFloat(rest.style?.top?.toString()).toFixed(2)}%`,
        height: `${parseFloat(rest.style?.height?.toString()).toFixed(2)}%`,
        width: `${parseFloat(rest.style?.width?.toString()).toFixed(2)}%`,
        position: 'absolute',
      }}
      className='p-2 cursor-pointer relative z-10 w-full max-w-[inherit]'
      onClick={handleCardClick}
    >
      <div
        id={`card-${event?.id?.replace(/-/g, '')}`}
        onClick={toggleTooltip}
        className='@container/event-wrapper'
      >
        <div
          className={classNames(
            `@container/event p-3 rounded-lg relative h-full border-2 ${getPracticeColoration(
              event.appointment ? event.practiceType : undefined,
            )}`,
            {
              'flex items-center gap-2': durationMins <= 30,
              'mt-2': !event.appointment,
            },
          )}
        >
          {edgeScreenSize && event.appointment && (
            <p
              className={`font-bold @[220px]/event:text-[15px] @[195px]/event:text-[15px] @[170px]/event:text-[14px] @[145px]/event:text-[13px] @[120px]/event:text-[12px] @[85px]/event:text-[11px] text-[10px]`}
            >
              {dayjs(event.start.toString()).format('hh:mm')} -{' '}
              {dayjs(event.end.toString()).format('hh:mm')}
            </p>
          )}
          <p
            className={classNames(
              `@[220px]/event:text-[15px] @[195px]/event:text-[15px] @[170px]/event:text-[14px] @[145px]/event:text-[13px] @[120px]/event:text-[12px] @[85px]/event:text-[11px] text-[10px]`,
              {
                '!w-[110px] line-clamp-1': durationMins <= 30,
              },
            )}
          >
            {renderEventTitle()}
          </p>
        </div>

        {event.appointment && (
          <EventTooltip
            isOpen={tooltipOpen && !!event.appointment}
            event={event.appointment}
            editable
            handleEditAppointment={handleEditAppointment}
            handleDeleteAppointment={handleDeleteAppointment}
            isViewOnly={isViewOnly}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarEventCard;
