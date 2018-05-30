<template lang="html">
  <Card
    card-id="add-new-song"
    title="Add New Song"
    subtitle="Fill in this form to add a new song"
    v-bind:loading="loading"
    v-bind:resultAvailable="result"
  >
    <div class="" slot="content">
      <!-- Name -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="add-song--name"
          v-model="name"
        >
        <label
          for="add-song--name"
          class="mdc-floating-label">Name</label>
      </div>
      <!-- Artist -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="add-song--artist"
          v-model="artist"
        >
        <label
          for="add-song--artist"
          class="mdc-floating-label">Artist</label>
      </div>
      <!-- Country -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="add-song--country"
          v-model="country"
        >
        <label
          for="add-song--country"
          class="mdc-floating-label">Country</label>
      </div>
      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="searchYouTube()">Search</button>
        </div>
      </div>

      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="sendRequest()">Send</button>
        </div>
      </div>

      <hr class="mdc-card__divider">

      <ul class="mdc-list demo-list mdc-list--two-line mdc-list--avatar-list">
        <li class="mdc-list-item mdc-ripple-upgraded" v-for="item in youtubeResults">
          <!-- <span class="mdc-list-item__graphic material-icons" aria-hidden="true">folder</span> -->
          <span
            v-bind:style="{ backgroundImage: `url(${item.snippet.thumbnails.medium.url})`}"
            class="mdc-list-item__graphic mdc-card__media mdc-card__media--square demo-card__media demo-card__media--music">
          </span>
          <span class="mdc-list-item__text">
            {{item.snippet.title}}
            <span class="mdc-list-item__secondary-text">{{item.snippet.publishedAt}}</span>
          </span>
          <!-- <span class="mdc-list-item__meta material-icons" aria-hidden="true">
            info
          </span> -->
          <span class="mdc-list-item__meta mdc-form-field">
            <div class="mdc-radio">
              <input class="mdc-radio__native-control"
                type="radio"
                v-bind:id="item.id.videoId"
                name="radios"
                v-model="selectedYTVideo"
                v-bind:value="item">
              <div class="mdc-radio__background">
                <div class="mdc-radio__outer-circle"></div>
                <div class="mdc-radio__inner-circle"></div>
              </div>
            </div>
            <label v-bind:for="item.id.videoId">Radio 1</label>
          </span>
        </li>
      </ul>
    </div>
    <div class="" slot="result">
      {{result}}
    </div>
  </Card>
</template>

<script>
import Vue from 'vue'
import Card from './UI/Card.vue'
import Spinner from './UI/Spinner.vue'
import { MDCTextField } from '@material/textfield'
import { MDCRadio } from '@material/radio'

export default {
  components: { Card, Spinner },
  data() {
    return {
      name: '',
      artist: '',
      country: '',

      date: '',

      youtubeResults: [],
      selectedYTVideo: undefined,

      // for uploading images
      imageText: 'Upload',
      fileInput: null,
      fileName: "No File Input",
      disableUploadBtn: true,

      loading: false,
      result: "",
      textFields: [],
      title: "",
      notification: "",
      toc: "",
      lang: "ZH-HK",
      body: [
        { type: "image", imageId: "" }
      ]
    }
  },
  mounted() {
    this.mountHandler()
  },
  beforeRouteLeave(to, from , next) {
    console.log('beforeRouteLeave')
    if (this.name || this.artist) {
      const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
      if (answer) {
        next()
      } else {
        next(false)
      }
    }
  },
  methods: {
    async searchYouTube() {
      if (!this.name && !this.artist) return
      const baseUrl = 'https://www.googleapis.com/youtube/v3/search'
      const query = `?q=${encodeURIComponent((this.name + ' ' + this.artist).trim())}`
      const config = `&maxResults=25&part=snippet&key=AIzaSyBu7tY8pSOHs7zMF1q5U6ZochLHl3dEaLc`
      const url = baseUrl + query + config
      try {
        const result = await fetch(url)
        const res = await result.json()
        this.youtubeResults = res['items']
      } catch (e) {
        console.log('YouTube search fucked up.')
        console.error(e)
      }
    },
    async sendRequest() {
      this.loading = true
      if (this.name === '' || this.artist === '' || this.country === '' || !this.selectedYTVideo) {
        alert("Make sure you have filled in everything.")
        return
      }

      const payload = {
        name: this.name,
        artist: this.artist,
        country: this.country,
        date: this.selectedYTVideo.snippet.publishedAt,
        description: this.selectedYTVideo.snippet.description,
        thumbnails: {
          small: this.selectedYTVideo.snippet.thumbnails.default.url,
          medium: this.selectedYTVideo.snippet.thumbnails.medium.url,
          large: this.selectedYTVideo.snippet.thumbnails.high.url
        },
        url: `https://www.youtube.com/watch?v=${this.selectedYTVideo.id.videoId}`,
        youtube_id: this.selectedYTVideo.id.videoId
      }

      console.log(JSON.stringify(payload))

      try {
        const res = await fetch(`${this.$store.state.baseUrl}/songs`, {
          method: 'POST',
          mode: 'cors',
          // headers: {
          //   'Accept': 'application/json',
          //   'Content-Type': 'application/json'
          // },
          body: JSON.stringify(payload)
        })

        const data = await res.json()

        this.loading = false

        console.log(data)

        this.result = 'Success'

        this.name = ""
        this.artist = ""
        this.country = ""
        this.youtubeResults = []
      } catch (e) {
        this.loading = false
        this.result = 'Failure'
        console.log(`Can't upload song`)
        console.error(e)
      }
    },
    mountHandler() {
      const textFields = document.querySelectorAll('.mdc-text-field');
      for (let i = 0; i < textFields.length; i++) {
        this.textFields.push(new MDCTextField(textFields[i]))
      }
      // const radio = new MDCRadio(document.querySelector('.mdc-radio'));
    }
  }
}
</script>

<style lang="scss">
.mdc-text-field {
  width: 100%
}

.mdc-card hr.mdc-card__divider {
  border-top: 1px solid rgba(0, 0, 0, .1);
  border-bottom: none;
  margin: 8px 0px 8px 0px;
}

.send-announcement--image-form {
  display: flex;
  flex-flow: row wrap;

  .mdc-text-field.mdc-text-field--disabled, .mdc-text-field--upgraded:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box):not(.mdc-text-field--textarea):not(.mdc-text-field--outlined) {
    max-width: 300px;
    height: 20px;
  }
}
</style>
