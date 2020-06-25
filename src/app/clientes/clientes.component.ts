import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService} from './cliente.service';
import Swal from 'sweetalert2';

const swal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',

})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(private  clienteService: ClienteService) { }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(
      (clientes) =>{
        this.clientes=clientes
      }
    );

  }

  delete(cliente: Cliente): void{
    swal.fire({
  title: 'Estas Seguro',
  text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Si, eliminar',
  cancelButtonText: 'No, cancelar!',
  reverseButtons: true
}).then((result) => {
  if (result.value) {

    this.clienteService.delete(cliente.id).subscribe(
        response =>{
          this.clientes = this.clientes.filter(cli => cli !== cliente)          
          swal.fire(
            'Cliente Eliminado',
            `Cliente ${cliente.nombre} eliminado con exito`,
            'success'
          )
        }
    )


  }
})

  }

}
