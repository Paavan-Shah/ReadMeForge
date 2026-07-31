import { ScreenshotsData } from '../types';

export function generateScreenshots(data: ScreenshotsData): string {
  const { screenshots } = data;
  if (!screenshots || screenshots.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 📸 Screenshots');
  lines.push('');

  screenshots.forEach((s) => {
    if (s.title) lines.push(`### ${s.title}`);
    const widthAttr = s.width ? ` width="${s.width}"` : '';
    lines.push(`<img src="${s.imageUrl}" alt="${s.title || 'Screenshot'}"${widthAttr} />`);
    if (s.caption) lines.push(`*${s.caption}*`);
    lines.push('');
  });

  return lines.join('\n').trimEnd();
}
