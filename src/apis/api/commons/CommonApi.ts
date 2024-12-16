import { UserTypes } from '@/types/users/UserTypes';
import { authInstance, defaultInstance, fileInstance } from '../../utils/clientApis';
import User from '@/types/users/User';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';

import ImageFile from '@/types/common/ImageFile';



class CommonApi {
    // region File
    static async uploadImage(image: File, isBase64: boolean = false, isTemp: boolean = false): Promise<ImageFile> {
        let result: ImageFile = new ImageFile()

        await fileInstance.post("/api/commons/image_write/", {
            images: image,
            is_base64: isBase64,
            is_temp: isTemp ? "1" : "0",
        }).then(({ data }) => {
            result.parseResponse(data)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getImageFile(imageID: number): Promise<ImageFile> {
        let result: ImageFile = new ImageFile()

        await defaultInstance
            .post(`/api/commons/image/`, { file_id: imageID })
            .then(({ data }) => {
                result.parseResponse(data)
            })
            .catch((error) => {
                // console.log(error)
            })

        return result
    }
    // endregion
}

export default CommonApi