import { ChangelogData } from '../types';

const TYPE_EMOJI: Record<string, string> = {
  major: '🎉',
  minor: '✨',
  patch: '🐛',
};

export function generateChangelog(data: ChangelogData): string {
  const { entries } = data;
  if (!entries || entries.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 📋 Changelog');
  lines.push('');
  lines.push('All notable changes to this project will be documented here.');
  lines.push('');

  entries.forEach((entry) => {
    const emoji = TYPE_EMOJI[entry.type] || '📦';
    lines.push(`### ${emoji} [${entry.version}] - ${entry.date}`);
    lines.push('');
    entry.changes.forEach((change) => {
      if (change.trim()) lines.push(`- ${change}`);
    });
    lines.push('');
  });

  return lines.join('\n').trimEnd();
}
