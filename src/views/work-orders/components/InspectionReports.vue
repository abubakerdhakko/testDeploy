<template>
  <div>
    <div class="accordion-content" v-if="initialInspectionReport">
      <div>
        <span class="sub-header bold">Initial Inspections</span><br />
        <div class="column-grid-4 mt-16">
          <SInput
            label="Inspection Number"
            v-model="initialInspectionReport.inspectionNumber"
            :readonly="true"
          />
          <SInput
            label="Name"
            v-model="initialInspectionReport.name"
            :readonly="true"
          />
          <SInput
            label="Created At"
            v-model="initialInspectionReport.createdAt"
            :readonly="true"
          />
          <SButton
            class="btn"
            title="Initial Inspection Items"
            @click="initialInspectionItemClick"
            pill
            small
          />
        </div>
      </div>

      <div v-margin-top="21" v-if="finalInspectionReport">
        <span class="sub-header bold">Final Inspections</span><br />
        <div class="column-grid-4 mt-16">
          <SInput
            label="Inspection Number"
            v-model="finalInspectionReport.inspectionNumber"
            :readonly="true"
          />
          <SInput
            label="Name"
            v-model="finalInspectionReport.name"
            :readonly="true"
          />
          <SInput
            label="Created At"
            v-model="finalInspectionReport.createdAt"
            :readonly="true"
          />
          <SButton
            class="btn"
            title="Final Inspection Items"
            @click="finalInspectionItemClick"
            pill
            small
          />
        </div>
      </div>
      <div v-if="initialInspectionFlag">
        <InspectionItems
          v-if="initialInspectionReport && initialInspectionImages && assetInfo"
          :assetUUID="assetInfo.assetDetail.uuid"
          :imageVoices="initialInspectionImages[0]"
          :inspectionReportItem="
            initialInspectionReport.inspectionReportCategories
          "
          :workOrder="workOrder"
          @close="closeModal"
          :type="'Initial'"
        />
      </div>
      <div v-if="finalInspectionFlag">
        <InspectionItems
          v-if="finalInspectionReport && finalInspectionImages && assetInfo"
          :assetUUID="assetInfo.assetDetail.uuid"
          :imageVoices="finalInspectionImages[0]"
          :inspectionReportItem="
            finalInspectionReport.inspectionReportCategories
          "
          :workOrder="workOrder"
          @close="closeModal"
          :type="'Final'"
        />
      </div>
    </div>
    <div v-padding="'32px'" v-if="inspectionReportFound === 0">
      No Inspection Report
    </div>
  </div>
</template>

<script>
import InspectionItems from "./InspectionItems";
import WorkOrderService from "../../../services/WorkOrderService";
export default {
  name: "InspectionReports",

  components: {
    InspectionItems,
  },

  data() {
    return {
      initialInspectionFlag: false,
      finalInspectionFlag: false,
      initialInspectionImages: [],
      finalInspectionImages: [],
      inspectionReportFound: -1,
      initialInspectionReport: null,
      finalInspectionReport: null,
      workOrder: true,
    };
  },

  methods: {
    initialInspectionItemClick() {
      this.initialInspectionFlag = true;
    },
    finalInspectionItemClick() {
      this.finalInspectionFlag = true;
    },
    closeModal() {
      this.initialInspectionFlag = false;
      this.finalInspectionFlag = false;
    },
  },

  created() {
    WorkOrderService.getInspectionReportByWorkOrderuuid(this.workuuid)
      .then((res) => {
        this.initialInspectionImages = res.data.initialImageVoicesHashmap;
        this.finalInspectionImages = res.data.finalImageVoicesHashmap;
        if (res.data.inspectionReports.length > 0) {
          this.inspectionReportFound = 1;
        } else {
          this.inspectionReportFound = 0;
        }
        for (let inspection of res.data.inspectionReports) {
          if (inspection && inspection.initial) {
            this.initialInspectionReport = inspection;
          } else {
            this.finalInspectionReport = inspection;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  validations: function() {
    return {};
  },

  props: {
    workuuid: {},
    assetInfo: {},
  },
};
</script>

<style lang="scss" scoped>
.accordion-content {
  padding: 24px 24px;
  border-top: 1px solid var(--very-light-pink);
}
.btn {
  white-space: nowrap;
  max-width: 180px;
}
</style>
