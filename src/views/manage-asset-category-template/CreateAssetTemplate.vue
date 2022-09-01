<template>
  <div class="mt-20">
    <div style="margin-bottom: 40px">
      <span class="head-title">{{
        this.$route.name == "edit-asset-category-template"
          ? "Edit Asset Category Template"
          : this.$route.name == "detail-asset-category-template"
          ? "Details Asset Category Template"
          : "Create Asset Category Template"
      }}</span>
    </div>
    <div class="main-wrapper">
      <div class="cate-field">
        <SInput
          :disabled="this.$route.params.viewFlag"
          label="Template Name*"
          v-model="categoryName"
          :error="getFormErrorMessage($v.categoryName)"
        />
      </div>
      <!-- <div class="full-row subtitle mt-8 mb-8">Description</div> -->
    </div>
    <div class="mt-20">
      <SAccordion
        title="Additional Details"
        expandIcon="arrows"
        padding="48"
        :open="false"
        :shadow="true"
        ref="additionalFieldsAccord"
        @state="additionalFieldsFunction"
      >
        <div
          :class="this.$route.params.viewFlag ? 'ponterNone' : ''"
          class="custom-btn-main"
        >
          <div class="flex-last">
            <div class="padding-btn">
              <SButton
                :dropdown="false"
                :title="'+'"
                @clicked-item="addCategoryField"
              ></SButton>
            </div>
          </div>
          <div
            class="custom-fields pt-8 mb-8"
            v-for="(item, index) in createCateObj.categoryFields"
            :key="index"
          >
            <div class="label-field">
              <SInput
                label="Field Label"
                v-model="item.label"
                key=""
                :error="
                  getFormErrorMessage(
                    $v.createCateObj.categoryFields.$each[index].label
                  )
                "
              />
            </div>
            <div class="type_field">
              <SSelect
                :label="'Type'"
                v-model="item.type"
                :source="createCateObj.fieldType"
                resultsDisplay="name"
                resultsValue="value"
                :autocomplete="true"
                @selected="
                  (value) => {
                    addFieldType(value, index);
                  }
                "
                @clear="clearSelectedFieldType(index)"
                :error="
                  getFormErrorMessage(
                    $v.createCateObj.categoryFields.$each[index].type
                  )
                "
                :key="updateComp + 'typeField'"
              />
            </div>
            <div class="option-field">
              <SInput
                :label="
                  item.type == 'boolean'
                    ? 'Add only two comma separated items'
                    : 'Options (comma seprated)'
                "
                :disabled="item.type !== 'select' && item.type !== 'boolean'"
                v-model="item.options"
                :error="
                  getFormErrorMessage(
                    $v.createCateObj.categoryFields.$each[index].options
                  )
                "
                :ref="`options${index}`"
              />
            </div>
            <div class="check-box">
              <span>Mandatory</span>
              <div class="check-box">
                <SCheckBox
                  type="checkbox"
                  v-model="item.mandatory"
                  @input="mandatoryYesHandler(item.mandatory, index)"
                />
              </div>
            </div>
            <div class="pt-15 flex-last pr-acc-btn-cros">
              <img
                src="/assets/icons/Close.svg"
                alt=""
                width="20px"
                style="cursor: pointer"
                @click="subCategoryField(index)"
              />
            </div>
          </div>
        </div>
      </SAccordion>
    </div>

    <div class="mt-20">
      <SAccordion
        title="Issue Category and Types "
        expandIcon="arrows"
        padding="48"
        :open="false"
        :shadow="true"
        ref="issueCateAccord"
        @state="issueCateFunction"
      >
        <div
          :class="this.$route.params.viewFlag ? 'ponterNone' : ''"
          class="custom-btn-main"
        >
          <div class="flex-last">
            <div class="padding-btn">
              <SButton
                :dropdown="false"
                :title="'+'"
                @clicked-item="addissueTypesField"
              ></SButton>
            </div>
          </div>
          <div
            class="custom-fields pt-8 mb-8"
            v-for="(item, index) in createIssueTypeObj.IssueTypeFields"
            :key="index"
          >
            <div class="label-field">
              <SInput
                label="Category Name"
                v-model="item.label"
                :error="
                  getFormErrorMessage(
                    $v.createIssueTypeObj.IssueTypeFields.$each[index].label
                  )
                "
              />
            </div>

            <div class="option-field">
              <SInput
                label="Types (comma seprated)"
                v-model="item.options"
                :error="
                  getFormErrorMessage(
                    $v.createIssueTypeObj.IssueTypeFields.$each[index].options
                  )
                "
                :ref="`options${index}`"
              />
            </div>
            <div class=""></div>

            <div class="pt-15 flex-last pr-acc-btn-cros">
              <img
                src="/assets/icons/Close.svg"
                alt=""
                width="20px"
                style="cursor: pointer"
                @click="subIssueTypeField(index)"
              />
            </div>
          </div>
        </div>
      </SAccordion>
    </div>
    <div class="button-row mt-20">
      <div class="item1">
        <SButton
          :dropdown="false"
          :title="'Save'"
          v-if="
            this.$route.name == 'create-asset-category-template'
          "
          @clicked-item="saveAddCategory"
        ></SButton>
      </div>
      <div class="item1">
        <SButton
          :dropdown="false"
          :title="'Update'"
          v-if="this.$route.name == 'edit-asset-category-template'"
          @clicked-item="updateAddCategory"
        ></SButton>
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
import AssetManagementService from "../../services/AssetManagementService";
import { required, maxLength } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";
import loader from "@/components/Loader.vue";

