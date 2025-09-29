import { CommonModule, ViewportScroller } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BoardView } from "./board-view/board-view";
import { TaskView } from "./task-view/task-view";

@Component({
	selector: "app-board",
	imports: [CommonModule, BoardView, TaskView],
	templateUrl: "./board.html",
	styleUrl: "./board.scss",
})
export class Board {
   isTaskViewOpen = false;

  openTaskView() {
    this.isTaskViewOpen = true;
  }

  closeTaskView() {
    this.isTaskViewOpen = false;
  }

	vps = inject(ViewportScroller);
	route = inject(ActivatedRoute);
	router = inject(Router);
}
