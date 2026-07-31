import { InstallationData } from '../types';

export function generateInstallation(data: InstallationData): string {
  const { prerequisites, steps } = data;
  const lines: string[] = [];

  lines.push('## 🚀 Getting Started');
  lines.push('');

  if (prerequisites && prerequisites.length > 0) {
    lines.push('### Prerequisites');
    lines.push('');
    prerequisites.forEach((p) => {
      if (p.trim()) lines.push(`- ${p}`);
    });
    lines.push('');
  }

  if (steps && steps.length > 0) {
    lines.push('### Installation');
    lines.push('');
    steps.forEach((step, idx) => {
      lines.push(`${idx + 1}. **${step.label}**`);
      lines.push('');
      if (step.code) {
        lines.push(`\`\`\`${step.language || 'bash'}`);
        lines.push(step.code);
        lines.push('```');
      }
      lines.push('');
    });
  }

  return lines.join('\n').trimEnd();
}
