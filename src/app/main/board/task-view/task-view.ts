import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output, inject, input } from "@angular/core";
import { Firestore, doc, getDoc } from "@angular/fire/firestore";
import { Contact } from "@core/interfaces/contact";
import { Task } from "@core/interfaces/task";
import { ContactService } from "@core/services/contact-service";
import { TaskService } from "@core/services/task-service";
import { Button } from "@shared/components/button/button";

@Component({
	selector: "app-task-view",
	imports: [Button, CommonModule,],
	templateUrl: "./task-view.html",
	styleUrl: "./task-view.scss",
})
export class TaskView implements OnInit {
	firestore = inject(Firestore);

	task: Task | null = null;

	taskId = input<string>("");

	contactService = inject(ContactService);
  taskService = inject(TaskService);
	assignedContacts: Contact[] = [];

	ngOnInit() {
		this.loadTask(this.taskId());
		this.contactService.allContacts$.subscribe((contacts) => {
			if (this.task?.assignedContacts) {
				this.assignedContacts = contacts.filter((c) =>
					this.task!.assignedContacts!.includes(c.id as string),
				);
			}
		});
	}

	async loadTask(id: string) {
		const taskRef = doc(this.firestore, `tasks/${id}`);
		const snapshot = await getDoc(taskRef);

		if (snapshot.exists()) {
			const raw = snapshot.data() as any;

			this.task = {
				...raw,
				dueDate: raw.dueDate?.toDate?.() ?? null,
				createdAt: raw.createdAt?.toDate?.() ?? null,
				updatedAt: raw.updatedAt?.toDate?.() ?? null,
				subtasks:
					raw.subtasks?.map((s: any) => ({
						...s,
						createdAt: s.createdAt?.toDate?.() ?? null,
					})) ?? [],
			};
		} else {
			console.warn(`Task with ID ${id} not found.`);
			this.task = null;
		}
	}

	/** Controls overlay visibility state */
	isOverlayOpen = false;

	/** Emitted when the task-view overlay is closed */
	@Output() closed = new EventEmitter<void>();

	/** Emitted when the task-view overlay is opened */
	@Output() open = new EventEmitter<void>();
	@Output() edit = new EventEmitter<void>();

	closeOverlay() {
		this.closed.emit();
	}

	openOverlay() {
		this.open.emit();
	}

	onEditClick() {
		this.edit.emit();
	}
}
