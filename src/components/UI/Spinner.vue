<template>
  <transition>
    <svg class="spinner" :class="{ show: show }" v-show="show" width="44px" height="44px" viewBox="0 0 44 44">
      <circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="22" cy="22" r="20"></circle>
    </svg>
  </transition>
</template>

<script>
export default {
  name: 'spinner',
  props: ['show'],
  serverCacheKey: props => props.show
};
</script>

<style lang="scss">
.spinner {
  transition: opacity 0.15s ease;
  animation: rotator 1.4s linear infinite;
  animation-play-state: paused;
  &.show {
    animation-play-state: running;
  }
  &.v-enter, &.v-leave-active {
    opacity: 0;
  }
  &.v-enter-active, &.v-leave {
    opacity: 1;
  }
  .path {
    stroke: #f60;
    stroke-dasharray: 126;
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: dash 1.4s ease-in-out infinite;
  }
}

@-moz-keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }

  100% {
    transform: scale(0.5) rotate(270deg);
  }
}


@-webkit-keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }

  100% {
    transform: scale(0.5) rotate(270deg);
  }
}


@-o-keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }

  100% {
    transform: scale(0.5) rotate(270deg);
  }
}


@keyframes rotator {
  0% {
    transform: scale(0.5) rotate(0deg);
  }

  100% {
    transform: scale(0.5) rotate(270deg);
  }
}


@-moz-keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }

  50% {
    stroke-dashoffset: 63;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 126;
    transform: rotate(450deg);
  }
}


@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }

  50% {
    stroke-dashoffset: 63;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 126;
    transform: rotate(450deg);
  }
}


@-o-keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }

  50% {
    stroke-dashoffset: 63;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 126;
    transform: rotate(450deg);
  }
}


@keyframes dash {
  0% {
    stroke-dashoffset: 126;
  }

  50% {
    stroke-dashoffset: 63;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 126;
    transform: rotate(450deg);
  }
}
// <style lang="stylus">
// $offset = 126
// $duration = 1.4s
//
// .spinner
//   transition opacity .15s ease
//   animation rotator $duration linear infinite
//   animation-play-state paused
//   &.show
//     animation-play-state running
//   &.v-enter, &.v-leave-active
//     opacity 0
//   &.v-enter-active, &.v-leave
//     opacity 1
//
// @keyframes rotator
//   0%
//     transform scale(0.5) rotate(0deg)
//   100%
//     transform scale(0.5) rotate(270deg)
//
// .spinner .path
//   stroke #ff6600
//   stroke-dasharray $offset
//   stroke-dashoffset 0
//   transform-origin center
//   animation dash $duration ease-in-out infinite
//
// @keyframes dash
//   0%
//     stroke-dashoffset $offset
//   50%
//     stroke-dashoffset ($offset/2)
//     transform rotate(135deg)
//   100%
//     stroke-dashoffset $offset
//     transform rotate(450deg)
</style>
