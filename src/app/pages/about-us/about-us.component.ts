import {
  Component,
  OnInit,
  ViewChild, ViewContainerRef, ComponentRef,
  Compiler, ComponentFactory, NgModule, ModuleWithComponentFactories, ChangeDetectionStrategy,ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services';
import * as _ from 'underscore';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadScriptService } from '../../lazy_load_script_service'

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  @ViewChild('container', { static: true, read: ViewContainerRef }) container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;
  constructor(private service: PageService, 
    private lazyLoadService: LazyLoadScriptService,
    public cdRef: ChangeDetectorRef,
    public sanitizer: DomSanitizer, private compiler: Compiler) { }
  html: any;
  headerTitle = 'About OneHR';
  slug = 'about_us';
  mediaSections: any;
  template: string;
  public ngOnInit() {
    this.service.get('about_us').subscribe((response: any) => {
      var str = response.data.html.map(ele => ele.html).join("");
      var mapObj = {};
      mapObj['#iframe'] = `<iframe  width="100%" height="100%" [src]="iframe" allow="accelerometer; autoplay;">
      </iframe> `
      mapObj["#aboutUs_Brochure"]="{{aboutUs_Brochure}}"
      mapObj["#aboutUs_our_mandate"]=`<img src="{{aboutUs_our_mandate}}" width="219" alt="Photo of the Secretary General António Guterres">`
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
      str = str.replace(/#aboutUs_our_mandate|#ourPartnerImg|#aboutUs_Brochure|#iframe/gi, function (matched) {
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
      template: this.template,
      changeDetection: ChangeDetectionStrategy.OnPush
    };

    let factory = this.createComponentFactorySync(this.compiler, metadata, null, this.mediaSections,this);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);
    this.lazyLoadService.loadScript('/assets/js/onehr.js').subscribe(_ => {
    });
  }

  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any, media: any,THIS: any): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent {
      aboutUs_our_mandate = media.aboutUs_our_mandate[0].filePath;
      aboutUs_Brochure = media.aboutUs_Brochure[0].filePath;
      aboutUs_our_partners = media.aboutUs_our_partners
      lightbox = false;
      iframe = null;
      openModel(id) {
        this.lightbox = true;
        this.iframe = THIS.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}?autoplay=1`);
        THIS.cdRef.detectChanges();
      }

      closeModal() {
        this.lightbox = false;
        THIS.cdRef.detectChanges();
      }
    };
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({ imports: [CommonModule], declarations: [decoratedCmp] })
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }
}
