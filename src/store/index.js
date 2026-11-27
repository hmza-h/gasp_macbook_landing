import { create } from 'zustand';

const useMacbookStore = create((set) => ({
    color: '#2c2e2c',
    setColor: (color) => set({ color }),

    texture: null,
    setTexture: (texture) => set({texture}),

    videos: {},
    setVideos: (videos) => set({ videos }),

    scale: 0.08,
    setScale: (scale) => set({ scale }),

    reset: () => set({ color: '#2c2e2c', scale: 0.08, texture: null }),
}))

export default useMacbookStore;