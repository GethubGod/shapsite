import React from "react";
import { easeOut, easeInOutCubic, segment, lerp, pickAnchors } from "./helpers.js";
import { FilmReel, Record, Comic, Sheet } from "./folders.jsx";

export const COLORS = {
  main: { c: "#d8a35c", d: "#9c6e30" },
  film: { c: "#c19057", d: "#8a5d2c" },
  music: { c: "#b88444", d: "#7e5320" },
  comics: { c: "#cc9a4f", d: "#8e6228" },
};

export const POS = {
  main: { x: 0, y: -200 },
  film: { x: -1100, y: -150 },
  music: { x: 1100, y: -150 },
  comics: { x: 0, y: 600 },
};

export function buildFilmItems() {
  return [
    { key: "reel1", x: -340, y: -110, rot: -12, scale: 1.0, z: 30, comp: <FilmReel /> },
    { key: "reel2", x: 320, y: -140, rot: 8, scale: 0.85, z: 26, comp: <FilmReel /> },
    { key: "reel3", x: 260, y: 150, rot: -22, scale: 0.7, z: 22, comp: <FilmReel /> },
    {
      key: "sh1", x: -120, y: 60, rot: -6, scale: 1.0, z: 18,
      comp: <Sheet header="FILM · NOTE 01" stamp="DRAFT" lines={["80%", "92%", "70%", "85%"]} placeholder="STILL // TBD" />,
    },
    {
      key: "sh2", x: 60, y: 110, rot: 9, scale: 0.95, z: 14,
      comp: <Sheet header="FILM · NOTE 02" lines={["95%", "60%", "82%"]} placeholder="SHOT LIST // TBD" />,
    },
    {
      key: "sh3", x: -260, y: 180, rot: -16, scale: 0.9, z: 10,
      comp: <Sheet header="FILM · NOTE 03" stamp="REVIEW" lines={["88%", "75%", "92%", "55%"]} placeholder="ANALYSIS // TBD" />,
    },
  ];
}

export function buildMusicItems() {
  return [
    { key: "rec1", x: -320, y: -100, rot: 0, scale: 1.0, z: 30, comp: <Record /> },
    { key: "rec2", x: 280, y: -110, rot: 0, scale: 0.85, z: 26, comp: <Record /> },
    { key: "rec3", x: -90, y: 170, rot: 0, scale: 0.75, z: 22, comp: <Record /> },
    {
      key: "sh1", x: 200, y: 110, rot: 8, scale: 0.95, z: 18,
      comp: <Sheet header="MUSIC · NOTE 01" stamp="DRAFT" lines={["90%", "60%", "82%", "70%"]} placeholder="SETLIST // TBD" />,
    },
    {
      key: "sh2", x: 0, y: 0, rot: -7, scale: 1, z: 14,
      comp: <Sheet header="MUSIC · NOTE 02" lines={["88%", "75%", "92%"]} placeholder="LINER NOTES // TBD" />,
    },
    {
      key: "sh3", x: -240, y: 180, rot: -14, scale: 0.9, z: 10,
      comp: <Sheet header="MUSIC · NOTE 03" lines={["85%", "65%", "80%", "50%"]} placeholder="LYRIC // TBD" />,
    },
  ];
}

export function buildComicsItems() {
  return [
    {
      key: "c1", x: -300, y: -80, rot: -14, scale: 0.95, z: 30,
      comp: (
        <Comic title="ZENITH" issue="#01" price="10¢"
          colors={{ bg: "#ffd23f", bg2: "#f15a29", bar: "#0a4cad", bar2: "#062f6d", art: "#fff7d0", art2: "#f4c041" }} />
      ),
    },
    {
      key: "c2", x: 60, y: -110, rot: 6, scale: 1.0, z: 26,
      comp: (
        <Comic title="THE ECHO" issue="#04" price="12¢"
          colors={{ bg: "#d8345f", bg2: "#7a1a36", bar: "#f8d33a", bar2: "#a37f12", art: "#fff", art2: "#fda6c0" }} />
      ),
    },
    {
      key: "c3", x: 280, y: 70, rot: 14, scale: 0.82, z: 22,
      comp: (
        <Comic title="NIGHT-OUT" issue="#11" price="15¢"
          colors={{ bg: "#3a8f5a", bg2: "#1a4429", bar: "#f1a124", bar2: "#7c4f0e", art: "#dff8e2", art2: "#7ac792" }} />
      ),
    },
    {
      key: "sh1", x: -120, y: 170, rot: -8, scale: 0.9, z: 16,
      comp: <Sheet header="COMICS · NOTE 01" stamp="DRAFT" lines={["88%", "62%", "82%"]} placeholder="PANEL ANALYSIS // TBD" />,
    },
    {
      key: "sh2", x: 180, y: 200, rot: 12, scale: 0.88, z: 12,
      comp: <Sheet header="COMICS · NOTE 02" lines={["90%", "70%", "85%", "60%"]} placeholder="HERO ARC // TBD" />,
    },
  ];
}

const CAM_ANCHORS = [
  { at: 0.0, x: 0, y: -120, scale: 1.0 },
  { at: 0.06, x: 0, y: -120, scale: 1.0 },
  { at: 0.2, x: 0, y: -180, scale: 0.78 },
  { at: 0.34, x: -1100, y: -120, scale: 1.05 },
  { at: 0.54, x: 1100, y: -120, scale: 1.05 },
  { at: 0.72, x: 0, y: 380, scale: 0.92 },
  { at: 0.86, x: 0, y: 80, scale: 0.42 },
  { at: 1.0, x: 0, y: -220, scale: 1.1 },
];

export function getCameraState(p) {
  return {
    x: pickAnchors(p, CAM_ANCHORS, "x"),
    y: pickAnchors(p, CAM_ANCHORS, "y"),
    scale: pickAnchors(p, CAM_ANCHORS, "scale"),
  };
}

export function folderOpenness(id, p) {
  switch (id) {
    case "main":
      return easeOut(segment(p, 0.07, 0.18));
    case "film":
      return easeOut(segment(p, 0.24, 0.36));
    case "music":
      return easeOut(segment(p, 0.44, 0.56));
    case "comics":
      return easeOut(segment(p, 0.62, 0.74));
    default:
      return 0;
  }
}

export function sideOffset(id, p) {
  const slide = easeInOutCubic(segment(p, 0.09, 0.22));
  switch (id) {
    case "film":
      return { dx: lerp(-2800, 0, slide), dy: 0 };
    case "music":
      return { dx: lerp(2800, 0, slide), dy: 0 };
    case "comics":
      return { dx: 0, dy: lerp(2400, 0, slide) };
    default:
      return { dx: 0, dy: 0 };
  }
}

export function creditsVisibility(p) {
  return easeOut(segment(p, 0.8, 0.9));
}
