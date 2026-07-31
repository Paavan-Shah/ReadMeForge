import { UsageData } from '../types';

export function generateUsage(data: UsageData): string {
  const { examples, demoUrl } = data;
  const lines: string[] = [];

  lines.push('## 💡 Usage');
  lines.push('');

  if (demoUrl) {
    lines.push(`🌐 **Live Demo:** [${demoUrl}](${demoUrl})`);
    lines.push('');
  }

  if (examples && examples.length > 0) {
    examples.forEach((ex) => {
      if (ex.title) {
        lines.push(`### ${ex.title}`);
        lines.push('');
      }
      if (ex.description) {
        lines.push(ex.description);
        lines.push('');
      }
      if (ex.code) {
        lines.push(`\`\`\`${ex.language || 'bash'}`);
        lines.push(ex.code);
        lines.push('```');
        lines.push('');
      }
    });
  }

  return lines.join('\n').trimEnd();
}
