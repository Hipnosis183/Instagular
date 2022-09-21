import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})

export class SwitchComponent {

  @Input() value: any;
  @Output() valueChange = new EventEmitter;

  switchValue(): void {
    this.value = !this.value;
    this.valueChange.emit(this.value);
  }
}
