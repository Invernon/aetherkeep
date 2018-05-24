import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { HomeComponent } from '../components/home/home.component';
import { RecruitComponent } from '../components/recruit/recruit.component';

const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch : 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'recruit', component: RecruitComponent},
  // {path: '**', component: PageNotFoundComponent },

];

export const AppRouting = RouterModule.forRoot(appRoutes);


