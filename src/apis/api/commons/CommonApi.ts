import { defaultInstance, fileInstance } from '@/apis/utils/instances';

import ImageFile from '@/types/common/ImageFile';

class CommonApi {
  // region File
  static async uploadImage(image: File, isBase64 = false, isTemp = false): Promise<ImageFile | null> {
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('is_base64', String(isBase64)); // boolean 값을 문자열로 변환
      formData.append('is_temp', isTemp ? '1' : '0');

      // @ts-ignore Ky의 타입 정의가 FormData를 직접 지원하지 않을 수 있으므로, 무시합니다.
      const data = await fileInstance.post('api/commons/image_write/', { body: formData }).json();
      const result = new ImageFile();
      result.parseResponse(data);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static async getImageFile(imageID: number): Promise<ImageFile | null> {
    try {
      const data = await defaultInstance.post('api/commons/image/', { json: { file_id: imageID } }).json();
      const result = new ImageFile();
      result.parseResponse(data);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // endregion
}

export default CommonApi;
