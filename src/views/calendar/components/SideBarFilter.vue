<template>
  <div id="main">
    <div id="mySidebar" class="sidebar">
      <div class="filter-head">
        <div class="left-side">
          <img
            class="filter"
            style="cursor: pointer"
            src="assets/icons/Filter.svg"
            alt=""
            @click="applyFun"
          />
          <p style="font-size: 30px; margin: 7px 0">Filters</p>
        </div>
        <div class="right-side">
          <img
            class="refresh"
            style="cursor: pointer"
            src="assets/icons/refresh.svg"
            alt=""
          />
          <SButton title="Apply" />
          <img
            class="close"
            style="cursor: pointer"
            src="assets/icons/Close.svg"
            alt=""
            @click="closeNav"
          />
        </div>
      </div>

      <div class="check-box">
        <SCheckBox
          v-model="inspection"
          label="Inspection"
          @input="checkboxFun"
        />
        <SCheckBox
          v-model="workOrder"
          label="Work Order"
          @input="checkboxFun"
        />
        <SCheckBox
          v-model="assignment"
          label="Assignment"
          @input="checkboxFun"
        />

        <SCheckBox
          v-model="srRequest"
          label="Service Request"
          @input="checkboxFun"
        />

        <SCheckBox
          style="padding-top:16px"
          v-model="issue"
          label="Issue"
          @input="checkboxFun"
        />
      </div>
      <div class="inspection two-column-div" v-if="inspection">
        <span class="label">Inspection</span>
        <span></span>
        <SSelect
          label="Asset Name/ Number"
          v-model="inspectionType"
          :source="AssetsArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <ejs-daterangepicker
          id="idaterangepicker"
          v-model="iScheduledAt"
          placeholder="Inspection At"
        ></ejs-daterangepicker>

        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Inspection By"
          v-model="inspectionBy"
          :source="UsersArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Status"
          v-model="inspectionStatus"
          :source="inspectionStatusArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <ejs-daterangepicker
          id="rdaterangepicker"
          v-model="rScheduledAt"
          placeholder="Requested/Created At"
        ></ejs-daterangepicker>

        <!-- :error="$v.model.$error" -->
        <ejs-daterangepicker
          id="cdaterangepicker"
          v-model="cScheduledAt"
          placeholder="Requested/Created By"
        ></ejs-daterangepicker>

        <!-- :error="$v.model.$error" -->
      </div>
      <div class="workOrder two-column-div" v-if="workOrder">
        <span class="label">Work Order</span>
        <span></span>
        <SSelect
          label="Asset Name/ Number"
          v-model="assetName"
          :source="AssetsArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <ejs-daterangepicker
          id="daterangepicker"
          v-model="WscheduledAt"
          placeholder="Scheduled At"
        ></ejs-daterangepicker>

        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Priority"
          v-model="workOrderPriority"
          :source="workOrderPriorityArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Assigned To"
          v-model="workOrderAssignedTo"
          :source="UsersArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Status"
          v-model="workOrderStatus"
          :source="workOrderStatusArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Shift"
          v-model="workOrderShift"
          :source="workOrderShiftArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
      </div>
      <div class="assignment two-column-div" v-if="assignment">
        <span class="label">Assignment</span>
        <span></span>
        <SSelect
          label="Asset Name/ Number"
          v-model="assignmentAssetName"
          :source="AssetsArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Assigned To"
          v-model="assignmentAssignedTo"
          :source="UsersArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <!-- date -->
        <ejs-daterangepicker
          id="adaterangepicker"
          v-model="aScheduledAt"
          placeholder="Scheduled/Assigned"
        ></ejs-daterangepicker>
        <!-- <SSelect
					label="Scheduled/Assigned"
					v-model="assignmentScheduled"
					:source="assignmentScheduledArray"
					resultsValue="resultsValue"
					resultsDisplay="resultsDisplay"
					:autocomplete="false"
					@selected="onSelected"
				/> -->
      </div>
      <div class="inspection two-column-div" v-if="srRequest">
        <span class="label">Service Request</span>
        <span></span>
        <SSelect
          label="Priority"
          v-model="srPriority"
          :source="srPriorityArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Asset"
          v-model="srAsset"
          :source="AssetsArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Category"
          v-model="srCategory"
          :source="srCategoryArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <SSelect
          label="Type"
          v-model="rType"
          :source="rTypeArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Reported By"
          v-model="srReportedBy"
          :source="UsersArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Resolved By"
          v-model="srResolvedBy"
          :source="UsersArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Status"
          v-model="srStatus"
          :source="srStatusArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
      </div>
      <div class="inspection two-column-div" v-if="issue">
        <span class="label">Issues</span>
        <span></span>
        <SSelect
          label="Priority"
          v-model="iPriority"
          :source="iPriorityArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Asset"
          v-model="iAsset"
          :source="AssetsArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Category"
          v-model="iCategory"
          :source="iCategoryArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <SSelect
          label="Type"
          v-model="iType"
          :source="iTypeArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
        <!-- :error="$v.model.$error" -->
        <SSelect
          label="Reported By"
          v-model="iReportedBy"
          :source="UsersArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <SSelect
          label="Resolved By"
          v-model="iResolvedBy"
          :source="UsersArray"
          resultsValue="uuid"
          resultsDisplay="name"
          :autocomplete="false"
          @selected="onSelected"
        />
        <SSelect
          label="Status"
          v-model="iStatus"
          :source="iStatusArray"
          resultsValue="resultsValue"
          resultsDisplay="resultsDisplay"
          :autocomplete="false"
          @selected="onSelected"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import AssetPersonnelService from "../../../services/AssetPersonnelService";
