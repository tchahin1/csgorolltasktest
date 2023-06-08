'use client';

import { Appointment } from '@ankora/models';
import { getFirstName, ModalComponent } from '@ankora/ui-library';
import {
  CalendarToolbar,
  TooltipContent,
  TooltipOverlay,
  useWindowSize,
} from '@ankora/ui-library/client';
import { ROLE } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, EventWrapperProps, View } from 'react-big-calendar';
import { toast } from 'react-toastify';
import { maxDate, minDate } from '../../../constants/calendarHours';
import { getDayjsLocalizer } from '../../../helpers/getDayJsLocalizer';
import { useAuth } from '../../../hooks/providers';
import { apiClient } from '../../../lib/apiClient';
import NoSsr from '../../wrappers/NoSsr';
import CalendarEventCard from '../CalendarEventCard/CalendarEventCard';
import CalendarMonthlyEventCard from '../CalendarMonthlyEventCard/CalendarMonthlyEventCard';
import CreateEventForm from '../CreateEventForm/CreateEventForm';
import { CalendarEvent } from '../../../types/event';

const CalendarComponent = () => {
  const { user } = useAuth();
  const { width } = useWindowSize();
  const localizer = getDayjsLocalizer();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [eventSelected, setEventSelected] = useState<CalendarEvent>(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [openTab, setOpenTab] = useState<number>(0);
  const [filters, setFilters] = useState({
    players: [],
    courts: [],
    coaches: [],
  });

  const [calendarView, setCalendarView] = useState<View>(
    width < 1024 ? 'day' : 'month',
  );

  const [date, setDate] = useState(
    calendarView === 'week'
      ? {
          from: dayjs().subtract(dayjs().day(), 'days').set('hour', 0),
          to: dayjs()
            .add(5 - dayjs().day(), 'days')
            .set('hour', 24),
        }
      : {
          from: dayjs().set('date', 1).set('hour', 0),
          to: dayjs().set('date', 31).set('hour', 24),
        },
  );

  const { data: events, refetch: refetchAppointments } = useQuery(
    ['appointment', date.from],
    () => {
      return apiClient.appointment.get({
        from: date.from.toISOString(),
        to: date.to.toISOString(),
        playerIds: filters.players,
        courtIds: filters.courts,
        coachIds: filters.coaches,
      });
    },
  );

  const { data: practices } = useQuery(
    ['practices', filters.players],
    () => {
      return apiClient.practice.getPlayerPracticesForCoach({
        playerId: filters.players[0],
      });
    },
    {
      enabled: filters.players.length === 1,
    },
  );

  const { data: players } = useQuery(['player'], () =>
    apiClient.player.getAllPlayersByOrganization(),
  );

  const { data: courts } = useQuery(['court', date.from, date.to], () =>
    apiClient.court.getAllCourtsForOrganization({
      order: 'asc',
    }),
  );

  const { data: coaches } = useQuery(['coach'], () =>
    apiClient.coach.getAllCoachesForOrganization(),
  );

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const appointmentEvents: CalendarEvent[] =
      events?.data?.map((event) => ({
        ...event,
        start: dayjs(event.startDate).toDate(),
        end: dayjs(event.endDate).toDate(),
        practiceType: event.practice,
        appointment: event as unknown as Appointment,
        playerNames: event.playerAppointments.map(({ player }) =>
          getFirstName(player.user.fullName),
        ),
        coachNames: event.coachAppointments.map(({ coach }) =>
          getFirstName(coach.user.fullName),
        ),
        teamName: event.team?.name,
      })) || [];

    const practiceEvents: CalendarEvent[] = [];

    practices?.data?.forEach((event) => {
      event.practicePlayer.forEach((practicePlayer) => {
        practiceEvents.push({
          ...event,
          title: event.name,
          coachNames: [],
          playerNames: [],
          start: dayjs(practicePlayer.date).toDate(),
          end: dayjs(practicePlayer.date).toDate(),
          allDay: true,
        });
      });
    });

    return [...appointmentEvents, ...practiceEvents];
  }, [events?.data, practices?.data]);

  const handleNewEvent = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  const handleOnAppointmentModalClose = useCallback(() => {
    setOpenDrawer(false);
    setAppointmentToEdit(null);
  }, []);

  const handleCreateAppointmentSuccess = useCallback(() => {
    handleNewEvent();
    refetchAppointments();
    setAppointmentToEdit(null);
  }, [handleNewEvent, refetchAppointments]);

  const deleteAppointment = useMutation((id: string) =>
    apiClient.appointment.delete({ id }),
  );

  const handleDeleteAppointment = (event: Appointment) => {
    deleteAppointment.mutate(event?.id, {
      onSuccess: () => {
        toast.success('Practice deleted successfully');
        refetchAppointments();
      },
      onError: () => toast.error('Something went wrong'),
    });
  };

  const handleEditAppointment = useCallback(
    (event: Appointment) => {
      setOpenDrawer(!openDrawer);
      setAppointmentToEdit({
        id: event.id,
        title: event.title,
        practice: event.practice,
        date: new Date(event.startDate),
        startTime: new Date(event.startDate),
        endTime: new Date(event.endDate),
        court: event.court?.id,
        team: event.team?.id,
        players: event.playerAppointments.map(
          (playerAppointment) => playerAppointment.playerId,
        ),
        objectives: event.objectives,
        teamOrPlayers: event.team ? 'team' : 'players',
        coachIds: event.coachAppointments.map(
          (coachAppointment) => coachAppointment.coachId,
        ),
      });
    },
    [openDrawer],
  );

  const handleCalendarViewChange = useCallback((view: View) => {
    setCalendarView(view);
  }, []);

  const renderEventTitle = useCallback(() => {
    if (eventSelected?.teamName) {
      return `${eventSelected?.coachNames.join(' & ')} & ${
        eventSelected?.teamName
      }`;
    } else {
      return `${eventSelected?.coachNames.join(' & ')} 
        & 
        ${eventSelected?.playerNames.join(' & ')}`;
    }
  }, [
    eventSelected?.coachNames,
    eventSelected?.playerNames,
    eventSelected?.teamName,
  ]);

  useEffect(() => {
    refetchAppointments();
  }, [filters, refetchAppointments]);

  useEffect(() => {
    setCalendarView(width < 1024 ? 'day' : 'month');
  }, [width]);

  return (
    <NoSsr>
      <div className='relative'>
        <Calendar
          defaultDate={dayjs().toDate()}
          view={calendarView}
          onView={() => null}
          events={calendarEvents}
          localizer={localizer}
          step={15}
          className='bg-gray-800'
          min={minDate()}
          max={maxDate()}
          rtl={false}
          components={{
            eventWrapper: (props: EventWrapperProps<CalendarEvent>) =>
              calendarView === 'month' ? (
                <CalendarMonthlyEventCard
                  {...props}
                  dataCy='Event_card'
                  event={props.event}
                />
              ) : (
                <CalendarEventCard
                  onCardClick={() => setEventSelected(props.event)}
                  {...props}
                  dataCy='Event_card'
                  event={props.event}
                  handleDeleteAppointment={handleDeleteAppointment}
                  handleEditAppointment={handleEditAppointment}
                  isViewOnly={
                    !(user.role === ROLE.SUPER_COACH) &&
                    !props.event.appointment?.coachAppointments.find(
                      ({ coach: { userId } }) => userId === user.id,
                    )
                  }
                />
              ),
            toolbar: (props) => (
              <CalendarToolbar
                handleNewEvent={handleNewEvent}
                setDate={setDate}
                setFilters={(filters) => {
                  setFilters(filters);
                }}
                filters={filters}
                setOpenTab={setOpenTab}
                openTab={openTab}
                calendarView={calendarView}
                handleCalendarViewChange={handleCalendarViewChange}
                width={width}
                items={{
                  players: players?.data.map((player) => {
                    return {
                      label: player.user.fullName,
                      info: player.user.email,
                      value: player.id,
                      image: player.user.profileImage,
                    };
                  }),
                  courts: courts?.data.map((court) => {
                    return { label: court.name, value: court.id };
                  }),
                  coaches: coaches?.data.map((coach) => {
                    return {
                      label: coach.user.fullName,
                      value: coach.id,
                      info: coach.user.email,
                      image: coach.user.profileImage,
                    };
                  }),
                }}
                {...props}
              />
            ),
          }}
        />

        <TooltipOverlay
          isVisible={!!eventSelected}
          title={renderEventTitle()}
          onClose={() => setEventSelected(null)}
          handleEditAppointment={handleEditAppointment}
          event={eventSelected?.appointment}
        >
          <TooltipContent
            title={renderEventTitle()}
            event={eventSelected?.appointment}
            handleDeleteAppointment={handleDeleteAppointment}
            handleEditAppointment={handleEditAppointment}
          />
        </TooltipOverlay>

        <ModalComponent
          isVisible={openDrawer}
          title={appointmentToEdit ? 'Update event' : 'New event'}
          onClose={handleOnAppointmentModalClose}
          variant='drawer'
        >
          {openDrawer && (
            <CreateEventForm
              handleCreateSuccess={handleCreateAppointmentSuccess}
              initialValues={appointmentToEdit}
              id={appointmentToEdit?.id}
              role={user.role}
            />
          )}
        </ModalComponent>
      </div>
    </NoSsr>
  );
};

export default CalendarComponent;
