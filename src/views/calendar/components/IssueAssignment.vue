<template id="issueId">
  <div>
    <!-- <SDialog
      :title="'Create Issue'"
      :persistent="true"
      :width="610"
      @close="close"
    > -->
      <div class="grid-create-issue">
        <SInput
          label="name"
          v-model="issueName"
          :error="getFormErrorMessage($v.issueName)"
          :key="keyIndex+'issue'"
        />
        <SSelect
          label="Priority"
          v-model="issuePriority"
          :error="getFormErrorMessage($v.issuePriority)"
          :source="priorityOptions"
          resultsValue="label"
          resultsDisplay="label"
          :autocomplete="false"
          @clear="clearSelectedPriority"
          :key="keyIndex + 'priority'"
        />
        <SSelect
          label="Asset Category"
          v-model="category"
          :error="getFormErrorMessage($v.category)"
          :source="assetCategoryOptions"
          resultsValue="label"
          resultsDisplay="label"
          :autocomplete="true"
          @selected="onSelectedAssetCategory"
          @clear="clearSelectedAssetCategory"
          :key="keyIndex + 'category'"
          :readonly="this.flag"
        />
          <!-- v-if="
            this.$route.name === 'issues' ||
            this.$route.name === 'assets' ||
            this.$route.name === 'inspection-details' ||
            this.$route.name === 'service-requests-details' ||
            this.$route.name === 'view-asset' ||
            this.$route.name == 'service-requests'
          " -->

        <SSelect
          label="Asset Name"
          v-model="assetName"
          :error="getFormErrorMessage($v.assetName)"
          :source="assetNames"
          resultsValue="uuid"
          resultsDisplay="label"
          :autocomplete="true"
          :key="keyIndex + 'assetName'"
          @selected="onSelectedAssetName"
          @clear="clearSelectedAssetName"
          :readonly="this.flag"
        />
          <!-- v-if="
            this.$route.name === 'issues' ||
            this.$route.name === 'assets' ||
            this.$route.name === 'inspection-details' ||
            this.$route.name === 'service-requests-details' ||
            this.$route.name === 'view-asset' ||
            this.$route.name == 'service-requests'
          " -->

        <SSelect
          label="category"
          v-model="issueCategory"
          :error="getFormErrorMessage($v.issueCategory)"
          :source="categoryOptions"
          resultsValue="value"
          resultsDisplay="label"
          :autocomplete="true"
          @selected="selectCate"
          @clear="clearSelectedCategory"
          :key="keyIndex + 'cate'"
        />
        <SSelect
          label="type"
          v-model="issueType"
          :error="getFormErrorMessage($v.issueType)"
          :source="typeOptions"
          resultsValue="value"
          resultsDisplay="label"
          :autocomplete="true"
          @clear="clearSelectedCategortType"
          :key="keyIndex + 'type'"
        />
      </div>
      <div style="padding: 8px 0px 0">
        <STextarea
          v-model="userComments"
          :rows="3"
          :label="
            getFormErrorMessage($v.userComments)
              ? `Users Comments ${getFormErrorMessage($v.userComments)}`
              : 'User Comments'
          "
          :key="keyIndex"
        />
      </div>
      <div>
        <div
          class="col-instruction-gap"
          v-for="(instruction, instructionIndex) in instructionChecklist"
          :key="instructionIndex"
        >
          <SInput label="Your Checklist here*" v-model="instruction.value" />
          <img
            width="16px"
            style="cursor: pointer"
            src="assets/icons/Delete.svg"
            alt=""
            @click="subInstruction(instructionIndex)"
          />
          <img
            v-if="instructionIndex === instructionChecklist.length - 1"
            width="16px"
            style="cursor: pointer"
            src="assets/icons/Add.svg"
            alt=""
            @click="addInstruction()"
          />
        </div>
      </div>
      <div v-padding="'8px 0'">Upload Image</div>
      <div class="grid-create-issue">
        <div>
        <SFilePicker v-on:input="receiveDocument" v-model="fileRecord" />
        </div>
        <div>
          <div
				v-for="(image, index) in imageVoices"
				:key="index + '_image'"
        class="images-div"
			>
      <img
					src="../../../../public/assets/icons/Delete.svg"
					alt=""
					width="20px"
					style="cursor: pointer; margin-left: 10px;"
					@click="deleteAssetImage(image.uuid)"
				/>
				<img
					v-if="image.imageFlag === true"
					:src="'data:image/png;base64,' + image.content"
					style="width: 100px; height: 100px;  margin-left: 10px;"
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
      	
      <div class="create-service" style="text-align: right" v-padding="'8px 24px 24px'">
        <SButton
          title="Save"
          @click="createIssue"
          v-if="!issueFlag"
        />
        <SButton
          title="Update"
          @click="updateIssue"
          v-if="issueFlag"
        />
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
import InspectionService from "./../../../services/InspectionService";
import AssetManagementService from "./../../../services/AssetManagementService";
import { required } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";
import moment from "moment";

