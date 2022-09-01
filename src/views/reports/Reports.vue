<template>
	<div  class="pt-32">

			<div>
				<span class="head-title">Reports</span><br />
				<span class="subtitle">View your filtered data reports here.</span>
			</div>

		<div class="page-layout">
			<div class="data-section">
				<div class="input-row">
					<SSelect
						label="Report Type"
						v-model="selectedTypeLabel"
						:source="reportType"
						resultsValue="name"
						resultsDisplay="name"
						:autocomplete="true"
						:key="inputIndex"
						@selected="onSelectedType"
						:error="getFormErrorMessage(this.$v.selectedType)"
					/>

					<SSelect
						label="Report Duration"
						v-model="selectedDurationLabel"
						:source="reportDuration"
						resultsValue="name"
						resultsDisplay="name"
						:autocomplete="true"
						@selected="onSelected"
						:key="durationIndex + '_duration'"
						:error="getFormErrorMessage(this.$v.selectedDuration)"
					/>

					<SInput
						label="Start Date"
						v-model="startDate"
						type="datePicker"
						:icon="'calendar'"
						:disabled="startDateDisable"
						:error="getFormErrorMessage(this.$v.startDate)"
					/>

					<SInput
						label="End Date"
						v-model="endDate"
						type="datePicker"
						:icon="'calendar'"
						:disabled="endDateDisable"
					/>
					<SButton :title="'Refresh'" @click="refreshTable" />
				</div>

				<div v-margin-top="40" v-if="selectedType !== ''">
					<SCard :shadow="true" :border="true">
						<div v-grid="1" v-padding="'16px 32px 0px 32px'">
							<span><b>KPI Summary</b></span>
						</div>
						<div v-if="selectedType === 'workOrdersReport'">
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span
									><b>{{ selectedTypeLabel }}</b></span
								>
								<span><b>Minimum</b></span>
								<span><b>Maximum</b></span>
								<span><b>Average</b></span>
							</div>

							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>New</span>
								<span>{{ workOrderStatus.newMin }}</span>
								<span>{{ workOrderStatus.newMax }}</span>
								<span>{{ workOrderStatus.newAvg }}</span>
							</div>

							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>In Progress</span>
								<span>{{ workOrderStatus.inProgressMin }}</span>
								<span>{{ workOrderStatus.inProgressMax }}</span>
								<span>{{ workOrderStatus.inProgressAvg }}</span>
							</div>

							<div v-grid="4" v-padding="'16px 32px 16px 32px'">
								<span>Resolved</span>
								<span>{{ workOrderStatus.resolvedMin }}</span>
								<span>{{ workOrderStatus.resolvedMax }}</span>
								<span>{{ workOrderStatus.resolvedAvg }}</span>
							</div>
						</div>
						<div v-if="selectedType === 'serviceRequestReport'">
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span
									><b>{{ selectedTypeLabel }}</b></span
								>
								<span><b>Minimum</b></span>
								<span><b>Maximum</b></span>
								<span><b>Average</b></span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>New</span>
								<span>{{ serviceRequestStatus.newMin }}</span>
								<span>{{ serviceRequestStatus.newMax }}</span>
								<span>{{ serviceRequestStatus.newAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>In Progress</span>
								<span>{{ serviceRequestStatus.inProgressMin }}</span>
								<span>{{ serviceRequestStatus.inProgressMax }}</span>
								<span>{{ serviceRequestStatus.inProgressAvg }}</span>
							</div>

							<div v-grid="4" v-padding="'16px 32px 16px 32px'">
								<span>Resolved</span>
								<span>{{ serviceRequestStatus.resolvedMin }}</span>
								<span>{{ serviceRequestStatus.resolvedMax }}</span>
								<span>{{ serviceRequestStatus.resolvedAvg }}</span>
							</div>
						</div>

						<div v-if="selectedType === 'InspectionsReport'">
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span
									><b>{{ selectedTypeLabel }}</b></span
								>
								<span><b>Minimum</b></span>
								<span><b>Maximum</b></span>
								<span><b>Average</b></span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>New</span>
								<span>{{ inspectionStatus.newMin }}</span>
								<span>{{ inspectionStatus.newMax }}</span>
								<span>{{ inspectionStatus.newAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>Passed</span>
								<span>{{ inspectionStatus.passedMin }}</span>
								<span>{{ inspectionStatus.passedMax }}</span>
								<span>{{ inspectionStatus.passedAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>Failed</span>
								<span>{{ inspectionStatus.failedMin }}</span>
								<span>{{ inspectionStatus.failedMax }}</span>
								<span>{{ inspectionStatus.failedAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>Ad-Hoc</span>
								<span>{{ inspectionStatus.adhocMin }}</span>
								<span>{{ inspectionStatus.adhocMax }}</span>
								<span>{{ inspectionStatus.adhocAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 32px 32px'">
								<span>Scheduled</span>
								<span>{{ inspectionStatus.scheduledMin }}</span>
								<span>{{ inspectionStatus.scheduledMax }}</span>
								<span>{{ inspectionStatus.scheduledAvg }}</span>
							</div>
						</div>

						<div v-if="selectedType === 'issuesReport'">
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span
									><b>{{ selectedTypeLabel }}</b></span
								>
								<span><b>Minimum</b></span>
								<span><b>Maximum</b></span>
								<span><b>Average</b></span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>New</span>
								<span>{{ issueStatus.newMin }}</span>
								<span>{{ issueStatus.newMax }}</span>
								<span>{{ issueStatus.newAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>In Progress</span>
								<span>{{ issueStatus.inProgressMin }}</span>
								<span>{{ issueStatus.inProgressMax }}</span>
								<span>{{ issueStatus.inProgressAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 0px 32px'">
								<span>Reported</span>
								<span>{{ issueStatus.reportedMin }}</span>
								<span>{{ issueStatus.reportedMax }}</span>
								<span>{{ issueStatus.reportedAvg }}</span>
							</div>
							<div v-grid="4" v-padding="'16px 32px 32px 32px'">
								<span>Pooled</span>
								<span>{{ issueStatus.pooledMin }}</span>
								<span>{{ issueStatus.pooledMax }}</span>
								<span>{{ issueStatus.pooledAvg }}</span>
							</div>
						</div>
					</SCard>
				</div>
				<div class="empty-report">
					<Sdt
						:filteredDataCount="filterCount"
						v-if="parentDefaultSystemView.defaultTable.columns.length > 0"
						:parentData="parentData"
						:parentDefaultSystemView="parentDefaultSystemView"
						:parentSystemSettings="parentSystemSettings"
						:dataDepart="(value) => catchDeparture(value)"
						:rowHeights="false"
						:token="sdt_token"
						:customViews="true"
						:tableSearch="true"
						:downloadAs="false"
						:actionsButton="false"
						:moreButton="false"
						ref="test"
						:key="sdtindex"
					/>
				</div>
			</div>

			<div class="empty-section"></div>

			<div class="sidebar-section">
				<!-- <Sidebar :style="sidebarStyle" id="sidebar-el" />-->
			</div>
		</div>
	</div>
</template>

<script>
	import { Functions } from "@/shared/Functions";
	import { required } from "vuelidate/lib/validators";
	import Sidebar from "./components/Sidebar";
	import assetPersonnelService from "../../services/AssetPersonnelService";
	import workOrderService from "../../services/WorkOrderService";
	import inspectionService from "../../services/InspectionService";

	import Endpoints from "../../services/EndPoints";
	import moment from "moment";

	export default {
		name: "Reports",

		components: {
			Sidebar,
		},

		data() {
			return {
				// ------------- SDT Data START ----------------
				sdt_token: (JSON.parse(localStorage.getItem('currentUserDetails'))).access_token,
				user: "",
				username: "",
				isLoadingPage: false,
				isLoading: false,
				prompt: false,
				promptViewName: "",
				serverData: "",
				filterFieldList: [],
				eventData: "",
				parentSystemSettings: {
					serviceURL: Endpoints.preferenceService.preference,
					buttons: [],
					searchValue: "",
					height: "950px",
					selectionColumn: false,
					selectType: "none",
					moreOptions: [],
					columnIcons: [],
					pillConfig: [
						{ column: "", state: "success", data: "" },
						{ column: "", state: "error", data: "" },
						{ column: "", state: "normal", data: "" },
					],
					staticColumns: [],
					user: JSON.parse(localStorage.getItem("currentUserDetails")).profile
						.username,
					uppercaseColumns: [], // pass column name whose data should be shown in caps
					dateFormat: "DD/MM/yyyy", //pass any moment date format here
				},
				parentDefaultSystemView: {
					viewNames: [
						{
							name: "Default View",
							tileFlag: true,
							position: 1,
							privacy: "private",
						},
						{
							name: "Add A View Tile",
							tileFlag: true,
							position: 1,
							privacy: "private",
						},
					],

					defaultTable: {
						id: null,
						viewName: "Default View",
						density: "",
						pageSize: "",
						pageName: "",
						user: JSON.parse(localStorage.getItem("currentUserDetails")).profile
							.username,
						defaultViewFlag: true,
						sortField: "",
						sortDirection: "",
						tileFlag: true,
						columns: [],
						position: 1, // always pass 1
						privacy: "private",
					},
				},
				parentData: [],

				// ------------- SDT Data END ----------------
				filterCount: "",
				currentUserDetails: "",
				sdtindex: 0,
				inputIndex: 0,
				durationIndex: 0,
				workOrderStatus: {},
				issueStatus: {},
				inspectionStatus: {},
				serviceRequestStatus: {},
				endDateDisable: true,
				startDateDisable: true,
				startDate: "",
				endDate: "",
				selectedDuration: "",
				selectedDurationLabel: "",
				reportDuration: [
					{ name: "To Day", value: "today" },
					{ name: "Per Day", value: "day" },
					{ name: "Weekly", value: "weekly" },
					{ name: "Monthly", value: "monthly" },
					{ name: "Quaterly", value: "quaterly" },
					{ name: "Yearly", value: "yearly" },
					{ name: "Custom Range", value: "range" },
				],
				selectedType: "",
				selectedTypeLabel: "",
				reportType: [
					{ name: "Issues", value: "issuesReport" },
					{ name: "work Orders", value: "workOrdersReport" },
					{ name: "Inspections", value: "InspectionsReport" },
					{ name: "Service Requests", value: "serviceRequestReport" },
				],
			};
		},

		created() {
			 document.title = this.$route.meta.title;
			this.currentUserDetails = JSON.parse(
				localStorage.getItem("currentUserDetails")
			);
			if (this.currentUserDetails === null) {
				localStorage.setItem("forceSignout", "yes");
				return;
			}

			// sending only first and last name for SDT
			let name = this.currentUserDetails.profile.username;
			if (name.includes("@")) {
				name = name.split("@");
				name = name[0];
			}
			this.parentSystemSettings.user = name;
			this.selectedTypeLabel = "Work Orders";
			this.selectedType = "workOrdersReport";
			this.selectedDurationLabel = "Monthly";
			this.selectedDuration = "monthly";

			this.startDate = moment(moment().startOf("month")).format("YYYY-MM-DD");
			this.endDate = moment(moment().endOf("month")).format("YYYY-MM-DD");
			this.inputIndex++;
			this.durationIndex++;
			this.refreshTable();
		},

		methods: {
			setStaticColumn() {
		      let staticCol = this.tableConfig.columns.filter(
		        (col) => col.labelName == "Date"
		      )[0];
		      this.parentSystemSettings.staticColumns.push(staticCol);

		      for (let i = 0; i < this.tableConfig.columns.length; i++) {
		        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
		          this.tableConfig.columns.splice(i, 1);
		        }
		      }
		    },

			refreshTable() {
				this.$v.$touch();
				if (this.$v.$invalid) {
					return;
				}
				this.workOrderStatus = {};
				this.issueStatus = {};
				this.inspectionStatus = {};
				this.serviceRequestStatus = {};
				this.loadConfigs();
			},

			loadConfigs() {
				assetPersonnelService
					.getOrgConfigs(
						this.currentUserDetails.profile.organizationId,
						"tableConfigs"
					)
					.then((response) => {
						let allConfigs = JSON.parse(response.data.tableConfigs);
						this.tableConfig = allConfigs.filter(
							(data) => data.pageName === this.selectedType
						)[0];
						this.tableConfig.columns.map((column) => {
							column.filters = [];
						});
				        this.setStaticColumn();
						this.setTableConfigs();
					})
					.catch((error) => {});
			},

			catchDeparture: function (data) {
				if (data.status == 1 || data.status == 3) {
					this.loadTable(data);
				} else if (data.status == 4) {
					this.loadTable(data);
				} else if (data.status == 10) {
				}
			},

			loadTable(sdtData) {
				let filters = [];

				for (let index = 0; index < sdtData.message.length; index++) {
					if (sdtData.message[index].fieldName.includes("#")) {
						let name = sdtData.message[index].fieldName;
						name = name.split("#");
						name = name[0];
						sdtData.message[index].fieldName = name;
					}
					if (sdtData.message[index].filterValue !== "") {
						filters.push({
							fieldName: sdtData.message[index].fieldName,
							fieldType: sdtData.message[index].fieldType,
							filterValue: sdtData.message[index].filterValue,
							secondValue: sdtData.message[index].secondValue,
							comparisonType: sdtData.message[index].comparisonType,
						});
					}
				}

				if (this.selectedType === "workOrdersReport") {
					this.getPaginatedWorkOrders(
						filters,
						sdtData.data.sortField,
						sdtData.data.sortDirection,
						sdtData.data.offset,
						sdtData.data.limit
					);
				} else if (this.selectedType === "issuesReport") {
					this.getPaginatedIssues(
						filters,
						sdtData.data.sortField,
						sdtData.data.sortDirection,
						sdtData.data.offset,
						sdtData.data.limit
					);
				} else if (this.selectedType === "serviceRequestReport") {
					this.getPaginatedServiceRequest(
						filters,
						sdtData.data.sortField,
						sdtData.data.sortDirection,
						sdtData.data.offset,
						sdtData.data.limit
					);
				} else if (this.selectedType === "InspectionsReport") {
					this.getPaginatedInspection(
						filters,
						sdtData.data.sortField,
						sdtData.data.sortDirection,
						sdtData.data.offset,
						sdtData.data.limit
					);
				}
			},

			loadSDT(response, data) {
				this.inspections = response.data.sdtData.content;
				let eventData = {
					data: response.data.sdtData.content,
					totalElements: response.data.sdtData.totalElements,
					totalPages: response.data.sdtData.totalPages,
					pageNumber: response.data.sdtData.totalPages,
				};
				this.$refs.test.dataLoadEvent(eventData);
			},

			getPaginatedWorkOrders(filters, sortField, sortDirection, offset, limit) {
				let currentUserDetails = JSON.parse(
					localStorage.getItem("currentUserDetails")
				);

				let requestObj = {
					filters: filters,
					sortField: sortField,
					sortDirection: sortDirection,
					offset: offset,
					limit: limit,
					tenantUUID: currentUserDetails.profile.organizationId,
					startDate: moment(this.startDate).format("YYYY-MM-DD"),
					endDate:
						(this.selectedDurationLabel === "To Day") |
						(this.selectedDurationLabel === "Per Day")
							? moment(this.startDate).format("YYYY-MM-DD")
							: moment(this.endDate).format("YYYY-MM-DD"),
				};

				workOrderService
					.getPaginatedWorkOrdersReport(requestObj)
					.then((response) => {
						if (response.status == 200) {
							response.data.sdtData.content.map((item) => {
								item.createdAt = moment(item.createdAt).format("DD/MM/yyyy");
							});
							this.workOrderStatus = response.data.status;
							let workOrders = response.data.sdtData.content;
							this.loadSDT(response, workOrders);
						} else {
							this.loading = false;
							this.$q.notify({
								message: "Opps its look like our server is offline",
								color: "negative",
							});
						}
					})
					.catch((error) => {
						if (error.response !== undefined && error.response.status === 406) {
						}
					});
			},

			getPaginatedIssues(filters, sortField, sortDirection, offset, limit) {
				let currentUserDetails = JSON.parse(
					localStorage.getItem("currentUserDetails")
				);


				let requestObj = {
					filters: filters,
					sortField: "reportedAt",
					sortDirection: sortDirection,
					offset: offset,
					limit: limit,
					tenantUUID: currentUserDetails.profile.organizationId,
					startDate: moment(this.startDate).format("YYYY-MM-DD"),
					endDate:
						(this.selectedDurationLabel === "To Day") |
						(this.selectedDurationLabel === "Per Day")
							? moment(this.startDate).format("YYYY-MM-DD")
							: moment(this.endDate).format("YYYY-MM-DD"),
				};

				inspectionService
					.getPaginatedIssuesReport(requestObj)
					.then((response) => {
						if (response.status == 200) {
							response.data.sdtData.content.map((item) => {
								item.reportedAt = moment(item.reportedAt).format("DD/MM/yyyy");
							});
							this.issueStatus = response.data.status;
							let issues = response.data.sdtData.content;
							this.loadSDT(response, issues);
						} else {
							this.loading = false;
							this.$q.notify({
								message: "Opps its look like our server is offline",
								color: "negative",
							});
						}
					})
					.catch((error) => {
						if (error.response !== undefined && error.response.status === 406) {
						}
					});
			},

			getPaginatedServiceRequest(
				filters,
				sortField,
				sortDirection,
				offset,
				limit
			) {
				let currentUserDetails = JSON.parse(
					localStorage.getItem("currentUserDetails")
				);

				let requestObj = {
					filters: filters,
					sortField: "reportedAt",
					sortDirection: sortDirection,
					offset: offset,
					limit: limit,
					tenantUUID: currentUserDetails.profile.organizationId,
					startDate: moment(this.startDate).format("YYYY-MM-DD"),
					endDate:
						(this.selectedDurationLabel === "To day") |
						(this.selectedDurationLabel === "Per Day")
							? moment(this.startDate).format("YYYY-MM-DD")
							: moment(this.endDate).format("YYYY-MM-DD"),
				};

				inspectionService
					.getPaginatedServiceRequestReport(requestObj)
					.then((response) => {
						if (response.status == 200) {
							response.data.sdtData.content.map((item) => {
								item.reportedAt = moment(item.reportedAt).format("DD/MM/yyyy");
							});
							this.serviceRequestStatus = response.data.status;
							let serviceRequest = response.data.sdtData.content;
							this.loadSDT(response, serviceRequest);

						} else {
							this.loading = false;
							this.$q.notify({
								message: "Opps its look like our server is offline",
								color: "negative",
							});
						}
					})
					.catch((error) => {
						if (error.response !== undefined && error.response.status === 406) {
						}
					});
			},

			getPaginatedInspection(filters, sortField, sortDirection, offset, limit) {
				let currentUserDetails = JSON.parse(
					localStorage.getItem("currentUserDetails")
				);

				let requestObj = {
					filters: filters,
					sortField: sortField,
					sortDirection: sortDirection,
					offset: offset,
					limit: limit,
					tenantUUID: currentUserDetails.profile.organizationId,
					startDate: moment(this.startDate).format("YYYY-MM-DD"),
					endDate:
						(this.selectedDurationLabel === "To day") |
						(this.selectedDurationLabel === "Per Day")
							? moment(this.startDate).format("YYYY-MM-DD")
							: moment(this.endDate).format("YYYY-MM-DD"),
				};

				inspectionService
					.getPaginatedInspectionReport(requestObj)
					.then((response) => {
						if (response.status == 200) {
							response.data.sdtData.content.map((item) => {
								item.createdAt = moment(item.createdAt).format("DD/MM/yyyy");
							});
							this.inspectionStatus = response.data.status;
							let inspection = response.data.sdtData.content;
							this.loadSDT(response, inspection);

						} else {
							this.loading = false;
							this.$q.notify({
								message: "Opps its look like our server is offline",
								color: "negative",
							});
						}
					})
					.catch((error) => {
						if (error.response !== undefined && error.response.status === 406) {
						}
					});
			},

			setTableConfigs() {
				this.parentDefaultSystemView.defaultTable.density = this.tableConfig.density;
				this.parentDefaultSystemView.defaultTable.pageSize = this.tableConfig.pageSize;
				this.parentDefaultSystemView.defaultTable.pageName = this.tableConfig.pageName;
				this.parentDefaultSystemView.defaultTable.sortField = this.tableConfig.sortField;
				this.parentDefaultSystemView.defaultTable.sortDirection = this.tableConfig.sortDirection;
				this.parentDefaultSystemView.defaultTable.columns = this.tableConfig.columns;
				this.sdtindex++;
			},

			getFormErrorMessage(fieldValidation) {
				if (fieldValidation.$dirty) {
					return Functions.getFormFieldErrorMessage(fieldValidation);
				}
			},

			onSelectedType(val) {
				this.selectedType = val.selectedObject.value;
			},

			onSelected(val) {
				if (val.value === "Weekly") {
					this.startDate = moment(moment().startOf("isoWeek")).format(
						"YYYY-MM-DD"
					);
					this.endDate = moment(moment().endOf("isoWeek")).format("YYYY-MM-DD");
					this.endDateDisable = true;
					this.startDateDisable = true;
				} else if (val.value === "Monthly") {
					this.startDate = moment(moment().startOf("month")).format("YYYY-MM-DD");
					this.endDate = moment(moment().endOf("month")).format("YYYY-MM-DD");
					this.endDateDisable = true;
					this.startDateDisable = true;
				} else if (val.value === "Per Day") {
					this.startDate = moment().format("YYYY-MM-DD");
					this.endDate = "";
					this.endDateDisable = true;
					this.startDateDisable = false;
				} else if (val.value === "To Day") {
					this.startDate = moment().format("YYYY-MM-DD");
					this.endDate = "";
					this.endDateDisable = true;
					this.startDateDisable = true;
				} else if (val.value === "Custom Range") {
					this.startDate = moment().format("YYYY-MM-DD");
					this.endDate = moment().format("YYYY-MM-DD");
					this.endDateDisable = false;
					this.startDateDisable = false;
				} else if (val.value === "Yearly") {
					this.startDate = moment(moment().startOf("year")).format("YYYY-MM-DD");
					this.endDate = moment(moment().endOf("year")).format("YYYY-MM-DD");
					this.endDateDisable = true;
					this.startDateDisable = true;
				} else if (val.value === "Quaterly") {
					this.startDate = moment(moment().startOf("quarter")).format(
						"YYYY-MM-DD"
					);
					this.endDate = moment(moment().endOf("quarter")).format("YYYY-MM-DD");
					this.endDateDisable = true;
					this.startDateDisable = true;
				}
			},
		},

		validations: function () {
			return {
				startDate: { required },
				selectedType: { required },
				selectedDuration: { required },
			};
		},

		computed: {
			sidebarStyle() {
				return {};
			},
		},
	};
</script>

<style lang="scss" scoped>
	.page-layout {
		margin: 32px 0px 80px 0px;
	}
	.data-section {
		flex: 8;
	}
	.empty-section {
		flex: 1;
	}
	.sidebar-section {
		flex: 3;
		position: relative;
	}

	.input-row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		column-gap: 16px;
		// justify-content: space-evenly;
	}
	.empty-report {
		margin-top: 80px;
		justify-content: center;
		align-content: center;
	}
</style>
