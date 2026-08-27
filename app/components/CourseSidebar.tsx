'use client';

import { useMemo, useState } from 'react';
import type { Module } from '../curriculum';

type Props = {
  modules: Module[];
  selectedId: string;
  onSelect: (id: string) => void;
  onHome: () => void;
  onHistory: () => void;
  onPhysics: () => void;
  currentView: 'course' | 'history' | 'physics';
};

export function CourseSidebar({ modules, selectedId, onSelect, onHome, onHistory, onPhysics, currentView }: Props) {
  const activeModule = modules.find(module => module.lessons.some(lesson => lesson.id === selectedId));
  const [expanded, setExpanded] = useState<string[]>(activeModule ? [activeModule.id] : [modules[0].id]);
  const [query, setQuery] = useState('');

  const toggle = (id: string) => setExpanded(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const completed = modules.flatMap(module => module.lessons).filter(lesson => lesson.status === 'ready').length;
  const total = modules.flatMap(module => module.lessons).length;
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return modules.flatMap(module => module.lessons.map(lesson => ({ lesson, module }))).filter(({ lesson, module }) =>
      [lesson.title, lesson.summary, lesson.lab, module.title, ...lesson.concepts].some(value => value.toLowerCase().includes(normalized))
    ).slice(0, 12);
  }, [modules, query]);

  return <aside className="course-sidebar">
    <button className="course-brand" onClick={onHome} aria-label="返回课程总览">
      <span className="brand-glyph"><i /><i /><i /></span>
      <span><b>GA / SPACE</b><small>互动几何代数教材</small></span>
    </button>
    <div className="sidebar-summary">
      <span>LEARNING PATH</span>
      <b>{modules.length} 单元 · {total} 课</b>
    </div>
    <div className="sidebar-mode-switch" aria-label="内容频道">
      <button className={currentView === 'course' ? 'active' : ''} onClick={onHome}><span>教材</span><small>系统学习</small></button>
      <button className={currentView === 'history' ? 'active' : ''} onClick={onHistory}><span>数学史</span><small>思想长廊</small></button>
      <button className={currentView === 'physics' ? 'active' : ''} onClick={onPhysics}><span>物理学史</span><small>证据与模型</small></button>
    </div>
    <label className="sidebar-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索概念、课程或实验" aria-label="搜索课程" />{query && <button onClick={() => setQuery('')} aria-label="清除搜索">×</button>}</label>
    <nav className="module-nav" aria-label={query ? '搜索结果' : '课程目录'}>
      {query ? <div className="sidebar-results">
        <span>{matches.length ? `找到 ${matches.length} 个入口` : '没有匹配内容'}</span>
        {matches.map(({ lesson, module }) => <button key={lesson.id} onClick={() => onSelect(lesson.id)}><small>{module.number} · {module.title}</small><b>{lesson.number} {lesson.title}</b><p>{lesson.concepts.join(' · ')}</p></button>)}
      </div> : <>
      {modules.map(module => {
        const isOpen = expanded.includes(module.id);
        const isCurrent = module.id === activeModule?.id;
        return <section key={module.id} className={isCurrent ? 'module-group current' : 'module-group'}>
          <button className="module-toggle" onClick={() => toggle(module.id)} aria-expanded={isOpen}>
            <span className="module-index" style={{ color: module.color }}>{module.number}</span>
            <span><b>{module.title}</b><small>{module.lessons.length} 课</small></span>
            <i>{isOpen ? '−' : '+'}</i>
          </button>
          {isOpen && <div className="lesson-links">
            {module.lessons.map(lesson => <button key={lesson.id} className={lesson.id === selectedId ? 'active' : ''} onClick={() => onSelect(lesson.id)}>
              <span>{lesson.number}</span><em>{lesson.title}</em>
              {lesson.status === 'ready' && <i aria-label="已完成" />}
            </button>)}
          </div>}
        </section>;
      })}
      </>}
    </nav>
    <div className="sidebar-progress">
      <span><b>{completed}</b> / {total} 已写作</span><span>{Math.round(completed / total * 100)}%</span>
      <div><i style={{ width: `${completed / total * 100}%` }} /></div>
      <small>本阶段：搭建完整教材骨架</small>
    </div>
  </aside>;
}