import AssetManagementService from "../../../services/AssetManagementService";
export default {
  name: "SideBarFilter",

  components: {},
  props: {
    flag: Boolean,
  },

  data() {
    return {
      currentUserDetails: "",
      assignment: false,
      workOrder: false,
      inspection: true,
      issue: false,
      srRequest: false,
      model: "",
      source: "",
      UsersArray: [],
      AssetsArray: [],
      inspectionType: "",
      inspectionTypeArray: [],
      inspectionAt: "",
      inspectionAtArray: [],
      inspectionBy: "",
      inspectionByArray: [],
      inspectionStatus: "",
      inspectionStatusArray: [
        { resultsDisplay: "Passed", resultsValue: "pass" },
        { resultsDisplay: "Failed", resultsValue: "fail" },
        {
          resultsDisplay: "Pass with Comments",
          resultsValue: "pass-with-comments",
        },
      ],
      inspectionRequestByName: "",
      inspectionRequestByArray: [],
      assetName: "",
      assetNameArray: [],
      scheduleAtWorkOrder: "",
      scheduleAtWorkOrderArray: [],
      workOrderPriority: "",
      workOrderPriorityArray: [
        { resultsDisplay: "Low", resultsValue: "low" },
        { resultsDisplay: "Medium", resultsValue: "medium" },
        { resultsDisplay: "High", resultsValue: "high" },
      ],
      workOrderAssignedTo: "",
      workOrderAssignedToArray: [],
      workOrderStatus: "",
      workOrderStatusArray: [
        { resultsDisplay: "Open", resultsValue: "open" },
        { resultsDisplay: "In-Progress", resultsValue: "Inprogress" },
        { resultsDisplay: "Closed", resultsValue: "closed" },
      ],
      workOrderShift: "",
      workOrderShiftArray: [
        { resultsDisplay: "Morning", resultsValue: "morning" },
        { resultsDisplay: "Afternoon", resultsValue: "afternoon" },
        { resultsDisplay: "Evening", resultsValue: "evening" },
      ],
      assignmentAssetName: "",
      assignmentAssetNameArray: [],
      assignmentAssignedTo: "",
      assignmentAssignedToArray: [],
      assignmentScheduled: "",
      assignmentScheduledArray: [],
      srPriority: "",
      srPriorityArray: [
        { resultsDisplay: "Low", resultsValue: "low" },
        { resultsDisplay: "Medium", resultsValue: "medium" },
        { resultsDisplay: "High", resultsValue: "high" },
      ],
      srAsset: "",
      srAssetArray: [],
      srCategory: "",
      srCategoryArray: [],
      rType: "",
      rTypeArray: [],
      srReportedBy: "",
      srReportedByArray: [],
      srResolvedBy: "",
      srResolvedByArray: [],
      srStatus: "",
      srStatusArray: [
        { resultsDisplay: "New", resultsValue: "new" },
        { resultsDisplay: "Reported", resultsValue: "reported" },
        { resultsDisplay: "In-Progress", resultsValue: "Inprogress" },
        { resultsDisplay: "Resolved", resultsValue: "resolved" },
        { resultsDisplay: "Ignored", resultsValue: "ignore" },
      ],
      iPriority: "",
      iPriorityArray: [
        { resultsDisplay: "Low", resultsValue: "low" },
        { resultsDisplay: "Medium", resultsValue: "medium" },
        { resultsDisplay: "High", resultsValue: "high" },
      ],
      iAsset: "",
      iAssetArray: [],
      iCategory: "",
      iCategoryArray: [],
      iType: "",
      iTypeArray: [],
      iReportedBy: "",
      iReportedByArray: [],
      iResolvedBy: "",
      iResolvedByArray: [],
      iStatus: "",
      iStatusArray: [
        { resultsDisplay: "Reported", resultsValue: "reported" },
        { resultsDisplay: "In-Progress", resultsValue: "Inprogress" },
        { resultsDisplay: "Resolved", resultsValue: "resolved" },
        { resultsDisplay: "Ignored", resultsValue: "ignore" },
      ],
      requestedAt: "",
      WscheduledAt: "",
      aScheduledAt: "",
      iScheduledAt: "",
      rScheduledAt: "",
      cScheduledAt: "",
    };
  },

  methods: {
    openNav() {
      document.getElementById("mySidebar").style.width = "550px";
      document.getElementById("main").style.marginRight = "550px";
    },
    closeNav() {
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginRight = "0";
    },
    applyFun() {},
    checkboxFun() {},
    filterFunss() {
      if (this.flag) {
        this.openNav();
      } else if (!this.flag) {
        this.closeNav();
      }
    },
    onSelected() {},
    filterUser() {
      AssetPersonnelService.getUserNameAndUUID(
        this.currentUserDetails.profile.organizationId
      )
        .then((res) => {
          this.UsersArray = res.data.userDTOS;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getAssetNameAndNumber() {
      AssetManagementService.getAssetNameAndNumberByTenantUUID(
        this.currentUserDetails.profile.organizationId
      )
        .then((res) => {
          this.AssetsArray = res.data.assetDTOS;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  destroyed() {},
  mounted() {
    this.filterFunss();
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.filterUser();
    this.getAssetNameAndNumber();
  },
  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  width: 0;
  position: absolute;
  z-index: 1;
  top: 72px;
  right: 0;
  background-color: #ffff;
  overflow-x: hidden;
  box-shadow: 0 0 50px 0 var(--very-light-pink);
}
#main {
  background-color: #fff;
  width: 100%;
}
.filter-head {
  background-color: #fff;
  padding: 10px 0;
  box-shadow: 0 5px 5px 2px var(--very-light-pink);
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.left-side {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.right-side {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  float: right;
}
.filter {
  width: 23px;
  height: 43px;
  padding: 5px 0px 5px 30px;
  cursor: pointer;
}
.refresh {
  width: 23px;
  height: 43px;
  cursor: pointer;
  padding: 3px 18px 0 75px;
}
button.button {
  padding: 18px 27px;
}
.close {
  padding: 10px 20px;
  width: 30px;
}
.check-box {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 20px 8px;
}
.two-column-div {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 8px;
  padding: 8px 8px;
}
.label {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  padding: 0;
}
</style>
