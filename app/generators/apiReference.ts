import { ApiData } from '../types';

const METHOD_COLORS: Record<string, string> = {
  GET: '`GET`',
  POST: '`POST`',
  PUT: '`PUT`',
  PATCH: '`PATCH`',
  DELETE: '`DELETE`',
};

export function generateApiReference(data: ApiData): string {
  const { baseUrl, authNote, endpoints } = data;
  if (!endpoints || endpoints.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 📡 API Reference');
  lines.push('');

  if (baseUrl) {
    lines.push(`**Base URL:** \`${baseUrl}\``);
    lines.push('');
  }

  if (authNote) {
    lines.push(`> **Authentication:** ${authNote}`);
    lines.push('');
  }

  lines.push('| Method | Endpoint | Description | Auth |');
  lines.push('|:---:|:---|:---|:---:|');
  endpoints.forEach((ep) => {
    const method = METHOD_COLORS[ep.method] || ep.method;
    const auth = ep.auth ? '🔒' : '🔓';
    lines.push(`| ${method} | \`${ep.endpoint}\` | ${ep.description} | ${auth} |`);
  });

  return lines.join('\n');
}
