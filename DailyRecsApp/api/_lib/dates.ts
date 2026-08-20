const DAY_MS = 24 * 60 * 60 * 1000;

export function nextChargeDate(plan: 'monthly' | 'annual'): string {
  const days = plan === 'monthly' ? 30 : 365;
  return new Date(Date.now() + days * DAY_MS).toISOString();
}
