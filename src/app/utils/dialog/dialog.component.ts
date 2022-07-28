import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent {

  constructor(private translate: TranslateService) { }

  @Input() title: any = null;
  @Input() subtitle: any = null;
  @Input() buttonText: string = this.translate.instant('GENERAL.OK');
  @Input() buttonTheme: string = 'blue';

  @Output() onOk = new EventEmitter();
  @Output() onCancel = new EventEmitter();
}
