const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 30, unit: 'day' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' }
];

export function relativeTime(
  time: Date | string | number,
  current: Date | string | number = Date.now()
): string {
  let elapsed = (new Date(time).getTime() - new Date(current).getTime()) / 1000;

  for (const division of divisions) {
    if (Math.abs(elapsed) < division.amount) {
      return formatter.format(Math.round(elapsed), division.unit);
    }

    elapsed /= division.amount;
  }

  return formatter.format(Math.round(elapsed), 'year');
}
