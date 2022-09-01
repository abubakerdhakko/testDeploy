1<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <span class="header bold">Inspection Details Summary</span>
      <span class="sub-header"
        >Inspection ID {{ inspectionObj.inspectionNumber }}</span
      >
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Inspection Details Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Inspection Name: </span>
        <span>{{ inspectionObj.name }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Inspection Date</span>
        <span>{{ inspectionObj.createdAt | date }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Inspected By: </span>
        <span>{{ inspectionObj.submittedByUserName }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Inspection Type: </span>
        <span>{{ inspectionObj.inspectionType }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Reported By: </span>
        <span>{{ inspectionObj.submittedByUserName }}</span>
      </div>
      <!-- <div v-margin-top="8" class="info-row">
				<span class="bold">Submitted by:</span>
				<span>{{ inspectionObj.submittedByUserName }}</span>
			</div> -->
      <div v-margin-top="8" class="info-row">
        <span class="bold">Submitted at: </span>
        <span>{{ inspectionObj.createdAt }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Status: </span>
        <span class="status">{{ inspectionObj.status }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Asset Details</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset No. </span>
        <span>{{ asset.assetNumber }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Name: </span>
        <span>{{ asset.name }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Category: </span>
        <span>{{ asset.category }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Other Info</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Location: </span>
        <span
          ><img
            src="/assets/icons/Location.svg"
            alt=""
            width="20px"
            style="cursor: pointer"
            @click="image"
        /></span>
      </div>
    </div>
    <SDialog
      title="Location Map"
      :width="700"
      :persistent="false"
      :closeIcon="false"
      @close="close"
      v-show="locationDialog"
    >
      <SMap
        v-if="locationDialog"
        :height="400"
        :markers="markers"
        :animation="false"
        :zoom="16"
      />
    </SDialog>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      locationDialog: false,
      markers: [],
    };
  },
  props: {
    inspectionObj: { type: Object },
    asset: { type: Object },
    locations: { type: Array },
  },
  methods: {
    image() {
      this.locationDialog = true;
      if (this.locations) {
        this.markers.push({
          lng: this.locations[0].lng,
          lat: this.locations[0].lat,
          type: "office",
        });
      }

      //	console.log(this.markers);
    },
    close() {
      this.locationDialog = false;
    },
  },
  created() {
    //console.log("report",this.inspectionObj);
  },
};
</script>

<style lang="scss" scoped>
span.status {
  text-transform: capitalize;
}
</style>