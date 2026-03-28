import { create } from 'zustand';

interface UploadUiStore {
  isMinimized: boolean;
  setIsMinimized: (isMinimized: boolean) => void;
}

export const useUploadUiStore = create<UploadUiStore>((set) => ({
  isMinimized: false,
  setIsMinimized: (isMinimized) => set({ isMinimized })
}));
