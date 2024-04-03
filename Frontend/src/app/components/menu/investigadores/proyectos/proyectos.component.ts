import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Asegúrate de importar MatPaginator desde '@angular/material/paginator'
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';

import { MatSelectModule } from '@angular/material/select';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';

import { AsyncPipe } from '@angular/common';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Investigador } from '../../modelo/investigador';
import { Producto } from '../../modelo/productos';
import { Coinvestigador, Proyecto } from '../../modelo/proyectos';
import { ProyectoyproductoService } from '../../services/proyectoyproducto';
import { InvestigadorService } from '../../services/registroInvestigador';
import { SearchService } from '../../services/search.service';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { AutenticacionService } from '../../services/autenticacion';
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatStepperModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule,
    MatRadioModule,
    CommonModule,
    HttpClientModule,
    MatButtonModule, MatDialogModule
  ],
})
export class ProyectosComponent implements OnInit {
  //mostrar los coinvestigadores que hay
  separatorKeysCodes: number[] = [13, 188];
  investigatorCtrl = new FormControl('');
  filteredInvestigators!: Observable<{ correo: string; }[]>;
  activeInvestigators: { correo: string; }[] = [];
  selectedInvestigators: string[] = [];
  proyecto: Proyecto = {};
  origenData: any[] = [
    {value: 'nacional', viewValue: 'nacional'},
    {value: 'internacional', viewValue: 'internacional'},
  ];
  modalidadData: any[] = [
    {value: 'general', viewValue: 'general'},
    {value: 'clinical', viewValue: 'clinical'},
    {value: 'creación', viewValue: 'creación'},
  ];
  nivelRiesgoEticoData: any[] = [
    {value: 'Alto', viewValue: 'Alto'},
    {value: 'Medio', viewValue: 'Medio'},
    {value: 'Bajo', viewValue: 'Bajo'},
    {value: 'Sin riesgo', viewValue: 'Sin riesgo'},
  ];
  estadoProcesoData: any[] = [
    {value: 'Aprobado', viewValue: 'Aprobado'},
    {value: 'Rechazado', viewValue: 'Rechazado'},
    {value: 'Corregir', viewValue: 'Corregir'},
    {value: 'Espera', viewValue: 'Espera'},
  ];
  // indice dinámico para tablas
  generalIndex!: number;
  // índice de las pestaña Proyectos y Nuevo
  demo1TabIndex!: number;

  @ViewChild('investigatorInput')
  investigatorInput!: ElementRef<HTMLInputElement>;

