<template lang="html">
  <div class="songs-view">
    <MusicSmallCard
      v-for="song in songs"
      v-bind:song-id="song.id"
      v-bind:youtube-id="song.youtube_id"
      v-bind:title="song.name"
      v-bind:artist="song.artist"
      v-bind:timestamp="song.date"
      v-bind:url="song.thumbnails.medium"
      v-bind:upvotes="song.upvotes"
      v-bind:plays="song.plays"
      v-bind:isHeart="song.isHeart"
      v-bind:key="song.id"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MusicSmallCard from '@/components/UI/MusicSmallCard.vue'

export default {
  components: { MusicSmallCard },
  data() {
    return {
      // songs: [
      //   {
      //     "id": "5b03ec87d531530bf0458872",
      //     "name": "Starlight",
      //     "artist": "Anna Ritsmar",
      //     "country": "Denmark",
      //     "date": "2018-02-10T19:52:15.000Z",
      //     "description": "Følg os på YouTube for at få de nyeste videoer fra og om Dansk Melodi Grand Prix og Eurovision Song Contest 2018. Find meget mere på ...",
      //     "thumbnails": {
      //         "small": "https://i.ytimg.com/vi/5a_u1et37W4/default.jpg",
      //         "medium": "https://i.ytimg.com/vi/5a_u1et37W4/mqdefault.jpg",
      //         "large": "https://i.ytimg.com/vi/5a_u1et37W4/hqdefault.jpg"
      //     },
      //     "url": "https://www.youtube.com/watch?v=5a_u1et37W4",
      //     "youtube_id": "5a_u1et37W4",
      //     "upvotes": 0,
      //     "plays": 0,
      //   }
      // ]
    }
  },
  computed: {
    ...mapState({
      songs: state => state.songs
    })
  },
  watch: {
  },
  created() {
    // this.$store.dispatch('FETCH_SONGS')
    //   .then(() => {
    //     this.$store.dispatch('FETCH_PLAYS')
    //     if (this.$store.state.isLogin) {
    //       this.$store.dispatch('FETCH_USER_UPVOTES')
    //     }
    //   })
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.songs-view {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}

</style>
