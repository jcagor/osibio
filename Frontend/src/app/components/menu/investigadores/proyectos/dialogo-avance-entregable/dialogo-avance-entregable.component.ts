import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ProyectoyproductoService } from '../../../services/proyectoyproducto';
import * as moment from 'moment';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dialogo-avance-entregable',
  standalone: true,
  templateUrl: './dialogo-avance-entregable.component.html',
  styleUrls: ['./dialogo-avance-entregable.component.css'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatDatepickerModule,
    CommonModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule,
    AsyncPipe,
    HttpClientModule
  ],
})
export class DialogoAvanceEntregableComponent implements OnInit {

  buttonTitle!: string;
  title!: string;
  type!: string;
  data!: any;
  hide = true;
  estadoProcesoData!: string;
  registroForm: any;
  proyectosData: any[] = [];
  productosData: any[] = [];

  tipoAvance = 'Url';
  opcionAvance: string[] = ['Url', 'Adjunto'];
  selectedFile: File = null!;

  estadosProceso: string[] = [
    'Aprobado',
    'Rechazado',
    'Corregir',
    'Espera'
  ];

  @ViewChild('fileUpload')
  fileUpload!: ElementRef

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
      type: string,
      data: any,
    },
    private formBuilder: FormBuilder,
    private proyectoyproductoService: ProyectoyproductoService,
    private readonly dialogRef: MatDialogRef<DialogoAvanceEntregableComponent>
  ) { }

  ngOnInit(): void {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;

    this.registroForm = this.formBuilder.group({
      url: ['', ],
      soporte: ['',this.selectedFile],
    });

    this.estadoProcesoData = this.data?.estadoProceso;
    if(this.type === 'Proyecto') {
      this.obtenerEntregableProyecto();
    } else {
      this.obtenerEntregableProducto();
    }
  }

  radioChange(event:any):void {
    this.tipoAvance = event.value;
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  obtenerEntregableProyecto(){
    this.proyectoyproductoService.obtenerAvancesProyecto().subscribe((data) => {    
      this.proyectosData = data.reverse().filter(proyecto => proyecto.configuracionEntregableProyecto_id === this.data?.id);
    });
  }

  obtenerEntregableProducto(){
    this.proyectoyproductoService.obtenerAvancesProducto().subscribe((data) => {    
      this.productosData = data.reverse().filter(producto => producto.configuracionEntregableProducto_id === this.data?.id);
    });
  }

  get soporte() {
    return this.registroForm.get('soporte');
  }
  get url() {
    return this.registroForm.get('url');
  }

  guardarTramite() {
    if (this.registroForm.valid) {
      if(this.type === 'Proyecto') {
        const tramiteGeneral = {
          soporte: this.selectedFile,
          url: this.url?.value,
          fecha: moment(new Date()).format('YYYY-MM-DD'),
          estadoProceso: 'Espera',
          configuracionEntregableProyecto_id_id: this.data?.id,
        };
        this.proyectoyproductoService.avanceEntregablesProyecto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado el avance:', resp);
            this.registroForm.reset();
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al notificar:', error);
          }
        );
      } else {
        const tramiteGeneral = {
          soporte: this.selectedFile,
          url: this.url?.value,
          fecha: moment(new Date()).format('YYYY-MM-DD'),
          estadoProceso: 'Espera',
          configuracionEntregableProducto_id_id: this.data?.id,
        };
        this.proyectoyproductoService.avanceEntregablesProducto(tramiteGeneral).subscribe(
          (resp) => {
            console.log('Se ha registrado el avance:', resp);
            this.registroForm.reset();
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error al notificar:', error);
          }
        );
      }
    }
  }

}
