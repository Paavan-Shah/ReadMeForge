import { FeaturesData } from '../types';

export function generateFeatures(data: FeaturesData): string {
  const { features, layout, heading } = data;
  if (!features || features.length === 0) return '';

  const lines: string[] = [];
  lines.push(`## ${heading || '✨ Features'}`);
  lines.push('');

  if (layout === 'table') {
    lines.push('| Feature | Description |');
    lines.push('|:---|:---|');
    features.forEach((f) => {
      const icon = f.icon ? `${f.icon} ` : '';
      const title = f.title ? `**${icon}${f.title}**` : `${icon}Feature`;
      lines.push(`| ${title} | ${f.description || ''} |`);
    });
  } else if (layout === 'grid') {
    // HTML grid using a table with 3 columns
    lines.push('<table>');
    for (let i = 0; i < features.length; i += 3) {
      lines.push('  <tr>');
      for (let j = i; j < Math.min(i + 3, features.length); j++) {
        const f = features[j];
        lines.push(`    <td align="center">`);
        if (f.icon) lines.push(`      <h2>${f.icon}</h2>`);
        if (f.title) lines.push(`      <strong>${f.title}</strong><br />`);
        if (f.description) lines.push(`      <sub>${f.description}</sub>`);
        lines.push(`    </td>`);
      }
      lines.push('  </tr>');
    }
    lines.push('</table>');
  } else {
    // List layout
    features.forEach((f) => {
      const icon = f.icon ? `${f.icon} ` : '';
      const title = f.title ? `**${icon}${f.title}**` : `${icon}Feature`;
      if (f.description) {
        lines.push(`- ${title} — ${f.description}`);
      } else {
        lines.push(`- ${title}`);
      }
    });
  }

  return lines.join('\n');
}
