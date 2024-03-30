import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Asegúrate de importar MatPaginator desde '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SearchService } from '../../services/search.service';
@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
  standalone: true,
  imports: [MatTabsModule, MatTableModule, MatPaginatorModule, MatExpansionModule, CommonModule],
})
export class ConsultaComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
 

  @ViewChild(MatPaginator) paginator!: MatPaginator;  
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.searchService.getSearchQuery().subscribe(query => {
      this.dataSource.filter = query.trim().toLowerCase();
    });
    this.searchService.getSearchQuery().subscribe(query => {
      this.dataSource2.filter = query.trim().toLowerCase(); 
    }); 
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
 
  // segunda tabla
  ELEMENT_DATA_2: Element[] = [
    { name: 'Persona 1', age: 25 },
    { name: 'Persona 2', age: 30 },
    // Agrega más datos si es necesario
  ];
  dataSource2 = new MatTableDataSource<Element>(this.ELEMENT_DATA_2);

  displayedColumns2: string[] = ['name', 'age', 'details']; // Actualiza las columnas a mostrar

  expandedElement: Element | null = null;

  toggleExpansion(element: Element): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

// segunda tabla
export interface Element {
  name: string;
  age: number;
}
