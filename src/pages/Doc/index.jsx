import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import remarkGfm from 'remark-gfm';
import "./styles.css";

// Registra o suporte para JavaScript
SyntaxHighlighter.registerLanguage('javascript', js);

function MarkdownComponent() {
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://raw.githubusercontent.com/luizsonego/viva-saude/refs/heads/main/README.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        setMarkdownContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching markdown:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    a: ({ node, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={props.children || "Link interno"}
        onClick={(e) => {
          if (props.href?.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(props.href);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
      />
    ),
  };

  if (loading) {
    return (
      <div className="markdown-container">
        <div className="loading-spinner">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="markdown-container error">
        <h3>Erro ao carregar o conteúdo</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownComponent;