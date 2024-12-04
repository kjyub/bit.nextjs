import CommonUtils from "@/utils/CommonUtils"
import CommonFile from "./CommonFile"
import FileUtils from "@/utils/FileUtils"
import User from "../user/User"
import { AbsApiObject } from "../ApiTypes"

export default class extends CommonFile{
    private _base64: string
    private _width: string
    private _height: string


    constructor() {
        super()

        this._base64 = ""
        this._width = ""
        this._height = ""
    }

    convertByResponse(response) {
        if (!super.isValidParseResponse(json)) return

        super.convertByResponse(json)

        this._base64 = json["base64"]
        this._width = json["width"]
        this._height = json["height"]
    }

    public get base64(): string { return this._base64 }
    public get width(): string { return this._width }
    public get height(): string { return this._height }
    

    getSource() {
        if (!CommonUtils.isStringNullOrEmpty(this.base64)) {
            return this.base64
        } else if (!CommonUtils.isStringNullOrEmpty(this.fileUrl)) {
            return FileUtils.getMediaFileUrl(this.fileUrl)
        } else {
            return ""
        }
    }
}