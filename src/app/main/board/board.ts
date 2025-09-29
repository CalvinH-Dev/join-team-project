import { Component } from "@angular/core";
import { TaskView } from "./task-view/task-view";

@Component({
	selector: "app-board",
	imports: [TaskView],
	templateUrl: "./board.html",
	styleUrl: "./board.scss",
})
export class Board {}
