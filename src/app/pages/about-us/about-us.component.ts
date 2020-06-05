import {
  Component,
  OnInit,
  ViewChild, ViewContainerRef, ComponentRef,
  Compiler, ComponentFactory, NgModule, ModuleWithComponentFactories, ComponentFactoryResolver
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services';
import * as _ from 'underscore';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;
  constructor(private service: PageService, public sanitizer: DomSanitizer, private compiler: Compiler) { }
  html: any;
  headerTitle = 'About OneHR';
  slug = 'about_us';
  mediaSections: any;
  template: string;
  public ngOnInit() {
    // this.template = `<div>\nHello, {{test1}}\n</div>
    // <ul>
    //   <li *ngFor="let item of testarray; let i = index">
    //     {{i}} {{item}}
    //   </li>
    // </ul>
    // `;
    this.service.get('about_us').subscribe((response: any) => {
      var str = response.data.html.map(ele => ele.html).join();
      var mapObj = {};
      mapObj["#aboutUs_our_mandate"]="{{aboutUs_our_mandate}}"
      mapObj['#ourPartnerImg']=` <div class="row-2 w-row"><div *ngFor="let item of aboutUs_our_partners| slice:0:6; let i = index" class="w-col w-col-2">
          <a href="{{item.link}}"  class="logo-wrapper w-inline-block">
            <img class="ourparent_img" [src]="item.filePath" alt="un-secretariat-logo">
          </a>
      </div>
      </div>
      <div class="row-2-short  w-row"><div *ngFor="let item of aboutUs_our_partners| slice:6:10; let i = index" class="w-col w-col-4">
          <a href="{{item.link}}"  class="logo-wrapper w-inline-block">
            <img class="ourparent_img" [src]="item.filePath" alt="un-secretariat-logo">
          </a>
      </div>
      </div>
      `
      str = str.replace(/#aboutUs_our_mandate|#ourPartnerImg|goat/gi, function (matched) {
        return mapObj[matched];
      });
      this.template = str;
      this.service.getMedia(this.slug).subscribe((media: any) => {
        this.mediaSections = _.groupBy(media.data, 'section')
        this.compileTemplate();
        console.log('test', this.mediaSections);
      });
    });


  }

  compileTemplate() {
    let metadata = {
      selector: `runtime-component-sample`,
      template: this.template
    };

    let factory = this.createComponentFactorySync(this.compiler, metadata, null, this.mediaSections);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);
  }

  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any, media: any): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent {
      aboutUs_our_mandate = media.aboutUs_our_mandate[0].filePath;
      aboutUs_our_partners = media.aboutUs_our_partners
    };
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({ imports: [CommonModule], declarations: [decoratedCmp] })
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }
}
