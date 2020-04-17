// Like this: "03.04.2020"
export function shortDateFilter(value: Date | null): string {
  if (!value) return '';

  const hours = value.getHours() > 9 ? `${value.getHours()}` : `0${value.getHours()}`;
  const minutes = value.getMinutes() > 9 ? `${value.getMinutes()}` : `0${value.getMinutes()}`;
  const day = value.getDate() > 9 ? `${value.getDate()}` : `0${value.getDate()}`;
  const month = value.getMonth() + 1 > 9 ? `${value.getMonth()}` : `0${value.getMonth()}`;
  const year = `${value.getFullYear()}`;
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

// Like this: "12h 30min"
export function lettersTimeFilter(value: number): string {
  const hours = Math.floor(value / 60*60*1000);
  const minutes = Math.floor(value / 60*1000 - hours*60);
  return `${hours}h ${minutes}min`;
}