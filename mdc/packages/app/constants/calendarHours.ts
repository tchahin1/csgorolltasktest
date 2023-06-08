export const minDate = () => {
  const start = new Date();
  start.setHours(7, 0, 0);
  return start;
};

export const maxDate = () => {
  const end = new Date();
  end.setHours(22, 0, 0);
  return end;
};
