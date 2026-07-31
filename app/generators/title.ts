import { TitleData } from '../types';

export function generateTitle(data: TitleData): string {
  const { projectName, tagline, alignment } = data;
  if (!projectName) return '';

  const lines: string[] = [];

  if (alignment === 'center') {
    lines.push(`<div align="center">`);
    lines.push('');
    lines.push(`# ${projectName}`);
    if (tagline) lines.push(`\n### ${tagline}`);
    lines.push('');
    lines.push(`</div>`);
  } else if (alignment === 'right') {
    lines.push(`<div align="right">`);
    lines.push('');
    lines.push(`# ${projectName}`);
    if (tagline) lines.push(`\n### ${tagline}`);
    lines.push('');
    lines.push(`</div>`);
  } else {
    lines.push(`# ${projectName}`);
    if (tagline) lines.push(`\n> ${tagline}`);
  }

  return lines.join('\n');
}
