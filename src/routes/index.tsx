import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Home });

function scriptBase() {
  const path = window.location.pathname;
  const at = path.indexOf("/play/");
  const prefix = at >= 0 ? path.slice(0, at + "/play/".length) : (path.endsWith("/") ? path : path.replace(/[^/]*$/, "")) + "play/";
  return new URL(prefix, window.location.origin);
}

function Home() {
  useEffect(() => {
    const root = document.getElementById("game");
    const w = window as Window & { __dottieBooted?: boolean; __dottieStart?: () => void };
    if (!root || root.querySelector("canvas")) return;
    if (w.__dottieBooted && w.__dottieStart) {
      w.__dottieStart();
      return;
    }
    w.__dottieBooted = true;
    const base = scriptBase();
    const load = (file: string) =>
      new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = new URL(file + "?v=4", base).href;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(file));
        document.body.appendChild(s);
      });
    load("phaser.min.js")
      .then(() => load("bundle.js"))
      .catch(() => {
        root.textContent = "The reels did not load. Refresh the preview.";
      });
  }, []);

  return (
    <main className="game-shell">
      <div id="game" />
    </main>
  );
}