  constructor(
    private ProyectoyproductoService: ProyectoyproductoService,
    private formBuilder: FormBuilder,
    private investigatorService: InvestigadorService,
    private SearchService:SearchService,
    private AutenticacionService:AutenticacionService,
    public dialog: MatDialog
    
  ) {
    this.firstFormGroup = this.formBuilder.group({
      codigo: [''],
      fecha: [''],
      titulo: [''],
      investigador: [''],
      unidadAcademica: [''],
      coinvestigadores: ['', this.selectedInvestigators],
      area: [''],
      porcentajeEjecucionCorte: [''],
      entidadPostulo: this.formBuilder.group({
        id: [''],
        nombreInstitucion: [''],
        nombreGrupo: [''],
      }),
      financiacion: this.formBuilder.group({
        id: [''],
        valorPropuestoFin: [''],
        valorEjecutadoFin: [''],
      }),
      grupoInvestigacionPro: [''],
      porcentajeEjecucionFinCorte: [''],
      porcentajeAvance: [''],
      soporte: ['',this.selectedFileProyecto],
      transacciones: this.formBuilder.group({
        id: [''],
        fecha_transacciones: [''],
        acta: [''],
        descripcion: [''],
      }),
      origen: [''],
      convocatoria: [''],
      ubicacionProyecto: this.formBuilder.group({
        id: [''],
        instalacion: [''],
        municipio: [''],
        departamento: [''],
        pais: [''],
      }),
      estadoProyecto: new FormControl(''),
      modalidadProyecto: [''],
      nivelRiesgoEtico: [''],
      lineaInvestigacion: [''],
      entregableAdministrativo: this.formBuilder.group({
        id: [''],
        titulo: [''],
        nombre: [''],
        calidad: [''],
        entregable: [''],
        pendiente: [''],
        clasificacion: [''],
      }),
    });
    this.secondFormGroup = this.formBuilder.group({
        id: [''],
        tituloProducto: [''],
        rolProducto: [''],
        investigador: [''],
        listaProducto: this.formBuilder.group({
          articulo: this.formBuilder.group({
            id:[''],
            fuente:[''],
          }),
          capitulo: this.formBuilder.group({
            id:[''],
            nombrepublicacion:[''],
            isbn :[''],
            fecha:[''],
            editorial:[''],
          }),
          software: this.formBuilder.group({
            id:[''],
            tiporegistro:[''],
            numero:[''],
            fecha:[''],
            pais:[''],
          }),
          libro: this.formBuilder.group({
            id:[''],
            isbn:[''],
            fecha:[''],
            editorial:[''],
            luegarpublicacion:[''],
          }),
          prototipoIndustrial: this.formBuilder.group({
            id:[''],
            fecha:[''],
            pais:[''],
            insitutofinanciador:[''],
          }),
          evento: this.formBuilder.group({
            id:[''],
            fechainicio:[''],
            fechafin:[''],
            numparticinerno:[''],
            numparticexterno:[''],
            tipoevento:[''],
          }),
          reconocimiento: this.formBuilder.group({
            id:[''],
            fecha:[''],
            nombentidadotorgada:[''],
          }),
          consultoria: this.formBuilder.group({
            id:[''],
            año:[''],
            contrato:this.formBuilder.group({
              id:[''],
              nombre:[''],
              numero:[''],
            }),
            nombreEntidad:[''],
          }),
          contenido: this.formBuilder.group({
            id:[''],
            paginaWeb:[''],
            nombreEntidad:[''],
          }),
          pregFinalizadoyCurso: this.formBuilder.group({
            id:[''],
            fechaInicio:[''],
            reconocimientos:[''],
            numeroPaginas:[''],
          }),
          apropiacion: this.formBuilder.group({
            id:[''],
            fechainicio:[''],
            fechaFin:[''],
            licencia:this.formBuilder.group({
              id:[''],
              nombre:[''],
            }),
            formato:[''],
            medio:[''],
            nombreEntidad:[''],
          }),
          maestria: this.formBuilder.group({
            id:[''],
            fechaInicio:[''],
            institucion:[''],
          }),
          proyectoCursoProducto: [''],
          proyectoFormuladoProducto: [''],
          proyectoRSUProducto: [''],
        }),
        cuartilEsperado: [''],
        categoriaMinciencias: [''],
        tipologiaProducto: [''],
        publicacion: [''],
        estudiantes: [''],
        estadoProdIniSemestre: [''],
        porcentanjeAvanFinSemestre: [''],
        observaciones: [''],
        estadoProducto: [''],
        porcentajeComSemestral: [''],
        porcentajeRealMensual: [''],
        fecha: [''],
        origen: [''],
        Soporte: ['',this.selectedFileProyecto],
    });
    this.productoFormGroup = this.formBuilder.group({
      id: [''],
      tituloProducto: [''],
      rolProducto: [''],
      investigador: [''],
      listaProducto: this.formBuilder.group({
        id:[''],
        articulo: this.formBuilder.group({
          id:[''],
          fuente:[''],
        }),
        capitulo: this.formBuilder.group({
          id:[''],
          nombrepublicacion:[''],
          isbn :[''],
          fecha:[''],
          editorial:[''],
        }),
        software: this.formBuilder.group({
          id:[''],
          tiporegistro:[''],
          numero:[''],
          fecha:[''],
          pais:[''],
        }),
        libro: this.formBuilder.group({
          id:[''],
          isbn:[''],
          fecha:[''],
          editorial:[''],
          luegarpublicacion:[''],
        }),
        prototipoIndustrial: this.formBuilder.group({
          id:[''],
          fecha:[''],
          pais:[''],
          insitutofinanciador:[''],
        }),
        evento: this.formBuilder.group({
          id:[''],
          fechainicio:[''],
          fechafin:[''],
          numparticinerno:[''],
          numparticexterno:[''],
          tipoevento:[''],
        }),
        reconocimiento: this.formBuilder.group({
          id:[''],
          fecha:[''],
          nombentidadotorgada:[''],
        }),
        consultoria: this.formBuilder.group({
          id:[''],
          año:[''],
          contrato:this.formBuilder.group({
            id:[''],
            nombre:[''],
            numero:[''],
          }),
          nombreEntidad:[''],
        }),
        contenido: this.formBuilder.group({
          id:[''],
          paginaWeb:[''],
          nombreEntidad:[''],
        }),
        pregFinalizadoyCurso: this.formBuilder.group({
          id:[''],
          fechaInicio:[''],
          reconocimientos:[''],
          numeroPaginas:[''],
        }),
        apropiacion: this.formBuilder.group({
          id:[''],
          fechainicio:[''],
          fechaFin:[''],
          licencia:this.formBuilder.group({
            id:[''],
            nombre:[''],
          }),
          formato:[''],
          medio:[''],
          nombreEntidad:[''],
        }),
        maestria: this.formBuilder.group({
          id:[''],
          fechaInicio:[''],
          institucion:[''],
        }),
        proyectoCursoProducto: [''],
        proyectoFormuladoProducto: [''],
        proyectoRSUProducto: [''],
      }),
      publicacion: [''],
      estudiantes: [''],
      estadoProdIniSemestre: [''],
      porcentanjeAvanFinSemestre: [''],
      observaciones: [''],
      estadoProducto: [''],
      porcentajeComSemestral: [''],
      porcentajeRealMensual: [''],
      fecha:[new Date()],
      origen: [''],
      Soporte: ['',this.FileProducto],
    });
  }
  

