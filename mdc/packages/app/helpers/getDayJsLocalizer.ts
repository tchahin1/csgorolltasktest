/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { DateLocalizer } from 'react-big-calendar';

const weekRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'MMMM DD', culture) +
  ' – ' +
  local.format(end, local.eq(start, end, 'month') ? 'DD' : 'MMMM DD', culture);

const dateRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'L', culture) + ' – ' + local.format(end, 'L', culture);

const timeRangeFormat = ({ start, end }, culture, local) =>
  local.format(start, 'hh:mm', culture) +
  ' – ' +
  local.format(end, 'hh:mm', culture);

const timeRangeStartFormat = ({ start }, culture, local) =>
  local.format(start, 'hh:mm', culture) + ' – ';

const timeRangeEndFormat = ({ end }, culture, local) =>
  ' – ' + local.format(end, 'hh:mm', culture);

export const formats = {
  dateFormat: 'DD',
  dayFormat: 'DD ddd',
  weekdayFormat: 'ddd',

  selectRangeFormat: timeRangeFormat,
  eventTimeRangeFormat: timeRangeFormat,
  eventTimeRangeStartFormat: timeRangeStartFormat,
  eventTimeRangeEndFormat: timeRangeEndFormat,

  timeGutterFormat: 'hh:mm',

  monthHeaderFormat: 'MMMM YYYY',
  dayHeaderFormat: 'dddd MMM DD',
  dayRangeHeaderFormat: weekRangeFormat,
  agendaHeaderFormat: dateRangeFormat,

  agendaDateFormat: 'ddd MMM DD',
  agendaTimeFormat: 'hh:mm',
  agendaTimeRangeFormat: timeRangeFormat,
};

export const getDayjsLocalizer = () => {
  const locale = (m, c) => (c ? m.locale(c) : m);

  function firstOfWeek() {
    return 1;
  }

  return new DateLocalizer({
    formats,
    firstOfWeek,
    format(value, format, culture) {
      return locale(dayjs(value), culture).format(format);
    },
  } as any);
};
