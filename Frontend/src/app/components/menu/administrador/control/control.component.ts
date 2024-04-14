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
@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css'],
  standalone: true,
  imports: [MatTabsModule, MatSlideToggleModule, MatDividerModule, MatListModule, MatMenuModule, MatButtonModule,CommonModule,FormsModule,MatTableModule,MatIconModule,ReactiveFormsModule,MatSnackBarModule],
})
export class ControlComponent {
  usuarios: any[] = [];

  displayedColumns = ['Nombre', 'Rol', 'Estado'];
  dataSource: MatTableDataSource<any>;

  displayedColumns2 = ['Nombre del Proyecto', 'Lider del Proyecto', 'Estado', ];
  dataSource2: MatTableDataSource<PeriodicElement2>;

  displayedColumns3 = ['Nombre del Producto', 'Lider del Producto', 'Estado', 'Fecha'];
  dataSource3: MatTableDataSource<PeriodicElement3>;

  

  constructor(
    private investigadorService: InvestigadorService, 
    private searchService: SearchService,
    private _snackBar: MatSnackBar) {
    
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource2 = new MatTableDataSource<any>([]);
    this.dataSource3 = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.searchService.getSearchQuery().subscribe(query => {
      // Aplica el filtro a dataSource
      this.dataSource.filter = query.trim().toLowerCase();
      
      // Aplica el filtro a dataSource2
      this.dataSource2.filter = query.trim().toLowerCase();
      
      // Aplica el filtro a dataSource3
      this.dataSource3.filter = query.trim().toLowerCase();
    });
  }

  obtenerUsuarios() {
    this.investigadorService.getUsuarios().subscribe(
      (usuarios) => {

        console.log('Usuarios recuperados:', usuarios);
        this.usuarios = usuarios;
        const usuariosSort = usuarios.sort((a, b) => (a.nombre < b.nombre ? -1 : 1))

        this.dataSource.data = usuariosSort;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
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
 
  cambiarEstado(usuario: any) {
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
 
  
}
export interface PeriodicElement {
  nombre: string;
  rolinvestigador: String;
  estado: String;
  }

export interface PeriodicElement2 {
    nombre: string;
    Lider: String;
    estado: String;
  }
export interface PeriodicElement3 {
      nombre: string;
      Lider: String;
      estado: String;
  }