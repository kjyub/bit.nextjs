import { AbsApiObject } from '../ApiTypes'

export default class Pagination<T extends AbsApiObject> {
  private _count: number
  private _items: Array<T>
  private _pageIndex: number

  constructor(count: number = 0, items: Array<T> = []) {
    this._count = count
    this._items = items
    this._pageIndex = 1
  }

  get count(): number {
    return this._count
  }
  get items(): Array<T> {
    return this._items
  }
  get pageIndex(): number {
    return this._pageIndex
  }

  parseResponse(data: object, cls: new () => T): void {
    const results = data['results'] ?? []

    this._items = results.map((result) => {
      const instance: T = new cls()
      instance.parseResponse(result as object)
      return instance
    })

    this._count = data['count'] ?? 0
    this._pageIndex = data['current_page'] ?? -1
  }
}
