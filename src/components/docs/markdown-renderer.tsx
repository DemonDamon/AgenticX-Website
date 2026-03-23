'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Simple Markdown renderer for documentation content
 * Supports: headers, code blocks, lists, links, bold, italic, tables
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
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
      // Process inline elements: bold, italic, code, links
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let partKey = 0;

      while (remaining.length > 0) {
        // Bold
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        if (boldMatch && boldMatch.index !== undefined) {
          if (boldMatch.index > 0) {
            parts.push(processInlineSimple(remaining.slice(0, boldMatch.index)));
          }
          parts.push(<strong key={partKey++} className="font-semibold text-white">{boldMatch[1]}</strong>);
          remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
          continue;
        }

        // Italic
        const italicMatch = remaining.match(/\*(.+?)\*/);
        if (italicMatch && italicMatch.index !== undefined) {
          if (italicMatch.index > 0) {
            parts.push(processInlineSimple(remaining.slice(0, italicMatch.index)));
          }
          parts.push(<em key={partKey++} className="italic">{italicMatch[1]}</em>);
          remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
          continue;
        }

        // Inline code
        const codeMatch = remaining.match(/`([^`]+)`/);
        if (codeMatch && codeMatch.index !== undefined) {
          if (codeMatch.index > 0) {
            parts.push(processInlineSimple(remaining.slice(0, codeMatch.index)));
          }
          parts.push(
            <code key={partKey++} className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 text-sm font-mono">
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
          continue;
        }

        // Links
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch && linkMatch.index !== undefined) {
          if (linkMatch.index > 0) {
            parts.push(processInlineSimple(remaining.slice(0, linkMatch.index)));
          }
          parts.push(
            <a
              key={partKey++}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              {linkMatch[1]}
            </a>
          );
          remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
          continue;
        }

        // No more special elements, add rest as text
        parts.push(processInlineSimple(remaining));
        break;
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
        <div key={key++} className="overflow-x-auto my-6">
          <table className="min-w-full border border-zinc-700 rounded-lg overflow-hidden">
            <thead className="bg-zinc-800">
              <tr>
                {headerCells.map((cell, i) => (
                  <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-white border-b border-zinc-700">
                    {processInline(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {bodyRows.map((row, rowIndex) => {
                const cells = row.split('|').filter(cell => cell.trim());
                return (
                  <tr key={rowIndex} className="hover:bg-zinc-800/50">
                    {cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-sm text-zinc-300">
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
          elements.push(
            <div key={key++} className="my-6 rounded-lg overflow-hidden border border-zinc-700">
              {codeLanguage && (
                <div className="bg-zinc-800 px-4 py-2 text-xs text-zinc-400 border-b border-zinc-700">
                  {codeLanguage}
                </div>
              )}
              <pre className="bg-zinc-900 p-4 overflow-x-auto">
                <code className="text-sm text-zinc-300 font-mono whitespace-pre">
                  {codeContent.trim()}
                </code>
              </pre>
            </div>
          );
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

      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-white mt-8 mb-4">
            {line.slice(2)}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-zinc-700 pb-2">
            {line.slice(3)}
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-white mt-6 mb-3">
            {line.slice(4)}
          </h3>
        );
        continue;
      }
      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={key++} className="text-lg font-semibold text-zinc-200 mt-4 mb-2">
            {line.slice(5)}
          </h4>
        );
        continue;
      }

      // Horizontal rule
      if (line.match(/^---+$/)) {
        elements.push(
          <hr key={key++} className="my-8 border-t border-zinc-700" />
        );
        continue;
      }

      // Unordered lists
      if (line.match(/^[-*]\s/)) {
        const listItems: React.ReactNode[] = [];
        while (i < lines.length && lines[i].match(/^[-*]\s/)) {
          listItems.push(
            <li key={key++} className="text-zinc-300 ml-4 list-disc">
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
            <li key={key++} className="text-zinc-300 ml-4 list-decimal">
              {processInline(lines[i].replace(/^\d+\.\s/, ''))}
            </li>
          );
          i++;
        }
        i--; // Back up one
        elements.push(<ol key={key++} className="my-4 space-y-2">{listItems}</ol>);
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
          <blockquote key={key++} className="my-4 pl-4 border-l-4 border-emerald-500 text-zinc-400 italic">
            {quoteLines.map((ql, idx) => (
              <p key={idx}>{processInline(ql)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Regular paragraph
      elements.push(
        <p key={key++} className="text-zinc-300 my-4 leading-relaxed">
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

  return <div className="prose prose-invert max-w-none">{renderMarkdown(content)}</div>;
}
