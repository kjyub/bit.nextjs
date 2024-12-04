import { AbsApiObject } from "../ApiTypes"

export default class Pagination<T extends AbsApiObject> {
    private _count: number
    private _items: Array<T>

    constructor(count: number = 0, items: Array<T> = []) {
        this._count = count
        this._items = items
    }

    get count(): number {
        return this._count
    }
    get items(): Array<T> {
        return this._items
    }

    parseResponse(data: object, cls: new () => T): void {
        const results = data["results"] ?? []

        this._items = results.map((result) => {
            let instance: T = new cls()
            instance.parseResponse(result)
            return instance
        })

        this._count = data["count"] ?? 0
    }
}
