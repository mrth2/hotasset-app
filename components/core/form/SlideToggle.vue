<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    manualShow: {
      type: Boolean,
      default: false
    },
    isAbsolute: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    hide() {
      this.isShow = false
    },
    show() {
      this.isShow = true
    },
    toggle() {
      this.isShow = !this.isShow
    }
  }
})
</script>

<template>
  <div class="select-none">
    <slot name="trigger" :toggle="toggle" />
    <transition name="slide">
      <div v-show="isShow || manualShow" class="slide-content" :class="{absolute: isAbsolute}">
        <slot name="content" :hide="hide" :show="show" :toggle="toggle" />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
.slide-content {
  @apply z-10;

  ::v-deep .btn-dropdown-options {
    @apply static;
  }
}
.slide-enter-active {
  @apply transition-transform duration-300 ease-in-out;
}

.slide-leave-active {
  @apply transition-transform ease-in;
}

.slide-enter-to,
.slide-leave {
  transform: translateY(0);
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-20%);
}
</style>