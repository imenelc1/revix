export type AppLocale = string

function toIntlLocale(locale: AppLocale): string {
  return locale === 'fr' ? 'fr-FR' : 'en-US'
}

/** "15 janv." / "Jan 15" */
export function formatShortDate(date: string | Date, locale: AppLocale): string {
  return new Date(date).toLocaleDateString(toIntlLocale(locale), { day: '2-digit', month: 'short' })
}

/** "lun. 15 janv." / "Mon, Jan 15" */
export function formatWeekdayShortDate(date: string | Date, locale: AppLocale): string {
  return new Date(date).toLocaleDateString(toIntlLocale(locale), { weekday: 'short', day: '2-digit', month: 'short' })
}

/** "15 janvier 2026" / "January 15, 2026" */
export function formatLongDate(date: string | Date, locale: AppLocale): string {
  return new Date(date).toLocaleDateString(toIntlLocale(locale), { day: '2-digit', month: 'long', year: 'numeric' })
}

/** "janvier 2026" / "January 2026" */
export function formatMonthYear(date: string | Date, locale: AppLocale): string {
  return new Date(date).toLocaleDateString(toIntlLocale(locale), { month: 'long', year: 'numeric' })
}

/** "lundi 15 janvier" / "Monday, January 15" */
export function formatFullWeekdayDate(date: string | Date, locale: AppLocale): string {
  return new Date(date).toLocaleDateString(toIntlLocale(locale), { weekday: 'long', day: 'numeric', month: 'long' })
}

/** "15 janv. 2026" / "Jan 15, 2026" */
export function formatDateWithYear(date: string | Date, locale: AppLocale): string {
  return new Date(date).toLocaleDateString(toIntlLocale(locale), { day: '2-digit', month: 'short', year: 'numeric' })
}