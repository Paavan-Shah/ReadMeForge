import { LogoBannerData } from '../types';

export function generateLogoBanner(data: LogoBannerData): string {
  const { imageUrl, altText, width, linkUrl, alignment, isBanner } = data;
  if (!imageUrl) return '';

  const widthAttr = width ? ` width="${width}"` : '';
  const imgTag = `<img src="${imageUrl}" alt="${altText || 'Logo'}"${widthAttr} />`;
  const content = linkUrl ? `<a href="${linkUrl}">${imgTag}</a>` : imgTag;

  if (isBanner) {
    // Banner stretches full-width
    return `<div align="${alignment || 'center'}">\n\n${content}\n\n</div>`;
  }

  if (alignment === 'center' || alignment === 'right') {
    return `<div align="${alignment}">\n\n${content}\n\n</div>`;
  }

  // Left-aligned or default
  return linkUrl
    ? `[![${altText || 'Logo'}](${imageUrl})](${linkUrl})`
    : `![${altText || 'Logo'}](${imageUrl})`;
}
