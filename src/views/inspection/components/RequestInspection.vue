<template>
  <div>
    <SDialog
      :width="880"
      :persistent="true"
      :crossIcon="true"
      @close="close"
      :title="'Request Additional Inspection'"
    >
      <div style="padding: 24px 30px">
        <div class="column-grid-2">
          <div>
            <SInput
              label="Ad-hoc Name*"
              v-model="requestObj.name"
              :error="getFormErrorMessage($v.requestObj.name)"
            />
          </div>

          <div>
            <SInput
              label="Asset Name*"
              v-model="requestObj.assetName"
              :error="getFormErrorMessage($v.requestObj.assetName)"
            />
          </div>

          <div v-if="selectedType == 'ad-hoc'">
            <SInput
              label="Select Deadline*"
              v-model="requestObj.deadline"
              :icon="'calendar'"
              :type="'datePicker'"
              @input="checkDate()"
              :error="getFormErrorMessage($v.requestObj.deadline)"
            />
          </div>

          <div v-if="selectedType == 'ad-hoc'">
            <STimePicker
              manual-input
              label="Select Time*"
              :format="''"
              :border="true"
              close-on-complete
              v-model="requestObj.adhocTime"
              :error="getFormErrorMessage($v.requestObj.adhocTime)"
            />
          </div>
        </div>
        <div class="separator"></div>

        <div class="heading pb-16">Reminders</div>

        <div
          class="reminder-column-grid-4"
          v-for="(item, index) in requestObj.reminderArray"
          :key="index"
        >
          <div>
            <SMultipleSelect
              :label="'Reminder*'"
              :checkbox="checkbox"
              :avatar="false"
              :data="item.reminderOptions"
              :optionLabel="'label'"
              v-model="item.reminder"
              @input="onSelectedReminder(index, item)"
              :error="
                getFormErrorMessage(
                  $v.requestObj.reminderArray.$each[index].reminder
                )
              "
            />
          </div>

          <div>
            <SSelect
              label="Duration Type*"
              v-model="item.durationType"
              :source="item.durationTypeOptions"
              resultsValue="value"
              resultsDisplay="label"
              :autocomplete="true"
              @selected="onSelectedDurationTime"
              :key="durationTypeID + 'typeId'"
              @clear="clearSelectedDurationType(index)"
              :error="
                getFormErrorMessage(
                  $v.requestObj.reminderArray.$each[index].durationType
                )
              "
            />
          </div>

          <div>
            <SInput
              label="Duration"
              type="number"
              v-model="item.durationValue"
              @input="checkMinValue(index)"
              :error="
                getFormErrorMessage(
                  $v.requestObj.reminderArray.$each[index].durationValue
                )
              "
            />
          </div>
          <div class="icons">
            <img
              v-if="selectedType == 'ad-hoc'"
              src="../../../assets/icons/Add.png"
              class="icon"
              @click="addReminder(index)"
              alt=""
            />
            <img
              v-if="
                selectedType == 'ad-hoc' && requestObj.reminderArray.length > 1
              "
              src="../../../assets/icons/Subtract.png"
              class="icon"
              @click="removeReminder(index)"
              alt=""
            />
          </div>
        </div>

        <div class="separator"></div>
        <div class="column-grid-1">
          <SSelect
            v-margin-top="24"
            label="Assign To*"
            v-model="assignee"
            :source="assignees"
            resultsValue="value"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onSelectedAssignee"
            @clear="clearSelectedAssignee"
            :key="userGroupId + 'assignee'"
            :error="getFormErrorMessage($v.assignee)"
          />
        </div>

        <div class="or-column-grid-3" v-if="assignee == 'user'">
          <div>
            <SSelect
              :label="'User Group'"
              v-model="requestObj.assignedUserGroup"
              :source="userGroups"
              resultsValue="uuid"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="onSelectedUserGrp"
              :key="userGroupId + 'userGroup'"
            />
          </div>
          <div>
            <span class="bold">OR</span>
          </div>
          <div>
            <SSelect
              :label="'User'"
              v-model="requestObj.assignedUser"
              :source="assignUsers"
              resultsValue="uuid"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="onSelectedUser"
              :key="userId + 'assetUser'"
            />
          </div>
        </div>

        <div class="custom-border"></div>

        <div v-padding="'24px 0px'">
          <b>Template Name:</b> {{ this.selectedTempItems.name }}
        </div>

        <div class="btns">
          <SButton title="Select Template*" @click="addTemplate" class="btn" />

          <SButton
            title="Create"
            @click="createAdditionalInspection"
            class="btn"
          />
        </div>
      </div>
    </SDialog>
    <SelectTemplate
      v-if="showTempPopUp"
      @close="tempClose"
      @selected="selectedTempItems"
      @SelectedTempItems="SelectedTempItems"
    />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import SelectTemplate from "../../../views/inspection/components/SelectTemplate";
