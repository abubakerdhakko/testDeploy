<template>
  <div>
    <SDialog
      :width="1000"
      :crossIcon="true"
      :persistent="true"
      @close="closeIssueDialog"
      title="Issue Detail"
    >
      <div v-if="assetName">
        <div
          v-grid="2"
          style="
            padding-top: 30px;
            padding-bottom: 16px;
            padding-right: 32px;
            padding-left: 32px;
          "
          :key="issueIndex"
          class="row-col-gap"
        >
          <SInput
            label="Issue Name"
            v-model="issues.issueName"
            :error="getFormErrorMessage(this.$v.issues.issueName)"
            :disabled="editIssue !== true ? true : false"
          />
          <SSelect
            label="Priority"
            v-model="issues.priority"
            :source="priorityOptions"
            resultsValue="label"
            resultsDisplay="label"
            :autocomplete="true"
            :error="getFormErrorMessage(this.$v.issues.priority)"
            :disabled="editIssue !== true ? true : false"
          />
          <SSelect
            label="issue category"
            v-model="issues.issueCategory"
            :error="getFormErrorMessage(this.$v.issues.issueCategory)"
            :source="categoryOptions"
            resultsValue="value"
            resultsDisplay="label"
            :autocomplete="true"
            @selected="selectCate"
            :disabled="editIssue !== true ? true : false"
          />

          <SSelect
            label="issue type"
            v-model="issues.issueType"
            :source="typeOptions"
            resultsValue="value"
            resultsDisplay="label"
            :autocomplete="true"
            :error="getFormErrorMessage(this.$v.issues.issueType)"
            :disabled="editIssue !== true ? true : false"
          />

          <SDatePicker
            label="Reported At"
            :value="issues.reportedAt | date"
            :border="true"
            disabled
          >
          </SDatePicker>
          <SInput
            label="Asset Category"
            v-model="issues.assetCategory"
            disabled
          />
          <SInput label="Asset Name" v-model="issues.assetName" disabled />
          <SInput
            label="Reported By"
            v-model="issues.submittedByUserName"
            disabled
          />
          <STextarea
            label="Repair Instructions"
            :rows="3"
            :columns="15"
            v-model="issues.description"
            disable
          />
          <STextarea
            label="User Comments"
            :rows="3"
            :columns="15"
            v-model="issues.issueDescription"
            disable
          />
        </div>

        <div v-if="issues.serviceUUID !== null" class="row-col-gap">
          <div v-padding="'16px 0px 8px 0px'">
            <div class="row-border"></div>
          </div>
          <div v-grid="1" v-padding="'0px 32px 0px'">
            <span><b>Service Request </b></span>
          </div>
          <div
            v-grid="2"
            style="
              padding-top: 0px;
              padding-bottom: 0px;
              padding-right: 32px;
              padding-left: 32px;
            "
            class="row-col-gap"
            :key="serviceIndex"
          >
            <SInput label="Name" v-model="serviceRequest.issueName" disabled />
            <SInput label="Type" v-model="serviceRequest.issueType" disabled />
            <SInput
              label="Reported At"
              :value="serviceRequest.reportedAt | date"
              disabled
            />
            <SInput
              label="Priority"
              v-model="serviceRequest.priority"
              disabled
            />
          </div>
        </div>

        <div v-if="issues.inspectionUUID !== null" class="row-col-gap">
          <div class="row-border"></div>

          <div v-grid="1" v-padding="'0px 32px 0px'">
            <div>
              <span><b>Inspection</b></span>
            </div>
          </div>
          <div
            v-grid="2"
            v-padding="'0px 32px 0px 32px'"
            class="row-col-gap"
            :key="inspectionIndex"
          >
            <SInput
              label="Inspection Number"
              v-model="inspectionReport.inspectionNumber"
              disabled
            />
            <SInput label="Name" v-model="inspectionReport.name" readonly />
            <SInput
              label="Created At"
              :value="inspectionReport.createdAt | date"
              disabled
            />
          </div>
        </div>
        <div v-grid="1" class="row-col-gap" v-padding="'0px 32px 30px 32px'">
          <SButton
            style="width: 150px"
            v-if="editIssue === true"
            title="Update"
            @click="updateIssue"
          />
        </div>
      </div>
    </SDialog>
  </div>
</template>
<script>
import InspectionService from "../../../services/InspectionService";
import AssetPersonnelService from "../../../services/AssetPersonnelService";
import AssetManagementService from "../../../services/AssetManagementService";
import { Functions } from "@/shared/Functions";
import { required } from "vuelidate/lib/validators";

