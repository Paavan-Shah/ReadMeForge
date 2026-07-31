import { Project, Section, SectionId } from '../types';
import { generateTitle } from '../generators/title';
import { generateLogoBanner } from '../generators/logoBanner';
import { generateBadges } from '../generators/badges';
import { generateDescription } from '../generators/description';
import { generateFeatures } from '../generators/features';
import { generateInstallation } from '../generators/installation';
import { generateUsage } from '../generators/usage';
import { generateTechStack } from '../generators/techStack';
import { generateScreenshots } from '../generators/screenshots';
import { generateApiReference } from '../generators/apiReference';
import { generateEnvVars } from '../generators/envVars';
import { generateFolderStructure } from '../generators/folderStructure';
import { generateContributing } from '../generators/contributing';
import { generateRoadmap } from '../generators/roadmap';
import { generateFaq } from '../generators/faq';
import { generateChangelog } from '../generators/changelog';
import { generateLicense } from '../generators/license';
import { generateContact } from '../generators/contact';
import { generateAcknowledgements } from '../generators/acknowledgements';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GeneratorFn = (data: any) => string;

const GENERATORS: Partial<Record<SectionId, GeneratorFn>> = {
  'title': generateTitle,
  'logo-banner': generateLogoBanner,
  'badges': generateBadges,
  'description': generateDescription,
  'features': generateFeatures,
  'installation': generateInstallation,
  'usage': generateUsage,
  'tech-stack': generateTechStack,
  'screenshots': generateScreenshots,
  'api-reference': generateApiReference,
  'env-vars': generateEnvVars,
  'folder-structure': generateFolderStructure,
  'contributing': generateContributing,
  'roadmap': generateRoadmap,
  'faq': generateFaq,
  'changelog': generateChangelog,
  'license': generateLicense,
  'contact': generateContact,
  'acknowledgements': generateAcknowledgements,
};

export function generateSectionMarkdown(section: Section): string {
  const gen = GENERATORS[section.sectionId];
  if (!gen) return '';
  try {
    return gen(section.data);
  } catch {
    return '';
  }
}

export function generateMarkdown(project: Project): string {
  const parts: string[] = [];

  const enabledSections = project.sections.filter((s) => s.enabled);

  for (const section of enabledSections) {
    const md = generateSectionMarkdown(section);
    if (md.trim()) {
      parts.push(md.trim());
    }
  }

  return parts.join('\n\n---\n\n');
}

/** Returns section heading text for TOC anchors */
export function getSectionHeading(section: Section): string | null {
  const headingMap: Partial<Record<SectionId, string>> = {
    'description': '📖 About The Project',
    'features': '✨ Features',
    'installation': '🚀 Getting Started',
    'usage': '💡 Usage',
    'tech-stack': '🛠️ Built With',
    'screenshots': '📸 Screenshots',
    'api-reference': '📡 API Reference',
    'env-vars': '🔑 Environment Variables',
    'folder-structure': '📁 Project Structure',
    'contributing': '🤝 Contributing',
    'roadmap': '🗺️ Roadmap',
    'faq': '❓ FAQ',
    'changelog': '📋 Changelog',
    'license': '📄 License',
    'contact': '📬 Contact',
    'acknowledgements': '🙏 Acknowledgements',
  };
  return headingMap[section.sectionId] ?? null;
}

export function generateTOC(project: Project): string {
  const lines: string[] = [];
  lines.push('## 📑 Table of Contents');
  lines.push('');

  const enabledSections = project.sections.filter((s) => s.enabled);
  for (const section of enabledSections) {
    const heading = getSectionHeading(section);
    if (!heading) continue;
    const anchor = heading
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    lines.push(`- [${heading}](#${anchor})`);
  }

  return lines.join('\n');
}
