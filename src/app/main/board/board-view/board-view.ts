import { Component, inject, input, OnChanges, signal } from "@angular/core";
import { CommonModule } from '@angular/common'; 
import { Firestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

// Komponenten-Imports, die im HTML verwendet werden
import { Button } from "@shared/components/button/button";
import { SearchField } from "@shared/components/search-field/search-field";

//import { ToastAction } from "@shared/components/toast/toast";
import { ToastService } from "@shared/services/toast.service";

// Angenommener Import für Task-Datenstruktur und Service
import { Task } from '@app/core/interfaces/task';
import { TaskService } from '@app/core/services/task-service';
import { TaskLabel } from "@shared/components/task-label/task-label";
import { BoardCard } from "../board-card/board-card";

@Component({
  selector: 'app-board-view',
  imports: [CommonModule, Button, SearchField, BoardCard, TaskLabel],
  templateUrl: './board-view.html',
  styleUrl: './board-view.scss'
})
export class BoardView implements OnChanges {

  firestore = inject(Firestore);
  router = inject(Router);
  toastService = inject(ToastService);

  taskService = inject(TaskService);


  // --- INPUTS & STATE ---
  id = input<string>(""); // Wird vermutlich für die Detailansicht genutzt
  isAddTaskOverlayOpen = signal(false); // Signal für den Overlay-Status (Boolean ist üblicher)

  // --- TASK MANAGEMENT SIGNALS ---
  // Signals für die gefilterten Aufgaben in den jeweiligen Spalten
  todoTasks = signal<Task[]>([]);
  inProgressTasks = signal<Task[]>([]);
  feedbackTasks = signal<Task[]>([]);
  doneTasks = signal<Task[]>([]);

  // Array, das alle Tasks hält (optional, wenn der Service direkt die Streams liefert)
  allTasks = signal<Task[]>([]);

  // --- LIFECYCLE HOOKS ---

  constructor() {
    this.loadTasks();
  }

  ngOnChanges() {
    // Wenn sich die 'id' ändert, könnte man hier eine Task-Detailansicht laden
    if (this.id()) {
      //this.openTaskDetail(this.id());
    }
  }

  // --- METHODEN ---

  /**
   * Lädt alle Tasks über den TaskService und filtert sie in die Spalten.
   */
  loadTasks() {
    // Beispiel: Angenommen, der TaskService liefert ein Observable von Tasks
    // In einer echten Angular/RxJS-Anwendung würden Sie hier subscriben oder 'async' Pipe verwenden.

    // Simulierter initialer Ladevorgang:
    const mockTasks: Task[] = this.taskService.getMockTasks(); // Annahme: TaskService hat eine Methode

    this.allTasks.set(mockTasks);
    this.filterTasks(mockTasks);
  }

  /**
   * Filtert Tasks in die entsprechenden Spalten-Signals.
   */
  filterTasks(tasks: Task[]) {
    this.todoTasks.set(tasks.filter(t => t.status === 'todo'));
    this.inProgressTasks.set(tasks.filter(t => t.status === 'in-progress'));
    this.feedbackTasks.set(tasks.filter(t => t.status === 'awaiting-feedback'));
    this.doneTasks.set(tasks.filter(t => t.status === 'done'));
  }

  /**
   * Öffnet das Add-Task Overlay.
   */
  openAddTaskOverlay() {
    this.isAddTaskOverlayOpen.set(true);
    this.router.navigate(['/main/add-task']);
  }

  /**
   * Wird vom SearchField verwendet, um Tasks zu filtern.
   */
  onSearch(term: string) {
    if (!term) {
      this.filterTasks(this.allTasks()); // Zeige alle, wenn kein Suchbegriff
      return;
    }

    const filtered = this.allTasks().filter(task =>
      task.title.toLowerCase().includes(term.toLowerCase()) ||
      task.description.toLowerCase().includes(term.toLowerCase())
    );

    this.filterTasks(filtered);
  }
}
