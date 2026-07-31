import { LicenseData } from '../types';
import licensesData from '../data/licenses.json';

export function generateLicense(data: LicenseData): string {
  const { spdx, year, author, customText } = data;
  const lines: string[] = [];

  lines.push('## 📄 License');
  lines.push('');

  if (customText) {
    lines.push(customText);
    return lines.join('\n');
  }

  const licenseDef = (licensesData as { spdx: string; name: string; body: string }[]).find(
    (l) => l.spdx === spdx
  );

  if (licenseDef) {
    lines.push(
      `Distributed under the ${licenseDef.name}. See \`LICENSE\` for more information.`
    );
    lines.push('');
    lines.push(`\`\`\``);
    const body = licenseDef.body
      .replace('{year}', year || new Date().getFullYear().toString())
      .replace('{author}', author || 'Author');
    lines.push(body);
    lines.push('```');
  } else {
    lines.push(`This project is licensed under the **${spdx}** license.`);
  }

  return lines.join('\n');
}
