<template>
	<div class="accordion-content">
		<div class="first-class">
			<SSelect
				label="Assets"
				:v-model="selectedAssets"
				:source="AssetsOptions"
				resultsValue="uuid"
				resultsDisplay="name"
				:autocomplete="true"
				@selected="onSelected"
				@clear="clearSelectedType"
			/>
		</div>
		<!-- :error="$v.model.$error"s -->
		<div class="">
			<span><b>Assigned</b></span>
			<div class="add-icon">
				<img
					src="/assets/icons/Add.svg"
					alt=""
					width="20px"
					style="cursor: pointer"
					@click="openPopUp"
				/>
			</div>
		</div>
		<div v-padding="'32px'" v-if="assignedUsers.length === 0">
			No user assigned to this asset.
		</div>
		<table v-if="assignedUsers.length > 0">
			<tr>
				<th>Name</th>
				<th>Started Date</th>
				<th>Status</th>
				<th>No. of Time Assigned</th>
				<th></th>
			</tr>
			<tr v-for="(item, index) in assignedUsers" :key="index">
				<td>{{ item.name }}</td>
				<td>{{ item.startDate }}</td>
				<td>{{ item.status }}</td>
				<td>{{ item.count }}</td>
				<td>
					<!-- <img
						src="/assets/icons/Delete.svg"
						alt=""
						width="20px"
						style="cursor: pointer"
						@click="unassigned(index, item)"
					/> -->
					<img
						src="/assets/icons/Edit.svg"
						alt=""
						width="20px "
						style="cursor: pointer; margin-left: 20px"
						@click="editAssigned(index, item)"
					/>
				</td>
			</tr>
		</table>
		<!-- <div class="pagination" v-if="assignedUsers.length > 0">
			<SPagination
				v-model="currentPage"
				:page-count="numberOfPages"
				@input="pagination"
				:minimal="false"
			/>
		</div> -->

		<div class="">
			<span><b>Assignment History</b></span>
		</div>
		<table>
			<tr>
				<th>Name</th>
				<th>Duration</th>
				<th>Start Date</th>
				<th>Ending Date</th>
				<!-- <th >Status</th> -->
				<!-- v-for="a in columnCount" :key="a" -->
			</tr>
			<tr v-for="(item, index) in assignmentHistoryUsers" :key="index">
				<td>{{ item.name }}</td>
				<td>{{ item.durations }}</td>
				<td>{{ item.userStartDates }}</td>
				<td>{{ item.userEndingDates }}</td>
				<!-- <td>{{ item.status  }}</td> -->
				<!-- <td v-for="i in item.userStartDates" :key="i"><br>
					{{ i }}
				</td> -->
				<!-- <td v-for="j in item.userEndingDates" :key="j"><br>
					{{ j }}
				</td> -->
			</tr>
		</table>
		<div class="pagination">
			<SPagination
				v-model="currentPage"
				:page-count="numberOfPages"
				@input="pagination"
				:minimal="false"
			/>
		</div>
        <SToast
				:message="toastMessage"
				:time-out="3000"
				:type="toastType"
				:key="toastFlag"
			/>
			<loader v-if="loaderFlag" />
	</div>
</template>

