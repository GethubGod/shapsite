import React from "react";

export function Table() {
  return <div className="table" />;
}

export function LampPool() {
  return <div className="lamp-pool" />;
}

export function Mug({ x, y, rot = 0, z = 4 }) {
  return (
    <div
      className="prop mug"
      style={{
        "--x": `${x}px`,
        "--y": `${y}px`,
        "--rot": `${rot}deg`,
        "--z": `${z}px`,
      }}
    >
      <div className="mug-body" />
      <div className="mug-coffee" />
      <div className="mug-handle" />
      <div className="steam" />
    </div>
  );
}

export function Pencil({ x, y, rot = 0, z = 4 }) {
  return (
    <div
      className="prop pencil"
      style={{
        "--x": `${x}px`,
        "--y": `${y}px`,
        "--rot": `${rot}deg`,
        "--z": `${z}px`,
      }}
    />
  );
}

export function ScrapPaper({ x, y, rot = 0, z = 2 }) {
  return (
    <div
      className="prop scrap-paper"
      style={{
        "--x": `${x}px`,
        "--y": `${y}px`,
        "--rot": `${rot}deg`,
        "--z": `${z}px`,
      }}
    />
  );
}

export function DeskProps({ visibility = 1 }) {
  return (
    <div style={{ opacity: visibility, transition: "opacity 0.4s ease" }}>
      <Mug x={-1180} y={-540} rot={0} z={6} />
      <Pencil x={1080} y={-650} rot={-22} z={5} />
      <Pencil x={1130} y={-590} rot={18} z={6} />
      <Pencil x={1070} y={-540} rot={-6} z={7} />
      <ScrapPaper x={-1280} y={680} rot={-14} z={3} />
      <ScrapPaper x={1220} y={760} rot={16} z={3} />
      <ScrapPaper x={-1380} y={-680} rot={9} z={3} />
    </div>
  );
}

export function Dust() {
  const motes = [
    { left: "48%", top: "22%", delay: 0 },
    { left: "52%", top: "30%", delay: 3 },
    { left: "45%", top: "26%", delay: 6 },
    { left: "55%", top: "34%", delay: 9 },
    { left: "50%", top: "40%", delay: 12 },
  ];
  return (
    <>
      {motes.map((m, i) => (
        <div
          key={i}
          className="dust"
          style={{
            left: m.left,
            top: m.top,
            animationDelay: `-${m.delay}s`,
          }}
        />
      ))}
    </>
  );
}
