'use client';

export type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
};

export function Slider({ label, value, min, max, step = 1, suffix = '', onChange }: SliderProps) {
  const digits = step < .01 ? 3 : step < 1 ? 2 : 0;
  return <label><span>{label}</span><output>{value.toFixed(digits)}{suffix}</output><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>;
}

export function LabFrame({ title, tag, metrics, children }: { title: string; tag: string; metrics: [string, string][]; children: React.ReactNode }) {
  return <section className="compact-lab"><div className="compact-lab-head"><div><span>{tag}</span><h3>{title}</h3></div><div className="lab-metrics">{metrics.map(([label, value]) => <span key={label}><small>{label}</small><b>{value}</b></span>)}</div></div><div className="compact-canvas">{children}</div></section>;
}
