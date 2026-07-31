import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Input, Textarea, Select, FormGroup, Segmented, Toggle } from '../ui';
import badgesData from '../../data/badges.json';
import {
  TitleData, LogoBannerData, BadgesData, Badge, DescriptionData,
  FeaturesData, Feature, InstallationData, InstallationStep,
  UsageData, UsageExample, TechStackData, TechItem,
  ScreenshotsData, Screenshot, ApiData, ApiEndpoint,
  EnvVarsData, EnvVar, FolderStructureData, ContributingData,
  RoadmapData, RoadmapItem, FaqData, FaqItem,
  ChangelogData, ChangelogEntry, LicenseData, ContactData,
  ContactItem, AcknowledgementsData, AcknowledgementItem,
} from '../../types';

const LANGUAGES = [
  { value: 'bash', label: 'bash / shell' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'java', label: 'Java' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'cmake', label: 'CMake' },
  { value: 'text', label: 'Plain Text' },
];

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
];

/* ─── ListBuilder ─────────────────────────────────────────────────────────── */

interface ListBuilderProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
}

export const ListBuilder: React.FC<ListBuilderProps> = ({ items, onChange, placeholder, label }) => {
  const add = () => onChange([...items, '']);
  const update = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  };
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <FormGroup label={label}>
      <div className="list-builder">
        {items.map((item, idx) => (
          <div className="list-builder-item" key={idx}>
            <Input
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder || 'Item'}
            />
            <Button variant="danger" icon="Trash2" size="sm" onClick={() => remove(idx)} type="button" />
          </div>
        ))}
        <div className="list-builder-add" onClick={add}>
          <Button variant="ghost" icon="Plus" size="sm" type="button">Add item</Button>
        </div>
      </div>
    </FormGroup>
  );
};

/* ─── TitleSection ─────────────────────────────────────────────────────────── */

interface SectionFormProps<T> {
  data: T;
  onChange: (data: Partial<T>) => void;
}

export const TitleForm: React.FC<SectionFormProps<TitleData>> = ({ data, onChange }) => (
  <>
    <FormGroup label="Project Name">
      <Input value={data.projectName} onChange={(e) => onChange({ projectName: e.target.value })} placeholder="My Awesome Project" />
    </FormGroup>
    <FormGroup label="Tagline">
      <Input value={data.tagline} onChange={(e) => onChange({ tagline: e.target.value })} placeholder="A short, catchy description" />
    </FormGroup>
    <FormGroup label="Alignment">
      <Segmented<'left'|'center'|'right'>
        value={data.alignment}
        onChange={(v) => onChange({ alignment: v })}
        options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
      />
    </FormGroup>
  </>
);

/* ─── LogoBannerForm ──────────────────────────────────────────────────────── */

