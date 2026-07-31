import { BadgesData } from '../types';

export function generateBadges(data: BadgesData): string {
  const { badges, alignment } = data;
  if (!badges || badges.length === 0) return '';

  const badgeMarkdown = badges
    .map((b) => {
      const img = `![${b.label}](${b.url})`;
      return b.linkUrl ? `[${img}](${b.linkUrl})` : img;
    })
    .join(' ');

  if (alignment === 'center') {
    return `<div align="center">\n\n${badgeMarkdown}\n\n</div>`;
  } else if (alignment === 'right') {
    return `<div align="right">\n\n${badgeMarkdown}\n\n</div>`;
  }

  return badgeMarkdown;
}
