import React, { useState, useEffect } from 'react';
import { CollaboratorChip } from './CollaboratorChip.jsx';

// Helper for file type icons based on extension
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['js', 'jsx', 'mjs', 'cjs'].includes(ext)) return '⚡';
  if (['ts', 'tsx'].includes(ext)) return '🟦';
  if (['py'].includes(ext)) return '🐍';
  if (['cpp', 'c', 'h', 'hpp'].includes(ext)) return '💙';
  if (['dart'].includes(ext)) return '🎯';
  if (['rs', 'rust'].includes(ext)) return '🦀';
  if (['html', 'css', 'scss'].includes(ext)) return '🎨';
  if (['json', 'yaml', 'yml', 'toml'].includes(ext)) return '📦';
  if (['md', 'txt'].includes(ext)) return '📄';
  if (fileName.startsWith('.')) return '⚙️';
  return '📝';
};

// Helper function to build a nested tree object from flat file paths
function buildNestedTree(filePaths) {
  const root = { name: 'root', type: 'folder', children: {} };

  filePaths.forEach((pathStr) => {
    const parts = pathStr.split('/');
    let current = root;

    parts.forEach((part, idx) => {
      const isFile = idx === parts.length - 1;
      const currentPath = parts.slice(0, idx + 1).join('/');

      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? null : {}
        };
      }
      if (!isFile) {
        current = current.children[part];
      }
    });
  });

  return root;
}

/**
 * Recursive File & Folder Tree Item Component
 */
