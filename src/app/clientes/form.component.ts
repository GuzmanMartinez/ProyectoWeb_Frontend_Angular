import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo:string = "Crear Clientes"

public errores: string[];

  constructor(private clienteService: ClienteService,
  private router: Router,
  private activateRouter: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void{
    this.activateRouter.params.subscribe(parms => {
      let id = parms['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }

  create(): void{
    this.clienteService.create(this.cliente)
    .subscribe(cliente =>{
       this.router.navigate(['/clientes'])
       swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con exito`, 'success')
     },
     err =>{
       this.errores = err.error.errors as string[];
       console.error('Codigo de error desde el backend'+ err.status);
       console.error(err.error.errors);
     }
    );
  }

  update(): void{
    this.clienteService.update(this.cliente)
    .subscribe(cliente =>{
       this.router.navigate(['/clientes'])
       swal.fire('Cliente Actualizado', `Cliente ${cliente.nombre} actualizado con exito`, 'success')
     },
     err =>{
       this.errores = err.error.errors as string[];
       console.error('Codigo de error desde el backend'+ err.status);
       console.error(err.error.errors);
     }
    );
  }


}
