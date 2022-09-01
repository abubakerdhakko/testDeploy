<template>
  <div class="sidebar-container">
    <div class="sidebar-section">
      <span class="header bold"
        >{{this.$route.name === "create-inspection-template" ? 'Create Inspection Template' : this.$route.name === 'view-assigned-template' ? 'Scheduled Inspection Summary' : 'Inspection Template' }}
      </span>
      <span class="sub-header"></span>
      <!-- {{ inspectionDetail }} -->
    </div>
    <div v-if="inspectionDetail !== null" class="sidebar-section sec-text">
      <!-- <span class="sub-header bold">Inspection Information</span> -->
      <div v-margin-top="8" v-grid="2" v-if="createInspection !== true">
        <span class="bold">Template Number</span>
        <span v-if="inspectionDetail.templateNumber !== null">
          {{ inspectionDetail.templateNumber }}</span
        >
      </div>
      <div v-margin-top="8" v-grid="2">
        <span class="bold">Template Name: </span>
        <span>{{ templateName }}</span>
      </div>
      <div v-margin-top="8" v-grid="2">
        <span class="bold">Asset Category</span>
        <span>{{ assetCategory }}</span>
      </div>

      <div
        v-if="this.$route.name == 'edit-inspection-template-detail'"
        v-margin-top="8"
        v-grid="2"
      >
        <span class="bold">Last Updated By</span>
        <span>{{ lastUpdatedByName }}</span>
      </div>

      <div
        v-if="this.$route.name == 'edit-inspection-template-detail'"
        v-margin-top="8"
        v-grid="2"
      >
        <span class="bold">Last Updated Date</span>
        <span>{{ inspectionDetail.lastUpdateDate | date }}</span>
      </div>

      <div
        v-margin-top="8"
        v-grid="2"
        v-if="createInspection !== true && edit !== false"
      >
        <span
          class="bold"
          v-if="
            createInspection !== true &&
            edit !== false &&
            inspectionDetail.frequencyType !== null
          "
          >Frequency Type</span
        >
        <span v-if="inspectionDetail.frequencyType !== null">{{
          inspectionDetail.frequencyType
        }}</span>
      </div>
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="createInspection !== true && edit !== false"
      >
        <span
          class="bold"
          v-if="
            createInspection !== true &&
            edit !== false &&
            inspectionDetail.lastUpdatedByName !== null
          "
          >Last Updated By</span
        >
        <span v-if="inspectionDetail.lastUpdatedByName !== null">{{
          inspectionDetail.lastUpdatedByName
        }}</span>
      </div>
      <div v-margin-top="8" v-grid="2">
        <span class="bold"></span>
        <span></span>
      </div>

      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
      >
        <span class="bold"></span>
        <span></span>
      </div>
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
      >
        <span class="bold"></span>
        <span></span>
      </div>
      <span
        class="sub-header bold"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
        >Scheduled Summary</span
      >
      <!-- Main Heading 2 -->
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="createInspection !== true && edit !== false"
      >
        <span
          v-if="
            inspectionDetail.repeatEveryTime !== null &&
            inspectionDetail.repeatEveryTime !== '' &&
            inspectionDetail.repeatEveryType !== '' &&
            inspectionDetail.repeatEveryType !== null &&
            inspectionDetail.repeatEveryTime !== undefined &&
            inspectionDetail.repeatEveryType !== undefined
          "
          class="bold"
          >Repeat Every</span
        >
        <span
          v-if="
            inspectionDetail.repeatEveryTime !== null &&
            inspectionDetail.repeatEveryTime !== '' &&
            inspectionDetail.repeatEveryType !== '' &&
            inspectionDetail.repeatEveryType !== null &&
            inspectionDetail.repeatEveryTime !== undefined &&
            inspectionDetail.repeatEveryType !== undefined
          "
        >
          {{
            inspectionDetail.repeatEveryTime +
            " " +
            inspectionDetail.repeatEveryType
          }}
        </span>

        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.repeatEvery !== '' &&
            inspectionDetail.frequencyType !== 'ad-hoc' &&
            inspectionDetail.frequencyType !== undefined &&
            inspectionDetail.frequencyType !== null

          "
          class="bold"
        >
          Repeat Every ({{ inspectionDetail.frequencyType }})
        </span>
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.repeatEvery !== '' &&
            inspectionDetail.frequencyType !== 'ad-hoc' &&
            inspectionDetail.frequencyType !== undefined &&
            inspectionDetail.frequencyType !== null
          "
        >
          {{ inspectionDetail.repeatEvery }}
        </span>
        <!-- start -->
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.repeatMonthDay !== null &&
            inspectionDetail.repeatMonthDay !== '' &&
            inspectionDetail.repeatMonthDay !== '' &&
            inspectionDetail.repeatMonthDay !== null &&
            inspectionDetail.repeatMonthDay !== undefined &&
            inspectionDetail.repeatMonthDay !== 0
          "
          class="bold"
          >Repeat Month Day</span
        >
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.repeatMonthDay !== null &&
            inspectionDetail.repeatMonthDay !== '' &&
            inspectionDetail.repeatMonthDay !== '' &&
            inspectionDetail.repeatMonthDay !== null &&
            inspectionDetail.repeatMonthDay !== undefined &&
            inspectionDetail.repeatMonthDay !== 0
          "
        >
          {{ inspectionDetail.repeatMonthDay }}
        </span>
        <!-- end -->

        <!-- <span
          v-margin-top="8"
          v-if="
            inspectionDetail.occurrence !== null &&
            inspectionDetail.occurrence !== 0
          "
          class="bold"
          >Occurrence</span
        >
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.occurrence !== null &&
            inspectionDetail.occurrence !== 0
          "
          >{{ inspectionDetail.occurrence }}</span
        > -->

        <!-- <span
          v-margin-top="8"
          v-if="inspectionDetail.monthlyDate !== null"
          class="bold"
          >Monthly Date</span
        >
        <span v-margin-top="8" v-if="inspectionDetail.monthlyDate !== null">
          {{ inspectionDetail.monthlyDate }}
        </span> -->
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.frequencyDays !== null &&
            inspectionDetail.frequencyDays !== '' &&
            inspectionDetail.frequencyType != 'custom' &&
            inspectionDetail.frequencyDays !== '[]'
          "
          class="bold"
          >{{
            inspectionDetail.frequencyType == "yearly"
              ? "Selected Months"
              : "Selected Days"
          }}</span
        >
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.frequencyDays !== null &&
            inspectionDetail.frequencyDays !== '' &&
            inspectionDetail.frequencyType != 'custom' &&
            inspectionDetail.frequencyDays !== '[]'
          "
        >
          <a v-for="obj in selectedDayBar" :key="obj.id">
            {{ obj }}
          </a>
        </span>
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.deadLineDate !== null &&
            inspectionDetail.endType == null
          "
          class="bold"
          >Deadline Date
        </span>
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.deadLineDate !== null &&
            inspectionDetail.endType == null
          "
        >
          {{ deadLineDate }}
        </span>

        <!-- <span
          v-margin-top="8"
          v-if="
            inspectionDetail.starDate !== null &&
            inspectionDetail.starDate !== '' &&
            inspectionDetail.frequencyType !== 'weekly'
          "
          class="bold"
          >Start Date
        </span>
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.starDate !== null &&
            inspectionDetail.starDate !== ''
          "
        >
          {{ inspectionDetail.starDate }}
        </span> -->
        <!-- <span
          v-margin-top="8"
          v-if="
            inspectionDetail.startTime !== null &&
            inspectionDetail.startTime !== '' &&
            inspectionDetail.frequencyType !== 'weekly'
          "
          class="bold"
          >Start Time
        </span>
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.startTime !== null &&
            inspectionDetail.starDate !== ''
          "
        >
          {{ inspectionDetail.startTime }}
        </span> -->
      </div>
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="createInspection !== true && edit !== false"
      >
        <!-- <span
          v-if="
            inspectionDetail.deadLineTime !== null &&
            inspectionDetail.deadLineTime !== '' &&
            inspectionDetail.endType !== 'never'
          "
          class="bold"
          >Deadline Time</span
        >
        <span
          v-if="
            inspectionDetail.deadLineTime !== null &&
            inspectionDetail.deadLineTime !== '' &&
            inspectionDetail.endType !== 'never'
          "
          >{{ deadLineTime }}</span
        > -->
        <span v-margin-top="8" class="bold">Created At</span>
        <span v-margin-top="8">{{ inspectionDetail.createdAt | date }}</span>
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.endType !== null && inspectionDetail.endType !== ''
          "
          class="bold"
          >Ends</span
        >
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.endType !== null && inspectionDetail.endType !== ''
          "
        >
          {{ inspectionDetail.endType }}
          <span
            v-if="
              inspectionDetail.occurrence !== null &&
              inspectionDetail.occurrence !== 0
            "
            >{{ inspectionDetail.occurrence }} occurrence</span
          >
        </span>
        <span
          v-margin-top="8"
          v-if="
            inspectionDetail.endDate !== null && inspectionDetail.endDate !== ''
          "
          class="bold"
          >End Date</span
        >
        <span v-margin-top="8" v-if="inspectionDetail.endDate !== null">{{
          inspectionDetail.endDate
        }}</span>
        <!-- <span
          v-margin-top="8"
          v-if="
            inspectionDetail.endTime !== null && inspectionDetail.endTime !== ''
          "
          class="bold"
          >End Time</span
        >
        <span v-margin-top="8" v-if="inspectionDetail.endTime !== null">{{
          inspectionDetail.endTime
        }}</span> -->
      </div>
      <div v-margin-top="8" v-grid="2">
        <span class="bold"></span>
        <span></span>
      </div>

      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
      >
        <span class="bold"></span>
        <span></span>
      </div>
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
      >
        <span class="bold"></span>
        <span></span>
      </div>
      <span
        class="sub-header bold"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
        >Assignment Details</span
      >
      <!-- <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          inspectionDetail.createdForAssetGroupUUID !== null && inspectionDetail.createdForAssetGroupUUID !== undefined &&
          inspectionDetail.createdForAssetGroupUUID !== ''
        ">
        <span class="bold">Assignment Type</span>
        <span>Assets Group</span>
      </div>
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          inspectionDetail.createdForUserUUID !== null && inspectionDetail.createdForAssetGroupUUID !== undefined  &&
          inspectionDetail.createdForUserUUID !== ''"
      >
        <span class="bold">Assignment Type</span>
        <span>User</span>
      </div>  
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          inspectionDetail.assetUUID !== null && inspectionDetail.assetUUID !== undefined &&
          inspectionDetail.assetUUID !== ''
        "
      >
        <span class="bold">Assign to</span>
        <span>Assets</span>
      </div>
      -->
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
      >
        <span class="bold">Assigned To</span>
        <span>{{ inspectionDetail.assignedToName }}</span>
      </div>

      <!-- <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          inspectionDetail.selectedUserAssetName !== null &&
          inspectionDetail.selectedUserAssetName !== ''
        "
      >
        <span class="bold">Asset Selected User</span>
        <span>{{ inspectionDetail.selectedUserAssetName }}</span>
      </div> -->
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
      >
        <span class="bold">Assigned By</span>
        <span>{{ inspectionDetail.createdByUserName }}</span>
      </div>
      <div
        v-margin-top="8"
        v-grid="2"
        v-if="
          createInspection !== true &&
          edit !== false &&
          inspectionDetail.frequencyType !== null
        "
      ></div>
      <div v-margin-top="8" v-grid="2">
        <span class="bold"></span>
        <span></span>
      </div>
    </div>
    <SButton
      v-if="createInspection === true"
      title="Create Inspection Template"
      @click="createInspectionTemplate"
    />
    <SButton
      v-if="this.$route.name == 'edit-inspection-template-detail'"
      title="Update Inspection Template"
      @click="updateInspectionTemplate"
    />
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      deadlineDate: "",
      deadlineTime: "",
      disabled: false,
      selectedDayBar: "",
    };
  },
  props: {
    edit: {},
    disable: {},
    viewInspection: {},
    createInspection: {},
    templateName: {},
    assetCategory: {},
    inspectionDetail: {},
    lastUpdatedByName: {},
  },
  created() {
    if (this.deadLineDate !== undefined) {
      this.deadLineDate = moment(this.inspectionDetail.deadLineDate).format(
        "DD MMM YYYY"
      );
      this.deadLineTime = moment(this.inspectionDetail.deadLineDate).format(
        " hh:mm"
      );
    }
    if (this.frequencyDays !== undefined) {
      var timerid = setTimeout(() => {
        if (this.inspectionDetail.frequencyDays !== null) {
          var a = JSON.parse(this.inspectionDetail.frequencyDays);
          var b = a.map(function (val) {
            return val.name;
          });
          this.selectedDayBar = b;
          // console.log('bbbbb',typeof b)
          // for (let x in b) {
          //   this.selectedDayBar = b[x];
          //   console.log('this.selectedDayBar',this.selectedDayBar)
          // }
        }
      }, 3000);
    }
  },

  methods: {
    createInspectionTemplate() {
      this.$emit("create");
    },
    updateInspectionTemplate() {
      this.$emit("update");
    },
  },
};
</script>

<style lang="scss" scoped></style>
