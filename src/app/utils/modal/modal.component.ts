import { Component, Input } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent {

  @Input() divide: boolean = false;
  @Input() width: string = '400px';
}