  ngOnInit(): void {
    this.obtenerProyectos();
    this.obtenerUsuarios();
    this.configurarDatasource();
  }

  obtenerUsuarios(){
    this.activeInvestigators = []; // Inicializa activeInvestigators como un array vacío
    this.selectedInvestigators = []; // Asegúrate de que selectedInvestigators esté vacío al principio
    this.investigatorService.getUsuarios().subscribe((data) => {      
      this.activeInvestigators = data.map((investigador) => ({
        correo: investigador.correo,
      }));

      this.filteredInvestigators = this.investigatorCtrl.valueChanges.pipe(
        startWith(''),
        map((value: string | null) =>
          value ? this._filter(value) : this.activeInvestigators.slice()
        )
      );
    });
  }

  configurarDatasource(){
    this.dataSource.paginator = this.paginator;
    this.SearchService.getSearchQuery().subscribe(query => {
      this.dataSource.filter = query.trim().toLowerCase();
    });
  }

  obtenerProyectos(){
    this.ProyectoyproductoService.getProyectos().subscribe(resp => {
      this.generalIndex = resp.length + 1;
    });
  }

  addCoinvestigador(investigador: {
    correo: string;
  }) {
    const newCoinvestigador: Coinvestigador = {
      correo: investigador.correo,
    };
    if (!this.proyecto.coinvestigadores) {
      this.proyecto.coinvestigadores = [newCoinvestigador];
    } else {
      this.proyecto.coinvestigadores.push(newCoinvestigador);
    }
  }

  removeCoinvestigador(investigador: { correo: string }) {
    if (this.proyecto.coinvestigadores) {
      this.proyecto.coinvestigadores = this.proyecto.coinvestigadores.filter(
        (c) =>
          c.coinvestigador !==
          `${investigador.correo}`
      );
    }
  }

  private _filter(value: string): { correo: string }[] {
    const filterValue = value.toLowerCase();

    if (!filterValue) {
      return this.activeInvestigators.slice(); // Devuelve una copia de todos los investigadores activos si no hay entrada de usuario
    }

    // Filtrar investigadores activos que no estén en la lista de investigadores seleccionados
    const filteredActiveInvestigators = this.activeInvestigators.filter(
      (investigador) =>
        `${investigador.correo.toLowerCase()}`.includes(
          filterValue
        )
    );

    // Filtrar investigadores seleccionables que no estén ya seleccionados
    return filteredActiveInvestigators.filter(
      (investigador) =>
        !this.selectedInvestigators.includes(
          `${investigador.correo}`
        )
    );
  }

  trackByFn(
    index: number,
    item: { correo: string }
  ): number {
    return index;
  }

  remove(investigador: { correo: string }): void {
    const index = this.activeInvestigators.indexOf(investigador);

    if (index >= 0) {
      this.activeInvestigators.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const [correo] = value;
      this.activeInvestigators.push({ correo });
    }
    event.chipInput!.clear();
    this.investigatorCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const correo = event.option.value.correo;
    // Verificar si el investigador ya está en activeInvestigators
    const investigadorExistente = this.activeInvestigators.find(
      (investigador) =>
        investigador.correo === correo
    );

    if (!investigadorExistente) {
      // Agregar el investigador seleccionado solo si no está en la lista
      this.activeInvestigators.push({ correo });
      this.selectedInvestigators.push(`${correo}`);
    }

    this.investigatorInput.nativeElement.value = '';
    this.investigatorCtrl.setValue(null);
  }

  displayInvestigator(investigator: Investigador): string {
    if (
      investigator &&
      investigator.correo
    ) {
      return `${investigator.correo}`;
    } else {
      return '';
    }
  }

  //subir archivo proyecto
  selectedFileProyecto: File = null!;

  onFileSelected(event: any) {
    this.selectedFileProyecto = event.target.files[0] as File;
  }

  //subir archivo producto
  selectedFileProducto: File = null!;

  onFileSelected1(event: any) {
    this.selectedFileProducto = event.target.files[0] as File;
  }

  //mostrar productos en nuevo proyecto
  mostrarInputs: boolean = false;

  onSelectionChange(event: any) {
    this.mostrarInputs = event.value === '1';
  }

  //CREAR PROYECTO
  isEditable = true;

  //BARRAS DE PORCENTAJE
  value: number = 0;
  value2: number = 0;
  value3: number = 0;

  onValueChange(event: any) {
    this.value = Number(event.target.value); // Convertir a número
    const porcentajeEjecucionCorteControl = this.firstFormGroup.get(
      'porcentajeEjecucionCorte'
    );
    if (porcentajeEjecucionCorteControl) {
      // Verificar si porcentajeEjecucionCorteControl no es null ni undefined
      porcentajeEjecucionCorteControl.setValue(this.value.toString()); // Convertir a string y asignar el valor al control del formulario
    }
  }

