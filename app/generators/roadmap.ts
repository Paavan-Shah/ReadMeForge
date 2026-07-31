import { RoadmapData } from '../types';

export function generateRoadmap(data: RoadmapData): string {
  const { items } = data;
  if (!items || items.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 🗺️ Roadmap');
  lines.push('');

  // Group by category
  const categories = [...new Set(items.map((i) => i.category || 'General'))];

  categories.forEach((cat) => {
    const catItems = items.filter((i) => (i.category || 'General') === cat);
    if (categories.length > 1) {
      lines.push(`### ${cat}`);
      lines.push('');
    }
    catItems.forEach((item) => {
      const check = item.done ? '[x]' : '[ ]';
      lines.push(`- ${check} ${item.text}`);
    });
    lines.push('');
  });

  return lines.join('\n').trimEnd();
}
