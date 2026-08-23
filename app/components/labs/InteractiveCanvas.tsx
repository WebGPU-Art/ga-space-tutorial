'use client';

import { useEffect, useRef } from 'react';

export type CanvasFrame = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
};

type Props = {
  draw: (frame: CanvasFrame) => void;
  shaderCode?: string;
  dependencies: ReadonlyArray<unknown>;
  label: string;
  className?: string;
};

type WebGPUApi = { requestAdapter: () => Promise<unknown>; getPreferredCanvasFormat: () => string };

export function InteractiveCanvas({ draw, shaderCode, dependencies, label, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gpuRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    const render = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(box.width * dpr), pixelHeight = Math.round(box.height * dpr);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) { canvas.width = pixelWidth; canvas.height = pixelHeight; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.width, box.height);
      draw({ ctx, width: box.width, height: box.height, dpr });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
    // Draw callbacks intentionally rebind when the experiment state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    const canvas = gpuRef.current;
    const gpu = (navigator as unknown as { gpu?: WebGPUApi }).gpu;
    if (!canvas || !gpu || !shaderCode) return;
    let disposed = false;
    let removeResize: (() => void) | undefined;
    const setup = async () => {
      const adapter = await gpu.requestAdapter() as { requestDevice: () => Promise<unknown> } | null;
      if (!adapter || disposed) return;
      const device = await adapter.requestDevice() as { createShaderModule: (x: unknown) => unknown; createRenderPipeline: (x: unknown) => unknown; createCommandEncoder: () => unknown; queue: { submit: (x: unknown[]) => void } };
      const context = canvas.getContext('webgpu') as unknown as { configure: (x: unknown) => void; getCurrentTexture: () => { createView: () => unknown } };
      if (!context || disposed) return;
      const format = gpu.getPreferredCanvasFormat();
      const shader = device.createShaderModule({ code: shaderCode });
      const pipeline = device.createRenderPipeline({ layout: 'auto', vertex: { module: shader, entryPoint: 'vertexMain' }, fragment: { module: shader, entryPoint: 'fragmentMain', targets: [{ format, blend: { color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha' }, alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' } } }] }, primitive: { topology: 'triangle-list' } });
      const render = () => {
        if (disposed) return;
        const box = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 2);
        canvas.width = Math.round(box.width * dpr); canvas.height = Math.round(box.height * dpr);
        context.configure({ device, format, alphaMode: 'premultiplied' });
        const encoder = device.createCommandEncoder() as { beginRenderPass: (x: unknown) => { setPipeline: (x: unknown) => void; draw: (x: number) => void; end: () => void }; finish: () => unknown };
        const pass = encoder.beginRenderPass({ colorAttachments: [{ view: context.getCurrentTexture().createView(), loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 0 } }] });
        pass.setPipeline(pipeline); pass.draw(3); pass.end(); device.queue.submit([encoder.finish()]);
      };
      render(); window.addEventListener('resize', render); removeResize = () => window.removeEventListener('resize', render);
    };
    setup();
    return () => { disposed = true; removeResize?.(); };
  }, [shaderCode]);

  return <div className={`interactive-canvas ${className}`}>
    <canvas ref={canvasRef} aria-label={label} />
    <canvas ref={gpuRef} aria-hidden="true" />
  </div>;
}
