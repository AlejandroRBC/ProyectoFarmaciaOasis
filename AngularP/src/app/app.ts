import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inicio } from "./inicio/inicio";
import { Navbar } from "./navbar/navbar";
import { HistorialVentas } from './historial-ventas/historial-ventas';
import { HistorialProduto } from "./historial-produto/historial-produto";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('LaravelP');
}
