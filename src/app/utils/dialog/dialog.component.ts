import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {

  constructor() { }

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() buttonText: string = 'Ok';
  @Input() buttonTheme: string = 'blue';

  @Output() onOk = new EventEmitter();
  @Output() onCancel = new EventEmitter();
}
