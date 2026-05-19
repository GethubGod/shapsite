import React, { useEffect, useMemo, useRef, useState } from "react";
import { clamp, lerp, segment, easeOut } from "./helpers.js";
import { Table, LampPool, DeskProps, Dust } from "./assets.jsx";
import { Folder, TocPage, SectionPage } from "./folders.jsx";
import {
  COLORS,
  POS,
  buildFilmItems,
  buildMusicItems,
  buildComicsItems,
  getCameraState,
  folderOpenness,
  sideOffset,
  creditsVisibility,
} from "./scene.jsx";

const SCROLL_BUDGET = 9000;

export default function App() {
  const [progress, setProgress] = useState(0);
  const [introHidden, setIntroHidden] = useState(false);

  const accumRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(null);
  const introHiddenRef = useRef(false);

  useEffect(() => {
    const saved = parseFloat(localStorage.getItem("popcult_progress") || "0");
    if (saved > 0) {
      accumRef.current = saved * SCROLL_BUDGET;
      targetRef.current = saved * SCROLL_BUDGET;
      setProgress(saved);
      if (saved > 0.005) {
        introHiddenRef.current = true;
        setIntroHidden(true);
      }
    }

    function commit() {
      const next = lerp(accumRef.current, targetRef.current, 0.18);
      accumRef.current = next;
      const p = clamp(next / SCROLL_BUDGET, 0, 1);
      setProgress(p);
      localStorage.setItem("popcult_progress", String(p));
      if (!introHiddenRef.current && next > 30) {
        introHiddenRef.current = true;
        setIntroHidden(true);
      }
      if (Math.abs(targetRef.current - accumRef.current) > 0.4) {
        rafRef.current = requestAnimationFrame(commit);
      } else {
        rafRef.current = null;
      }
    }
    function kick() {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(commit);
      }
    }

    function onWheel(e) {
      e.preventDefault();
      targetRef.current = clamp(targetRef.current + e.deltaY, 0, SCROLL_BUDGET);
      kick();
    }

    let touchY = 0;
    function onTouchStart(e) {
      touchY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      e.preventDefault();
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      touchY = y;
      targetRef.current = clamp(targetRef.current + dy * 4, 0, SCROLL_BUDGET);
      kick();
    }

    function onKey(e) {
      let d = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") d = 600;
      else if (e.key === "ArrowUp" || e.key === "PageUp") d = -600;
      else if (e.key === "Home") {
        targetRef.current = 0;
        kick();
        return;
      } else if (e.key === "End") {
        targetRef.current = SCROLL_BUDGET;
        kick();
        return;
      }
      if (d) {
        e.preventDefault();
        targetRef.current = clamp(targetRef.current + d, 0, SCROLL_BUDGET);
        kick();
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    window.__setProgress = (p) => {
      const clamped = clamp(p, 0, 1);
      accumRef.current = clamped * SCROLL_BUDGET;
      targetRef.current = clamped * SCROLL_BUDGET;
      setProgress(clamped);
      if (clamped > 0.005 && !introHiddenRef.current) {
        introHiddenRef.current = true;
        setIntroHidden(true);
      }
    };

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    function fit() {
      const sx = window.innerWidth / 1920;
      const sy = window.innerHeight / 1080;
      const s = Math.min(sx, sy);
      document.documentElement.style.setProperty("--fit-scale", String(s));
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const cam = getCameraState(progress);
  const camTransform = `translate3d(${(-cam.x).toFixed(2)}px, ${(-cam.y).toFixed(2)}px, 0) scale(${cam.scale.toFixed(3)})`;

  const filmSlide = sideOffset("film", progress);
  const musicSlide = sideOffset("music", progress);
  const comicsSlide = sideOffset("comics", progress);

  const oMain = folderOpenness("main", progress);
  const oFilm = folderOpenness("film", progress);
  const oMusic = folderOpenness("music", progress);
  const oComics = folderOpenness("comics", progress);

  const credVis = creditsVisibility(progress);

  const introVisible = !introHidden && progress < 0.01;

  const tocPage = useMemo(() => <TocPage />, []);
  const filmPage = useMemo(
    () => <SectionPage title="I. Film" subtitle="— studies, stills & loose ends —" />,
    []
  );
  const musicPage = useMemo(
    () => <SectionPage title="II. Music" subtitle="— sides, sleeves & sleeve-notes —" />,
    []
  );
  const comicsPage = useMemo(
    () => <SectionPage title="III. Comics" subtitle="— issues, panels, pulp —" />,
    []
  );

  const filmItems = useMemo(buildFilmItems, []);
  const musicItems = useMemo(buildMusicItems, []);
  const comicsItems = useMemo(buildComicsItems, []);

  const lampOpacity = lerp(1, 0.75, segment(progress, 0.78, 0.9));
  const dustOp = easeOut(segment(progress, 0.0, 0.15));

  return (
    <>
      <div className="progress-bar" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />
      </div>
      <div className="progress-marker">
        Progress · <span className="pct">{Math.round(progress * 100)}%</span>
      </div>

      <div className="viewport">
        <div className="stage" aria-hidden="true">
          <div className="lamp-glow" style={{ opacity: lampOpacity }} />
          <div className="world" style={{ transform: camTransform }}>
            <Table />
            <div style={{ opacity: lampOpacity }}>
              <LampPool />
            </div>

            <DeskProps visibility={1} />

            <Folder
              id="main"
              label="Pop Culture"
              sub="— Final Project —"
              color={COLORS.main.c}
              colorDark={COLORS.main.d}
              openness={oMain}
              x={POS.main.x}
              y={POS.main.y}
              z={10}
              rotate={-1.5}
              scale={1}
              insidePage={tocPage}
              showStamp={true}
              items={[]}
            />

            <Folder
              id="film"
              label="Film"
              sub="— I —"
              color={COLORS.film.c}
              colorDark={COLORS.film.d}
              openness={oFilm}
              x={POS.film.x + filmSlide.dx}
              y={POS.film.y + filmSlide.dy}
              z={9}
              rotate={-3}
              scale={1}
              insidePage={filmPage}
              items={filmItems}
            />
            <Folder
              id="music"
              label="Music"
              sub="— II —"
              color={COLORS.music.c}
              colorDark={COLORS.music.d}
              openness={oMusic}
              x={POS.music.x + musicSlide.dx}
              y={POS.music.y + musicSlide.dy}
              z={9}
              rotate={3}
              scale={1}
              insidePage={musicPage}
              items={musicItems}
            />
            <Folder
              id="comics"
              label="Comics"
              sub="— III —"
              color={COLORS.comics.c}
              colorDark={COLORS.comics.d}
              openness={oComics}
              x={POS.comics.x + comicsSlide.dx}
              y={POS.comics.y + comicsSlide.dy}
              z={9}
              rotate={-2}
              scale={1}
              insidePage={comicsPage}
              items={comicsItems}
            />

            <CreditsPaper visibility={credVis} />

            <div style={{ opacity: dustOp }}>
              <Dust />
            </div>
          </div>

          <div className="vignette" />
        </div>
      </div>

      {introVisible && <Intro hidden={false} />}

      {introHidden && progress < 0.96 && (
        <div className="scroll-hint">
          Keep scrolling · {Math.round(progress * 100)}% complete
        </div>
      )}
    </>
  );
}

function CreditsPaper({ visibility }) {
  const lift = lerp(40, 90, visibility);
  const op = visibility;
  const tilt = lerp(-6, -1.5, visibility);
  const innerScale = lerp(0.55, 0.85, visibility);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate3d(${POS.main.x}px, ${POS.main.y - 30}px, ${lift}px) rotateZ(${tilt}deg) translate(-50%, -50%) scale(${innerScale})`,
        opacity: op,
        transformStyle: "preserve-3d",
        pointerEvents: "none",
      }}
    >
      <div className="credits-paper">
        <h1>Pop Culture · Final Project</h1>
        <div className="byline">A study in three folders.</div>
        <div className="credits-list">
          <div className="role">Curated by</div>
          <div>— your name here —</div>
          <div className="role">Sections</div>
          <div>I. Film</div>
          <div>II. Music</div>
          <div>III. Comics</div>
          <div className="role">Materials</div>
          <div>Reels, records, issues, & loose notes.</div>
          <div className="role">Filed</div>
          <div>Spring · 2026</div>
        </div>
        <div className="seal">
          <span>
            Final
            <br />
            Cut
          </span>
        </div>
      </div>
    </div>
  );
}

function Intro({ hidden }) {
  return (
    <div className={`intro ${hidden ? "hidden" : ""}`}>
      <div className="intro-card">
        <h1>Pop Culture · Final Project</h1>
        <div className="sub">A desk, three folders, one story.</div>
        <p>
          Use your scroll wheel or trackpad to move through the room.
          <br />
          Keep scrolling until the bar at the top is fully complete.
        </p>
        <div className="hint">
          <span className="scroll-icon" />
          <span>scroll to begin</span>
        </div>
      </div>
    </div>
  );
}
