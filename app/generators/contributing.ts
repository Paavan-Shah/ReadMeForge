import { ContributingData } from '../types';

export function generateContributing(data: ContributingData): string {
  const { welcomeText, steps, codeOfConductUrl, issueUrl } = data;
  const lines: string[] = [];

  lines.push('## 🤝 Contributing');
  lines.push('');

  if (welcomeText) {
    lines.push(welcomeText);
    lines.push('');
  }

  if (steps && steps.length > 0) {
    steps.forEach((step, idx) => {
      lines.push(`${idx + 1}. ${step}`);
    });
    lines.push('');
  }

  if (issueUrl) {
    lines.push(`Don't forget to give the project a ⭐ star! [Open Issues](${issueUrl})`);
    lines.push('');
  }

  if (codeOfConductUrl) {
    lines.push(`Please read our [Code of Conduct](${codeOfConductUrl}) before contributing.`);
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}
