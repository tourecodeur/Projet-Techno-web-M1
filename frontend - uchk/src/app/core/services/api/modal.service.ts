import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  closeModal(modalId: string) {
    document.getElementById(modalId)?.classList.remove('show');
    document.body.classList.remove('modal-open');
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach(backdrop => backdrop.remove());
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
  
}
