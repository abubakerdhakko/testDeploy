<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <span class="header bold">Issue Summary</span>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Issue Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Issue Name: </span>
        <span>{{ issues.issueName }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Priority:</span>
        <span>{{ issues.priority }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Issue Category:</span>
        <span>{{ issues.issueCategory }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Issue Type:</span>
        <span>{{ issues.issueType }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Staus:</span>
        <span class="status">{{ issues.status }}</span>
      </div>
    </div>

    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Asset Information</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Category: </span>
        <span :key="assetIndex + 'test'">{{ issues.assetCategory }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Asset Name: </span>
        <span :key="assetIndex + 'test1'">{{ issues.assetName }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Total Cost</span>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Total Cost ({{ currency }}): </span>
        <span>{{ totalWorkOrderCost }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Issue Timeline</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Reported At: </span>
        <span>{{ issues.reportedAt }}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Reported By: </span>
        <span>{{ issues.submittedByUserName }}</span>
      </div>
    </div>
    <!-- <div class="sidebar-section sec-text">
      <span class="sub-header bold">Comments Section</span>
      <div v-margin-top="8" class="info-row">
        <span class="bold">User Comments: </span>
        <span>{{issues.issueDescription}}</span>
      </div>
      <div v-margin-top="8" class="info-row">
        <span class="bold">Repair Instruction: </span>
        <span>{{issues.description}}</span>
      </div>
    </div> -->
  </div>
</template>

<script>
import WorkOrderService from "../../../services/WorkOrderService";
export default {
  name: "Sidebar",
  data() {
    return {
      assetIndex: 0,
      totalWorkOrderCost: 0,
    };
  },
  props: {
    issues: {
      type: Object,
    },
    currency: {},
  },
  created() {
    this.getPartsByUUId(this.$route.params.issueID);
    this.getCostByUUID(this.$route.params.issueID);
    //	this.total();
    this.assetIndex++;
  },
  methods: {
    getPartsByUUId(uuid) {
      WorkOrderService.getPartsByIssueUUID(uuid)
        .then((response) => {
          if (response.status === 200) {
            for (
              let index = 0;
              index < response.data.partUsed.length;
              index++
            ) {
              this.totalWorkOrderCost +=
                response.data.partUsed[index].quantity *
                  response.data.partUsed[index].cost.amount +
                response.data.partUsed[index].cost.taxAmount;
            }
            this.total();
          }
        })
        .catch((error) => {});
    },
    getCostByUUID(uuid) {
      WorkOrderService.getCostsByIssueUUID(uuid)
        .then((response) => {
          if (response.status === 200) {
            for (let index = 0; index < response.data.cost.length; index++) {
              this.totalWorkOrderCost +=
                response.data.cost[index].costQuantity *
                  response.data.cost[index].amount +
                response.data.cost[index].taxAmount;
            }
            this.total();
          }
        })
        .catch((error) => {});
    },
    total() {
      this.$emit("totalCost", this.totalWorkOrderCost);
    },
  },
};
</script>

<style lang="scss" scoped>
span.status {
  text-transform: capitalize;
}
</style>