import { Component, inject } from "@angular/core";
import { Task } from "@core/interfaces/task";
import { TaskService } from "@core/services/task-service";

@Component({
	selector: "app-summary",
	imports: [],
	templateUrl: "./summary.html",
	styleUrl: "./summary.scss",
})
export class Summary {
	taskService = inject(TaskService);
	items: Task[] = [];

	constructor() {
		const sub = this.taskService.getTasksAsObject().subscribe((tasks) => {
			this.items = tasks;
		});
	}

  get urgentItems() {
    return this.items.filter(item => item.priority === 'urgent');
  }

  get categoryItems() {
    return this.items.filter(item => item.category === 'Technical Task');
  }

  /* get categoryItems() {
    return this.items.filter(item => item.category === 'Technical Task').slice(2, 3);
  } */
}
