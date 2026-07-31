import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Section, SectionId, SectionData } from '../../types';
import { Icon, Button, Toggle, Tooltip } from '../ui';
import { generateSectionMarkdown } from '../../utils/markdown';
import {
  TitleForm, LogoBannerForm, BadgesForm, DescriptionForm, FeaturesForm,
  InstallationForm, UsageForm, TechStackForm, ScreenshotsForm, ApiForm,
  EnvVarsForm, FolderStructureForm, ContributingForm, RoadmapForm,
  FaqForm, ChangelogForm, LicenseForm, ContactForm, AcknowledgementsForm,
} from '../sections';

const SECTION_ICON_MAP: Record<SectionId, string> = {
  'title': 'Type',
  'logo-banner': 'Image',
  'badges': 'Shield',
  'description': 'FileText',
  'features': 'Sparkles',
  'installation': 'Download',
  'usage': 'Play',
  'tech-stack': 'Layers',
  'screenshots': 'Monitor',
  'api-reference': 'Code2',
  'env-vars': 'Settings',
  'folder-structure': 'FolderTree',
  'contributing': 'GitBranch',
  'roadmap': 'Map',
  'faq': 'HelpCircle',
  'changelog': 'History',
  'license': 'Scale',
  'contact': 'Mail',
  'acknowledgements': 'Heart',
};

const SECTION_LABEL_MAP: Record<SectionId, string> = {
  'title': 'Title',
  'logo-banner': 'Logo / Banner',
  'badges': 'Badges',
  'description': 'Description',
  'features': 'Features',
  'installation': 'Installation',
  'usage': 'Usage',
  'tech-stack': 'Tech Stack',
  'screenshots': 'Screenshots',
  'api-reference': 'API Reference',
  'env-vars': 'Environment Variables',
  'folder-structure': 'Folder Structure',
  'contributing': 'Contributing',
  'roadmap': 'Roadmap',
  'faq': 'FAQ',
  'changelog': 'Changelog',
  'license': 'License',
  'contact': 'Contact',
  'acknowledgements': 'Acknowledgements',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FORM_MAP: Record<SectionId, React.FC<{ data: any; onChange: (d: any) => void }>> = {
  'title': TitleForm,
  'logo-banner': LogoBannerForm,
  'badges': BadgesForm,
  'description': DescriptionForm,
  'features': FeaturesForm,
  'installation': InstallationForm,
  'usage': UsageForm,
  'tech-stack': TechStackForm,
  'screenshots': ScreenshotsForm,
  'api-reference': ApiForm,
  'env-vars': EnvVarsForm,
  'folder-structure': FolderStructureForm,
  'contributing': ContributingForm,
  'roadmap': RoadmapForm,
  'faq': FaqForm,
  'changelog': ChangelogForm,
  'license': LicenseForm,
  'contact': ContactForm,
  'acknowledgements': AcknowledgementsForm,
};

interface SectionCardProps {
  section: Section;
  index: number;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  isDragging?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section, dragHandleProps, isDragging }) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const updateSection = useAppStore((s) => s.updateSection);
  const removeSection = useAppStore((s) => s.removeSection);
  const toggleSection = useAppStore((s) => s.toggleSection);
  const selectedInstanceId = useAppStore((s) => s.selectedInstanceId);
  const setSelectedInstanceId = useAppStore((s) => s.setSelectedInstanceId);

  const isSelected = selectedInstanceId === section.instanceId;
  const FormComponent = FORM_MAP[section.sectionId];
  const label = SECTION_LABEL_MAP[section.sectionId];
  const iconName = SECTION_ICON_MAP[section.sectionId];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const md = generateSectionMarkdown(section);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleChange = (patch: Partial<SectionData>) => {
    updateSection(section.instanceId, patch);
  };

  return (
    <div
      className={`section-card ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${!section.enabled ? 'opacity-60' : ''}`}
      onClick={() => setSelectedInstanceId(section.instanceId)}
      style={{ opacity: section.enabled ? 1 : 0.55 }}
    >
      <div className="section-card-header" onClick={() => setExpanded((v) => !v)}>
        <span className="drag-handle" {...dragHandleProps} onClick={(e) => e.stopPropagation()}>
          <Icon name="GripVertical" size={14} />
        </span>
        <span className="section-card-icon">
          <Icon name={iconName} size={14} />
        </span>
        <span className="section-card-title">{label}</span>
        <div className="section-card-controls" onClick={(e) => e.stopPropagation()}>
          <Tooltip text={copied ? 'Copied!' : 'Copy section markdown'}>
            <Button variant="ghost" icon={copied ? 'Check' : 'Copy'} size="sm" onClick={handleCopy} aria-label="Copy" />
          </Tooltip>
          <Toggle checked={section.enabled} onChange={() => toggleSection(section.instanceId)} />
          <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeSection(section.instanceId)} aria-label="Remove" />
          <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={14} />
        </div>
      </div>

      {expanded && section.enabled && FormComponent && (
        <div className="section-card-body">
          <FormComponent data={section.data} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};