export const LogoBannerForm: React.FC<SectionFormProps<LogoBannerData>> = ({ data, onChange }) => (
  <>
    <FormGroup label="Mode">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Toggle checked={data.isBanner} onChange={(v) => onChange({ isBanner: v })} />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {data.isBanner ? '🖼️ Full-width banner' : '🔰 Compact logo'}
        </span>
      </div>
    </FormGroup>
    <FormGroup label="Image URL" hint="Link to your logo or banner image (e.g. from GitHub, imgur, etc.)">
      <Input value={data.imageUrl} onChange={(e) => onChange({ imageUrl: e.target.value })} placeholder="https://example.com/logo.png" />
    </FormGroup>
    <FormGroup label="Alt Text">
      <Input value={data.altText} onChange={(e) => onChange({ altText: e.target.value })} placeholder="Project Logo" />
    </FormGroup>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <FormGroup label="Width (px)">
        <Input value={data.width} onChange={(e) => onChange({ width: e.target.value })} placeholder="200" type="number" />
      </FormGroup>
      <FormGroup label="Alignment">
        <Segmented<'left'|'center'|'right'>
          value={data.alignment}
          onChange={(v) => onChange({ alignment: v })}
          options={[{ value: 'left', label: 'L' }, { value: 'center', label: 'C' }, { value: 'right', label: 'R' }]}
        />
      </FormGroup>
    </div>
    <FormGroup label="Clickable Link URL" hint="Optional: wrap the image in a link">
      <Input value={data.linkUrl} onChange={(e) => onChange({ linkUrl: e.target.value })} placeholder="https://github.com/user/repo" />
    </FormGroup>
    {data.imageUrl && (
      <div style={{ textAlign: data.alignment, padding: '8px 0' }}>
        <img
          src={data.imageUrl}
          alt={data.altText || 'preview'}
          style={{ maxWidth: data.width ? `${data.width}px` : '200px', maxHeight: 120, borderRadius: 8, border: '1px solid var(--border)' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Live preview</p>
      </div>
    )}
  </>
);

/* ─── BadgesForm ──────────────────────────────────────────────────────────── */

interface BadgePickerProps {
  selected: Badge[];
  onToggle: (badge: Badge) => void;
}

const BadgePicker: React.FC<BadgePickerProps> = ({ selected, onToggle }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const bdefs = badgesData as { id: string; label: string; url: string; category: string }[];
  const categories = ['All', ...new Set(bdefs.map((b) => b.category))];
  const filtered = bdefs.filter((b) => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const matchSearch = b.label.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Input placeholder="Search badges..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`theme-pill ${activeCategory === c ? 'active' : ''}`}
            style={{ padding: '3px 10px', fontSize: 11 }}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
        {filtered.map((b) => {
          const isSelected = selected.some((s) => s.id === b.id);
          return (
            <div
              key={b.id}
              className={`badge-chip ${isSelected ? 'active' : ''}`}
              style={isSelected ? { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-subtle)' } : {}}
              onClick={() => onToggle({ id: b.id, label: b.label, url: b.url, category: b.category })}
            >
              <img src={b.url} alt={b.label} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              {b.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BadgesForm: React.FC<SectionFormProps<BadgesData>> = ({ data, onChange }) => {
  const toggle = (badge: Badge) => {
    const exists = data.badges.find((b) => b.id === badge.id);
    onChange({ badges: exists ? data.badges.filter((b) => b.id !== badge.id) : [...data.badges, badge] });
  };

  return (
    <>
      <FormGroup label="Alignment">
        <Segmented<'left'|'center'|'right'>
          value={data.alignment}
          onChange={(v) => onChange({ alignment: v })}
          options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]}
        />
      </FormGroup>
      <FormGroup label="Select Badges" hint={`${data.badges.length} selected`}>
        <BadgePicker selected={data.badges} onToggle={toggle} />
      </FormGroup>
      {data.badges.length > 0 && (
        <FormGroup label="Selected (drag to reorder)">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.badges.map((b) => (
              <div key={b.id} className="badge-chip" style={{ borderColor: 'var(--accent)' }}>
                <img src={b.url} alt={b.label} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                {b.label}
                <button type="button" onClick={() => toggle(b)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 0, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        </FormGroup>
      )}
    </>
  );
};

/* ─── DescriptionForm ──────────────────────────────────────────────────────── */

export const DescriptionForm: React.FC<SectionFormProps<DescriptionData>> = ({ data, onChange }) => (
  <>
    <FormGroup label="Overview" hint="A paragraph describing your project">
      <Textarea value={data.overview} onChange={(e) => onChange({ overview: e.target.value })} placeholder="This project is..." rows={4} />
    </FormGroup>
    <FormGroup label="Problem Statement">
      <Input value={data.problemStatement} onChange={(e) => onChange({ problemStatement: e.target.value })} placeholder="The challenge this project solves" />
    </FormGroup>
    <FormGroup label="Solution Statement">
      <Input value={data.solutionStatement} onChange={(e) => onChange({ solutionStatement: e.target.value })} placeholder="How this project solves it" />
    </FormGroup>
    <ListBuilder
      label="Key Points"
      items={data.keyPoints}
      onChange={(keyPoints) => onChange({ keyPoints })}
      placeholder="A key benefit or feature"
    />
  </>
);

/* ─── FeaturesForm ──────────────────────────────────────────────────────────── */

export const FeaturesForm: React.FC<SectionFormProps<FeaturesData>> = ({ data, onChange }) => {
  const addFeature = () => {
    onChange({ features: [...data.features, { id: uuidv4(), icon: '✨', title: '', description: '' }] });
  };
  const updateFeature = (id: string, patch: Partial<Feature>) => {
    onChange({ features: data.features.map((f) => f.id === id ? { ...f, ...patch } : f) });
  };
  const removeFeature = (id: string) => {
    onChange({ features: data.features.filter((f) => f.id !== id) });
  };

  return (
    <>
      <FormGroup label="Section Heading">
        <Input value={data.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="✨ Features" />
      </FormGroup>
      <FormGroup label="Layout">
        <Segmented<'table'|'list'|'grid'>
          value={data.layout}
          onChange={(v) => onChange({ layout: v })}
          options={[{ value: 'table', label: 'Table' }, { value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]}
        />
      </FormGroup>
      <FormGroup label={`Features (${data.features.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.features.map((f) => (
            <div key={f.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input value={f.icon} onChange={(e) => updateFeature(f.id, { icon: e.target.value })} placeholder="✨" style={{ width: 52, textAlign: 'center' }} />
                <Input value={f.title} onChange={(e) => updateFeature(f.id, { title: e.target.value })} placeholder="Feature title" style={{ flex: 1 }} />
                <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeFeature(f.id)} type="button" />
              </div>
              <Input value={f.description} onChange={(e) => updateFeature(f.id, { description: e.target.value })} placeholder="Short description of this feature" />
            </div>
          ))}
          <Button variant="ghost" icon="Plus" size="sm" onClick={addFeature} type="button">Add Feature</Button>
        </div>
      </FormGroup>
    </>
  );
};

/* ─── InstallationForm ──────────────────────────────────────────────────────── */

export const InstallationForm: React.FC<SectionFormProps<InstallationData>> = ({ data, onChange }) => {
  const addStep = () => {
    const step: InstallationStep = { id: uuidv4(), label: 'Install dependencies', code: 'npm install', language: 'bash' };
    onChange({ steps: [...data.steps, step] });
  };
  const updateStep = (id: string, patch: Partial<InstallationStep>) => {
    onChange({ steps: data.steps.map((s) => s.id === id ? { ...s, ...patch } : s) });
  };
  const removeStep = (id: string) => onChange({ steps: data.steps.filter((s) => s.id !== id) });

  return (
    <>
      <ListBuilder label="Prerequisites" items={data.prerequisites} onChange={(prerequisites) => onChange({ prerequisites })} placeholder="Node.js >= 18" />
      <FormGroup label={`Steps (${data.steps.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.steps.map((step, idx) => (
            <div key={step.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', minWidth: 20 }}>{idx + 1}.</span>
                <Input value={step.label} onChange={(e) => updateStep(step.id, { label: e.target.value })} placeholder="Step label" style={{ flex: 1 }} />
                <Select options={LANGUAGES} value={step.language} onChange={(e) => updateStep(step.id, { language: e.target.value })} style={{ width: 120 }} />
                <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeStep(step.id)} type="button" />
              </div>
              <Textarea mono value={step.code} onChange={(e) => updateStep(step.id, { code: e.target.value })} placeholder="Command or code to run" rows={3} />
            </div>
          ))}
          <Button variant="ghost" icon="Plus" size="sm" onClick={addStep} type="button">Add Step</Button>
        </div>
      </FormGroup>
    </>
  );
};

/* ─── UsageForm ──────────────────────────────────────────────────────────────── */

export const UsageForm: React.FC<SectionFormProps<UsageData>> = ({ data, onChange }) => {
  const addExample = () => {
    const ex: UsageExample = { id: uuidv4(), title: 'Basic Example', description: '', code: '', language: 'bash' };
    onChange({ examples: [...data.examples, ex] });
  };
  const updateExample = (id: string, patch: Partial<UsageExample>) => {
    onChange({ examples: data.examples.map((e) => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeExample = (id: string) => onChange({ examples: data.examples.filter((e) => e.id !== id) });

  return (
    <>
      <FormGroup label="Live Demo URL">
        <Input value={data.demoUrl} onChange={(e) => onChange({ demoUrl: e.target.value })} placeholder="https://demo.example.com" />
      </FormGroup>
      <FormGroup label={`Examples (${data.examples.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.examples.map((ex) => (
            <div key={ex.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input value={ex.title} onChange={(e) => updateExample(ex.id, { title: e.target.value })} placeholder="Example title" style={{ flex: 1 }} />
                <Select options={LANGUAGES} value={ex.language} onChange={(e) => updateExample(ex.id, { language: e.target.value })} style={{ width: 130 }} />
                <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeExample(ex.id)} type="button" />
              </div>
              <Input value={ex.description} onChange={(e) => updateExample(ex.id, { description: e.target.value })} placeholder="Brief description (optional)" />
              <Textarea mono value={ex.code} onChange={(e) => updateExample(ex.id, { code: e.target.value })} placeholder="Code snippet" rows={4} />
            </div>
          ))}
          <Button variant="ghost" icon="Plus" size="sm" onClick={addExample} type="button">Add Example</Button>
        </div>
      </FormGroup>
    </>
  );
};

/* ─── TechStackForm ──────────────────────────────────────────────────────────── */

export const TechStackForm: React.FC<SectionFormProps<TechStackData>> = ({ data, onChange }) => {
  const addTech = () => {
    const item: TechItem = { id: uuidv4(), name: '', description: '', badgeUrl: '', docUrl: '' };
    onChange({ technologies: [...data.technologies, item] });
  };
  const updateTech = (id: string, patch: Partial<TechItem>) => {
    onChange({ technologies: data.technologies.map((t) => t.id === id ? { ...t, ...patch } : t) });
  };
  const removeTech = (id: string) => onChange({ technologies: data.technologies.filter((t) => t.id !== id) });

  return (
    <FormGroup label={`Technologies (${data.technologies.length})`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.technologies.map((tech) => (
          <div key={tech.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Input value={tech.name} onChange={(e) => updateTech(tech.id, { name: e.target.value })} placeholder="React" style={{ flex: 1 }} />
              <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeTech(tech.id)} type="button" />
            </div>
            <Input value={tech.description} onChange={(e) => updateTech(tech.id, { description: e.target.value })} placeholder="Description (optional)" />
            <Input value={tech.badgeUrl} onChange={(e) => updateTech(tech.id, { badgeUrl: e.target.value })} placeholder="Shield.io badge URL (optional)" />
            <Input value={tech.docUrl} onChange={(e) => updateTech(tech.id, { docUrl: e.target.value })} placeholder="Documentation URL (optional)" />
          </div>
        ))}
        <Button variant="ghost" icon="Plus" size="sm" onClick={addTech} type="button">Add Technology</Button>
      </div>
    </FormGroup>
  );
};

/* ─── ScreenshotsForm ──────────────────────────────────────────────────────── */

export const ScreenshotsForm: React.FC<SectionFormProps<ScreenshotsData>> = ({ data, onChange }) => {
  const addScreenshot = () => {
    const s: Screenshot = { id: uuidv4(), title: 'Screenshot', imageUrl: '', caption: '', width: '' };
    onChange({ screenshots: [...data.screenshots, s] });
  };
  const updateScreenshot = (id: string, patch: Partial<Screenshot>) => {
    onChange({ screenshots: data.screenshots.map((s) => s.id === id ? { ...s, ...patch } : s) });
  };
  const removeScreenshot = (id: string) => onChange({ screenshots: data.screenshots.filter((s) => s.id !== id) });

  return (
    <FormGroup label={`Screenshots (${data.screenshots.length})`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.screenshots.map((s) => (
          <div key={s.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Input value={s.title} onChange={(e) => updateScreenshot(s.id, { title: e.target.value })} placeholder="Title" style={{ flex: 1 }} />
              <Input value={s.width} onChange={(e) => updateScreenshot(s.id, { width: e.target.value })} placeholder="Width px" style={{ width: 90 }} type="number" />
              <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeScreenshot(s.id)} type="button" />
            </div>
            <Input value={s.imageUrl} onChange={(e) => updateScreenshot(s.id, { imageUrl: e.target.value })} placeholder="Image URL" />
            <Input value={s.caption} onChange={(e) => updateScreenshot(s.id, { caption: e.target.value })} placeholder="Caption (optional)" />
          </div>
        ))}
        <Button variant="ghost" icon="Plus" size="sm" onClick={addScreenshot} type="button">Add Screenshot</Button>
      </div>
    </FormGroup>
  );
};

/* ─── ApiForm ──────────────────────────────────────────────────────────────── */

export const ApiForm: React.FC<SectionFormProps<ApiData>> = ({ data, onChange }) => {
  const addEndpoint = () => {
    const ep: ApiEndpoint = { id: uuidv4(), method: 'GET', endpoint: '/api/', description: '', auth: false };
    onChange({ endpoints: [...data.endpoints, ep] });
  };
  const updateEndpoint = (id: string, patch: Partial<ApiEndpoint>) => {
    onChange({ endpoints: data.endpoints.map((e) => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeEndpoint = (id: string) => onChange({ endpoints: data.endpoints.filter((e) => e.id !== id) });

  return (
    <>
      <FormGroup label="Base URL">
        <Input value={data.baseUrl} onChange={(e) => onChange({ baseUrl: e.target.value })} placeholder="https://api.example.com" />
      </FormGroup>
      <FormGroup label="Authentication Note">
        <Input value={data.authNote} onChange={(e) => onChange({ authNote: e.target.value })} placeholder="Bearer token in Authorization header" />
      </FormGroup>
      <FormGroup label={`Endpoints (${data.endpoints.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.endpoints.map((ep) => (
            <div key={ep.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Select options={HTTP_METHODS} value={ep.method} onChange={(e) => updateEndpoint(ep.id, { method: e.target.value as ApiEndpoint['method'] })} style={{ width: 100 }} />
                <Input value={ep.endpoint} onChange={(e) => updateEndpoint(ep.id, { endpoint: e.target.value })} placeholder="/api/resource/:id" style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <input type="checkbox" checked={ep.auth} onChange={(e) => updateEndpoint(ep.id, { auth: e.target.checked })} /> Auth
                </label>
                <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeEndpoint(ep.id)} type="button" />
              </div>
              <Input value={ep.description} onChange={(e) => updateEndpoint(ep.id, { description: e.target.value })} placeholder="Endpoint description" />
            </div>
          ))}
          <Button variant="ghost" icon="Plus" size="sm" onClick={addEndpoint} type="button">Add Endpoint</Button>
        </div>
      </FormGroup>
    </>
  );
};

/* ─── EnvVarsForm ──────────────────────────────────────────────────────────── */

export const EnvVarsForm: React.FC<SectionFormProps<EnvVarsData>> = ({ data, onChange }) => {
  const addVar = () => {
    const v: EnvVar = { id: uuidv4(), variable: 'MY_VAR', description: '', required: true, example: '' };
    onChange({ variables: [...data.variables, v] });
  };
  const updateVar = (id: string, patch: Partial<EnvVar>) => {
    onChange({ variables: data.variables.map((v) => v.id === id ? { ...v, ...patch } : v) });
  };
  const removeVar = (id: string) => onChange({ variables: data.variables.filter((v) => v.id !== id) });

  return (
    <>
      <FormGroup label=".env File Name">
        <Input value={data.envFile} onChange={(e) => onChange({ envFile: e.target.value })} placeholder=".env.example" />
      </FormGroup>
      <FormGroup label={`Variables (${data.variables.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.variables.map((v) => (
            <div key={v.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <Input value={v.variable} onChange={(e) => updateVar(v.id, { variable: e.target.value })} placeholder="VARIABLE_NAME" style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <input type="checkbox" checked={v.required} onChange={(e) => updateVar(v.id, { required: e.target.checked })} /> Required
                </label>
                <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeVar(v.id)} type="button" />
              </div>
              <Input value={v.description} onChange={(e) => updateVar(v.id, { description: e.target.value })} placeholder="Description" />
              <Input value={v.example} onChange={(e) => updateVar(v.id, { example: e.target.value })} placeholder="Example value" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} />
            </div>
          ))}
          <Button variant="ghost" icon="Plus" size="sm" onClick={addVar} type="button">Add Variable</Button>
        </div>
      </FormGroup>
    </>
  );
};

/* ─── FolderStructureForm ─────────────────────────────────────────────────── */

export const FolderStructureForm: React.FC<SectionFormProps<FolderStructureData>> = ({ data, onChange }) => (
  <>
    <FormGroup label="Description">
      <Input value={data.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Brief description of the layout" />
    </FormGroup>
    <FormGroup label="Folder Tree" hint="Use ├──, └──, │ for tree structure">
      <Textarea mono value={data.structure} onChange={(e) => onChange({ structure: e.target.value })} rows={10} placeholder="├── src/&#10;│   └── index.ts&#10;└── README.md" />
    </FormGroup>
  </>
);

/* ─── ContributingForm ────────────────────────────────────────────────────── */

export const ContributingForm: React.FC<SectionFormProps<ContributingData>> = ({ data, onChange }) => (
  <>
    <FormGroup label="Welcome Text">
      <Textarea value={data.welcomeText} onChange={(e) => onChange({ welcomeText: e.target.value })} rows={3} />
    </FormGroup>
    <ListBuilder label="Steps" items={data.steps} onChange={(steps) => onChange({ steps })} placeholder="Fork the Project" />
    <FormGroup label="Issues URL">
      <Input value={data.issueUrl} onChange={(e) => onChange({ issueUrl: e.target.value })} placeholder="https://github.com/user/repo/issues" />
    </FormGroup>
    <FormGroup label="Code of Conduct URL">
      <Input value={data.codeOfConductUrl} onChange={(e) => onChange({ codeOfConductUrl: e.target.value })} placeholder="https://..." />
    </FormGroup>
  </>
);

/* ─── RoadmapForm ──────────────────────────────────────────────────────────── */

export const RoadmapForm: React.FC<SectionFormProps<RoadmapData>> = ({ data, onChange }) => {
  const addItem = () => {
    const item: RoadmapItem = { id: uuidv4(), text: '', done: false, category: 'General' };
    onChange({ items: [...data.items, item] });
  };
  const updateItem = (id: string, patch: Partial<RoadmapItem>) => {
    onChange({ items: data.items.map((i) => i.id === id ? { ...i, ...patch } : i) });
  };
  const removeItem = (id: string) => onChange({ items: data.items.filter((i) => i.id !== id) });

  return (
    <FormGroup label={`Items (${data.items.length})`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.items.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={item.done} onChange={(e) => updateItem(item.id, { done: e.target.checked })} style={{ width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }} />
            <Input value={item.text} onChange={(e) => updateItem(item.id, { text: e.target.value })} placeholder="Roadmap item" style={{ flex: 1 }} />
            <Input value={item.category} onChange={(e) => updateItem(item.id, { category: e.target.value })} placeholder="Category" style={{ width: 110 }} />
            <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeItem(item.id)} type="button" />
          </div>
        ))}
        <Button variant="ghost" icon="Plus" size="sm" onClick={addItem} type="button">Add Item</Button>
      </div>
    </FormGroup>
  );
};

/* ─── FaqForm ──────────────────────────────────────────────────────────────── */

export const FaqForm: React.FC<SectionFormProps<FaqData>> = ({ data, onChange }) => {
  const addItem = () => {
    const item: FaqItem = { id: uuidv4(), question: '', answer: '' };
    onChange({ items: [...data.items, item] });
  };
  const updateItem = (id: string, patch: Partial<FaqItem>) => {
    onChange({ items: data.items.map((i) => i.id === id ? { ...i, ...patch } : i) });
  };
  const removeItem = (id: string) => onChange({ items: data.items.filter((i) => i.id !== id) });

  return (
    <FormGroup label={`Questions (${data.items.length})`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.items.map((item) => (
          <div key={item.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Input value={item.question} onChange={(e) => updateItem(item.id, { question: e.target.value })} placeholder="Question?" style={{ flex: 1 }} />
              <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeItem(item.id)} type="button" />
            </div>
            <Textarea value={item.answer} onChange={(e) => updateItem(item.id, { answer: e.target.value })} placeholder="Answer..." rows={3} />
          </div>
        ))}
        <Button variant="ghost" icon="Plus" size="sm" onClick={addItem} type="button">Add Question</Button>
      </div>
    </FormGroup>
  );
};

/* ─── ChangelogForm ──────────────────────────────────────────────────────────── */

export const ChangelogForm: React.FC<SectionFormProps<ChangelogData>> = ({ data, onChange }) => {
  const addEntry = () => {
    const entry: ChangelogEntry = { id: uuidv4(), version: '1.0.0', date: new Date().toISOString().split('T')[0], changes: ['Initial release'], type: 'major' };
    onChange({ entries: [entry, ...data.entries] });
  };
  const updateEntry = (id: string, patch: Partial<ChangelogEntry>) => {
    onChange({ entries: data.entries.map((e) => e.id === id ? { ...e, ...patch } : e) });
  };
  const removeEntry = (id: string) => onChange({ entries: data.entries.filter((e) => e.id !== id) });

  return (
    <FormGroup label={`Versions (${data.entries.length})`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.entries.map((entry) => (
          <div key={entry.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Input value={entry.version} onChange={(e) => updateEntry(entry.id, { version: e.target.value })} placeholder="1.0.0" style={{ width: 100, fontFamily: 'var(--font-mono)', fontSize: 12 }} />
              <Input value={entry.date} onChange={(e) => updateEntry(entry.id, { date: e.target.value })} type="date" style={{ flex: 1 }} />
              <Select
                options={[{ value: 'major', label: '🎉 Major' }, { value: 'minor', label: '✨ Minor' }, { value: 'patch', label: '🐛 Patch' }]}
                value={entry.type}
                onChange={(e) => updateEntry(entry.id, { type: e.target.value as ChangelogEntry['type'] })}
                style={{ width: 110 }}
              />
              <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeEntry(entry.id)} type="button" />
            </div>
            <ListBuilder items={entry.changes} onChange={(changes) => updateEntry(entry.id, { changes })} placeholder="Change description" />
          </div>
        ))}
        <Button variant="ghost" icon="Plus" size="sm" onClick={addEntry} type="button">Add Version</Button>
      </div>
    </FormGroup>
  );
};

/* ─── LicenseForm ──────────────────────────────────────────────────────────── */

const LICENSES = [
  { value: 'MIT', label: 'MIT' },
  { value: 'Apache-2.0', label: 'Apache 2.0' },
  { value: 'GPL-3.0', label: 'GNU GPL v3' },
  { value: 'BSD-2-Clause', label: 'BSD 2-Clause' },
  { value: 'ISC', label: 'ISC' },
  { value: 'Unlicense', label: 'Unlicense' },
  { value: 'Custom', label: 'Custom' },
];

export const LicenseForm: React.FC<SectionFormProps<LicenseData>> = ({ data, onChange }) => (
  <>
    <FormGroup label="License">
      <Select options={LICENSES} value={data.spdx} onChange={(e) => onChange({ spdx: e.target.value })} />
    </FormGroup>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <FormGroup label="Year">
        <Input value={data.year} onChange={(e) => onChange({ year: e.target.value })} placeholder={new Date().getFullYear().toString()} />
      </FormGroup>
      <FormGroup label="Author">
        <Input value={data.author} onChange={(e) => onChange({ author: e.target.value })} placeholder="Your Name" />
      </FormGroup>
    </div>
    {data.spdx === 'Custom' && (
      <FormGroup label="Custom License Text">
        <Textarea value={data.customText} onChange={(e) => onChange({ customText: e.target.value })} rows={6} placeholder="Your custom license text..." />
      </FormGroup>
    )}
  </>
);

/* ─── ContactForm ──────────────────────────────────────────────────────────── */

export const ContactForm: React.FC<SectionFormProps<ContactData>> = ({ data, onChange }) => {
  const addItem = () => {
    const item: ContactItem = { id: uuidv4(), label: 'Email', value: '', url: '', icon: '📧' };
    onChange({ items: [...data.items, item] });
  };
  const updateItem = (id: string, patch: Partial<ContactItem>) => {
    onChange({ items: data.items.map((i) => i.id === id ? { ...i, ...patch } : i) });
  };
  const removeItem = (id: string) => onChange({ items: data.items.filter((i) => i.id !== id) });

  return (
    <>
      <FormGroup label="Intro Text">
        <Input value={data.intro} onChange={(e) => onChange({ intro: e.target.value })} placeholder="Have questions or want to connect?" />
      </FormGroup>
      <FormGroup label={`Contact Methods (${data.items.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.items.map((item) => (
            <div key={item.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <Input value={item.icon} onChange={(e) => updateItem(item.id, { icon: e.target.value })} placeholder="📧" style={{ width: 48, textAlign: 'center' }} />
                <Input value={item.label} onChange={(e) => updateItem(item.id, { label: e.target.value })} placeholder="Email" style={{ flex: 1 }} />
                <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeItem(item.id)} type="button" />
              </div>
              <Input value={item.value} onChange={(e) => updateItem(item.id, { value: e.target.value })} placeholder="contact@example.com" />
              <Input value={item.url} onChange={(e) => updateItem(item.id, { url: e.target.value })} placeholder="mailto:contact@example.com (optional link)" />
            </div>
          ))}
          <Button variant="ghost" icon="Plus" size="sm" onClick={addItem} type="button">Add Contact</Button>
        </div>
      </FormGroup>
    </>
  );
};

/* ─── AcknowledgementsForm ─────────────────────────────────────────────────── */

export const AcknowledgementsForm: React.FC<SectionFormProps<AcknowledgementsData>> = ({ data, onChange }) => {
  const addItem = () => {
    const item: AcknowledgementItem = { id: uuidv4(), name: '', url: '', reason: '' };
    onChange({ items: [...data.items, item] });
  };
  const updateItem = (id: string, patch: Partial<AcknowledgementItem>) => {
    onChange({ items: data.items.map((i) => i.id === id ? { ...i, ...patch } : i) });
  };
  const removeItem = (id: string) => onChange({ items: data.items.filter((i) => i.id !== id) });

  return (
    <>
      <FormGroup label="Intro Text">
        <Input value={data.intro} onChange={(e) => onChange({ intro: e.target.value })} placeholder="Special thanks to..." />
      </FormGroup>
      <FormGroup label={`Credits (${data.items.length})`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.items.map((item) => (
            <div key={item.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} placeholder="Name" style={{ flex: 1 }} />
                <Button variant="danger" icon="Trash2" size="sm" onClick={() => removeItem(item.id)} type="button" />
              </div>
              <Input value={item.url} onChange={(e) => updateItem(item.id, { url: e.target.value })} placeholder="https://github.com/... (optional)" />
              <Input value={item.reason} onChange={(e) => updateItem(item.id, { reason: e.target.value })} placeholder="Reason / contribution" />
            </div>
          ))}
          <Button variant="ghost" icon="Plus" size="sm" onClick={addItem} type="button">Add Credit</Button>
        </div>
      </FormGroup>
    </>
  );
};
