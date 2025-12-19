namespace FileUtils {
  export function getMediaURL() {
    if (!process.env.NEXT_PUBLIC_STORAGE_SERVER) {
      return `${process.env.NEXT_PUBLIC_DJANGO_SERVER}/media/`;
    } else {
      return `${process.env.NEXT_PUBLIC_STORAGE_SERVER}/`; // 릴리즈서버에선 스토리지 서버로 사용한다.
    }
  }

  // 서버에 파일 URL은 서버주소를 포함하지 않기 때문에 붙여준다. (리액트에서만 붙여서 쓴다. 백엔드로 다시 보낼때는 제거해야한다.)
  export function getMediaFileUrl(fileURL: string) {
    if (!fileURL) {
      return '';
    }

    return FileUtils.getMediaURL() + fileURL;
  }
  // 해당 주소가 MediaFileURL인지 확인한다.
  export function isMediaFileURL(fileURL: string) {
    return decodeURIComponent(fileURL).includes(FileUtils.getMediaURL());
  }
}

export default FileUtils;
