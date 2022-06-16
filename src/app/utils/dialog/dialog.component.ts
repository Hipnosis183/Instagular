import { Component, Input } from '@angular/core';

@Component({
  selector: 'dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {

  constructor() { }

  @Input() divide: boolean = false;
}
