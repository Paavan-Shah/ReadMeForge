import { get, set, del, keys } from 'idb-keyval';
import { Project } from '../types';

const IDB_PREFIX = 'readme-forge:project:';
const LS_INDEX_KEY = 'readme-forge:index';

// ─── IndexedDB helpers ────────────────────────────────────────────────────

async function idbGet<T>(key: string): Promise<T | undefined> {
  try {
    return await get<T>(key);
  } catch {
    return undefined;
  }
}

async function idbSet(key: string, value: unknown): Promise<void> {
  try {
    await set(key, value);
  } catch {
    // Fallback to localStorage
    localStorage.setItem(key, JSON.stringify(value));
  }
}

async function idbDel(key: string): Promise<void> {
  try {
    await del(key);
  } catch {
    localStorage.removeItem(key);
  }
}

async function idbKeys(): Promise<string[]> {
  try {
    const allKeys = await keys();
    return (allKeys as string[]).filter((k) => typeof k === 'string' && k.startsWith(IDB_PREFIX));
  } catch {
    // Fallback: read from LS index
    try {
      const index = JSON.parse(localStorage.getItem(LS_INDEX_KEY) || '[]') as string[];
      return index;
    } catch {
      return [];
    }
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

export async function saveProject(project: Project): Promise<void> {
  const key = `${IDB_PREFIX}${project.id}`;
  await idbSet(key, project);
}

export async function loadProject(id: string): Promise<Project | undefined> {
  const key = `${IDB_PREFIX}${id}`;
  const result = await idbGet<Project>(key);
  if (result) return result;
  // LS fallback
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as Project;
  } catch { /* ignore */ }
  return undefined;
}

export async function deleteProject(id: string): Promise<void> {
  await idbDel(`${IDB_PREFIX}${id}`);
}

export async function listProjectMeta(): Promise<{ id: string; name: string; updatedAt: number }[]> {
  const projectKeys = await idbKeys();
  const metas: { id: string; name: string; updatedAt: number }[] = [];

  for (const key of projectKeys) {
    try {
      const project = await idbGet<Project>(key);
      if (project) {
        metas.push({ id: project.id, name: project.name, updatedAt: project.updatedAt });
      }
    } catch { /* skip */ }
  }

  // Also check localStorage
  try {
    const lsIndex = JSON.parse(localStorage.getItem(LS_INDEX_KEY) || '[]') as string[];
    for (const key of lsIndex) {
      if (!projectKeys.includes(key)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const project = JSON.parse(raw) as Project;
          metas.push({ id: project.id, name: project.name, updatedAt: project.updatedAt });
        }
      }
    }
  } catch { /* ignore */ }

  return metas.sort((a, b) => b.updatedAt - a.updatedAt);
}
