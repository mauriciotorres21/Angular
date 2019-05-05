import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {Router,ActivatedRoute} from '@angular/router'
import swal from 'sweetalert'
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente:Cliente = new Cliente()
  private titulo:string = "Crerar Cliente"

  private regiones: Region[];

  private errores: string[]
  constructor(private clienteService: ClienteService,
  private router:Router, private activetedRouter: ActivatedRoute) { }
  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones=> this.regiones = regiones)
  }

cargarCliente():void{
  this.activetedRouter.params.subscribe(params=> {
  let id= params['id']
  if(id){
    this.clienteService.getCliente(id).subscribe( (cliente) => {
      if (cliente != null){
        this.cliente = cliente
      } else {
       this.create()
      } 
    })    
  }
})
}

  public create(): void {
    this.clienteService.create(this.cliente)
      .subscribe(cliente => {
        this.router.navigate(['/clientes'])
        /*swal({
          title: 'Nuevo Cliente',
          text: `Cliente ${cliente.nombre} creado con éxito!!`, 
          type:'success'})*/
          swal('Nuevo Cliente',`El cliente ${cliente.nombre} ha sido creado con éxito!`,'success')
          //alert(`Cliente ${cliente.nombre} creado con éxito!!`)
      },
      err=>{
        this.errores = err.error.errors as string[];

      }
    )
  }
  public update(): void {
    this.clienteService.update(this.cliente)
      .subscribe(response => {
        this.router.navigate(['/clientes'])
        /*swal({
          title: 'Nuevo Cliente',
          text: `Cliente ${cliente.nombre} creado con éxito!!`, 
          type:'success'})*/
          swal('Cliente Actualizado',`${response.mensaje}: ${response.cliente.nombre}`,'success')
          //alert(`Cliente ${cliente.nombre} creado con éxito!!`)
      },
      err=>{
        this.errores = err.error.errors as string[];
        
      }
    )
  }

  compararRegion(o1:Region,o2:Region):boolean{
    if(o1 === undefined && o2 === undefined){
      return true; 
    }
    return o1 == null || o2 == null ? false : o1.id === o2.id;
  }
}
