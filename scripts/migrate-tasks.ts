#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { getFirebaseConfig, FirebaseConfig } from './firebase.config';

/**
 * Firebase Tasks Migration Script (TypeScript)
 *
 * Automatically populates Firestore with sample task data
 * Uses configuration from firebase.config.ts
 *
 * Usage: npm run migrate:tasks
 */

/**
 * Task Interface - matches the current application interface
 * @see src/app/core/interfaces/task.ts
 */
interface Task {
  id?: string;
  title: string;
  description?: string;
  category: 'User Story' | 'Technical Task';
  priority: 'low' | 'medium' | 'urgent';
  status: 'todo' | 'in-progress' | 'awaiting-feedback' | 'done';
  assignedContacts?: string[];
  dueDate?: string | undefined;
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
    createdAt?: string | undefined;
  }[];
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  color?: number;
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadSampleTasks(): Task[] {
  const tasksPath = path.join(__dirname, 'data', 'sample-tasks.json');
  const tasksData = fs.readFileSync(tasksPath, 'utf8');
  return JSON.parse(tasksData) as Task[];
}

function createMigrationScript(config: FirebaseConfig): string {
  const sampleTasks = loadSampleTasks();

  return `
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = ${JSON.stringify(config, null, 2)};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleTasks = ${JSON.stringify(sampleTasks, null, 2)};

async function migrateTasks() {
  try {
    const tasksCollection = collection(db, 'tasks');
    const existingTasks = await getDocs(tasksCollection);

    if (existingTasks.size > 0) {
      console.log('[INFO] Tasks collection already contains data. Skipping migration.');
      process.exit(0);
    }

    console.log('[MIGRATE] Starting tasks migration...');

    for (const task of sampleTasks) {
      const taskRef = doc(db, 'tasks', task.id);
      const now = new Date().toISOString();
      await setDoc(taskRef, {
        ...task,
        createdAt: now,
        updatedAt: now
      });
      console.log(\`[SUCCESS] Migrated task: \${task.title}\`);
    }

    console.log(\`[SUCCESS] Migrated \${sampleTasks.length} tasks successfully\`);
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Migration failed:', error.message);
    process.exit(1);
  }
}

migrateTasks();
`;
}

async function main(): Promise<void> {
  log('Firebase Tasks Migration', 'bright');
  log('=======================', 'blue');

  const config = getFirebaseConfig();
  log(`[INFO] Using Firebase project: ${config.projectId}`, 'cyan');

  log('Creating migration script...', 'cyan');
  const migrationScript = createMigrationScript(config);

  const scriptPath = path.join(__dirname, 'temp-migrate-tasks.mjs');
  fs.writeFileSync(scriptPath, migrationScript);

  try {
    log('Executing migration...', 'cyan');
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
    log('[SUCCESS] Tasks migration completed', 'green');
  } catch (error: any) {
    log(`[ERROR] Migration failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
    }
  }
}

main();