import loader from "./../../../components/Loader.vue";

export default {
  name: "CreateIssue",
  components: { loader },
  data() {
    return {
      loaderFlag: false,
      instructionChecklist: [
        {
          value: "",
        },
      ],
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      issueName: "",
      issueType: "",
      category: "",
      assetName: "",
      assetUuid: "",
      fileRecord: null,
      assetCategoryOptions: [],
      allAssetData: [],
      assetNames: [],
      issueCategory: "",
      issuePriority: "",
      userComments: "",
      repairInstruction: "",
      currentUserDetails: "",
      priorityOptions: [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
      ],
      categoryOptions: [],
      typeOptions: [],
      dropDownConfigs: {},
      categoryIndex: 0,
      assetIndex: 0,
      keyIndex: 0,
      value: "",
      flag: false,
      imageVoices: [],
      issueCategoryIndex: "",
      issues:"",
      imageDialog: false,
			popupImage: "",
    };
  },
   props: {
    assetUUIDs: {},
    selectedInspectionItm: {},
    inspectionAssetUUID: {},
    assetObj: {},
    inspectionDetail: {},
    issuesObj:{},
    serviceRequestDetail: {},
    issueFlag:{type:Boolean},
    issueID:{type:String}
    //  assetUuid: {},
  },
  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$error) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    clearSelectedPriority() {
      this.issuePriority = "";
      this.issueCategoryIndex++;
    },

    clearSelectedCategory() {
      this.issueCategory = "";
      this.typeOptions = [];
      this.issueType = "";
      this.issueCategoryIndex++;
    },

    clearSelectedCategortType() {
      this.issueType = "";
      this.issueCategoryIndex++;
    },

    addInstruction() {
      this.instructionChecklist.push({
        value: "",
      });
    },

    subInstruction(instructionIndex) {
      this.instructionChecklist.splice(instructionIndex, 1);
    },
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save");
    },
    updateSDT() {
      this.$emit("updateSDT");
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
          this.showToast(`${e}. Please upload image again`, "error");
          this.loaderFlag = false;
        });
    },
    createIssue() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill are the required fields", "warning");
        return;
      }
      let issueRequest = {
        issueReporting: {
          issueName: this.issueName,
          status: "reported",
          instructionChecklist: JSON.stringify(this.instructionChecklist),
          //	assetUUID: this.assetUUID,
          submittedByUserUUID: this.currentUserDetails.profile.userid,
          issueType: this.issueType,
          issueCategory: this.issueCategory,
          priority: this.issuePriority,
          tenantUUID: this.currentUserDetails.profile.organizationId,
          issueFlag: true,
          description: this.repairInstruction,
          issueDescription: this.userComments,
        },
      };
      if (this.selectedInspectionItm !== undefined) {
        let inspectionItemObj = {
          inspectionUUID: this.selectedInspectionItm.inspectionUUID,
          inspectionReportsFields: [],
        };
        for (
          let index = 0;
          index < this.selectedInspectionItm.length;
          index++
        ) {
          const element =  this.selectedInspectionItm[index].inspectionReportFields[0].uuid;
          inspectionItemObj.inspectionReportsFields.push(element);
        }

        issueRequest.issueReporting.inpectionItemsUUID =  JSON.stringify(inspectionItemObj);
        issueRequest.issueReporting.assetUUID = this.inspectionAssetUUID;
      } else {
        issueRequest.issueReporting.assetUUID = this.assetUUID;
      }
      if (
        this.$route.name === "service-requests" ||
        this.$route.name === "service-requests-details"
      ) {
        issueRequest.issueReporting.uuid = this.serviceRequestDetail.uuid;
        issueRequest.issueReporting.serviceRequestFlag = true;
      } else {
        //issueRequest.issueReporting.serviceRequestIssueNumber = this.$route.params.assetUUID;
        issueRequest.issueReporting.serviceRequestFlag = false;
      }

      if (this.fileRecord !== null) {
        this.loaderFlag = true;
        issueRequest.imageVoices = this.imageVoices;
        this.$emit("requestObject", issueRequest);
     
      } else {
        this.showToast("Please select the image", "error");
      }
    },
   
    updateIssue() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }
      this.loaderFlag = true;
      this.issues.reportedAt = moment(this.issues.reportedAt).toISOString();
      this.issues.issueName = this.issueName;
      this.issues.priority = this.issuePriority;
      this.issues.issueCategory = this.issueCategory;
      this.issues.issueType = this.issueType;
      this.issues.issueDescription = this.userComments;
      this.issues.instructionChecklist = this.repairInstruction;
      this.issues.assetName = this.assetName;
      this.issues.assetUUID = this.objAssetUUID;
      let updateIssueRequest = {
        issueReporting: this.issues,
        imageVoices: [],
      };
      if (this.fileRecord !== null) {
        //means file is attached to it
        updateIssueRequest.imageVoices = this.fileUpload;
          this.$emit("updateIssueAssignment", updateIssueRequest);
      } else if (this.fileRecord == null) {
        this.$emit("updateIssueAssignment", updateIssueRequest);
      }
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

    onSelectedAssetCategory(value) {
      this.assetNames = [];
      for (let index = 0; index < this.allAssetData.length; index++) {
        if (  this.allAssetData[index].categoryUUID === value.selectedObject.categoryUUID) {
          this.assetNames.push(this.allAssetData[index]);
        }
      }
      this.assetIndex++;
    },
    clearSelectedAssetCategory() {
      this.assetNames = [];
      this.category = "";
      this.assetName = "";
      this.assetIndex++;
    },

    onSelectedAssetName(value) {
      this.assetUUID = value.selectedObject.uuid;
    },
    clearSelectedAssetName() {
      this.assetUUID = "";
      this.assetName = "";
      this.assetIndex++;
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
          this.getAllAsset(currentUserDetails);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllAsset(currentUserDetails) {
      let categoryUUID = "";
      AssetManagementService.getAllAssets(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          // console.log("all asset", res);
          for (let index = 0; index < res.data.assets.length; index++) {
            let obj = {
              uuid: res.data.assets[index].uuid,
              categoryUUID: res.data.assets[index].categoryUUID,
              label: res.data.assets[index].name,
              type: res.data.assets[index].type,
            };
            this.allAssetData.push(obj);
            if (this.$route.name === "inspection-details") {
              for (let index = 0; index < this.allAssetData.length; index++) {
                if (this.allAssetData[index].uuid == this.inspectionAssetUUID) {
                  for (
                    let index1 = 0;
                    index1 < this.assetCategoryOptions.length;
                    index1++
                  ) {
                    if (
                      this.assetCategoryOptions[index1].categoryUUID ===
                      this.allAssetData[index].categoryUUID
                    ) {
                      this.category = this.assetCategoryOptions[index1].label;
                      this.categoryIndex++;
                      this.flag = true;
                    }
                  }
                }
              }
            }
          }

          if (this.$route.params.createWorkOrder === true) {
            for (let index = 0; index < this.allAssetData.length; index++) {
              if (
                this.$route.params.assetUUID === this.allAssetData[index].uuid
              ) {
                categoryUUID = this.allAssetData[index].categoryUUID;
              }
            }

            for (
              let indx = 0;
              indx < this.assetCategoryOptions.length;
              indx++
            ) {
              if (
                this.assetCategoryOptions[indx].categoryUUID === categoryUUID
              ) {
                this.workOrderSumary.category =  this.assetCategoryOptions[indx].label;
              }
            }

            for (let j = 0; j < this.allAssetData.length; j++) {
              if (this.allAssetData[j].categoryUUID === categoryUUID) {
                this.workOrderSumary.name = this.allAssetData[j].label;
                this.assetNames.push(this.allAssetData[j]);
              }
            }

            this.categoryIndex++;
            this.assetIndex++;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAsset(uuid) {
      AssetManagementService.getAssetWithDetails(
        uuid,
        false, true
      )
        .then((response) => {
          let asset = response.data.assetDetail;
          this.asset = asset;
          console.log(asset);
          this.assetName = asset.assetDetail.name;
          this.category = asset.category.name;
          this.keyIndex++;
            this.loaderFlag = false;
         // this.flag = true;
          //	debugger
        })
        .catch((error) => {
          console.log(error);
          this.showToast("Failed to load asset information!.", "error");
        });
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
      deleteIssueImage(uuid) {
      InspectionService.deleteIssueImage(uuid)
        .then((res) => {
          if (res.status === 200) {
            this.showToast("Image remove successfully", "success");
            this.getIssueDetails();
          }
        })
        .catch((e) => {});
    },
 fullscreenImage(value) {
      this.popupImage = value;
      this.imageDialog = true;
    },
    getIssueDetails() {
      this.loaderFlag = true;
     		InspectionService.getIssueByUUID(this.issueID).then((response) => {
				this.imageVoices = response.data.imageVoices;
				if (response.status === 200) {
        this.issues = response.data.issueReporting;
				let issuesObj = response.data.issueReporting;
        this.issueName = issuesObj.issueName;
        this.issuePriority = issuesObj.priority;        
        this.issueCategory = issuesObj.issueCategory;
        this.issueType = issuesObj.issueType;
        this.userComments = issuesObj.issueDescription;
        this.instructionChecklist = JSON.parse(issuesObj.instructionChecklist);
				this.getAsset(issuesObj.assetUUID);
				console.log("issue",issuesObj);
				this.keyIndex++
				}
			})
				.catch((error) => {});
			},
  },
  mounted() {
    console.log("issue file",this.issueID);
    if (this.issueFlag === true && this.issueID !== undefined) {
      this.getIssueDetails();
    }
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAllCategories(this.currentUserDetails);
    this.dropDownConfigs = JSON.parse(localStorage.getItem("dropDownConfigs"));
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
    } 
  },

  validations: function () {
    return {
      issueName: { required },
      issueType: { required },
      category: { required },
      assetName: { required },
      issueCategory: { required },
      issuePriority: { required },
      userComments: { required },
    };
  },
 
};
</script>

<style lang="scss" scoped>
.createIssue-dialog {
  .modal {
    width: 980px;
  }
}
.col-instruction-gap {
  display: grid;
  grid-template-columns: 1fr 16px 16px;
  column-gap: 8px;
  align-items: center;
  padding: 8px 0px 0;
}
.grid-create-issue {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 8px;
  row-gap: 8px;
  padding: 16px 0px;
}
.images-div{
  display: inline-grid;
  grid-gap: 3px;
}
 
.create-service {
  float: right !important;
  padding-right: 8px;
  padding-bottom: 8px;
}

</style>
