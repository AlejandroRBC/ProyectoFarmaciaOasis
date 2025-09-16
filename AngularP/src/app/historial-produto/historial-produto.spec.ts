import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialProduto } from './historial-produto';

describe('HistorialProduto', () => {
  let component: HistorialProduto;
  let fixture: ComponentFixture<HistorialProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
