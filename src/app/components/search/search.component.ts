import { Component, Input } from '@angular/core';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {

  selectModel: string = '';
  clearRecent: boolean = false;
  @Input() searchSmall: boolean = false;
}
