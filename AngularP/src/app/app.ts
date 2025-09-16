import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inventario } from './inventario/inventario';
import { DetalleVenta } from './detalle-venta/detalle-venta';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Inventario, DetalleVenta],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('AngularP');
}
