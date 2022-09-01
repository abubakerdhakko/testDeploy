<template>
  <div class="pt-32 pb-80">
    <div class="head-title">{{ templateNumber }} - {{ templateName }}</div>
    <div class="subtitle pt-8"></div>

    <div class="main-page pt-32">
      <div>
        <div class="row-col-gap">
          <SAccordion
            title="Inspection Template Detail"
            expandIcon="arrows"
            :open="true"
            padding="48"
            ref="assignedItem"
            @state="clickAssignedAccordionFunction"
          >
            <div class="column-grid-2" v-padding="'30px 48px 30px 48px'">
              <SInput
                label="Assigned Inspection Name"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.templateName)"
                v-model="templateName"
              />

              <SInput
                label="Assignment Frequency"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.assignmentFrequency)"
                v-model="assignmentFrequency"
              />
              
              <!-- endType -->
              <div class="parebt-div">
              <label class="caption">Repeat Every 
                <span v-if="assignmentFrequency == 'ad-hoc'">(Ad-Hoc)</span>
                <span v-if="assignmentFrequency == 'daily'">(Days)</span>
                <span v-if="assignmentFrequency == 'weekly'">(Week)</span>
                <span v-if="assignmentFrequency == 'monthly'">(Month)</span>
                <span v-if="assignmentFrequency == 'yearly'">(year)</span>
              </label>
              <SInput
                v-if="repeatEvery !== '' && repeatEvery !== '0'"
                label=""
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.repeatEvery)"
                v-model="repeatEvery"
              />
              </div>
              <!-- endType -->
              <SInput
                v-if="repeatMonthDay"
                label="Repeat Month Day"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.repeatMonthDay)"
                v-model="repeatMonthDay"
              />
             
              <SInput
                v-if="monthlyDate"
                label="Monthly Date"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.monthlyDate)"
                v-model="monthlyDate"
              />

              <SInput
                v-if="selectedDay && inspectionDetail.frequencyType !== 'yearly'"
                label="Selected Day"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.selectedDay)"
                v-model="selectedDay"
              />
            <SInput
                v-if="selectedDay && inspectionDetail.frequencyType == 'yearly'"
                label="Selected Months"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.selectedDay)"
                v-model="selectedDay"
              />
              <SInput
                v-if="deadlineDate && inspectionDetail.frequencyType !== 'daily'"
                label="Deadline Date"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.deadlineDate)"
                v-model="deadlineDate"
              />
              <SInput
                v-if="deadlineTime"
                label="Deadline Time"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.deadlineTime)"
                v-model="deadlineTime"
              />
              <SInput
                v-if="startDate !== 'Invalid date' && startDate !== ''"
                label="Start Date "
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.startDate)"
                v-model="startDate"
              />
              <SInput
                v-if="startTime"
                label="Start Time"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.startTime)"
                v-model="startTime"
              />
              <SInput
                v-if="repeatEveryType"
                label="Repeat Every"
                :readonly="fieldsDisable"
                v-model="repeatEveryType"
              />
              <SMultipleSelect
                :label="'Frequency Days'"
                :checkbox="checkbox"
                :avatar="false"
                :data="weeklyDays"
                :optionLabel="'name'"
                v-model="frequencyDays"
                @input="selectFrequencyDays"
                v-if="freFlag == null"
                :key="indexValue"
              />

              <SInput
                v-if="endTime"
                label="End Time"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.endTime)"
                v-model="endTime"
              />
               <!-- endType -->
              <SInput
                v-if="endType !== '' && endType !== null"
                label="End type"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.endType)"
                v-model="endType"
              />
              <!-- endType -->
              <SInput
                v-if="occurrence !== '' && occurrence !== null && occurrence !== 0"
                label="Occurrence"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.occurrence)"
                v-model="occurrence"
              />
              <SInput
                v-if="endDate !== 'Invalid date' && endDate !== ''"
                label="End Date"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.endDate)"
                v-model="endDate"
              />
              <SInput
                label="Assigned To"
                :readonly="fieldsDisable"
                v-model="assignedToName"
              />
              <SInput
                label="Assigned By"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.assignedBy)"
                v-model="assignedBy"
              />
            </div>
          </SAccordion>
          <SAccordion
            title="Template Reminders"
            expandIcon="arrows"
            :open="false"
            padding="48"
            ref="reminderinspectionItem"
            @state="templateReminderAccordionFunction"
            :shadow="true"
          >
            <div
              class="column-grid-3"
              v-padding="'30px 48px 30px 48px'"
              v-for="(item, index) in reminderArray"
              :key="index"
            >
              <SMultipleSelect
                :label="'Reminder'"
                :checkbox="checkbox"
                :avatar="false"
                :data="item.reminderOptions"
                :optionLabel="'name'"
                v-model="item.reminder"
                @selected-values="onSelectedReminder"
                :key="indexReminder + 'key'"
                :readonly="fieldsDisable"
              />

              <SInput
                label="Duration"
                type="number"
                v-model="item.durationValue"
                :readonly="fieldsDisable"
              />

              <SSelect
                label="Duration Type"
                v-model="item.durationType"
                :source="item.durationTypeOptions"
                resultsValue="value"
                resultsDisplay="name"
                :autocomplete="true"
                @selected="onSelectedDurationTime"
                :readonly="fieldsDisable"
              />

              <div class="icons">
                <img
                  v-if="selectedType == 'ad-hoc'"
                  src="/assets/icons/Add.png"
                  class="icon"
                  @click="addReminder(index)"
                  alt=""
                />
                <img
                  v-if="selectedType == 'ad-hoc'"
                  src="/assets/icons/Subtract.png"
                  class="icon"
                  @click="removeReminder(index)"
                  alt=""
                />
              </div>
            </div>
          </SAccordion>

          <SAccordion
            title="Inspection Items"
            expandIcon="arrows"
            :open="false"
            padding="48"
            ref="inspectionItem"
            @state="clickInspectionAccordionFunction"
            :shadow="true"
          >
            <div
              class="row-col-gap"
              v-for="(inspection, index) in inspectionItems"
              :key="index"
            >

              <span
                v-padding="'16px 48px 0px 48px'"
                style="font-size: 14px; font-weight: bold"
              >
              <SInput
                label="Template Number"
                :readonly="fieldsDisable"
                :error="getFormErrorMessage($v.templateNumber)"
                v-model="templateNumber"
              />
              </span>
              <span
                v-padding="'16px 48px 0px 48px'"
                style="font-size: 14px; font-weight: bold"
              >
                Item# {{ index + 1 }}
              </span>
              <div class="column-grid-2" v-padding="'0px 48px 0 48px'">
                <SInput
                  v-padding="'16px 0 0px 0'"
                  :readonly="fieldsDisable"
                  label="Item Name *"
                  v-model="inspection.name"
                  :error="
                    getFormErrorMessage($v.inspectionItems.$each[index].name)
                  "
                />
                <SInput
                  v-padding="'16px 0 0px 0'"
                  :readonly="fieldsDisable"
                  label="Question *"
                  v-model="inspection.description"
                  :error="
                    getFormErrorMessage(
                      $v.inspectionItems.$each[index].description
                    )
                  "
                />
              </div>
              <div class="column-grid-2" v-padding="'0px 48px 0 48px'">
                <SSelect
                  label="Answer Type *"
                  v-model="inspection.typeLabel"
                  :source="answerTypeOptions"
                  resultsValue="label"
                  resultsDisplay="label"
                  :readonly="fieldsDisable"
                  :autocomplete="true"
                  :error="
                    getFormErrorMessage(
                      $v.inspectionItems.$each[index].typeLabel
                    )
                  "
                  @selected="
                    (value) => {
                      answerTypeSelected(value, index);
                    }
                  "
                />
                <!-- <div style="margin-top: -10px;"> -->
                <SCheckBox
                  v-model="inspection.mandatory"
                  label="Mandatory"
                  :readonly="fieldsDisable"
                  :disabled="false"
                  @input="mandatoryChecked(index)"
                />
              </div>
              <div>
                <img
                  v-if="inspectionItems.length > 1"
                  src="assets/icons/Delete.svg"
                  style="cursor: pointer; float: right"
                  @click="removeInspectionItems(index)"
                  v-padding="'0 48px 16px 48px'"
                  width="16px"
                  alt=""
                />
              </div>
              <div>
                <img
                  v-if="inspectionItems.length - 1 === index"
                  src="assets/icons/Add.svg"
                  style="cursor: pointer; float: right"
                  v-padding="'0 48px 16px 48px'"
                  width="16px"
                  alt=""
                />
              </div>
              <!-- </div> -->

              <div
                v-if="inspection.typeLabel === 'Multiple Choice'"
                class="row-col-gap"
              >
                <span
                  v-padding="'0px 48px 0px 48px'"
                  style="margin-top: -24px; font-size: 12px; font-weight: bold"
                  >Multiple Choice Options
                </span>
                <!-- <span>Multiple Choice Options</span> -->
                <div
                  style="margin-top: -8px"
                  v-padding="'0px 48px'"
                  v-for="(answer, answerIndex) in inspection.answers"
                  :key="answerIndex"
                >
                  <div class="multiple-choice-row">
                    <SInput
                      :label="'Option ' + (answerIndex + 1) + ' *'"
                      v-model="inspection.answers[answerIndex]"
                    />
                    <div>
                      <img
                        v-if="inspection.answers.length > 2"
                        style="cursor: pointer; float: right"
                        @click="removeMultipleChoice(index, answerIndex)"
                        width="16px"
                        src="assets/icons/Delete.svg"
                        alt=""
                      />
                    </div>
                    <div>
                      <img
                        v-if="
                          inspection.answers.length - 1 === answerIndex &&
                          answerIndex < 3
                        "
                        style="cursor: pointer; float: right"
                        @click="addMultipleChoice(index)"
                        width="16px"
                        src="assets/icons/Add.svg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div
                    style="padding-bottom: 32px"
                    v-if="inspection.answers.length === answerIndex + 1"
                  ></div>
                </div>
              </div>
              <div
                class="separator"
                v-if="inspectionItems.length !== index + 1"
              ></div>
            </div>
          </SAccordion>
        </div>
      </div>
      <div></div>

      <div>
        <Sidebar
          :viewInspection="viewInspection"
          :edit="fieldsDisable"
          :templateName="templateName"
          :assetCategory="assetCategoryLabel"
          :inspectionDetail="inspectionDetail"
        />
      </div>
    </div>

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import AssetManagementService from "../../services/AssetManagementService";
import InspectionService from "../../services/InspectionService";
import Sidebar from "./components/Sidebar";
import moment from "moment";
import { required } from "vuelidate/lib/validators";

