import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    menuOpen: false
  }),

  actions: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    }
  }
})