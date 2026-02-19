import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ADMIN_UPDATES_FILE = path.join(DATA_DIR, 'admin-updates.json');
const CUSTOM_ALERTS_FILE = path.join(DATA_DIR, 'custom-alerts.json');

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_ENABLED = Boolean(KV_URL && KV_TOKEN);

const KV_KEYS = {
  adminUpdates: 'beach_admin_updates',
  customAlerts: 'beach_custom_alerts',
} as const;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_ENABLED) return null;

  const response = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`KV get failed (${response.status})`);
  }

  const result = await response.json();
  if (!result?.result) return null;

  return JSON.parse(result.result) as T;
}

async function kvSet<T>(key: string, value: T): Promise<void> {
  if (!KV_ENABLED) return;

  const payload = encodeURIComponent(JSON.stringify(value));
  const response = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}/${payload}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`KV set failed (${response.status})`);
  }
}

function readFileJson<T>(filePath: string): T[] {
  ensureDataDir();
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T[];
}

function writeFileJson<T>(filePath: string, data: T[]): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function readAdminUpdates<T>(): Promise<T[]> {
  if (KV_ENABLED) {
    return (await kvGet<T[]>(KV_KEYS.adminUpdates)) || [];
  }
  return readFileJson<T>(ADMIN_UPDATES_FILE);
}

export async function writeAdminUpdates<T>(updates: T[]): Promise<void> {
  if (KV_ENABLED) {
    await kvSet(KV_KEYS.adminUpdates, updates);
    return;
  }
  writeFileJson(ADMIN_UPDATES_FILE, updates);
}

export async function readCustomAlerts<T>(): Promise<T[]> {
  if (KV_ENABLED) {
    return (await kvGet<T[]>(KV_KEYS.customAlerts)) || [];
  }
  return readFileJson<T>(CUSTOM_ALERTS_FILE);
}

export async function writeCustomAlerts<T>(alerts: T[]): Promise<void> {
  if (KV_ENABLED) {
    await kvSet(KV_KEYS.customAlerts, alerts);
    return;
  }
  writeFileJson(CUSTOM_ALERTS_FILE, alerts);
}
