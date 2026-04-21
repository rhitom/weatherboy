const zodiacRanges = [
  { sign: "Capricorn", start: [12, 22], end: [1, 19] },
  { sign: "Aquarius", start: [1, 20], end: [2, 18] },
  { sign: "Pisces", start: [2, 19], end: [3, 20] },
  { sign: "Aries", start: [3, 21], end: [4, 19] },
  { sign: "Taurus", start: [4, 20], end: [5, 20] },
  { sign: "Gemini", start: [5, 21], end: [6, 20] },
  { sign: "Cancer", start: [6, 21], end: [7, 22] },
  { sign: "Leo", start: [7, 23], end: [8, 22] },
  { sign: "Virgo", start: [8, 23], end: [9, 22] },
  { sign: "Libra", start: [9, 23], end: [10, 22] },
  { sign: "Scorpio", start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
];

export function getZodiacSignFromBirthday(birthday: string) {
  const date = new Date(`${birthday}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  for (const range of zodiacRanges) {
    const [startMonth, startDay] = range.start;
    const [endMonth, endDay] = range.end;

    const wrapsYear = startMonth > endMonth;
    const isAfterStart =
      month > startMonth || (month === startMonth && day >= startDay);
    const isBeforeEnd =
      month < endMonth || (month === endMonth && day <= endDay);

    if ((wrapsYear && (isAfterStart || isBeforeEnd)) || (!wrapsYear && isAfterStart && isBeforeEnd)) {
      return range.sign;
    }
  }

  return null;
}
