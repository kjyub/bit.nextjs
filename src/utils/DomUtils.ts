/**
 * DOM 조작 및 브라우저 API 관련 유틸리티
 */
namespace DomUtils {
  /**
   * 텍스트를 클립보드에 복사합니다.
   * @param value - 복사할 텍스트
   * @returns 성공하면 true, 실패하면 false
   */
  export async function copyClipboard(value: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * textarea의 높이를 내용에 맞게 자동 조절합니다.
   * @param e - textarea의 change 이벤트
   */
  export function setTextareaAutoHeight(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const element = e.target;

    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight + 4}px`;
  }

  /**
   * 특정 요소로 스크롤합니다.
   * @param element - 스크롤할 대상 요소
   * @param behavior - 스크롤 동작 방식
   */
  export function scrollToElement(
    element: HTMLElement,
    behavior: ScrollBehavior = 'smooth',
  ): void {
    element.scrollIntoView({ behavior, block: 'start' });
  }

  /**
   * 페이지 최상단으로 스크롤합니다.
   * @param behavior - 스크롤 동작 방식
   */
  export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({ top: 0, behavior });
  }

  /**
   * 특정 요소에 포커스를 줍니다.
   * @param selector - CSS 선택자
   */
  export function focusElement(selector: string): void {
    const element = document.querySelector<HTMLElement>(selector);
    element?.focus();
  }
}

export default DomUtils;