  onValue2Change(event: any) {
    this.value2 = Number(event.target.value); // Convertir a número
    const porcentajeEjecucionFinCorte = this.firstFormGroup.get(
      'porcentajeEjecucionFinCorte'
    );
    if (porcentajeEjecucionFinCorte) {
      // Verificar si porcentajeEjecucionCorteControl no es null ni undefined
      porcentajeEjecucionFinCorte.setValue(this.value2.toString()); // Convertir a string y asignar el valor al control del formulario
    }
  }
  onValue3Change(event: any) {
    this.value3 = Number(event.target.value); // Convertir a número
    const porcentajeAvance = this.firstFormGroup.get('porcentajeAvance');
    if (porcentajeAvance) {
      // Verificar si porcentajeEjecucionCorteControl no es null ni undefined
      porcentajeAvance.setValue(this.value3.toString()); // Convertir a string y asignar el valor al control del formulario
    }
  }

  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;

  disabled2 = false;
  max2 = 100;
  min2 = 0;
  showTicks2 = false;
  step2 = 1;
  thumbLabel2 = false;

  disabled3 = false;
  max3 = 100;
  min3 = 0;
  showTicks3 = false;
  step3 = 1;
  thumbLabel3 = false;

  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  //------------------------------------------Guardar proyecto -----------------------------------
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;

  get codigo() {
    return this.firstFormGroup.get('codigo');
  }
  get fecha() {
    return this.firstFormGroup.get('fecha');
  }
  get titulo() {
    return this.firstFormGroup.get('titulo');
  }
  get investigador() {
    return this.firstFormGroup.get('investigador');
  }
  get unidadAcademica() {
    return this.firstFormGroup.get('unidadAcademica');
  }
  get producto() {
    return this.secondFormGroup.get('producto') as FormGroup;
  }
  get coinvestigadores() {
    return this.firstFormGroup.get('coinvestigadores');
  }
  get area() {
    return this.firstFormGroup.get('area');
  }
  get porcentajeEjecucionCorte() {
    return this.firstFormGroup.get('porcentajeEjecucionCorte');
  }
  get entidadPostulo() {
    return this.firstFormGroup.get('entidadPostulo');
  }
  get financiacion() {
    return this.firstFormGroup.get('financiacion');
  }
  get grupoInvestigacionPro() {
    return this.firstFormGroup.get('grupoInvestigacionPro');
  }
  get porcentajeEjecucionFinCorte() {
    return this.firstFormGroup.get('porcentajeEjecucionFinCorte');
  }
  get porcentajeAvance() {
    return this.firstFormGroup.get('porcentajeAvance');
  }
  get soporte() {
    return this.firstFormGroup.get('Soporte');
  }
  get transacciones() {
    return this.firstFormGroup.get('transacciones');
  }
  get origen() {
    return this.firstFormGroup.get('origen');
  }
  get convocatoria() {
    return this.firstFormGroup.get('convocatoria');
  }
  get ubicacionProyecto() {
    return this.firstFormGroup.get('ubicacionProyecto');
  }
  get estadoProyecto() {
    return this.firstFormGroup.get('estadoProyecto');
  }
  get modalidadProyecto() {
    return this.firstFormGroup.get('modalidadProyecto');
  }
  get nivelRiesgoEtico() {
    return this.firstFormGroup.get('nivelRiesgoEtico');
  }
  get lineaInvestigacion() {
    return this.firstFormGroup.get('lineaInvestigacion');
  }
  get entregableAdministrativo() {
    return this.firstFormGroup.get('entregableAdministrativo');
  }

  onSaveForm(): void {
    console.log('Producto:', this.secondFormGroup.value);
    console.log('proyecto:', this.firstFormGroup.value);
  }

