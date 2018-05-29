<template lang="html">
  <div class="youtube-player mdc-elevation--z24">
    <div class="uframe hidden">
      <div class="" id="youtube-player-thot">
        <iframe  frameborder="0" allowfullscreen="allowfullscreen"></iframe>
      </div>
    </div>
    <div id="youtube-player-slider" class="mdc-slider" tabindex="0" role="slider"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
       aria-label="Select Value">
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track"></div>
      </div>
      <div class="mdc-slider__thumb-container">
        <svg class="mdc-slider__thumb" width="21" height="21">
          <circle cx="10.5" cy="10.5" r="7.875"></circle>
        </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
    </div>
    <div class="youtube-player--control-panel">
      <div class="control-btns">
        <button class="mdc-fab material-icons mdc-fab--mini" aria-label="Skip Prev">
          <span class="mdc-fab__icon">
            skip_previous
          </span>
        </button>
        <button
          class="mdc-fab material-icons"
          aria-label="Play"
          v-on:click="resumeVideo()"
          v-show="playerState !== 1">
          <span class="mdc-fab__icon">
            play_arrow
          </span>
        </button>
        <button
          class="mdc-fab material-icons"
          aria-label="Pause"
          v-on:click="pauseVideo()"
          v-show="playerState === 1">
          <span class="mdc-fab__icon">
            pause
          </span>
        </button>
        <button class="mdc-fab material-icons mdc-fab--mini" aria-label="Skip Next">
          <span class="mdc-fab__icon">
            skip_next
          </span>
        </button>
      </div>
      <div class="music-info">
        <div class="demo-card__music-artist mdc-typography--headline5">{{songInfo.name}}</div>
        <div class="demo-card__music-year mdc-typography--body2">{{songInfo.artist}}</div>
        <div class="demo-card__music-year mdc-typography--body2">{{currentVideoCurrentTime || ''}}</div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import YouTubePlayer from 'youtube-player'
import { MDCSlider } from '@material/slider'
import {MDCRipple} from '@material/ripple'



export default {
  data() {
    return {
      ytPlayerStates: {
        '-1': 'unstarted',
        0: 'ended',
        1: 'playing',
        2: 'paused',
        3: 'buffering',
        5: 'video cued',
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5,
      },
      player: undefined,
      playerTimer: undefined,
      playerState: -1,
      slider: undefined
    }
  },
  computed: {
    // ...mapState('Hangout', {
    //   currentPageNo: state => state.currentPageNo,
    //   imageMap: state => state.profileImgMap,
    // }),
    // ...mapGetters({
    //   msgToShow: 'Hangout/msgToShow',
    //   numOfPages: 'Hangout/numOfPages'
    // })
    ...mapState('YouTubeMusicPlayer', {
      currentVideoId: state => state.currentVideoId,
      currentVideoDuration: state => state.currentVideoDuration,
      currentVideoCurrentTime: state => state.currentVideoCurrentTime,
      userInputState: state => state.userInputState,
      songInfo: state => state.songInfo
    })
  },
  mounted() {
    this.setupSlider()
    // const fabRipple = new MDCRipple(document.querySelector('.mdc-fab'));
  },
  watch: {
    currentVideoId(val) {
      if (this.player) {
        clearInterval(this.playerTimer)
        this.player.destroy()
          .then(() => {
            this.setupPlayer(val)
            this.setupSlider()
          })
      } else {
        this.setupPlayer(val)
        this.setupSlider()
      }
    }
  },
  methods: {
    ...mapMutations({
      updateCurrentVideoId: 'YouTubeMusicPlayer/updateCurrentVideoId',
      updateCurrentVideoDuration: 'YouTubeMusicPlayer/updateCurrentVideoDuration',
      updateCurrentVideoCurrentTime: 'YouTubeMusicPlayer/updateCurrentVideoCurrentTime',
      updateUserInputState: 'YouTubeMusicPlayer/updateUserInputState'
    }),
    setupSlider() {
      this.slider = new MDCSlider(document.querySelector('#youtube-player-slider'));
      this.slider.listen('MDCSlider:input', async () => {

        // when user drags the slide bar,
        // the value of current time of youtube video will also change.
        // As originally it's the player's value updating the slide bar's value,
        // in this case an infinite loop will happen, so I'm stopping the update
        // from the player to the slidebar when user manually drags/clicks the
        // slidebar.
        this.updateUserInputState(false)

        const targetTime = this.slider.value / 100 *  this.currentVideoDuration

        if (this.player) {
          await this.player.seekTo(targetTime)
        }

        console.log(`Player value changed to ${this.slider.value}`)
        this.updateUserInputState(true)
      });
    },
    async setupPlayer(videoId) {
      this.player = YouTubePlayer('youtube-player-thot');
      this.player.loadVideoById(videoId);
      this.player.on('stateChange', async (event) => {
        const eventData = event.data
        this.playerState = eventData
        if (eventData == this.ytPlayerStates.PLAYING) {
          const playerTotalTime = await this.player.getDuration()
          this.updateCurrentVideoDuration(playerTotalTime)

          this.playerTimer = setInterval(async () => {
            const playerCurrentTime = await this.player.getCurrentTime()
            if (playerCurrentTime !== this.currentVideoCurrentTime) {
              // this is to prevent updating the state with the same value (playerCurrentTime)
              this.updateCurrentVideoCurrentTime(playerCurrentTime)

              const playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100
              console.log(playerCurrentTime)
              // this.updateCurrentVideoCurrentTime(playerCurrentTime)

              if (this.userInputState) {
                this.setProgressBar(playerTimeDifference)
              }
            }
          }, 1000);
        }
      })
      this.player.playVideo();
    },
    setProgressBar(percent) {
      const min = 0;
      const max = 100;
      const progressBarWidth = percent * max / 100
      this.slider.value = progressBarWidth
    },
    resumeVideo() {
      if (this.player) {
        this.player.playVideo()
      }
    },
    pauseVideo() {
      if (this.player) {
        this.player.pauseVideo()
      }
    },
    // player() {
    //   var player;
    //
    //   function onYouTubePlayerAPIReady() {
    //       player = new YT.Player('video', {
    //           events: {
    //               'onReady': onPlayerReady,
    //               'onStateChange': onPlayerStateChange
    //           }
    //       });
    //   }
    //
    //   function onPlayerReady(event) {
    //       var playButton = document.getElementById("play"),
    //           pauseButton = document.getElementById("pause");
    //
    //       playButton.addEventListener("click", function() {
    //           player.playVideo();
    //       });
    //
    //       pauseButton.addEventListener("click", function() {
    //           player.pauseVideo();
    //       });
    //   }
    //
    //   function progress(percent, $element) {
    //       var progressBarWidth = percent * $element.width() / 100;
    //       $element.find('div').animate({
    //           width: progressBarWidth
    //       });
    //   }
    //
    //   function onPlayerStateChange(event) {
    //       if (event.data == YT.PlayerState.PLAYING) {
    //           var playerTotalTime = player.getDuration();
    //           var mytimer = setInterval(function() {
    //               var playerCurrentTime = player.getCurrentTime();
    //               var playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100;
    //               console.log(playerCurrentTime);
    //               progress(playerTimeDifference, $('#progressBar'));
    //           }, 1000);
    //       } else {
    //           clearTimeout(mytimer);
    //       }
    //   }
    //
    //
    //
    //   var tag = document.createElement('script');
    //   tag.src = "//www.youtube.com/player_api";
    //   var firstScriptTag = document.getElementsByTagName('script')[0];
    //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    //
    // }
  }
}
</script>

