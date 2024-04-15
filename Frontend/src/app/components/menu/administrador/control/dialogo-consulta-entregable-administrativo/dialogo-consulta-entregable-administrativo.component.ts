import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-dialogo-consulta-entregable-administrativo',
  standalone: true,
  templateUrl: './dialogo-consulta-entregable-administrativo.component.html',
  styleUrls: ['./dialogo-consulta-entregable-administrativo.component.css'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgFor,
    CommonModule
  ],
})
export class DialogoConsultaEntregableAdministrativoComponent implements OnInit {

  buttonTitle!: string;
  title!: string;
  type!: string;
  data!: any;
  entregables:any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
      type: string,
      data: any,
    },
    private proyectoyproductoService: ProyectoyproductoService,
    private readonly dialogRef: MatDialogRef<DialogoConsultaEntregableAdministrativoComponent>
  ) { }

  ngOnInit(): void {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;

    if(this.type =='Proyecto'){
      this.obtenerEntregableAdministrativoProyecto(this.data);
    }

    if(this.type =='Producto'){
      this.obtenerEntregableAdministrativoProducto(this.data);
    }
  }

  
  obtenerEntregableAdministrativoProyecto(data:any): void {
    const codigo = data.codigo;
    this.proyectoyproductoService.obtenerEntregableAdministrativoProyecto().subscribe(
      (data) => {        
        const dataSort = data.filter(a => a.proyecto_id === codigo);
        this.entregables = dataSort.sort((a, b) => (a.id > b.id ? -1 : 1));
      },
      (error) => {
        console.error('Error al obtener entregables:', error);
      }
    );
  }

  obtenerEntregableAdministrativoProducto(data:any): void {
    const codigo = data.id;
    this.proyectoyproductoService.obtenerEntregableAdministrativoProducto().subscribe(
      (data) => {                
        const dataSort = data.filter(a => a.producto_id === codigo);
        this.entregables = dataSort.sort((a, b) => (a.id > b.id ? -1 : 1));
      },
      (error) => {
        console.error('Error al obtener entregables:', error);
      }
    );
  }

}
