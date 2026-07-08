import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useAgentStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    activeAgentIndex: 0,
    activeView: "selection", // 'selection' | 'profile'
    isTransitioning: false,
    scrollProgress: 0,
    hoveredAgentIndex: null,

    // Actions
    setActiveAgentIndex: (index) => set({ activeAgentIndex: index }),

    setHoveredAgentIndex: (index) => set({ hoveredAgentIndex: index }),

    navigateToProfile: (index) => {
      const { isTransitioning } = get();
      if (isTransitioning) return;
      set({ activeAgentIndex: index, isTransitioning: true });
      setTimeout(() => {
        set({ activeView: "profile", isTransitioning: false });
      }, 600);
    },

    navigateToSelection: () => {
      const { isTransitioning } = get();
      if (isTransitioning) return;
      set({ isTransitioning: true });
      setTimeout(() => {
        set({ activeView: "selection", isTransitioning: false });
      }, 600);
    },

    setScrollProgress: (progress) => set({ scrollProgress: progress }),

    setIsTransitioning: (val) => set({ isTransitioning: val }),
  }))
);

export default useAgentStore;
