import { Component } from '@angular/core';
import { LazyLoadScriptService } from './lazy_load_script_service'
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private lazyLoadService: LazyLoadScriptService) { }
  title = 'onehrSite';

  ngOnInit() {
    $(document).ready(function () {
      $("button").click(function () {
        var div = $("div");
        div.animate({ left: '100px' }, "slow");
        div.animate({ fontSize: '5em' }, "slow");
      });
    });
  }
}
