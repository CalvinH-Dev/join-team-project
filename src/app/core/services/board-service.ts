import { inject, Injectable, Injector, OnDestroy, runInInjectionContext } from "@angular/core";
import { DocumentData } from "@angular/fire/compat/firestore";
import {
	collection,
	doc,
	Firestore,
	onSnapshot,
	QuerySnapshot,
} from "@angular/fire/firestore";
import { Board } from "@core/interfaces/board";
import { BehaviorSubject, Observable } from "rxjs";

type BoardDictionary = Record<string, Board[]>;

/**
 * Service for managing board operations with Firestore integration.
 * Orchestrates tasks and contacts through board entries.
 */
@Injectable({
	providedIn: "root",
})
export class BoardService implements OnDestroy {
	firestore = inject(Firestore);
	injector = inject(Injector);

	/** BehaviorSubject for all boards */
	private allBoardsSubject = new BehaviorSubject<Board[]>([]);

	/** BehaviorSubject for boards organized by status */
	private boardsByStatusSubject = new BehaviorSubject<BoardDictionary>({});

	/** Observable stream of all boards */
	allBoards$ = this.allBoardsSubject.asObservable();

	/** Observable stream of boards organized by status */
	boardsByStatus$ = this.boardsByStatusSubject.asObservable();

	/** Cleanup function for boards collection subscription */
	private unsubscribeBoards: (() => void) | null = null;

	/**
	 * @deprecated Use allBoards$ Observable instead
	 */
	get allBoards(): Board[] {
		return this.allBoardsSubject.value;
	}

	/**
	 * @deprecated Use boardsByStatus$ Observable instead
	 */
	get boardsByStatus(): BoardDictionary {
		return this.boardsByStatusSubject.value;
	}

	constructor() {
		this.subscribeToBoardsCollection();
	}

	/**
	 * Establishes real-time subscription to boards collection.
	 * Automatically organizes boards by status and sorts by order.
	 */
	private subscribeToBoardsCollection(): void {
		runInInjectionContext(this.injector, () => {
			const boardsCol = collection(this.firestore, "boards");

			this.unsubscribeBoards = onSnapshot(
				boardsCol,
				(snapshot: QuerySnapshot<DocumentData>) => {
					const boards: Board[] = [];

					snapshot.forEach((doc) => {
						const board = this.buildDocument(doc.id, doc.data());
						boards.push(board);
					});

					this.allBoardsSubject.next(boards);
					this.boardsByStatusSubject.next(this.organizeByStatus(boards));
				},
				(error) => {
					console.error('[BoardService] Firestore error:', error);
				}
			);
		});
	}

	/**
	 * Organizes boards by status and sorts by order within each status.
	 */
	private organizeByStatus(boards: Board[]): BoardDictionary {
		const organized: BoardDictionary = {
			todo: [],
			"in-progress": [],
			"await-feedback": [],
			done: [],
		};

		boards.forEach((board) => {
			const status = board.status || "todo";
			if (!organized[status]) {
				organized[status] = [];
			}
			organized[status].push(board);
		});

		Object.keys(organized).forEach((status) => {
			organized[status].sort((a, b) => a.order - b.order);
		});

		return organized;
	}

	/**
	 * Builds a Board document from Firestore data.
	 */
	private buildDocument(id: string, data: DocumentData): Board {
		return {
			id,
			taskId: data["taskId"] || "",
			status: data["status"] || "todo",
			assignedContacts: data["assignedContacts"] || [],
			order: data["order"] || 0,
			createdAt: data["createdAt"]?.toDate() || undefined,
			updatedAt: data["updatedAt"]?.toDate() || undefined,
		};
	}

	ngOnDestroy() {
		this.unsubscribeBoards?.();
	}
}
