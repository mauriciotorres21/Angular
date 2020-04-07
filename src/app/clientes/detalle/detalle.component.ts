import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cliente } from '../cliente'
import { ClienteService } from '../cliente.service'
import { ModalService } from './modal.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert'
import { HttpEventType } from '@angular/common/http';
import { URL_BACKEND } from '../../config/config';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  @Output() clienteOut = new EventEmitter();
  titulo: string = "Detalle del cliente";

  private imagenSeleccionda: File;
  progreso: number = 0;
  urlEndPoint: string = URL_BACKEND;

  constructor(private clienteService: ClienteService,
    private modalService: ModalService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    /*this.activateRoute.paramMap.subscribe(params => {
      let id:number = + params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    })*/

  }

  seleccionarFoto(event) {
    this.imagenSeleccionda = event.target.files[0];
    this.progreso = 0;
    console.log(this.imagenSeleccionda);
    if (this.imagenSeleccionda.type.indexOf('image') < 0) {
      swal('Error seleccionar imagen', 'El archivo debe ser del tipo Imagen', 'error');
      this.imagenSeleccionda = null;
    }
  }

  subirFoto() {
    if (!this.imagenSeleccionda) {
      swal('Error', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.imagenSeleccionda, this.cliente.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 99)
          } else if (event.type === HttpEventType.Response) {
            this.progreso = 100;
            let response: any = event.body;
            //this.cliente = cliente; 
            this.cliente = response.cliente as Cliente;
            this.clienteOut.emit(this.cliente.foto);
            swal('La foto se ha subido completamente! Actualizado', `la foto se ha subido con éxito: ${this.cliente.foto}`, 'success');
          }


        })
    }
  }

  cerrarModal(cliente: Cliente) {
    this.modalService.cerrarModal();
    this.imagenSeleccionda = null;
    this.progreso = 0;
  }
}
