import isBoolean from 'lodash/isBoolean'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    menuOpen: false
  }),

  actions: {
    toggleMenu(force: boolean | null = null) {
      if (isBoolean(force)) {
        this.menuOpen = force
      }
      else {
        this.menuOpen = !this.menuOpen
      }
    }
  }
})