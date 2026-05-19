import React from "react";
import { easeOut, segment, lerp } from "./helpers.js";

export function Folder({
  id,
  label,
  sub,
  color,
  colorDark,
  openness = 0,
  x = 0,
  y = 0,
  z = 8,
  rotate = 0,
  scale = 1,
  showStamp = false,
  insidePage = null,
  items = [],
}) {
  const coverRot = openness * 178;
  const fan = easeOut(segment(openness, 0.55, 1));
  const visible = openness > 0.15;

  return (
    <div
      className="folder"
      data-folder={id}
      style={{
        "--x": `${x}px`,
        "--y": `${y}px`,
        "--z": `${z}px`,
        "--rot": `${rotate}deg`,
        "--scale": scale,
      }}
    >
      <div
        className="folder-back"
        style={{ "--col": color, "--col-dark": colorDark }}
      >
        <div
          className="folder-tab"
          style={{ "--col": color, "--col-dark": colorDark }}
        >
          {label}
        </div>

        {insidePage && (
          <div
            className="folder-inside"
            style={{ opacity: easeOut(segment(openness, 0.35, 0.9)) }}
          >
            {insidePage}
          </div>
        )}
      </div>

      {visible && (
        <div className="folder-inside">
          {items.map((it, i) => {
            const preX = (i - items.length / 2) * 6;
            const preY = (i - items.length / 2) * 4;
            const preRot = (i - items.length / 2) * 3;
            const preScale = 0.55;
            const finalX = it.x || 0;
            const finalY = it.y || 0;
            const finalRot = it.rot || 0;
            const finalScale = it.scale || 1;
            const itemZ = (it.z || 10) + i * 1.5;
            const ix = lerp(preX, finalX, fan);
            const iy = lerp(preY, finalY, fan);
            const ir = lerp(preRot, finalRot, fan);
            const is = lerp(preScale, finalScale, fan);
            const opacity = easeOut(segment(openness, 0.4, 0.95));
            return (
              <div
                key={it.key}
                className="item"
                style={{
                  "--x": `${ix}px`,
                  "--y": `${iy}px`,
                  "--z": `${itemZ}px`,
                  "--rot": `${ir}deg`,
                  "--scale": is,
                  opacity,
                }}
              >
                {it.comp}
              </div>
            );
          })}
        </div>
      )}

      <div
        className="folder-front"
        style={{
          "--cover-rot": `${coverRot}deg`,
          transform: `rotateX(${coverRot}deg)`,
        }}
      >
        <div
          className="folder-front-face"
          style={{ "--col": color, "--col-dark": colorDark }}
        >
          {coverRot < 88 && (
            <div className="folder-front-label">
              {label}
              {sub && <small>{sub}</small>}
              {showStamp && <div className="stamp">CONFIDENTIAL</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TocPage() {
  return (
    <div className="folder-page">
      <div className="folder-page-title">Pop Culture · Final Project</div>
      <div className="folder-page-sub">— Table of Contents —</div>
      <div className="toc-list">
        <div className="row">
          <span className="num">I.</span>
          <span>Film</span>
          <span className="dots" />
          <span>p. 04</span>
        </div>
        <div className="row">
          <span className="num">II.</span>
          <span>Music</span>
          <span className="dots" />
          <span>p. 14</span>
        </div>
        <div className="row">
          <span className="num">III.</span>
          <span>Comics</span>
          <span className="dots" />
          <span>p. 22</span>
        </div>
        <div className="row">
          <span className="num">IV.</span>
          <span>Reflections</span>
          <span className="dots" />
          <span>p. 31</span>
        </div>
      </div>
    </div>
  );
}

export function SectionPage({ title, subtitle }) {
  return (
    <div className="folder-page">
      <div className="folder-page-title">{title}</div>
      <div className="folder-page-sub">{subtitle}</div>
    </div>
  );
}

export function Sheet({ header, stamp, lines = [], placeholder }) {
  return (
    <div className="sheet">
      <div className="sheet-pin" />
      <div className="sheet-header">{header}</div>
      {stamp && <div className="sheet-stamp">{stamp}</div>}
      <div className="sheet-body">
        {lines.map((w, i) => (
          <div key={i} className="line" style={{ "--w": w }} />
        ))}
        {placeholder && <div className="placeholder-block">{placeholder}</div>}
      </div>
    </div>
  );
}

export function FilmReel() {
  return (
    <div className="film-reel">
      <svg viewBox="-100 -100 200 200" className="film-reel-svg">
        <defs>
          <radialGradient id="reelBody" cx="35%" cy="28%">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          <radialGradient id="reelHub" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#a0a0a0" />
            <stop offset="60%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
        </defs>
        <circle cx="0" cy="0" r="98" fill="url(#reelBody)" />
        <circle cx="0" cy="0" r="92" fill="none" stroke="#0a0a0a" strokeWidth="2" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path
              d="M 0 -78 Q 22 -50 22 -28 L -22 -28 Q -22 -50 0 -78 Z"
              fill="#0a0a0a"
              stroke="#2a2a2a"
              strokeWidth="1.5"
            />
          </g>
        ))}
        <circle cx="0" cy="0" r="22" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="18" fill="url(#reelHub)" />
        <circle cx="0" cy="0" r="5" fill="#050505" />
      </svg>
    </div>
  );
}

export function Record() {
  return (
    <div className="record">
      <div className="record-sheen" />
    </div>
  );
}

export function Comic({ title, issue = "#01", price = "10¢", colors }) {
  const c = colors || {};
  return (
    <div
      className="comic"
      style={{
        "--cc1": c.bg || "#ffd23f",
        "--cc2": c.bg2 || "#f15a29",
        "--cc3": c.bar || "#0a4cad",
        "--cc4": c.bar2 || "#062f6d",
        "--cc5": c.art || "#fff7d0",
        "--cc6": c.art2 || "#f4c041",
      }}
    >
      <div className="comic-title">{title}</div>
      <div className="comic-issue">{issue}</div>
      <div className="comic-price">{price}</div>
    </div>
  );
}
