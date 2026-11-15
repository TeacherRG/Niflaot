/**
 * The alarms of «Часы» — what the whole site needs to know: is any of them on (the ringing code, src/core/alarm.ts with
 * the Jewish calendar, is loaded only then). `niflaot:alarm` — the alarm clock, `niflaot:alarm-study` — the alarm of
 * Torah study; both only on this device.
 */
export const ALARM_KEYS = { wake: 'niflaot:alarm', study: 'niflaot:alarm-study' } as const;
export const ALARM_EVENT = 'niflaot:alarm';

export function alarmIsOn(): boolean {
  return Object.values(ALARM_KEYS).some((key) => {
    try {
      return (JSON.parse(localStorage.getItem(key) ?? 'null') as { on?: boolean } | null)?.on === true;
    } catch {
      return false;
    }
  });
}
