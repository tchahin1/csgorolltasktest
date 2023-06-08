export const getDuration = (startDate: Date, endDate: Date) => {
  if (startDate && endDate) {
    if (startDate.getHours() === endDate.getHours())
      return endDate.getMinutes() - startDate.getMinutes();
    else {
      return (
        endDate.getHours() * 60 -
        startDate.getHours() * 60 -
        Math.abs(endDate.getMinutes() - startDate.getMinutes())
      );
    }
  }
  return 0;
};

export const getInitials = (name: string) => {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

  const initials = [...name.matchAll(rgx)] || [];

  return (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
};