export default {
  name: "createCategory",
  data() {
    return {
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      currentUserDetails: "",
      cateObject: "",
      categoryName: "",
      loaderFlag: false,
      createCateObj: {
        fieldType: [
          { name: "Text", value: "text" },
          { name: "Select", value: "select" },
          { name: "Numeric", value: "numeric" },
          { name: "Calender", value: "calender" },
          { name: "Boolean", value: "boolean" },
        ],
        categoryFields: [],
      },
      createIssueTypeObj: {
        IssueTypeFields: [],
      },
      // createIssueTypeObj.IssueTypeFields
      updateComp: 0,
      uuid_EditAssetCateTemplate: "",
      addFieldsFlag: true,
      addIssueCateFlag: true,
    };
  },
  methods: {
    additionalFieldsFunction() {
      if (this.$refs.additionalFieldsAccord.openFlag === true) {
        this.$refs.issueCateAccord.openFlag = false;
      }
    },
    issueCateFunction() {
      if (this.$refs.issueCateAccord.openFlag === true) {
        this.$refs.additionalFieldsAccord.openFlag = false;
      }
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    addFieldType(value, index) {
      this.createCateObj.categoryFields[index].type =
        value.selectedObject.value;
    },
    clearSelectedFieldType(index) {
      this.createCateObj.categoryFields[index].type = "";
      this.updateComp++;
    },
    subCategoryField(index) {
      this.createCateObj.categoryFields.splice(index, 1);
    },
    subIssueTypeField(index) {
      this.createIssueTypeObj.IssueTypeFields.splice(index, 1);
    },
    close() {
      this.$emit("close");
    },
    mandatoryYesHandler(evt, index) {
      this.createCateObj.categoryFields[index].mandatory = evt;
    },
    addCategoryField() {
      this.createCateObj.categoryFields.push({
        label: "",
        type: "",
        position: "",
        mandatory: false,
        options: "",
      });
    },
    addissueTypesField() {
      this.createIssueTypeObj.IssueTypeFields.push({
        label: "",
        // type: "",
        position: "",
        // mandatory: false,
        options: "",
      });
    },
    // createIssueTypeObj.IssueTypeFields
    saveAddCategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit("showToast", "Please fill all required fields", "warning");
        return;
      } else {
        let valdiation = this.customOptionValdiationCheck();
        if (!valdiation) {
          var value = this.createCateObj;
          var val = this.createIssueTypeObj;
          this.loaderFlag = true;
          let addCategory = {
            categoryTemplate: {
              tenantUuid: this.currentUserDetails.profile.organizationId,
              name: this.categoryName,
              createdBy: `${this.currentUserDetails.profile.firstName} ${this.currentUserDetails.profile.lastName}`,
              lastUpdateBy: `${this.currentUserDetails.profile.firstName} ${this.currentUserDetails.profile.lastName}`,
              archived: false,
              categoryFiled: {
                type: this.categoryName + " field template",
                fields: [],
              },
              issuesCategory: {
                type: this.categoryName + " field template",
                fields: [],
              },
            },
          };

          let fieldss = [];
          for (let index = 0; index < value.categoryFields.length; index++) {
            let addCategoryField = value.categoryFields[index];
            let field = {};
            field.label = addCategoryField.label;
            field.type = addCategoryField.type;
            field.fieldPosition = addCategoryField.position;
            field.mandatory = addCategoryField.mandatory;
            field.options = addCategoryField.options;
            fieldss.push(field);
          }
          let issueFields = [];
          for (let index = 0; index < val.IssueTypeFields.length; index++) {
            let addIssueTypeField = val.IssueTypeFields[index];
            let field = {};
            field.label = addIssueTypeField.label;
            field.options = addIssueTypeField.options;
            (field.type = ""),
              (field.fieldPosition = ""),
              (field.mandatory = false),
              issueFields.push(field);
          }

          addCategory.categoryTemplate.categoryFiled.fields = fieldss;
          addCategory.categoryTemplate.issuesCategory.fields = issueFields;
          AssetManagementService.addCategoryTemplate(addCategory)
            .then((response) => {
              if (response.data.responseIdentifier === "Success") {
                this.loaderFlag = false;
                this.categoryPopUp = false;
                this.showToast("Category added successfully", "success");
                this.$router.push({
                  name: "asset-category-templates",
                });
              } else if (response.data.responseIdentifier == "Failure") {
                this.loaderFlag = false;
                this.showToast(response.data.description, "error");
              }
            })
            .catch((error, response) => {
              if (error) {
                this.loaderFlag = false;
                var text = error.response.data.description.split(":")[1];
                this.showToast(text, "error");
              }
            });
        }
      }
    },

    updateAddCategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit("showToast", "Please fill all required fields", "warning");
        return;
      } else {
        let valdiation = this.customOptionValdiationCheck();
        if (!valdiation) {
          var value = this.createCateObj;
          var val = this.createIssueTypeObj;
          this.loaderFlag = true;

          let editCategory = {
            categoryTemplate: {
              uuid: this.uuid_EditAssetCateTemplate,
              tenantUuid: this.currentUserDetails.profile.organizationId,
              name: this.categoryName,
              createdBy: `${this.currentUserDetails.profile.firstName} ${this.currentUserDetails.profile.lastName}`,
              lastUpdateBy: `${this.currentUserDetails.profile.firstName} ${this.currentUserDetails.profile.lastName}`,
              archived: false,
              categoryFiled: {
                type: this.categoryName + " field template",
                fields: [],
              },
              issuesCategory: {
                type: this.categoryName + " field template",
                fields: [],
              },
            },
          };

          let fieldss = [];
          for (let index = 0; index < value.categoryFields.length; index++) {
            let addCategoryField = value.categoryFields[index];
            let field = {};
            field.label = addCategoryField.label;
            field.type = addCategoryField.type;
            field.fieldPosition = addCategoryField.position;
            field.mandatory = addCategoryField.mandatory;
            field.options = addCategoryField.options;
            fieldss.push(field);
          }
          let issueFields = [];
          for (let index = 0; index < val.IssueTypeFields.length; index++) {
            let addIssueTypeField = val.IssueTypeFields[index];
            let field = {};
            field.label = addIssueTypeField.label;
            field.options = addIssueTypeField.options;
            (field.type = ""),
              (field.fieldPosition = ""),
              (field.mandatory = false),
              issueFields.push(field);
          }

          editCategory.categoryTemplate.categoryFiled.fields = fieldss;
          editCategory.categoryTemplate.issuesCategory.fields = issueFields;

          AssetManagementService.editAssetCateTemplate(editCategory)
            .then((response) => {
              if (response.data.responseIdentifier === "Success") {
                this.loaderFlag = false;
                this.showToast("Category added successfully", "success");
                this.$router.push({
                  name: "asset-category-templates",
                });
              }
            })
            .catch((error, response) => {
              if (error) {
                this.loaderFlag = false;
                var text = error.response.data.description.split(":")[1];
                this.showToast(text, "error");
              }
            });
        }
      }
    },

    customOptionValdiationCheck() {
      if (
        this.createCateObj.categoryFields &&
        this.createCateObj.categoryFields.length > 0
      ) {
        let count = 0;
        for (var object of this.createCateObj.categoryFields) {
          count++;
          if (object.type == "select" && object.options == "") {
            this.showToast(
              "Please fill options field in Additional Field #" + count,
              "warning"
            );
            return true;
          }
        }
      } else if (
        this.createIssueTypeObj.issueTypeFields &&
        this.createIssueTypeObj.issueTypeFields.length > 0
      ) {
        let count = 0;
        for (var obj of this.createIssueTypeObj.issueTypeFields) {
          count++;
          if (obj.type == "select" && object.options == "") {
            this.showToast(
              "Please fill options field in Additional Field #" + count,
              "warning"
            );
            return true;
          }
        }
      }
    },

    customFieldValidations() {
      let validations = {};
      if (
        this.createCateObj.categoryFields &&
        this.createCateObj.categoryFields.length > 0
      ) {
        validations = {
          createCateObj: {
            categoryFields: {
              $each: {
                label: { required },
                type: { required },
                options: {},
              },
            },
          },
        };
      } else {
        validations = {
          createCateObj: {
            categoryFields: {
              $each: {
                label: {},
                type: {},
                options: {},
              },
            },
          },
        };
      }

      return validations;
    },
    issueTypeFieldValidations() {
      let validations = {};
      if (
        this.createIssueTypeObj.IssueTypeFields &&
        this.createIssueTypeObj.IssueTypeFields.length > 0
      ) {
        validations = {
          createIssueTypeObj: {
            IssueTypeFields: {
              $each: {
                label: { required },
                options: {},
              },
            },
          },
        };
      } else {
        validations = {
          createIssueTypeObj: {
            IssueTypeFields: {
              $each: {
                label: {},
                type: {},
                options: {},
              },
            },
          },
        };
      }

      return validations;
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  mounted() {
this.$refs.additionalFieldsAccord.openFlag = true

  if (this.$route.name == 'create-asset-category-template') {
      this.addCategoryField();
      this.addissueTypesField();
    }
    if (
      this.$route.name == "edit-asset-category-template" ||
      this.$route.name == "detail-asset-category-template"
    ) {
      
      this.loaderFlag = true;
      var uuid = this.$route.params.assetCateTemplateID.toString();
      AssetManagementService.getAssetCateTemplate(uuid)
        .then((response) => {
          this.cateObject = response.data;

          this.uuid_EditAssetCateTemplate = uuid;

          this.categoryName = this.cateObject.categoryTemplates.name;
          this.createCateObj.categoryFields =
            this.cateObject.categoryTemplates.categoryFiled.fields;
          this.createIssueTypeObj.IssueTypeFields =
            this.cateObject.categoryTemplates.issuesCategory.fields;
          if (response.data.responseIdentifier === "Success") {
            this.loaderFlag = false;
          }
        })
        .catch((error, response) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast("Error", "error");
          }
        });
    }

    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
  },

  validations: function () {
    return {
      ...this.customFieldValidations(),
      ...this.issueTypeFieldValidations(),
      categoryName: { required },
    };
  },
  // props: {
  //   cateObject: {},
  //   showToast: { type: Function },
  // },
  computed: {},
  components: {
    loader,
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: grid;
  column-gap: 20px;
  grid-template-rows: 1fr;
}
.cate-field {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
  row-gap: 20px;
  margin-bottom: 28px;
}
.custom-fields {
  display: grid;
  grid-template-columns: repeat(6, auto);
  grid-gap: 10px;
  padding-left: 30px;
  padding-right: 30px;
}
.check-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding-left: 10px;
}
.option-field {
  grid-column-start: 3;
  grid-column-end: 5;
}
.pt-15 {
  padding-top: 15px;
}
.custom-btn {
  align-items: center;
  text-align: left;
  width: 150px;
  margin: 5px 20px 20px 0;
  padding-left: 10px;
  display: flex;
  height: 10px;
}
.custom-btn span {
  font-weight: bold;
  font-size: 16px;
  padding-left: 10px;
}

.button-row {
  display: grid;
  grid-gap: 10px;
  float: right;
  align-items: right;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
