<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <span class="header bold">Usage Summary</span>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Asset Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Category: </span>
        <span>{{ assetCategory }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Name:</span>
        <span>{{ assets.name }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Usages</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Primary Usage: </span>
        <span>{{ usages.primaryUsageValue }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Secondary Usage: </span>
        <span>{{ usages.secondaryUsageValue }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Category: </span>
        <span>{{ $title_case(usages.category) }}</span>
      </div>
            <div v-margin-top="8" class="info-row info-row-desc ">
        <span class="bold">Description: </span>
        <span>{{ $title_case(usages.description) }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Usage Time Information</span>
      <!-- <div v-margin-top="8" class="info-row">
        <span class="bold">Start Date: </span>
        <span>{{usages.startDate}}</span>
      </div> -->
      <div v-margin-top="8" class="info-row">
        <span class="bold">Start Time: </span>
        <span>{{
          usages.startTime && usages.startTime != "Invalid date"
            ? usages.startTime
            : ""
        }}</span>
      </div>
      <!-- <div v-margin-top="8" class="info-row">
        <span class="bold">End Date: </span>
        <span>{{usages.endDate}}</span>
      </div>       -->
      <div v-margin-top="8" class="info-row">
        <span class="bold">End Time: </span>
        <span>{{
          usages.stopTime && usages.stopTime != "Invalid date"
            ? usages.stopTime
            : ""
        }}</span>
      </div>
    </div>
    <SButton
      v-if=" $route.params.type != 'view'"
      :title="$route.params.type == 'edit' ? 'Update' : 'Submit'"
      @click="clickSubmit"
    />
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {};
  },
  props: {
    usages: {
      type: Object,
    },
    assets: {
      type: Object,
    },
    assetCategory: {},
  },
  methods: {
    clickSubmit() {
      this.$emit("submit");
    },
  },
};
</script>

<style lang="scss" scoped></style>
