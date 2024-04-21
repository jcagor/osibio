import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { InvestigadorService } from '../../services/registroInvestigador';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ProyectoyproductoService } from '../../services/proyectoyproducto';
import { MatSelectModule } from '@angular/material/select';
import { Proyecto } from '../../modelo/proyectos';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogoTramiteComponent } from './dialogo-tramite/dialogo-tramite.component';
import Swal from 'sweetalert2'
import { DialogoConsultaEntregableAdministrativoComponent } from './dialogo-consulta-entregable-administrativo/dialogo-consulta-entregable-administrativo.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as moment from 'moment';
import { DialogoAvanceEntregableComponent } from '../../investigadores/proyectos/dialogo-avance-entregable/dialogo-avance-entregable.component';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
  standalone: true,
  imports: [
    MatTabsModule, 
    MatSlideToggleModule, 
    MatDividerModule, 
    MatListModule, 
    MatMenuModule, 
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  
})
export class ControlComponent {
  usuarios: any[] = [];
  estadosProyectos: any[] = [];
  estadosProductos: any[] = [];


  dataSource: MatTableDataSource<any>;
  dataSourceProyecto: MatTableDataSource<any>;
  dataSourceProducto: MatTableDataSource<any>;
  expandedElement: any | null;

  displayedColumnsProyecto: string[] = ['codigo', 'lider', 'estado','estadoProceso','updated_at','created_at','accion','expand'];
  columnsToDisplayWithExpandProyecto = [...this.displayedColumnsProyecto, 'expand'];
  expandedElementProyecto: any | null;

  displayedColumnsProducto: string[] = ['nombre', 'lider', 'estado','estadoProceso','updated_at','created_at','accion','expand'];
  columnsToDisplayWithExpandProducto = [...this.displayedColumnsProducto, 'expand'];
  expandedElementProducto: any | null;

  expandedDetail = false;
  expandedDetailProducto = false;

  proyectosData: any[] = [];
  productosData: any[] = [];

  constructor(
    private investigadorService: InvestigadorService, 
    private searchService: SearchService,
    private proyectoyproductoService: ProyectoyproductoService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSourceProyecto = new MatTableDataSource<any>([]);
    this.dataSourceProducto = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerProyectos();
    this.obtenerProductos();
    this.obtenerEstadosProyecto();
    this.obtenerEstadosProducto();
    this.obtenerEntregableProyecto(); 
    this.obtenerEntregableProducto();
    this.searchService.getSearchQuery().subscribe(query => {
      this.dataSource.filter = query.trim().toLowerCase();
      this.dataSourceProyecto.filter = query.trim().toLowerCase();
      this.dataSourceProducto.filter = query.trim().toLowerCase();
    });
  }

