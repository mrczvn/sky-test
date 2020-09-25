import { dateToString } from './date-to-string'

export const compareDate = (data: Date, dateToCompare: Date): boolean => {
  const sameDay = dateToString(data) === dateToString(dateToCompare)

  if (sameDay) {
    const differenceMilliseconds = Math.abs(
      data.getTime() - dateToCompare.getTime()
    )

    const minutes = Math.ceil(differenceMilliseconds / (1000 * 60))

    if (minutes > 30) return true

    return false
  }

  return true
}
