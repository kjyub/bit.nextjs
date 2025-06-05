import * as cheerio from 'cheerio';
// import Cheerio from "cheerio"
import { isEqual } from 'lodash';
import TypeUtils from './TypeUtils';

// const SANITIZE_CONFIG = {
//   allowedTags: ['img'],
//   allowedAttributes: {
//     '*': ['style'],
//     img: ['src', 'alt', 'style'],
//   },
//   disallowedTags: ['html', 'head', 'body'],
// }
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
  // 텍스트 에디터 내용에 있는 파일 소스 URL은 서버주소를 포함하지 않기 때문에 붙여준다.
  export function replaceMedieFileURL(content: string): string {
    if (!content) {
      return '';
    }
    // const cheerio = require("cheerio")
    const bs = cheerio.load(content);

    bs('img').each((_i, el) => {
      const oldSrc = bs(el).attr('src');
      const newSrc = FileUtils.getMediaURL() + oldSrc;
      bs(el).attr('src', newSrc);
    });

    return bs.html();
  }
  // 텍스트 에디터 내용을 안전하게 사용하지 않는 태그들을 제거한다.
  export function getSantinizedContent(content: string): string {
    // const sanitized = sanitizeHtml(content, SANITIZE_CONFIG)
    // const sanitized = dompurify.sanitize(content, {FORCE_BODY: true})
    // return sanitized
    return content; // CKEditor5는 내용 업데이트 시 자체 sanitze기능이 있다.
  }
  // 텍스트 에디터 내용을 다시 업로드할 때 서버 주소를 다시 제거한다.
  export function removeMediaFileURL(content: string): string {
    if (!content) {
      return content;
    }

    return content.replace(FileUtils.getMediaURL(), '');
  }
  // 텍스트 에디터 내용을 다시 업로드할 때 서버에 저장용으로 처리한다.
  export function getRequestContent(content: string): string {
    let converted = content;
    converted = FileUtils.removeMediaFileURL(converted);
    converted = FileUtils.getSantinizedContent(converted);

    return converted;
  }
  export const BLANK_CONTENT = '<p><br></p>';
  // 텍스트 에디터의 내용을 비교한다.
  export function equalsContent(html1: string, html2: string): boolean {
    if (!html1 || !html2) {
      return false;
    }
    // const cheerio = require("cheerio")

    // 1. cheerio 모듈을 사용하여 비교할 두 HTML 문자열을 각각 파싱합니다.
    try {
      let sanitized1 = FileUtils.getSantinizedContent(html1);
      let sanitized2 = FileUtils.getSantinizedContent(html2);

      // 내용을 다시 모두 지운 경우 "<p><br></p>"가 되기 때문에 이런 경우 빈 텍스트로 바꾼다.
      if (sanitized1 === FileUtils.BLANK_CONTENT) {
        sanitized1 = '';
      }
      if (sanitized2 === FileUtils.BLANK_CONTENT) {
        sanitized2 = '';
      }

      const $1 = cheerio.load(sanitized1);
      const $2 = cheerio.load(sanitized2);

      // 2. 두 DOM 트리에서 순서대로 모든 요소를 가져옵니다.
      const elements1 = $1('*').toArray();
      const elements2 = $2('*').toArray();

      // 4. 두 요소가 다른 경우, 두 요소가 다른 것으로 판별하고 비교를 중단합니다.
      for (let i = 0; i < elements1.length; i++) {
        if (!isEqual(elements1[i], elements2[i])) {
          return false;
        }
      }

      // 5. 모든 요소를 비교한 후에도 동일한 경우, 두 HTML은 동일한 것으로 간주합니다.
      return true;
    } catch {
      return true;
    }
  }
  export function isBlankContent(content: string): boolean {
    return !content || content === FileUtils.BLANK_CONTENT;
  }
  export function isFileOverVolume(fileSize: number, fileSizeMB = 10): boolean {
    // 파일 사이즈가 더 크면 true
    // 파일 사이즈가 더 작으면 false
    const maxFileSize = fileSizeMB * 1024 * 1024;
    if (fileSize > maxFileSize) {
      return true;
    } else {
      return false;
    }
  }
  export function getFileSize(file: File): string {
    const sizeInBytes = file.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (sizeInBytes === 0) return '0 Byte';
    const i = Number.parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)).toString());
    return `${TypeUtils.round(sizeInBytes / 1024 ** i, 2)} ${sizes[i]}`;
  }
  // html 태그들을 제거하고 텍스트만 가져온다.
  export function getTextContent(content: string): string {
    return content.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi, '');
  }
}

export default FileUtils;
