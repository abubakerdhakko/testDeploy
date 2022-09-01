<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <!-- {{assetObj}} -->
      <span class="header bold">Asset Summary</span>
      <span class="sub-header">{{ assetObj.assetNumber }}</span>
    </div>
    <!--	<div
			v-if="
				(assetObj.assetImages != '' &&
					assetObj.assetImages != null &&
					assetObj.assetImages != undefined) ||
				assetObj.description != null
			"
			class="sidebar-section sec-text"
			style="position: relative"
		>
			<div v-margin-top="8" class="info-row">
				<span class="bold">Description: </span>
				<span>{{ assetObj.description }}</span>
			</div>
			 <img :src="assetObj.img" width="50px" class="thumbnail" alt=""> 
	</div>-->

    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Asset Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Name: </span>
        <span>{{ assetObj.name }}</span>
      </div>

      <div v-margin-top="8" class="info-row">
        <span class="bold">Model #</span>
        <span>{{ assetObj.modelNumber }}</span>
      </div>
      <!-- <div v-margin-top="8" class="info-row">
				<span class="bold">Inventory</span>
				<span>{{ assetObj.inventory }}</span>
			</div> -->
      <div v-margin-top="8" class="info-row">
        <span class="bold">Manufacturer Name/ID</span>
        <span>{{ assetObj.manufacture }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Purchase Date</span>
        <span>{{ assetObj.purchaseDate }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Status</span>
        <span class="status">{{ assetObj.status }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Description</span>
        <div class="wordBreak-side">
          <span class="status"> {{ description || assetObj.description }}</span>
        </div>
      </div>
      <div v-if="this.assetObj.status !== '' && this.$route.name != 'create-asset'" v-margin-top="8" class="info-row">
        <span class="bold">Cost ({{ currency }})</span>
        <span>{{ assetObj.cost }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Asset Warranty</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Warranty Unit: </span>
        <span>{{ assetObj.warrantyUnit }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Warranty: </span>
        <span>{{ assetObj.warranty }}</span>
      </div>

      <div v-if="assetObj.consumptionPoints" v-margin-top="8" class="info-row">
        <span class="bold">Consumption Points: </span>
        <span>{{ assetObj.consumptionPoints }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Usages and Consumption</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Primary Usage Unit: </span>
        <span>{{ assetObj.primaryUsageUnit }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Secondary Usage Unit: </span>
        <span>{{ assetObj.secondaryUsageUnit }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Consumption Unit: </span>
        <span>{{ assetObj.consumptionUnit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      costUnit: "",
    };
  },
  props: {
    assetObj: { type: Object },
    currency: { type: String },
    description: { type: String },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.thumbnail {
  position: relative;
  z-index: 0;
  align-self: center;
}
span.status {
  text-transform: capitalize;
}
</style>