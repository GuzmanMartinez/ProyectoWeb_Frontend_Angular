import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import {ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private ClienteService: ClienteService,
     private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params =>{
      let id:number = +params.get('id');
      if(id){
        this.ClienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
  }
/*
  *
  */
  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error seleccionar imagen: ', 'el archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }

  }
  /*
  *
  */
  subirFoto(){

    if(!this.fotoSeleccionada){
      swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    }else{
      this.ClienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe( event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          swal.fire('La foto se ha subido completamente!',response.mensaje, 'success');

        }
      });
    }
  }


}
