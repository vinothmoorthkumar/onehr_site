import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private service: PageService) { }
  html:[];
  headerTitle='About OneHR'
  public ngOnInit()
  {
    this.service.get('about_us').subscribe((response: any) => {
      this.html=response.data.html
    });
  }

}
