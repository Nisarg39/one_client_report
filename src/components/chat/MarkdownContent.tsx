/**
 * Markdown Content Component
 *
 * Renders markdown with syntax highlighting for code blocks
 * Used for AI assistant responses
 */

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { CopyButton } from './CopyButton';

interface MarkdownContentProps {
  content: string;
}

/**
 * Helper function to extract text content from React children
 * Recursively traverses the children tree to get all text
 */
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }

  if (React.isValidElement(children) && typeof children.props === 'object' && children.props !== null && 'children' in children.props) {
    return extractTextFromChildren((children.props as { children: React.ReactNode }).children);
  }

  return '';
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-4 last:mb-0 leading-relaxed text-[#c0c0c0] font-medium">
              {children}
            </p>
          ),

          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-black mb-4 mt-6 first:mt-0 text-[#f5f5f5] uppercase tracking-tighter italic">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-black mb-3 mt-5 first:mt-0 text-[#f5f5f5] uppercase tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-black mb-2 mt-4 first:mt-0 text-[#f5f5f5] uppercase tracking-wide">
              {children}
            </h3>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-none pl-0 mb-4 space-y-2 text-[#c0c0c0]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-4 space-y-2 text-[#c0c0c0]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6CA3A2]/40 mt-2 shrink-0" />
              <span>{children}</span>
            </li>
          ),

          // Emphasis
          strong: ({ children }) => (
            <strong className="font-bold text-[#f5f5f5]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#e5e5e5]">{children}</em>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6CA3A2] hover:text-[#5a9291] font-bold underline decoration-[#6CA3A2]/30 transition-all underline-offset-4"
            >
              {children}
            </a>
          ),

          // Inline code
          code: ({ className, children, ...props }) => {
            const isInline = !className;

            if (isInline) {
              return (
                <code
                  className="bg-[#1a1a1a] shadow-neu-inset px-2 py-0.5 rounded-md text-sm font-mono text-[#6CA3A2] border border-white/5"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // For code blocks, let rehype-highlight handle the styling
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          // Code blocks
          pre: ({ children }) => {
            // Extract the code content for the copy button
            const codeContent = extractTextFromChildren(children);

            return (
              <div className="relative group my-6">
                {/* Copy Button - Positioned absolutely in top-right */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <CopyButton content={codeContent} />
                </div>

                {/* Code Block */}
                <pre className="bg-[#1a1a1a] border border-white/5 rounded-2x overflow-x-auto p-6 shadow-neu-inset">
                  {children}
                </pre>
              </div>
            );
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#6CA3A2] pl-6 my-6 py-2 italic text-[#999999] bg-[#1a1a1a] rounded-r-2xl shadow-neu-inset border-opacity-50">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="border-white/5 my-8" />
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-2xl shadow-neu-raised border border-white/5">
              <table className="min-w-full divide-y divide-white/5">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#1a1a1a]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/5">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-[10px] font-black text-[#6CA3A2] uppercase tracking-widest">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-[#999999] font-medium">{children}</td>
          ),

        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
