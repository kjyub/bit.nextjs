import CommonUtils from "./CommonUtils"

export default class FrontUtils {
    static getSearchUrl(pathname: string, params: object, key: string, value: string): string {
        let link = `${pathname}?`
        let parameters = {}
        const paramKeys = Object.keys(params)
        if (paramKeys.length > 0) {
            paramKeys.map((paramKey) => {
                if (paramKey !== key) {
                    link += `${paramKey}=${params[paramKey]}&`
                }
            })
        }

        if (!CommonUtils.isStringNullOrEmpty(value)) {
            link += `${key}=${value}`
        }

        return link
        // router.push(link, { scroll: isScroll })
    }
    static handleArrayParam(params: object, key: string, value: T): T {
        let stringValues: string = params[key] ?? ""

        // params에 값이 없는 경우 값 하나만 추가
        if (CommonUtils.isStringNullOrEmpty(stringValues)) {
            stringValues = value.toString()
        } else {
            const arrayValues: Array<string> = stringValues.split(",")

            if (arrayValues.includes(value.toString())) {
                // 이미 값이 있는 경우 제거    
                arrayValues.splice(arrayValues.indexOf(value.toString()), 1)
            } else {
                // 값이 없으면 추가
                arrayValues.push(value.toString())
            }
            stringValues = arrayValues.join(",")
        }

        return stringValues
    }
}