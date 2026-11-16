// Entrada de la vista previa aproximada (ver LEEME.md en esta carpeta).
import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { __Proveedor } from "remotion";
import "../../src/marca/fuentes";
import { COMPOSICIONES } from "./composiciones";

const root = createRoot(document.getElementById("root")!);

declare global {
  interface Window {
    __render: (id: string, frame: number, props?: Record<string, unknown>) => Promise<{ width: number; height: number; durationInFrames: number; fps: number }>;
    __meta: (id: string, props?: Record<string, unknown>) => Promise<{ width: number; height: number; durationInFrames: number; fps: number }>;
  }
}

const meta = async (id: string, props?: Record<string, unknown>) => {
  const c = COMPOSICIONES[id];
  if (!c) throw new Error(`Composición desconocida: ${id}`);
  const p = { ...(c.props ?? {}), ...(props ?? {}) };
  const extra = c.calcular ? await c.calcular(p) : {};
  return {
    width: (extra.width as number) ?? c.width,
    height: (extra.height as number) ?? c.height,
    fps: (extra.fps as number) ?? c.fps,
    durationInFrames: (extra.durationInFrames as number) ?? c.durationInFrames,
    props: (extra.props as Record<string, unknown>) ?? p,
  };
};

window.__meta = async (id, props) => {
  const m = await meta(id, props);
  return { width: m.width, height: m.height, durationInFrames: m.durationInFrames, fps: m.fps };
};

window.__render = async (id, frame, props) => {
  const m = await meta(id, props);
  const C = COMPOSICIONES[id].component as React.FC<Record<string, unknown>>;
  flushSync(() => {
    root.render(
      <__Proveedor frame={frame} config={{ fps: m.fps, width: m.width, height: m.height, durationInFrames: m.durationInFrames, id }}>
        <div style={{ width: m.width, height: m.height, position: "relative", overflow: "hidden", background: "#000" }}>
          <C {...m.props} />
        </div>
      </__Proveedor>,
    );
  });
  await document.fonts.ready;
  return { width: m.width, height: m.height, durationInFrames: m.durationInFrames, fps: m.fps };
};
