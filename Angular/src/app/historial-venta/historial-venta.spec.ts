import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialVenta } from './historial-venta';

describe('HistorialVenta', () => {
  let component: HistorialVenta;
  let fixture: ComponentFixture<HistorialVenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialVenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialVenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
