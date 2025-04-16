
export const formatPrice = (amount: number) => {
  return `€ ${amount.toLocaleString('de-DE').replace(',', '.')}`;
};
