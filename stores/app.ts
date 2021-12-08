import isBoolean from 'lodash/isBoolean'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    menuOpen: false,
    modalOpen: false
  }),

  actions: {
    toggleMenu(force: boolean | null = null) {
      if (isBoolean(force)) {
        this.menuOpen = force
      }
      else {
        this.menuOpen = !this.menuOpen
      }
    },
    toggleModal(force: boolean | null = null) {
      if (isBoolean(force)) {
        this.modalOpen = force
      }
      else {
        this.modalOpen = !this.modalOpen
      }
    }
  }
})