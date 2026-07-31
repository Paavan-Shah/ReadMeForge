import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useAppStore } from '../../store/useAppStore';
import { generateMarkdown } from '../../utils/markdown';
import { Button, Tooltip } from '../ui';

export const PreviewPane: React.FC = () => {
  const project = useAppStore((s) => s.project);
  const previewTab = useAppStore((s) => s.previewTab);
  const setPreviewTab = useAppStore((s) => s.setPreviewTab);

  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [downloadState, setDownloadState] = useState<'idle' | 'done'>('idle');

  const markdown = useMemo(() => generateMarkdown(project), [project]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopyState('copied');
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadState('done');
    setTimeout(() => setDownloadState('idle'), 2000);
  };

  return (
    <div className="preview-pane">
      <div className="preview-pane-header">
        <div className="preview-tabs">
          <button
            className={`preview-tab ${previewTab === 'preview' ? 'active' : ''}`}
            onClick={() => setPreviewTab('preview')}
          >
            👁 Preview
          </button>
          <button
            className={`preview-tab ${previewTab === 'raw' ? 'active' : ''}`}
            onClick={() => setPreviewTab('raw')}
          >
            📄 Raw
          </button>
        </div>

        <div className="preview-actions">
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 4 }}>
            {markdown.length} chars
          </span>
          <Tooltip text={copyState === 'copied' ? '✓ Copied!' : 'Copy README'}>
            <Button
              variant="ghost"
              icon={copyState === 'copied' ? 'Check' : 'Copy'}
              size="sm"
              onClick={handleCopy}
            >
              {copyState === 'copied' ? 'Copied!' : 'Copy'}
            </Button>
          </Tooltip>
          <Tooltip text={downloadState === 'done' ? '✓ Downloaded!' : 'Download README.md'}>
            <Button
              variant="primary"
              icon={downloadState === 'done' ? 'Check' : 'Download'}
              size="sm"
              onClick={handleDownload}
            >
              Download
            </Button>
          </Tooltip>
        </div>
      </div>

      {previewTab === 'preview' ? (
        <div className="preview-content">
          <div className="preview-content-inner markdown-body">
            {markdown ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {markdown}
              </ReactMarkdown>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Your README preview will appear here
                </p>
                <p style={{ fontSize: 13 }}>
                  Add sections from the sidebar and fill in the forms to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="raw-content">
          <pre>{markdown || '# Add sections to generate markdown...'}</pre>
        </div>
      )}
    </div>
  );
};
