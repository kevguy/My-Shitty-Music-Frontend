<template lang="html">
  <div class="mdc-card demo-card demo-card--hero">
    <div class="mdc-card__primary-action">
      <div class="mdc-card__media mdc-card__media--16-9 demo-card__media" style="background-image: url(&quot;https://material-components.github.io/material-components-web-catalog/static/media/photos/3x2/2.jpg&quot;);"></div>

      <div class="demo-card__primary">
        <h2 class="demo-card__title mdc-typography--headline6">Promo</h2>
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Message: {{offer.promo.msg}}</h3>
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Image: {{offer.promo.img}}</h3>
      </div>
      <div class="demo-card__secondary mdc-typography--body2">
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Image Description: </h3>
        {{offer.promo.img_description}}
      </div>

      <div class="demo-card__primary">
        <h2 class="demo-card__title mdc-typography--headline6">Offer</h2>
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Image: {{offer.offer.img}}</h3>
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Name: {{offer.offer.name}}</h3>
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Price: {{offer.offer.price}}</h3>
      </div>
      <div class="demo-card__secondary mdc-typography--body2">
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Details: </h3>
        {{offer.offer.details}}
      </div>
      <div class="demo-card__secondary mdc-typography--body2">
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Redemption Period: </h3>
        {{offer.offer.redemption_period}}
      </div>
      <div class="demo-card__secondary mdc-typography--body2">
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">QR / Pass Code: </h3>
        {{offer.offer.qr_pass_code}}
      </div>

      <div class="demo-card__secondary mdc-typography--body2">
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Redemption Center Details: </h3>
          <div class="" v-for="detail in offer.offer.redemption_center_details">
            <span style="white-space: pre;">{{detail}}</span><br><br>
          </div>
      </div>

      <div class="demo-card__primary">
        <h2 class="demo-card__title mdc-typography--headline6">Backend</h2>
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">No Of Quora: {{offer.backend.no_of_quota}}</h3>
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Offer Price: {{offer.backend.offer_price}}</h3>
      </div>
      <div class="demo-card__secondary mdc-typography--body2">
        <h3 class="demo-card__subtitle mdc-typography--subtitle2">Offer Start to End Dates: </h3>
        {{offer.backend.offer_start_date}} - {{offer.backend.offer_end_date}}
      </div>
    </div>
    <!-- <div class="mdc-card__actions">
      <div class="mdc-card__action-buttons">
        <button class="mdc-button mdc-card__action">Read</button>
        <button class="mdc-button mdc-card__action">Bookmark</button>
      </div>
      <div class="mdc-card__action-icons">
        <i class="mdc-icon-toggle material-icons mdc-card__action mdc-card__action--icon" title="Add to favorites">favorite_border</i>
        <i class="material-icons mdc-ripple-surface mdc-card__action mdc-card__action--icon">share</i>
        <i class="material-icons mdc-ripple-surface mdc-card__action mdc-card__action--icon">more_vert</i>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  props: [ "offer" ],
}
</script>

<style lang="scss" scoped>
.demo-card {
  // width: 350px;
  margin: 48px 0; }

.demo-card--hero {
  margin: 48px; }

.demo-card__primary {
  padding: 1rem; }

.demo-card__title {
  margin: 0; }

.demo-card__subtitle {
  color: rgba(0, 0, 0, 0.54);
  /* @alternate */
  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54));
  margin: 0; }

.demo-card__secondary {
  color: rgba(0, 0, 0, 0.54);
  /* @alternate */
  color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54));
  padding: 0 1rem 8px 1rem; }
</style>
