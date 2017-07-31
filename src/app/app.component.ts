import { Component, AfterViewChecked, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked, OnInit {

  s: any;
  constructor(private elementRef: ElementRef) {

  }
  ngOnInit(): void {
   
  }

  ngAfterViewChecked() {

    this.s = document.createElement('script');
    this.s.type = 'text/javascript';
    this.s.src = '../../assets/js/custom.js';

    this.elementRef.nativeElement.appendChild(this.s);

  }

}
