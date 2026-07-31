// ─── Core Section Types ────────────────────────────────────────────────────

export type ThemeId =
  | 'github-light'
  | 'github-dark'
  | 'vscode-dark'
  | 'dracula'
  | 'nord'
  | 'solarized';

export type SectionId =
  | 'title'
  | 'logo-banner'
  | 'badges'
  | 'description'
  | 'features'
  | 'installation'
  | 'usage'
  | 'tech-stack'
  | 'screenshots'
  | 'api-reference'
  | 'env-vars'
  | 'folder-structure'
  | 'contributing'
  | 'roadmap'
  | 'faq'
  | 'changelog'
  | 'license'
  | 'contact'
  | 'acknowledgements';

// ─── Section Data Shapes ───────────────────────────────────────────────────

export interface TitleData {
  projectName: string;
  tagline: string;
  alignment: 'left' | 'center' | 'right';
}

export interface LogoBannerData {
  imageUrl: string;
  altText: string;
  width: string;
  linkUrl: string;
  alignment: 'left' | 'center' | 'right';
  isBanner: boolean;
}

export interface Badge {
  id: string;
  label: string;
  url: string;
  linkUrl?: string;
  category: string;
}

export interface BadgesData {
  badges: Badge[];
  alignment: 'left' | 'center' | 'right';
}

export interface DescriptionData {
  overview: string;
  keyPoints: string[];
  problemStatement: string;
  solutionStatement: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesData {
  features: Feature[];
  layout: 'table' | 'list' | 'grid';
  heading: string;
}

export interface InstallationStep {
  id: string;
  label: string;
  code: string;
  language: string;
}

export interface InstallationData {
  prerequisites: string[];
  steps: InstallationStep[];
}

export interface UsageExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

export interface UsageData {
  examples: UsageExample[];
  demoUrl: string;
}

export interface TechItem {
  id: string;
  name: string;
  description: string;
  badgeUrl: string;
  docUrl: string;
}

export interface TechStackData {
  technologies: TechItem[];
}

export interface Screenshot {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  width: string;
}

export interface ScreenshotsData {
  screenshots: Screenshot[];
  layout: 'grid' | 'list';
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  description: string;
  auth: boolean;
}

export interface ApiData {
  baseUrl: string;
  authNote: string;
  endpoints: ApiEndpoint[];
}

export interface EnvVar {
  id: string;
  variable: string;
  description: string;
  required: boolean;
  example: string;
}

export interface EnvVarsData {
  envFile: string;
  variables: EnvVar[];
}

export interface FolderStructureData {
  structure: string;
  description: string;
}

export interface ContributingData {
  welcomeText: string;
  steps: string[];
  codeOfConductUrl: string;
  issueUrl: string;
}

export interface RoadmapItem {
  id: string;
  text: string;
  done: boolean;
  category: string;
}

export interface RoadmapData {
  items: RoadmapItem[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqData {
  items: FaqItem[];
}

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

export interface ChangelogData {
  entries: ChangelogEntry[];
}

export interface LicenseData {
  spdx: string;
  year: string;
  author: string;
  customText: string;
}

export interface ContactItem {
  id: string;
  label: string;
  value: string;
  url: string;
  icon: string;
}

export interface ContactData {
  intro: string;
  items: ContactItem[];
}

export interface AcknowledgementItem {
  id: string;
  name: string;
  url: string;
  reason: string;
}

export interface AcknowledgementsData {
  intro: string;
  items: AcknowledgementItem[];
}

// ─── Section Data Union ────────────────────────────────────────────────────

export type SectionData =
  | TitleData
  | LogoBannerData
  | BadgesData
  | DescriptionData
  | FeaturesData
  | InstallationData
  | UsageData
  | TechStackData
  | ScreenshotsData
  | ApiData
  | EnvVarsData
  | FolderStructureData
  | ContributingData
  | RoadmapData
  | FaqData
  | ChangelogData
  | LicenseData
  | ContactData
  | AcknowledgementsData;

// ─── Section Instance ──────────────────────────────────────────────────────

export interface Section {
  instanceId: string;   // unique uuid for this section in the project
  sectionId: SectionId;
  enabled: boolean;
  data: SectionData;
}

// ─── Section Definition (registry) ────────────────────────────────────────

export interface SectionDef {
  id: SectionId;
  label: string;
  icon: string;
  description: string;
  category: 'header' | 'body' | 'technical' | 'community' | 'footer';
  defaultData: SectionData;
  singleton: boolean; // can only appear once
}

// ─── Project ───────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  templateId: string | null;
  sections: Section[];
  createdAt: number;
  updatedAt: number;
}

// ─── Template ─────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  sectionIds: SectionId[];
  defaultValues: Partial<Record<SectionId, Partial<SectionData>>>;
}

// ─── Badge Definition ─────────────────────────────────────────────────────

export interface BadgeDef {
  id: string;
  label: string;
  url: string;
  category: string;
  color?: string;
  logo?: string;
}

// ─── License ──────────────────────────────────────────────────────────────

export interface LicenseDef {
  spdx: string;
  name: string;
  body: string;
}

// ─── Undo/Redo ────────────────────────────────────────────────────────────

export interface HistoryEntry {
  sections: Section[];
  timestamp: number;
}

// ─── Store Shape ──────────────────────────────────────────────────────────

export interface AppStore {
  // Project
  project: Project;
  setProject: (p: Project) => void;
  updateSection: (instanceId: string, data: Partial<SectionData>) => void;
  addSection: (sectionId: SectionId) => void;
  removeSection: (instanceId: string) => void;
  reorderSections: (from: number, to: number) => void;
  toggleSection: (instanceId: string) => void;

  // Selection
  selectedInstanceId: string | null;
  setSelectedInstanceId: (id: string | null) => void;

  // Undo/Redo
  past: HistoryEntry[];
  future: HistoryEntry[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Theme
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  previewTab: 'preview' | 'raw';
  setPreviewTab: (t: 'preview' | 'raw') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Saved projects
  savedProjects: { id: string; name: string; updatedAt: number }[];
  loadSavedProjects: () => Promise<void>;
  saveCurrentProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createNewProject: (name?: string) => void;
  importProject: (json: string) => void;
  exportProject: () => string;
}
