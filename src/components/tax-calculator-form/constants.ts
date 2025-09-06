export const last10Years = Array.from({ length: 9 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return `${year - 1}-${year}`;
});
