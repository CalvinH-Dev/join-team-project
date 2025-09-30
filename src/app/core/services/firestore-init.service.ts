import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, limit } from '@angular/fire/firestore';
import { Task } from '@core/interfaces/task';
import { Contact } from '@core/interfaces/contact';
import { environment, firebaseConfig } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FirestoreInitService {
  private firestore = inject(Firestore);

  constructor() {}

  /**
   * Initialize Firestore with sample data and schema
   * Runs once to populate empty collections with template data
   */
  async initializeFirestore(): Promise<void> {
    console.log('[FirestoreInit] Starting Firestore initialization...');

    try {
      // Validate environment configuration
      if (!this.validateEnvironmentConfig()) {
        console.error('[FirestoreInit] Environment validation failed');
        throw new Error('Firebase configuration is invalid or missing');
      }

      // Test Firestore connection
      console.log('[FirestoreInit] Testing Firestore connection...');
      await this.testFirestoreConnection();

      console.log('[FirestoreInit] Initializing collections...');
      await this.initializeTasksCollection();
      await this.initializeContactsCollection();

      // Set initialization flag in localStorage
      localStorage.setItem('firestore_initialized', 'true');
      console.log('[FirestoreInit] Firestore initialization completed successfully');

      // Verify data was inserted
      await this.verifyDataInsertion();

    } catch (error) {
      console.error('[FirestoreInit] Firestore initialization failed:', error);
      console.error('[FirestoreInit] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? (error as any).code : 'UNKNOWN',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }

  /**
   * Initialize only tasks collection with sample data
   * Selective initialization for tasks only
   */
  async initializeTasksOnly(): Promise<void> {
    console.log('[FirestoreInit] Starting tasks-only initialization...');

    try {
      // Validate environment configuration
      if (!this.validateEnvironmentConfig()) {
        console.error('[FirestoreInit] Environment validation failed');
        throw new Error('Firebase configuration is invalid or missing');
      }

      // Test Firestore connection
      console.log('[FirestoreInit] Testing Firestore connection...');
      await this.testFirestoreConnection();

      console.log('[FirestoreInit] Initializing tasks collection...');
      await this.initializeTasksCollection();

      // Set tasks initialization flag in localStorage
      localStorage.setItem('tasks_initialized', 'true');
      console.log('[FirestoreInit] Tasks initialization completed successfully');

      // Verify tasks data was inserted
      await this.verifyTasksInsertion();

    } catch (error) {
      console.error('[FirestoreInit] Tasks initialization failed:', error);
      console.error('[FirestoreInit] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? (error as any).code : 'UNKNOWN',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }

  /**
   * Initialize only contacts collection with sample data
   * Selective initialization for contacts only
   */
  async initializeContactsOnly(): Promise<void> {
    console.log('[FirestoreInit] Starting contacts-only initialization...');

    try {
      // Validate environment configuration
      if (!this.validateEnvironmentConfig()) {
        console.error('[FirestoreInit] Environment validation failed');
        throw new Error('Firebase configuration is invalid or missing');
      }

      // Test Firestore connection
      console.log('[FirestoreInit] Testing Firestore connection...');
      await this.testFirestoreConnection();

      console.log('[FirestoreInit] Initializing contacts collection...');
      await this.initializeContactsCollection();

      // Set contacts initialization flag in localStorage
      localStorage.setItem('contacts_initialized', 'true');
      console.log('[FirestoreInit] Contacts initialization completed successfully');

      // Verify contacts data was inserted
      await this.verifyContactsInsertion();

    } catch (error) {
      console.error('[FirestoreInit] Contacts initialization failed:', error);
      console.error('[FirestoreInit] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? (error as any).code : 'UNKNOWN',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }

  /**
   * Check if Firestore has already been initialized
   */
  async isInitialized(): Promise<boolean> {
    const flag = localStorage.getItem('firestore_initialized');
    return flag === 'true';
  }

  /**
   * Check if tasks collection has been initialized
   */
  async isTasksInitialized(): Promise<boolean> {
    const flag = localStorage.getItem('tasks_initialized');
    return flag === 'true';
  }

  /**
   * Check if contacts collection has been initialized
   */
  async isContactsInitialized(): Promise<boolean> {
    const flag = localStorage.getItem('contacts_initialized');
    return flag === 'true';
  }

  /**
   * Initialize tasks collection with sample data
   * Creates the collection structure and adds template tasks
   */
  private async initializeTasksCollection(): Promise<void> {
    const tasksCol = collection(this.firestore, 'tasks');

    // Check if tasks collection already has data
    const tasksQuery = query(tasksCol, limit(1));
    const tasksSnapshot = await getDocs(tasksQuery);

    if (!tasksSnapshot.empty) {
      console.log('Tasks collection already contains data, skipping initialization');
      return;
    }

    console.log('Creating tasks collection with sample data...');
    const sampleTasks = this.getSampleTasks();

    for (const task of sampleTasks) {
      await addDoc(tasksCol, {
        ...task,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log(`Created ${sampleTasks.length} sample tasks`);
  }

  /**
   * Initialize contacts collection with sample data
   * Creates the collection structure and adds template contacts
   */
  private async initializeContactsCollection(): Promise<void> {
    const contactsCol = collection(this.firestore, 'contacts');

    // Check if contacts collection already has data
    const contactsQuery = query(contactsCol, limit(1));
    const contactsSnapshot = await getDocs(contactsQuery);

    if (!contactsSnapshot.empty) {
      console.log('Contacts collection already contains data, skipping initialization');
      return;
    }

    console.log('Creating contacts collection with sample data...');
    const sampleContacts = this.getSampleContacts();

    for (const contact of sampleContacts) {
      await addDoc(contactsCol, contact);
    }

    console.log(`Created ${sampleContacts.length} sample contacts`);
  }


  /**
   * Generate sample task data covering all interface properties including subtasks
   */
  private getSampleTasks(): Partial<Task>[] {
    const now = new Date();

    return [
      {
        title: 'User Registration System',
        description: 'Implement complete user registration flow with email verification and password validation',
        category: 'User Story',
        priority: 'urgent',
        status: 'in-progress',
        assignedContacts: ['contact-1', 'contact-2'], // Will be populated with real IDs later
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        color: 1,
        subtasks: [
          {
            id: 'subtask-1-1',
            title: 'Design registration form UI',
            completed: true,
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'subtask-1-2',
            title: 'Implement email validation',
            completed: true,
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'subtask-1-3',
            title: 'Add password strength validation',
            completed: false,
            createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'subtask-1-4',
            title: 'Setup email verification service',
            completed: false,
            createdAt: now
          }
        ]
      },
      {
        title: 'Database Schema Migration',
        description: 'Update database schema to support new user profile fields and optimize queries',
        category: 'Technical Task',
        priority: 'medium',
        status: 'todo',
        assignedContacts: ['contact-3'],
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        color: 2,
        subtasks: [
          {
            id: 'subtask-2-1',
            title: 'Analyze current schema structure',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-2-2',
            title: 'Create migration scripts',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-2-3',
            title: 'Test migration on staging',
            completed: false,
            createdAt: now
          }
        ]
      },
      {
        title: 'Mobile App Design Review',
        description: 'Review and approve final mobile app mockups before development phase',
        category: 'User Story',
        priority: 'low',
        status: 'done',
        assignedContacts: ['contact-1', 'contact-4'],
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        color: 3,
        subtasks: [
          {
            id: 'subtask-3-1',
            title: 'Review homepage mockup',
            completed: true,
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'subtask-3-2',
            title: 'Review user profile screens',
            completed: true,
            createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'subtask-3-3',
            title: 'Approve final designs',
            completed: true,
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        title: 'API Documentation Update',
        description: 'Create comprehensive API documentation for all endpoints with examples and authentication details',
        category: 'Technical Task',
        priority: 'urgent',
        status: 'todo',
        assignedContacts: ['contact-2', 'contact-5'],
        dueDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        color: 4,
        subtasks: [
          {
            id: 'subtask-4-1',
            title: 'Document authentication endpoints',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-4-2',
            title: 'Document user management APIs',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-4-3',
            title: 'Add code examples for each endpoint',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-4-4',
            title: 'Setup interactive API explorer',
            completed: false,
            createdAt: now
          }
        ]
      },
      {
        title: 'Performance Optimization Sprint',
        description: 'Optimize application performance by implementing lazy loading, caching strategies, and code splitting',
        category: 'Technical Task',
        priority: 'medium',
        status: 'in-progress',
        assignedContacts: ['contact-3', 'contact-5'],
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        color: 5,
        subtasks: [
          {
            id: 'subtask-5-1',
            title: 'Implement lazy loading for routes',
            completed: true,
            createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'subtask-5-2',
            title: 'Add component-level code splitting',
            completed: false,
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'subtask-5-3',
            title: 'Setup Redis caching layer',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-5-4',
            title: 'Optimize database queries',
            completed: false,
            createdAt: now
          },
          {
            id: 'subtask-5-5',
            title: 'Run performance benchmarks',
            completed: false,
            createdAt: now
          }
        ]
      }
    ];
  }

  /**
   * Generate sample contact data covering all interface properties
   */
  private getSampleContacts(): Partial<Contact>[] {
    return [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        telephone: '+1-555-0123',
        color: 1,
        initials: 'JD'
      },
      {
        name: 'Sarah Miller',
        email: 'sarah.miller@example.com',
        telephone: '+1-555-0456',
        color: 2,
        initials: 'SM'
      },
      {
        name: 'Michael Johnson',
        email: 'michael.johnson@example.com',
        telephone: '+1-555-0789',
        color: 3,
        initials: 'MJ'
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        telephone: '+1-555-0321',
        color: 4,
        initials: 'ED'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        telephone: '+1-555-0654',
        color: 5,
        initials: 'DW'
      }
    ];
  }

  /**
   * Validate Firebase environment configuration
   */
  private validateEnvironmentConfig(): boolean {
    const config = firebaseConfig;

    console.log('[FirestoreInit] Validating environment configuration...');

    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missing = requiredFields.filter(field => !(config as any)[field]);

    if (missing.length > 0) {
      console.error('[FirestoreInit] Missing Firebase config fields:', missing);
      return false;
    }

    console.log('[FirestoreInit] Environment configuration valid:', {
      projectId: config.projectId,
      authDomain: config.authDomain,
      hasApiKey: !!config.apiKey
    });

    return true;
  }

  /**
   * Test Firestore connection by attempting to access a collection
   */
  private async testFirestoreConnection(): Promise<void> {
    try {
      const testCol = collection(this.firestore, '_test_connection');
      const testQuery = query(testCol, limit(1));
      await getDocs(testQuery);

      console.log('[FirestoreInit] Firestore connection test successful');
    } catch (error) {
      console.error('[FirestoreInit] Firestore connection test failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      throw new Error(`Firestore connection failed: ${errorMessage}`);
    }
  }

  /**
   * Verify that sample data was successfully inserted
   */
  private async verifyDataInsertion(): Promise<void> {
    console.log('[FirestoreInit] Verifying data insertion...');

    try {
      // Check tasks collection
      const tasksCol = collection(this.firestore, 'tasks');
      const tasksQuery = query(tasksCol, limit(10));
      const tasksSnapshot = await getDocs(tasksQuery);

      // Check contacts collection
      const contactsCol = collection(this.firestore, 'contacts');
      const contactsQuery = query(contactsCol, limit(10));
      const contactsSnapshot = await getDocs(contactsQuery);

      console.log('[FirestoreInit] Data verification complete:', {
        tasks: tasksSnapshot.size,
        contacts: contactsSnapshot.size,
        totalDocuments: tasksSnapshot.size + contactsSnapshot.size
      });

      if (tasksSnapshot.empty && contactsSnapshot.empty) {
        console.warn('[FirestoreInit] No data found in collections after initialization');
      }

    } catch (error) {
      console.error('[FirestoreInit] Data verification failed:', error);
    }
  }

  /**
   * Verify that tasks data was successfully inserted
   */
  private async verifyTasksInsertion(): Promise<void> {
    console.log('[FirestoreInit] Verifying tasks data insertion...');

    try {
      const tasksCol = collection(this.firestore, 'tasks');
      const tasksQuery = query(tasksCol, limit(10));
      const tasksSnapshot = await getDocs(tasksQuery);

      console.log('[FirestoreInit] Tasks verification complete:', {
        tasks: tasksSnapshot.size
      });

      if (tasksSnapshot.empty) {
        console.warn('[FirestoreInit] No tasks found in collection after initialization');
      }

    } catch (error) {
      console.error('[FirestoreInit] Tasks verification failed:', error);
    }
  }

  /**
   * Verify that contacts data was successfully inserted
   */
  private async verifyContactsInsertion(): Promise<void> {
    console.log('[FirestoreInit] Verifying contacts data insertion...');

    try {
      const contactsCol = collection(this.firestore, 'contacts');
      const contactsQuery = query(contactsCol, limit(10));
      const contactsSnapshot = await getDocs(contactsQuery);

      console.log('[FirestoreInit] Contacts verification complete:', {
        contacts: contactsSnapshot.size
      });

      if (contactsSnapshot.empty) {
        console.warn('[FirestoreInit] No contacts found in collection after initialization');
      }

    } catch (error) {
      console.error('[FirestoreInit] Contacts verification failed:', error);
    }
  }

  /**
   * Force re-initialization (for development/testing)
   * Removes initialization flag and allows re-running setup
   */
  async resetInitialization(): Promise<void> {
    localStorage.removeItem('firestore_initialized');
    console.log('[FirestoreInit] Initialization flag reset - app will re-initialize on next load');
  }

  /**
   * Reset tasks initialization flag
   * Allows re-running tasks-only setup
   */
  async resetTasksInitialization(): Promise<void> {
    localStorage.removeItem('tasks_initialized');
    console.log('[FirestoreInit] Tasks initialization flag reset - tasks will re-initialize on next load');
  }

  /**
   * Reset contacts initialization flag
   * Allows re-running contacts-only setup
   */
  async resetContactsInitialization(): Promise<void> {
    localStorage.removeItem('contacts_initialized');
    console.log('[FirestoreInit] Contacts initialization flag reset - contacts will re-initialize on next load');
  }
}