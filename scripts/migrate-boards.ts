#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Firebase Boards Migration Script (TypeScript)
 *
 * Automatically populates Firestore with sample board data
 * Reads Firebase config from environment.ts
 *
 * Usage: npm run migrate:boards
 */

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface Board {
  id: string;
  taskId: string;
  status: 'todo' | 'in-progress' | 'await-feedback' | 'done';
  assignedContacts: string[];
  order: number;
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

function readFirebaseConfig(): FirebaseConfig | null {
  const envPath = path.join(__dirname, '..', 'src', 'environment', 'environment.ts');

  if (!fs.existsSync(envPath)) {
    log('[ERROR] Environment file not found', 'red');
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');

  if (!envContent.includes('firebaseConfig') || !envContent.includes('projectId')) {
    log('[ERROR] No valid Firebase config found', 'red');
    return null;
  }

  try {
    const configMatch = envContent.match(/firebaseConfig\s*=\s*\{([^}]+)\}/s);
    if (!configMatch) return null;

    const configString = '{' + configMatch[1] + '}';
    const lines = configString.split('\n');
    const config: Partial<FirebaseConfig> = {};

    for (const line of lines) {
      if (line.trim().startsWith('/*') || line.trim().startsWith('*') ||
          line.trim().startsWith('//') || !line.includes(':')) {
        continue;
      }
      const keyValueMatch = line.match(/["']?(\w+)["']?\s*:\s*["']([^"']+)["']/);
      if (keyValueMatch) {
        config[keyValueMatch[1] as keyof FirebaseConfig] = keyValueMatch[2];
      }
    }

    if (!config.projectId || !config.apiKey || !config.authDomain) {
      log('[ERROR] Incomplete Firebase config', 'red');
      return null;
    }

    log(`[INFO] Found Firebase project: ${config.projectId}`, 'cyan');
    return config as FirebaseConfig;
  } catch (error) {
    log(`[ERROR] Could not parse Firebase config: ${error}`, 'red');
    return null;
  }
}

function loadSampleBoards(): Board[] {
  const boardsPath = path.join(__dirname, 'data', 'sample-boards.json');
  const boardsData = fs.readFileSync(boardsPath, 'utf8');
  return JSON.parse(boardsData) as Board[];
}

function createMigrationScript(config: FirebaseConfig): string {
  const sampleBoards = loadSampleBoards();

  return `
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = ${JSON.stringify(config, null, 2)};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleBoards = ${JSON.stringify(sampleBoards, null, 2)};

async function migrateBoards() {
  try {
    const boardsCollection = collection(db, 'boards');
    const existingBoards = await getDocs(boardsCollection);

    if (existingBoards.size > 0) {
      console.log('[INFO] Boards collection already contains data. Skipping migration.');
      process.exit(0);
    }

    console.log('[MIGRATE] Starting boards migration...');

    for (const board of sampleBoards) {
      const boardRef = doc(db, 'boards', board.id);
      await setDoc(boardRef, {
        ...board,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(\`[SUCCESS] Migrated board: \${board.id} (task: \${board.taskId}, status: \${board.status})\`);
    }

    console.log(\`[SUCCESS] Migrated \${sampleBoards.length} boards successfully\`);
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Migration failed:', error.message);
    process.exit(1);
  }
}

migrateBoards();
`;
}

async function main(): Promise<void> {
  log('Firebase Boards Migration', 'bright');
  log('=========================', 'blue');

  const config = readFirebaseConfig();
  if (!config) {
    process.exit(1);
  }

  log('Creating migration script...', 'cyan');
  const migrationScript = createMigrationScript(config);

  const scriptPath = path.join(__dirname, 'temp-migrate-boards.mjs');
  fs.writeFileSync(scriptPath, migrationScript);

  try {
    log('Executing migration...', 'cyan');
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
    log('[SUCCESS] Boards migration completed', 'green');
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
