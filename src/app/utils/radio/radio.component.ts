import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})

export class RadioComponent {

  @Input() model: any;
  @Input() name: any;
  @Input() value: any;
  @Output() modelChange = new EventEmitter;

  updateModel(): void {
    this.model = this.value;
    this.modelChange.emit(this.model);
  }
}
