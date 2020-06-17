import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { HomeComponent } from './pages/home/home.component';
import { JobClassificationComponent } from './pages/job-classification/job-classification.component';
import { BasicReferenceComponent } from './pages/basic_reference_verification/basic_reference_verification.component';

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
    path: 'basic-reference-verification',
    component: BasicReferenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
