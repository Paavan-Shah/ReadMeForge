import { FaqData } from '../types';

export function generateFaq(data: FaqData): string {
  const { items } = data;
  if (!items || items.length === 0) return '';

  const lines: string[] = [];
  lines.push('## ❓ FAQ');
  lines.push('');

  items.forEach((item) => {
    lines.push(`<details>`);
    lines.push(`<summary><strong>${item.question}</strong></summary>`);
    lines.push('');
    lines.push(item.answer);
    lines.push('');
    lines.push(`</details>`);
    lines.push('');
  });

  return lines.join('\n').trimEnd();
}