  guardarProyecto() {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      console.log('investigatorCtrl ===> ', this.secondFormGroup.get('investigatorCtrl')?.value);

      const proyecto: Proyecto = {
        codigo: this.firstFormGroup.get('codigo')?.value,
        fecha: this.firstFormGroup.get('fecha')?.value,
        titulo: this.firstFormGroup.get('titulo')?.value,
        investigador: this.firstFormGroup.get('investigador')?.value,
        unidadAcademica: this.firstFormGroup.get('unidadAcademica')?.value,
        producto: {
          id: this.secondFormGroup.get('producto.id')?.value,
          tituloProducto: this.secondFormGroup.get('producto.tituloProducto')
            ?.value,
          rolProducto: this.secondFormGroup.get('producto.rolProducto')?.value,
          investigador: this.secondFormGroup.get('producto.investigador')
            ?.value,
          listaProducto: this.secondFormGroup.get('producto.listaProducto')
            ?.value,
          cuartilEsperado: this.secondFormGroup.get('producto.cuartilEsperado')
            ?.value,
          categoriaMinciencias: this.secondFormGroup.get(
            'producto.categoriaMinciencias'
          )?.value,
          tipologiaProducto: this.secondFormGroup.get(
            'producto.tipologiaProducto'
          )?.value,
          publicacion: this.secondFormGroup.get('producto.publicacion')?.value,
          estudiantes: this.secondFormGroup.get('producto.estudiantes')?.value,
          estadoProdIniSemestre: this.secondFormGroup.get(
            'producto.estadoProdIniSemestre'
          )?.value,
          porcentanjeAvanFinSemestre: this.secondFormGroup.get(
            'producto.porcentanjeAvanFinSemestre'
          )?.value,
          observaciones: this.secondFormGroup.get('producto.observaciones')
            ?.value,
          estadoProducto: this.secondFormGroup.get('producto.estadoProducto')
            ?.value,
          porcentajeComSemestral: this.secondFormGroup.get(
            'producto.porcentajeComSemestral'
          )?.value,
          porcentajeRealMensual: this.secondFormGroup.get(
            'producto.porcentajeRealMensual'
          )?.value,
          fecha: this.secondFormGroup.get('producto.fecha')?.value,
          origen: this.secondFormGroup.get('producto.origen')?.value,
          Soporte: this.secondFormGroup.get('producto.Soporte')?.value,
        },
        coinvestigadores: this.firstFormGroup.get('coinvestigadores')?.value,
        area: this.firstFormGroup.get('area')?.value,
        porcentajeEjecucionCorte: this.firstFormGroup.get(
          'porcentajeEjecucionCorte'
        )?.value,
        entidadPostulo: this.firstFormGroup.get('entidadPostulo')?.value,
        financiacion: this.firstFormGroup.get('financiacion')?.value,
        grupoInvestigacionPro: this.firstFormGroup.get('grupoInvestigacionPro')
          ?.value,
        porcentajeEjecucionFinCorte: this.firstFormGroup.get(
          'porcentajeEjecucionFinCorte'
        )?.value,
        porcentajeAvance: this.firstFormGroup.get('porcentajeAvance')?.value,
        soporte: this.firstFormGroup.get('soporte')?.value,
        transacciones: this.firstFormGroup.get('transacciones')?.value,
        origen: this.firstFormGroup.get('origen')?.value,
        convocatoria: this.firstFormGroup.get('convocatoria')?.value,
        ubicacionProyecto: this.firstFormGroup.get('ubicacionProyecto')?.value,
        estadoProyecto: this.firstFormGroup.get('estadoProyecto')?.value,
        modalidadProyecto: this.firstFormGroup.get('modalidadProyecto')?.value,
        nivelRiesgoEtico: this.firstFormGroup.get('nivelRiesgoEtico')?.value,
        lineaInvestigacion:
          this.firstFormGroup.get('lineaInvestigacion')?.value,
        entregableAdministrativo: this.firstFormGroup.get(
          'entregableAdministrativo'
        )?.value,
      };

      if(proyecto.entidadPostulo?.id !== undefined) {
        proyecto.entidadPostulo.id = this.generalIndex.toString();
      } 
      if(proyecto.entregableAdministrativo?.id !== undefined) {
        proyecto.entregableAdministrativo.id = this.generalIndex.toString();
      } 
      if(proyecto.financiacion?.id !== undefined) {
        proyecto.financiacion.id = this.generalIndex.toString();
      } 
      if(proyecto.producto?.id !== undefined) {
        proyecto.producto.id = this.generalIndex.toString();
      }
      if(proyecto.transacciones?.id !== undefined) {
        proyecto.transacciones.id = this.generalIndex.toString();
      } 
      if(proyecto.ubicacionProyecto?.id !== undefined) {
        proyecto.ubicacionProyecto.id = this.generalIndex.toString();
      }       
      proyecto.estadoProyecto = "Espera";
      proyecto.investigador = this.AutenticacionService.obtenerDatosUsuario().numerodocumento;

      // Llamar a la función crearProyecto para guardar el proyecto en el servidor
      this.ProyectoyproductoService.crearProyecto(proyecto).subscribe(
        (resp: any) => {
          console.log('Se ha registrado el proyecto exitosamente:', resp);
          Swal.fire({
            title: 'Registro Exitoso !!!',
            text: 'Se ha registrado el proyecto exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.ngAfterViewInit();
          this.ngOnInit();
          this.demo1TabIndex = 0;
          this.firstFormGroup.reset();
          this.secondFormGroup.reset();

        },
        (error: any) => {
          console.error('Error al registrar el proyecto:', error);
          Swal.fire({
            title: 'Oops...',
            text: 'Error al registrar el proyecto. Contacta al administrador si el error persiste',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Datos incompletos !!!',
        text: 'Por favor, completa el formulario correctamente.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }
  getEstadoProyecto() {
    this.ProyectoyproductoService.getEstadoProyecto().subscribe(
      (resp: any) => {
        console.log('Estado Proyecto:', resp);
        //this.firstFormGroup.get('entidadPostulo')?.setValue(resp);
      },
      (error: any) => {
        console.error('Error al obtener Estado Proyecto:', error);
      }
    );
  }

  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  //------------------------------------------PRODUCTO -----------------------------------
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
 
  public productoFormGroup: FormGroup;

  get id() {
    return this.productoFormGroup.get('id');
  }
  get tituloProducto() {
    return this.productoFormGroup.get('tituloProducto');
  }
  get rolProducto() {
    return this.productoFormGroup.get('rolProducto');
  }
  get investigadorPrd() {
    return this.productoFormGroup.get('investigador');
  }
  get listaProducto() {
    return this.productoFormGroup.get('listaProducto');
  }
  get cuartilEsperado() {
    return this.productoFormGroup.get('cuartilEsperado');
  }
  get categoriaMinciencias() {
    return this.productoFormGroup.get('categoriaMinciencias');
  }
  get tipologiaProducto() {
    return this.productoFormGroup.get('tipologiaProducto');
  }
  get publicacion() {
    return this.productoFormGroup.get('publicacion');
  }
  get estudiantes() {
    return this.productoFormGroup.get('estudiantes');
  }
  get estadoProdIniSemestre() {
    return this.productoFormGroup.get('estadoProdIniSemestre');
  }
  get porcentanjeAvanFinSemestre() {
    return this.productoFormGroup.get('porcentanjeAvanFinSemestre');
  }
  get observaciones() {
    return this.productoFormGroup.get('observaciones');
  }
  get estadoProducto() {
    return this.productoFormGroup.get('estadoProducto');
  }
  get porcentajeComSemestral() {
    return this.productoFormGroup.get('porcentajeComSemestral');
  }
  get porcentajeRealMensual() {
    return this.productoFormGroup.get('porcentajeRealMensual');
  }
  get fechaPrd() {
    return this.productoFormGroup.get('fecha');
  }
  get origenPrd() {
    return this.productoFormGroup.get('origen');
  }
  get Soporte() {
    return this.productoFormGroup.get('Soporte');
  }
  get tipoevento(){
    return this.productoFormGroup.get('tipoevento');
  }
  get fuente(){
    return this.productoFormGroup.get('fuente');
  }


//Estado del producto
typeEstado: string[] = ['resaccion', 'sometido', 'publicado'];

changeEstado(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target && this.estadoProducto) {
    this.estadoProducto.setValue(target.value, {
      onlySelf: true,
    });
  }
}

// tipo de evento de eventos de lista productos
typeEventos: string[] = ['Congreso', 'Seminario', 'Simposio', 'Conferencia', 'Feria', 'Encuentro academico'];

changeEventos(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target && this.tipoevento) {
    this.tipoevento.setValue(target.value, {
      onlySelf: true,
    });
  }
}

// tipo de fuente  de articulos de lista productos
typeFuente: string[] = ['Electronico', 'Impreso'];

changeFuente(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target && this.fuente) {
    this.fuente.setValue(target.value, {
      onlySelf: true,
    });
  }
}

//------------------------- PORCENTAJES -----------------------

value4: number = 0;
value5: number = 0;
value6: number = 0;

onValue4Change(event: any) {
  this.value4 = Number(event.target.value);
  const porcentanjeAvanFinSemestre = this.productoFormGroup.get(
    'porcentanjeAvanFinSemestre'
  );
  if (porcentanjeAvanFinSemestre) {
    porcentanjeAvanFinSemestre.setValue(this.value4.toString());
  }
}

onValue5Change(event: any) {
  this.value5 = Number(event.target.value);
  const porcentajeComSemestral = this.productoFormGroup.get(
    'porcentajeComSemestral'
  );
  if (porcentajeComSemestral) {
    porcentajeComSemestral.setValue(this.value5.toString());
  }
}
onValue6Change(event: any) {
  this.value6 = Number(event.target.value);
  const porcentajeRealMensual = this.productoFormGroup.get('porcentajeRealMensual');
  if (porcentajeRealMensual) {
    porcentajeRealMensual.setValue(this.value6.toString());
  }
}

disabled4 = false;
max4 = 100;
min4 = 0;
showTicks4 = false;
step4 = 1;
thumbLabel4 = false;

disabled5 = false;
max5 = 100;
min5 = 0;
showTicks5 = false;
step5 = 1;
thumbLabel5 = false;

disabled6 = false;
max6 = 100;
min6 = 0;
showTicks6 = false;
step6 = 1;
thumbLabel6 = false;

  //subir archivo producto
  FileProducto: File = null!;

  onFileSelected2(event: any) {
    this.FileProducto = event.target.files[0] as File;
  } 

  guardarProducto() {
    if (this.productoFormGroup.valid) {
        const producto: Producto = {
            id: this.productoFormGroup.value.id,
            tituloProducto: this.productoFormGroup.value.tituloProducto,
            investigador: this.productoFormGroup.value.investigador,
            listaProducto: {
                id: this.productoFormGroup.value.listaProducto.id,
                articulo: {
                    id: this.productoFormGroup.value.listaProducto.capitulo.id,
                    fuente: this.productoFormGroup.value.listaProducto.articulo.fuente
                },
                capitulo: {
                    id: this.productoFormGroup.value.listaProducto.capitulo.id,
                    nombrepublicacion: this.productoFormGroup.value.listaProducto.capitulo.nombrepublicacion,
                    isbn: this.productoFormGroup.value.listaProducto.capitulo.isbn,
                    fecha: new Date(this.productoFormGroup.value.listaProducto.capitulo.fecha).toISOString(), // Convertir fecha a ISO 8601
                    editorial: this.productoFormGroup.value.listaProducto.capitulo.editorial
                },
                software: {
                    id: this.productoFormGroup.value.listaProducto.software.id,
                    tiporegistro: this.productoFormGroup.value.listaProducto.software.tiporegistro,
                    numero: this.productoFormGroup.value.listaProducto.software.numero,
                    fecha: new Date(this.productoFormGroup.value.listaProducto.software.fecha).toISOString(), // Convertir fecha a ISO 8601
                    pais: this.productoFormGroup.value.listaProducto.software.pais
                },
                libro: {
                    id: this.productoFormGroup.value.listaProducto.libro.id,
                    isbn: this.productoFormGroup.value.listaProducto.libro.isbn,
                    fecha: new Date(this.productoFormGroup.value.listaProducto.libro.fecha).toISOString(), // Convertir fecha a ISO 8601
                    editorial: this.productoFormGroup.value.listaProducto.libro.editorial,
                    luegarpublicacion: this.productoFormGroup.value.listaProducto.libro.luegarpublicacion
                },
                prototipoIndustrial: {
                    id: this.productoFormGroup.value.listaProducto.prototipoIndustrial.id,
                    fecha: new Date(this.productoFormGroup.value.listaProducto.prototipoIndustrial.fecha).toISOString(), // Convertir fecha a ISO 8601
                    pais: this.productoFormGroup.value.listaProducto.prototipoIndustrial.pais,
                    insitutofinanciador: this.productoFormGroup.value.listaProducto.prototipoIndustrial.insitutofinanciador
                },
                evento: {
                    id: this.productoFormGroup.value.listaProducto.evento.id,
                    fechainicio: new Date(this.productoFormGroup.value.listaProducto.evento.fechainicio).toISOString(), // Convertir fecha a ISO 8601
                    fechafin: new Date(this.productoFormGroup.value.listaProducto.evento.fechafin).toISOString(), // Convertir fecha a ISO 8601
                    numparticinerno: this.productoFormGroup.value.listaProducto.evento.numparticinerno,
                    numparticexterno: this.productoFormGroup.value.listaProducto.evento.numparticexterno,
                    tipoevento: this.productoFormGroup.value.listaProducto.evento.tipoevento
                },
                reconocimiento: {
                    id: this.productoFormGroup.value.listaProducto.reconocimiento.id,
                    fecha: new Date(this.productoFormGroup.value.listaProducto.reconocimiento.fecha).toISOString(), // Convertir fecha a ISO 8601
                    nombentidadotorgada: this.productoFormGroup.value.listaProducto.reconocimiento.nombentidadotorgada
                },
                consultoria: {
                    id: this.productoFormGroup.value.listaProducto.consultoria.id,
                    año: this.productoFormGroup.value.listaProducto.consultoria.año,
                    contrato: {
                        id: this.productoFormGroup.value.listaProducto.consultoria.contrato.id,
                        nombre: this.productoFormGroup.value.listaProducto.consultoria.contrato.nombre,
                        numero: this.productoFormGroup.value.listaProducto.consultoria.contrato.numero
                    },
                    nombreEntidad: this.productoFormGroup.value.listaProducto.consultoria.nombreEntidad
                },
                contenido: {
                    id: this.productoFormGroup.value.listaProducto.contenido.id,
                    paginaWeb: this.productoFormGroup.value.listaProducto.contenido.paginaWeb,
                    nombreEntidad: this.productoFormGroup.value.listaProducto.contenido.nombreEntidad
                },
                pregFinalizadoyCurso: {
                    id: this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.id,
                    fechaInicio: new Date(this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.fechaInicio).toISOString(), // Convertir fecha a ISO 8601
                    reconocimientos: this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.reconocimientos,
                    numeroPaginas: this.productoFormGroup.value.listaProducto.pregFinalizadoyCurso.numeroPaginas
                },
                apropiacion: {
                    id: this.productoFormGroup.value.listaProducto.apropiacion.id,
                    fechainicio: new Date(this.productoFormGroup.value.listaProducto.apropiacion.fechainicio).toISOString(), // Convertir fecha a ISO 8601
                    fechaFin: new Date(this.productoFormGroup.value.listaProducto.apropiacion.fechaFin).toISOString(), // Convertir fecha a ISO 8601
                    licencia: {
                        id: this.productoFormGroup.value.listaProducto.apropiacion.licencia.id,
                        nombre: this.productoFormGroup.value.listaProducto.apropiacion.licencia.nombre
                    },
                    formato: this.productoFormGroup.value.listaProducto.apropiacion.formato,
                    medio: this.productoFormGroup.value.listaProducto.apropiacion.medio,
                    nombreEntidad: this.productoFormGroup.value.listaProducto.apropiacion.nombreEntidad
                },
                maestria: {
                    id: this.productoFormGroup.value.listaProducto.maestria.id,
                    fechaInicio: new Date(this.productoFormGroup.value.listaProducto.maestria.fechaInicio).toISOString(), // Convertir fecha a ISO 8601
                    institucion: this.productoFormGroup.value.listaProducto.maestria.institucion
                },
                proyectoCursoProducto: this.productoFormGroup.value.listaProducto.proyectoCursoProducto,
                proyectoFormuladoProducto: this.productoFormGroup.value.listaProducto.proyectoFormuladoProducto,
                proyectoRSUProducto: this.productoFormGroup.value.listaProducto.proyectoRSUProducto
            },
            publicacion: this.productoFormGroup.value.publicacion,
            estudiantes: this.productoFormGroup.value.estudiantes,
            estadoProdIniSemestre: this.productoFormGroup.value.estadoProdIniSemestre,
            porcentanjeAvanFinSemestre: this.productoFormGroup.value.porcentanjeAvanFinSemestre,
            observaciones: this.productoFormGroup.value.observaciones,
            estadoProducto: this.productoFormGroup.value.estadoProducto,
            porcentajeComSemestral: this.productoFormGroup.value.porcentajeComSemestral,
            porcentajeRealMensual: this.productoFormGroup.value.porcentajeRealMensual,
            fecha: new Date(this.productoFormGroup.value.fecha).toISOString(), // Convertir fecha a ISO 8601
            origen: this.productoFormGroup.value.origen,
            Soporte: this.FileProducto,
        };

        this.ProyectoyproductoService.crearProducto(producto).subscribe(
            (resp) => {
                console.log('Se ha registrado el usuario exitosamente:', resp);
                alert('Se ha registrado el usuario exitosamente.');
                this.productoFormGroup.reset();
            },
            (error) => {
                console.error('Error al registrar el usuario:', error);
                alert('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
            }
        );
    } else {
        alert('Por favor, completa el formulario correctamente.');
    }
}

  





  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
  //------------------------------------------TABLA -----------------------------------
  //--------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------
 
  displayedColumns: string[] = ['tipo', 'titulo', 'fecha', 'estado', 'etapa', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
    console.log("DATOS TRAIDOS:" ,this.ProyectoyproductoService.getProductosDelUsuario())
    forkJoin([
      this.ProyectoyproductoService.getProductosDelUsuario(),
      this.ProyectoyproductoService.getProyectosDelUsuario()
    ]).subscribe(([productos, proyectos]) => {

      // Ajustar los datos de los productos para asegurarse de que tengan todas las propiedades definidas en la interfaz Producto
      const productosAjustados = productos.map(producto => ({
        ...producto,
        tipo: 'Producto',
        id:producto.id,
        tituloProducto: producto.titulo_producto || '', // Asegurar que todas las propiedades definidas en la interfaz Producto estén presentes
        fecha: producto.fecha || '',
        estadoProducto: producto.estado_producto || '',
        etapa:producto.etapa|| '',
        tipologiaProducto: producto.tipologiaProducto || '',
      }));
      
      // Convertir los datos de proyectos a la misma estructura que productos
      const proyectosAjustados = proyectos.reverse().map(proyecto => ({
        tituloProducto: proyecto.titulo,
        etapa: proyecto.etapa,
        fecha: proyecto.fecha,
        estadoProceso: proyecto.estadoProceso,
        tipo: 'Proyecto',
        // Añadir las demás propiedades según sea necesario
      }));
    
      // Concatenar los datos ajustados de proyectos con los datos de productos
      const combinedData = [...proyectosAjustados, ...productosAjustados];
      
      // Asignar los datos combinados a dataSource
      this.dataSource.data = combinedData;
      //obj.sort((a, b) => (a > b ? -1 : 1))
    });
  }
  
  accionUno(element: any) {
    console.log("Editar")
  }
  
  accionDos(element: any) {
    console.log('Elemento seleccionado:', element);

    let dialogRef: MatDialogRef<any> | undefined;

    if (element.tipo === 'Producto') {
      dialogRef = this.dialog.open(DialogContentExampleDialog, {
        data: element
      });
    } else if (element.tipo === 'Proyecto') {
      dialogRef = this.dialog.open(DialogContentExampleDialog2, {
        data: element
      });
    }

    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  
}


@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule], // No es necesario importar aquí
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'dialog-content-example-dialog2', // Cambiado el selector
  templateUrl: 'dialog-content-example-dialog2.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule], // No es necesario importar aquí
})
export class DialogContentExampleDialog2 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {} // Añadido la inyección de datos
}