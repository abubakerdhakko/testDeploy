<template>
  <SDialog
    :persistent="true"
    :title="'Select Template'"
    :width="700"
    @close="close"
  >
    <div style="padding: 24px">
      <SSelect
        label="Template Name"
        v-model="template"
        :source="selectedTemplateOptions"
        resultsValue="uuid"
        resultsDisplay="name"
        @selected="selectTemplate"
        :autocomplete="true"
      />
      <div
        class="row-col-gap"
        v-for="(inspection, index) in inspectionItemForm"
        :key="index"
      >
        <span
          v-padding="'16px 48px 5px 48px'"
          style="font-size: 14px; font-weight: bold"
        >
          <SCheckBox
            v-model="inspection.value"
            :label="'Item#' + ' ' + index"
            :disabled="false"
            :readonly="false"
            @input="itemValueFunction(inspection)"
          />
        </span>
        <div class="items-row" v-padding="'10px 48px 32px 48px'">
          <SInput label="Item Name *" v-model="inspection.itemName.value" />
          <SInput label="Question *" v-model="inspection.askQuestion.value" />
          <SSelect
            label="Answer Type *"
            v-model="inspection.type.value"
            :source="answerTypeOptions"
            resultsValue="label"
            resultsDisplay="label"
            :autocomplete="true"
            @selected="
              (value) => {
                answerTypeSelected(value, index);
              }
            "
          />
          <div style="margin-top: -10px">
            <SCheckBox
              v-model="inspection.mandatory.value"
              label="Mandatory"
              :disabled="false"
              :readonly="false"
              @input="mandatoryChecked(index)"
            />
          </div>
        </div>

        <div
          v-if="inspection.type.value === 'Multiple Choice'"
          class="row-col-gap"
        >
          <span
            v-padding="'0px 48px 0px 48px'"
            style="margin-top: -24px; font-size: 12px; font-weight: bold"
            >Multiple Choice Options
          </span>
          <!-- <span>Multiple Choice Options</span> -->
          <div
            style="margin-top: 8px; margin-bottom: 8px"
            v-padding="'0px 48px'"
            v-for="(answer, answerIndex) in inspection.answers.value"
            :key="answerIndex"
          >
            <!-- {{answer}} -->
            <div class="multiple-choice-row">
              <SInput
                :label="'Option ' + (answerIndex + 1) + ' *'"
                v-model="inspection.answers.value[answerIndex].value"
              />
              <div class="">
                <img
                  v-if="inspection.answers.value.length > 2"
                  style="cursor: pointer; float: right"
                  @click="removeMultipleChoice(index, answerIndex)"
                  width="16px"
                  src="assets/icons/Delete.svg"
                  alt=""
                />
              </div>
              <div class="">
                <img
                  v-if="
                    inspection.answers.value.length - 1 === answerIndex &&
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
              v-if="inspection.answers.value.length === answerIndex + 1"
            ></div>
          </div>
        </div>
        <div
          class="item-border"
          v-if="inspectionItems.length !== index + 1"
        ></div>
      </div>
      <div class="btns">
        <SButton title="Add Template" @click="addTemplateItems" small />

        <SButton title="Cancel" @click="funcCancel" small />
      </div>
    </div>

    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      v-if="toastFlag"
    />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </SDialog>
</template>

<script>
import InspectionService from "../../../services/InspectionService";
import moment from "moment";
import { required } from "vuelidate/lib/validators";
import loader from "@/components/Loader.vue";

