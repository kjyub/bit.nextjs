import { ApartWorkScheduleRangeTypes } from "../types/apts/AptTypes"
import { Dictionary } from "../types/Dictionary"
import { UserTypes } from "../types/users/UserTypes"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import CommonUtils from "./CommonUtils"
import AptWorkSchedule from "@/types/apts/AptWorkSchedule"

dayjs.extend(isBetween)

export default class {
    // 유저 타입에따라 쓰기가 가능한 현황만 가져온다.
    static getContractRange(schedule: AptWorkSchedule) {
        let range = ApartWorkScheduleRangeTypes.ALL

        const contractDateEnd = dayjs(schedule.contractDateEnd)

        if (CommonUtils.isStringNullOrEmpty(schedule.contractDateEnd) || !contractDateEnd.isValid()) {
            return range
        }
        const now = dayjs()
        
        if (contractDateEnd.isBefore(now)) {
            range = ApartWorkScheduleRangeTypes.DONE
        } else if (contractDateEnd.isBetween(now, dayjs().add(3, "month"), null, "[]")) {
            range = ApartWorkScheduleRangeTypes.MONTH3
        } else if (contractDateEnd.isBetween(now, dayjs().add(6, "month"), null, "[]")) {
            range = ApartWorkScheduleRangeTypes.MONTH6
        } else if (contractDateEnd.isBetween(now, dayjs().add(1, "year"), null, "[]")) {
            range = ApartWorkScheduleRangeTypes.YEAR1
        }

        return range
    }
}
