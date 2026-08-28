import type { DemoReading } from '../historyDemoDocs';

export function DemoReadingPanel({ reading, onOpenLesson }: { reading: DemoReading; onOpenLesson: (lessonId: string) => void }) {
  return <article className="demo-reading" aria-label="实验对应正文">
    <header><div><span>READ THE MODEL · 对应正文</span><h3>从动画现象走到可以复述的知识</h3></div><p>{reading.history}</p></header>
    <div className="demo-reading-body">
      <section className="demo-reading-relation"><span>核心关系</span><p>{reading.relation}</p></section>
      <section className="demo-reading-steps"><span>一步步读图</span><ol>{reading.steps.map((step, index) => <li key={step}><i>{index + 1}</i><p>{step}</p></li>)}</ol></section>
      <section className="demo-reading-boundary"><span>不要这样误读</span><p>{reading.boundary}</p></section>
    </div>
    <footer><div><span>继续学习</span><p>{reading.next}</p></div><button onClick={() => onOpenLesson(reading.lessonId)}>打开对应课程 <i>→</i></button></footer>
  </article>;
}
