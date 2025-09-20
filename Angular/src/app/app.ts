import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { DetalleVenta } from "./detalle-venta/detalle-venta";
import { Inicio } from "./inicio/inicio";
import { HistorialVenta } from "./historial-venta/historial-venta";
import { IngresoEgreso } from "./ingreso-egreso/ingreso-egreso";
import { Inventario } from "./inventario/inventario";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, DetalleVenta, Inicio, HistorialVenta, IngresoEgreso, Inventario],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Angular');
}
