import { useEffect, useRef, useState } from "react";
// @ts-ignore
import Lenis from "lenis";
// @ts-ignore
import useAgentStore from "./stores/useAgentStore";
// @ts-ignore
import SelectionHub from "./views/SelectionHub";
// @ts-ignore
import ProfilePage from "./views/ProfilePage";
import "./styles/globals.css";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function App() {
  const activeView = useAgentStore((s: any) => s.activeView);
  const isMobile   = useIsMobile();
  const lenisRef   = useRef<any>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    let lenis: any;
    let rafId: number;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      const animate = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    } catch (e) {
      console.warn("Lenis init failed:", e);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--color-void)",
        overflowX: "hidden",
      }}
    >
      {/* Tactical scan line */}
      <div className="scan-line" />

      {/* View router with key-based remount for clean transitions */}
      <div key={activeView}>
        {activeView === "selection" ? (
          <SelectionHub isMobile={isMobile} />
        ) : (
          <ProfilePage isMobile={isMobile} />
        )}
      </div>
    </div>
  );
}
