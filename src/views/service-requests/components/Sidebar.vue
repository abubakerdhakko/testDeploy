<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <span class="header bold">Service Request Summary</span>
      <span class="sub-header"
        >Service Request :{{ serviceRequestObj.issueNumber }}</span
      >
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Service Request Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Service Request Name: </span>
        <span>{{ serviceRequestObj.issueName }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Service Request Status</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Requested By: </span>
        <span>{{ serviceRequestObj.reportedBy }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Created At: </span>
        <span>{{ serviceRequestObj.reportedAt }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Status </span>
        <span class="status">{{ serviceRequestObj.status }}</span>
      </div>
      <div
        v-margin-top="8"
        class="info-row"
        v-if="
          serviceRequestObj.status === 'resolved' ||
          serviceRequestObj.status === 'Resolved'
        "
      >
        <span class="bold">Resolved By </span>
        <span>{{ serviceRequestObj.resolvedByUserName }}</span>
      </div>
      <div
        v-margin-top="8"
        class="info-row"
        v-if="
          serviceRequestObj.status === 'resolved' ||
          serviceRequestObj.status === 'Resolved'
        "
      >
        <span class="bold">Resolved At </span>
        <span>{{ serviceRequestObj.resolvedAt }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Other Info</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Name: </span>
        <span>{{ serviceRequestObj.assetName }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Category: </span>
        <span>{{ serviceRequestObj.assetCategory }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Priority: </span>
        <span>{{ serviceRequestObj.priority }}</span>
      </div>
    </div>
    <!-- v-if="type === 'edit'" -->
    <SButton
      v-if="disableFields && serviceRequestObj.status !== 'ignored'"
      title="Update Service Request"
      @click="updateServiceRequest"
    />
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      disableFields: false,
    };
  },
  props: {
    serviceRequestObj: { type: Object },
  },
  methods: {
    updateServiceRequest() {
      // this.$v.$touch();
      this.$emit("create");
    },
  },
  created() {
    if (
      this.$route.name === "service-requests-edit" ||
      this.serviceRequestObj.status == "Resolved"
    ) {
      this.disableFields = true;
    }
  },
};
</script>

<style lang="scss" scoped>
span.status {
  text-transform: capitalize;
}
// .sidebar-container {
//   box-shadow: 0 0 20px 0 #e1e1e1;
//   background-color: rgba(255, 255, 255, 0);
//   display: flex;
//   flex-direction: column;
//   border: 1px solid #e1e1e1;
//   font-family: Euclid Circular B;
//   color: #000;

//   .sidebar-section {
//     padding: 24px;
//     border-bottom: 1px solid #e1e1e1;
//     display: flex;
//     flex-direction: column;
//   }

//   .header {
//     font-size: 14px;
//     line-height: 1;
//   }
//   .sub-header {
//     font-size: 12px;
//     line-height: 1.17;
//   }
//   .sec-text {
//     font-size: 10px;
//     line-height: 1.25;
//   }
//   .info-row {
//     display: grid;
//     grid-template-columns: repeat(2, 1fr);
//   }
// }
</style>