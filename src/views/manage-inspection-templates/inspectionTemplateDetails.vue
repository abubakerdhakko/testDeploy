<template>
  <div class="pt-32 pb-80">
    <div class="head-title">{{ name }} Inspection Template</div>
    <div class="subtitle pt-8"></div>

    <div class="main-page pt-32">
      <div>
        <div class="row-col-gap mb-32">
          <div class="column-grid-2">
            <SInput
              label="Template Name *"
              :readonly="fieldsDisable"
              :error="getFormErrorMessage($v.templateName)"
              v-model="templateName"
            />
            <SSelect
              label="Asset Category *"
              v-model="assetCategoryLabel"
              :source="assetCategories"
              resultsValue="name"
              resultsDisplay="name"
              :readonly="fieldsDisable"
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
                :readonly="fieldsDisable"
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
                :readonly="fieldsDisable"
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
            <div class="column-grid-1" v-padding="'0px 48px 0 48px'">
              <SInput
                v-padding="'16px 0 0px 0'"
                :readonly="fieldsDisable"
                label="Question *"
                v-model="inspection.description"
                :error="
                  getFormErrorMessage(
                    $v.inspectionItems.$each[index].description
                  )
                "
              />
            </div>
            <div class="column-grid-1" v-padding="'0px 48px 0 48px'">
              <SCheckBox
                v-model="inspection.mandatory"
                label="Mandatory"
                :readonly="fieldsDisable"
                :disabled="false"
                @input="mandatoryChecked(index)"
              />
            </div>
            <div>
              <img
                v-if="inspectionItems.length > 1 && !fieldsDisable"
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
                v-if="inspectionItems.length < 300 && !fieldsDisable"
                src="assets/icons/Add.svg"
                style="cursor: pointer; float: right"
                v-padding="'0 48px 16px 48px'"
                @click="addInspectionItems"
                width="16px"
                alt=""
              />
            </div>

            <div
              v-if="inspection.typeLabel === 'Multiple Choice'"
              class="row-col-gap"
            >
              <span
                v-padding="'0px 48px 0px 48px'"
                style="margin-top: -24px; font-size: 12px; font-weight: bold"
                >Multiple Choice Options
              </span>
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
                      v-if="inspection.answers.length > 2 && !fieldsDisable"
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
          :edit="fieldsDisable"
          :disable="disable"
          :templateName="templateName"
          :assetCategory="assetCategoryLabel"
          :inspectionDetail="inspectionTemplate"
          :lastUpdatedByName="lastUpdatedByName"
          @update="updateInspectionTemplate"
        />
      </div>
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

  data() {
    return {
      /* Properties For Toast */
      toastType: "",
      toastFlag: 0,
      toastMessage: "",
      toastTimeOut: 3000,
      /* Properties For Toast */
      loaderFlag: false,
      name: "",
      fieldsDisable: "",
      inspectionTempUUID: "",
      createInspection: false,
      assetIndex: 0,
      currentUserDetails: null,
      inspectionTemplate: null,
      templateName: "",
      assetCategoryLabel: "",
      assetCategory: "",
      assetCategories: [],
      disable: "",
      lastUpdatedByName: "",
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
        { label: "Yes/No", value: "boolean" },
        { label: "Multiple Choice", value: "multiple" },
        { label: "Numeric", value: "numeric" },
      ],
    };
  },
  components: {
    Sidebar,
    loader,
  },

  props: {
    inspectionTemplateUUID: { type: String },
  },

  created() {
    this.fieldsDisable = this.$route.params.flag;
    this.disable = this.$route.params.disableFields;
    this.name = this.$route.params.TemplateType;
    document.title = this.$route.meta.title;
    this.viewInspection = false;
    this.loaderFlag = true;
    this.edit = false;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAssetCategory(this.currentUserDetails);
  },

  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    getExistingInspectionTemplate(uuid) {
      let inspectionItem = null;
      let assetCategoryUUID = null;
      InspectionService.getInspectionTemplateByUUID(uuid, null)
        .then((response) => {
          if (response.status === 200) {
            console.log('inspectionItem',response)
            inspectionItem = response.data.inspectionTemplate;
            assetCategoryUUID = inspectionItem.assetCategoryUUID;

            this.inspectionTemplate = inspectionItem;
            this.templateName = inspectionItem.name;
            this.lastUpdatedByName = inspectionItem.lastUpdatedByName;

            for (var category of this.assetCategories) {
              if (category.uuid === assetCategoryUUID) {
                this.assetCategory = category;
                this.assetCategoryLabel = category.name;
                break;
              }
            }
            this.assetIndex++;
            this.setInspectionItems(inspectionItem);
            this.loaderFlag = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setInspectionItems(inspectionItem) {
      for (var inspectionItemCategory of inspectionItem.inspectionItemCategories) {
        if (inspectionItemCategory.inspectionItems.length > 0) {
          if (inspectionItemCategory.inspectionItems[0].type === "multiple") {
            inspectionItemCategory.inspectionItems[0].typeLabel =
              "Multiple Choice";
          } else if (
            inspectionItemCategory.inspectionItems[0].type === "input"
          ) {
            inspectionItemCategory.inspectionItems[0].typeLabel =
              "Text/Image/Audio";
          } else if (
            inspectionItemCategory.inspectionItems[0].type === "numeric"
          ) {
            inspectionItemCategory.inspectionItems[0].typeLabel =
              "Numeric";
          } else {
            inspectionItemCategory.inspectionItems[0].typeLabel = "Yes/No";
          }
          this.inspectionItems.push({
            name: inspectionItemCategory.inspectionItems[0].name,
            typeLabel: inspectionItemCategory.inspectionItems[0].typeLabel,
            type: inspectionItemCategory.inspectionItems[0].type,
            mandatory: inspectionItemCategory.inspectionItems[0].mandatory,
            description: inspectionItemCategory.inspectionItems[0].description,
            answers: inspectionItemCategory.inspectionItems[0].answers,
          });
        }
      }
    },

    updateInspectionTemplate() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all the required fields!", "warning");
        return;
      }
      this.loaderFlag = true;
      let inspectionTemplate = {
        id: this.inspectionTemplate.id,
        uuid: this.inspectionTemplate.uuid,
        // createdAt: this.inspectionTemplate.createdAt,
        assetCategoryUUID: this.inspectionTemplate.assetCategoryUUID,
        templateNumber: this.inspectionTemplate.templateNumber,
        name: this.templateName,
        companyUUID: this.currentUserDetails.profile.organizationId,
        createdByUserUUID: this.inspectionTemplate.createdByUserUUID,
        createdByUserName: this.inspectionTemplate.createdByUserName,
        createdAt:this.inspectionTemplate.createdAt,
        lastUpdatedByName: `${this.currentUserDetails.profile.firstName} ${this.currentUserDetails.profile.lastName}`,
        lastUpdatedByUUID: this.currentUserDetails.profile.userid,
      };

      let inspectionItemCategories = [];

      for (var items of this.inspectionItems) {
        let inspectionItemCategory = {};
        let inspectionItems = [];
        let inspectionItem = {};

        inspectionItemCategory.name = items.name;
        inspectionItem.name = items.name;
        inspectionItem.answers = items.answers;

        inspectionItems.push(items);
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

      InspectionService.updateInspectionTemplateOfMultipleAssets(
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
            if (this.createInspection === false) {
              this.inspectionItems = [];
              this.getExistingInspectionTemplate(
                this.$route.params.templateUUID
              );
            }
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          this.showToast(error.data.description, "error");
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
        return;
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
