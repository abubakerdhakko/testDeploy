<template>
  <div>
    <SDialog
      title="Import Asset CSV"
      :width="700"
      :persistent="true"
      :closeIcon="false"
      @close="close"
    >
      <div class="main-grid">
         <SMultipleSelect
            :checkbox="true"
            label="Asset Categories"
            v-model="categories.name"
            :avatar="false"
            :data="categories"
            optionLabel="name"
            @selected-values="onSelected"
            :key="index"
          />
          <br/>

        <div class="" v-if="importType === 'Add'">
          <SSelect
            v-if="this.step == '1' || this.step == 'createNewTemplate' || this.step == 'createExistingTemplate' && this.step !== ''"
            label="Select Options*"
            v-model="selectOptionsName"
            :source="selectOptions"
            resultsDisplay="name"
            resultsValue="value"
            :autocomplete="false"
            @selected="onSelectedOptions"
          />
        </div>
        <div class="column-grid" v-if="importType === 'Add'">
          <!-- <div class="mt-8 mb-8">
            <SButton
              rounded
              dense
              :title="label"
              v-width="200"
              @clicked-item="createTemplate"
            ></SButton>
          </div> -->
        </div>
        <div  class="CreateNewTemplate_style">
          <CreateNewTemplate   
            :step="step"
            :categories="fieldsData"
            :viewTemplate="false"
            @close="closeAddPopup"
          />
        </div>
        <div class="filePickerRow">
          <span style="padding-bottom: 0.5em; padding-top: 0.5em"
            >Select CSV File:</span
          >
          <SFilePicker :ref="'imageFile'" v-model="file"></SFilePicker>
        </div>
        <div class="column-grid-2">
          <div></div>
          <div class="mt-32 mb-32 dialog-btn float-right" v-grid="2">
            <SButton
              rounded
              dense
              title="Import"
              @clicked-item="importFile"
            ></SButton>
            <SButton
              rounded
              dense
              title="Cancel"
              style="margin-left: 5px"
              @clicked-item="close"
            ></SButton>
          </div>
        </div>
      </div>
    </SDialog>
    <!-- <CreateImportTemplate
      v-if="openAddPopUp"
      :categories="fieldsData"
      :viewTemplate="false"
      @close="closeAddPopup"
    ></CreateImportTemplate> -->
    <SummaryPopUp
      v-if="showSuccessDialog"
      :importRecords="importRecords"
      :assetImport="assetImport"
      @close="closeSuccessPopUp"
    ></SummaryPopUp>
    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      :key="toastFlag"
    />

    <!-- Loader Component  -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component  -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import AssetManagementService from "../../../services/AssetManagementService";
import CreateImportTemplate from "../components/CreateTemplateDialog.vue";
import CreateNewTemplate from "../components/CreateNewTemplate.vue";
import SummaryPopUp from "../components/SummaryPopUp.vue";

import loader from "@/components/Loader.vue";