import { Functions } from "@/shared/Functions";
import { required, minValue } from "vuelidate/lib/validators";
import InspectionService from "../../../services/InspectionService";
import moment from "moment";

import loader from "@/components/Loader.vue";
export default {
  name: "RequestInspection",

  components: {
    SelectTemplate,
    loader,
  },

  data() {
    return {
      loaderFlag: false,
      usageToggle: "template",
      designToggle: "props",
      avatar: false,
      checkbox: true,
      error: false,
      border: false,
      icon: true,
      addNew: false,
      count: true,
      sortList: false,
      groups: false,
      model: [{ name: "Demo Option 1" }],
      options: null,
      componentKey: 0,
      message: "Copied to clipboard",
      msgType: "success",
      requestObj: {
        name: "",
        assetName: "",
        deadline: "",
        adhocTime: "",
        reminderArray: [
          {
            reminder: [],
            reminderOptions: [
              // { label: "All", value: "all" },
              { label: "Email", value: "email" },
              { label: "SMS", value: "sms" },
              { label: "Notification", value: "notification" },
            ],
            durationValue: "",
            durationType: "",
            durationTypeOptions: [
              { label: "Minutes", value: "minutes" },
              { label: "Hours", value: "hours" },
              { label: "Days", value: "days" },
              { label: "Weeks", value: "weeks" },
            ],
          },
        ],
        assignedUserGroup: "",
        assignedUser: "",
      },
      showTempPopUp: false,
      type: [{ name: "Ad-hoc", value: "ad-hoc" }],
      selectedType: "ad-hoc",

      schedule: [
        { name: "Daily", value: "daily" },
        { name: "Weekly", value: "weekly" },
      ],
      selectedSchedule: "",
      assignee: "",
      assignees: [{ name: "Users", value: "user" }],
      allUsers: [],
      userGroups: [],
      assignUsers: [],
      groupAssetOptions: [],
      assetName: "",
      userId: 0,
      userGroupId: 0,
      durationTypeID: 0,
      selectedTempItems: [],
    };
  },
  props: {
    asset: {},
    tempName: String,
    serviceRequestUUID: {},
    showToast: {},
  },
  methods: {
    checkDate() {
      let currentDate = moment()
        .format()
        .split("T");
      currentDate = currentDate[0];
      if (moment(this.requestObj.deadline).isBefore(currentDate)) {
        this.requestObj.deadline = "";
        return this.$emit(
          "showToast",
          "Deadline Date must be Current Date or Future Date",
          "error"
        );
      }
    },

    checkMinValue(index) {
      this.$v.requestObj.reminderArray.$each[index].durationValue.$touch();
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    clearSelectedAssignee() {
      this.assignee = "";
      this.requestObj.assignedUser = "";
      this.requestObj.assignedUserGroup = "";
      this.userGroupId++;
    },

    clearSelectedDurationType(index) {
      this.requestObj.reminderArray[index].durationType = "";
      this.durationType++;
    },

    SelectedTempItems(value) {
      this.selectedTempItems = value;
      this.$emit("selectedTemplates", this.selectedTempItems);
    },
    close() {
      this.$emit("close");
    },
    onSelectedType(val) {
      // console.log(val);
    },
    onSelectedSchedule(val) {
      // console.log(val);
    },
    onSelectedReminder(index, val) {
      if (val.display !== "") {
        //	for (let index = 0; index < this.requestObj.reminderArray.length; index++) {
        this.requestObj.reminderArray[index].durationType = "days";
        this.requestObj.reminderArray[index].durationValue = "1";
        //	}
        this.durationTypeID++;
      }
    },
    onSelectedDurationTime(val) {
      // console.log(val);
    },
    onSelectedAssignee(val) {
      // console.log(val);
    },
    onSelectedUserGrp(val) {
      this.requestObj.assignedUser = "";
      this.userId++;
    },
    onSelectedUser(val) {
      this.requestObj.assignedUserGroup = "";
      this.userGroupId++;
    },
    selectTemplate() {
      this.$emit("selectTemp");
    },
    createAdditionalInspection() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.loaderFlag = true;
      if (
        this.requestObj.assignedUser == "" &&
        this.requestObj.assignedUserGroup == ""
      ) {
        this.$emit("showToast", "Please select or user or user group", "error");
        this.loaderFlag = false;
        return;
      }
      if (this.selectedTempItems == "") {
        this.$emit("showToast", "Please select template", "error");
        this.loaderFlag = false;
        return;
      }
      this.requestObj.selectedTemplate = this.selectedTempItems;
      this.$emit("createInspection", this.requestObj);
    },
    add(index) {
      this.$emit("addReminders", index);
    },
    clickRemove(index) {
      this.$emit("removeReminders", index);
    },
    addTemplate() {
      this.showTempPopUp = true;
    },
    tempClose() {
      this.showTempPopUp = false;
    },
    addReminder() {
      this.requestObj.reminderArray.push({
        reminder: [],
        reminderOptions: [
          // { label: "All", value: "all" },
          { label: "Email", value: "email" },
          { label: "SMS", value: "sms" },
          { label: "Notification", value: "notification" },
        ],
        durationValue: "",
        durationType: "",
        durationTypeOptions: [
          { label: "Minutes", value: "minutes" },
          { label: "Hours", value: "hours" },
          { label: "Days", value: "days" },
          { label: "Weeks", value: "weeks" },
        ],
      });
    },
    removeReminder(index) {
      if (index !== 0) {
        this.requestObj.reminderArray.splice(index, 1);
      }
    },

    getUsersAndUserGroups(tenantUUID) {
      InspectionService.getInspectionTemplateByUUID("none", tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            let userAndGroups = response.data.userAndGroupResponse;
            this.assignUsers = userAndGroups.userDTOS;
            this.userGroups = userAndGroups.userGroupDTOS;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  created() {
    let currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.requestObj.name = "Ad-hoc" + " " + this.tempName;
    this.requestObj.assetName = this.asset.name;
    this.requestObj.serviceRequestUUID = this.serviceRequestUUID;
    this.getUsersAndUserGroups(currentUserDetails.profile.organizationId);
  },
  assigned(value) {
    if (value === "Assets") {
      this.assignedUser = "";
      this.assignedUserGroup = "";
      //	this.disableUser = false;
    } else if (value === "Users") {
      this.assetName = "";
      this.assetGroups = "";
    }
  },
  validations: function() {
    return {
      assignee: { required },
      requestObj: {
        name: { required },
        assetName: { required },
        deadline: { required },
        adhocTime: { required },
        reminderArray: {
          $each: {
            reminder: { required },
            durationValue: { required, minValue: minValue(1) },
            durationType: { required },
          },
        },
      },
      //	...this.getValidation,
    };
  },

  computed: {
    // 	getValidation() {
    // 	let validations = {};
    // 	if (this.assignee != "") {
    // 		validations = {
    // 			assignedUser: {},
    // 			assignedUserGroup: {},
    // 		};
    // 	} else if(this.requestObj.assignedUserGroup === '' && this.requestObj.assignedUser === ''){
    // 		validations = {
    // 			assignedUser: { required },
    // 			assignedUserGroup: { required },
    // 		};
    // 	}
    // 	return validations;
    // },
  },
};
</script>

<style lang="scss" scoped>
.heading {
  font-size: 14px;
  font-weight: bold;
  margin-top: 24px;
}
.btns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 80px;
  .btn {
    height: 40px;
  }
}
.icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon {
  cursor: pointer;
  opacity: 0.5;
  width: 24px;
  background-color: transparent;
  transition: all 0.3s;
}
.icon:hover {
  opacity: 1;
  background-color: var(--secondary);
}
.icon:active {
  opacity: 0.3;
}
</style>
