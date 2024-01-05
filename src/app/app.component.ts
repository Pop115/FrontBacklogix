import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DataConfiguratorComponent } from './components/data-configurator/data-configurator.component';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';
import {MainPageComponent} from "./components/main-page/main-page.component";
import {BacklogixRunnerComponent} from "./components/backlogix-runner/backlogix-runner.component";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [CommonModule, RouterOutlet, DataConfiguratorComponent, LogViewerComponent, BacklogixRunnerComponent, MainPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'backlogix';
}
