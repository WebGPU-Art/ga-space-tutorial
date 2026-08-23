'use client';

import { useEffect } from 'react';
import katex from 'katex';

const textFormulas: Record<string, string> = {
  'geometric product = metric information + oriented subspace':
    '\\text{geometric product} = \\text{metric information} + \\text{oriented subspace}',
};

function toTex(source: string) {
  if (textFormulas[source]) return textFormulas[source];

  return source
    .replaceAll('\u00a0', '\\quad ')
    .replaceAll('′', '^{\\prime}')
    .replaceAll('″', '^{\\prime\\prime}')
    .replace(/√\(([^()]*)\)/g, '\\sqrt{$1}')
    .replace(/\b(arcosh|atan2|atanh|cosh|sinh|tanh|atan|acos|asin|exp|log|lim|cos|sin)\b/g, '\\$1');
}

function typeset(element: HTMLElement) {
  const source = element.dataset.formulaSource ?? element.textContent?.trim() ?? '';
  if (!source) return;

  element.dataset.formulaSource = source;
  try {
    katex.render(toTex(source), element, {
      displayMode: element.closest('.equation-card') !== null,
      throwOnError: true,
      strict: 'ignore',
      trust: false,
    });
    element.classList.remove('math-fallback');
  } catch {
    element.textContent = source;
    element.classList.add('math-fallback');
  }
}

export function FormulaTypesetter({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>('.lesson-body .equation-card code, .lesson-body .formula-bridge code')
      .forEach(typeset);
  }, [lessonId]);

  return null;
}
