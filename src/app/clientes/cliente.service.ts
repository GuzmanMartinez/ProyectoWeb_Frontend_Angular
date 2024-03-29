import { Injectable } from '@angular/core';
//import{ formatDate, DatePipe, registerLocaleData } from '@angular/common';
//import localeES from '@angular/common/locales/global/es';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
//import {  of } from 'rxjs';

import {HttpClient, HttpHeaders, HttpRequest, HttpEvent} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import { Router} from '@angular/router';
import swal from 'sweetalert2';




@Injectable()

export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint+'/page/'+ page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
      map((response: any) => {

        (response.content as Cliente[]).map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
          /*Para Tranformar la fecha, esto se hace en clientes.component.html*/
          //registerLocaleData(localeES,'es');
          //let datePipe= new DatePipe('es');
        //  cliente.createAt = datePipe.transform(cliente.createAt,'EEE dd, MMM yyyy');//formatDate(cliente.createAt,'dd-MM-yyyy', 'en-US');
          return cliente;
        });
        return response;
      }),
    tap(response => {
      console.log('ClienteService: tap2');
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      })
    })
    );
  }

  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  getCliente(id: any): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar',e.error.mensaje,'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );
  }

  /*
  *
  */
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{

    let formData = new FormData();
    formData .append("archivo", archivo);
    formData.append("id", id);
  //  app/uploader/uploader.service.ts (upload request)


  const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
    reportProgress: true
  });

    return this.http.request(req);
    /*.pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    );*/

  }

}
