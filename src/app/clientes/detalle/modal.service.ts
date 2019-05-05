import { Injectable } from '@angular/core';
import { Cliente } from '../cliente';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  constructor() { }

  abrirModal(){
    this.modal =  true;    
    console.log("Abrir Modal en Modal Services");

  }

  cerrarModal(){
    this.modal =  false;    
  }
}
