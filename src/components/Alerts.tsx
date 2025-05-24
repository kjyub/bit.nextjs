import Swal from 'sweetalert2';

const swal = Swal.mixin({
  customClass: {
    popup: 'popup', // 전체
    confirmButton: 'confirmButton', // 취소
    cancelButton: 'cancelButton', // 삭제
    title: 'title', // 타이틀
    htmlContainer: 'htmlContainer', // 내용
  },
  buttonsStyling: false,
});

class Alerts {
  static alert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info') {
    swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: '확인',
      denyButtonText: '거절',
      cancelButtonText: '취소',
    });
  }
}

export default Alerts;
