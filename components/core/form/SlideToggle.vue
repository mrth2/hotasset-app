<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
      <div v-show="isShow" class="slide-content">
        <slot name="content" :hide="hide" :show="show" :toggle="toggle" />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
.slide-content {
  @apply absolute z-10;

  ::v-deep .btn-dropdown-options {
    @apply static;
  }
}
.slide-enter-active {
  @apply transition-transform duration-300 ease-linear;
}

.slide-leave-active {
  @apply transition-transform duration-300 ease-linear;
}

.slide-enter-to, .slide-leave {
  transform: translateY(0);
}

.slide-enter, .slide-leave-to {
  transform: translateY(-10%);
}
</style>