import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services';
import * as _ from 'underscore';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private service: PageService, public sanitizer: DomSanitizer,) { }
  html:any;
  headerTitle='About OneHR';
  slug='about_us';
  mediaSections='test media';
  public ngOnInit()
  {
    this.service.get('about_us').subscribe((response: any) => {
      // this.html=[{html:`<h2>test</h2><h1>${this.slug}</h1>`}];
      this.html=response.data.html
    });

    this.service.getMedia(this.slug).subscribe((media: any) => {
      this.mediaSections=_.groupBy(media.data,'section')
      // console.log('test',this.mediaSections.aboutUs_our_mandate[0].filePath);
    });
  }

  sanatizeHtml(html){
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
}
