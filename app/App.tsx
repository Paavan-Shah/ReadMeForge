import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useAutosave } from './hooks/useAutosave';
import { Sidebar } from './components/layout/Sidebar';
import { EditorPane } from './components/layout/EditorPane';
import { PreviewPane } from './components/layout/PreviewPane';
import { Icon, Button, Tooltip } from './components/ui';
import { TemplatePickerModal, ProjectManagerModal, ThemeModal } from './components/modals';

export default function App() {
  const theme = useAppStore((s) => s.theme);
  const project = useAppStore((s) => s.project);
  const setProject = useAppStore((s) => s.setProject);
  const canUndo = useAppStore((s) => s.canUndo);
  const canRedo = useAppStore((s) => s.canRedo);
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  useAutosave();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [editingName, setEditingName] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  useEffect(() => {
    const handleTemplateEvent = () => setShowTemplates(true);
    window.addEventListener('open-template-picker', handleTemplateEvent);
    return () => window.removeEventListener('open-template-picker', handleTemplateEvent);
  }, []);

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="topbar-brand">
          <div className="topbar-brand-icon">
            <Icon name="FileText" size={16} />
          </div>
          README Forge
        </div>

        <Button
          variant="ghost"
          icon={sidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'}
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ marginLeft: 8 }}
          aria-label="Toggle Sidebar"
        />

        <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />

        {editingName ? (
          <input
            className="topbar-project-name-input"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
            autoFocus
          />
        ) : (
          <div className="topbar-project-name" onClick={() => setEditingName(true)}>
            {project.name}
          </div>
        )}

        <div className="topbar-actions">
          <div className="topbar-autosave">
            <div className="autosave-dot" /> Autosaved
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />
          <Tooltip text="Undo (Ctrl+Z)">
            <Button variant="ghost" icon="Undo2" size="sm" onClick={undo} disabled={!canUndo} aria-label="Undo" />
          </Tooltip>
          <Tooltip text="Redo (Ctrl+Y)">
            <Button variant="ghost" icon="Redo2" size="sm" onClick={redo} disabled={!canRedo} aria-label="Redo" />
          </Tooltip>
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 8px' }} />
          <Button variant="secondary" icon="FolderOpen" size="sm" onClick={() => setShowProjects(true)}>
            Projects
          </Button>
          <Button variant="secondary" icon="Palette" size="sm" onClick={() => setShowTheme(true)}>
            Theme
          </Button>
          <Button
            variant="primary"
            icon="Github"
            size="sm"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            Star
          </Button>
        </div>
      </header>

      <main className="app-body">
        <Sidebar />
        <EditorPane />
        <PreviewPane />
      </main>

      {showTemplates && <TemplatePickerModal onClose={() => setShowTemplates(false)} />}
      {showProjects && <ProjectManagerModal onClose={() => setShowProjects(false)} />}
      {showTheme && <ThemeModal onClose={() => setShowTheme(false)} />}
    </div>
  );
}
