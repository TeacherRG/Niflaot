/**
 * The user's place, guessed from the device time zone (no geolocation prompt): coordinates of the zone's city.
 * Used only for the Shabbat times (src/core/zmanim.ts). A zone not in the list → null (fixed hours are used).
 */
export interface Place {
  lat: number;
  lon: number;
  /** city name: English (Latin), and Russian / German where it differs */
  name: { en: string; ru: string; de?: string };
  /** the city's time zone (the times are shown in it); none — the device's */
  tz?: string;
  /** id in the list (`CITIES`), or «custom» — the reader's own coordinates */
  id?: string;
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
export function zonePlace(tz = timeZone()): Place | null {
  const z = ZONES.find(([id]) => id === tz);
  if (!z) return null;
  const [id, lat, lon, ru, de] = z;
  const en = id.split('/').pop()!.replace(/_/g, ' ');
  return { lat, lon, name: { en, ru, de }, tz: id, id };
}

/**
 * More cities to choose by hand (owner, 10.11.2026: «рядом с городом — „Изменить“»): Jewish communities and big cities
 * that are not the capital of their time zone. [id, time zone, latitude, longitude, English, Russian, German if different]
 */
const MORE: [string, string, number, number, string, string, string?][] = [
  ['haifa', 'Asia/Jerusalem', 32.79, 34.99, 'Haifa', 'Хайфа'],
  ['beer-sheva', 'Asia/Jerusalem', 31.25, 34.79, "Be'er Sheva", 'Беэр-Шева', "Be'er Scheva"],
  ['bnei-brak', 'Asia/Jerusalem', 32.08, 34.83, 'Bnei Brak', 'Бней-Брак'],
  ['tzfat', 'Asia/Jerusalem', 32.96, 35.5, 'Tzfat (Safed)', 'Цфат', 'Zfat (Safed)'],
  ['tiberias', 'Asia/Jerusalem', 32.79, 35.53, 'Tiberias', 'Тверия', 'Tiberias'],
  ['netanya', 'Asia/Jerusalem', 32.33, 34.86, 'Netanya', 'Нетания', 'Netanja'],
  ['ashdod', 'Asia/Jerusalem', 31.8, 34.65, 'Ashdod', 'Ашдод', 'Aschdod'],
  ['ashkelon', 'Asia/Jerusalem', 31.67, 34.57, 'Ashkelon', 'Ашкелон', 'Aschkelon'],
  ['rishon', 'Asia/Jerusalem', 31.97, 34.79, 'Rishon LeZion', 'Ришон-ле-Цион', 'Rischon LeZion'],
  ['petah-tikva', 'Asia/Jerusalem', 32.09, 34.89, 'Petah Tikva', 'Петах-Тиква', 'Petach Tikwa'],
  ['kfar-chabad', 'Asia/Jerusalem', 31.99, 34.85, 'Kfar Chabad', 'Кфар-Хабад', 'Kfar Chabad'],
  ['eilat', 'Asia/Jerusalem', 29.56, 34.95, 'Eilat', 'Эйлат'],
  ['nazareth-illit', 'Asia/Jerusalem', 32.72, 35.33, 'Nof HaGalil', 'Ноф-ха-Галиль'],
  ['karmiel', 'Asia/Jerusalem', 32.92, 35.3, 'Karmiel', 'Кармиэль'],
  ['saint-petersburg', 'Europe/Moscow', 59.94, 30.31, 'Saint Petersburg', 'Санкт-Петербург', 'Sankt Petersburg'],
  ['kazan', 'Europe/Moscow', 55.79, 49.12, 'Kazan', 'Казань', 'Kasan'],
  ['nizhny-novgorod', 'Europe/Moscow', 56.33, 44.0, 'Nizhny Novgorod', 'Нижний Новгород', 'Nischni Nowgorod'],
  ['rostov', 'Europe/Moscow', 47.24, 39.71, 'Rostov-on-Don', 'Ростов-на-Дону', 'Rostow am Don'],
  ['krasnodar', 'Europe/Moscow', 45.04, 38.98, 'Krasnodar', 'Краснодар'],
  ['sochi', 'Europe/Moscow', 43.6, 39.73, 'Sochi', 'Сочи', 'Sotschi'],
  ['voronezh', 'Europe/Moscow', 51.66, 39.2, 'Voronezh', 'Воронеж', 'Woronesch'],
  ['perm', 'Asia/Yekaterinburg', 58.01, 56.25, 'Perm', 'Пермь'],
  ['chelyabinsk', 'Asia/Yekaterinburg', 55.16, 61.4, 'Chelyabinsk', 'Челябинск', 'Tscheljabinsk'],
  ['ufa', 'Asia/Yekaterinburg', 54.74, 55.97, 'Ufa', 'Уфа'],
  ['odesa', 'Europe/Kyiv', 46.48, 30.72, 'Odesa', 'Одесса', 'Odessa'],
  ['dnipro', 'Europe/Kyiv', 48.46, 35.05, 'Dnipro', 'Днепр', 'Dnipro'],
  ['kharkiv', 'Europe/Kyiv', 49.99, 36.23, 'Kharkiv', 'Харьков', 'Charkiw'],
  ['zaporizhzhia', 'Europe/Kyiv', 47.84, 35.14, 'Zaporizhzhia', 'Запорожье', 'Saporischschja'],
  ['lviv', 'Europe/Kyiv', 49.84, 24.03, 'Lviv', 'Львов', 'Lwiw'],
  ['uman', 'Europe/Kyiv', 48.75, 30.22, 'Uman', 'Умань'],
  ['vinnytsia', 'Europe/Kyiv', 49.23, 28.47, 'Vinnytsia', 'Винница', 'Winnyzja'],
  ['gomel', 'Europe/Minsk', 52.44, 30.98, 'Gomel', 'Гомель'],
  ['vitebsk', 'Europe/Minsk', 55.19, 30.2, 'Vitebsk', 'Витебск', 'Witebsk'],
  ['daugavpils', 'Europe/Riga', 55.87, 26.54, 'Daugavpils', 'Даугавпилс'],
  ['batumi', 'Asia/Tbilisi', 41.64, 41.63, 'Batumi', 'Батуми'],
  ['astana', 'Asia/Almaty', 51.17, 71.45, 'Astana', 'Астана'],
  ['samarkand', 'Asia/Samarkand', 39.65, 66.96, 'Samarkand', 'Самарканд'],
  ['bukhara', 'Asia/Samarkand', 39.77, 64.42, 'Bukhara', 'Бухара', 'Buchara'],
  ['graz', 'Europe/Vienna', 47.07, 15.44, 'Graz', 'Грац'],
  ['salzburg', 'Europe/Vienna', 47.81, 13.06, 'Salzburg', 'Зальцбург'],
  ['innsbruck', 'Europe/Vienna', 47.27, 11.4, 'Innsbruck', 'Инсбрук'],
  ['linz', 'Europe/Vienna', 48.31, 14.29, 'Linz', 'Линц'],
  ['munich', 'Europe/Berlin', 48.14, 11.58, 'Munich', 'Мюнхен', 'München'],
  ['frankfurt', 'Europe/Berlin', 50.11, 8.68, 'Frankfurt', 'Франкфурт-на-Майне', 'Frankfurt am Main'],
  ['hamburg', 'Europe/Berlin', 53.55, 9.99, 'Hamburg', 'Гамбург'],
  ['cologne', 'Europe/Berlin', 50.94, 6.96, 'Cologne', 'Кёльн', 'Köln'],
  ['dusseldorf', 'Europe/Berlin', 51.23, 6.77, 'Düsseldorf', 'Дюссельдорф', 'Düsseldorf'],
  ['stuttgart', 'Europe/Berlin', 48.78, 9.18, 'Stuttgart', 'Штутгарт'],
  ['leipzig', 'Europe/Berlin', 51.34, 12.37, 'Leipzig', 'Лейпциг'],
  ['dresden', 'Europe/Berlin', 51.05, 13.74, 'Dresden', 'Дрезден'],
  ['hannover', 'Europe/Berlin', 52.37, 9.73, 'Hanover', 'Ганновер', 'Hannover'],
  ['nuremberg', 'Europe/Berlin', 49.45, 11.08, 'Nuremberg', 'Нюрнберг', 'Nürnberg'],
  ['bremen', 'Europe/Berlin', 53.08, 8.8, 'Bremen', 'Бремен'],
  ['dortmund', 'Europe/Berlin', 51.51, 7.47, 'Dortmund', 'Дортмунд'],
  ['essen', 'Europe/Berlin', 51.46, 7.01, 'Essen', 'Эссен'],
  ['mannheim', 'Europe/Berlin', 49.49, 8.47, 'Mannheim', 'Мангейм'],
  ['karlsruhe', 'Europe/Berlin', 49.01, 8.4, 'Karlsruhe', 'Карлсруэ'],
  ['basel', 'Europe/Zurich', 47.56, 7.59, 'Basel', 'Базель'],
  ['geneva', 'Europe/Zurich', 46.2, 6.14, 'Geneva', 'Женева', 'Genf'],
  ['bern', 'Europe/Zurich', 46.95, 7.45, 'Bern', 'Берн'],
  ['lugano', 'Europe/Zurich', 46.0, 8.95, 'Lugano', 'Лугано'],
  ['antwerp', 'Europe/Brussels', 51.22, 4.4, 'Antwerp', 'Антверпен', 'Antwerpen'],
  ['rotterdam', 'Europe/Amsterdam', 51.92, 4.48, 'Rotterdam', 'Роттердам'],
  ['manchester', 'Europe/London', 53.48, -2.24, 'Manchester', 'Манчестер'],
  ['gateshead', 'Europe/London', 54.95, -1.6, 'Gateshead', 'Гейтсхед'],
  ['leeds', 'Europe/London', 53.8, -1.55, 'Leeds', 'Лидс'],
  ['milan', 'Europe/Rome', 45.46, 9.19, 'Milan', 'Милан', 'Mailand'],
  ['venice', 'Europe/Rome', 45.44, 12.33, 'Venice', 'Венеция', 'Venedig'],
  ['nice', 'Europe/Paris', 43.7, 7.27, 'Nice', 'Ницца', 'Nizza'],
  ['marseille', 'Europe/Paris', 43.3, 5.37, 'Marseille', 'Марсель'],
  ['lyon', 'Europe/Paris', 45.76, 4.84, 'Lyon', 'Лион'],
  ['strasbourg', 'Europe/Paris', 48.57, 7.75, 'Strasbourg', 'Страсбург', 'Straßburg'],
  ['barcelona', 'Europe/Madrid', 41.39, 2.17, 'Barcelona', 'Барселона'],
  ['krakow', 'Europe/Warsaw', 50.06, 19.94, 'Kraków', 'Краков', 'Krakau'],
  ['lodz', 'Europe/Warsaw', 51.76, 19.46, 'Łódź', 'Лодзь', 'Lodz'],
  ['thessaloniki', 'Europe/Athens', 40.64, 22.94, 'Thessaloniki', 'Салоники', 'Thessaloniki'],
  ['cyprus-larnaca', 'Asia/Nicosia', 34.92, 33.62, 'Larnaca', 'Ларнака', 'Larnaka'],
  ['limassol', 'Asia/Nicosia', 34.68, 33.04, 'Limassol', 'Лимасол'],
  ['antalya', 'Europe/Istanbul', 36.9, 30.7, 'Antalya', 'Анталья', 'Antalya'],
  ['brooklyn', 'America/New_York', 40.67, -73.94, 'Brooklyn (Crown Heights)', 'Бруклин (Краун-Хайтс)', 'Brooklyn (Crown Heights)'],
  ['lakewood', 'America/New_York', 40.08, -74.21, 'Lakewood', 'Лейквуд'],
  ['monsey', 'America/New_York', 41.11, -74.07, 'Monsey', 'Монси'],
  ['boston', 'America/New_York', 42.36, -71.06, 'Boston', 'Бостон'],
  ['philadelphia', 'America/New_York', 39.95, -75.17, 'Philadelphia', 'Филадельфия', 'Philadelphia'],
  ['baltimore', 'America/New_York', 39.29, -76.61, 'Baltimore', 'Балтимор'],
  ['washington', 'America/New_York', 38.91, -77.04, 'Washington', 'Вашингтон'],
  ['miami', 'America/New_York', 25.76, -80.19, 'Miami', 'Майами'],
  ['atlanta', 'America/New_York', 33.75, -84.39, 'Atlanta', 'Атланта'],
  ['cleveland', 'America/New_York', 41.5, -81.69, 'Cleveland', 'Кливленд'],
  ['pittsburgh', 'America/New_York', 40.44, -80.0, 'Pittsburgh', 'Питтсбург'],
  ['houston', 'America/Chicago', 29.76, -95.37, 'Houston', 'Хьюстон'],
  ['dallas', 'America/Chicago', 32.78, -96.8, 'Dallas', 'Даллас'],
  ['san-francisco', 'America/Los_Angeles', 37.77, -122.42, 'San Francisco', 'Сан-Франциско'],
  ['san-diego', 'America/Los_Angeles', 32.72, -117.16, 'San Diego', 'Сан-Диего'],
  ['las-vegas', 'America/Los_Angeles', 36.17, -115.14, 'Las Vegas', 'Лас-Вегас'],
  ['seattle', 'America/Los_Angeles', 47.61, -122.33, 'Seattle', 'Сиэтл'],
  ['ottawa', 'America/Toronto', 45.42, -75.7, 'Ottawa', 'Оттава'],
  ['cape-town', 'Africa/Johannesburg', -33.92, 18.42, 'Cape Town', 'Кейптаун', 'Kapstadt'],
  ['rio', 'America/Sao_Paulo', -22.91, -43.17, 'Rio de Janeiro', 'Рио-де-Жанейро'],
];

/** Every city to choose from: the time zones' cities and `MORE`. */
export function cities(): Place[] {
  const seen = new Set<string>();
  const all: Place[] = [];
  for (const [tz] of ZONES) {
    const p = zonePlace(tz)!;
    // two zone names for one city (Kiev / Kyiv, Buenos Aires) — one entry
    const k = `${p.name.ru}|${p.lat}`;
    if (seen.has(k)) continue;
    seen.add(k);
    all.push(p);
  }
  for (const [id, tz, lat, lon, en, ru, de] of MORE) all.push({ id, tz, lat, lon, name: { en, ru, de } });
  return all;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/g, ' ')
    .trim();

/** Cities whose name (ru, en, de) has a word starting with the query — word starts first; up to `max`. */
export function findCities(q: string, max = 8): Place[] {
  const n = norm(q);
  if (!n) return [];
  const scored: [number, Place][] = [];
  for (const p of cities()) {
    const names = [p.name.ru, p.name.en, p.name.de ?? ''].map(norm);
    let best = 9;
    for (const s of names) {
      if (s.startsWith(n)) best = Math.min(best, 0);
      else if (s.split(' ').some((w) => w.startsWith(n))) best = Math.min(best, 1);
      else if (n.length >= 3 && s.includes(n)) best = Math.min(best, 2);
    }
    if (best < 9) scored.push([best, p]);
  }
  return scored.sort((a, b) => a[0] - b[0]).slice(0, max).map(([, p]) => p);
}

/** The city chosen by hand: `niflaot:place` — only on this device; none — by the time zone. */
export const PLACE_KEY = 'niflaot:place';
export const PLACE_EVENT = 'niflaot:place';

interface Saved {
  id: string;
  lat?: number;
  lon?: number;
  name?: string;
  tz?: string;
}

export function savedPlace(): Place | null {
  try {
    const v = JSON.parse(localStorage.getItem(PLACE_KEY) ?? 'null') as Saved | null;
    if (!v || typeof v.id !== 'string') return null;
    if (v.id === 'custom') {
      if (typeof v.lat !== 'number' || typeof v.lon !== 'number' || Math.abs(v.lat) > 90 || Math.abs(v.lon) > 180) return null;
      const name = (v.name || `${v.lat.toFixed(2)}, ${v.lon.toFixed(2)}`).slice(0, 40);
      return { id: 'custom', lat: v.lat, lon: v.lon, tz: v.tz || timeZone(), name: { en: name, ru: name } };
    }
    return cities().find((p) => p.id === v.id) ?? null;
  } catch {
    return null;
  }
}

/** Choose a city (null — back to the time zone). */
export function setPlace(p: Place | null) {
  try {
    if (!p) localStorage.removeItem(PLACE_KEY);
    else
      localStorage.setItem(
        PLACE_KEY,
        JSON.stringify(p.id === 'custom' ? { id: 'custom', lat: p.lat, lon: p.lon, name: p.name.ru, tz: p.tz } : { id: p.id }),
      );
  } catch {}
  try {
    window.dispatchEvent(new Event(PLACE_EVENT));
  } catch {}
}

/** The reader's place: the city chosen by hand, else the city of the device time zone (null — not in the list). */
export function placeOf(tz?: string): Place | null {
  if (tz === undefined) return savedPlace() ?? zonePlace();
  return zonePlace(tz);
}

/** The place and the time zone its times are shown in; `auto` — guessed from the time zone, not chosen. */
export function currentPlace(): { place: Place | null; zone: string; auto: boolean } {
  const chosen = savedPlace();
  if (chosen) return { place: chosen, zone: chosen.tz || timeZone(), auto: false };
  return { place: zonePlace(), zone: timeZone(), auto: true };
}