  obtenerEstadosProyecto() {
    this.proyectoyproductoService.obtenerEstadosProyecto().subscribe(
      (proyecto) => {
        this.estadosProyectos = proyecto;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerEstadosProducto() {
    this.proyectoyproductoService.obtenerEstadosProducto().subscribe(
      (producto) => {
        this.estadosProductos = producto;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtenerUsuarios() {
    this.investigadorService.getUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
        const dataSort = usuarios.sort((a, b) => (a.nombre < b.nombre ? -1 : 1))
        this.dataSource.data = dataSort;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
  obtenerProyectos() {
    this.proyectoyproductoService.getProyectos().subscribe(
      (proyecto) => {
        const dataSort = proyecto.sort((a, b) => (a.codigo < b.codigo ? -1 : 1))
        this.dataSourceProyecto.data = dataSort.reverse();
      },
      (error) => {
        console.error('Error al obtener proyectos:', error);
      }
    );
  }

  obtenerProductos() {
    this.proyectoyproductoService.getProductos().subscribe(
      (producto) => {        
        const dataSort = producto.sort((a, b) => (a.id < b.id ? -1 : 1))
        this.dataSourceProducto.data = dataSort.reverse();
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  cambiarRol(usuario: any, nuevoRol: string) {
    usuario.rolinvestigador = nuevoRol;
    this.investigadorService.actualizarInvestigador(usuario).subscribe(
      () => {
        this._snackBar.open('Registro actualizado correctamente',  'Rol',{
          duration: 2000,
        });
        console.log('Rol actualizado correctamente');
        this.ngOnInit();
      },
      (error) => {
        console.error('Error al actualizar rol:', error);
      }
    );
  }

  cambiarEstadoInvestigador(usuario: any) {
    usuario.estado = !usuario.estado; // Cambiar estado
    this.investigadorService.actualizarInvestigador(usuario).subscribe(
      () => {
        this._snackBar.open('Registro actualizado correctamente', 'Estado',{
          duration: 2000,
        });
        console.log('Estado actualizado correctamente');
        this.ngOnInit();
      },
      (error) => {
        console.error('Error al actualizar estado:', error);
      }
    );
  }

  cambiarEstadoProyecto(data: any,proyecto: Proyecto): void {
    proyecto.estado = data;
    this.proyectoyproductoService.actualizarProyecto(proyecto).subscribe(
      () => {
        this._snackBar.open('Registro actualizado correctamente', 'Estado',{
          duration: 2000,
        });
        console.log('Estado actualizado correctamente');
        this.ngOnInit();
      },
      (error) => {
        console.error('Error al actualizar estado:', error);
      }
    );
  }

  cambiarEstadoProducto(data: any,producto: any): void {
    producto.estadoProducto = data;
    this.proyectoyproductoService.actualizarProducto(producto).subscribe(
      () => {
        this._snackBar.open('Registro actualizado correctamente', 'Estado',{
          duration: 2000,
        });
        console.log('Estado actualizado correctamente');
        this.ngOnInit();
      },
      (error) => {
        console.error('Error al actualizar estado:', error);
      }
    );
  }

  openDialogoTramite(data: any, tipo:string): void {
    const dialogRef = this.dialog.open(DialogoTramiteComponent, {
      data: {
        title: 'Tramitar '+tipo,
        buttonTitle: 'CREAR',
        type:tipo,
        data:data,
      },
      width: '20%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado una notificación',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        
      } 
    });
  }

  openDialogHistorialEntregableAdministrativo(data: any, tipo:string): void {
    const dialogRef = this.dialog.open(DialogoConsultaEntregableAdministrativoComponent, {
      data: {
        title: 'Historial Entregable Administrativo',
        buttonTitle: 'CREAR',
        type:tipo,
        data:data,
      },
      width: '30%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado una notificación',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        
      } 
    });
  }

  obtenerEntregableProyecto(){
    this.proyectoyproductoService.obtenerEntregablesProyecto().subscribe((data) => {    
      const dataProject = data.reverse();
      this.proyectosData = dataProject.map(x => {
        const date1 = moment(x.fecha);
        const date2 = moment(new Date());
        return {
          created_at: x.created_at,
          descripcion: x.descripcion,
          estado: x.estado,
          estadoProceso: x.estadoProceso,
          observacion: x.observacion,
          fecha: x.fecha,
          id: x.id,
          proyecto_id: x.proyecto_id,
          updated_at: x.updated_at,
          diferenciaDias: date1.diff(date2, 'days')
        }
      })
    });
  }

  obtenerEntregableProducto(){
    this.proyectoyproductoService.obtenerEntregablesProducto().subscribe((data) => {    
      const dataProduct = data.reverse();
      this.productosData = dataProduct.map(x => {
        const date1 = moment(x.fecha);
        const date2 = moment(new Date());
        return {
          created_at: x.created_at,
          descripcion: x.descripcion,
          estado: x.estado,
          estadoProceso: x.estadoProceso,
          observacion: x.observacion,
          fecha: x.fecha,
          id: x.id,
          producto_id: x.producto_id,
          updated_at: x.updated_at,
          diferenciaDias: date1.diff(date2, 'days')
        }
      })
    });
  }

  addEvent(x:any) {
    x.select = !x.select;
  }

  openDialogoConfiguracionAvance(data: any, tipo:string):void {
    const dialogRef = this.dialog.open(DialogoAvanceEntregableComponent, {
      data: {
        title: `Entregable ${data.descripcion}`,
        buttonTitle: 'Registrar',
        type:tipo,
        data:data,
        admin: true
      },
      width: '25%',
      disableClose: true,
      panelClass: 'custom-modalbox',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
        Swal.fire({
          title: 'Registro Exitoso !!!',
          text: 'Se ha registrado el Avance',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        
      } 
    });
  }
}