export default {
  name: "ImportExportDialog",

  components: {
    CreateImportTemplate,
    CreateNewTemplate,
    SummaryPopUp,
    loader,
  },
  props: {
    success: Boolean,
    importType: String,
  },

  data() {
    return {
      openAddPopUp: false,
      file: "",
      label: "Create Template",
      categories: [],
      selectOptions: [
        {
          name: "Create New Template",
          value: "Create New Template",
        },
        {
          name: "Select & Download Existing",
          value: "Select & Download Existing",
        },
      ],
      selectOptionsName:"",
      currentUserDetails: "",
      step: "",
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      index: 0,
      fieldsData: [],
      showSuccessDialog: false,
      importRecords: [],
      assetImport: {},
    };
  },

  watch: {
    selectOptions:function(){
      // if(this.selectOptions.name == '1'){
      //   console.log('this.selectOptions ="1"')
      //   this.selectOptions.name = "Create New Template"
      // }else if (this.selectOptions.name == '2'){
      //   console.log('this.selectOptions ="2"')
      //   this.selectOptions.name = 'Select & Download Existing'
      // }
    } 
  },

  methods: {
    closeSuccessPopUp() {
      this.showSuccessDialog = false;
      this.$emit("refreshData");
    },

    createTemplate() {
      this.openAddPopUp = true;
    },

    closeAddPopup() {
      this.openAddPopUp = false;
    },

    importFile() {
      if (this.file === "") {
        this.toastMessage = "Kindly Select file.";
        this.toastType = "warning";
        this.toastFlag++;
        return;
      }
      this.loaderFlag = true;
      let request = {
        tenantUUID: this.currentUserDetails.profile.organizationId,
        userUUID: this.currentUserDetails.profile.userid,
        userName:
          this.currentUserDetails.profile.firstName +
          " " +
          this.currentUserDetails.profile.lastName,
        importType: "",
      };
      if (this.importType === "Add") {
        request.importType = "Add";
        this.addImportAsset(request);
      } else {
        request.importType = "Update";
        this.addImportAsset(request);
      }
    },

    addImportAsset(request) {
      AssetManagementService.importBulkAssetByCSV(this.file, request)
        .then((response) => {
          if (
            response.status === 200 &&
            response.data.responseIdentifier === "Success"
          ) {
            this.loaderFlag = false;
            this.importRecords = response.data.importRecords;
            this.assetImport = response.data.assetImport;
            this.showSuccessDialog = true;
            // this.$emit("close")
          } else {
            this.toastMessage = response.data.description;
            this.toastType = "error";
            this.toastFlag++;
            this.loaderFlag = false;
          }
        })
        .catch((error) => {
          this.toastMessage =
            "An Error occurred while importing bulk Asset by CSV.";
          this.toastType = "error";
          this.toastFlag++;
          this.loaderFlag = false;
        });
    },

    uintToString(uintArray) {
      var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
      return decodedString;
    },

    close() {
      this.$emit("close");
    },
    onSelectedOptions(val) {
      if (val.value == "Create New Template") {
        this.step = 'createNewTemplate'
      } else if(val.value == "Select & Download Existing") {
        this.step = 'createExistingTemplate'
      } 
    },
    onSelected(val) {

      if (val.length > 0) {
        this.step = '1';
        this.fieldsData = [];
        val.map((cate) => {
          this.fieldsData.push({
            categoryUUID: cate.uuid,
            categoryName: cate.name,
            fields: this.mapFieldTemplateUUID(
              cate.fieldTemplate.uuid,
              cate.fieldTemplate.fields
            ),
          });
        });
      } else {
        this.fieldsData = [];
        this.step = ''
      }
    },

    mapFieldTemplateUUID(uuid, fields) {
      fields.map((data) => {
        data.fieldTemplateUUID = uuid;
      });
      return fields;
    },

    getCategories() {
      AssetManagementService.getCategoriesFieldsListByTenantUUID(
        this.currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (
            response.status === 200 &&
            response.data.responseIdentifier === "Success"
          ) {
            this.categories = response.data.categoryFieldDTOS;
          } else {
            this.toastMessage =
              "An Unexpected Error occurred while getting categories.";
            this.toastType = "error";
            this.loaderFlag = false;
            this.toastFlag++;
          }
        })
        .catch((error) => {
          this.toastMessage =
            "An Unexpected Error occurred while getting categories.";
          this.toastType = "error";
          this.loaderFlag = false;
          this.toastFlag++;
        });
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    if (this.importType === "Add") {
      this.getCategories();
    }
  },

  validations: function () {
    return {
      file: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.column-grid {
  div {
    display: inline-block;
    float: right;
    max-width: 150px;
  }
}

.filePickerRow {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}
.overlay-spinner {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.1);
}

.multi-select {
  margin-bottom: 1em;
  margin-top: 1em;
}
</style>