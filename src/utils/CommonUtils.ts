import { TextFormats } from '@/types/CommonTypes'
import dayjs from 'dayjs'
import Inko from 'inko'

export default class CommonUtils {
  static getBaseUrl(): string {
    const currentURL =
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '')
    return currentURL
  }
  static isNullOrUndefined(data: any): boolean {
    return data === null || data === undefined
  }
  static isStringNullOrEmpty(data: any): boolean {
    return data === '' || this.isNullOrUndefined(data)
  }
  static toCamelCase(str: string) {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''))
  }
  static round(value: number, round: number = 0): number {
    // return Math.round(value * Math.pow(10, round)) / Math.pow(10, round)
    return Number(value.toPrecision(round))
  }
  static getRandomEnumValue<T>(enumeration: T): T[keyof T] {
    const enumValues = Object.values(enumeration)
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return enumValues[randomIndex]
  }
  static getRandomChoice<T>(list: Array<T>): T {
    const randomIndex = Math.floor(Math.random() * list.length)

    return list[randomIndex]
  }
  static getCurrentBaseUrl(): string {
    return window.location.href.split('/').slice(0, 3).join('/')
  }
  static async copyClipboard(value: string): boolean {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return false
    }
    return true
  }
  static sha256(value: string): string {
    const hash = crypto.createHash('sha256')
    hash.update(value)
    return hash.digest('hex')
  }
  static telFormat(v: string): string {
    const value = v.replace(/[^0-9]/g, '')

    const result = []
    let restNumber = ''

    // 지역번호와 나머지 번호로 나누기
    if (value.startsWith('02')) {
      // 서울 02 지역번호
      result.push(value.substr(0, 2))
      restNumber = value.substring(2)
    } else if (value.startsWith('1')) {
      // 지역 번호가 없는 경우
      // 1xxx-yyyy
      restNumber = value
    } else {
      // 나머지 3자리 지역번호
      // 0xx-yyyy-zzzz
      result.push(value.substr(0, 3))
      restNumber = value.substring(3)
    }

    if (restNumber.length === 7) {
      // 7자리만 남았을 때는 xxx-yyyy
      result.push(restNumber.substring(0, 3))
      result.push(restNumber.substring(3))
    } else {
      result.push(restNumber.substring(0, 4))
      result.push(restNumber.substring(4))
    }

    return result.filter((val) => val).join('-')
  }
  static telFormatter(e): string {
    const value = e.target.value
    if (!value) {
      e.target.value = e.target.value
    }

    e.target.value = CommonUtils.telFormat(value)
  }
  static textFormat(text: string, format: TextFormats): string {
    let result = this.isStringNullOrEmpty(text) ? '' : String(text)

    if (format === TextFormats.NUMBER) {
      const number = Number(text)
      if (
        !isNaN(number) &&
        result[result.length - 1] !== '.' &&
        result !== '' &&
        !(result.includes('.') && result[result.length - 1] === '0')
      ) {
        result = number.toLocaleString()
      }
      // // 숫자를 문자열로 변환
      // let numStr = text.toString()

      // // 정수 부분과 소수 부분 분리
      // const parts = numStr.split(".")
      // const integerPart = parts[0]
      // const decimalPart = parts[1] || ""

      // // 정수 부분에 콤마 추가
      // const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

      // // 소수 부분과 합치기
      // result =
      //     decimalPart || text[text.length - 1] === "." ? `${integerWithCommas}.${decimalPart}` : integerWithCommas
      // console.log(decimalPart)
    } else if (format === TextFormats.PRICE) {
      const number = CommonUtils.textFormat(text, TextFormats.NUMBER)
      result = number + '원'
    } else if (format === TextFormats.KOREAN_PRICE) {
      const inputNumber = text < 0 ? false : text
      const unitWords = ['', '만', '억', '조', '경']
      const splitUnit = 10000
      const splitCount = unitWords.length
      const resultArray = []
      let resultString = ''

      for (let i = 0; i < splitCount; i++) {
        let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i)
        unitResult = Math.floor(unitResult)
        if (unitResult > 0) {
          resultArray[i] = unitResult
        }
      }

      for (let i = 0; i < resultArray.length; i++) {
        if (!resultArray[i]) continue
        resultString = String(this.textFormat(resultArray[i], TextFormats.NUMBER)) + unitWords[i] + resultString
      }

      result = resultString
    } else if (format === TextFormats.KOREAN_PRICE_SIMPLE) {
      const inputNumber = text < 0 ? false : text
      const unitWords = ['', '만', '억', '조', '경']
      const splitUnit = 10000
      const splitCount = unitWords.length
      const resultArray = []
      let resultString = ''

      for (let i = 0; i < splitCount; i++) {
        let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i)
        unitResult = Math.floor(unitResult)
        if (unitResult > 0) {
          resultArray[i] = unitResult
        }
      }

      const lastIndex = resultArray.length - 1
      resultString = String(this.textFormat(resultArray[lastIndex], TextFormats.NUMBER)) + unitWords[lastIndex]

      result = resultString
    }

    if (CommonUtils.isNullOrUndefined(result)) {
      result = ''
    }

    return result
  }
  static textFormatInput(text: string, format: TextFormats): string {
    let result = text

    if (format === TextFormats.NUMBER) {
      result = text.replaceAll(',', '')
    } else if (format === TextFormats.NUMBER_ONLY) {
      result = text.replace(/[^0-9]/g, '')
    } else if (format === TextFormats.PRICE) {
      // 미구현
      const number = CommonUtils.textFormatInput(text, TextFormats.NUMBER)
      result = number.replaceAll('원', '')
    } else if (format === TextFormats.TEL) {
      result = CommonUtils.telFormat(text)
    }

    return result
  }
  static setMaxDays(year: number, month: number, day: number) {
    // 각 월의 최대 날짜 수
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // 윤년 계산
    const isLeapYear = (year: number) => {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    }

    // 2월에 대해 윤년을 고려하여 최대 날짜 수정
    if (isLeapYear(year)) {
      daysInMonth[1] = 29
    }

    // 해당 월의 최대 날짜 수 가져오기
    const maxDay = daysInMonth[month - 1]

    // 날짜가 최대 날짜 수를 초과하면 최대 날짜로 설정
    if (day > maxDay) {
      day = maxDay
    }

    return day
  }
  static isValidPassword(value: string): boolean {
    // 정규식: 최소 6자리, 영문자와 숫자 포함
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return regex.test(value)
  }
  static setTextareaAutoHeight(e: any) {
    const element = e.target

    if (!element) {
      return
    }

    element.style.height = 'auto'
    element.style.height = Number(element.scrollHeight) + 4 + 'px'
  }
  static koreanToEnglish = (value: string): string => {
    const inko = new Inko()
    // const convertedInput = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, (char) => romanize(char))
    return inko.ko2en(value)
  }
  static async getAddressCode(callback: (adderssCode: string, address1: string) => void) {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let addr = ''
        let extraAddr = ''

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress
        } else {
          addr = data.jibunAddress
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')'
          }
        } else {
          extraAddr = ''
        }

        const addressCode = data.zonecode
        const address1 = addr + extraAddr

        callback(addressCode, address1)
      },
    }).open()
  }
  static rowIndex(index: number, pageIndex: number, pageSize: number, itemCount: number): number {
    return itemCount - ((pageIndex - 1) * pageSize + index)
  }
  static getDateShorten(date: string): string {
    try {
      const now = dayjs()
      const inputDate = dayjs(date)
      const diffSeconds = now.diff(inputDate, 'seconds')
      const diffMinutes = now.diff(inputDate, 'minutes')
      const diffHours = now.diff(inputDate, 'hours')
      const diffDays = now.diff(inputDate, 'days')

      if (diffSeconds < 60) {
        return `${diffSeconds}초 전`
      } else if (diffMinutes < 60) {
        return `${diffMinutes}분 전`
      } else if (diffHours < 24) {
        return `${diffHours}시간 전`
      } else if (diffDays < 7) {
        return `${diffDays}일 전`
      } else {
        return inputDate.format('YYYY-MM-DD')
      }
    } catch {
      return ''
    }
  }
}
