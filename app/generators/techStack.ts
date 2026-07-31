import { TechStackData } from '../types';

export function generateTechStack(data: TechStackData): string {
  const { technologies } = data;
  if (!technologies || technologies.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 🛠️ Built With');
  lines.push('');

  if (technologies.some((t) => t.badgeUrl)) {
    // Badge-style rendering
    const badges = technologies
      .filter((t) => t.badgeUrl)
      .map((t) => {
        const img = `![${t.name}](${t.badgeUrl})`;
        return t.docUrl ? `[${img}](${t.docUrl})` : img;
      })
      .join(' ');
    lines.push(badges);
    lines.push('');

    // Also a table
    const tableItems = technologies.filter((t) => t.description);
    if (tableItems.length > 0) {
      lines.push('');
      lines.push('| Technology | Description |');
      lines.push('|:---|:---|');
      tableItems.forEach((t) => {
        const name = t.docUrl ? `[${t.name}](${t.docUrl})` : t.name;
        lines.push(`| ${name} | ${t.description} |`);
      });
    }
  } else {
    // Simple list
    lines.push('| Technology | Description |');
    lines.push('|:---|:---|');
    technologies.forEach((t) => {
      const name = t.docUrl ? `[${t.name}](${t.docUrl})` : t.name;
      lines.push(`| ${name} | ${t.description || ''} |`);
    });
  }

  return lines.join('\n').trimEnd();
}
