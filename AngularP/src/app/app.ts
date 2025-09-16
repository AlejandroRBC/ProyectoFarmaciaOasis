import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inicio } from "./inicio/inicio";
import { Navbar } from "./navbar/navbar";
import { HistorialVentas } from './historial-ventas/historial-ventas';
import { HistorialProduto } from "./historial-produto/historial-produto";
import { Inventario } from './inventario/inventario';
import { DetalleVenta } from './detalle-venta/detalle-venta';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Inventario, DetalleVenta, HistorialProduto, HistorialVentas, Inicio, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('AngularP');
}
