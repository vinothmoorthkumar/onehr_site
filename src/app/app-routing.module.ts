import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { HomeComponent } from './pages/home/home.component';
import { JobClassificationComponent } from './pages/job-classification/job-classification.component';
import { BasicReferenceComponent } from './pages/basic_reference_verification/basic_reference_verification.component';
import { OrgDesignComponent } from './pages/organizational-design/organizational-design.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactComponent } from './pages/contact/contact.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutUsComponent
  },
  {
    path: 'our-services-job-classification',
    component: JobClassificationComponent
  },
  {
    path: 'our-services-basic-reference-verification',
    component: BasicReferenceComponent
  },
  {
    path: 'our-services-organizational-design',
    component: OrgDesignComponent
  },
  {
    path: 'faq-frequently-asked-questions',
    component: FaqComponent
  },
  {
    path: 'contact-onehr',
    component: ContactComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
