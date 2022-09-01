<template>
	<div>
		<div>
			<div class="input-row">
				<div class="pb-16">
					<SInput
						label="Name*"
						v-model="name"
						:error="getFormErrorMessage($v.name)"
					/>
				</div>
				<div class="pb-16">
					<SSelect
						label="Select Template*"
						v-model="selectedTemplate"
						:source="templateOptions"
						resultsDisplay="name"
						resultsValue="uuid"
						:autocomplete="false"
						@selected="onSelectedTemplate"
						:error="getFormErrorMessage($v.selectedTemplate)"
					/>
				</div>
				<div>
					<SSelect
						v-if="selectedType == 'schedule'"
						label="Frequency*"
						v-model="selectedSchedule"
						:source="schedule"
						resultsDisplay="name"
						resultsValue="value"
						:autocomplete="false"
						@selected="onSelectedSchedule"
						:error="getFormErrorMessage($v.selectedSchedule)"
					/>
					<!-- :key="indexReminder + 'frequency'" -->
				</div>

				<div></div>

				<div class="deadline-heading" v-if="selectedSchedule == 'ad-hoc'">
					Deadline
				</div>
				<div></div>
				<SInput
					v-if="selectedSchedule == 'ad-hoc'"
					label="Date*"
					v-model="adhocdate"
					:icon="'calendar'"
					:type="'datePicker'"
					:error="getFormErrorMessage($v.adhocdate)"
				/>
				<STimePicker
					v-if="selectedSchedule == 'ad-hoc'"
					manual-input
					label="Time*"
					:format="''"
					:border="true"
					close-on-complete
					v-model="adhoctime"
					:error="getFormErrorMessage($v.adhoctime)"
					:key="indexReminder + 'frequencyTime'"
				/>
			</div>
			<!-- 			<SSelect
				v-if="selectedSchedule == 'weekly'"
				label="Select Day*"
				v-model="weekDay"
				:source="weeklyDays"
				resultsValue="value"
				v-margin-top="24"
				resultsDisplay="name"
				:autocomplete="false"
				@selected="onSelectedWeekDay"
				:error="getFormErrorMessage($v.weekDay)"
			/>
			<SInput
				v-if="selectedSchedule == 'monthly'"
				label="Monthly Date*"
				v-margin-top="24"
				v-model="monthlyDate"
				:type="'datePicker'"
				:error="getFormErrorMessage($v.monthlyDate)"
			/> -->
			<!-- <div
				class="deadline-heading"
				v-if="
					selectedSchedule == 'daily' ||
					selectedSchedule == 'weekly' ||
					selectedSchedule == 'monthly'
				"
			>
				Life Time
			</div> -->
			<div
				class="heading pt-16"
				v-if="
					selectedSchedule == 'daily' ||
					selectedSchedule == 'monthly' ||
					selectedSchedule == 'weekly'
				"
			>
				Custom Recurence
			</div>
			<div
				class="custom-fields"
				v-if="
					selectedSchedule == 'daily' ||
					selectedSchedule == 'monthly' ||
					selectedSchedule == 'weekly'
				"
			>
				<span>{{ FrequencyString }}(s)</span>
				<SInput
					type="number"
					label="Repeat Every*"
					v-model="customValue"
					:error="getFormErrorMessage($v.customValue)"
				/>
				<STimePicker
					manual-input
					label="Deadline*"
					v-if="selectedSchedule === 'daily'"
					:format="''"
					:border="true"
					close-on-complete
					v-model="dailyDeadLineTime"
					:error="getFormErrorMessage($v.dailyDeadLineTime)"
					:key="indexReminder + 'time1'"
				/>
				<SSelect
					label="Monthly On Day*"
					v-model="customMonthly"
					v-if="selectedSchedule === 'monthly'"
					:source="customOptionsMonthly"
					resultsValue="value"
					resultsDisplay="name"
					:autocomplete="true"
					@selected="onSelectedCustomMonthly"
				/>
				<!-- <SSelect
					label="Select*"
					v-model="customWeek"
					:source="customOptions"
					resultsValue="value"
					resultsDisplay="name"
					:autocomplete="false"
					@selected="onSelectedCustomWeek"
					:error="getFormErrorMessage($v.customWeek)"
				/> -->
			</div>
			<div
				class="custom-fields"
				v-if="
					selectedSchedule == 'daily' ||
					selectedSchedule == 'monthly' ||
					selectedSchedule == 'weekly'
				"
			>
				<span v-if="selectedSchedule == 'weekly'">Repeat On</span>
				<SMultipleSelect
					:label="'Days*'"
					v-if="selectedSchedule == 'weekly'"
					:checkbox="checkbox"
					:avatar="false"
					:data="weeklyDays"
					:optionLabel="'name'"
					v-model="customWeekDay"
					@selected="onSelectedWeekDay"
				/>
				<!-- :error="getFormErrorMessage($v.customWeekDay)" -->
				<div>
					<!-- <span v-if="selectedSchedule === 'monthly'">Monthly On Day</span> -->
				</div>
				<!-- :error="getFormErrorMessage($v.customMonthly)" -->
			</div>
			<div class="" v-if="selectedSchedule === 'daily'"></div>
			<span
				v-if="
					selectedSchedule == 'daily' ||
					selectedSchedule == 'monthly' ||
					selectedSchedule == 'weekly'
				"
				>Ends</span
			>
			<div
				class="custom-fields-end"
				v-if="
					selectedSchedule == 'daily' ||
					selectedSchedule == 'monthly' ||
					selectedSchedule == 'weekly'
				"
			>
				<SCheckBox
					v-model="never"
					label="Never"
					:disabled="false"
					:readonly="false"
					@input="neverfuncName"
				/>
				<SCheckBox
					v-model="on"
					label="On"
					:disabled="false"
					:readonly="false"
					@input="onfuncName"
					:error="getFormErrorMessage($v.on)"
				/>
				<SInput
					label="Date"
					v-model="CustomMonthlyDate"
					:disabled="customDate"
					:type="'datePicker'"
					:icon="'calendar'"
					:error="getFormErrorMessage($v.CustomMonthlyDate)"
				/>

				<SCheckBox
					v-model="after"
					label="After"
					:disabled="false"
					:readonly="false"
					@input="afterfuncName"
				/>
				<SInput
					type="number"
					:disabled="occurancesActive"
					label="occurances"
					v-model="occurancesValue"
				/>
			</div>
			<!-- <div class="frequencyfields">
				<SInput
					v-if="
						selectedSchedule == 'daily' ||
						selectedSchedule == 'weekly' ||
						selectedSchedule == 'monthly'
					"
					label=" start Date*"
					v-model="startDate"
					:icon="'calendar'"
					:type="'datePicker'"
					:error="getFormErrorMessage($v.startDate)"
				/>
				<STimePicker
					v-if="
						selectedSchedule == 'daily' ||
						selectedSchedule == 'weekly' ||
						selectedSchedule == 'monthly'
					"
					manual-input
					label="Start Time*"
					:format="'HH:mm'"
					:border="true"
					close-on-complete
					v-model="startTime"
					:error="getFormErrorMessage($v.startTime)"
					:key="indexReminder + 'time2'"
				/>
				<SInput
					v-if="
						selectedSchedule == 'daily' ||
						selectedSchedule == 'weekly' ||
						selectedSchedule == 'monthly'
					"
					label="End Date*"
					v-model="endDate"
					:icon="'calendar'"
					:type="'datePicker'"
					:error="getFormErrorMessage($v.endDate)"
				/>
				<STimePicker
					v-if="
						selectedSchedule == 'daily' ||
						selectedSchedule == 'weekly' ||
						selectedSchedule == 'monthly'
					"
					manual-input
					label="End Time*"
					:format="''"
					:border="true"
					close-on-complete
					v-model="endTime"
					:error="getFormErrorMessage($v.endTime)"
					:key="indexReminder + 'time3'"
				/>
			</div> -->

			<!-- :error="$v.selectedSchedule.$error?'Required':''" -->

			<div class="heading pt-16">Reminders</div>
			<div class="sub-heading">(Before Deadline)</div>
			<div
				class="reminder-row"
				v-for="(item, index) in reminderArray"
				:key="index"
			>
				<SMultipleSelect
					:label="'Reminder*'"
					:checkbox="checkbox"
					:avatar="false"
					:data="item.reminderOptions"
					:optionLabel="'name'"
					v-model="item.reminder"
					@input="onSelectedReminder(index, item)"
					:error="getFormErrorMessage($v.reminderArray.$each[index].reminder)"
					:key="reminderIndex + 'reminder'"
				/>

				<SInput
					label="Duration*"
					type="number"
					v-model="item.durationValue"
					@input="durationfunc"
					:error="
						getFormErrorMessage($v.reminderArray.$each[index].durationValue)
					"
					:key="durationTypeID + 'durationNumber'"
				/>
				<SSelect
					label="Duration Type*"
					v-model="item.durationType"
					:source="item.durationTypeOptions"
					resultsValue="value"
					resultsDisplay="name"
					:autocomplete="true"
					@selected="onSelectedDurationTime"
					:error="
						getFormErrorMessage($v.reminderArray.$each[index].durationType)
					"
					:key="durationTypeID + 'durationType'"
				/>

				<div class="icons">
					<img
						v-if="selectedType == 'schedule'"
						src="../../../assets/icons/Add.png"
						class="icon"
						@click="addReminder(index)"
						alt=""
					/>
					<img
						v-if="selectedType == 'schedule'"
						src="../../../assets/icons/Subtract.png"
						class="icon"
						@click="removeReminder(index)"
						alt=""
					/>
				</div>
			</div>
			<div class="custom-border"></div>
			<SSelect
				v-margin-top="24"
				label="Assign To*"
				v-model="assignee"
				:source="assignees"
				resultsValue="value"
				resultsDisplay="name"
				:autocomplete="true"
				@selected="onSelectedAssignee"
				:error="getFormErrorMessage(this.$v.assignee)"
				:key="indexReminder + 'assign'"
			/>

			<div class="row-assingee" v-if="assignee == 'user'">
				<SSelect
					:label="'User Group*'"
					v-model="assignedUserGroup"
					:source="userGroups"
					resultsValue="uuid"
					resultsDisplay="name"
					:autocomplete="true"
					:key="userGroupId + 'userGroup'"
					@selected="onSelectedUserGroup"
				/>
				<span class="bold">OR</span>

				<SSelect
					:label="'User*'"
					v-model="assignedUser"
					:source="assignUsers"
					resultsValue="uuid"
					resultsDisplay="name"
					:autocomplete="true"
					@selected="onSelectedUser"
					:key="userId + 'assetUser'"
				/>
			</div>
			<!-- v-if="
						(assignedUser !== '' && assignedAssetsOptions.length !== 0) ||
						(assignedUserGroup !== '' && assignedAssetsOptions.length !== 0)
					" -->
			<SSelect
				:label="'All Asset*'"
				v-model="assignedAsset"
				v-if="
					(this.assignee === 'user' && assignedUser !== '') ||
					assignedUserGroup !== ''
				"
				v-margin-top="24"
				:source="groupAssetOptions"
				resultsValue="uuid"
				resultsDisplay="name"
				:autocomplete="true"
				@selected="onSelectedAssignAssets"
				:key="assignAssetId + 'assignAsset'"
			/>
			<div class="row-assingee" v-if="assignee == 'asset'">
				<SSelect
					:label="'Asset Group*'"
					v-model="assetGroups"
					:source="assetGroupOptions"
					resultsValue="uuid"
					resultsDisplay="groupName"
					:autocomplete="true"
					@selected="onSelectedAssetGrp"
					:key="assetGroupId + 'assetgroup'"
				/>
				<!-- :error="getFormErrorMessage(this.$v.assetGroups)" -->

				<span class="bold">OR</span>

				<SSelect
					:label="'Assets*'"
					v-model="assetName"
					:source="groupAssetOptions"
					resultsValue="uuid"
					resultsDisplay="name"
					:autocomplete="true"
					:key="assetId + 'assetId'"
					@selected="onSelectedAsset"
				/>
				<!-- :error="getFormErrorMessage(this.$v.assetName)" -->
			</div>
			<div class="pt-16" v-if="assetAssignedUsers.length !== 0">
				<b>Asset Assignee:</b>
				<div class="DisplayName pt-16">
					<div v-for="(i, index) in assetAssignedUsers" :key="index">
						<b>{{ index + 1 }}: </b> {{ i.name }}
					</div>
				</div>
			</div>
			<div class="pt-16" style="color: Red" v-if="assetAssignFlag === false">
				Selected Asset not assigned to any User
			</div>
			<div v-if="assetAssignFlag === false">
				<router-link to="/assets/">Click here to assign this asset</router-link>
			</div>
			<!-- 
				<div
					class="pt-16"
					style="color: #343434"
					v-if="assignedAssetsOptions.length == 0 && assignedUser !== ''"
				>
					No asset assign to this user
				</div>
				<div v-if="assignedAssetsOptions.length == 0 && assignedUser !== ''">
					<router-link to="/assets/"
						>Click here to assign this asset</router-link
					>
				</div> -->
			<div class="btns pt-32">
				<SButton title="Assign" @click="TemplateAssignment" class="btn" />
				<!-- <SButton title="Update" @click="UpdateTemplateAssignment" class="btn" /> -->
			</div>
		</div>

		<!-- Loader Component -->
		<loader v-if="loaderFlag" />
		<!-- Loader Component -->

		<!-- template Item components -->
		<templateItems
			v-if="this.showTempPopUp"
			:SelectedTemplateObj="this.SelectedTemplateObj"
			@SelectedTempItems="selectedTempItems"
			@close="close"
		/>
	</div>
