import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoEgreso } from './ingreso-egreso';

describe('IngresoEgreso', () => {
  let component: IngresoEgreso;
  let fixture: ComponentFixture<IngresoEgreso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoEgreso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresoEgreso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
