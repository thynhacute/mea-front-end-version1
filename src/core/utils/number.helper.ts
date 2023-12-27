export const formatNumber = (value: number | string) => {
  return Number(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
