import * as cheerio from 'cheerio';
// import Cheerio from "cheerio"
import { isEqual } from 'lodash';
import CommonUtils from './CommonUtils';

// const SANITIZE_CONFIG = {
//   allowedTags: ['img'],
//   allowedAttributes: {
//     '*': ['style'],
//     img: ['src', 'alt', 'style'],
//   },
//   disallowedTags: ['html', 'head', 'body'],
// }
export default class FileUtils {
  static getMediaURL() {
    if (CommonUtils.isStringNullOrEmpty(process.env.NEXT_PUBLIC_STORAGE_SERVER)) {
      return process.env.NEXT_PUBLIC_DJANGO_SERVER + '/media/';
    } else {
      return process.env.NEXT_PUBLIC_STORAGE_SERVER + '/'; // 릴리즈서버에선 스토리지 서버로 사용한다.
    }
  }

  // 서버에 파일 URL은 서버주소를 포함하지 않기 때문에 붙여준다. (리액트에서만 붙여서 쓴다. 백엔드로 다시 보낼때는 제거해야한다.)
  static getMediaFileUrl(fileURL) {
    if (CommonUtils.isStringNullOrEmpty(fileURL)) {
      return '';
    }

    return this.getMediaURL() + fileURL;
  }
  // 해당 주소가 MediaFileURL인지 확인한다.
  static isMediaFileURL(fileURL) {
    return decodeURIComponent(fileURL).includes(this.getMediaURL());
  }
  // 텍스트 에디터 내용에 있는 파일 소스 URL은 서버주소를 포함하지 않기 때문에 붙여준다.
  static replaceMedieFileURL(content: string) {
    if (CommonUtils.isStringNullOrEmpty(content)) {
      return '';
    }
    // const cheerio = require("cheerio")
    const bs = cheerio.load(content);

    bs('img').each((_i, el) => {
      const oldSrc = bs(el).attr('src');
      const newSrc = this.getMediaURL() + oldSrc;
      bs(el).attr('src', newSrc);
    });

    return bs.html();
  }
  // 텍스트 에디터 내용을 안전하게 사용하지 않는 태그들을 제거한다.
  static getSantinizedContent(content) {
    // const sanitized = sanitizeHtml(content, SANITIZE_CONFIG)
    // const sanitized = dompurify.sanitize(content, {FORCE_BODY: true})
    // return sanitized
    return content; // CKEditor5는 내용 업데이트 시 자체 sanitze기능이 있다.
  }
  // 텍스트 에디터 내용을 다시 업로드할 때 서버 주소를 다시 제거한다.
  static removeMediaFileURL(content) {
    if (CommonUtils.isStringNullOrEmpty(content)) {
      return content;
    }

    return content.replace(this.getMediaURL(), '');
  }
  // 텍스트 에디터 내용을 다시 업로드할 때 서버에 저장용으로 처리한다.
  static getRequestContent(content) {
    let converted = content;
    converted = this.removeMediaFileURL(converted);
    converted = this.getSantinizedContent(converted);

    return converted;
  }
  static BLANK_CONTENT = '<p><br></p>';
  // 텍스트 에디터의 내용을 비교한다.
  static equalsContent(html1, html2) {
    if (CommonUtils.isStringNullOrEmpty(html1) || Utils.isStringNullOrEmpty(html2)) {
      return false;
    }
    // const cheerio = require("cheerio")

    // 1. cheerio 모듈을 사용하여 비교할 두 HTML 문자열을 각각 파싱합니다.
    try {
      let sanitized1 = this.getSantinizedContent(html1);
      let sanitized2 = this.getSantinizedContent(html2);

      // 내용을 다시 모두 지운 경우 "<p><br></p>"가 되기 때문에 이런 경우 빈 텍스트로 바꾼다.
      if (sanitized1 === this.BLANK_CONTENT) {
        sanitized1 = '';
      }
      if (sanitized2 === this.BLANK_CONTENT) {
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
  static isBlankContent(content) {
    return CommonUtils.isStringNullOrEmpty(content) || content === this.BLANK_CONTENT;
  }
  static isFileOverVolume(fileSize, fileSizeMB = 10) {
    // 파일 사이즈가 더 크면 true
    // 파일 사이즈가 더 작으면 false
    const maxFileSize = fileSizeMB * 1024 * 1024;
    if (fileSize > maxFileSize) {
      return true;
    } else {
      return false;
    }
  }
  static getFileSize(file) {
    const sizeInBytes = file.size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (sizeInBytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(sizeInBytes) / Math.log(1024)));
    return Math.round(sizeInBytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }
  // html 태그들을 제거하고 텍스트만 가져온다.
  static getTextContent(content: string) {
    return content.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/gi, '');
  }
}
