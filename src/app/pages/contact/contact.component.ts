import {
  Component, Input,
  OnInit, AfterContentInit,
  ViewChild, ViewContainerRef, ComponentRef, ChangeDetectorRef,
  Compiler, ComponentFactory, NgModule, ModuleWithComponentFactories, ComponentFactoryResolver, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services';
import * as _ from 'underscore';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadScriptService } from '../../lazy_load_script_service'
import * as slug from '../_slug';
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;
  constructor(private service: PageService,
    public sanitizer: DomSanitizer,
    private compiler: Compiler,
    public cdRef: ChangeDetectorRef,
    private lazyLoadService: LazyLoadScriptService) { }
  html: any;
  slug = slug.slug.contact;
  extras: any;
  mediaSections: any;
  template: string;
  public ngOnInit() {
    this.service.get(this.slug).subscribe((response: any) => {
      this.extras = response.data.extras;
      var str = response.data.html.map(ele => ele.html).join("");
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
      template: this.template,
      changeDetection: ChangeDetectionStrategy.OnPush
    };

    let factory = this.createComponentFactorySync(this.compiler, metadata, null, this.mediaSections, this);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);
    let childComponent: any = this.componentRef.instance;
    childComponent.lat  =this.extras.lat;
    childComponent.lng = this.extras.lng;
    childComponent.zoom = 18;
    this.lazyLoadService.loadScript('/assets/js/onehr.js').subscribe(_ => {
    });
  }


  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any, media: any, THIS: any,): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent {
      lat: number
      lng: number 
    };
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({ imports: [
      CommonModule,
      AgmCoreModule
    ], declarations: [decoratedCmp] })
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }
}
