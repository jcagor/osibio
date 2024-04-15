import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConsultaEntregableAdministrativoComponent } from './dialogo-consulta-entregable-administrativo.component';

describe('DialogoConsultaEntregableAdministrativoComponent', () => {
  let component: DialogoConsultaEntregableAdministrativoComponent;
  let fixture: ComponentFixture<DialogoConsultaEntregableAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoConsultaEntregableAdministrativoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoConsultaEntregableAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
