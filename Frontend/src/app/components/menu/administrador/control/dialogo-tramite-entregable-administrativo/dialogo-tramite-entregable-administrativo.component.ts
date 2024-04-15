import { NgFor } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { EstudiantesService } from "../../../services/estudiantes";
import { Estudiantes } from "../../../modelo/proyectos";
import { ProyectoyproductoService } from "../../../services/proyectoyproducto";


@Component({
  selector: 'app-dialogo-tramite-entregable-administrativo',
  standalone: true,
  templateUrl: './dialogo-tramite-entregable-administrativo.component.html',
  styleUrls: ['./dialogo-tramite-entregable-administrativo.component.css'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatDatepickerModule
  ],
})
export class DialogoTramiteEntregableAdministrativoComponent implements OnInit {

  buttonTitle!: string;
  title!: string;
  type!: string;
  data!: any;
  public registroForm: FormGroup;
  hide = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      buttonTitle: string,
      type: string,
      data: any,
    },
    private formBuilder: FormBuilder,
    private proyectoyproductoService: ProyectoyproductoService,
    private readonly dialogRef: MatDialogRef<DialogoTramiteEntregableAdministrativoComponent>
  ) { 
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      calidad: ['', [Validators.required]],
      entregable: ['', [Validators.required]],
      pendiente: ['', [Validators.required]],
      clasificacion: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    this.title = this.dialogData.title;
    this.buttonTitle = this.dialogData.buttonTitle;
    this.type = this.dialogData.type;
    this.data = this.dialogData.data;
    console.log('data => ',this.data)
    console.log('type => ',this.type)
  }

  get nombre() {
    return this.registroForm.get('nombre');
  }
  get titulo() {
    return this.registroForm.get('titulo');
  }
  get calidad() {
    return this.registroForm.get('calidad');
  }
  get entregable() {
    return this.registroForm.get('entregable');
  }
  get pendiente() {
    return this.registroForm.get('pendiente');
  }
  get clasificacion() {
    return this.registroForm.get('clasificacion');
  }

  guardarEntregableAdministrativo() {
    if (this.registroForm.valid) {
      const entregableAdministrativo: any = {
        nombre: this.nombre?.value,
        titulo: this.titulo?.value,
        calidad: this.calidad?.value,
        entregable: this.entregable?.value,
        pendiente: this.pendiente?.value,
        clasificacion: this.clasificacion?.value,
      };

      if(this.type === 'Proyecto') {
        entregableAdministrativo.proyecto_id_id = this.data.codigo;
      } else {

      }
      console.log('guardarEntregableAdministrativo => ',entregableAdministrativo);
      this.proyectoyproductoService.crearEntregableAdministrativoProyecto(entregableAdministrativo).subscribe(
        (resp) => {
          console.log('Se ha registrado la notificación:', resp);
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
