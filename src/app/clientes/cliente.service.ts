import { Injectable } from '@angular/core';
import {formatDate,DatePipe,registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es-UY';
import { Cliente } from './cliente';
import {CLIENTES} from './clientes.json';
import { Observable } from 'rxjs';
import { of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import  {map, catchError, tap} from 'rxjs/operators'
import Swal from 'sweetalert2'

import {Router} from '@angular/router'
import { Region } from './region';


 
@Injectable(/*{
  providedIn: 'root'
}*/)
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeadres:HttpHeaders = new HttpHeaders();
  constructor(private http: HttpClient, private router:Router) { }

 getRegiones():Observable<Region[]>{
  return this.http.get<Region[]>(this.urlEndPoint +'/regiones')
 }

////CON PAGINACION
 getClientes(page: number): Observable<any>{
    
    return this.http.get(this.urlEndPoint +'/page/' + page).pipe(
      tap( (response:any) =>{
        console.log('ClienteService -> tab 1');

        
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map((response:any) => {
        (response.content as Cliente[]).map(cliente=> {
          cliente.nombre = cliente.nombre.toUpperCase();
          
          return cliente;
        });
        return response;
      }),
      tap(response =>{
        console.log('ClienteService -> tab 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  /////SIN PAGINACION
  ///////getClientes(): Observable<Cliente[]>{
    //return of(CLIENTES);
    // opcion 1 castear la clase de retorno
    ///////return this.http.get(this.urlEndPoint).pipe(
     /////// tap(response =>{
     ///////   console.log('ClienteService -> tab 1');

     ///////   let clientes  = response as Cliente[];
     ///////   clientes.forEach(cliente => {
     ///////     console.log(cliente.nombre);
     ///////   })
     /////// }),
    ///////  map(response => {

     ///////   let clientes  = response as Cliente[];

     ///////   return clientes.map(cliente=> {
     ///////     cliente.nombre = cliente.nombre.toUpperCase();
          
     ///////     let datePipe = new DatePipe('es-UY');
          //cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd, MMMM yyyy');
          //cliente.createAt = datePipe.transform(cliente.createAt,'dd/MM/yyyy');
          //cliente.createAt = formatDate(cliente.createAt,'dd/MM/yyyy','en-US');
     ///////     return cliente;
     ///////   }
    ///////      );
    ///////  }),
    ///////  tap(response =>{
    ///////    console.log('ClienteService -> tab 2');
    ///////    response.forEach(cliente => {
    ///////      console.log(cliente.nombre);
    ///////    })
    ///////  })
    ///////); 
    // opcion 2 mapear la clase de retorno
    //return this.http.get(this.urlEndPoint).pipe(
    //  map( response => response as Cliente[])
      //lo anterior es igual a escribir lo siguiente
      //map( function(response) {
      //  return response as Cliente[];
      //}
      //)
    //); 
    
  ///////}
  create(cliente:Cliente):Observable<Cliente>{
    return this.http.post(this.urlEndPoint,cliente, {headers: this.httpHeadres}).pipe(
      map((response:any)=> response.cliente as Cliente ),
      catchError(e=> {
        //this.router.navigate(['/clientes/form']);
        if(e.status==400){
          return throwError(e); 
        }
        Swal.fire(
          e.error.mensaje,
          e.error.error,
          'error'
        );
        return throwError(e);        
      })
    );    
  }

  getCliente(id):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e=> {
        this.router.navigate(['/clientes']);
        Swal.fire(
          'Error al consultar',
          e.error.mensaje,
          'error'
        );
        return throwError(e);        
      })
    );      
  }

  update(cliente:Cliente) :Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers:this.httpHeadres}).pipe(
      catchError(e=> {
        //this.router.navigate(['/clientes/form']);
        if(e.status==400){
          return throwError(e); 
        }
        Swal.fire(
          e.error.mensaje,
          e.error.error,
          'error'
        );
        return throwError(e);        
      })
    );    
  }

  delete(id:number) :Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers:this.httpHeadres}).pipe(
      catchError(e=> {
        //this.router.navigate(['/clientes/form']);
        Swal.fire(
          e.error.mensaje,
          e.error.error,
          'error'
        );
        return throwError(e);        
      })
    );     
  }

//  subirFoto(archivo: File, id): Observable<Cliente>{
    subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    //return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(
      return this.http.request(req)
      //.pipe(
      //map( (response: any) => response.cliente as Cliente), 
     // catchError(e=> {
      //  Swal.fire(
      //    e.error.mensaje,
     //     e.error.error,
      //    'error'
      //  );
      //  return throwError(e);        
      //})
    //)
  }

}
