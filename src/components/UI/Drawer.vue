<template lang="html">
  <aside class="mdc-drawer mdc-drawer--temporary mdc-typography">
      <nav class="mdc-drawer__drawer">
        <header class="mdc-drawer__header">
          <div class="mdc-drawer__header-content mdc-theme--text-primary-on-primary mdc-theme--primary-bg">
            My Shitty Music
          </div>
        </header>
        <div class="">
          <div id="icon-with-text-demo" class="mdc-list">
            <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/" exact>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings_input_component</i>Home
            </router-link>
            <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/songs" exact>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings_input_component</i>Songs
            </router-link>
            <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/add-song" exact>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings_input_component</i>Add a Song
            </router-link>
            <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/coupons" exact>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings_input_component</i>Offers
            </router-link>
            <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/create-coupon" exact>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings_input_component</i>Create Offer
            </router-link>
            <router-link class="mdc-list-item" active-class="mdc-list-item--selected" tag="a" to="/generate-coupons" exact>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings_input_component</i>Generate Coupons
            </router-link>
          </div>

          <hr class="mdc-list-divider">

          <div class="mdc-list">
            <a class="mdc-list-item demo-drawer-list-item" href="#">
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">email</i>All Mail
            </a>
            <a class="mdc-list-item demo-drawer-list-item" href="#">
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">delete</i>Trash
            </a>
            <a class="mdc-list-item demo-drawer-list-item" href="#">
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">report</i>Spam
            </a>
          </div>

          <hr class="mdc-list-divider">
        </div>
      </nav>
  </aside>
</template>

<script>
import { mapMutations } from 'vuex'
import { MDCTemporaryDrawer } from '@material/drawer/dist/mdc.drawer';

export default {
  data() {
    return {
      drawer: undefined
    }
  },
  computed: {
    drawerOpen() { return this.$store.state.UI.drawerOpen },
    workingEnvironment() { return this.$store.state.environment }
  },
  watch: {
    drawerOpen(val) { this.drawer.open = val }
  },
  mounted() {
    this.drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
  },
  methods: {
    ...mapMutations({
      toggleDrawer: 'toggleDrawer'
    })
  }
}
</script>

<style lang="scss">

</style>
