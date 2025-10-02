import { Component, inject } from "@angular/core";
import { BoardService } from "@core/services/board-service";
import { TaskView } from "./task-view/task-view";

@Component({
	selector: "app-board",
	imports: [TaskView],
	templateUrl: "./board.html",
	styleUrl: "./board.scss",
})
export class Board {
	protected boardService = inject(BoardService);

	isTaskViewOpen = false;

  openTaskView() {
    this.isTaskViewOpen = true;
  }

  closeTaskView() {
    this.isTaskViewOpen = false;
  }

}
