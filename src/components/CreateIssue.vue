<template>
  <div>
    <SDialog
      :title="'Create Issue'"
      :persistent="true"
      :width="610"
      @close="close"
    >
      <div style="padding: 24px 30px">
        <div class="column-grid-2">
          <SInput
            label="name"
            v-model="issueName"
            :error="getFormErrorMessage($v.issueName)"
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
            :key="issueCategoryIndex + 'priority'"
          />

          <SSelect
            label="Asset Category"
            v-model="category"
            :error="getFormErrorMessage($v.category)"
            :source="assetCategoryOptions"
            resultsValue="label"
            v-if="
              $route.name === 'issues' ||
              $route.name === 'assets' ||
              $route.name === 'inspection-details' ||
              $route.name === 'service-requests-details' ||
              $route.name === 'view-asset' ||
              $route.name == 'service-requests' ||
              $route.name == 'work-order-details' ||
              $route.name == 'edit-work-order-details'
            "
            resultsDisplay="label"
            :autocomplete="true"
            @selected="onSelectedAssetCategory"
            @clear="clearSelectedAssetCategory"
            :key="categoryIndex + 'category'"
            :readonly="flag"
          />

          <SSelect
            label="Asset Name"
            v-model="assetName"
            :error="getFormErrorMessage($v.assetName)"
            :source="assetNames"
            v-if="
              $route.name === 'issues' ||
              $route.name === 'assets' ||
              $route.name === 'inspection-details' ||
              $route.name === 'service-requests-details' ||
              $route.name === 'view-asset' ||
              $route.name == 'service-requests' ||
              $route.name == 'work-order-details' ||
              $route.name == 'edit-work-order-details'
            "
            resultsValue="uuid"
            resultsDisplay="label"
            :autocomplete="true"
            :key="assetIndex + 'assetName'"
            @selected="onSelectedAssetName"
            @clear="clearSelectedAssetName"
            :readonly="flag"
          />

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
            :key="issueCategoryIndex + 'cate'"
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
            :key="issueCategoryIndex + 'type'"
          />
        </div>
        <div class="separator"></div>
        <div class="column-grid-1">
          <STextarea
            v-model="userComments"
            :rows="5"
            label="Users Comments*"
            :key="commentsKey"
            :error="getFormErrorMessage($v.userComments)"
          />
        </div>
        <div
          class="col-instruction-gap pt-16"
          v-for="(instruction, instructionIndex) in instructionChecklist"
          :key="instructionIndex"
        >
          <SInput
            :label="'Your Checklist here*'+instructionIndex+1"
            v-model="instruction.value"
            :error="
              getFormErrorMessage(
                $v.instructionChecklist.$each[instructionIndex].value
              )
            "
          />
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
        <div class="separator"></div>

        <div class="mb-8">Upload Image</div>
        <div>
          <SFilePicker v-on:input="receiveDocument" v-model="fileRecord" />
        </div>
        <div v-if="sectionLoader" class="innerLoader"></div>
        <div class="" v-for="element in InspectionItemImage" :key="element.id">
          <img
            v-if="element.imageFlag"
            class="images-row"
            alt=""
            :src="'data:image/png;base64,' + element.content"
            style="
              width: 100px;
              height: 100px;
              float: left;
              padding-right: 20px;
              padding-bottom: 20px;
            "
          />
        </div>
        <div style="padding: 24px 30px; display: flex; gap: 2%">
          <div
            style="display: flex"
            v-for="(image, index) in imgAttachmentShow"
            :key="index + '_image'"
          >
            <img
              v-if="image.imageFlag === true && image.content !== null"
              :src="'data:image/png;base64,' + image.content"
              style="width: 100px; height: 100px"
              alt=""
            />
          </div>
        </div>
        <div class="mt-24">
          <SButton class="dialog-btn" title="Save" @click="createIssue" />
        </div>
      </div>
    </SDialog>

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
import InspectionService from "../services/InspectionService";
import AssetManagementService from "../services/AssetManagementService";
import { required, maxLength } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";

import loader from "./Loader.vue";
// import func from "vue-editor-bridge";

