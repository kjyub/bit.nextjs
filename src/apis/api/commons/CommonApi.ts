import { defaultInstance, fileInstance } from '../../utils/api';

import ImageFile from '@/types/common/ImageFile';

class CommonApi {
  // region File
  static async uploadImage(image: File, isBase64: boolean = false, isTemp: boolean = false): Promise<ImageFile> {
    const result: ImageFile = new ImageFile();

    await fileInstance
      .post('/api/commons/image_write/', {
        images: image,
        is_base64: isBase64,
        is_temp: isTemp ? '1' : '0',
      })
      .then(({ data }) => {
        result.parseResponse(data);
      });

    return result;
  }
  static async getImageFile(imageID: number): Promise<ImageFile> {
    const result: ImageFile = new ImageFile();

    await defaultInstance.post(`/api/commons/image/`, { file_id: imageID }).then(({ data }) => {
      result.parseResponse(data);
    });

    return result;
  }
  // endregion
}

export default CommonApi;