export default {
  name: "ViewIssue",
  data() {
    return {
      issues: {},
      serviceRequest: "",
      inspectionReport: "",
      issueIndex: 0,
      serviceIndex: 0,
      inspectionIndex: 0,
      priorityOptions: [
        { label: "low" },
        { label: "Medium" },
        { label: "High" },
      ],
      categoryOptions: [],
      typeOptions: [],
      assetName: "",
    };
  },

  methods: {
    closeIssueDialog() {
      this.$emit("close", true);
    },

    getUserName(userUUID) {
      AssetPersonnelService.getNameOfUsersByUUIDS({ uuids: userUUID })
        .then((response) => {
          if (response.status === 200) {
            this.issues.submittedByUserName =
              response.data.users[this.issues.submittedByUserUUID].name;
            this.issueIndex++;
          }
        })
        .catch((error) => {});
    },

    getAsset(assetUUID) {
      AssetManagementService.getAssetWithDetails(assetUUID, false, true)
        .then((response) => {
          if (response.status == 200) {
            this.issues.assetName = response.data.assetDetail.assetDetail.name;
            this.assetName = response.data.assetDetail.assetDetail.name;
            this.issues.assetCategory = response.data.assetDetail.category.name;
            this.issueIndex++;
          }
        })
        .catch((error) => {});
    },
    selectCate(value) {
      this.typeOptions = [];
      this.issueType = "";
      for (
        let index = 0;
        index < this.dropDownConfigs.issueCategories.length;
        index++
      ) {
        if (value.value === this.dropDownConfigs.issueCategories[index].value) {
          for (
            let index1 = 0;
            index1 < this.dropDownConfigs.issueCategories[index].types.length;
            index1++
          ) {
            let obj = {
              label:
                this.dropDownConfigs.issueCategories[index].types[index1].label,
              value:
                this.dropDownConfigs.issueCategories[index].types[index1].value,
            };
            this.typeOptions.push(obj);
          }
        }
      }
    },
    getServiceRequest(serviceUUID) {
      InspectionService.getServiceRequestByUUID(serviceUUID)
        .then((response) => {
          if (response.status === 200) {
            this.serviceRequest = response.data.serviceRequest;
            this.serviceIndex++;
          }
        })
        .catch((error) => {});
    },

    getInspection(inspectionUUID) {
      InspectionService.getInspectionReportByUUID(inspectionUUID)
        .then((response) => {
          if (response.status === 200) {
            this.inspectionReport = response.data.inspectionReport;
            this.inspectionIndex++;
          }
        })
        .catch((error) => {});
    },

    updateIssue() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let updateIssueRequest = {
        issueReporting: this.issues,
      };
      InspectionService.updateIssue(updateIssueRequest)
        .then((response) => {
          if (response.status === 200) {
            alert("update issue successfully");
            this.$emit("close", true);
          }
        })
        .catch((error) => {});
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
  },

  mounted() {},

  created() {
    this.dropDownConfigs = JSON.parse(localStorage.getItem("dropDownConfigs"));
    //  console.log(this.dropDownConfigs)
    for (
      let index = 0;
      index < this.dropDownConfigs.issueCategories.length;
      index++
    ) {
      let obj = {
        label: this.dropDownConfigs.issueCategories[index].label,
        value: this.dropDownConfigs.issueCategories[index].value,
      };
      this.categoryOptions.push(obj);
      //  const element = dropDownConfigs.issueCategories[index].label;
    }
    InspectionService.getIssueByUUID(this.issueuuid)
      .then((response) => {
        if (response.status === 200) {
          this.issues = response.data.issueReporting;
          this.getUserName([this.issues.submittedByUserUUID]);
          this.getAsset(this.issues.assetUUID);

          if (this.issues.serviceUUID !== null) {
            this.getServiceRequest(this.issues.serviceUUID);
          }
          if (this.issues.inspectionUUID !== null) {
            this.getInspection(this.issues.inspectionUUID);
          }
        }
      })
      .catch((error) => {});
  },

  validations: function () {
    return {
      issues: {
        issueName: { required },
        issueType: { required },
        issueCategory: { required },
        priority: { required },
      },
    };
  },

  components: {},
  props: {
    issueuuid: {},
    editIssue: {},
    viewIssue: {},
  },
};
</script>

<style lang="scss" scoped>
.ViewIssue-dialog {
  .modal {
    width: 980px;
  }
}
.row-col-gap {
  display: grid;
  column-gap: 16px;
  row-gap: 16px;
}
.row-border {
  border-top: 1px solid var(--very-light-pink);
}
</style>
