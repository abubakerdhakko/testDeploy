<template>
  <div>
    <div class="">

      <div v-if="step == 'createExistingTemplate' && this.step !== ''">
        <div style="padding-top: 0.5em" v-if="view">
          <span class="subtitle"><b> Select Existing: </b></span>
        </div>
        <div class="multi-select" v-if="view">
          <SSelect
            label="Template"
            v-model="template"
            :source="this.templates"
            resultsValue="uuid"
            resultsDisplay="templateName"
            :autocomplete="true"
            :key="index"
            @selected="onTemplateSelect"
            @clear="clearTemplate"
          />
        </div>
      </div>

      <div v-if="step == 'createNewTemplate'">
        <span class="subtitle" v-if="view"><b>New Template Form: </b></span>
      </div>
      <div v-if="this.step == 'createNewTemplate' && this.step !== ''">
        <SInput
          label="Template Name *"
          v-model="templateName"
          :readonly="!view"
          style="margin-top: 0.5em; margin-bottom: 0.5em"
          :error="getFormErrorMessage(this.$v.templateName)"
        />
        <div>
          <span class="subtitle"><b>Fields: </b></span>
        </div>
        <draggable
          v-model="lists"
          class="list-group"
          group="people"
          :sort="!saveDisable"
          @change="checkMove"
        >
          <div v-for="(list, i) in lists" :key="'field' + i" class="task">
            <div class="column-grid">
              <SCheckBox
                v-model="list.check"
                label=""
                :disabled="list.disable"
                icon="true"
                @input="checkBoxClick(i)"
              />
              {{ list.name }}
            </div>
          </div>
        </draggable>
      </div>

      <div class="" v-if="this.step == 'createNewTemplate' || this.step == 'createExistingTemplate' && this.step !== ''">
        <div></div>
        <div class="mt-8 mb-32 dialog-btn float-right" >
          <SButton
            v-if="view && this.step == 'createExistingTemplate'"
            rounded
            dense
            title="Download"
            @clicked-item="downloadFile"
          ></SButton>
          <SButton
            v-if="view && this.step == 'createNewTemplate'"
            rounded
            dense
            title="Save As Template"
            :disable="saveDisable"
            :style="saveDisable ? styleButton2 : styleButton1"
            @click="createTemplate"
          ></SButton>
          <!-- <SButton
                            rounded
                            dense
                            title="Cancel"
                            style="margin-left:5px"
                            @clicked-item="close"
                        ></SButton> -->
        </div>
      </div>
    </div>
    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      :key="toastFlag"
    />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import AssetManagementService from "../../../services/AssetManagementService";
import draggable from "vuedraggable";
import { Sortable, Swap } from "sortablejs";
import { Functions } from "@/shared/Functions";

import loader from "@/components/Loader.vue";