import loader from "@/components/Loader.vue";
export default {
  name: "CreateInspectionTemplate",

  data() {
    return {
      loaderFlag: false,
      assignedToName: "",
      indexValue: 0,
      name: "",
      fieldsDisable: "",
      inspectionTempUUID: "",
      selectedType: "ad-hoc",
      createInspection: false,
      assetIndex: 0,
      indexReminder: 0,
      durationTypeID: 0,
      duration: 0,
      checkbox: true,
      currentUserDetails: null,
      inspectionTemplate: null,
      templateName: "",
      assetCategoryLabel: "",
      assetCategory: "",
      assetCategories: [],
      inspectionDetail: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      selectedDay: "",
      monthlyDate: "",
      repeatEveryType: "",
      repeatMonthDay:"",
      occurrence:"",
      frequencyDays: [],
      inspectionItems: [
        {
          name: "",
          type: "",
          mandatory: true,
          description: "",
          answers: [],
        },
      ],
      weeklyDays: [
        { name: "Sunday", value: "SUNDAY" },
        { name: "Monday", value: "MONDAY" },
        { name: "Tuesday", value: "TUESDAY" },
        { name: "Wednesday", value: "WEDNESDAY" },
        { name: "Thursday", value: "THURSDAY" },
        { name: "Friday", value: "FRIDAY" },
        { name: "Saturday", value: "SATURDAY" },
      ],
      answerTypeOptions: [
        { label: "Text", value: "input" },
        { label: "Yes/No", value: "boolean" },
        { label: "Multiple Choice", value: "multiple" },
        { label: "Meter Reading", value: "numeric" },
      ],
      assignedInspectionName: "",
      templateNumber: "",
      assignmentFrequency: "",
      deadlineDate: "",
      endType: "",
      repeatEvery: "",
      deadlineTime: "",
      assignedBy: "",
      assignedTo: "",
      reminderArray: [
        {
          reminder: [],
          reminderOptions: [
            // { label: "All", value: "all" },
            { name: "Email", value: "email" },
            { name: "SMS", value: "sms" },
            { name: "Notification", value: "notification" },
          ],
          durationValue: "",
          durationType: "",
          durationTypeOptions: [
            { name: "Minutes", value: "minutes" },
            { name: "Hours", value: "hours" },
            { name: "Days", value: "days" },
            { name: "Weeks", value: "weeks" },
          ],
        },
      ],
      assetGroupOptions: [],
      groupAssetOptions: [],
      allUsers: [],
      userGroups: [],
      assignUsers: "",
      freFlag: false,
    };
  },
  components: {
    Sidebar,
    loader,
  },

  props: {
    inspectionTemplateUUID: { type: String },
  },

  created() {
    this.fieldsDisable = this.$route.params.flag;
    this.name = this.$route.params.TemplateType;
    document.title = this.$route.meta.title;
    this.viewInspection = false;
    this.edit = false;
    this.loaderFlag = true;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getExistingInspectionTemplate(
      this.$route.params.templateUUID,
      this.currentUserDetails.profile.organizationId
    );
  },

  methods: {
    onSelectedDurationTime(val) {
      console.log(val);
    },
    onSelectedReminder(val) {
      if (val.display !== "") {
        for (let index = 0; index < this.reminderArray.length; index++) {
          this.reminderArray[index].durationType = "days";
        }
      }
    },
    addReminder() {
      this.reminderArray.push({
        reminder: [],
        reminderOptions: [
          { name: "Email", value: "email" },
          { name: "SMS", value: "sms" },
          { name: "Notification", value: "notification" },
        ],
        durationValue: "",
        durationType: "",
        durationTypeOptions: [
          { name: "Minutes", value: "minutes" },
          { name: "Hours", value: "hours" },
          { name: "Days", value: "days" },
          { name: "Weeks", value: "weeks" },
        ],
      });
    },
    removeReminder(index) {
      if (index !== 0) {
        this.reminderArray.splice(index, 1);
      }
    },
    getFormErrorMessage(fieldValidation) {},

    selectFrequencyDays(val) {
      console.log(val);
    },
    getExistingInspectionTemplate(uuid, tenantUUID) {
      let inspectionItem = null;
      InspectionService.getInspectionTemplateByUUID(uuid, tenantUUID)
        .then((response) => {
          // console.log('zzzzzzzzz',response)
          if (response.status === 200) {
            this.groupAssetOptions =
              response.data.assetAndGroupsNameResponse.assetDTOS;
            this.assetGroupOptions =
              response.data.assetAndGroupsNameResponse.assetGroupDTOS;
            this.userGroups = response.data.userAndGroupResponse.userGroupDTOS;
            this.assignUsers = response.data.userAndGroupResponse.userDTOS;
            inspectionItem = response.data.inspectionTemplate;
            this.inspectionTemplate = response.data.inspectionTemplate;
            this.templateName = inspectionItem.name;
            this.templateNumber = inspectionItem.templateNumber;
            this.assignmentFrequency = inspectionItem.frequencyType;
            this.endType = inspectionItem.endType;
            this.repeatEvery = inspectionItem.repeatEvery;
            this.repeatMonthDay = inspectionItem.repeatMonthDay;
            this.occurrence = inspectionItem.occurrence
            if (inspectionItem.frequencyType === "ad-hoc") {
              this.deadlineTime = inspectionItem.deadLineTime;
            } else if (inspectionItem.frequencyType === "daily") {
              this.deadlineTime = inspectionItem.dailyDeadLineTime;
              inspectionItem.starDate = moment(inspectionItem.startDate).format(
                "DD MMM YYYY"
              );
              this.deadlineDate = moment().format("DD MMM YYYY");
            } else if (inspectionItem.frequencyType === "weekly") {
              this.startDate = moment(inspectionItem.starDate).format(
                "DD MMM YYYY"
              );
              this.startTime = inspectionItem.startTime;
              this.endDate = moment(inspectionItem.endDate).format(
                "DD MMM YYYY"
              );
              this.endTime = inspectionItem.endTime;
              this.selectedDay = inspectionItem.frequencyDays;
              var a = JSON.parse(inspectionItem.frequencyDays);
              // console.log('inspectionItem.frequencyDays',inspectionItem.frequencyDays)
              this.selectedDay = a.map(function (val) {
                return val.name;
              });

            } else if (inspectionItem.frequencyType === "yearly") {
               this.selectedDay = inspectionItem.frequencyDays;
              var bb = JSON.parse(inspectionItem.frequencyDays);
              // console.log('inspectionItem.frequencyDays',inspectionItem.frequencyDays)
              this.selectedDay = bb.map(function (val) {
                return val.name;
              });
            } 
            else if (inspectionItem.frequencyType === "monthly") {
              inspectionItem.monthlyDate = moment(
                inspectionItem.monthlyDate
              ).format("DD MMM YYYY");
              this.startDate = moment(inspectionItem.starDate).format(
                "DD MMM YYYY"
              );
              this.monthlyDate = inspectionItem.monthlyDate;
              this.endTime = inspectionItem.endTime;
              this.startTime = inspectionItem.startTime;
            } else if (inspectionItem.frequencyType === "custom") {
              this.repeatEveryType =
                inspectionItem.repeatEveryTime +
                " " +
                inspectionItem.repeatEveryType;
              if (
                inspectionItem.frequencyDays !== "" &&
                inspectionItem.frequencyDays !== null
              ) {
                this.frequencyDays = JSON.parse(inspectionItem.frequencyDays);
                this.freFlag = true;
              }
            }
            this.assignedBy = inspectionItem.createdByUserName;
            if (
              inspectionItem.assetUUID !== "" ||
              inspectionItem.assetUUID !== null
            ) {
              if (this.groupAssetOptions.length > 0) {
                let asset = this.groupAssetOptions.find(
                  (a) => a.uuid === inspectionItem.assetUUID
                );
                if (asset !== undefined && asset !== null && asset !== {}) {
                  this.assignedToName = asset.name;
                }
              }
            }
            if (
              inspectionItem.createdForAssetGroupUUID !== "" ||
              inspectionItem.createdForAssetGroupUUID !== null
            ) {
              if (this.assetGroupOptions.length !== 0) {
                let assetGroup = this.assetGroupOptions.find(
                  (ag) => ag.uuid === inspectionItem.createdForAssetGroupUUID
                );
                if (
                  assetGroup !== undefined &&
                  assetGroup !== null &&
                  assetGroup !== {}
                ) {
                  this.assignedToName = assetGroup.groupName;
                }
              }
            }
            if (
              inspectionItem.createdForUserGroupUUID !== "" ||
              inspectionItem.createdForUserGroupUUID !== null
            ) {
              if (this.userGroups.length !== 0) {
                let group = this.userGroups.find(
                  (g) => g.uuid === inspectionItem.createdForUserGroupUUID
                );
                if (group !== undefined && group !== null && group !== {}) {
                  this.assignedToName = group.name;
                }
              }
            }
            if (
              inspectionItem.createdForUserUUID !== "" ||
              inspectionItem.createdForUserName !== null
            ) {
              if (this.assignUsers.length !== 0) {
                let user = this.assignUsers.find(
                  (u) => u.uuid === inspectionItem.createdForUserUUID
                );
                if (user !== undefined && user !== null && user !== {}) {
                  this.assignedToName = user.name;
                }
              }
            }
            if (inspectionItem.deadLineDate !== null) {
              inspectionItem.deadLineDate = moment
                .utc(inspectionItem.deadLineDate)
                .format("DD MMM YYYY hh:mm");
              this.deadlineDate = moment(inspectionItem.deadLineDate).format(
                "DD MMM YYYY "
              );
              this.deadlineTime = moment(inspectionItem.deadLineDate)
                .local()
                .format("hh:mm");
            }

            if (inspectionItem.starDate !== null) {
              inspectionItem.starDate = moment(inspectionItem.starDate).format(
                "DD MMM YYYY"
              );
              this.startDate = moment(inspectionItem.starDate).format(
                "DD MMM YYYY"
              );
            }
            if (inspectionItem.endDate !== null) {
              inspectionItem.endDate = moment(inspectionItem.endDate).format(
                "DD MMM YYYY"
              );
              this.endDate = moment(inspectionItem.endDate).format(
                "DD MMM YYYY"
              );
            }
            inspectionItem.assignedToName = this.assignedToName;

            if (inspectionItem.frequencyType === "daily") {
              inspectionItem.deadLineDate = moment().format("DD MMM YYYY");
              inspectionItem.deadLineTime = inspectionItem.dailyDeadLineTime;
            }
            this.inspectionDetail = inspectionItem;

            let remind = JSON.parse(inspectionItem.reminder);

            this.reminderArray = [];
            for (let index = 0; index < remind.length; index++) {
              let reminder = [];
              remind[index].reminder.map((remind) => {
                if (remind.name !== undefined) {
                  reminder.push(remind);
                } else {
                  reminder.push({
                    name: remind.label,
                    value: remind.value,
                  });
                }
              });
              let obj = {
                reminder: reminder,
                durationValue: remind[index].durationValue,
                durationType: remind[index].durationType,
                reminderOptions: [
                  { name: "Email", value: "email" },
                  { name: "SMS", value: "sms" },
                  { name: "Notification", value: "notification" },
                ],
                durationTypeOptions: [
                  { name: "Minutes", value: "minutes" },
                  { name: "Hours", value: "hours" },
                  { name: "Days", value: "days" },
                  { name: "Weeks", value: "weeks" },
                ],
              };

              this.reminderArray.push(obj);
            }

            this.indexReminder++;
            AssetManagementService.getCategoriesList(
              this.currentUserDetails.profile.organizationId
            )
              .then((response) => {
                if (response.status === 200) {
                  this.assetCategories = response.data.categoryDTOS;
                  for (
                    let index = 0;
                    index < this.assetCategories.length;
                    index++
                  ) {
                    if (
                      this.assetCategories[index].uuid ===
                      inspectionItem.assetCategoryUUID
                    ) {
                      this.assetCategoryLabel =
                        this.assetCategories[index].name;
                    }
                  }
                }
              })
              .catch((error) => {
                console.log(error);
              });

            this.assetIndex++;
            this.inspectionItems = [];
            for (
              let index = 0;
              index < inspectionItem.inspectionItemCategories.length;
              index++
            ) {
              if (
                inspectionItem.inspectionItemCategories[index].inspectionItems
                  .length > 0
              ) {
                if (
                  inspectionItem.inspectionItemCategories[index]
                    .inspectionItems[0].type === "multiple"
                ) {
                  inspectionItem.inspectionItemCategories[
                    index
                  ].inspectionItems[0].typeLabel = "Multiple Choice";
                } else if (
                  inspectionItem.inspectionItemCategories[index]
                    .inspectionItems[0].type === "input"
                ) {
                  inspectionItem.inspectionItemCategories[
                    index
                  ].inspectionItems[0].typeLabel = "Text/Image/Audio";
                } else {
                  inspectionItem.inspectionItemCategories[
                    index
                  ].inspectionItems[0].typeLabel = "Yes/No";
                }
                this.inspectionItems.push({
                  name: inspectionItem.inspectionItemCategories[index]
                    .inspectionItems[0].name,

                  typeLabel:
                    inspectionItem.inspectionItemCategories[index]
                      .inspectionItems[0].typeLabel,

                  type: inspectionItem.inspectionItemCategories[index]
                    .inspectionItems[0].type,

                  mandatory:
                    inspectionItem.inspectionItemCategories[index]
                      .inspectionItems[0].mandatory,

                  description:
                    inspectionItem.inspectionItemCategories[index]
                      .inspectionItems[0].description,

                  answers:
                    inspectionItem.inspectionItemCategories[index]
                      .inspectionItems[0].answers,
                });
              }
            }
            this.loaderFlag = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    clickAssignedAccordionFunction() {
      this.$refs.inspectionItem.openFlag = false;
      this.$refs.reminderinspectionItem.openFlag = false;
    },

    clickInspectionAccordionFunction() {
      this.$refs.reminderinspectionItem.openFlag = false;
      this.$refs.assignedItem.openFlag = false;
    },

    templateReminderAccordionFunction() {
      this.$refs.inspectionItem.openFlag = false;
      this.$refs.assignedItem.openFlag = false;
    },
  },
  validations: function () {
    return {
      assetCategoryLabel: { required },
      assignedInspectionName: { required },
      templateNumber: { required },
      assignmentFrequency: { required },
      deadlineDate: { required },
      deadlineTime: { required },
      assignedBy: { required },
      inspectionItems: {
        $each: {
          name: { required },
          description: { required },
          typeLabel: { required },
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.parebt-div{
  position: relative;
}
.parebt-div label {
    margin: 6px 0px 0px 0px;
}
.caption {
    font-size: 12px;
    font-weight: 600;
    position: absolute;
    background-color: white;
    top: -12px;
    z-index: 1;
    left: 10px;
    max-width: 135px;
    color: rgb(39 39 39 / 87%);
}
.multiple-choice-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr) 18px 18px;
  grid-column-gap: 8px;
  align-items: center;
}

.row-col-gap {
  display: grid;
  column-gap: 8px;
  row-gap: 16px;
}
</style>
