import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { debounce } from 'src/app/utils/debounce';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  selectModel: any = null;
  queryResults: any[] = [];
  queryFinished: boolean = false;

  private updateError() {
    return throwError(() => new Error('User error: cannot load user media.'));
  }

  updateValueDebounced = debounce(() => this.updateValue(), 2000)

  updateValue(): void {
    if (this.selectModel && this.selectModel.length > 0) {
      this.http.post<any>('/api/search', { session: localStorage.getItem("state"), query: this.selectModel })
        .pipe(catchError(this.updateError))
        .subscribe((data: any) => {
          console.info('Search completed successfully!');
          this.queryResults = data;
          this.queryFinished = true;
        });
    } else {
      this.queryResults = [];
      this.queryFinished = false;
    }
  }

  clearValue(): void {
    this.selectModel = null;
    this.queryResults = [];
    this.queryFinished = false;
  }

  ngOnInit(): void {
  }
}