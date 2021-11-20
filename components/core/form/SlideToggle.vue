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
  computed: {
    slideOptions(): { miliseconds: number, transitionFunction: string } {
      return {
        miliseconds: this.miliseconds,
        transitionFunction: this.transition
      }
    }
  },
  methods: {
    hide() {
      hide((this.$refs.toggleContent as HTMLElement), this.slideOptions)
    },
    show() {
      show((this.$refs.toggleContent as HTMLElement), this.slideOptions)
    },
    toggle() {
      toggle((this.$refs.toggleContent as HTMLElement), this.slideOptions)
    }
  }
})
</script>

<template>
  <div class="user-select-none">
    <slot name="toggle" :toggle="toggle" />
    <div ref="toggleContent" class="hidden">
      <slot name="content" :hide="hide" :show="show" :toggle="toggle" />
    </div>
  </div>
</template>