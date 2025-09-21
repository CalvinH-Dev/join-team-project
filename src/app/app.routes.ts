import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactList } from "./main/contacts/contact-list/contact-list";
import { ContactView } from "./main/contacts/contact-view/contact-view";

export const routes: Routes = [
	{ path: "contacts", component: ContactList },
	{ path: "contacts/:id", component: ContactView },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
