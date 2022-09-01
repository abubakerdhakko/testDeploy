<template>
  <div class="pt-32 pb-80">
    <div class="head-title">Create Inspection Template</div>
    <div class="subtitle pt-8"></div>

    <div style="margin: 0px 15 px 0 px 15px" class="main-page pt-32">
      <div>
        <div class="row-col-gap mb-32">
          <div class="column-grid-2">
            <SInput
              label="Template Name *"
              :error="getFormErrorMessage($v.templateName)"
              v-model="templateName"
            />
            <SSelect
              label="Asset Category *"
              v-model="assetCategoryLabel"
              :source="assetCategories"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="assetCategorySelected"
              :key="assetIndex"
              :error="getFormErrorMessage($v.assetCategoryLabel)"
              @clear="clearSelectedAssetCategory"
            />
          </div>
        </div>
        <SAccordion
          title="Inspection Items"
          expandIcon="arrows"
          :open="true"
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
              Item# {{ index + 1 }}
            </span>
                      <div class="column-grid-2" v-padding="'0px 48px 0 48px'">
              <SInput
                v-padding="'16px 0 0px 0'"
                label="Item Name *"
                v-model="inspection.name"
                :error="
                  getFormErrorMessage($v.inspectionItems.$each[index].name)
                "
              />
              <SSelect
                v-padding="'16px 0 0px 0'"
                label="Answer Type *"
                v-model="inspection.typeLabel"
                :source="answerTypeOptions"
                resultsValue="label"
                resultsDisplay="label"
                :autocomplete="true"
                :error="
                  getFormErrorMessage($v.inspectionItems.$each[index].typeLabel)
                "
                @selected="
                  (value) => {
                    answerTypeSelected(value, index);
                  }
                "
                @clear="clearSelectedAnswerType(index)"
              />
            </div>


            <div class="column-grid-1 column-m-0" v-padding="'0px 48px 0 48px'">
              <SInput
                v-padding="'16px 0 0px 0'"
                label="Question *"
                v-model="inspection.description"
                :error="
                  getFormErrorMessage(
                    $v.inspectionItems.$each[index].description
                  )
                "
              />
            </div>
            <div class="column-grid-1" v-padding="'10px 48px 0 48px'">
              <SCheckBox
                v-model="inspection.mandatory"
                label="Mandatory"
                :disabled="false"
                :readonly="false"
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
                @click="addInspectionItems"
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
              class="item-border"
              v-if="inspectionItems.length !== index + 1"
            ></div>
            
          </div>
        </SAccordion>
      </div>
      <div></div>

      <div>
        <Sidebar
          :viewInspection="viewInspection"
          :templateName="templateName"
          :assetCategory="assetCategoryLabel"
          :createInspection="createInspection"
          @create="createInspectionTemplate"
        />
      </div>

      <!-- Toast Component -->
      <SToast
        :message="toastMessage"
        :time-out="toastTimeOut"
        :type="toastType"
        :key="toastFlag"
      />
      <!-- Toast Component -->

      <!-- Loader Component -->
      <loader v-if="loaderFlag" />
      <!-- Loader Component -->
    </div>
  </div>
</template>

<script>
import AssetManagementService from "../../services/AssetManagementService";
import InspectionService from "../../services/InspectionService";
import Sidebar from "./components/Sidebar";
import { Functions } from "@/shared/Functions";
import { required, maxLength } from "vuelidate/lib/validators";

import loader from "@/components/Loader.vue";

