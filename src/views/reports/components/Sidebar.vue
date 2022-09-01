<template>
  <div class="sidebar-container" id="test">
    <div class="sidebar-section">
      <span class="header bold">KPI Summary</span>
      <!-- <span class="sub-header">Work Order ID</span> -->
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">New Issues</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Minimum: </span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Maximum:</span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Average:</span>
        <span>0</span>
      </div>
    </div>

    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Issues In Progress</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Minimum: </span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Maximum:</span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Average:</span>
        <span>0</span>
      </div>
    </div>

    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Reported Issues</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Minimum: </span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Maximum:</span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Average:</span>
        <span>0</span>
      </div>
    </div>

    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Pooled Issues</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Minimum: </span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Maximum:</span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Average:</span>
        <span>0</span>
      </div>
    </div>

    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Priority</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Low: </span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Medium:</span>
        <span>0</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Heigh:</span>
        <span>0</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  methods:{
  },
  created(){
  }
};
</script>

<style lang="scss" scoped>
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