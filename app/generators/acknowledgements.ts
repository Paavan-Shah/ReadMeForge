import { AcknowledgementsData } from '../types';

export function generateAcknowledgements(data: AcknowledgementsData): string {
  const { intro, items } = data;
  if (!items || items.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 🙏 Acknowledgements');
  lines.push('');

  if (intro) {
    lines.push(intro);
    lines.push('');
  }

  items.forEach((item) => {
    const name = item.url ? `[${item.name}](${item.url})` : item.name;
    const reason = item.reason ? ` — ${item.reason}` : '';
    lines.push(`- ${name}${reason}`);
  });

  return lines.join('\n');
}
