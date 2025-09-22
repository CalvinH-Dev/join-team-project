<<<<<<< HEAD
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
=======
import { Routes } from "@angular/router";
import { Summary} from "./main/summary/summary";
import { AddTask } from "./main/add-task/add-task";
import { Board } from "./main/board/board";
import { Contacts } from "./main/contacts/contacts";

export const routes: Routes = [
  { path: "", redirectTo: "summary", pathMatch: "full" },
  { path: "summary", component: Summary },
  { path: "add-task", component: AddTask },
  { path: "board", component: Board },
  { path: "contacts", component: Contacts },
	{ path: "contacts/:id", component: Contacts },
  { path: "**", redirectTo: "summary" }
];
>>>>>>> origin/main
