'use client';

import { useState } from 'react';
import type { Module } from '../curriculum';

type Props = {
  modules: Module[];
  selectedId: string;
  onSelect: (id: string) => void;
  onHome: () => void;
};

export function CourseSidebar({ modules, selectedId, onSelect, onHome }: Props) {
  const activeModule = modules.find(module => module.lessons.some(lesson => lesson.id === selectedId));
  const [expanded, setExpanded] = useState<string[]>(activeModule ? [activeModule.id] : [modules[0].id]);

  const toggle = (id: string) => setExpanded(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const completed = modules.flatMap(module => module.lessons).filter(lesson => lesson.status === 'ready').length;
  const total = modules.flatMap(module => module.lessons).length;

  return <aside className="course-sidebar">
    <button className="course-brand" onClick={onHome} aria-label="返回课程总览">
      <span className="brand-glyph"><i /><i /><i /></span>
      <span><b>GA / SPACE</b><small>互动几何代数教材</small></span>
    </button>
    <div className="sidebar-summary">
      <span>LEARNING PATH</span>
      <b>{modules.length} 单元 · {total} 课</b>
    </div>
    <nav className="module-nav" aria-label="课程目录">
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
    </nav>
    <div className="sidebar-progress">
      <span><b>{completed}</b> / {total} 已写作</span><span>{Math.round(completed / total * 100)}%</span>
      <div><i style={{ width: `${completed / total * 100}%` }} /></div>
      <small>本阶段：搭建完整教材骨架</small>
    </div>
  </aside>;
}
