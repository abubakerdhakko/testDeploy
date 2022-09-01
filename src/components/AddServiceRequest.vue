<template>
  <div class="add-service-request">
    <div>
      <SDialog
        :width="880"
        :persistent="true"
        :crossIcon="true"
        @close="closeModal"
        :title="editServiceRequest ? 'Edit' : 'Create' + ' Service Request'"
      >
        <div style="padding: 24px 30px">
          <div class="column-grid-2">
            <SInput
              label="Title*"
              v-model="issueForm.issueName"
              class="service-padding"
              :error="getFormErrorMessage($v.issueForm.issueName)"
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
              label="Issue Category"
              v-model="issueCategory"
              :error="getFormErrorMessage($v.issueForm.issueType)"
              :source="categoryOptions"
              resultsValue="value"
              resultsDisplay="label"
              :autocomplete="true"
              @selected="onCategorySelect"
              class="service-padding"
              @clear="clearSelectedCategory"
            />

            <SSelect
              label="Issue Type"
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
          </div>
          <div class="separator"></div>
          <div class="column-grid-1">
            <STextarea
              label="Comments"
              v-model="issueForm.comments"
              :rows="3"
              :columns="15"
            />
          </div>
          <div class="column-grid-1">Upload Document *</div>
          <div class="column-grid-1">
            <SFilePicker v-on:input="receiveDocument" v-model="fileRecord" />
          </div>

          <SButton
            class="dialog-btn"
            title="Add Service Request"
            @click="createService()"
          ></SButton>
        </div>
      </SDialog>
    </div>
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
import { AssetManagementService } from "../services/AssetManagementService";
import { InspectionService } from "../services/InspectionService";
import moment from "moment";
import { Functions } from "@/shared/Functions";

import loader from "./Loader.vue";

export default {
  name: "AddServiceRequest",
  props: {
    editServiceRequest: {},
    assetObj: {},
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
      assetInfo: {},
      categoryList: "",
      cateOptions: [],
    };
  },
  methods: {
    saveModal() {
      this.$emit("save", true);
    },

    closeModal() {
      this.$emit("close", true);
    },

    getAllCategories(currentUserDetails) {
      this.loaderFlag = true;
      AssetManagementService.getAllAssetCategories(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          this.categoryList = res.data.categories;
          for (let index = 0; index < res.data.categories.length; index++) {
            let obj = {
              id: res.data.categories[index].id,
              categoryUUID: res.data.categories[index].uuid,
              label: res.data.categories[index].name,
            };
            this.assetCategoryOptions.push(obj);
            this.loaderFlag = false;
           if (this.$route.name == "assets" || this.$route.name == 'view-asset'){
            for (let index = 0; index < this.categoryList.length; index++) {
            if (this.categoryList[index].name === this.assetObj.categoryName) {
              for (
                let index1 = 0;
                index1 < this.categoryList[index].issuesCategory.fields.length;
                index1++
              ) {
                let obj = {
                  label:
                    this.categoryList[index].issuesCategory.fields[index1].label,
                  value:
                    this.categoryList[index].issuesCategory.fields[index1].label,
                };
                this.cateOptions.push(
                  this.categoryList[index].issuesCategory.fields[index1]
                );
                this.categoryOptions.push(obj);
              }
            }
          }
        }

          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getAllAsset(currentUserDetails) {
      this.loaderFlag = true;
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
              assetNumber: res.data.assets[index].assetNumber,
            };
            this.allAssetData.push(obj);
            this.loaderFlag = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
      // for issue category

      for (let index = 0; index < this.categoryList.length; index++) {
        if (this.categoryList[index].name === obj.value) {
          for (
            let index1 = 0;
            index1 < this.categoryList[index].issuesCategory.fields.length;
            index1++
          ) {
            let obj = {
              label:
                this.categoryList[index].issuesCategory.fields[index1].label,
              value:
                this.categoryList[index].issuesCategory.fields[index1].label,
            };
            this.cateOptions.push(
              this.categoryList[index].issuesCategory.fields[index1]
            );
            this.categoryOptions.push(obj);
          }
        }
      }

      this.assetNameOptions = [];
      this.assetNameOptions = tempAssetNameOption;
      this.assetNameDisable = false;
    },

    onCategorySelect(value) {
      this.typeOptions = [];
      this.issueType = "";
      for (let x in this.cateOptions) {
        if (
          value.value === this.cateOptions[x].label &&
          this.cateOptions[x].options !== ""
        ) {
          var splitVals = this.cateOptions[x].options.split(",");
          for (let y in splitVals) {
            let obj = {
              label: splitVals[y],
              value: splitVals[y],
            };
            this.typeOptions.push(obj);
          }
        }
      }
    },

    clearSelectedAssetCategory() {
      this.assetCategory = "";
      this.assetName = "";
      this.assetNameUuid = "";
      this.issueCategory = "";
      // issueForm.issueType
      this.assetNameOptions = [];
      this.typeOptions = [];
      this.categoryOptions = [];
      this.refreshComp++;
    },

    onAssetNameSelect(obj) {
      this.assetNameUuid = obj.selectedObject.uuid;
      this.assetInfo = obj.selectedObject;
    },

    clearSelectedAssetName() {
      this.assetNameUuid = "";
      this.assetName = "";
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
      issue.reportedBy =
        this.currentUserDetails.profile.firstName +
        " " +
        this.currentUserDetails.profile.lastName;
      issue.priority = this.priority;
      issue.reportedAt = new moment().toISOString();
      issue.issueType = this.issueForm.issueType;
      issue.issueCategory = this.issueCategory;
      issue.tenantUUID = this.currentUserDetails.profile.organizationId;
      issue.serviceRequestFlag = true;
      issue.assetName =
        this.assetObj !== undefined && this.assetObj !== null
          ? this.assetObj.name
          : this.assetInfo.label;
      issue.assetCategory =
        this.assetObj !== undefined && this.assetObj !== null
          ? this.assetObj.categoryName
          : this.assetInfo.type;
      issue.assetNumber =
        this.assetObj !== undefined && this.assetObj !== null
          ? this.assetObj.assetNumber
          : this.assetInfo.assetNumber;
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
      InspectionService.addIssue(issueRequest)
        .then((res) => {
          if (res.status === 200) {
            this.loaderFlag = false;
            this.showToast(res.data.description, "success");
            this.saveModal();
          }
        })
        .catch((err) => {
          this.loaderFlag = false;
          this.showToast(err, "error");
          console.log(err);
        });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  mounted() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAllCategories(this.currentUserDetails);
    this.getAllAsset(this.currentUserDetails);
  },
  created() {
    if (this.$route.name == "assets") {
      this.assetNameUuid = this.assetObj.uuid;
      this.assetName = this.assetObj.name;
      this.assetCategory = this.assetObj.categoryName;
      this.assetNameDisable = this.assetObj.assetNameDisable;
    }
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
.comment-section {
  padding-left: 8px;
  margin: -8px 24px 16px 16px;
}
.upload-section {
  padding-left: 8px;
  margin: -8px 16px 16px 16px;
}
.document-section {
  padding-top: 16px;
}
.create-service {
  float: right;
  padding-right: 8px;
  padding-bottom: 8px;
}
.px-30 {
  padding: 16px 30px 30px 30px;
}
</style>
