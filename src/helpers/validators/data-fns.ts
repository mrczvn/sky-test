import { dateToString } from '../../utils/date-to-string'
import { ICompareDateByMinutes } from '../interfaces/validators/data-fns'

export class DataFns implements ICompareDateByMinutes {
  compareInMinutes(dataToCompare: Date, date = new Date()): boolean {
    const sameDay = dateToString(date) === dateToString(dataToCompare)

    if (sameDay) {
      const differenceInMilliseconds = Math.abs(
        date.getTime() - dataToCompare.getTime()
      )

      const minutes = Math.ceil(differenceInMilliseconds / (1000 * 60))

      if (minutes <= 30) return false
    }
    return true
  }
}
