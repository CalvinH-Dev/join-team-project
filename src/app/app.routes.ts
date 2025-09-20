import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactView } from './main/contacts/contact-view/contact-view';

export const routes: Routes = [
  { path: 'contacts/:id', component: ContactView },

//   if the user goes to any invalid URL, Angular will redirect them to /contacts/1
  { path: '**', redirectTo: 'contacts/1' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
