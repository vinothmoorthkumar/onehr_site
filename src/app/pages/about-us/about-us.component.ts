import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private service: PageService) { }
  html:string;
  public ngOnInit()
  {
    this.service.get().subscribe((response: any) => {
      this.html=response.data.html
    });
  }

}
