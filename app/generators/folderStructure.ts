import { FolderStructureData } from '../types';

export function generateFolderStructure(data: FolderStructureData): string {
  const { structure, description } = data;
  if (!structure) return '';

  const lines: string[] = [];
  lines.push('## 📁 Project Structure');
  lines.push('');
  if (description) {
    lines.push(description);
    lines.push('');
  }
  lines.push('```');
  lines.push(structure);
  lines.push('```');

  return lines.join('\n');
}