export default {
  name: "CreateIssue",
  components: { loader },
  data() {
    return {
      issueUUIDParam: "",
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
      commentsKey: 0,
      value: "",
      flag: false,
      imageVoices: [],
      issueCategoryIndex: "",
      asset: {},
      createIssueImg: [],
      categoryList: "",
      cateOptions: [],
      imgAttachmentShow: "",
      sectionLoader:false,
      cateName:""

    };
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
            // this.imageVoices = [];
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
          assetUUID: this.assetUUID,
          submittedByUserUUID: this.currentUserDetails.profile.userid,
          reportedBy:
            this.currentUserDetails.profile.firstName +
            " " +
            this.currentUserDetails.profile.lastName,
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
        for (let selected_inspection_item of this.selectedInspectionItm) {
          const element =
            selected_inspection_item.inspectionReportFields[0].uuid;

          inspectionItemObj.inspectionReportsFields.push(element);
        }

        issueRequest.issueReporting.inpectionItemsUUID =
          JSON.stringify(inspectionItemObj);
        issueRequest.issueReporting.assetUUID = this.inspectionAssetUUID;
        issueRequest.issueReporting.assetName = this.asset.name;
        issueRequest.issueReporting.assetCategory = this.asset.category;
        issueRequest.issueReporting.assetNumber = this.asset.assetNumber;
      } else {
        issueRequest.issueReporting.assetUUID = this.assetUUID;
        if (this.assetUUID !== undefined && this.assetUUID !== null) {
          let assetData = this.getAssetData(this.assetUUID);
          issueRequest.issueReporting.assetName = assetData.label;
          issueRequest.issueReporting.assetCategory = assetData.type;
          issueRequest.issueReporting.assetNumber = assetData.assetNumber;
        }
      }
      if (
        this.$route.name === "service-requests" ||
        this.$route.name === "service-requests-details" ||
        this.$route.name === "service-requests-edit"
      ) {
        issueRequest.issueReporting.uuid = this.serviceRequestDetail.uuid;
        issueRequest.issueReporting.serviceRequestFlag = true;
      } else {
        issueRequest.issueReporting.serviceRequestFlag = false;
      }
      if (this.fileRecord !== null || this.imageVoices != "") {
        this.loaderFlag = true;
        if (this.InspectionItemImage !== undefined) {
          var prop_InspectionItemImage = this.InspectionItemImage;
          var cleanArray = prop_InspectionItemImage.map((item) => {
            delete item.content, delete item.fieldUUID, delete item.message;
            (item.uuid = this.generateUUID()),
              item.contentUrl,
              (item.imageFlag = true),
              (item.messageFlag = true),
              (item.issueUUID = this.generateUUID());
            return item;
          });
          prop_InspectionItemImage = cleanArray;
          this.imageVoices.push(...prop_InspectionItemImage);
        }
        issueRequest.imageVoices = this.imageVoices;
        InspectionService.addIssue(issueRequest)
          .then((res) => {
            if (res.status === 200) {
              this.save();
              this.close();
              this.$emit("toastFlag");
              // this.showToast("Issue Created Successfully", "success");
              this.loaderFlag = false;
            }

            if (this.$router.name === "inspection-details") {
              this.$router.push("/inspection-details/:inspectionUUID");
            } else if (
              this.$router.history.current.name === "service-requests"
            ) {
              this.updateSDT();
            } else if (this.$router.history.current.name === "view-asset") {
              this.$emit("getIssues");
            }
          })
          .catch((err) => {
            this.loaderFlag = false;
            this.showToast(err.response.data.description, "error");
          });
      } else {
        this.showToast("Please select the image", "error");
      }
    },

    getAssetData(uuid) {
      let index = undefined;
      for (let i = 0; i < this.allAssetData.length; i++) {
        if (this.allAssetData[i].uuid === uuid) {
          index = i;
          break;
        }
      }
      return index !== undefined ? this.allAssetData[index] : index;
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

    onSelectedAssetCategory(value) {

      this.assetNames = [];
      for (let asset_data of this.allAssetData) {
        if (asset_data.categoryUUID === value.selectedObject.categoryUUID) {
          this.assetNames.push(asset_data);
        }
      }
      this.assetIndex++;

      // for issue category

      for (let index = 0; index < this.categoryList.length; index++) {
        if (this.categoryList[index].name === value.value) {
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
      this.loaderFlag = true;
      AssetManagementService.getAllAssetCategories(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          this.categoryList = res.data.categories;
          for (let category of res.data.categories) {
            let obj = {
              id: category.id,
              categoryUUID: category.uuid,
              label: category.name,
            };
            this.assetCategoryOptions.push(obj);
          }
          this.getAllAsset(currentUserDetails);
          this.loaderFlag = false;

          if (this.$route.name == "assets" || this.$route.name == 'view-asset' ||this.$route.name == 'inspection-details'){
            if (this.$route.name == "assets" ){
                this.cateName = this.assetObj.categoryName
            } 
            else if(this.$route.name == 'view-asset'){
                this.cateName = this.assetObj.category.name
            }else {
              this.cateName = this.category

            }
            for (let index = 0; index < this.categoryList.length; index++) {
            if (this.categoryList[index].name === this.cateName ) {
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



        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllAsset(currentUserDetails) {
      let categoryUUID = "";
      this.loaderFlag = true;
      AssetManagementService.getAllAssets(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          // console.log('getAllAssets',res)
          for (let asset of res.data.assets) {
            let obj = {
              uuid: asset.uuid,
              categoryUUID: asset.categoryUUID,
              label: asset.name,
              type: asset.type,
              assetNumber: asset.assetNumber,
            };
            this.allAssetData.push(obj);
          }

          if (this.$route.params.createWorkOrder === true) {
            for (let asset_data of this.allAssetData) {
              if (this.$route.params.assetUUID === asset_data.uuid) {
                categoryUUID = asset_data.categoryUUID;
              }
            }

            for (let asset_category of this.assetCategoryOptions) {
              if (asset_category.categoryUUID === categoryUUID) {
                this.workOrderSumary.category = asset_category.label;
              }
            }

            for (let assetData of this.allAssetData) {
              if (assetData.categoryUUID === categoryUUID) {
                this.workOrderSumary.name = assetData.label;
                this.assetNames.push(assetData);
              }
            }
            this.loaderFlag = false;
            this.categoryIndex++;
            this.assetIndex++;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAsset(uuid) {
      AssetManagementService.getAssetNameAndNumberAndCategoryByAssetUUID(uuid)
        .then((response) => {
          if (response.data) {
            let asset = response.data.assetInfoDTO;
            this.asset = asset;
            this.assetName = asset.name;
            this.category = asset.category;
            this.categoryIndex++;
            this.assetIndex++;
            this.flag = true;
          }
          // debugger
        })
        .catch((error) => {
          console.log(error);
          this.showToast("Failed to load asset information!.", "error");
        });
    },

    setData() {
      if (this.$route.name == "assets") {

        this.assetName = this.assetObj.name;
        this.category = this.assetObj.categoryName;
        this.flag = this.assetObj.assetFlag;
        this.assetUUID = this.assetObj.uuid;








      }
      if (
        this.$route.name == "inspection-details" ||
        this.$route.name === "work-order-details" ||
        this.$route.name === "edit-work-order-details"
      ) {
        this.getAsset(this.inspectionAssetUUID);
      }
      if (
        this.$route.name == "service-requests-details" ||
        this.$route.name === "service-requests-edit"
      ) {
        this.assetName = this.serviceRequestDetail.assetName;
        this.category = this.serviceRequestDetail.assetCategory;
        this.assetIndex++;
        this.categoryIndex++;
        this.flag = true;
      }
      if (this.$route.name == "service-requests") {
        this.assetName = this.serviceRequestDetail.assetName;
        this.category = this.serviceRequestDetail.assetCategory;
        this.issueCategory = this.serviceRequestDetail.issueName;
        this.issueType = this.serviceRequestDetail.issueType;

        this.userComments = this.serviceRequestDetail.issueDescription;
        this.assetUUID = this.serviceRequestDetail.assetUUID;
        this.assetIndex++;
        this.categoryIndex++;
        this.commentsKey++;
        this.flag = true;
      }
      if (this.$route.name == "view-asset") {
        this.assetName = this.assetObj.name;
        this.assetUUID = this.$route.params.assetID;
        this.category = this.assetObj.category.name;
        this.assetIndex++;
        this.categoryIndex++;
        this.flag = true;
      }
    },
    getServiceRequestByUUID() {
      this.sectionLoader = true
      InspectionService.getServiceRequestByUUID(this.serviceRequestDetail.uuid)
        .then((response) => {
          if (response.status === 200) {
            this.imgAttachmentShow = response.data.attachments;
            let imgAttachments = response.data.attachments;
            for (let x in imgAttachments) {
              let imageVoice = {
                uuid: this.generateUUID(),
                contentUrl: imgAttachments[x].contentUrl,
                imageFlag: true, // this need to be checked
                voiceFlag: false, // this need to be checked
                messageFlag: false,
                issueUUID: this.generateUUID(),
              };
              this.imageVoices.push(imageVoice);
            }
            this.sectionLoader= false;

          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
        });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },

  },

  created() {
     


    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );

    this.getAllCategories(this.currentUserDetails);

    if (this.selectedInspectionItm !== undefined) {
      for (let item of this.selectedInspectionItm) {
        let name = item.name;
        const element = item.image;
        for (let ele of element) {
          if (ele.message) {
            let comments = name + " : " + ele.message;
            this.userComments = comments;
          }
        }
      }
    }
    if (this.$route.path == "/service-requests/") {
      this.getServiceRequestByUUID();
    }

    // this.createIssueImg.push(this.InspectionItemImage)
    // console.log('createIssueImg',this.InspectionItemImage)
        this.setData();


  },

  validations: function () {
    return {
      issueName: { required, maxLength: maxLength(60) },
      issueType: { required },
      category: { required },
      assetName: { required },
      issueCategory: { required },
      issuePriority: { required },
      userComments: { required, maxLength: maxLength(500) },
      instructionChecklist: {
        $each: {
          value: {
            required,
            maxLength: maxLength(190),
          },
        },
      },
    };
  },
  props: {
    InspectionItemImage: {},
    assetUUIDs: {},
    selectedInspectionItm: {},
    inspectionAssetUUID: {},
    assetObj: {},
    inspectionDetail: {},
    serviceRequestDetail: {},
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
  column-gap: 16px;
  align-items: center;
}
.grid-create-issue {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 8px;
  row-gap: 16px;
  padding: 32px 30px;
  padding-bottom: 0px;
}
.px-30 {
  padding-left: 30px;
  padding-right: 30px;
}
</style>
