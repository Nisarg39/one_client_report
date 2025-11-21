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
            <p className="mb-3 last:mb-0 leading-relaxed text-gray-100">
              {children}
            </p>
          ),

          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-3 mt-4 first:mt-0 text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-white">
              {children}
            </h3>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-100">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1 text-gray-100">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),

          // Emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6CA3A2] hover:text-[#5a9291] underline transition-colors"
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
                  className="bg-black bg-opacity-40 px-1.5 py-0.5 rounded text-sm font-mono text-[#6CA3A2]"
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
              <div className="relative group my-3">
                {/* Copy Button - Positioned absolutely in top-right */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <CopyButton content={codeContent} />
                </div>

                {/* Code Block */}
                <pre className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-x-auto p-4 shadow-inner">
                  {children}
                </pre>
              </div>
            );
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#6CA3A2] pl-4 my-3 italic text-gray-300">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="border-gray-700 my-4" />
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full divide-y divide-gray-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#2a2a2a]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-800">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr>{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-200 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-sm text-gray-300">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