export default {
  name: "SelectTemplate",

  components: { loader },

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    templates: {
      type: Array,
    },
  },

  data() {
    return {
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      template: "",
      templateName: "",
      inspectionReportUUID: "",
      selectedTemplateOptions: [],
      inspectionItemForm: [],
      inspectionItems: [
        {
          name: "",
          type: "",
          mandatory: true,
          description: "",
          answers: [],
        },
      ],
      selectedInspectionItems: [],
      answerTypeOptions: [
        { label: "Text/Image/Audio", value: "input" },
        { label: "Yes/No", value: "boolean" },
        { label: "Multiple Choice", value: "multiple" },
      ],
      btnLabel: "Select Template",
    };
  },

  methods: {
    // x(val) {
    // 	console.log(val);
    // 	this.$emit("get-template", val);
    // },
    close() {
      this.$emit("close", true);
    },

    funcCreate() {
      this.$v.roleName.$touch();
      if (this.$v.template.$invalid) {
        return;
      }
      this.$emit("get-template", this.template);
    },
    funcCancel() {
      this.$emit("close", true);
    },
    getAllTemplate() {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      InspectionService.getAllInspectionTemplates(
        currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (response.status === 200) {
            this.selectedTemplateOptions = response.data.inspectionTemplateDTOS;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addMultipleChoice(index) {
      //console.log("index", index)
      //console.log("test",this.inspectionItemForm)
      this.inspectionItemForm[index].answers.value.push({ value: "" });
    },
    removeMultipleChoice(index) {
      this.inspectionItemForm[index].answers.value.splice(index, 1);
    },
    getInspectionTemplates() {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      InspectionService.getPaginatedInspectionTemplatesForInspection(
        0,
        50,
        currentUserDetails.profile.organizationId,
        this.inspectionReportUUID
      )
        .then((response) => {
          response.data.inspectionTemplate.content.map((report) => {
            report.createdAt = moment(report.createdAt).format(
              "DD MMM YYYY hh:mm a"
            );
          });
          this.dataPending = response.data.inspectionTemplate.content;

          let assignedTo = [];

          for (let index = 0; index < this.allUsers.length; index++) {
            for (let j = 0; j < this.dataPending.length; j++) {
              if (
                this.allUsers[index].uuid ===
                this.dataPending[j].createdForUserUUID
              ) {
                this.dataPending[j].assignedTo = this.allUsers[index].label;
              }
            }
          }
        })
        .catch((error) => {
          alert("An Error occurred while fetching Pending Inspections");
        });
    },
    addAnswers() {
      this.answersFields.push({ value: "" });
    },
    selectTemplate(value) {
      this.loaderFlag = true;
      this.templateName = value.display;
      let mandatory = false;
      let typeInspect = null;
      let inspectionItemsForm = [];
      this.inspectionItemForm = [];
      InspectionService.getInspectionTemplateByUUID(value.value)
        .then((response) => {
          this.inspectionTemplateId = response.data.inspectionTemplate.id;
          this.inspectionTemplateUUID = response.data.inspectionTemplate.uuid;
          inspectionItemsForm =
            response.data.inspectionTemplate.inspectionItemCategories;

          for (let index = 0; index < inspectionItemsForm.length; index++) {
            if (inspectionItemsForm[index].inspectionItems.length > 0) {
              let answer = [];
              this.answersFields = [];
              this.itemName =
                inspectionItemsForm[index].inspectionItems[0].name;
              typeInspect = inspectionItemsForm[index].inspectionItems[0].type;
              mandatory =
                inspectionItemsForm[index].inspectionItems[0].mandatory;
              this.askQuestion =
                inspectionItemsForm[index].inspectionItems[0].description;

              if (typeInspect === "multiple") {
                typeInspect = "Multiple Choice";
              }

              if (typeInspect === "boolean") {
                typeInspect = "Yes/No";
              }

              if (typeInspect === "input") {
                typeInspect = "Text/Image/Audio";
              }
              answer = inspectionItemsForm[index].inspectionItems[0].answers;

              if (answer !== null) {
                for (let indx = 0; indx < answer.length; indx++) {
                  this.answersFields.push({ value: answer[indx] });
                }
              }
              this.inspectionItemForm.push({
                itemName: {
                  value: this.itemName,
                },
                type: {
                  value: typeInspect,
                },
                mandatory: {
                  value: mandatory,
                },
                askQuestion: {
                  value: this.askQuestion,
                },
                answers: {
                  value: this.answersFields,
                },
                value: true,
              });
              this.itemName = "";
              typeInspect = "";
              mandatory = false;
              this.askQuestion = "";
              this.answers = [];
              this.answersFields = [];
            }
          }

          this.inspectionItemForm.sort((category1, category2) => {
            let value = 0; // no change
            if (category1.itemName.value < category2.itemName.value) {
              value = -1; // 2 before 1
            } else if (category2.itemName.value < category1.itemName.value) {
              value = 1; // 1 before 2
            }

            return value;
          });
          this.loaderFlag = false;
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.$q.notify({
              color: "red-8",
              textColor: "white",
              icon: "error_outline",
              message: error.response.data.description + " " + "error",
            });
          } else {
            this.$q.notify({
              color: "red-8",
              textColor: "white",
              icon: "error_outline",
              message: "An Unexpectd Error Occurred" + " " + "error",
            });
          }
          return;
        });

      //	this.addAnswers();
    },
    clickInspectionAccordionFunction() {
      if (this.$refs.inspectionItem.openFlag === true) {
      }
    },
    answerTypeSelected(value, index) {
      this.inspectionItems[index].type = value.selectedObject.value;
      if (value.value === "Multiple Choice") {
        this.inspectionItems[index].answers.push("", "");
      } else {
        this.inspectionItems[index].answers = [];
      }
    },
    mandatoryChecked(index) {
      console.log(index);
    },
    itemValueFunction(value) {
      console.log("checklist", value);
    },

    addTemplateItems() {
      //	console.log("check list", this.inspectionItemForm);
      if (this.template == "") {
        this.toastMessage = "Please Select Template";
        this.toastType = "error";
        this.toastFlag++;
        return;
      }
      this.selectedInspectionItems = [];
      let array = [];
      for (let index = 0; index < this.inspectionItemForm.length; index++) {
        if (this.inspectionItemForm[index].value === true) {
          let obj = {
            answers: this.inspectionItemForm[index].answers,
            askQuestion: this.inspectionItemForm[index].askQuestion,
            itemName: this.inspectionItemForm[index].itemName,
            mandatory: this.inspectionItemForm[index].mandatory,
            type: this.inspectionItemForm[index].type,
          };
          array.push(obj);
        }
        this.selectedInspectionItems = array;
        this.selectedInspectionItems.name = this.templateName;

        console.log("test", this.selectedInspectionItems);
        this.modelInspection = array;
        this.btnLabel = "CHANGE INSPECTION TEMPLATE";
        this.$emit("SelectedTempItems", this.selectedInspectionItems);
        //	this.SelectedTempItems(this.selectedInspectionItems)
      }
      this.funcCancel();
    },
  },

  created() {
    this.getAllTemplate();
  },

  validations: function () {
    return {
      template: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.items-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 18px 18px;
  grid-column-gap: 8px;
  align-items: center;
}
.btns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 32px;
  margin-top: 24px;
  .btns * {
    height: 40px;
  }
}
</style>