import { Component } from '@angular/core';
import { LazyLoadScriptService } from './lazy_load_script_service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private lazyLoadService: LazyLoadScriptService) { }
  title = 'onehrSite';

  ngOnInit() {
    this.lazyLoadService.loadScript('/assets/js/onehr.js').subscribe(_ => {
      console.log('Jquery is loaded!')
    });
  }
}
