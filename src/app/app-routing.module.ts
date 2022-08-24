import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'training',
    loadChildren: () =>
      import('src/app/training/training.module').then((m) => m.TrainingModule),
    canLoad: [AuthGuard],
  },
  // Not usefull here because the method initAuthListener of the AuthService redirects to login or training.
  // NB: For this to work, the AppRoutingModule has to be the last imported one in the AppModule!
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
