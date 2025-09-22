import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Contacts } from "./main/contacts/contacts";

export const routes: Routes = [
	{ path: "contacts", component: Contacts },
	{ path: "contacts/:id", component: Contacts },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
