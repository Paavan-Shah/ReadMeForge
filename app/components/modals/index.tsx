import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Modal, Button } from '../ui';
import templatesData from '../../data/templates.json';
import sectionsData from '../../data/sections.json';
import { SectionId, SectionData } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  sectionIds: SectionId[];
}

interface SectionDefData {
  id: SectionId;
  defaultData: SectionData;
}

export const TemplatePickerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const setProject = useAppStore((s) => s.setProject);
  const project = useAppStore((s) => s.project);

  const templates = templatesData as Template[];
  const sectionDefs = sectionsData as SectionDefData[];

  const handleApply = () => {
    if (!selected) return;
    const template = templates.find((t) => t.id === selected);
    if (!template) return;

    const sections = template.sectionIds.map((sectionId) => {
      const def = sectionDefs.find((d) => d.id === sectionId);
      return {
        instanceId: uuidv4(),
        sectionId,
        enabled: true,
        data: def ? JSON.parse(JSON.stringify(def.defaultData)) : ({} as SectionData),
      };
    });

    setProject({
      ...project,
      templateId: selected,
      sections,
      updatedAt: Date.now(),
    });
    onClose();
  };

  return (
    <Modal
      title="📐 Choose a Template"
      onClose={onClose}
      large
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleApply} disabled={!selected}>
            Apply Template
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Start from a pre-built template. Your existing sections will be replaced.
      </p>
      <div className="template-grid">
        {templates.map((t) => (
          <div
            key={t.id}
            className={`template-card ${selected === t.id ? 'selected' : ''}`}
            onClick={() => setSelected(t.id)}
          >
            <div className="template-card-icon">{t.icon}</div>
            <div className="template-card-name">{t.name}</div>
            <div className="template-card-desc">{t.description}</div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
              {t.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

/* ─── ProjectManagerModal ─────────────────────────────────────────────────── */

export const ProjectManagerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const savedProjects = useAppStore((s) => s.savedProjects);
  const loadSavedProjects = useAppStore((s) => s.loadSavedProjects);
  const loadProject = useAppStore((s) => s.loadProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const createNewProject = useAppStore((s) => s.createNewProject);
  const importProject = useAppStore((s) => s.importProject);
  const exportProject = useAppStore((s) => s.exportProject);

  useEffect(() => { loadSavedProjects(); }, [loadSavedProjects]);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        importProject(ev.target?.result as string);
        onClose();
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = () => {
    const json = exportProject();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'readme-forge-project.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal title="📁 Projects" onClose={onClose}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <Button variant="primary" icon="FilePlus" onClick={() => { createNewProject(); onClose(); }}>
          New Project
        </Button>
        <Button variant="secondary" icon="Upload" onClick={handleImport}>Import JSON</Button>
        <Button variant="secondary" icon="Download" onClick={handleExport}>Export JSON</Button>
      </div>

      {savedProjects.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
          No saved projects yet. Projects are autosaved as you edit.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {savedProjects.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {new Date(p.updatedAt).toLocaleDateString()} {new Date(p.updatedAt).toLocaleTimeString()}
                </div>
              </div>
              <Button variant="secondary" size="sm" icon="FolderOpen" onClick={() => { loadProject(p.id); onClose(); }}>
                Open
              </Button>
              <Button variant="danger" size="sm" icon="Trash2" onClick={() => deleteProject(p.id)} />
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

/* ─── ThemeModal ─────────────────────────────────────────────────────────── */

const THEMES = [
  { id: 'github-dark', label: '🌙 GitHub Dark', preview: '#0d1117' },
  { id: 'github-light', label: '☀️ GitHub Light', preview: '#ffffff' },
  { id: 'vscode-dark', label: '💙 VS Code Dark', preview: '#1e1e1e' },
  { id: 'dracula', label: '🧛 Dracula', preview: '#282a36' },
  { id: 'nord', label: '❄️ Nord', preview: '#2e3440' },
  { id: 'solarized', label: '🌊 Solarized', preview: '#002b36' },
];

export const ThemeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <Modal title="🎨 Choose Theme" onClose={onClose}>
      <div className="theme-grid">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`theme-pill ${theme === t.id ? 'active' : ''}`}
            onClick={() => { setTheme(t.id as typeof theme); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
          >
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: t.preview, border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
            {t.label}
          </button>
        ))}
      </div>
    </Modal>
  );
};
