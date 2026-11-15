/**
 * The alarm of «Часы» — what the whole site needs to know: is it on (the ringing code, src/core/alarm.ts with the
 * Jewish calendar, is loaded only then). `niflaot:alarm` — only on this device.
 */
export const ALARM_KEY = 'niflaot:alarm';
export const ALARM_EVENT = 'niflaot:alarm';

export function alarmIsOn(): boolean {
  try {
    return (JSON.parse(localStorage.getItem(ALARM_KEY) ?? 'null') as { on?: boolean } | null)?.on === true;
  } catch {
    return false;
  }
}