<script>
	import AssetPersonnelService from "../../../services/AssetPersonnelService";
	import InspectionService from "../../../services/InspectionService";
	import moment from "moment";
	import loader from "@/components/Loader.vue";
	export default {
		name: "AssetAssignmentUnAssignment",
		components:{
			loader
		},
		props: {			
			// assignedUsers: {
			//   type: Array,
			// },
			// assignmentHistoryUsers: {
			//   type: Array,
			// },
		},

		data() {
			return {
				loaderFlag:false,
				currentPage: 1,
				numberOfPages: 0,
				rowsPerPage: 5,
				page: 0,
				assetUuid: "",
				columnCount: "",
				AssetsOptions: [],
				selectedAssets: "",
				assignedUsers: [],
				assignmentHistoryUsers: [],
                toastFlag: 0,
				toastMessage: "",
				toastType: "",
				totalElements:""
			};
		},
		
		methods: {
			pagination(val) {
				AssetPersonnelService.getAssignmentHistoryByAsset(
					this.assetUuid,
					val - 1,
					this.rowsPerPage
				)
					.then((response) => {
						this.numberOfPages = response.data.totalPages;
						if (response.status === 200) {
							let users = [];
							for (let index = 0; index < response.data.details.length; index++) {
								let obj = {};
								obj.name = response.data.details[index].name;
								obj.count = response.data.details[index].count;
								obj.userStartDates = moment(response.data.details[index].startDate).format("DD MMM YYYY hh:mm a");
								obj.userEndingDates = moment(response.data.details[index].endDate).format("DD MMM YYYY hh:mm a");
								obj.uuid = response.data.details[index].uuid;
								obj.durations = response.data.details[index].duration;
								users.push(obj);
							}
							this.assignmentHistoryUsers = users;
						}
					})
					.catch((error) => {
						if (error.response.status === 406) {
							this.$emit(
								"showToast",
								"Opps its look like our server is offline",
								"error"
							);
						}
						// this.setState({ loading: false});
						else {
							this.$emit(
								"showToast",
								"Opps its look like our server is offline",
								"error"
							);
						}
					});
			},
			unassigned(index, value) {
                value.assetUuid = this.assetUuid;
				this.$emit("unassigned", index, value);
			},
			editAssigned(index, value) {
				value.flag = true;
                value.assetUuid = this.assetUuid;
				this.$emit("editAssigned", index, value);
			},
			openPopUp() {
				if (this.assetUuid !== "") {
					this.$emit("openPopUp", this.assetUuid);
				} else {
                this.showToast("Please Select Asset for Assignment", "error");
				}
			},
			clearSelectedType() {
				this.assetUuid = "";
			},
            showToast(message, type) {
				this.toastMessage = message;
				this.toastType = type;
				this.toastFlag++;
			},
			onSelected(val) {
				console.log(val);
				this.loaderFlag = true;
				this.assetUuid = val.value;
				this.getAssignedUsersOfAsset(val.value);
				this.getAssignmentHistoryByAsset(val.value);
			},
			getAssets() {
				let currentUserDetails = JSON.parse(
					localStorage.getItem("currentUserDetails")
				);
				InspectionService.getInspectionTemplateByUUID(
					"none",
					currentUserDetails.profile.organizationId
				).then((response) => {
					if (response.status === 200) {
						this.AssetsOptions = response.data.assetAndGroupsNameResponse.assetDTOS;
					}
				});
			},
			getAssignedUsersOfAsset(uuid) {
				AssetPersonnelService.getAssignedUsersOfAsset(uuid)
					.then((response1) => {
						if (response1.status === 200) {
							let users = [];
							for (let index = 0;index < response1.data.details.length;index++) {
								let obj = {};
								obj.name = response1.data.details[index].name;
								obj.count = response1.data.details[index].count;
								obj.status = response1.data.details[index].status;
								obj.startDate = moment(	response1.data.details[index].startDate).format("DD MMM YYYY hh:mm a");
								obj.uuid = response1.data.details[index].uuid;
								obj.userEndingDates =	response1.data.details[index].userEndingDates;
								obj.assignmentId = response1.data.details[index].assignmentId;
								users.push(obj);
								this.loaderFlag = false;
							}
							this.assignedUsers = users;
						}
					})
					.catch((error) => {
						if (error.response.status === 406) {
							this.showToast("An unexpected Error Occurred", "error");
						} else {
							this.showToast(
								"Error Occurred while getting Asset Assignment",
								"error"
							);
						}
					});
			},
			getAssignmentHistoryByAsset(uuid) {
				AssetPersonnelService.getAssignmentHistoryByAsset(
					uuid,
					this.page,
					this.rowsPerPage
				)
					.then((response) => {
						if (response.status === 200) {
							let users = [];
							for (let index = 0; index < response.data.details.length; index++) {
								let obj = {};
								obj.name = response.data.details[index].name;
								obj.count = response.data.details[index].count;
								obj.userStartDates = moment(response.data.details[index].startDate).format("DD MMM YYYY hh:mm a");
								obj.userEndingDates = moment(response.data.details[index].endDate).format("DD MMM YYYY hh:mm a");
								obj.uuid = response.data.details[index].uuid;
								obj.durations = response.data.details[index].duration;
								// obj.status = response.data.details[index].status;
								users.push(obj);
								this.loaderFlag = false;
							}
							this.assignmentHistoryUsers = users;
							this.numberOfPages = response.data.totalPages;
							this.totalElements = response.data.totalElements;
						}
					})
					.catch((error) => {
						if (error.response.status === 406) {
							this.showToast("Opps its look like our server is offline", "error");
						}
						//   this.setState({ loading: false});
						else {
							this.showToast("Opps its look like our server is offline", "error");
						}
					});
			},
			
		},

		mounted() {
			this.getAssets();
		},

		validations: function () {
			return {};
		},
		computed: {},
	};
</script>

<style lang="scss" scoped>
	.first-class {
		margin: 8px 0px;
	}
	.pagination {
		display: flex;
		justify-content: flex-end;
	}
	.accordion-content {
		padding: 16px 0px;
		border-top: 1px solid var(--very-light-pink);
	}
	.add-icon {
		float: right;
	}
	table {
		margin-top: 16px;
		border-spacing: 0;
		font-size: 12px;
		line-height: 1.17;
		white-space: nowrap;
		cursor: default;
		box-shadow: 0 0 10px #e1e1e1;
		th {
			width: 14%;
			font-weight: bold;
			background: var(--secondary);
			color: #fff;
			padding: 16px;
			text-align: start;
		}

		td {
			padding: 16px;
			text-align: start;
		}

		tr:not(:first-child):hover {
			opacity: 1;
			background-color: #e1e1e1;
		}
	}
</style>