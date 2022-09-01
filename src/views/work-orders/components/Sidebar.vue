<template>
  <div class="sidebar-container">
    <div class="sidebar-section sec-text">
      <span class="header bold">Work Order Summary</span>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Asset Information</span>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Asset Name: </span>
        <span>{{ assetInfo.assetDetail.name }}</span>
      </div>

      <div v-margin-top="4" class="info-row">
        <span class="bold">Asset Category:</span>
        <span v-if="assetInfo.category !== null">{{
          assetInfo.category.name
        }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Work Order Timeline</span>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Start Time: </span>
        <span>{{
          workOrderDetail.workOrder.startTime &&
          workOrderDetail.workOrder.startTime != "Invalid date"
            ? workOrderDetail.workOrder.startTime
            : "-"
        }}</span>
      </div>
      <div v-margin-top="4" class="info-row">
        <span class="bold">End Time: </span>
        <span>{{
          workOrderDetail.workOrder.endTime &&
          workOrderDetail.workOrder.endTime != "Invalid date"
            ? workOrderDetail.workOrder.endTime
            : "-"
        }}</span>
      </div>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Elapsed Time: </span>
        <span>{{ workOrderDetail.workOrder.elapsedTimeFormatted }}</span>
      </div>
    </div>
    <div class="sidebar-section sec-text">
      <span class="sub-header bold">Work Order Info</span>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Assigned To: </span>
        <span>{{ workOrderDetail.workOrder.assignedToUserName }}</span>
      </div>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Priority: </span>
        <span>{{ workOrderDetail.workOrder.priority }}</span>
      </div>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Total Cost ({{ currency }}): </span>
        <span>{{ totalWorkOrderCost }}</span>
      </div>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Number of Issues: </span>
        <div v-if="workOrderDetail.workOrder.issues">
          <span>{{ workOrderDetail.workOrder.issues.length }}</span>
        </div>
      </div>
    </div>

    <div
      class="sidebar-section sec-text"
      v-if="this.workOrderDetail.workOrder.status !== 'Open'"
    >
      <span class="sub-header bold">Inspection Reports</span>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Initial Inspection: </span>
        <div v-if="initialInspectionReport">
          <span>{{ initialInspectionReport.name }}</span>
        </div>
      </div>
      <div v-margin-top="4" class="info-row">
        <span class="bold">Final Inspection: </span>
        <div v-if="initialInspectionReport">
          <span>{{ initialInspectionReport.name }}</span>
        </div>
      </div>
    </div>
    <div
      class="sidebar-section sec-text"
      v-if="
        this.workOrderDetail.workOrder.status === 'Open' &&
        this.workOrderSummary !== null &&
        type === 'edit'
      "
    >
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
    <div
      class="sidebar-section sec-text"
      v-if="
        this.workOrderDetail.workOrder.status === 'Open' &&
        this.workOrderSummary !== null &&
        type === 'edit'
      "
    >
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
    <SButton
      v-if="this.$route.name === 'edit-work-order-details'"
      title="Update Work Order"
      @click="updateWorkOrder"
    />
  </div>
</template>

<script>
import WorkOrderService from "../../../services/WorkOrderService";
import moment from "moment";
export default {
  name: "Sidebar",

  props: {
    workOrderDetail: {},
    assetInfo: {},
    type: {},
    currency: {},
    workUUID: {},
    workOrderSummary: {},
  },
  data() {
    return {
      totalWorkOrderCost: 0,
      initialInspectionReport: null,
      finalInspectionReport: null,
    };
  },
  mounted() {},
  created() {
    this.workOrderDetail.workOrder.startTime = moment
      .utc(this.workOrderDetail.workOrder.startTime)
      .local()
      .format("DD MMM YYYY hh mm a");

    this.workOrderDetail.workOrder.endTime = moment
      .utc(this.workOrderDetail.workOrder.endTime)
      .local()
      .format("DD MMM YYYY hh mm a");
    for (
      let index = 0;
      index < this.workOrderDetail.workOrder.issues.length;
      index++
    ) {
      this.getPartsByUUId(
        this.workOrderDetail.workOrder.issues[index].issueUUID
      );
      this.getCostByUUID(
        this.workOrderDetail.workOrder.issues[index].issueUUID
      );
    }
    if (this.workOrderDetail.workOrder.status !== "Open") {
      this.getInspectionReport();
    }
  },
  methods: {
    getInspectionReport() {
      WorkOrderService.getInspectionReportByWorkOrderuuid(this.workUUID)
        .then((res) => {
          // console.log(res)
          for (let i = 0; i < res.data.inspectionReports.length; i++) {
            if (res.data.inspectionReports[i].initial === true) {
              this.initialInspectionReport = res.data.inspectionReports[i];
            } else {
              this.finalInspectionReport = res.data.inspectionReports[i];
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateWorkOrder() {
      this.$emit("updateWorkOrder");
    },
    getPartsByUUId(uuid) {
      //  console.log(uuid);
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
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
