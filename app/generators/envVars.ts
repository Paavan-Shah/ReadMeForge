import { EnvVarsData } from '../types';

export function generateEnvVars(data: EnvVarsData): string {
  const { envFile, variables } = data;
  if (!variables || variables.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 🔑 Environment Variables');
  lines.push('');

  if (envFile) {
    lines.push(`Copy \`${envFile}\` to \`.env\` and fill in the values:`);
    lines.push('');
    lines.push(`\`\`\`bash`);
    lines.push(`cp ${envFile} .env`);
    lines.push('```');
    lines.push('');
  }

  lines.push('| Variable | Description | Required | Example |');
  lines.push('|:---|:---|:---:|:---|');
  variables.forEach((v) => {
    const req = v.required ? '✅' : '⬜';
    lines.push(`| \`${v.variable}\` | ${v.description} | ${req} | \`${v.example || ''}\` |`);
  });

  return lines.join('\n');
}