const FileTreeNode = ({ node, activeFile, onSelectFile, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'file') {
    const isSelected = activeFile === node.path;
    return (
      <div
        onClick={() => onSelectFile(node.path)}
        style={{
          paddingLeft: `${depth * 14 + 8}px`,
          paddingTop: '4px',
          paddingBottom: '4px',
          paddingRight: '8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          marginBottom: '2px',
          background: isSelected ? 'var(--accent)' : 'transparent',
          color: isSelected ? 'var(--bg)' : 'var(--text)',
          fontWeight: isSelected ? '800' : 'normal',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        title={node.path}
      >
        <span>{getFileIcon(node.name)}</span>
        <span>{node.name}</span>
      </div>
    );
  }

  // Folder Node
  const childrenKeys = Object.keys(node.children || {});
  return (
    <div style={{ marginBottom: '2px' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          paddingLeft: `${depth * 14 + 4}px`,
          paddingTop: '5px',
          paddingBottom: '5px',
          paddingRight: '8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          userSelect: 'none'
        }}
      >
        <span style={{ fontSize: '12px' }}>{isOpen ? '📂' : '📁'}</span>
        <span>{node.name}</span>
        <span style={{ fontSize: '8px', opacity: 0.6, marginLeft: 'auto' }}>
          {isOpen ? '▼' : '▶'}
        </span>
      </div>

      {isOpen && (
        <div>
          {childrenKeys.map((childKey) => (
            <FileTreeNode
              key={node.children[childKey].path}
              node={node.children[childKey]}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * RepoDetailPage Component (Collapsible Folder Tree Code Explorer)
 */
export const RepoDetailPage = ({ repo, userProfile, currentTheme, onBack }) => {
  if (!repo) return null;

  const { name, description, stargazers_count, forks_count, language, html_url, updated_at, movieMatch } = repo;
  const repoOwner = repo.owner?.login || (typeof repo.owner === 'string' ? repo.owner : '') || userProfile?.login || 'developer';

  const [fileMap, setFileMap] = useState({});
  const [activeFile, setActiveFile] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [codeSearchQuery, setCodeSearchQuery] = useState('');
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rawMode, setRawMode] = useState(false);

  // Fetch live repo file tree from backend API
  useEffect(() => {
    async function loadLiveTree() {
      setLoadingTree(true);
      try {
        const res = await fetch(`/api/repo/tree/${encodeURIComponent(repoOwner)}/${encodeURIComponent(name)}`);
        if (res.ok) {
          const treeData = await res.json();
          if (Array.isArray(treeData) && treeData.length > 0) {
            const liveMap = {};
            treeData.forEach(item => {
              if (item.path) {
                liveMap[item.path] = `// Loading contents for "${item.path}"...`;
              }
            });
            setFileMap(liveMap);
            // Default to README or first file
            const defaultFile = treeData.find(f => f.path.toLowerCase().includes('readme'))?.path || treeData[0].path;
            setActiveFile(defaultFile);
            setLoadingTree(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Live tree fetch notice:', e);
      }
      
      // Fallback if live tree is unavailable
      const fallbackMap = {
        'README.md': `# ${name}\n\n${description || 'No description provided.'}\n\n## Overview\nThis repository is part of @${repoOwner}'s GitHub portfolio aggregated by API Fusion.`,
        'backend/src/server.js': `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.get('/', (req, res) => res.send('Server Running'));\napp.listen(PORT);`,
        'frontend/src/App.jsx': `import React from 'react';\n\nexport default function App() {\n  return <div>App Component for ${name}</div>;\n}`,
        'package.json': `{\n  "name": "${(name || 'repo').toLowerCase()}",\n  "version": "1.0.0"\n}`
      };
      setFileMap(fallbackMap);
      setActiveFile('README.md');
      setFileContent(fallbackMap['README.md']);
      setLoadingTree(false);
    }

    loadLiveTree();
  }, [repoOwner, name, description]);

  // Fetch live file content when active file changes
  useEffect(() => {
    if (!activeFile) return;

    async function loadLiveFileContent() {
      setLoadingFile(true);
      try {
        const res = await fetch(`/api/repo/file/${encodeURIComponent(repoOwner)}/${encodeURIComponent(name)}?path=${encodeURIComponent(activeFile)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.content !== undefined) {
            setFileContent(data.content);
            setFileMap(prev => ({ ...prev, [activeFile]: data.content }));
            return;
          }
        }
      } catch (e) {
        console.warn('Live file content fetch notice:', e);
      } finally {
        setLoadingFile(false);
      }
    }

    loadLiveFileContent();
  }, [activeFile, repoOwner, name]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Movie accent tokenized syntax highlighter
  const highlightLine = (lineText) => {
    if (!lineText) return <span>&nbsp;</span>;

    // Highlight comments
    if (lineText.trim().startsWith('//') || lineText.trim().startsWith('#') || lineText.trim().startsWith('/*') || lineText.trim().startsWith('*')) {
      return <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', opacity: 0.8 }}>{lineText}</span>;
    }

    // Highlighting regex for keywords, strings, numbers
    const tokens = lineText.split(/(\s+|"([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`|[\(\)\{\}\[\];,])/g).filter(Boolean);

    const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'class', 'return', 'async', 'await', 'if', 'else', 'try', 'catch', 'def', 'include', 'using', 'std', 'void', 'int', 'bool', 'true', 'false', 'null', 'undefined', 'public', 'private', 'widget', 'override'];

    return (
      <span>
        {tokens.map((token, index) => {
          const lower = token.toLowerCase();
          if (keywords.includes(lower)) {
            return <span key={index} style={{ color: 'var(--accent)', fontWeight: '800' }}>{token}</span>;
          }
          if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'")) || (token.startsWith('`') && token.endsWith('`'))) {
            return <span key={index} style={{ color: '#10b981' }}>{token}</span>;
          }
          if (!isNaN(token.trim()) && token.trim() !== '') {
            return <span key={index} style={{ color: '#c084fc' }}>{token}</span>;
          }
          return <span key={index}>{token}</span>;
        })}
      </span>
    );
  };

  // Filter file list by search query
  const allFilePaths = Object.keys(fileMap);
  const filteredFilePaths = fileSearchQuery.trim()
    ? allFilePaths.filter(file => file.toLowerCase().includes(fileSearchQuery.toLowerCase()))
    : allFilePaths;

  // Build nested folder tree from file paths
  const nestedTreeRoot = buildNestedTree(filteredFilePaths);

  // Filter code lines by code search query
  const rawLines = (fileContent || '').split('\n');
  const matchingLineIndexes = codeSearchQuery.trim()
    ? rawLines.reduce((acc, line, idx) => line.toLowerCase().includes(codeSearchQuery.toLowerCase()) ? [...acc, idx] : acc, [])
    : [];

  const backdropUrl = movieMatch?.backdrop || currentTheme?.backdropUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
  const posterUrl = movieMatch?.poster || currentTheme?.posterUrl || 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg';

  const [contributors, setContributors] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Fetch real contributors & language breakdown from backend APIs
  useEffect(() => {
    async function loadRepoMetadata() {
      setLoadingMeta(true);
      try {
        const [contribRes, langRes] = await Promise.all([
          fetch(`/api/repo/contributors/${encodeURIComponent(repoOwner)}/${encodeURIComponent(name)}`),
          fetch(`/api/repo/languages/${encodeURIComponent(repoOwner)}/${encodeURIComponent(name)}`)
        ]);

        if (contribRes.ok) {
          const contribData = await contribRes.json();
          if (Array.isArray(contribData) && contribData.length > 0) {
            setContributors(contribData.map(c => ({
              id: c.id || c.login,
              login: c.login,
              name: c.login === repoOwner ? (userProfile?.name || userProfile?.login || c.login) : c.login,
              avatar_url: c.avatar_url,
              contributions: c.contributions || 1,
              role: c.login === repoOwner ? 'Lead Architect / Director' : 'Contributor / Cast',
              html_url: c.html_url || `https://github.com/${c.login}`
            })));
          }
        }

        if (langRes.ok) {
          const langData = await langRes.json();
          if (Array.isArray(langData) && langData.length > 0) {
            setLanguages(langData);
          }
        }
      } catch (e) {
        console.warn('Metadata fetch notice:', e);
      } finally {
        setLoadingMeta(false);
      }
    }

    loadRepoMetadata();
  }, [repoOwner, name, userProfile]);

  const getLangColor = (langName, index) => {
    const colors = ['var(--accent)', '#10b981', '#c084fc', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    const lower = (langName || '').toLowerCase();
    if (lower.includes('js') || lower.includes('javascript')) return '#f7df1e';
    if (lower.includes('ts') || lower.includes('typescript')) return '#3178c6';
    if (lower.includes('html')) return '#e34c26';
    if (lower.includes('css')) return '#563d7c';
    if (lower.includes('py') || lower.includes('python')) return '#3572A5';
    if (lower.includes('c++') || lower.includes('cpp')) return '#f34b7d';
    return colors[index % colors.length];
  };

  const castCrew = contributors.length > 0 ? contributors : [
    { id: 1, login: repoOwner, name: userProfile?.name || repoOwner, avatar_url: userProfile?.avatar_url || `https://github.com/${repoOwner}.png`, contributions: 1, role: 'Lead Architect / Director' }
  ];

  return (
    <div className="repo-detail-page" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Navigation Header */}
      <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          style={{
            background: 'var(--accent)',
            color: 'var(--bg)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '800',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 0 10px var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← BACK TO DASHBOARD
        </button>

        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '13px', color: 'var(--accent)', letterSpacing: '0.05em' }}>
          API_FUSION // REPOSITORY_INSPECTOR: {name}
        </div>

        <a
          href={html_url || `https://github.com/${repoOwner}/${name}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            padding: '8px 16px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            textDecoration: 'none',
            fontWeight: '700'
          }}
        >
          🌐 VIEW ON GITHUB.COM ↗
        </a>
      </nav>

      {/* Hero Cinematic Movie Banner */}
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          backgroundImage: `linear-gradient(to right, rgba(11,15,25,0.95) 30%, rgba(11,15,25,0.5) 100%), url(${backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '28px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Movie Poster Thumbnail */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={posterUrl}
              alt={movieMatch?.title || name}
              style={{
                width: '130px',
                height: '195px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '2px solid var(--accent)',
                boxShadow: '0 0 20px var(--accent-glow)'
              }}
            />
            {movieMatch && (
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent)',
                color: 'var(--bg)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: '900',
                whiteSpace: 'nowrap'
              }}>
                🎬 {movieMatch.rating ? `${Number(movieMatch.rating).toFixed(1)} ★` : '8.0 ★'}
              </div>
            )}
          </div>

          {/* Repo Info Header */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
              CORRELATED TMDB MOVIE: "{movieMatch?.title || name}"
            </div>

            <h1 style={{ fontSize: '30px', fontWeight: '900', margin: '0 0 10px 0', color: 'var(--text)' }}>
              {name}
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', maxWidth: '700px', marginBottom: '14px' }}>
              {description || movieMatch?.overview || 'Primary project repository. High performance software system.'}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="tag-badge" style={{ background: 'var(--accent)', color: 'var(--bg)', fontWeight: '800' }}>{language || 'JavaScript'}</span>
              <span className="tag-badge muted">★ {stargazers_count || 0} STARS</span>
              <span className="tag-badge muted">⑂ {forks_count || 0} FORKS</span>
              {updated_at && <span className="tag-badge muted">📅 UPDATED: {new Date(updated_at).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Code Explorer + TMDB Specs */}
      <main className="container" style={{ marginTop: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px' }}>
          
          {/* Left Column: Upgraded Hierarchical Folder Tree Code Explorer */}
          <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Code Explorer Header Controls */}
            <div style={{ background: 'var(--bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '12px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📁 {repoOwner} / {name} / <b>{activeFile}</b></span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                  ({rawLines.length} lines, {(fileContent || '').length} bytes)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Search inside file */}
                <input
                  type="text"
                  placeholder="🔍 Search code..."
                  value={codeSearchQuery}
                  onChange={(e) => setCodeSearchQuery(e.target.value)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    outline: 'none',
                    width: '130px'
                  }}
                />

                {codeSearchQuery.trim() && (
                  <span style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                    {matchingLineIndexes.length} match{matchingLineIndexes.length !== 1 ? 'es' : ''}
                  </span>
                )}

                {/* Raw vs Highlighted Toggle */}
                <button
                  onClick={() => setRawMode(!rawMode)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: rawMode ? 'var(--accent)' : 'var(--text-muted)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {rawMode ? '⚡ SYNTAX VIEW' : '📄 RAW VIEW'}
                </button>

                {/* Copy Code Button */}
                <button
                  onClick={handleCopyCode}
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? '✓ COPIED!' : '📋 COPY'}
                </button>
              </div>
            </div>

            {/* Code Explorer Split: Collapsible Folder Tree Sidebar + Editor */}
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '520px' }}>
              {/* Hierarchical Folder Tree Sidebar */}
              <div style={{ background: 'rgba(0,0,0,0.25)', borderRight: '1px solid var(--border)', padding: '12px', display: 'flex', flexDirection: 'column' }}>
                {/* File Filter Input */}
                <input
                  type="text"
                  placeholder="Filter files & folders..."
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    outline: 'none',
                    marginBottom: '10px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>FOLDER STRUCTURE ({allFilePaths.length} FILES):</span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {loadingTree ? (
                    <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', padding: '12px 0' }}>
                      ⚡ Loading folder structure...
                    </div>
                  ) : Object.keys(nestedTreeRoot.children).length > 0 ? (
                    Object.keys(nestedTreeRoot.children).map((childKey) => (
                      <FileTreeNode
                        key={nestedTreeRoot.children[childKey].path}
                        node={nestedTreeRoot.children[childKey]}
                        activeFile={activeFile}
                        onSelectFile={(selectedPath) => setActiveFile(selectedPath)}
                        depth={0}
                      />
                    ))
                  ) : (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '10px 0', fontFamily: 'var(--font-mono)' }}>
                      No matching files or folders.
                    </div>
                  )}
                </div>
              </div>

              {/* Code Viewer Panel */}
              <div style={{ padding: '16px', background: 'var(--bg)', overflowX: 'auto', position: 'relative' }}>
                {loadingFile ? (
                  <div style={{ padding: '40px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                    ⚡ Loading live source code from GitHub...
                  </div>
                ) : rawMode ? (
                  <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6', color: 'var(--text)' }}>
                    {fileContent}
                  </pre>
                ) : (
                  <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6' }}>
                    <code>
                      {rawLines.map((line, idx) => {
                        const isMatch = codeSearchQuery.trim() && line.toLowerCase().includes(codeSearchQuery.toLowerCase());
                        return (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex',
                              background: isMatch ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                              borderLeft: isMatch ? '3px solid var(--accent)' : '3px solid transparent',
                              paddingLeft: isMatch ? '4px' : '0'
                            }}
                          >
                            <span style={{ 
                              width: '36px', 
                              color: isMatch ? 'var(--accent)' : 'var(--text-muted)', 
                              userSelect: 'none', 
                              textAlign: 'right', 
                              paddingRight: '16px', 
                              fontSize: '11px',
                              opacity: 0.6
                            }}>
                              {idx + 1}
                            </span>
                            <span style={{ whiteSpace: 'pre' }}>
                              {highlightLine(line)}
                            </span>
                          </div>
                        );
                      })}
                    </code>
                  </pre>
                )}
              </div>
            </div>
          </section>

          {/* Right Column: TMDB Correlation Specs & Cast */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* TMDB Specs & Language Usage Breakdown */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent)', marginTop: 0, marginBottom: '12px', fontWeight: '800' }}>
                📊 LANGUAGE BREAKDOWN SPECS
              </h3>

              {languages.length > 0 ? (
                <div style={{ marginBottom: '16px' }}>
                  {/* Multi-color stacked progress bar */}
                  <div style={{ height: '8px', width: '100%', borderRadius: '4px', overflow: 'hidden', display: 'flex', background: 'var(--border)', marginBottom: '12px' }}>
                    {languages.map((item, idx) => (
                      <div
                        key={item.language}
                        style={{
                          width: `${item.percentage}%`,
                          background: getLangColor(item.language, idx),
                          height: '100%'
                        }}
                        title={`${item.language}: ${item.percentage}%`}
                      />
                    ))}
                  </div>

                  {/* Language percentage chips */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {languages.map((item, idx) => (
                      <div
                        key={item.language}
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getLangColor(item.language, idx) }} />
                        <span style={{ fontWeight: '700', color: 'var(--text)' }}>{item.language}</span>
                        <span style={{ color: 'var(--accent)', fontWeight: '800' }}>{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                  Primary Language: <b style={{ color: 'var(--accent)' }}>{language || 'JavaScript'}</b>
                </div>
              )}

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text)', marginBottom: '6px' }}>
                  THEME COLOR PALETTE:
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--bg-primary)', border: '1px solid var(--border)' }} title="Primary BG" />
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border)' }} title="Surface BG" />
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--accent)', border: '1px solid var(--border)' }} title="Accent Glow" />
                </div>
              </div>
            </div>

            {/* Cast & Crew Section (Real Contributors) */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent)', marginTop: 0, marginBottom: '12px', fontWeight: '800', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>👥 REPOSITORY CAST & CREW</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>({castCrew.length})</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {castCrew.map((member) => (
                  <CollaboratorChip key={member.id || member.login} collaborator={member} />
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};