export default {
  name: "CreateInspectionTemplate",

  components: {
    Sidebar,
    loader,
  },

  props: {
    inspectionTemplateUUID: { type: String },
    view: { type: Boolean },
    edit: { type: Boolean },
  },

  created() {
    document.title = this.$route.meta.title;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );

    this.viewInspection = false;
    this.edit = false;
    if (this.viewInspection === false && this.edit === false) {
      this.createInspection = true;
    }
    this.getAssetCategory(this.currentUserDetails);
  },

  data() {
    return {
      /* Properties For Toast */
      toastType: "",
      toastFlag: 0,
      toastMessage: "",
      toastTimeOut: 3000,
      /* Properties For Toast */
      loaderFlag: false,
      createInspection: false,
      assetIndex: 0,
      currentUserDetails: null,
      inspectionTemplate: null,
      templateName: "",
      assetCategoryLabel: "",
      assetCategory: "",
      assetCategories: [],
      inspectionItems: [
        {
          name: "",
          type: "",
          mandatory: true,
          description: "",
          answers: [],
        },
      ],
      answerTypeOptions: [
        { label: "Text", value: "input" },
        { label: "Pass/Fail", value: "boolean" },
        { label: "Multiple Choice", value: "multiple" },
        { label: "Numeric", value: "numeric" },
      ],
    };
  },

  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    createInspectionTemplate() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all the required fields.!", "warning");
        return;
      }

      this.loaderFlag = true;
      let inspectionTemplate = {
        name: this.templateName,
        companyUUID: this.currentUserDetails.profile.organizationId,
        createdByUserUUID: this.currentUserDetails.profile.userid,
        createdByUserName:
          this.currentUserDetails.profile.firstName +
          " " +
          this.currentUserDetails.profile.lastName,
      };

      let inspectionItemCategories = [];

      for (let inspection of this.inspectionItems) {
        let inspectionItemCategory = {};
        let inspectionItems = [];
        let inspectionItem = {};

        inspectionItemCategory.name = inspection.name;
        inspectionItem.name = inspection.name;
        inspectionItem.answers = inspection.answers;
        inspectionItems.push(inspection);
        inspectionItemCategory.inspectionItems = inspectionItems;
        inspectionItemCategories.push(inspectionItemCategory);
      }
      inspectionTemplate.inspectionItemCategories = inspectionItemCategories;
      let addInspectionTemplateRequest = {
        inspectionTemplate: inspectionTemplate,
        assets: [
          {
            categoryUUID: this.assetCategory.uuid,
            categoryName: this.assetCategory.name,
          },
        ],
      };

      InspectionService.addInspectionTemplateOfMultipleAssets(
        addInspectionTemplateRequest
      )
        .then((response) => {
          if (response.status === 200) {
            this.loaderFlag = false;
            this.$router.push({
              name: "inspection-templates",
              params: {
                toastFlag: true,
                toastSuccess: "success",
                message: response.data.description,
              },
            });
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          this.showToast(error.data.description, "error");
        });
    },

    getAssetCategory(currentUserDetails) {
      AssetManagementService.getCategoriesList(
        currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (response.status === 200) {
            this.assetCategories = response.data.categoryDTOS;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    assetCategorySelected(value) {
      this.assetCategory = value.selectedObject;
    },

    clearSelectedAssetCategory() {
      this.assetCategoryLabel = "";
      this.assetCategory = "";
    },

    addInspectionItems() {
      this.inspectionItems.push({
        name: "",
        type: "",
        mandatory: true,
        description: "",
        answers: [],
      });
    },

    answerTypeSelected(value, index) {
      this.inspectionItems[index].type = value.selectedObject.value;
      if (value.value === "Multiple Choice") {
        this.inspectionItems[index].answers.push("", "");
      } else {
        this.inspectionItems[index].answers = [];
      }
    },

    clearSelectedAnswerType(index) {
      this.inspectionItems[index].type = "";
      this.inspectionItems[index].answers = [];
      this.inspectionItems[index].typeLabel = "";
    },

    mandatoryChecked(index) {
      console.log(index);
    },

    addMultipleChoice(index) {
      this.inspectionItems[index].answers.push("");
    },

    removeMultipleChoice(index, answerIndex) {
      this.inspectionItems[index].answers.splice(answerIndex, 1);
    },

    clickInspectionAccordionFunction() {
      if (this.$refs.inspectionItem.openFlag === true) {
      }
    },

    removeInspectionItems(index) {
      this.inspectionItems.splice(index, 1);
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  validations: function() {
    return {
      assetCategoryLabel: { required },
      templateName: { required },
      inspectionItems: {
        $each: {
          name: { required, maxLength: maxLength(190) },
          description: { required, maxLength: maxLength(190) },
          typeLabel: { required },
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
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
.item-border {
  border-top: 1px solid var(--very-light-pink);
}
</style>
