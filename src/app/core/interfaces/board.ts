/**
 * Represents a board entry that connects tasks with their status and assigned contacts.
 * Acts as an orchestration layer over tasks and contacts collections.
 *
 * @interface Board
 *
 * @example
 * ```typescript
 * const boardEntry: Board = {
 *   id: 'board-001',
 *   taskId: 'task-042',
 *   status: 'in-progress',
 *   assignedContacts: ['contact-001', 'contact-003'],
 *   order: 1,
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * };
 * ```
 */
export interface Board {
	/** Unique identifier from Firestore document (format: board-001, board-002, etc.) */
	id?: string;

	/** Reference to task ID from tasks collection */
	taskId: string;

	/** Current status of the task on the board */
	status: 'todo' | 'in-progress' | 'await-feedback' | 'done';

	/** Array of contact IDs assigned to this board entry */
	assignedContacts: string[];

	/** Order/position within the status column (for drag & drop) */
	order: number;

	/** Timestamp when board entry was created */
	createdAt?: Date;

	/** Timestamp when board entry was last updated */
	updatedAt?: Date;
}
