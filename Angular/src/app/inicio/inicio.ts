import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { AppFloatingConfigurator } from '../layout/component/app.floatingconfigurator';



import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inicio',
  imports: [
    ButtonModule,
    InputTextModule,
    MenuModule,
    CardModule,
    ToolbarModule,
    AppFloatingConfigurator
  ],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class Inicio {

}
