<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <span class="header bold">Wallet Summary</span>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Basic Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Wallet Name: </span>
        <span>{{ walletInfo.walletName }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Wallet Type</span>
        <span>{{ walletInfo.walletType }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Product Type</span>
        <span>{{ walletInfo.productType }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Negative Allowed</span>
        <span v-if="walletInfo">{{
          walletInfo.allowedNegative ? "Allowed" : "Not Allowed"
        }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Capacity & Threshold</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Capacity: </span>
        <span>{{ walletInfo.capacity }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Capacity Unit: </span>
        <span>{{ walletInfo.capacityUnit }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Threshold Type: </span>
        <span>{{ walletInfo.thresholdType }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Threshold Value: </span>
        <span>{{ walletInfo.thresholdValue }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Asset & User Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Category: </span>
        <span>{{ walletInfo.categoryName }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Name: </span>
        <span>{{ walletInfo.assetName }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">User: </span>
        <span>{{ walletInfo.fullName }}</span>
      </div>
    </div>
    <SButton v-if="!stateDisable" :title="'Submit'" @click="clickSubmit" />
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {};
  },
  props: {
    walletInfo: {
      type: Object,
    },
    stateDisable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickSubmit() {
      this.$emit("submit-clicked");
    },
  },
};
</script>

<style lang="scss" scoped></style>
