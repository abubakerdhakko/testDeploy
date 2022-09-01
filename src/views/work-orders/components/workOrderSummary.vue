<template>
  <div>
    <SCard :border="true" :shadow="true">
      <div v-grid="1" v-padding="'24px 30px'">
        <span><strong>Work Order Detail</strong></span>
      </div>

      <div v-padding="'24px 30px'" class="column-grid-3">
        <SInput
          label="Assigned To"
          v-model="workOrderDetail.workOrder.assignedToUserName"
          :error="
            getFormErrorMessage($v.workOrderDetail.workOrder.assignedToUserName)
          "
          disabled
        />
        <SSelect
          label="Priority"
          v-model="workOrderDetail.workOrder.priority"
          :source="priorityOptions"
          resultsValue="label"
          resultsDisplay="label"
          :autocomplete="true"
          :disabled="
            disableFields ||
              workOrderStatus.toLowerCase() === 'Closed'.toLowerCase()
          "
          :error="getFormErrorMessage($v.workOrderDetail.workOrder.priority)"
          @clear="clearSelectedPriority"
          :key="updateComp + 'priority'"
        />
        <SSelect
          label="Status"
          v-model="workOrderDetail.workOrder.status"
          :source="stausOptions"
          resultsValue="label"
          resultsDisplay="label"
          :autocomplete="true"
          :disabled="
            disableFields ||
              workOrderStatus.toLowerCase() === 'Closed'.toLowerCase()
          "
          :error="getFormErrorMessage($v.workOrderDetail.workOrder.status)"
          @clear="clearSelectedStatus"
          :key="updateComp + 'status'"
        />
        <SSelect
          label="Shift"
          v-model="workOrderDetail.workOrder.shift"
          :source="shiftOptions"
          resultsValue="label"
          resultsDisplay="label"
          :autocomplete="true"
          :disabled="
            disableFields ||
              workOrderStatus.toLowerCase() === 'Closed'.toLowerCase()
          "
          :error="getFormErrorMessage($v.workOrderDetail.workOrder.shift)"
          @clear="clearSelectedShift"
          :key="updateComp + 'shift'"
        />
        <SDatePicker
          label="Schedule"
          v-model="workOrderDetail.workOrder.schedule"
          :border="true"
          :disabled="
            disableFields ||
              workOrderStatus.toLowerCase() === 'Closed'.toLowerCase()
          "
          :error="getFormErrorMessage($v.workOrderDetail.workOrder.schedule)"
        >
        </SDatePicker>
        <SInput
          :label="'Cost (' + currency + ')'"
          v-model="totalWorkOrderCost"
          :key="costs + 'cost'"
          disabled
        />
        <SDatePicker
          :label="'Start Time'"
          v-model="workOrderDetail.workOrder.startTime"
          :border="true"
          :disabled="true"
          :key="dateTimeKey + 'dateTim'"
        >
        </SDatePicker>
        <!-- ================================previous condition for date on WO================================  -->
        <!-- 
          :disabled="
            disableFields ||
              workOrderStatus.toLowerCase() === 'Closed'.toLowerCase()
          "
         -->
        <SDatePicker
          label="End Time"
          v-model="workOrderDetail.workOrder.endTime"
          :border="true"
          :disabled="true"
          
          :key="dateTimeKey + 'dateTime'"
        />
        <!-- ================================previous condition for date on WO================================  -->
        <!-- :disabled="
            disableFields ||
              workOrderStatus.toLowerCase() === 'Closed'.toLowerCase()
          " -->
      </div>
    </SCard>
  </div>
</template>

<script>
import { Functions } from "@/shared/Functions";
import { required } from "vuelidate/lib/validators";
import WorkOrderService from "../../../services/WorkOrderService";

export default {
  name: "WorkOrderSummary",

  components: {},

  data() {
    return {
      costs: 0,
      dateTimeKey: 0,
      updateComp: 0,
      workOrderStatus: null,
      priorityOptions: [
        { label: "Low" },
        { label: "Medium" },
        { label: "High" },
      ],
      shiftOptions: [
        { label: "Morning" },
        { label: "Afternoon" },
        { label: "Evening" },
      ],
      stausOptions: [
        { label: "Open" },
        { label: "Closed" },
        { label: "In progress	" },
      ],
      totalWorkOrderCost: 0,
    };
  },

  props: {
    assetInfo: {},
    workOrderDetail: {},
    disableFields: {},
    currency: {},
  },

  methods: {
    getPartsByUUId(uuid) {
      WorkOrderService.getPartsByIssueUUID(uuid)
        .then((response) => {
          if (response.status === 200) {
            for (let part of response.data.partUsed) {
              this.totalWorkOrderCost +=
                part.quantity * part.cost.amount + part.cost.taxAmount;

              this.costs++;
            }
          }
        })
        .catch((error) => {});
    },
    getCostByUUID(uuid) {
      WorkOrderService.getCostsByIssueUUID(uuid)
        .then((response) => {
          if (response.status === 200) {
            for (let cost of response.data.cost) {
              this.totalWorkOrderCost +=
                cost.costQuantity * cost.amount + cost.taxAmount;
              this.costs++;
            }
          }
        })
        .catch((error) => {});
    },
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    clearSelectedPriority() {
      this.workOrderDetail.workOrder.priority = null;
      this.updateComp++;
    },
    clearSelectedStatus() {
      this.workOrderDetail.workOrder.status = null;
      this.updateComp++;
    },
    clearSelectedShift() {
      this.workOrderDetail.workOrder.shift = null;
      this.updateComp++;
    },
    checkValidations() {
      this.$v.$touch();
      return this.$v.$invalid ? true : false;
    },
  },
  validations: function() {
    return {
      workOrderDetail: {
        workOrder: {
          priority: { required },
          shift: { required },

          schedule: { required },
          status: { required },
          assignedToUserName: { required },
        },
      },
    };
  },
  created() {
    this.workOrderStatus = this.workOrderDetail.workOrder.status
      ? this.workOrderDetail.workOrder.status
      : "Open";
    setTimeout(() => {
      if (
        this.workOrderDetail.workOrder.startTime == "Invalid date" ||
        this.workOrderDetail.workOrder.startTime == "-"
      ) {
        this.workOrderDetail.workOrder.startTime = "";
        this.dateTimeKey++;
      }
      if (
        this.workOrderDetail.workOrder.endTime == "Invalid date" ||
        this.workOrderDetail.workOrder.endTime == "-"
      ) {
        this.workOrderDetail.workOrder.endTime = "";
        this.dateTimeKey++;
      }
    }, 100);

    for (let issue of this.workOrderDetail.workOrder.issues) {
      this.getPartsByUUId(issue.issueUUID);
      this.getCostByUUID(issue.issueUUID);
    }
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.row-col-gap {
  column-gap: 8px;
  row-gap: 16px;
}
</style>
