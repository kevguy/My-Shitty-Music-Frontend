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



      <!-- Title -->
      <div class="mdc-text-field">
        <input
          type="text"
          class="mdc-text-field__input"
          id="send-announcement--title"
          v-model="title"
        >
        <label
          for="send-announcement--title"
          class="mdc-floating-label">Title</label>
      </div>

      <!-- Notification -->
      <div class="mdc-text-field mdc-text-field--textarea">
        <textarea id="send-announcement--notification" class="mdc-text-field__input" rows="4" cols="40" autocomplete="off" v-model="notification"></textarea>
        <label for="send-announcement--notification" class="mdc-floating-label">Notification</label>
      </div>

      <hr class="mdc-card__divider">
      <!-- Upload Image -->
      <h4>Upload Image</h4>
      <div class="send-announcement--image-form">
        <div class="mdc-text-field mdc-text-field--disabled">
          <input
            type="text"
            class="mdc-text-field__input"
            id="upload-image-file-name"
            aria-controls="my-text-field-helper-text"
            autocomplete="off"
            v-bind:value="fileName">
          <!-- <label for="upload-image-file-name" class="mdc-floating-label">File name:</label> -->
          <div class="mdc-line-ripple" style="transform-origin: 78px center"></div>
        </div>
        <label class="mdc-button mdc-card__action mdc-card__action--button">
          Browse
          <input type="file" style="display: none;"  v-on:change="uploadImage">
        </label>
        <button
          class="mdc-button mdc-button--raised mdc-ripple-upgraded"
          v-bind:disabled="disableUploadBtn"
          v-on:click="sendImage()">{{imageText}}</button>
      </div>
      <hr class="mdc-card__divider">
      <!-- Body -->
      <div class="">
        <h4>Body</h4>
        <div v-for="(item, idx) in body" v-if="item.type==='text'" v-bind:key="idx">
          <div class="mdc-card" v-if="item.type==='hyperlink'">
            <div class="card-content">
              <div class="mdc-text-field">
                <input
                  type="text"
                  class="mdc-text-field__input"
                  v-bind:id="'send-announcement--body-hyperlink' + idx"
                  v-model="item.content"
                >
                <label
                  v-bind:for="'send-announcement--body-hyperlink' + idx"
                  class="mdc-floating-label">Hyperlink</label>
              </div>
            </div>
          </div>
          <div class="mdc-card" v-else-if="item.type==='text'">
            <div class="card-content">
              <div class="mdc-text-field">
                <input
                  type="text"
                  class="mdc-text-field__input"
                  v-bind:id="'send-announcement--body-heading' + idx"
                  v-model="item.heading"
                >
                <label
                  v-bind:for="'send-announcement--body-heading' + idx"
                  class="mdc-floating-label">Heading</label>
              </div>
              <div class="mdc-text-field mdc-text-field--textarea">
                <textarea v-bind:id="'send-announcement--body-content' + idx" class="mdc-text-field__input" rows="4" cols="40" autocomplete="off" v-model="item.content"></textarea>
                <label v-bind:for="'send-announcement--body-content' + idx" class="mdc-floating-label">Content</label>
              </div>
            </div>
            <div class="mdc-card__actions">
              <div class="mdc-card__action-buttons">
                <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="deleteText(idx)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons for adding new texts -->
      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="addText()">Add Text</button>
          <!-- <button class="mdc-button mdc-card__action mdc-card__action--button">Add Image</button> -->
        </div>
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="addLink()">Add Hyperlink</button>
          <!-- <button class="mdc-button mdc-card__action mdc-card__action--button">Add Image</button> -->
        </div>
      </div>
      <hr class="mdc-card__divider">
      <!-- Terms and Conditions -->
      <div class="mdc-text-field mdc-text-field--textarea">
        <textarea id="send-announcement--toc" class="mdc-text-field__input" rows="4" cols="40" autocomplete="off" v-model="toc"></textarea>
        <label for="send-announcement--toc" class="mdc-floating-label">Terms and Conditions</label>
      </div>

      <hr class="mdc-card__divider">
      <!-- Language Preference -->
      <div class="demo-radio-row">
        <h4>Language:</h4>
        <div class="mdc-form-field">
          <div class="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;">
            <input class="mdc-radio__native-control" type="radio" id="send-announcement-chin-radio" checked="" name="lang-pref" v-model="lang" v-bind:value="'ZH-HK'">
            <div class="mdc-radio__background">
              <div class="mdc-radio__outer-circle"></div>
              <div class="mdc-radio__inner-circle"></div>
            </div>
          </div>
          <label id="send-announcement-chin-label" for="send-announcement-chin-radio">Chinese</label>
        </div>
        <div class="mdc-form-field">
          <div class="mdc-radio mdc-ripple-upgraded mdc-ripple-upgraded--unbounded" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;">
            <input class="mdc-radio__native-control" type="radio" id="send-announcement-eng-radio" name="lang-pref" v-model="lang" v-bind:value="'EN-US'">
            <div class="mdc-radio__background">
              <div class="mdc-radio__outer-circle"></div>
              <div class="mdc-radio__inner-circle"></div>
            </div>
          </div>
          <label id="send-announcement-eng-label" for="send-announcement-eng-radio">English</label>
        </div>
      </div>
      <hr class="mdc-card__divider">
      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button" v-on:click="sendRequest()">Send</button>
        </div>
      </div>
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
    addLink() {
      this.body.push({
        type: "hyperlink",
        content: ""
      })
      Vue.nextTick(() => {
        this.mountHandler()
      })
    },
    addText() {
      this.body.push({
        type: "text",
        heading: "",
        content: ""
      })
      Vue.nextTick(() => {
        this.mountHandler()
      })
    },
    deleteText(idx) {
      this.body.splice(idx, 1)
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
        const res = await fetch('http://localhost:3000/songs', {
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
      } catch (e) {
        this.loading = false
        this.result = 'Failure'
        console.log(`Can't upload song`)
        console.error(e)
      }
    },
    async uploadImage(e) {
      const files = e.target.files || e.dataTransfer.files
      this.fileInput = files[0];
      // if (this.fileInput.type !== 'text/csv') {
      //   this.result = `Please Upload another file that is a CSV file.`;
      //   this.fileCheck = false;
      // } else {
      //   this.fileCheck = true;
      //   this.result = ``;
      // }
      this.fileName = this.fileInput.name || "No File Input"
      if (this.fileInput.name) {
        this.disableUploadBtn = false
        await this.sendImage()
      } else {
        this.disableUploadBtn = true
      }
    },
    async sendImage() {
      // this.loading = true;
      const formData = new FormData();
      formData.append('name', 'hihi');
      formData.append('file', this.fileInput);
      console.info(formData);
      // const res = await fetch(`/files/save-file`, {
      const res = await fetch(`/api/image/upload`, {
        method: 'POST',
        headers: {
          // 'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          // 'x-access-token': this.accessToken
        },
        body: formData
      });

      const data = await res.json();
      console.log(data);

      this.loading = false;

      if (data.status === 'Success') {
        this.imageText = `Uploaded`;
        this.body[0].imageId = data.fileHandle
      } else {
        this.imageText = `Failed`;
      }

      // if (data.status === 'FAILED' || data.status === 'failure') {
      //   if (data.message !== undefined) {
      //     this.result = `Failure: ${data.message}`;
      //   } else {
      //     this.result = `Failure: ${data.description}`;
      //   }
      // } else {
      //   this.result = `Success: ${data.description}`;
      // }
    },
    mountHandler() {
      const textFields = document.querySelectorAll('.mdc-text-field');
      for (let i = 0; i < textFields.length; i++) {
        this.textFields.push(new MDCTextField(textFields[i]))
      }
      const radio = new MDCRadio(document.querySelector('.mdc-radio'));
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
