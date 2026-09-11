'use client';

import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { MermaidBlock } from '@/components/docs/mermaid-block';
import { useSiteUiTheme } from '@/hooks/use-site-ui-theme';

interface MarkdownRendererProps {
  content: string;
}

// Language mapping for common aliases
const languageMap: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'sh': 'bash',
  'shell': 'bash',
  'yml': 'yaml',
  'md': 'markdown',
  '': 'text',
};

/**
 * Simple Markdown renderer for documentation content
 * Supports: headers, code blocks with syntax highlighting, lists, links, bold, italic, tables
 */
const ADMONITION_STYLES: Record<string, string> = {
  note: 'border-border bg-muted text-foreground',
  info: 'border-sky-500/40 bg-sky-500/10 text-foreground',
  tip: 'border-emerald-500/40 bg-emerald-500/10 text-foreground',
  warning: 'border-amber-500/40 bg-amber-500/10 text-foreground',
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { resolved } = useSiteUiTheme();
  const codeTheme = resolved === 'light' ? themes.github : themes.nightOwl;
  const renderMarkdown = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let inTable = false;
    let tableRows: string[] = [];
    let key = 0;

    const processInline = (line: string): React.ReactNode => {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let partKey = 0;
      const linkClass =
        'text-emerald-600 underline underline-offset-2 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300';

      while (remaining.length > 0) {
        const candidates: Array<{ kind: string; match: RegExpMatchArray }> = [];
        const tryMatch = (kind: string, re: RegExp) => {
          const match = remaining.match(re);
          if (match && match.index !== undefined) candidates.push({ kind, match });
        };
        tryMatch('bold', /\*\*(.+?)\*\*/);
        tryMatch('italic', /\*(.+?)\*/);
        tryMatch('code', /`([^`]+)`/);
        tryMatch('linkedImg', /\[\!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/);
        tryMatch('img', /!\[([^\]]*)\]\(([^)]+)\)(?:\{[^}]*\})?/);
        tryMatch('link', /\[([^\]]+)\]\(([^)]+)\)/);

        if (candidates.length === 0) {
          parts.push(processInlineSimple(remaining));
          break;
        }

        const priority: Record<string, number> = {
          linkedImg: 0,
          img: 1,
          link: 2,
          bold: 3,
          italic: 4,
          code: 5,
        };
        candidates.sort((a, b) => {
          const delta = (a.match.index ?? 0) - (b.match.index ?? 0);
          if (delta !== 0) return delta;
          return (priority[a.kind] ?? 9) - (priority[b.kind] ?? 9);
        });
        const { kind, match } = candidates[0];
        const index = match.index ?? 0;
        if (index > 0) {
          parts.push(processInlineSimple(remaining.slice(0, index)));
        }

        if (kind === 'bold') {
          parts.push(<strong key={partKey++} className="font-semibold text-foreground">{match[1]}</strong>);
        } else if (kind === 'italic') {
          parts.push(<em key={partKey++} className="italic">{match[1]}</em>);
        } else if (kind === 'code') {
          parts.push(
            <code key={partKey++} className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
              {match[1]}
            </code>
          );
        } else if (kind === 'linkedImg') {
          const [, alt, src, href] = match;
          const external = !href.startsWith('/') && !href.startsWith('#');
          parts.push(
            <a
              key={partKey++}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-block align-middle"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="inline-block h-5 w-auto max-w-full align-middle" />
            </a>
          );
        } else if (kind === 'img') {
          const [, alt, src] = match;
          const isDiagram = src.startsWith('/diagrams/');
          parts.push(
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={partKey++}
              src={src}
              alt={alt}
              className={
                isDiagram
                  ? 'my-2 h-auto w-full max-w-full rounded-lg border border-border'
                  : 'my-2 max-h-[480px] max-w-full rounded-lg border border-border object-contain'
              }
            />
          );
        } else {
          const href = match[2];
          const external = !href.startsWith('/') && !href.startsWith('#');
          parts.push(
            <a
              key={partKey++}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={linkClass}
            >
              {match[1]}
            </a>
          );
        }

        remaining = remaining.slice(index + match[0].length);
      }

      return parts.length > 1 ? parts : parts[0] || null;
    };

    const processInlineSimple = (text: string): React.ReactNode => {
      return text;
    };

    const renderTable = (rows: string[]): React.ReactNode => {
      if (rows.length < 2) return null;
      
      const headerCells = rows[0].split('|').filter(cell => cell.trim());
      const bodyRows = rows.slice(2); // Skip header and separator

      return (
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-lg border border-border">
            <thead className="bg-muted">
              <tr>
                {headerCells.map((cell, i) => (
                  <th key={i} className="border-b border-border px-4 py-3 text-left text-sm font-semibold text-foreground">
                    {processInline(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bodyRows.map((row, rowIndex) => {
                const cells = row.split('|').filter(cell => cell.trim());
                return (
                  <tr key={rowIndex} className="hover:bg-muted/60">
                    {cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-sm text-muted-foreground">
                        {processInline(cell.trim())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    };

    const renderCodeBlock = (code: string, language: string): React.ReactNode => {
      const normalizedLang = language.toLowerCase();

      if (normalizedLang === 'mermaid') {
        return <MermaidBlock key={key++} chart={code} />;
      }

      // Normalize language for syntax highlighting
      const highlightLang = languageMap[normalizedLang] || normalizedLang || 'text';
      
      return (
        <div key={key++} className="my-6 overflow-hidden rounded-lg border border-border">
          {language && (
            <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
              <span className="font-medium uppercase">{language || 'code'}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(code.trim())}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Copy
              </button>
            </div>
          )}
          <Highlight
            theme={codeTheme}
            code={code.trim()}
            language={highlightLang as 'text'}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} overflow-x-auto p-4 text-sm`} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="table-row">
                    <span className="table-cell select-none pr-4 text-right text-muted-foreground" style={{ minWidth: '2.5rem' }}>
                      {i + 1}
                    </span>
                    <span className="table-cell">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      );
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = '';
        } else {
          inCodeBlock = false;
          elements.push(renderCodeBlock(codeContent, codeLanguage));
          codeContent = '';
          codeLanguage = '';
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }

      // Tables
      if (line.includes('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        tableRows.push(line);
        continue;
      } else if (inTable) {
        elements.push(renderTable(tableRows));
        inTable = false;
        tableRows = [];
      }

      // Skip empty lines
      if (line.trim() === '') {
        continue;
      }

      const admonitionMatch = line.match(/^!!!\s+(note|tip|warning|info)(?:\s+"([^"]*)"|\s+(\S.*))?$/);
      if (admonitionMatch) {
        const kind = admonitionMatch[1];
        const title = (admonitionMatch[2] || admonitionMatch[3] || kind).trim();
        const bodyLines: string[] = [];
        i += 1;
        while (i < lines.length) {
          const next = lines[i];
          if (next.startsWith('    ') || next.startsWith('\t')) {
            bodyLines.push(next.replace(/^(?:    |\t)/, ''));
            i += 1;
            continue;
          }
          if (next.trim() === '') {
            bodyLines.push('');
            i += 1;
            continue;
          }
          break;
        }
        i -= 1;
        elements.push(
          <aside key={key++} className={`my-6 rounded-lg border px-4 py-3 text-sm leading-relaxed ${ADMONITION_STYLES[kind]}`}>
            <p className="mb-1 font-semibold capitalize">{title}</p>
            {bodyLines.join('\n').trim() ? (
              <div className="text-muted-foreground">{processInline(bodyLines.join(' ').replace(/\s+/g, ' ').trim())}</div>
            ) : null}
          </aside>
        );
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="mb-4 mt-8 text-3xl font-bold text-foreground">
            {line.slice(2)}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="mb-4 mt-8 border-b border-border pb-2 text-2xl font-bold text-foreground">
            {line.slice(3)}
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="mb-3 mt-6 text-xl font-semibold text-foreground">
            {line.slice(4)}
          </h3>
        );
        continue;
      }
      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={key++} className="mb-2 mt-4 text-lg font-semibold text-foreground">
            {line.slice(5)}
          </h4>
        );
        continue;
      }

      // Horizontal rule
      if (line.match(/^---+$/)) {
        elements.push(
          <hr key={key++} className="my-8 border-t border-border" />
        );
        continue;
      }

      // Unordered lists
      if (line.match(/^[-*]\s/)) {
        const listItems: React.ReactNode[] = [];
        while (i < lines.length && lines[i].match(/^[-*]\s/)) {
          listItems.push(
            <li key={key++} className="ml-4 list-disc text-muted-foreground">
              {processInline(lines[i].replace(/^[-*]\s/, ''))}
            </li>
          );
          i++;
        }
        i--; // Back up one
        elements.push(<ul key={key++} className="my-4 space-y-2">{listItems}</ul>);
        continue;
      }

      // Ordered lists
      if (line.match(/^\d+\.\s/)) {
        const listItems: React.ReactNode[] = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          listItems.push(
            <li key={key++} className="ml-4 list-decimal text-muted-foreground">
              {processInline(lines[i].replace(/^\d+\.\s/, ''))}
            </li>
          );
          i++;
        }
        i--; // Back up one
        elements.push(<ol key={key++} className="my-4 space-y-2">{listItems}</ol>);
        continue;
      }

      // Standalone image line (full-width / centered, not wrapped in <p>)
      const standaloneImg = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)(?:\{[^}]*\})?\s*$/);
      if (standaloneImg) {
        const [, alt, src] = standaloneImg;
        const isDiagram = src.startsWith('/diagrams/');
        elements.push(
          <div key={key++} className={isDiagram ? 'my-6 w-full' : 'my-6 flex justify-center'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className={
                isDiagram
                  ? 'h-auto w-full rounded-lg border border-border'
                  : 'max-h-[min(480px,70vh)] w-auto max-w-full rounded-lg border border-border object-contain'
              }
            />
          </div>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].slice(2));
          i++;
        }
        i--; // Back up one
        elements.push(
          <blockquote key={key++} className="my-4 border-l-4 border-emerald-500 pl-4 italic text-muted-foreground">
            {quoteLines.map((ql, idx) => (
              <p key={idx}>{processInline(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Regular paragraph
      elements.push(
        <p key={key++} className="my-4 leading-relaxed text-muted-foreground">
          {processInline(line)}
        </p>
      );
    }

    // Handle any remaining table
    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows));
    }

    return <>{elements}</>;
  };

  return <div className="prose max-w-none dark:prose-invert">{renderMarkdown(content)}</div>;
}
