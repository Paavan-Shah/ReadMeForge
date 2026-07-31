import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { AppStore, Project, Section, SectionData, SectionId, ThemeId, HistoryEntry } from '../types';
import sectionsData from '../data/sections.json';
import { saveProject, loadProject as dbLoadProject, deleteProject as dbDeleteProject, listProjectMeta } from '../utils/storage';

const MAX_HISTORY = 50;

function cloneSections(sections: Section[]): Section[] {
  return JSON.parse(JSON.stringify(sections));
}

function createDefaultProject(name = 'Untitled Project'): Project {
  const now = Date.now();
  return {
    id: uuidv4(),
    name,
    templateId: null,
    sections: [],
    createdAt: now,
    updatedAt: now,
  };
}

function sectionDefaults(sectionId: SectionId): Section {
  const def = (sectionsData as { id: string; defaultData: SectionData }[]).find(
    (s) => s.id === sectionId
  );
  return {
    instanceId: uuidv4(),
    sectionId,
    enabled: true,
    data: def ? JSON.parse(JSON.stringify(def.defaultData)) : ({} as SectionData),
  } as Section;
}

function pushHistory(past: HistoryEntry[], sections: Section[]): HistoryEntry[] {
  const next = [...past, { sections: cloneSections(sections), timestamp: Date.now() }];
  if (next.length > MAX_HISTORY) next.shift();
  return next;
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    project: createDefaultProject(),
    setProject: (p) => {
      set({ project: p, past: [], future: [] });
    },

    updateSection: (instanceId, data) => {
      const { project, past } = get();
      const newSections = (project.sections.map((s) =>
        s.instanceId === instanceId ? { ...s, data: { ...s.data, ...data } } : s
      ) as unknown) as Section[];
      set({
        project: { ...project, sections: newSections, updatedAt: Date.now() },
        past: pushHistory(past, project.sections),
        future: [],
      });
    },

    addSection: (sectionId) => {
      const { project, past } = get();
      const newSection = sectionDefaults(sectionId);
      const newSections = [...project.sections, newSection];
      set({
        project: { ...project, sections: newSections, updatedAt: Date.now() },
        past: pushHistory(past, project.sections),
        future: [],
        selectedInstanceId: newSection.instanceId,
      });
    },

    removeSection: (instanceId) => {
      const { project, past } = get();
      const newSections = project.sections.filter((s) => s.instanceId !== instanceId);
      set({
        project: { ...project, sections: newSections, updatedAt: Date.now() },
        past: pushHistory(past, project.sections),
        future: [],
        selectedInstanceId: null,
      });
    },

    reorderSections: (from, to) => {
      const { project, past } = get();
      const sections = [...project.sections];
      const [moved] = sections.splice(from, 1);
      sections.splice(to, 0, moved);
      set({
        project: { ...project, sections, updatedAt: Date.now() },
        past: pushHistory(past, project.sections),
        future: [],
      });
    },

    toggleSection: (instanceId) => {
      const { project } = get();
      const newSections = project.sections.map((s) =>
        s.instanceId === instanceId ? { ...s, enabled: !s.enabled } : s
      );
      set({ project: { ...project, sections: newSections, updatedAt: Date.now() } });
    },

    // Selection
    selectedInstanceId: null,
    setSelectedInstanceId: (id) => set({ selectedInstanceId: id }),

    // Undo/Redo
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    undo: () => {
      const { past, future, project } = get();
      if (past.length === 0) return;
      const prev = past[past.length - 1];
      set({
        project: { ...project, sections: cloneSections(prev.sections), updatedAt: Date.now() },
        past: past.slice(0, -1),
        future: [{ sections: cloneSections(project.sections), timestamp: Date.now() }, ...future],
        canUndo: past.length > 1,
        canRedo: true,
      });
    },

    redo: () => {
      const { past, future, project } = get();
      if (future.length === 0) return;
      const next = future[0];
      set({
        project: { ...project, sections: cloneSections(next.sections), updatedAt: Date.now() },
        past: [...past, { sections: cloneSections(project.sections), timestamp: Date.now() }],
        future: future.slice(1),
        canUndo: true,
        canRedo: future.length > 1,
      });
    },

    // Theme
    theme: (localStorage.getItem('readme-forge:theme') as ThemeId) || 'github-dark',
    setTheme: (t) => {
      localStorage.setItem('readme-forge:theme', t);
      set({ theme: t });
    },

    // UI
    sidebarOpen: true,
    setSidebarOpen: (v) => set({ sidebarOpen: v }),
    previewTab: 'preview',
    setPreviewTab: (t) => set({ previewTab: t }),
    searchQuery: '',
    setSearchQuery: (q) => set({ searchQuery: q }),

    // Saved projects
    savedProjects: [],

    loadSavedProjects: async () => {
      const metas = await listProjectMeta();
      set({ savedProjects: metas });
    },

    saveCurrentProject: async () => {
      const { project } = get();
      const updated = { ...project, updatedAt: Date.now() };
      await saveProject(updated);
      set({ project: updated });
      get().loadSavedProjects();
    },

    loadProject: async (id) => {
      const p = await dbLoadProject(id);
      if (p) {
        set({ project: p, past: [], future: [], selectedInstanceId: null });
      }
    },

    deleteProject: async (id) => {
      await dbDeleteProject(id);
      get().loadSavedProjects();
    },

    createNewProject: (name = 'Untitled Project') => {
      set({
        project: createDefaultProject(name),
        past: [],
        future: [],
        selectedInstanceId: null,
      });
    },

    importProject: (json) => {
      try {
        const p = JSON.parse(json) as Project;
        set({ project: p, past: [], future: [], selectedInstanceId: null });
      } catch (e) {
        console.error('Import failed:', e);
      }
    },

    exportProject: () => {
      return JSON.stringify(get().project, null, 2);
    },
  }))
);

// Derive canUndo/canRedo reactively
useAppStore.subscribe(
  (state) => state.past.length,
  (len) => useAppStore.setState({ canUndo: len > 0 })
);
useAppStore.subscribe(
  (state) => state.future.length,
  (len) => useAppStore.setState({ canRedo: len > 0 })
);
