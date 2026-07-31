import { DescriptionData } from '../types';

export function generateDescription(data: DescriptionData): string {
  const { overview, keyPoints, problemStatement, solutionStatement } = data;
  const lines: string[] = [];

  lines.push('## 📖 About The Project');
  lines.push('');

  if (overview) {
    lines.push(overview);
    lines.push('');
  }

  if (problemStatement) {
    lines.push(`**The Problem:** ${problemStatement}`);
    lines.push('');
  }

  if (solutionStatement) {
    lines.push(`**The Solution:** ${solutionStatement}`);
    lines.push('');
  }

  if (keyPoints && keyPoints.length > 0) {
    lines.push('### Why use this?');
    lines.push('');
    keyPoints.forEach((point) => {
      if (point.trim()) lines.push(`- ${point}`);
    });
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}
