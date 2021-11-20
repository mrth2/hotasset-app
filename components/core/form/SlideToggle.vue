<script lang="ts">
import Vue from 'vue'

import { hide, show, toggle } from 'slidetoggle'

export default Vue.extend({
  props: {
    miliseconds: {
      type: Number,
      default: 300
    },
    transition: {
      type: String,
      default: 'ease-out'
    }
  },
  data() {
    return {
      open: false
    }
  },
  computed: {
    slideOptions(): { miliseconds: number, transitionFunction: string } {
      return {
        miliseconds: this.miliseconds,
        transitionFunction: this.transition
      }
    }
  },
  watch: {
    open() {
      this.toggle()
    }
  },
  methods: {
    hide() {
      hide((this.$refs.dropdown as HTMLElement), this.slideOptions)
    },
    show() {
      show((this.$refs.dropdown as HTMLElement), this.slideOptions)
    },
    toggle() {
      toggle((this.$refs.dropdown as HTMLElement), this.slideOptions)
    }
  }
})
</script>

<template>
  <div class="user-select-none">
    <span
      class="btn-dropdown active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-brand"
      @click="open = !open"
    >
      <slot name="header">
        <span>Select option</span>
      </slot>
      <CoreIconCaretDown />
    </span>
    <div ref="dropdown" class="btn-dropdown-options hidden">
      <slot name="default" :hide="hide" :show="show" :toggle="toggle" />
    </div>
  </div>
</template>