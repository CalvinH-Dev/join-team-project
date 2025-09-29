import { Component, inject, input, OnChanges, signal } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

import { Button } from "@shared/components/button/button";
import { SearchField } from "@shared/components/search-field/search-field";

import { ToastAction } from "@shared/components/toast/toast";
import { ToastService } from "@shared/services/toast.service";

@Component({
  selector: 'app-board-view',
  imports: [],
  templateUrl: './board-view.html',
  styleUrl: './board-view.scss'
})
export class BoardView {

  firestore = inject(Firestore);

  router = inject(Router);

  toastService = inject(ToastService);

  id = input<string>("");

  isAddTaskOverlayOpen = signal("");

}
