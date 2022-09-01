<template>
	<div class="add-service-request">
		<!-- <SDialog
      :width="880"
      :persistent="true"
      :crossIcon="true"
      @close="closeModal"
      :title="editServiceRequest ? 'Edit' : 'Create' + ' Service Request'"
    > -->
		<div class="dialog-page-grid">
			<SInput
				label="Title*"
				v-model="issueForm.issueName"
				class="service-padding"
				:error="getFormErrorMessage($v.issueForm.issueName)"
				:key="refreshComp + 'issueName'"
			/>

			<SSelect
				label="Asset Category*"
				v-model="assetCategory"
				:source="assetCategoryOptions"
				resultsValue="label"
				resultsDisplay="label"
				:autocomplete="true"
				@selected="onAssetCategorySelect"
				class="service-padding"
				:error="getFormErrorMessage($v.assetCategory)"
				:disabled="assetNameDisable"
				@clear="clearSelectedAssetCategory"
				:key="refreshComp + 'assetCate'"
			/>
			<SSelect
				label="Asset Name*"
				v-model="assetName"
				:source="assetNameOptions"
				resultsValue="label"
				resultsDisplay="label"
				:autocomplete="true"
				class="service-padding"
				@selected="onAssetNameSelect"
				:disabled="assetNameDisable"
				:error="getFormErrorMessage($v.assetName)"
				@clear="clearSelectedAssetName"
				:key="`category${refreshComp}`"
			/>

			<SSelect
				label="category"
				v-model="issueCategory"
				:error="getFormErrorMessage($v.issueForm.issueType)"
				:source="categoryOptions"
				resultsValue="value"
				resultsDisplay="label"
				:autocomplete="true"
				@selected="onCategorySelect"
				class="service-padding"
				@clear="clearSelectedCategory"
				:key="`issueCategory${refreshComp}`"
			/>

			<SSelect
				label="type"
				v-model="issueForm.issueType"
				:error="getFormErrorMessage($v.issueForm.issueType)"
				:source="typeOptions"
				resultsValue="value"
				resultsDisplay="label"
				:autocomplete="true"
				class="service-padding"
				@clear="clearSelectedType"
				:key="`type${refreshComp}`"
			/>

			<SSelect
				label="Priority*"
				v-model="priority"
				:source="priorityOptions"
				resultsValue="label"
				resultsDisplay="label"
				:autocomplete="true"
				:error="getFormErrorMessage($v.priority)"
				class="service-padding"
				@clear="clearSelectedPriority"
				:key="`priority${refreshComp}`"
			/>
			<STextarea
				label="Comments"
				v-model="issueForm.comments"
				:rows="3"
				:columns="8"
			/>
			<STextarea
				label="Ignore Comments"
				v-model="serviceRequestObj.ignoreComments"
				:rows="3"
				:columns="8"
				readonly
				v-if="srFlag && serviceRequestUUID !== undefined && serviceRequestObj.status == 'ignored'"
				:key="`ignoreComments${refreshComp}`"
			/>
			 <SInput label="Status" style="padding: 8px 0px 0" v-model="serviceRequestObj.status" readonly />
		</div>
			
		<div v-padding="'16px 0px'">Upload Document *</div>
		<div class="dialog-page-grid" v-padding="'8px 0px'">
		<div>
      	<SFilePicker v-on:input="receiveDocument" v-model="fileRecord" v-if="srFlag && serviceRequestUUID !== undefined" />
    	</div>		
			<div>
				<div
				v-for="(image, index) in attachments"
				:key="index + '_image'"
				v-padding="'0px 24px 20px'"
				style="float: left"
				class="images-div"
			>
			<img
					src="../../../../public/assets/icons/Delete.svg"
					alt=""
					width="20px"
					style="cursor: pointer; margin-left: 0px;"
					@click="deleteAssetImage(image.uuid)"
				/>
				<img
					v-if="image.imageFlag === true"
					:src="'data:image/png;base64,' + image.content"
					style="width: 100px; height: 100px"
					@click="fullscreenImage(image)"
				/>
				
				<SDialog
              title=""
              :width="700"
              :persistent="false"
              :closeIcon="true"
              @close="close"
              v-show="imageDialog"
            >
              <img
                v-if="popupImage.imageFlag === true"
                :src="'data:image/png;base64,' + popupImage.content"
                style="width: 100%; height: auto"
              />
            </SDialog>
			</div>
			</div>
		</div>

		<div class="create-service" v-padding="'0px 24px 24px'">
			<SButton
				title="Add Service Request"
				v-width="200"
				v-if="!srFlag"
				@click="createService()"
			></SButton>
			<SButton
				v-if="srFlag && serviceRequestUUID !== undefined"
				title="Update Service Request"
				v-width="200"
				@click="updateServiceRequest()"
			></SButton>
		</div>
		<!-- </SDialog> -->
		<SToast
			:message="toastMessage"
			:time-out="3000"
			:type="toastType"
			:key="toastFlag"
		/>
		<!-- Load Component -->
		<loader v-if="loaderFlag" />
		<!-- Loader Component -->
	</div>
