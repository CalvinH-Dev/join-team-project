import { inject, Injectable, Injector, OnDestroy, runInInjectionContext } from "@angular/core";
import { DocumentData } from "@angular/fire/compat/firestore";
import {
	collection,
	deleteDoc,
	doc,
	Firestore,
	getDocs,
	onSnapshot,
	QuerySnapshot,
	setDoc,
	updateDoc,
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
		console.log('[BoardService] Constructor called - initializing...');
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

					console.log(`[BoardService] Loaded ${boards.length} boards from Firestore`);

					const organized = this.organizeByStatus(boards);
					console.log('[BoardService] Boards by status:', {
						todo: organized['todo'].length,
						'in-progress': organized['in-progress'].length,
						'await-feedback': organized['await-feedback'].length,
						done: organized['done'].length
					});

					this.allBoardsSubject.next(boards);
					this.boardsByStatusSubject.next(organized);
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

	/**
	 * Generates the next sequential board ID in format: board-001, board-002, etc.
	 *
	 * @returns Promise that resolves to the next available board ID
	 * @private
	 *
	 * @example
	 * ```typescript
	 * const nextId = await this.generateNextBoardId(); // "board-015"
	 * ```
	 */
	private async generateNextBoardId(): Promise<string> {
		const boardsCol = collection(this.firestore, "boards");
		const snapshot = await getDocs(boardsCol);
		let maxNum = 0;

		snapshot.forEach((docSnapshot) => {
			const match = docSnapshot.id.match(/^board-(\d+)$/);
			if (match) {
				maxNum = Math.max(maxNum, parseInt(match[1]));
			}
		});

		return `board-${String(maxNum + 1).padStart(3, '0')}`;
	}

	/**
	 * Adds a task to the board with specified status.
	 * Creates new board entry in 'boards' collection.
	 *
	 * @param taskId - ID of the task to add to board
	 * @param status - Initial status for the board entry (default: 'todo')
	 * @returns Promise that resolves to the new board ID
	 * @throws Error if board creation fails
	 *
	 * @example
	 * ```typescript
	 * await this.boardService.addTaskToBoard('task-001', 'in-progress');
	 * ```
	 */
	async addTaskToBoard(
		taskId: string,
		status: 'todo' | 'in-progress' | 'await-feedback' | 'done' = 'todo'
	): Promise<string> {
		return await runInInjectionContext(this.injector, async () => {
			const boardsCol = collection(this.firestore, "boards");

			try {
				const boardId = await this.generateNextBoardId();
				const now = new Date();

				await setDoc(doc(boardsCol, boardId), {
					taskId: taskId,
					status: status,
					assignedContacts: [],
					order: 0,
					createdAt: now,
					updatedAt: now,
				});

				console.log(`[BoardService] Added board: ${boardId} (task: ${taskId}, status: ${status})`);
				return boardId;
			} catch (error) {
				console.error('[BoardService] Failed to add task to board:', error);
				throw error;
			}
		});
	}

	/**
	 * Updates the status of a board entry (e.g., for drag & drop between columns).
	 *
	 * @param boardId - Firestore document ID of board to update
	 * @param newStatus - New status to set
	 * @returns Promise that resolves when board is updated
	 * @throws Error if update fails
	 *
	 * @example
	 * ```typescript
	 * await this.boardService.updateBoardStatus('board-001', 'done');
	 * ```
	 */
	async updateBoardStatus(
		boardId: string,
		newStatus: 'todo' | 'in-progress' | 'await-feedback' | 'done'
	): Promise<void> {
		if (!boardId) return;

		const boardDoc = doc(this.firestore, "boards", boardId);
		try {
			await updateDoc(boardDoc, {
				status: newStatus,
				updatedAt: new Date(),
			});
			console.log(`[BoardService] Updated board status: ${boardId} -> ${newStatus}`);
		} catch (error) {
			console.error('[BoardService] Failed to update board status:', error);
			throw new Error("Failed to update board status");
		}
	}

	/**
	 * Removes a board entry from the boards collection.
	 * Note: This does NOT delete the task itself, only the board entry.
	 *
	 * @param boardId - Firestore document ID of board to delete
	 * @returns Promise that resolves when board is deleted
	 * @throws Error if deletion fails or boardId is invalid
	 *
	 * @example
	 * ```typescript
	 * await this.boardService.removeFromBoard('board-001');
	 * ```
	 */
	async removeFromBoard(boardId: string): Promise<void> {
		if (!boardId) return;

		const boardDoc = doc(this.firestore, "boards", boardId);
		try {
			await deleteDoc(boardDoc);
			console.log(`[BoardService] Removed board: ${boardId}`);
		} catch (error) {
			console.error('[BoardService] Failed to remove from board:', error);
			throw new Error("Failed to remove from board");
		}
	}

	ngOnDestroy() {
		this.unsubscribeBoards?.();
	}
}
