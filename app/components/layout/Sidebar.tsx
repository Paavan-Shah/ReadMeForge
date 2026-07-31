import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Icon, Button } from '../ui';
import { SectionId } from '../../types';
import sectionsData from '../../data/sections.json';

interface SectionDef {
  id: SectionId;
  label: string;
  icon: string;
  description: string;
  category: string;
  singleton: boolean;
}

const CATEGORY_ORDER = ['header', 'body', 'technical', 'community', 'footer'];
const CATEGORY_LABELS: Record<string, string> = {
  header: 'Header',
  body: 'Content',
  technical: 'Technical',
  community: 'Community',
  footer: 'Footer',
};

export const Sidebar: React.FC = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const addSection = useAppStore((s) => s.addSection);
  const project = useAppStore((s) => s.project);

  const usedSectionIds = useMemo(
    () => new Set(project.sections.map((s) => s.sectionId)),
    [project.sections]
  );

  const defs = sectionsData as SectionDef[];
  const filtered = useMemo(() => {
    if (!searchQuery) return defs;
    return defs.filter(
      (d) =>
        d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, defs]);

  const byCategory = useMemo(() => {
    const grouped: Record<string, SectionDef[]> = {};
    CATEGORY_ORDER.forEach((cat) => {
      const items = filtered.filter((d) => d.category === cat);
      if (items.length > 0) grouped[cat] = items;
    });
    return grouped;
  }, [filtered]);

  if (!sidebarOpen) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-search">
          <Icon name="Search" size={13} className="sidebar-search-icon" />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-categories">
        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat}>
            <div className="sidebar-category-label">{CATEGORY_LABELS[cat] || cat}</div>
            {items.map((def) => {
              const inUse = usedSectionIds.has(def.id) && def.singleton;
              return (
                <div
                  key={def.id}
                  className={`sidebar-section-item ${inUse ? 'in-use' : ''}`}
                  onClick={() => !inUse && addSection(def.id)}
                  title={def.description}
                >
                  <Icon name={def.icon} size={14} className="sidebar-section-icon" />
                  <span>{def.label}</span>
                  {inUse ? (
                    <Icon name="Check" size={12} style={{ marginLeft: 'auto', color: 'var(--success)' }} />
                  ) : (
                    <div className="sidebar-add-btn">
                      <Icon name="Plus" size={10} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            No sections found
          </div>
        )}
      </div>

      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-subtle)' }}>
        <Button
          variant="primary"
          icon="LayoutTemplate"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => {
            const event = new CustomEvent('open-template-picker');
            window.dispatchEvent(event);
          }}
        >
          Choose Template
        </Button>
      </div>
    </aside>
  );
};