</template>

<script>
	import AssetPersonnelService from "../../../services/AssetPersonnelService";
	import InspectionService from "../../../services/InspectionService";
	import { Functions } from "@/shared/Functions";
	import { required } from "vuelidate/lib/validators";
	import TemplateItems from "../components/templateItems.vue";
	import moment from "moment";

	import loader from "@/components/Loader.vue";
	export default {
		name: "TemplateAssignment",
		components: { loader, TemplateItems },
		data() {
			return {
				selectedTemplate: "",
				templateName: "",
				templateOptions: [],
				selectedTempItems: [],
				loaderFlag: false,
				name: "",
				checkbox: true,
				showTempPopUp: false,
				reminderIndex: 0,
				userId: 0,
				userGroupId: 0,
				assetId: 0,
				assetGroupId: 0,
				durationTypeID: 0,
				assignAssetId: 0,
				selectedType: "schedule",
				deadline: "",
				templateUUID: "",
				adhocdate: "",
				adhoctime: "",
				startDate: "",
				startTime: "",
				endDate: "",
				endTime: "",
				weekDay: "",
				monthlyDate: "",
				dailyDeadLineTime: "",
				customValue: "1",
				occurancesValue: "",
				customWeek: "week",
				customDate: true,
				occurancesActive: true,
				customWeekDay: [],
				customMonthly: "",
				CustomMonthlyDate: "",
				assignedAssetUuid: "",
				assignedAssetsOptions: [],
				assignedAsset: "",
				never: "",
				on: "",
				after: "",
				currentUserDetails: "",
				indexReminder: 0,
				FrequencyString: "",
				customOptions: [
					{ name: "Daily", value: "day" },
					{ name: "Weekly", value: "week" },
					{ name: "Monthly", value: "month" },
					{ name: "Yearly", value: "year" },
				],
				customOptionsMonthly: [
					{ name: "1", value: "1" },
					{ name: "2", value: "2" },
					{ name: "3", value: "3" },
					{ name: "4", value: "4" },
					{ name: "5", value: "5" },
					{ name: "6", value: "6" },
					{ name: "7", value: "7" },
					{ name: "8", value: "8" },
					{ name: "9", value: "9" },
					{ name: "10", value: "10" },
					{ name: "11", value: "11" },
					{ name: "12", value: "12" },
					{ name: "13", value: "13" },
					{ name: "14", value: "14" },
					{ name: "15", value: "15" },
					{ name: "16", value: "16" },
					{ name: "17", value: "17" },
					{ name: "18", value: "18" },
					{ name: "19", value: "19" },
					{ name: "20", value: "20" },
					{ name: "21", value: "21" },
					{ name: "22", value: "22" },
					{ name: "23", value: "23" },
					{ name: "24", value: "24" },
					{ name: "25", value: "25" },
					{ name: "26", value: "26" },
					{ name: "27", value: "27" },
					{ name: "28", value: "28" },
					{ name: "29", value: "29" },
					{ name: "30", value: "30" },
					{ name: "31", value: "31" },
				],

				schedule: [
					{ name: "Ad-hoc", value: "ad-hoc" },
					{ name: "Daily", value: "daily" },
					{ name: "Weekly", value: "weekly" },
					{ name: "Monthly", value: "monthly" },
					// { name: "Custom", value: "custom" },
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
				selectedSchedule: "",
				templateQasim: "",
				reminderArray: [
					{
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
					},
				],
				assignee: "",
				assignees: [
					{ name: "Users", value: "user" },
					{ name: "Assets", value: "asset" },
				],
				allUsers: [],
				userGroups: [],
				assignedUserGroup: "",
				assignUsers: [],
				assignedUser: "",
				assetGroupOptions: [],
				groupAssetOptions: [],
				assetGroups: "",
				assetName: "",
				editValueflag: false,
				assetNameUUID: "",
				assetGroupsUUID: "",
				assignedUserUUID: "",
				assignedUserGroupUUID: "",
				assetAssignFlag: true,
				assignedAssetName: "",
				assetAssignedUsers: [],
				SelectedTemplateObj: "",
				keyIndex: 0,
			};
		},
		props: {
			tempObj: {},
			assignedTemplateObj: {},
			calenderDateObj: {},
		},
		methods: {
			//  onSelectedTemplate(value) {
			//         this.templateName = value.display;
			//  },
			onSelectedTemplate(value) {
				this.templateName = value.display;
				this.SelectedTemplateObj = value;
				//	this.name = value.display;
				this.templateUUID = value.value;
				console.log(value);
				this.showTempPopUp = true;
			},
			getAllTemplate() {
				let currentUserDetails = JSON.parse(
					localStorage.getItem("currentUserDetails")
				);
				InspectionService.getAllInspectionTemplates(
					currentUserDetails.profile.organizationId
				)
					.then((response) => {
						if (response.status === 200) {
						//	console.log("work");
							this.templateOptions = response.data.inspectionTemplateDTOS;
						}
					})
					.catch((e) => {
						console.log(e);
					});
			},
			getFormErrorMessage(fieldValidation) {
				if (fieldValidation.$dirty) {
					return Functions.getFormFieldErrorMessage(fieldValidation);
				}
			},

			neverfuncName(val) {
				if (val === true) {
					this.on = false;
					this.after = false;
					(this.CustomMonthlyDate = ""), (this.occurancesValue = "");
				}
			},

			onfuncName(val) {
				if (val === true) {
					this.never = false;
					this.after = false;
					this.customDate = false;
					this.occurancesActive = true;
					this.occurancesValue = "";
				}
			},

			afterfuncName(val) {
				if (val === true) {
					this.on = false;
					this.never = false;
					this.occurancesActive = false;
					this.customDate = true;
					this.occurancesValue = "1";
					this.CustomMonthlyDate = "";
				}
			},

			close() {
				this.$emit("close");
				this.showTempPopUp = false;
			},

			onSelectedSchedule(val) {
				if (val.value === "daily") {
					this.deadLineDate = "";
					this.adhoctime = "";
					this.adhocdate = "";
					this.FrequencyString = "Day";
				} else if (val.value === "ad-hoc") {
					this.startDate = "";
					this.endTime = "";
					this.endDate = "";
					this.endTime = "";
					this.dailyDeadLineTime = "";
				} else if (val.value === "weekly") {
					this.deadLineDate = "";
					this.adhoctime = "";
					this.adhocdate = "";
					this.FrequencyString = "Week";
				} else if (val.value === "monthly") {
					this.deadLineDate = "";
					this.adhoctime = "";
					this.adhocdate = "";
					this.FrequencyString = "Month";
				}
			},

			onSelectedReminder(index1, value) {
				//	console.log("value", this.$route.name);
				if (value.reminder.length > 0 && this.$route.name !== "inspection") {
					for (let index = 0; index < this.reminderArray.length; index++) {
						this.reminderArray[index1].durationType = "days";
						this.reminderArray[index1].durationValue = "1";
						console.log("inside loop", value);
						this.durationTypeID++;
					}
				}
			},

			durationfunc(value) {
				console.log("", value);
			},

			onSelectedDurationTime(val) {
				console.log(val);
			},

			onSelectedAssignee(val) {
				//console.log(val);
				if (val.display === "Assets") {
					this.assignedUser = "";
					this.assignedUserGroup = "";
					this.createdForUserName = null;
					this.userId++;
					this.userGroupId++;
					//this.disableUser = false;
				} else if (val.display === "Users") {
					this.assetName = "";
					this.assetGroups = "";
					this.createdForUserName = null;
					this.assetAssignedUsers = [];
					this.assetGroupId++;
					this.assetId++;
					this.assetAssignedUsers = [];
					//this.disableAsset = false;
				}
			},

			onSelectedUserGroup(val) {
				this.assignedUser = "";
				this.editValueflag = true;
				this.assignedAsset = "";
				this.createdForUserName = null;
				this.assignAssetId++;
				this.userId++;
			},

			onSelectedUser(val) {
				console.log(val);
				this.createdForUserName = val.display;
				this.assignedUserGroup = "";
				this.editValueflag = true;
				this.assignedAsset = "";
				this.assignAssetId++;
				this.userGroupId++;
			},

			onSelectedAssetGrp(val) {
				this.assetName = "";
				this.editValueflag = true;
				this.assetAssignedUsers = [];
				this.assignedAssetUuid = "";
				this.assignedAsset = "";
				this.assetId++;
			},

			onSelectedAsset(val) {
				this.assetGroups = "";
				this.assignedAssetUuid = "";
				this.assignedAsset = "";
				this.editValueflag = true;
				this.loaderFlag = true;
				AssetPersonnelService.checkAssignmentOfAnAssetByUUID(val.value)
					.then((res) => {
						//console.log("asset assign or not", res.data);
						this.assetAssignFlag = res.data.assignment;
						this.assetAssignedUsers =
							res.data.userDTOS !== null ? res.data.userDTOS : [];
						this.loaderFlag = false;
					})
					.catch((e) => {
						console.log(e);
					});
				this.assetGroupId++;
			},

			onSelectedAssignAssets(val) {
				this.assignedAssetName = val.display;
				this.assignedAsset = val.value;
				this.assignedAssetUuid = "";
			},

			onSelectedCustomWeek(val) {
				console.log(val);
				if (val.display == "day") {
					this.frequencyDays = "";
					this.customWeekDay = "";
					this.customMonthly = "";
				} else if (val.display == "week") {
					this.customMonthly = "";
				} else if (val.display == "month") {
					this.customWeekDay = "";
				} else if (val.display == "year") {
					this.frequencyDays = "";
					this.customWeekDay = "";
					this.customMonthly = "";
				}
			},
			onSelectedCustomMonthly() {},

			selectTemplate() {
				this.$emit("selectTemp");
			},

			onSelectedWeekDay(val) {
				console.log(val);
			},

			createAdditionalInspection() {
				this.$emit("createInspection");
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

			TemplateAssignment() {
				// this.$v.$touch();
				// if (this.$v.$invalid) {
				// 	return;
				// }

				if (this.selectedSchedule === "custom") {
					//console.log("true");
					if (this.never === "" && this.on === "" && this.after === "") {
						alert("Please Select End Schedule Time in custom Recurence");
						return;
					}
					if (this.customWeek == "week" && this.customWeekDay.length === 0) {
						alert("Please Select Week days");
						return;
					}
					if (this.customWeek == "month" && this.customMonthly === "") {
						alert("Please Select Monthly day");
						return;
					}
				}

				if (this.assignee === "user") {
					if (this.assignedUser === "" && this.assignedUserGroup === "") {
						alert("Please Select User or User Group to assign Template");
						return;
					}
				} else if (this.assignee === "asset") {
					if (this.assetName == "" && this.assetGroups == "") {
						alert("Please Select Asset or Asset Group to assign Template");
						return;
					}
				}
				if (this.assignedUser !== "" && this.assignedAsset === "") {
					alert("Please Select Asset to assign Template");
					return;
				}
				if (this.assignedUserGroup !== "" && this.assignedAsset === "") {
					alert("Please Select Asset to assign Template");
					return;
				}
				if (this.assetName !== "" && this.assetAssignFlag === false) {
					alert("Please Assign Asset to user");
					return;
				}

				if (this.startDate !== "") {
					this.startDate = moment(this.startDate).format();
				} else {
					this.startDate = "";
				}
				if (this.endDate !== "") {
					this.endDate = moment(this.endDate).format();
				} else {
					this.endDate = "";
				}
				if (this.adhocdate !== "" && this.adhocdate !== undefined) {
					this.deadLineDate = moment(this.adhocdate).format();
				} else {
					this.deadLineDate = "";
				}
				if (this.monthlyDate !== "" && this.monthlyDate !== undefined) {
					this.monthlyDate = moment(this.monthlyDate).format();
				} else {
					this.monthlyDate = "";
				}

				if (this.assetName !== "" && this.assetAssignedUsers.length > 0) {
					this.assignedUser = this.assetAssignedUsers[0].uuid;
					this.createdForUserName = this.assetAssignedUsers[0].name;
				}

				//(this.endDate = moment(this.endDate).format()),
				//	(this.deadLineDate = moment(this.adhocdate).format()),
				//(this.monthlyDate = moment(this.monthlyDate).format());
				//console.log("time", this.adhoctime);

				let requestObj = {
					templateName: this.name,
					templateUUID: this.templateUUID,
					createdForUserName: this.createdForUserName,
					startDate: this.startDate,
					startTime: this.startTime,
					endDate: this.endDate,
					endTime: this.endTime,
					deadLineDate: this.deadLineDate,
					deadLineTime: this.adhoctime,
					//	monthlyDate: this.monthlyDate,
					frequencyType: this.selectedSchedule,
					createdForAssetUUID: this.assetName,
					createdForAssetGroupUUID: this.assetGroups,
					dailyDeadLineTime: this.dailyDeadLineTime,
					createdForUserUUID: this.assignedUser,
					createdForUserGroupUUID: this.assignedUserGroup,
					selectedUserAssetUUID: this.assignedAsset,
					selectedUserAssetName: this.assignedAssetName,
					repeatEveryTime: this.customValue,
					repeatEveryType: this.customWeek,
					repeatMonthDay: this.customMonthly,
				};
				if (this.selectedSchedule == "ad-hoc") {
					requestObj.inspectionType = "ad-hoc";
				} else {
					requestObj.inspectionType = "scheduled";
				}
				if (this.selectedSchedule == "weekly") {
					requestObj.frequencyDays = this.weekDay;
				}
				if (
					this.selectedSchedule == "custom" &&
					requestObj.repeatEveryType == "week"
				) {
					requestObj.frequencyDays = JSON.stringify(this.customWeekDay);
				}
				if (this.selectedSchedule == "monthly") {
					requestObj.monthlyDate = moment(this.monthlyDate).format();
				}
				if (
					this.selectedSchedule == "daily" ||
					this.selectedSchedule == "weekly" ||
					this.selectedSchedule == "monthly"
				) {
					//	requestObj.monthlyDate = moment(this.CustomMonthlyDate).format();
					if (requestObj.repeatEveryType === "week") {
						requestObj.frequencyDays = JSON.stringify(this.customWeekDay);
					}
					if (this.never == true) {
						requestObj.endType = "never";
					}
					if (this.on == true) {
						requestObj.endType = "on";
						requestObj.endDate = moment(this.CustomMonthlyDate).format();
					}
					if (this.after == true) {
						requestObj.endType = "after";
						requestObj.occurrence = this.occurancesValue;
					}
				}
				// if (this.selectedSchedule == "custom") {
				// }
				let reminderArray = [];
				for (let index = 0; index < this.reminderArray.length; index++) {
					let obj = {
						reminder: this.reminderArray[index].reminder,
						durationValue: this.reminderArray[index].durationValue,
						durationType: this.reminderArray[index].durationType,
					};
					reminderArray.push(obj);
					requestObj.reminder = JSON.stringify(reminderArray);
				}
				//console.log("requestObj", requestObj);
				this.$emit("requestObj", requestObj);			
				this.$emit("selectedTempItems", this.selectedTempItems);
				this.keyIndex++;
			},

			editAssignedTemp() {
				this.selectedSchedule = this.assignedTemplateObj.frequencyType;
			},

			// UpdateTemplateAssignment() {
			// 	this.$v.$touch();
			// 	if (this.$v.$invalid) {
			// 		return;
			// 	}

			// 	if (this.selectedSchedule === "custom") {
			// 		//console.log("true");
			// 		if (this.never === "" && this.on === "" && this.after === "") {
			// 			alert("Please Select End Schedule Time in custom Recurence");
			// 			return;
			// 		}
			// 		if (this.customWeek == "week" && this.customWeekDay.length === 0) {
			// 			alert("Please Select Week days");
			// 			return;
			// 		}
			// 		if (this.customWeek == "month" && this.customMonthly === "") {
			// 			alert("Please Select Monthly day");
			// 			return;
			// 		}
			// 	}

			// 	if (this.assignee === "user") {
			// 		if (this.assignedUser === "" && this.assignedUserGroup === "") {
			// 			alert("Please Select User or User Group to assign Template");
			// 			return;
			// 		}
			// 	} else if (this.assignee === "asset") {
			// 		if (this.assetName == "" && this.assetGroups == "") {
			// 			alert("Please Select Asset or Asset Group to assign Template");
			// 			return;
			// 		}
			// 	}
			// 	if (
			// 		this.assignedUser !== "" &&
			// 		this.assignedAsset === "" &&
			// 		this.assignee === "user"
			// 	) {
			// 		alert("Please Select Asset to assign Template");
			// 		return;
			// 	}
			// 	if (this.assignedUserGroup !== "" && this.assignedAsset === "") {
			// 		alert("Please Select Asset to assign Template");
			// 		return;
			// 	}
			// 	if (this.assetName !== "" && this.assetAssignFlag === false) {
			// 		alert("Please Assign Asset to user");
			// 		return;
			// 	}

			// 	//	this.startDate = moment(this.startDate).toISOString(),
			// 	//	this.endDate = moment(this.endDate).format(),
			// 	//	this.deadLineDate = moment(this.adhocdate).format(),
			// 	//	this.monthlyDate = moment(this.monthlyDate).format();
			// 	//console.log("time", this.adhoctime);

			// 	let requestObj = {
			// 		templateName: this.name,
			// 		templateUUID: this.templateUUID,
			// 		createdForUserName: this.createdForUserName,
			// 		deadLineTime: this.adhoctime,
			// 		frequencyType: this.selectedSchedule,
			// 		lastUpdatedByName:
			// 			this.currentUserDetails.profile.firstName +
			// 			" " +
			// 			this.currentUserDetails.profile.lastName,
			// 		lastUpdatedByUUID: this.currentUserDetails.profile.userid,
			// 		//	selectedUserAssetUUID: this.assignedAssetUuid !== '' ?  this.assignedAsset: this.assignedAssetUuid,
			// 		//	selectedUserAssetName: this.assignedAssetUuid !== '' ? this.assignedAssetName: this.assignedAsset,
			// 		// createdForAssetUUID: this.assetName,
			// 		// createdForAssetGroupUUID: this.assetGroups,
			// 		// createdForUserUUID: this.assignedUser,
			// 		// createdForUserGroupUUID: this.assignedUserGroup,
			// 	};
			// 	if (this.assignedAssetUuid === "" || this.assignedAssetUuid === null) {
			// 		requestObj.selectedUserAssetUUID = this.assignedAsset;
			// 		requestObj.selectedUserAssetName = this.assignedAssetName;
			// 		console.log("empty");
			// 	} else {
			// 		requestObj.selectedUserAssetUUID = this.assignedAssetUuid;
			// 		requestObj.selectedUserAssetName = this.assignedAsset;
			// 		console.log("not empty");
			// 	}
			// 	if (this.assignee === "asset" && this.assetAssignedUsers.length > 0) {
			// 		if (this.editValueflag === true) {
			// 			this.assignedUser = this.assetAssignedUsers[0].uuid;
			// 			requestObj.createdForUserName = this.assetAssignedUsers[0].name;
			// 		} else {
			// 			this.assignedUserUUID = this.assetAssignedUsers[0].uuid;
			// 			requestObj.createdForUserName = this.assetAssignedUsers[0].name;
			// 		}
			// 	}
			// 	if (this.editValueflag === true) {
			// 		requestObj.createdForAssetUUID = this.assetName;
			// 		requestObj.createdForAssetGroupUUID = this.assetGroups;
			// 		requestObj.createdForUserUUID = this.assignedUser;
			// 		requestObj.createdForUserGroupUUID = this.assignedUserGroup;
			// 	} else if (this.editValueflag === false) {
			// 		requestObj.createdForAssetUUID = this.assetNameUUID;
			// 		requestObj.createdForAssetGroupUUID = this.assetGroupsUUID;
			// 		requestObj.createdForUserUUID = this.assignedUserUUID;
			// 		requestObj.createdForUserGroupUUID = this.assignedUserGroupUUID;
			// 	}
			// 	if (this.selectedSchedule == "ad-hoc") {
			// 		requestObj.inspectionType = "ad-hoc";
			// 		(requestObj.deadLineDate = moment(this.adhocdate).format()),
			// 			(requestObj.deadLineTime = this.adhoctime);
			// 		requestObj.dailyDeadLineTime = null;
			// 		requestObj.frequencyDays = null;
			// 		requestObj.monthlyDate = null;
			// 		requestObj.startDate = null;
			// 		requestObj.startTime = null;
			// 		requestObj.endDate = null;
			// 		requestObj.endTime = null;
			// 	} else {
			// 		requestObj.inspectionType = "scheduled";
			// 	}
			// 	if (this.selectedSchedule == "daily") {
			// 		requestObj.deadLineDate = null;
			// 		requestObj.deadLineTime = null;
			// 		requestObj.frequencyDays = null;
			// 		requestObj.monthlyDate = null;
			// 		requestObj.dailyDeadLineTime = this.dailyDeadLineTime;
			// 		(requestObj.startDate = moment(this.startDate).format()),
			// 			(requestObj.startTime = this.startTime);
			// 		(requestObj.endDate = moment(this.endDate).format()),
			// 			(requestObj.endTime = this.endTime);
			// 	}
			// 	if (this.selectedSchedule == "weekly") {
			// 		requestObj.frequencyDays = this.weekDay;
			// 		requestObj.deadLineDate = null;
			// 		requestObj.deadLineTime = null;
			// 		requestObj.dailyDeadLineTime = null;
			// 		(requestObj.startDate = moment(this.startDate).format()),
			// 			(requestObj.startTime = this.startTime);
			// 		(requestObj.endDate = moment(this.endDate).format()),
			// 			(requestObj.endTime = this.endTime);
			// 	}
			// 	if (this.selectedSchedule == "custom") {
			// 		requestObj.frequencyDays = this.customWeekDay;
			// 		requestObj.deadLineDate = null;
			// 		requestObj.deadLineTime = null;
			// 	}
			// 	if (this.selectedSchedule == "monthly") {
			// 		requestObj.monthlyDate = moment(this.monthlyDate).format();
			// 		requestObj.deadLineDate = null;
			// 		requestObj.deadLineTime = null;
			// 		requestObj.dailyDeadLineTime = null;
			// 		requestObj.frequencyDays = null;
			// 		(requestObj.startDate = moment(this.startDate).format()),
			// 			(requestObj.startTime = this.startTime);
			// 		(requestObj.endDate = moment(this.endDate).format()),
			// 			(requestObj.endTime = this.endTime);
			// 	}
			// 	if (this.selectedSchedule == "custom") {
			// 		requestObj.monthlyDate = moment(this.CustomMonthlyDate).format();
			// 		requestObj.deadLineDate = null;
			// 		requestObj.deadLineTime = null;
			// 		requestObj.dailyDeadLineTime = null;
			// 		requestObj.frequencyDays = null;
			// 		requestObj.monthlyDate = null;
			// 		requestObj.startDate = null;
			// 		requestObj.startTime = null;
			// 		requestObj.endDate = null;
			// 		requestObj.endTime = null;
			// 		requestObj.repeatEveryTime = this.customValue;
			// 		requestObj.repeatEveryType = this.customWeek;
			// 		if (this.never == true) {
			// 			requestObj.endType = "never";
			// 			requestObj.endDate = "";
			// 			requestObj.occurrence = "";
			// 		}
			// 		if (this.on == true) {
			// 			requestObj.endType = "on";
			// 			requestObj.endDate = moment(this.CustomMonthlyDate).format();
			// 			requestObj.occurrence = "";
			// 		}
			// 		if (this.after == true) {
			// 			requestObj.endType = "after";
			// 			requestObj.occurrence = this.occurancesValue;
			// 			requestObj.endDate = "";
			// 		}
			// 		if (requestObj.repeatEveryType === "week") {
			// 			requestObj.frequencyDays = JSON.stringify(this.customWeekDay);
			// 		} else if (requestObj.repeatEveryType === "month") {
			// 			(requestObj.repeatMonthDay = this.customMonthly),
			// 				(requestObj.frequencyDays = "");
			// 		} else if (
			// 			requestObj.repeatEveryType === "day" ||
			// 			requestObj.repeatEveryType === "year"
			// 		) {
			// 			(requestObj.repeatMonthDay = ""), (requestObj.frequencyDays = "");
			// 		}
			// 	}
			// 	//	console.log("before array", this.reminderArray);
			// 	let reminderArray = [];
			// 	for (let index = 0; index < this.reminderArray.length; index++) {
			// 		//debugger
			// 		let obj = {
			// 			reminder: this.reminderArray[index].reminder,
			// 			durationValue: this.reminderArray[index].durationValue,
			// 			durationType: this.reminderArray[index].durationType,
			// 		};
			// 		//	console.log("array", reminderArray);
			// 		reminderArray.push(obj);
			// 		requestObj.reminder = JSON.stringify(reminderArray);
			// 	}
			// 	console.log(requestObj);
			// 	//	return
			// 	this.$emit("updateAssignedTemplate", requestObj);
			// },

			getExistingInspectionTemplate(uuid, tenantUUID) {
				let inspectionItem = null;
				InspectionService.getInspectionTemplateByUUID(uuid, tenantUUID).then(
					(response) => {
						if (response.status === 200) {
							this.groupAssetOptions =
								response.data.assetAndGroupsNameResponse.assetDTOS;
							this.assetGroupOptions =
								response.data.assetAndGroupsNameResponse.assetGroupDTOS;
							this.userGroups = response.data.userAndGroupResponse.userGroupDTOS;
							this.assignUsers = response.data.userAndGroupResponse.userDTOS;
							if (response.data.inspectionTemplate != null) {
								inspectionItem = response.data.inspectionTemplate;
								this.inspectionTemplate = response.data.inspectionTemplate;
								this.templateName = inspectionItem.name;
								this.selectedSchedule = inspectionItem.frequencyType;
								this.assignedAsset = inspectionItem.selectedUserAssetName;
								this.assignedAssetUuid = inspectionItem.selectedUserAssetUUID;
								if (inspectionItem.frequencyType === "ad-hoc") {
									this.adhocdate = moment(inspectionItem.deadLineDate).format(
										"DD MMM YYYY"
									);
									this.adhoctime = inspectionItem.deadLineTime;
									this.indexReminder++;
								}
								if (inspectionItem.frequencyType === "daily") {
									this.dailyDeadLineTime = inspectionItem.dailyDeadLineTime;
									this.startDate = moment(inspectionItem.starDate).format(
										"DD MMM YYYY"
									);
									this.startTime = inspectionItem.startTime;
									this.endDate = moment(inspectionItem.endDate).format(
										"DD MMM YYYY"
									);
									this.endTime = inspectionItem.endTime;
								}
								if (inspectionItem.frequencyType === "weekly") {
									this.weekDay = inspectionItem.frequencyDays;
									this.startDate = moment(inspectionItem.starDate).format(
										"DD MMM YYYY"
									);
									this.startTime = inspectionItem.startTime;
									this.endDate = moment(inspectionItem.endDate).format(
										"DD MMM YYYY"
									);
									this.endTime = inspectionItem.endTime;
									this.indexReminder++;
								}
								if (inspectionItem.frequencyType === "monthly") {
									this.monthlyDate = moment(inspectionItem.monthlyDate).format(
										"DD MMM YYYY"
									);
									this.startDate = moment(inspectionItem.starDate).format(
										"DD MMM YYYY"
									);
									this.startTime = inspectionItem.startTime;
									this.endDate = moment(inspectionItem.endDate).format(
										"DD MMM YYYY"
									);
									this.endTime = inspectionItem.endTime;
									this.indexReminder++;
								}
								if (inspectionItem.frequencyType === "custom") {
									this.customWeek = inspectionItem.repeatEveryType;
									this.customValue = inspectionItem.repeatEveryTime;
									this.customMonthly = inspectionItem.repeatMonthDay;
									if (inspectionItem.frequencyDays != "") {
										this.customWeekDay = JSON.parse(inspectionItem.frequencyDays);
									}
									if (inspectionItem.endType === "never") {
										this.never = true;
									} else if (inspectionItem.endType === "on") {
										this.on = true;
										this.CustomMonthlyDate = moment(
											inspectionItem.endDate
										).format("DD MMM YYYY");
									} else if (inspectionItem.endType === "after") {
										this.after = true;
										this.occurancesValue = inspectionItem.occurrence;
									}
								}

								if (
									inspectionItem.createdForUserUUID !== "" &&
									inspectionItem.createdForUserUUID !== null
								) {
									this.assignee = "user";
									if (this.assignUsers.length !== 0) {
										let user = this.assignUsers.find(
											(u) => u.uuid === inspectionItem.createdForUserUUID
										);
										if (user !== undefined && user !== null && user !== {}) {
											this.assignedUser = user.name;
											this.assignedUserUUID = user.uuid;
										}
									}
									this.userId++;
								}
								if (
									inspectionItem.createdForUserGroupUUID !== "" &&
									inspectionItem.createdForUserGroupUUID !== null
								) {
									if (this.userGroups.length !== 0) {
										let group = this.userGroups.find(
											(g) => g.uuid === inspectionItem.createdForUserGroupUUID
										);
										if (group !== undefined && group !== null && group !== {}) {
											this.assignedUserGroup = group.name;
											this.assignedUserGroupUUID = group.uuid;
										}
									}

									this.assignee = "user";
									this.userGroupId++;
								}
								if (
									inspectionItem.assetUUID !== "" &&
									inspectionItem.assetUUID !== null
								) {
									if (this.groupAssetOptions.length > 0) {
										let asset = this.groupAssetOptions.find(
											(a) => a.uuid === inspectionItem.assetUUID
										);
										if (asset !== undefined && asset !== null && asset !== {}) {
											this.assetName = asset.name;
											this.assetNameUUID = asset.uuid;
										}
									}
									this.assignee = "asset";
									if (this.assignUsers.length !== 0) {
										let user = this.assignUsers.find(
											(u) => u.uuid === inspectionItem.createdForUserUUID
										);
										if (user !== undefined && user !== null && user !== {}) {
											this.assignedUser = user.name;
											this.assignedUserUUID = user.uuid;
										}
									}
									this.assetId++;
								}
								if (
									inspectionItem.createdForAssetGroupUUID !== "" &&
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
											this.assetGroups = assetGroup.groupName;
											this.assetGroupsUUID = assetGroup.uuid;
										}
										this.assignee = "asset";
										this.assetGroupId++;
									}
								}
								let remind = JSON.parse(inspectionItem.reminder);
								if (remind !== null) {
									this.reminderArray = [];
									for (let index = 0; index < remind.length; index++) {
										let obj = {
											reminder: remind[index].reminder,
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
								}
								this.indexReminder++;
								this.durationTypeID++;
								this.reminderIndex++;
								this.loaderFlag = false;
							}
						}
					}
				);
			},
		},

		mounted() {
			this.currentUserDetails = JSON.parse(
				localStorage.getItem("currentUserDetails")
			);
			this.getAllTemplate();
			//this.getUserGroups(this.currentUserDetails.profile.organizationId);
			//	this.name = this.tempObj.name;
			//	this.templateUUID = this.tempObj.uuid;
		//	console.log("calenderDate Obj", this.calenderDateObj);
			if (this.calenderDateObj == undefined || this.calenderDateObj == "") {
				let CurrentDate = new Date();
				var subOneHour = moment(CurrentDate).subtract(1, "h").format();
				let startTime = new Date(CurrentDate);
				let endTime = new Date(subOneHour);
				let tempObj = {
					cancel: false,
					element: "",
					endTime: endTime,
					isAllDay: false,
					name: "cellClick",
					startTime: startTime,
				};
				//	this.calenderDateObj = tempObj;
			//	console.log("currentDate Obj", this.calenderDateObj);
			}
			this.getExistingInspectionTemplate(
				"none",
				this.currentUserDetails.profile.organizationId
			);
			// if (this.tempObj.editFlag === true) {
			// 	this.loaderFlag = true;
			// 	this.getExistingInspectionTemplate(
			// 		this.templateUUID,
			// 		this.currentUserDetails.profile.organizationId
			// 	);
			// } else {

			// }
		},

		validations: function () {
			return {
				name: { required },
				selectedSchedule: { required },
				selectedTemplate: { required },
				reminderArray: {
					$each: {
						reminder: { required },
						durationValue: { required },
						durationType: { required },
					},
				},
				...this.getAdhocValidation,
				...this.getDailyValidation,
				...this.getWeeklyValidation,
				...this.getMonthlyValidation,
				...this.customValidations,
				...this.assignValidations,
				...this.customOn,
			};
		},
		computed: {
			getAdhocValidation() {
				let validations = {};
				if (this.selectedSchedule != "ad-hoc") {
					validations = {
						adhocdate: {},
						adhoctime: {},
					};
				} else {
					validations = {
						adhocdate: { required },
						adhoctime: { required },
					};
				}
				return validations;
			},
			getDailyValidation() {
				let validations = {};
				if (this.selectedSchedule != "daily") {
					validations = {
						dailyDeadLineTime: {},
						startDate: {},
						startTime: {},
						endDate: {},
						endTime: {},
					};
				} else {
					validations = {
						dailyDeadLineTime: { required },
						startDate: { required },
						startTime: { required },
						endDate: { required },
						endTime: { required },
					};
				}
				return validations;
			},
			getWeeklyValidation() {
				let validations = {};
				if (this.selectedSchedule != "weekly") {
					validations = {
						weekDay: {},
						startDate: {},
						startTime: {},
						endDate: {},
						endTime: {},
					};
				} else {
					validations = {
						weekDay: { required },
						startDate: { required },
						startTime: { required },
						endDate: { required },
						endTime: { required },
					};
				}
				return validations;
			},
			getMonthlyValidation() {
				let validations = {};
				if (this.selectedSchedule != "monthly") {
					validations = {
						monthlyDate: {},
						startDate: {},
						startTime: {},
						endDate: {},
						endTime: {},
					};
				} else {
					validations = {
						monthlyDate: { required },
						startDate: { required },
						startTime: { required },
						endDate: { required },
						endTime: { required },
					};
				}
				return validations;
			},
			customValidations() {
				let validations = {};
				if (this.selectedSchedule != "custom") {
					validations = {
						customWeek: {},
						customValue: {},
					};
				} else {
					validations = {
						customWeek: { required },
						customValue: { required },
					};
				}
				return validations;
			},
			assignValidations() {
				let validations = {};
				if (this.assignee != "") {
					validations = {
						assignee: {},
						assignedUserGroup: {},
						assignedUser: {},
					};
				} else {
					validations = {
						assignee: { required },
						assignedUserGroup: { required },
						assignedUser: { required },
					};
				}
				return validations;
			},
			customOn() {
				let validations = {};
				if (this.on != true) {
					validations = {
						on: {},
						CustomMonthlyDate: {},
					};
				} else {
					validations = {
						on: { required },
						CustomMonthlyDate: { required },
					};
				}
				return validations;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.input-row {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: 32px;
		margin-top: 24px;
	}
	// border-bottom: 1px solid var(--very-light-pink);
	.reminder-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 60px;
		column-gap: 32px;
		margin-top: 24px;
	}
	.reminder-row:last-child {
		padding-bottom: 24px;
		border-bottom: 1px solid var(--very-light-pink);
	}
	.custom-border {
		margin-top: 24px;
		padding-bottom: 24px 0px;
		border-top: 1px solid var(--very-light-pink);
	}
	.row-assingee {
		display: grid;
		grid-template-columns: 1fr 32px 1fr;
		column-gap: 32px;
		align-items: center;
		margin-top: 24px;
		// padding-top: 24px;
		// border-bottom: 1px solid var(--very-light-pink);
	}
	.heading {
		font-size: 14px;
		font-weight: bold;
	}
	.sub-heading {
		font-size: 12px;
		color: #8f8989;
	}
	.deadline-heading {
		display: grid;
		grid-template-columns: 1fr 60px;
		font-size: 14px;
		font-weight: bold;
		margin-bottom: 24px;
		margin-top: 24px;
	}
	.btns {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		column-gap: 80px;
		// justify-content: space-between;
		.btn {
			height: 40px;
			// width: 100px;
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
		//   float: right;
	}
	.icon:hover {
		opacity: 1;
		background-color: var(--secondary);
	}
	.icon:active {
		opacity: 0.3;
	}
	.frequencyfields {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		margin-bottom: 24px;
		column-gap: 32px;
		margin-top: 24px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--very-light-pink);
	}
	.custom-fields {
		display: grid;
		grid-template-columns: 1fr 3fr 3fr;
		margin-bottom: 24px;
		column-gap: 32px;
		margin-top: 24px;
	}
	.custom-fields-end {
		display: grid;
		grid-template-columns: 1fr 1fr 3fr 1fr 3fr;
		margin-bottom: 24px;
		column-gap: 32px;
		margin-top: 24px;
	}
	.DisplayName {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		margin-bottom: 24px;
		column-gap: 24px;
	}
</style>