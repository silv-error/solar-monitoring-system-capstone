import { create } from 'zustand'

const useStore = create((set) => ({
  isModalShown: true,
  setIsModalShown: (value: boolean) => set({ isModalShown: value }),
  solarStatus: '',
  setSolarStatus: (status: string) => set({ solarStatus: status }),
}))

export default useStore