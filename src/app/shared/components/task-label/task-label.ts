import { Component, computed, input } from "@angular/core";

@Component({
	selector: "app-task-label",
	imports: [],
	templateUrl: "./task-label.html",
	styleUrl: "./task-label.scss",
})
export class TaskLabel {
	category = input<string>("");
	categoryClean = computed(() => this.category().toLowerCase().trim().replace(/[- ]/g, ""));
}
