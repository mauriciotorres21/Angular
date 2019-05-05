import { Component, OnInit} from '@angular/core';
import { Cliente } from './cliente';
import {CLIENTES} from './clientes.json'
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import Swal from 'sweetalert2'
import {tap} from 'rxjs/operators'
import { ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] =[
    { id:1 ,nombre:'Mauricio', apellido: 'Torres', createAt: '12-01-2019', email:'mauritorres21@gmail.com', foto:'', region: {
      id: 1,
      nombre: 'Sudamérica'
    }   },
    { id:2 ,nombre:'Ana', apellido: 'Rey', createAt: '12-01-2019', email:'analaurarey@gmail.com', foto:'', region: {
      id: 1,
      nombre: 'Sudamérica'
    }   }
  ]
  paginador: any
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService, 
    private modalService: ModalService, 
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');
      if(!page){
        page=0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response => {
          console.log('ClientesComponent -> tab 3');
          (response.content as Cliente[]).forEach(cliente => {
                  console.log(cliente.nombre);
                })
        })
        
            ).subscribe(
              response => {
                this.clientes = response.content as Cliente[]
                this.paginador = response;
              }
              /*
              function (clientes){
                this.clientes = clientess
              }*/
            );
    }

    )
    
  }
  public delete(cliente:Cliente):void{
    const swalWithBootstrapButtons = Swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Está seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido} `,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli!==cliente)
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con éxito.`,
              'success'
            )
          }
        )
      } 
    })
  }

  abrirModal(cliente: Cliente){
    console.log("Abrir Modal en Clientes Component");
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
  getFotoActualizada($event) {
    this.clienteSeleccionado.foto = $event;
    //this.clienteSeleccionado.foto = $event;
  }
}
