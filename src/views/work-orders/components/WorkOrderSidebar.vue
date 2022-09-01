<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <span class="header bold">Work Order Summary</span>
      <span class="sub-header"></span>
    </div>
    <div class="sidebar-section sec-text">
      <span class="bold">Basic Details</span>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Asset Category: </span>
        <span class="sub-header">{{ workOrderSummary.category }}</span>
      </div>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Asset Name: </span>
        <span class="sub-header">{{ workOrderSummary.name }}</span>
      </div>

      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Priority: </span>
        <span class="sub-header">{{ workOrderSummary.priority }}</span>
      </div>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Shift:</span>
        <span class="sub-header">{{ workOrderSummary.shift }}</span>
      </div>

      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Schedule:</span>
        <span class="sub-header">{{ workOrderSummary.shedule }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="bold">User Assignments</span>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">User Group: </span>
        <span class="sub-header">{{ workOrderSummary.userGroup }}</span>
      </div>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">User:</span>
        <span class="sub-header">{{ workOrderSummary.user }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="bold">Issues Details</span>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Total Issue: </span>
        <span class="sub-header">{{ workOrderSummary.issues.length }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="bold">Initial Inspection</span>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Template Name: </span>
        <span
          v-if="workOrderSummary.initialInspectionTitle"
          class="sub-header"
          >{{ workOrderSummary.initialInspectionTitle }}</span
        >
        <span
          v-if="workOrderSummary.selectedInitialInspectionByAssetCategory.name"
          class="sub-header"
          >{{
            workOrderSummary.selectedInitialInspectionByAssetCategory.name
          }}</span
        >
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="bold">Final Inspection</span>
      <div v-margin-top="8" v-grid="2">
        <span class="sub-header bold">Template Name: </span>
        <span v-if="workOrderSummary.finalInspectionTitle" class="sub-header">{{
          workOrderSummary.finalInspectionTitle
        }}</span>
        <span
          v-if="workOrderSummary.selectedFinalInspectionByAssetCategory.name"
          class="sub-header"
          >{{
            workOrderSummary.selectedFinalInspectionByAssetCategory.name
          }}</span
        >
      </div>
    </div>
    <SButton title="Create Work Order" @click="createWorkOrder" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  props: {
    workOrderSummary: {},
  },
  methods: {
    createWorkOrder() {
      this.$emit("create");
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  font-size: 14px;
}
</style>