export default {
  name: "CreateAssetImportTemplate",

  components: {
    draggable,
    loader,
  },
  props: {
    step: String,
    categories: Array,
    viewTemplate: Boolean,
    templateData: Object,
  },

  data() {
    return {
      enabled: false,
      file: "",
      label: "Template",
      currentUserDetails: "",
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      index: 0,
      fieldsData: [],
      template: "",
      templates: [],
      lists: [
        {
          name: "Category Name",
          check: true,
          disable: true,
        },
        {
          name: "Asset Name",
          check: true,
          disable: true,
        },
        {
          name: "Model #",
          check: true,
          disable: true,
        },
        {
          name: "Manufacturer Name/ID",
          check: true,
          disable: true,
        },
        {
          name: "Purchased Date",
          check: false,
          disable: false,
        },
        {
          name: "Status",
          check: false,
          disable: false,
        },
        {
          name: "Warranty Unit",
          check: true,
          disable: true,
        },
        {
          name: "Warranty",
          check: true,
          disable: true,
        },
        {
          name: "Primary Usage Unit",
          check: true,
          disable: true,
        },
        {
          name: "Secondary Usage Unit",
          check: true,
          disable: true,
        },
        {
          name: "Consumption Unit",
          check: true,
          disable: true,
        },
        {
          name: "Write Asset description here",
          check: false,
          disable: false,
        },
      ],
      dragging: false,
      downloadTemplate: "",
      templateName: "",
      backUpLists: [],
      saveDisable: false,
      styleButton1: "margin-left:5px;",
      styleButton2: "margin-left:5px; pointer-events: none",
      view: true,
    };
  },

watch: { 
    step: function(newVal, oldVal) { 
      if(newVal == 'createNewTemplate' || oldVal == 'createExistingTemplate'){
        this.template = '';
        this.clearTemplate();
      }
      if(this.step == ''){
        this.template = '';
        this.clearTemplate();
      }
    },
     
    template: function(newVal, oldVal) { 
        console.log('this.template',this.template);
    }
   },
  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    checkBoxClick(index) {
      this.lists[index].check = true;
    },

    checkMove() {},

    onTemplateSelect(val) {
      this.saveDisable = true;
      let template = this.templates.filter((t) => t.uuid === val.value);
      this.lists = JSON.parse(template[0].columnData);
    },

    clearTemplate() {
      this.saveDisable = false;
      this.templateName = "";
      this.lists = this.backUpLists;
    },

    downloadFile() {
      if (this.template === "") {
        this.toastMessage = "Kindly select template to Download.";
        this.toastType = "warning";
        this.toastFlag++;
        return;
      }
      this.createDownloadTemplate();
      this.loaderFlag = true;
      let temp = this.templates.filter((t) => t.uuid === this.template);
      let download = {
        columnsData: this.downloadTemplate,
        templateName: temp[0].templateName,
      };
      this.downloadAssetTemplate(download);
    },

    createTemplate() {
      if (this.categories.length <= 0) {
        this.toastMessage = "Please select category for template creation.";
        this.toastType = "warning";
        this.toastFlag++;
        return;
      }

      if (this.templateName === "") {
        this.toastMessage = "Kindly enter Template Name.";
        this.toastType = "warning";
        this.loaderFlag = false;
        this.toastFlag++;
        return;
      }
      this.createDownloadTemplate();
      this.loaderFlag = true;
      let request = {
        categoryUUID: this.getCategoriesUUID(),
        categoryName: this.getCategoriesName(),
        userUUID: this.currentUserDetails.profile.userid,
        userName:
          this.currentUserDetails.profile.firstName +
          " " +
          this.currentUserDetails.profile.lastName,
        tenantUUID: this.currentUserDetails.profile.organizationId,
        csvColumnData: JSON.stringify(this.lists),
        templateName: this.templateName,
      };

      AssetManagementService.addImportTemplate(request)
        .then((response) => {
          if (
            response.status === 200 &&
            response.data.responseIdentifier === "Success"
          ) {
            let download = {
              columnsData: this.downloadTemplate,
              templateName: this.templateName,
            };
            this.toastMessage = "Template Add Successfully.";
            this.toastType = "success";
            this.toastFlag++;
            this.downloadAssetTemplate(download);
          } else {
            this.toastMessage =
              "An Unexpected Error occurred while getting import templates.";
            this.toastType = "error";
            this.loaderFlag = false;
            this.toastFlag++;
          }
        })
        .catch((error) => {
          this.toastMessage =
            "An Unexpected Error occurred while getting import templates.";
          this.toastType = "error";
          this.loaderFlag = false;
          this.toastFlag++;
        });
    },

    downloadAssetTemplate(downloadRequest) {
      AssetManagementService.downloadAssetImportTemplate(downloadRequest)
        .then((res) => {
          if (res.status === 200 && res.data.responseIdentifier === "Success") {
            this.loaderFlag = false;
            var sampleArray = this.base64ToArrayBuffer(res.data.content);
            let fileUrl = window.URL.createObjectURL(
              new Blob([sampleArray], { type: "text/csv;charset=utf-8;" })
            );
            var fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.setAttribute("download", res.data.fileName);
            document.body.appendChild(fileLink);
            fileLink.click();
            this.close();
          }
        })
        .catch((error) => {
          this.toastMessage =
            "An Unexpected Error occurred while downloading import templates.";
          this.toastType = "error";
          this.loaderFlag = false;
          this.toastFlag++;
        });
    },

    base64ToArrayBuffer(base64) {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes;
    },

    getCategoriesUUID() {
      let uuids = "";
      let i = 0;
      this.categories.map((cate) => {
        uuids =
          uuids +
          cate.categoryUUID +
          (this.categories[i + 1] !== undefined ? "," : "");
        i += 1;
      });
      return uuids;
    },

    getCategoriesName() {
      let names = "";
      let i = 0;
      this.categories.map((cate) => {
        names =
          names +
          cate.categoryName +
          (this.categories[i + 1] !== undefined ? "," : "");
        i += 1;
      });
      return names;
    },

    createDownloadTemplate() {
      this.downloadTemplate = "";
      let i = 0;
      this.lists.map((list) => {
        this.downloadTemplate =
          this.downloadTemplate +
          list.name +
          (this.lists[i + 1] !== undefined ? "," : "");
        i += 1;
      });
    },

    close() {
      this.$emit("close");
    },

    getAssetImportTemplates() {
      AssetManagementService.getImportTemplateListByUserUUIDAndTenantUUID(
        this.currentUserDetails.profile.userid,
        this.currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (
            response.status === 200 &&
            response.data.responseIdentifier === "Success"
          ) {
            this.templates = response.data.importTemplates;
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
            "An Unexpected Error occurred while getting import templates.";
          this.toastType = "error";
          this.loaderFlag = false;
          this.toastFlag++;
        });
    },
  },

  created() {
    if (this.lists) {
      if (this.categories) {
        this.categories.map((cate) => {
          if (cate.fields) {
            cate.fields.map((f) => {
              let exists = this.lists.filter((l) => l.name === f.label);
              if (exists === undefined || exists.length <= 0) {
                this.lists.push({
                  name: f.label,
                  check: f.mandatory,
                  disable: f.mandatory,
                });
              }
            });
          }
        });
      }
      var kanbanBoard = document.querySelectorAll("[class='list-group']");
      try {
        Sortable.mount(new Swap());
      } catch (e) {}
      for (let j = 0; j < kanbanBoard.length; j++) {
        Sortable.create(kanbanBoard[j], {
          group: "list-group",
          swap: false,
          swapClass: "highlighted",
          animation: 100,
        });
      }
      this.backUpLists = this.lists;
    }
    if (this.viewTemplate) {
      this.view = false;
      this.saveDisable = true;
      this.templateName = this.templateData.templateName;
      this.lists = JSON.parse(this.templateData.csvColumnData);
    }
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAssetImportTemplates();
  },

  validations: function () {
    return {
      templateName: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.CreateNewTemplate_style .main-grid {
    padding-left: 0px;
}
.column-grid {
  div {
    display: inline-block;
    float: right;
    max-width: 100px;
  }
}

.filePickerRow {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}

.multi-select {
  margin-bottom: 1em;
  margin-top: 1em;
}

.list-group {
  display: inline-block;
  width: 650px;
  min-height: 100px;
  max-height: 600px;
  overflow-y: auto;
}
.list-group:first-child {
  margin-left: 0px;
}
.list-group:last-child {
  margin-right: 0px;
}
.task {
  text-decoration: none;
  margin: 16px 8px 16px 8px;
  border-radius: 3px;
  box-shadow: 0 3.2px 7.2px 0 #e2e2e2, 0 0.6px 1.8px 0 #e2e2e2;
  position: relative;
  cursor: move;
  border-radius: 8px;
  padding: 16px;
  border: 3px dashed transparent;
  background-color: #fefefe;

  &:hover {
    box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
    border-color: rgba(162, 179, 207, 0.2) !important;
  }
  &-row:nth-child(1) {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .status {
      display: inline-block;
      border: 1px solid var(--success);
      padding: 4px 8px;
      font-family: Euclid Circular B;
      font-size: 8px;
      border-radius: 10px;
    }
    .start {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
  &-row:nth-child(2) {
    font-size: 15px;
    font-family: Euclid Circular B;
    margin-block: 16px;
  }
  &-row:nth-child(3) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    font-family: Euclid Circular B;
    color: #c4cad3;
    i {
      margin-right: 6px;
    }
  }
}

.column-grid {
  display: grid;
  grid-template-columns: 1fr 10fr;
  grid-column-gap: 1px;
}
</style>