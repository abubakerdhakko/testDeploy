<template>
  <div>
    <SDialog
      :width="880"
      :height="880"
      :crossIcon="true"
      :persistent="true"
      @close="closeModal"
      title="Add Time"
    >
      <div class="column-grid-2" v-padding="'48px'">
        <SSelect
          label="Select User"
          v-model="userLabel"
          :source="workOrderDetail.assignees"
          @clear="clearSelectedUser"
          resultsValue="name"
          resultsDisplay="name"
          :autocomplete="true"
          @selected="usersSelected"
          :error="getFormErrorMessage($v.userLabel)"
          :key="updateComp + 'user'"
        />
        <SDatePicker
          label="Start Date"
          v-model="startDate"
          :error="getFormErrorMessage($v.startDate)"
          :border="true"
        >
        </SDatePicker>
        <SInput
          label="Duration(hrs)"
          type="number"
          @input="checkValdiation('durationhrs')"
          :error="getFormErrorMessage($v.durationhrs)"
          v-model="durationhrs"
        />
        <SInput
          label="Duration(mins)"
          type="number"
          @input="checkValdiation('durationmin')"
          :error="getFormErrorMessage($v.durationmin)"
          v-model="durationmin"
        />
        <SSelect
          label="Time Category"
          v-model="time"
          :source="timeOptions"
          resultsValue="label"
          resultsDisplay="label"
          :autocomplete="true"
          @clear="clearSelectedTimeCategory"
          :error="getFormErrorMessage($v.time)"
          :key="updateComp + 'time'"
        />
        <div></div>
        <SButton
          style="width: 150px"
          title="Add"
          @click="addWorkOrderTime"
          v-if="disableButton"
        />
      </div>
    </SDialog>

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import WorkOrderService from "../../../services/WorkOrderService";
import moment from "moment";
import { Functions } from "@/shared/Functions";
import { required, maxValue, minValue } from "vuelidate/lib/validators";

import loader from "@/components/Loader.vue";

export default {
  props: {
    workOrderDetail: {
      type: Object,
    },
    showToast: {
      type: Function,
    },
  },

  components: { loader },

  data() {
    return {
      updateComp: 0,
      loaderFlag: false,
      addTimeFlag: false,
      disableButton: true,
      userLabel: "",
      user: "",
      startDate: "",
      durationhrs: null,
      durationmin: null,
      time: null,
      userOptions: [],
      timeOptions: [
        { label: "Inspection Time" },
        { label: "Drive Time" },
        { label: "Repair Time" },
        { label: "Vendor Time" },
        { label: "Other Time" },
      ],
    };
  },

  created() {},

  methods: {
    checkValdiation(field) {
      this.$v[field].$touch();
    },

    addWorkOrderTime() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit(
          "showToast",
          "Please fill all the required fields",
          "warning"
        );
        return;
      }
      this.loaderFlag = true;
      this.disableButton = false;
      let addTimeRequestObj = {
        assigneeUUID: this.user.uuid,
        workOrderUUID: this.workOrderDetail.uuid,
        start: moment(this.startDate).toISOString(),
        end: moment(this.startDate)
          .add(this.durationhrs, "hours")
          .add(this.durationmin, "minutes")
          .toISOString(),
        timeCategory: this.time,
      };
      WorkOrderService.addUserTime(addTimeRequestObj)
        .then((response) => {
          if (response.data.responseIdentifier === "Success") {
            this.loaderFlag = false;
            this.disableButton = true;
            this.$emit("close");
            this.$emit("showToast", "Time added Successfully", "success");
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          this.disableButton = true;
          this.$emit("showToast", error.data.response, "error");
        });
    },

    closeModal() {
      this.$emit("close");
    },

    usersSelected(value) {
      this.user = value.selectedObject;
    },

    clearSelectedUser() {
      this.userLabel = "";
      this.updateComp++;
    },
    
    clearSelectedTimeCategory() {
      this.time = "";
      this.updateComp++;
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
  },

  validations: function () {
    return {
      userLabel: { required },
      startDate: { required },
      durationhrs: { required, maxValue: maxValue(23), minValue: minValue(0) },
      durationmin: { required, maxValue: maxValue(60), minValue: minValue(1) },
      time: { required },
    };
  },
};
</script>
<style scoped>
.row-col-gap {
  column-gap: 8px;
  row-gap: 16px;
}
</style>
