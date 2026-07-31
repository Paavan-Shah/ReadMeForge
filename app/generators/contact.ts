import { ContactData } from '../types';

export function generateContact(data: ContactData): string {
  const { intro, items } = data;
  const lines: string[] = [];

  lines.push('## 📬 Contact');
  lines.push('');

  if (intro) {
    lines.push(intro);
    lines.push('');
  }

  if (items && items.length > 0) {
    items.forEach((item) => {
      const icon = item.icon || '•';
      const label = item.label || 'Contact';
      const display = item.url ? `[${item.value}](${item.url})` : item.value;
      lines.push(`- ${icon} **${label}:** ${display}`);
    });
  }

  return lines.join('\n');
}
