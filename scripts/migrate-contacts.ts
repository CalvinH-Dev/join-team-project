#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { getFirebaseConfig, FirebaseConfig } from './firebase.config';

/**
 * Firebase Contacts Migration Script (TypeScript)
 *
 * Automatically populates Firestore with sample contact data
 * Uses configuration from firebase.config.ts
 *
 * Usage: npm run migrate:contacts
 */

/**
 * Contact Interface - matches the current application interface
 * @see src/app/core/interfaces/contact.ts
 */
interface Contact {
  id?: string;
  name: string;
  email: string;
  telephone: string;
  color?: number;
  initials?: string;
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

function loadSampleContacts(): Contact[] {
  const contactsPath = path.join(__dirname, 'data', 'sample-contacts.json');
  const contactsData = fs.readFileSync(contactsPath, 'utf8');
  return JSON.parse(contactsData) as Contact[];
}

function createMigrationScript(config: FirebaseConfig): string {
  const sampleContacts = loadSampleContacts();

  return `
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = ${JSON.stringify(config, null, 2)};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleContacts = ${JSON.stringify(sampleContacts, null, 2)};

async function migrateContacts() {
  try {
    const contactsCollection = collection(db, 'contacts');
    const existingContacts = await getDocs(contactsCollection);

    if (existingContacts.size > 0) {
      console.log('[INFO] Contacts collection already contains data. Skipping migration.');
      process.exit(0);
    }

    console.log('[MIGRATE] Starting contacts migration...');

    for (const contact of sampleContacts) {
      const contactRef = doc(db, 'contacts', contact.id);
      await setDoc(contactRef, contact);
      console.log(\`[SUCCESS] Migrated contact: \${contact.name}\`);
    }

    console.log(\`[SUCCESS] Migrated \${sampleContacts.length} contacts successfully\`);
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Migration failed:', error.message);
    process.exit(1);
  }
}

migrateContacts();
`;
}

async function main(): Promise<void> {
  log('Firebase Contacts Migration', 'bright');
  log('===========================', 'blue');

  const config = getFirebaseConfig();
  log(`[INFO] Using Firebase project: ${config.projectId}`, 'cyan');

  log('Creating migration script...', 'cyan');
  const migrationScript = createMigrationScript(config);

  const scriptPath = path.join(__dirname, 'temp-migrate-contacts.mjs');
  fs.writeFileSync(scriptPath, migrationScript);

  try {
    log('Executing migration...', 'cyan');
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
    log('[SUCCESS] Contacts migration completed', 'green');
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