</template>

<script>
	import { required } from "vuelidate/lib/validators";
	import { AssetManagementService } from "../../../services/AssetManagementService";
	import { InspectionService } from "../../../services/InspectionService";
	// import { AssetPersonnelService } from "../../../services/AssetPersonnelService";
	import moment from "moment";
	import { Functions } from "@/shared/Functions";

	import loader from "../../../components/Loader.vue";

	export default {
		name: "AddServiceRequest",
		props: {
			editServiceRequest: {},
			assetObj: {},
			calenderDateObj: {},
			srFlag: { type: Boolean },
			serviceRequestUUID: { type: String },
		},
		components: { loader },
		data() {
			return {
				refreshComp: 0,
				loaderFlag: false,
				toastFlag: 0,
				toastMessage: "",
				toastType: "",
				issueForm: {
					issueName: "",
					issueType: "",
					comments: "",
				},
				issueCategory: "",
				assetCategory: "",
				assetCategoryOptions: [],
				assetName: "",
				assetNameUuid: "",
				assetNameOptions: [],
				priority: "",
				priorityOptions: [
					{ label: "Low" },
					{ label: "Medium" },
					{ label: "High" },
				],
				fileRecord: null,
				assetNameDisable: false,
				allAssetData: [],
				currentUserDetails: "",
				categoryOptions: [],
				typeOptions: [],
				flag: false,
				imageVoices: [],
				attachments: [],
				assetNumber: "",
				asset: "",
				serviceRequestObj: "",
				imageDialog: false,
				popupImage: "",
			};
		},
		methods: {
			close() {
				this.$emit("close", true);
				this.imageDialog = false;
			},

			getAllCategories(currentUserDetails) {
				AssetManagementService.getAllAssetCategories(
					currentUserDetails.profile.organizationId
				)
					.then((res) => {
						for (let index = 0; index < res.data.categories.length; index++) {
							let obj = {
								id: res.data.categories[index].id,
								categoryUUID: res.data.categories[index].uuid,
								label: res.data.categories[index].name,
							};
							this.assetCategoryOptions.push(obj);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			},

			getAllAsset(currentUserDetails) {
				AssetManagementService.getAllAssets(
					currentUserDetails.profile.organizationId
				)
					.then((res) => {
						for (let index = 0; index < res.data.assets.length; index++) {
							let obj = {
								uuid: res.data.assets[index].uuid,
								categoryUUID: res.data.assets[index].categoryUUID,
								label: res.data.assets[index].name,
								type: res.data.assets[index].type,
							};
							this.allAssetData.push(obj);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			},
			fullscreenImage(value) {
				this.popupImage = value;
				this.imageDialog = true;
			},

			receiveDocument(file) {
				this.loaderFlag = true;
				AssetManagementService.uploadFileTos3(this.fileRecord)
					.then((res) => {
						if (res.data.responseIdentifier === "Success") {
							let imageVoice = {
								uuid: this.generateUUID(),
								contentUrl: res.data.fileUrl,
								imageFlag: true, // this need to be checked
								voiceFlag: false, // this need to be checked
								messageFlag: false,
								issueUUID: this.generateUUID(),
							};
							this.imageVoices = [];
							this.imageVoices.push(imageVoice);
							this.showToast("Image added successfully", "success");
							this.loaderFlag = false;
						}
					})
					.catch((e) => {
						this.loaderFlag = false;
						this.showToast("Request failed with status code 406", "error");
					});
			},

			createService() {
				this.$v.$touch();
				if (this.$v.$invalid) {
					this.showToast("Please fill all the required fields!", "warning");
					return;
				}
				this.loaderFlag = true;
				let issue = this.buildIssueObject();
				let issueRequest = {};
				issueRequest.issueReporting = issue;
				issueRequest.imageVoices = this.imageVoices;
				if (this.fileRecord !== null) {
					this.sendCreateIssueRequest(issueRequest);
				} else {
					this.loaderFlag = false;
					this.showToast("Please Select Image", "error");
				}
			},
			/* Select List Events */
			onAssetCategorySelect(obj) {
				this.assetNameOptions = this.allAssetData;
				let tempAssetNameOption = [];
				for (let index = 0; index < this.assetNameOptions.length; index++) {
					if (this.assetNameOptions[index].type === obj.value) {
						tempAssetNameOption.push(this.assetNameOptions[index]);
					}
				}
				this.assetNameOptions = [];
				this.assetNameOptions = tempAssetNameOption;
				this.assetNameDisable = false;
			},

			clearSelectedAssetCategory() {
				this.assetCategory = "";
				this.assetName = "";
				this.assetNameUuid = "";
				this.assetNameOptions = [];
				this.refreshComp++;
			},

			onAssetNameSelect(obj) {
				this.assetNameUuid = obj.selectedObject.uuid;
			},

			clearSelectedAssetName() {
				this.assetNameUuid = "";
				this.assetName = "";
			},

			onCategorySelect(value) {
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

			clearSelectedCategory() {
				this.issueCategory = "";
				this.typeOptions = [];
				this.issueForm.issueType = "";
				this.refreshComp++;
			},

			clearSelectedType() {
				this.issueForm.issueType = "";
			},

			clearSelectedPriority() {
				this.priority = "";
			},
			/* Select List Events */

			buildIssueObject() {
				let issue = {};
				issue.uuid = this.generateUUID();
				issue.issueName = this.issueForm.issueName;
				issue.issueDescription = this.issueForm.comments;
				issue.status = "new";
				issue.assetUUID = this.assetNameUuid;
				issue.submittedByUserUUID = this.currentUserDetails.profile.userid;
				issue.priority = this.priority;
				issue.reportedAt = new moment().toISOString();
				issue.issueType = this.issueForm.issueType;
				issue.issueCategory = this.issueCategory;
				issue.tenantUUID = this.currentUserDetails.profile.organizationId;
				issue.serviceRequestFlag = true;
				return issue;
			},

			generateUUID() {
				let d = new Date().getTime();
				if (Date.now()) {
					d = Date.now();
				}

				let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
					/[xy]/g,
					(c) => {
						let r = (d + Math.random() * 16) % 16 | 0;
						d = Math.floor(d / 16);
						return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
					}
				);
				return uuid;
			},

			getFormErrorMessage(fieldValidation) {
				if (fieldValidation.$dirty) {
					return Functions.getFormFieldErrorMessage(fieldValidation);
				}
			},

			sendCreateIssueRequest(issueRequest) {
				this.$emit("issueRequest", issueRequest);
			},

			getDropDownConfigs() {
				this.dropDownConfigs = JSON.parse(
					localStorage.getItem("dropDownConfigs")
				);
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
			},

			showToast(message, type) {
				this.toastMessage = message;
				this.toastType = type;
				this.toastFlag++;
			},
			deleteAssetImage(uuid) {
				this.loaderFlag = true;
				InspectionService.deleteIssueImage(uuid)
					.then((res) => {
						if (res.status === 200) {
							this.loaderFlag = false;
							this.showToast("Image Delete Succussfully", "success");
							this.getServiceRequestByUUID();
						} else {
							this.showToast(res.data.description, "error");
						}
					})
					.catch((e) => {
						this.showToast(e.data.response, "error");
						this.loaderFlag = true;
					});
			},
			updateServiceRequest() {
				this.loaderFlag = true;
				if (this.fileRecord !== null) {
					let UpdateServiceRequestRequest = {
						uuid: this.serviceRequestObj.uuid,
						name: this.issueForm.issueName,
						assetUUID: this.assetNameUuid,
						priority: this.priority,
						status: this.serviceRequestObj.status,
						comments: this.issueForm.issueDescription,
						ignoreComments: this.issueForm.ignoreComments,
					};
					UpdateServiceRequestRequest.imageVoices = this.fileUpload;
					InspectionService.updateServiceRequest(UpdateServiceRequestRequest)
						.then((res) => {
							if (res.data.responseCode == "F200") {
								this.$router.push({
									name: "service-requests",
									params: {
										toastFlag: true,
										toastSuccess: "success",
										message: "Service Request Updated Succussfully.",
									},
								});
								this.loaderFlag = false;
								// this.getServiceRequestByUUID();
							}
						})
						.catch((e) => {
							// console.log(e);
							this.showToast(e.response.data, "error");
							this.loaderFlag = false;
						});
				} else {
					this.loaderFlag = true;
					let UpdateServiceRequestRequest = {
						uuid: this.serviceRequestObj.uuid,
						name: this.issueForm.issueName,
						assetUUID: this.assetNameUuid,
						priority: this.priority,
						status: this.serviceRequestObj.status,
						comments: this.issueForm.issueDescription,
						ignoreComments: this.issueForm.ignoreComments,
					};
					InspectionService.updateServiceRequest(UpdateServiceRequestRequest)
						.then((res) => {
							if (res.data.responseCode == "F200") {
								this.loaderFlag = false;
								// this.getServiceRequestByUUID();
								this.$router.push({
									name: "service-requests",
									params: {
										toastFlag: true,
										toastSuccess: "success",
										message: "Service Request Updated Succussfully.",
									},
								});
							}
						})
						.catch((e) => {
							// console.log(e);
							this.showToast(e.response.data, "error");
							this.loaderFlag = false;
						});
				}
			},
			getAsset(uuid) {
				this.loading = true;
				AssetManagementService.getAssetNameAndNumberAndCategoryByAssetUUID(uuid)
					.then((response) => {
						this.asset = response.data.assetInfoDTO;
						this.assetCategory = this.asset.category;
						this.assetName = this.asset.name;
						this.refreshComp++;
						this.loaderFlag = false;
					})
					.catch((e) => {
						this.loading = false;
						this.assetError = true;
						this.showToast("Failed to load asset information!", "error");
					});
			},
			getServiceRequestByUUID() {
				InspectionService.getServiceRequestByUUID(this.serviceRequestUUID)
					.then((response) => {
						if (response.status === 200) {
							this.loaderFlag = true;
							this.attachments = response.data.attachments;
							this.serviceRequestObj = response.data.serviceRequest;
							let serviceRequest = response.data.serviceRequest;
							this.userComments = serviceRequest.issueDescription;
							this.repairInstruction = serviceRequest.description;
							this.issueForm.issueName = serviceRequest.issueName;
							this.issueForm.issueType = serviceRequest.issueType;
							this.issueForm.ignoreComments = serviceRequest.ignoreComments;
							this.issueForm.comments = serviceRequest.comments;
							this.issueCategory = serviceRequest.issueCategory;
							let useruuids = [];
							let assetuuids = [];
							assetuuids.push(serviceRequest.assetUUID);
							//this.assetId = serviceRequest.assetUUID;
							this.getAsset(serviceRequest.assetUUID);
							useruuids.push(serviceRequest.submittedByUserUUID);
							let attachments = [];
							// let attachmentsResponse = response.data.attachments;
							this.refreshComp++;
							serviceRequest.reportedAt = moment(
								serviceRequest.reportedAt
							).format("DD MMM YYYY hh:mm a");
							if (serviceRequest.priority === null) {
								this.priority = "Not Assigned";
							} else {
								this.priority = serviceRequest.priority;
							}
							this.issueForm.comments = serviceRequest.issueDescription;

							//get attachment content
							for (
								let attachmentIndex = 0;
								attachmentIndex < attachments.length;
								attachmentIndex++
							) {
								InspectionService.getFile(
									attachments[attachmentIndex].contentUrl
								).then((response5) => {
									if (response5.data.responseIdentifier === "Success") {
										attachments[attachmentIndex].loading = false;
										attachments[attachmentIndex].content = response5.data.content;
										//  this.allexecute = true;
										this.imageVoices = attachments;
									}
								});
							}
						} else {
							this.showToast("An Error occurred", "error");
						}
					})
					.catch((error) => {
						this.showToast(error.data.response, "error");
					});
			},
		},
		mounted() {
			this.currentUserDetails = JSON.parse(
				localStorage.getItem("currentUserDetails")
			);
			this.getAllCategories(this.currentUserDetails);
			this.getAllAsset(this.currentUserDetails);
			console.log(this.serviceRequestUUID);
			console.log(this.srFlag);
			if (this.srFlag && this.serviceRequestUUID !== undefined) {
				this.getServiceRequestByUUID();
			}

			this.getDropDownConfigs();
		},
		validations: function () {
			return {
				issueForm: {
					issueName: { required },
					issueType: { required },
				},
				priority: { required },
				assetCategory: { required },
				assetName: { required },
			};
		},
	};
</script>

<style scoped lang="scss">
	.dialog-page-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 24px 0px 0;
		 column-gap: 8px;
		.service-padding {
			padding-bottom: 8px;
		}
		.grid-row-three {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
	.upload-section {
		padding-left: 8px;
		padding: 0px 8px;
	}
	.document-section {
		padding-top: 8px;
	}	
	.create-service {
		float: right !important;
		padding-right: 8px;
		padding-bottom: 8px;
	}
	.images-div{
  display: inline-grid;
  grid-gap: 3px;
}
</style>