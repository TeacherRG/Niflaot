/**
 * The user's place, guessed from the device time zone (no geolocation prompt): coordinates of the zone's city.
 * Used only for the Shabbat times (src/core/zmanim.ts). A zone not in the list → null (fixed hours are used).
 */
export interface Place {
  lat: number;
  lon: number;
  /** city name: English (Latin), and Russian / German where it differs */
  name: { en: string; ru: string; de?: string };
  /** minutes before sunset to light the candles (Jerusalem: 40) */
  candles?: number;
}

// [time zone, latitude, longitude, Russian name, German name if different from English]
const ZONES: [string, number, number, string, string?][] = [
  ['Asia/Jerusalem', 31.78, 35.22, 'Иерусалим'],
  ['Asia/Tel_Aviv', 32.08, 34.78, 'Тель-Авив'],
  ['Asia/Hebron', 31.53, 35.1, 'Хеврон'],
  ['Europe/Moscow', 55.76, 37.62, 'Москва', 'Moskau'],
  ['Europe/Kaliningrad', 54.71, 20.51, 'Калининград'],
  ['Europe/Samara', 53.2, 50.15, 'Самара'],
  ['Europe/Volgograd', 48.71, 44.51, 'Волгоград', 'Wolgograd'],
  ['Europe/Saratov', 51.53, 46.03, 'Саратов', 'Saratow'],
  ['Europe/Ulyanovsk', 54.32, 48.4, 'Ульяновск', 'Uljanowsk'],
  ['Europe/Astrakhan', 46.35, 48.04, 'Астрахань', 'Astrachan'],
  ['Europe/Kirov', 58.6, 49.66, 'Киров', 'Kirow'],
  ['Asia/Yekaterinburg', 56.84, 60.6, 'Екатеринбург', 'Jekaterinburg'],
  ['Asia/Omsk', 54.99, 73.37, 'Омск'],
  ['Asia/Novosibirsk', 55.03, 82.92, 'Новосибирск', 'Nowosibirsk'],
  ['Asia/Barnaul', 53.35, 83.78, 'Барнаул'],
  ['Asia/Tomsk', 56.49, 84.95, 'Томск'],
  ['Asia/Novokuznetsk', 53.76, 87.12, 'Новокузнецк', 'Nowokusnezk'],
  ['Asia/Krasnoyarsk', 56.01, 92.85, 'Красноярск', 'Krasnojarsk'],
  ['Asia/Irkutsk', 52.29, 104.3, 'Иркутск'],
  ['Asia/Chita', 52.03, 113.5, 'Чита', 'Tschita'],
  ['Asia/Yakutsk', 62.03, 129.73, 'Якутск', 'Jakutsk'],
  ['Asia/Vladivostok', 43.12, 131.89, 'Владивосток', 'Wladiwostok'],
  ['Asia/Khabarovsk', 48.48, 135.08, 'Хабаровск', 'Chabarowsk'],
  ['Asia/Sakhalin', 46.96, 142.73, 'Южно-Сахалинск', 'Juschno-Sachalinsk'],
  ['Asia/Magadan', 59.56, 150.8, 'Магадан'],
  ['Asia/Kamchatka', 53.02, 158.65, 'Петропавловск-Камчатский', 'Petropawlowsk-Kamtschatski'],
  ['Europe/Kiev', 50.45, 30.52, 'Киев', 'Kiew'],
  ['Europe/Kyiv', 50.45, 30.52, 'Киев', 'Kiew'],
  ['Europe/Simferopol', 44.95, 34.1, 'Симферополь', 'Simferopol'],
  ['Europe/Minsk', 53.9, 27.57, 'Минск'],
  ['Europe/Chisinau', 47.01, 28.86, 'Кишинёв', 'Chișinău'],
  ['Europe/Riga', 56.95, 24.11, 'Рига'],
  ['Europe/Vilnius', 54.69, 25.28, 'Вильнюс', 'Vilnius'],
  ['Europe/Tallinn', 59.44, 24.75, 'Таллин'],
  ['Asia/Tbilisi', 41.72, 44.79, 'Тбилиси', 'Tiflis'],
  ['Asia/Baku', 40.41, 49.87, 'Баку'],
  ['Asia/Yerevan', 40.18, 44.51, 'Ереван', 'Jerewan'],
  ['Asia/Almaty', 43.24, 76.89, 'Алматы'],
  ['Asia/Tashkent', 41.3, 69.24, 'Ташкент', 'Taschkent'],
  ['Asia/Bishkek', 42.87, 74.59, 'Бишкек', 'Bischkek'],
  ['Asia/Dushanbe', 38.56, 68.77, 'Душанбе', 'Duschanbe'],
  ['Europe/Berlin', 52.52, 13.4, 'Берлин'],
  ['Europe/Vienna', 48.21, 16.37, 'Вена', 'Wien'],
  ['Europe/Zurich', 47.38, 8.54, 'Цюрих', 'Zürich'],
  ['Europe/Busingen', 47.7, 8.69, 'Бюзинген', 'Büsingen'],
  ['Europe/Prague', 50.08, 14.44, 'Прага', 'Prag'],
  ['Europe/Warsaw', 52.23, 21.01, 'Варшава', 'Warschau'],
  ['Europe/Budapest', 47.5, 19.04, 'Будапешт'],
  ['Europe/Bucharest', 44.43, 26.1, 'Бухарест', 'Bukarest'],
  ['Europe/Sofia', 42.7, 23.32, 'София', 'Sofia'],
  ['Europe/Athens', 37.98, 23.73, 'Афины', 'Athen'],
  ['Europe/Istanbul', 41.01, 28.98, 'Стамбул'],
  ['Asia/Nicosia', 35.17, 33.36, 'Никосия', 'Nikosia'],
  ['Europe/Rome', 41.9, 12.5, 'Рим', 'Rom'],
  ['Europe/Paris', 48.86, 2.35, 'Париж'],
  ['Europe/Brussels', 50.85, 4.35, 'Брюссель', 'Brüssel'],
  ['Europe/Amsterdam', 52.37, 4.9, 'Амстердам'],
  ['Europe/Luxembourg', 49.61, 6.13, 'Люксембург', 'Luxemburg'],
  ['Europe/Copenhagen', 55.68, 12.57, 'Копенгаген', 'Kopenhagen'],
  ['Europe/Stockholm', 59.33, 18.07, 'Стокгольм'],
  ['Europe/Oslo', 59.91, 10.75, 'Осло'],
  ['Europe/Helsinki', 60.17, 24.94, 'Хельсинки'],
  ['Europe/London', 51.51, -0.13, 'Лондон'],
  ['Europe/Dublin', 53.35, -6.26, 'Дублин'],
  ['Europe/Madrid', 40.42, -3.7, 'Мадрид'],
  ['Europe/Lisbon', 38.72, -9.14, 'Лиссабон', 'Lissabon'],
  ['Europe/Belgrade', 44.79, 20.45, 'Белград'],
  ['Europe/Zagreb', 45.81, 15.98, 'Загреб'],
  ['Europe/Bratislava', 48.15, 17.11, 'Братислава'],
  ['Europe/Ljubljana', 46.06, 14.51, 'Любляна', 'Ljubljana'],
  ['America/New_York', 40.71, -74.01, 'Нью-Йорк'],
  ['America/Toronto', 43.65, -79.38, 'Торонто'],
  ['America/Montreal', 45.5, -73.57, 'Монреаль'],
  ['America/Chicago', 41.88, -87.63, 'Чикаго'],
  ['America/Detroit', 42.33, -83.05, 'Детройт'],
  ['America/Denver', 39.74, -104.99, 'Денвер'],
  ['America/Phoenix', 33.45, -112.07, 'Финикс'],
  ['America/Los_Angeles', 34.05, -118.24, 'Лос-Анджелес'],
  ['America/Vancouver', 49.28, -123.12, 'Ванкувер'],
  ['America/Mexico_City', 19.43, -99.13, 'Мехико', 'Mexiko-Stadt'],
  ['America/Sao_Paulo', -23.55, -46.63, 'Сан-Паулу'],
  ['America/Argentina/Buenos_Aires', -34.6, -58.38, 'Буэнос-Айрес'],
  ['America/Buenos_Aires', -34.6, -58.38, 'Буэнос-Айрес'],
  ['America/Santiago', -33.45, -70.67, 'Сантьяго'],
  ['America/Panama', 8.98, -79.52, 'Панама', 'Panama-Stadt'],
  ['Africa/Johannesburg', -26.2, 28.05, 'Йоханнесбург'],
  ['Africa/Casablanca', 33.57, -7.59, 'Касабланка', 'Casablanca'],
  ['Australia/Sydney', -33.87, 151.21, 'Сидней'],
  ['Australia/Melbourne', -37.81, 144.96, 'Мельбурн'],
  ['Australia/Brisbane', -27.47, 153.03, 'Брисбен'],
  ['Australia/Perth', -31.95, 115.86, 'Перт'],
  ['Pacific/Auckland', -36.85, 174.76, 'Окленд'],
  ['Asia/Dubai', 25.2, 55.27, 'Дубай', 'Dubai'],
  ['Asia/Bangkok', 13.76, 100.5, 'Бангкок', 'Bangkok'],
  ['Asia/Hong_Kong', 22.32, 114.17, 'Гонконг', 'Hongkong'],
  ['Asia/Shanghai', 31.23, 121.47, 'Шанхай', 'Schanghai'],
  ['Asia/Tokyo', 35.68, 139.69, 'Токио', 'Tokio'],
  ['Asia/Singapore', 1.35, 103.82, 'Сингапур', 'Singapur'],
  ['Asia/Kolkata', 19.08, 72.88, 'Мумбаи', 'Mumbai'],
];

/** The device time zone, e.g. «Europe/Berlin». */
export const timeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
};

/** The city of the time zone, or null for a zone not in the list. */
export function placeOf(tz = timeZone()): Place | null {
  const z = ZONES.find(([id]) => id === tz);
  if (!z) return null;
  const [id, lat, lon, ru, de] = z;
  const en = id.split('/').pop()!.replace(/_/g, ' ');
  return { lat, lon, name: { en, ru, de }, candles: id === 'Asia/Jerusalem' ? 40 : undefined };
}
