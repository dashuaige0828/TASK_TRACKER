import { Component } from '@angular/core';
import { TaskComponent } from './Task/task.component';

@Component({
  selector: 'app-root',
  imports: [TaskComponent],
  templateUrl: './app.html',
})
export class App {}