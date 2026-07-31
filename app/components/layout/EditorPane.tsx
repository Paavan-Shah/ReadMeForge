import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppStore } from '../../store/useAppStore';
import { SectionCard } from './SectionCard';
import { Section } from '../../types';
import { Icon, Button } from '../ui';

const SortableSectionCard: React.FC<{ section: Section; index: number }> = ({ section, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.instanceId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionCard
        section={section}
        index={index}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
};

export const EditorPane: React.FC = () => {
  const project = useAppStore((s) => s.project);
  const reorderSections = useAppStore((s) => s.reorderSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const sections = project.sections;
    const fromIndex = sections.findIndex((s) => s.instanceId === active.id);
    const toIndex = sections.findIndex((s) => s.instanceId === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderSections(fromIndex, toIndex);
    }
  };

  return (
    <div className="editor-pane">
      <div className="editor-pane-header">
        <Icon name="Pencil" size={14} />
        <span className="editor-pane-title">Editor</span>
        <div className="editor-pane-actions">
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {project.sections.filter((s) => s.enabled).length} / {project.sections.length} sections
          </span>
        </div>
      </div>

      {project.sections.length === 0 ? (
        <div className="editor-empty-state">
          <div className="editor-empty-icon">
            <Icon name="FileEdit" size={24} />
          </div>
          <div className="editor-empty-title">No sections yet</div>
          <div className="editor-empty-text">
            Click a section in the sidebar to add it,<br />or start from a project template.
          </div>
          <Button
            variant="primary"
            icon="LayoutTemplate"
            onClick={() => window.dispatchEvent(new CustomEvent('open-template-picker'))}
          >
            Choose Template
          </Button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={project.sections.map((s) => s.instanceId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="editor-sections-list">
              {project.sections.map((section, index) => (
                <SortableSectionCard key={section.instanceId} section={section} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