<style lang="scss" scoped>
.uframe {
  position: relative;
  height: 0;
  width: 100%;
  padding-bottom: 50%;
  padding-top: 25px;
  overflow: hidden;
  // visibility: hidden
  iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      height: 100%;
  }
  &.hidden {
    padding: 0;
  }
}



.youtube-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: whitesmoke;

  #youtube-player-thot {
    visibility: hidden;
    height: 0;
  }

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 100%;
    height: 0;
  }
  &.hidden {
    padding: 0;
  }

  .youtube-player--control-panel {
    display: flex;

    .control-btns {
      margin-top: 8px;
      margin-bottom: 8px;
      margin-left: 8px;
    }

    .music-info {
      margin-left: 8px;
      margin-bottom: 8px;
    }
  }
}

// *
//     margin: 0
//     padding: 0
//     outline: none
//     box-sizing: border-box
//
// html,
// body
//     width: 100%
//     height: 100%
// body
//     padding-top: 20%
//     background-image: linear-gradient(36deg, #c05a9c, #223971)




.container {
  width: 400px;
  margin: 0 auto;
  box-shadow: 0 0 15px 0 rgba(#000, .5);
  line-height: 0;



  outline: none;
  box-sizing: border-box;
}

// display
.display {
  position: relative;
  height: 0;
  width: 100%;
  padding-bottom: 50%;
  padding-top: 25px;
  overflow: hidden;
  // visibility: hidden;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
  }
  &.hidden {
    padding: 0;
  }
}


// footer
.footer {
  position: relative;
  background: #FFF;
    .thumb {
      position: absolute;
      top: 50%;
      left: 15px;
      width: 140px;
      transform: translateY(-50%);
    }

    // progress bar
    .bar {
      background-color: #ddd;
      width: 100%;
      padding: 0 5px 0 160px;
    }

    #progressBar {
        height: 6px;
        overflow: hidden;
        div {
          margin-top: 2px;
          height: 2px;
          width: 0;
          background-color: #2c3e50;
        }
    }

    .controls {
      display: flex;
      justify-content: flex-end;
      button {
        display: block;
        width: 50px;
        height: 50px;
        font-size: 15px;
        color: #bbb;
        background: transparent;
        border: none;
        cursor: pointer;
        &:first-child {
          border-right: 1px solid #EEE;
        }
        &:last-child {
          border-left: 1px solid #EEE;
        }
      }
    }

}
</style>
