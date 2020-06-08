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
import { LazyLoadScriptService } from '../../lazy_load_script_service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;
  constructor(private service: PageService, 
    public sanitizer: DomSanitizer, 
    private compiler: Compiler,
    private lazyLoadService: LazyLoadScriptService) { }
  html: any;
  headerTitle = 'About OneHR';
  slug = 'home';
  mediaSections: any;
  template: string;
  public ngOnInit() {
    this.service.get(this.slug).subscribe((response: any) => {
      var str = response.data.html.map(ele => ele.html).join();
      var mapObj = {};
      mapObj['#home_slider']=`<div data-delay="3000" data-animation="cross" data-autoplay="1" data-duration="800" data-infinite="1"
      class="slider w-hidden-small w-hidden-tiny w-slider">
      <div class="mask w-slider-mask">

          <div class="slide _{{i+1}} w-slide"   *ngFor="let item of home_slider; let i = index" [style.background-image]="'url(' + item.filePath + ')'">
              <div class="container-fluid center more">
                  <div class="w-row">
                      <div class="w-col w-col-8">
                          <div class="div-block-6">
                              <h1 class="biger">United Nations Global Center for Human Resources Services</h1>
                              <div>
                                  <p class="paragraph intro">Modernizing, streamlining and harmonizing human resources
                                      functions in the UN System</p>
                              </div>
                              <div class="top-margin"><a href="contact-onehr.html" class="button w-button">Get In
                                      Touch</a></div>
                          </div>
                      </div>
                      <div class="column-4 w-col w-col-4"></div>
                  </div>
              </div>
          </div>
  
      </div>
      <div class="slider-nav w-slider-nav"></div>
  </div>
  `
 
      str = str.replace(/#home_slider/gi, function (matched) {
        return mapObj[matched];
      });
      this.template = str;
      this.service.getMedia(this.slug).subscribe((media: any) => {
        this.mediaSections = _.groupBy(media.data, 'section')

  
        this.compileTemplate();
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

      this.lazyLoadService.loadScript('/assets/js/onehr.js').subscribe(_ => {
        console.log('test')
      });

  }

  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any, media: any): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent {
      home_slider = media.home_slider
    };
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({ imports: [CommonModule], declarations: [decoratedCmp] })
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }
}
