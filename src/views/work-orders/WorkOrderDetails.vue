<template>
  <div class="page-container" v-padding-top="32">
    <span class="head-title" v-if="workOrderDetail !== null">{{
      workOrderDetail.workOrder.workOrderNumber
    }}</span
    ><br />
    <span class="subtitle"
      >View all the information related to a work order</span
    >
    <div class="flex-container">
      <div class="data-sec">
        <div>
          <WorkOrderSummary
            v-if="assetInfo !== null && workOrderDetail !== null"
            :workOrderDetail="workOrderDetail"
            :assetInfo="assetInfo"
            :disableFields="disableFields"
            :currency="currency"
            :key="sidebarUpdate + 'summary'"
            ref="workOrderSummaryForm"
          />
        </div>

        <SAccordion
          title="Asset Info"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'32'"
          v-margin-top="32"
          ref="assetInfoAccordion"
          @state="assetInfoAccordionFunction"
        >
          <AssetInfo :assetInfo="assetInfo" />
        </SAccordion>

        <SAccordion
          v-if="$route.name === 'edit-work-order-details'"
          title="Assignment"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'32'"
          v-margin-top="32"
          ref="assignmentAccordion"
          @state="assignmentAccordionFunction"
        >
          <Assignment
            v-if="workOrderDetail !== null"
            :workOrderDetail="workOrderDetail"
            :assignUser="workOrderDetail.workOrder.assignedToUserName"
            ref="workOrderAssignmentForm"
          ></Assignment>
        </SAccordion>

        <SAccordion
          title="Issues Detail"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'32'"
          v-margin-top="32"
          ref="issuesAccordion"
          @state="issuesAccordionFunction"
        >
          <div v-if="workOrderDetail !== null">
            <div v-padding="' 0px 32px 16px 32px'">
              <SMultipleSelect
                :checkbox="true"
                :avatar="false"
                v-model="issuesSelected"
                :label="'Issue Number*'"
                :data="issuesArrayList"
                optionLabel="issueNumber"
                @selected-values="onIssueNumberSelect"
                :error="getFormErrorMessage($v.issuesSelected)"
                :readonly="disableFields"
              />
       
            </div> 
            <!-- 
              :optionLabel="issueNumber"  
              onIssueNumberSelect 
            issuesAccordionFunction
            -->

            <div v-padding="' 0px 32px 16px 32px'">
              <div v-if="workOrderDetail.workOrder.issues">
                <SAccordion
                  v-for="(issue, index) in workOrderDetail.workOrder.issues"
                  :key="'issue_' + index"
                  :title="issue.issueNumber"
                  :expandIcon="'arrows'"
                  :open="false"
                  :border="false"
                  :padding="'32'"
                  v-margin-top="32"
                  ref="issueAccordion"
                  @state="issueAccordionFunction(index)"
                >
                  <Issue
                    v-if="workOrderDetail !== null"
                    :loaderFlag="loaderFlag"
                    :issueUUID="issue.issueUUID"
                    :workOrder="workOrderDetail"
                    :workOrderindex="index"
                    :currency="currency"
                    @sideBarIndex="sideBarIndex"
                    @loaderFalse="loaderFalse"
                  />
                  <div style="border: 1px solid var(--very-light-pink)"></div>
                </SAccordion>
              </div>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          title="Pooled Issue"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'32'"
          v-margin-top="32"
          ref="issuePoolAccordion"
          @state="issuePoolAccordionFunction"
        >
          <table v-padding="'0px 32px 16px 32px'">
            <tr>
              <th>Issue#</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            <tr v-for="(pool, index) in pooledIssues" :key="index">
              <td>{{ pool.issueNumber }}</td>
              <td>{{ pool.issueName }}</td>
              <td>{{ pool.status }}</td>
              <td>
                <img
                  src="/assets/icons/Results.svg"
                  alt=""
                  width="20px"
                  style="cursor: pointer"
                  @click="viewIssue(pool)"
                />
              </td>
            </tr>
          </table>

          <ViewIssue
            v-if="viewPoolIssue === true"
            :viewIssue="viewPoolIssue"
            :issueuuid="issueuuid"
            @close="closeIssueDialog"
          />
        </SAccordion>

        <SAccordion
          title="Timing"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'32'"
          v-margin-top="32"
          ref="timingAccordion"
          @state="timingAccordionFunction"
        >
          <WorkOrderTime
            v-if="workOrderDetail !== null"
            :workOrderDetail="workOrderDetail.workOrder"
          ></WorkOrderTime>
        </SAccordion>

        <SAccordion
          v-if="
            workOrderDetail !== null &&
            (workOrderDetail.workOrder.status === 'Closed' ||
              workOrderDetail.workOrder.status === 'In Progress')
          "
          title="Inspection Reports"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'32'"
          v-margin-top="32"
          ref="inspectionReportsAccordion"
          @state="inspectionReportsAccordionFunction"
        >
          <InspectionReports
            v-if="assetInfo !== null"
            :workuuid="workOrderUUID"
            :assetInfo="assetInfo"
          />
        </SAccordion>

        <SAccordion
          v-if="
            workOrderDetail !== null &&
            workOrderDetail.workOrder.status === 'Open' &&
            workOrderType === 'edit'
          "
          title="Initial Inspection*"
          expandIcon="arrows"
          :open="false"
          padding="32"
          :border="false"
          ref="inspectionsAccordion"
          @state="inspectionsAccordionFunction"
          :shadow="true"
          class="mt-32"
        >
          <div v-grid="1" class="row-col-gap">
            <SCheckBox
              v-padding="'16px 48px 0px 48px'"
              v-model="checkExistingInitialInspection"
              label="Select Existing Template"
              :disabled="false"
              :readonly="false"
              @input="existingFunction"
            />
            <div class="finalInspection mt-8"></div>
            <div
              v-grid="1"
              v-padding="'0px 48px 16px 48px'"
              v-if="checkExistingInitialInspection === true"
              class="row-col-gap mt-16"
              :key="inspectionReset"
            >
              <SSelect
                label="Inspection by Asset Category*"
                v-model="initialInspectionByAssetCategory"
                :source="inpsectionByAssetCategoryOptions"
                resultsValue="name"
                resultsDisplay="name"
                :autocomplete="true"
                @selected="initialInspectionByAssetCategorySelected"
                @clear="clearInitialInspectionByAssetCategory"
                :key="initialAssetIndex + '_asset'"
                :error="
                  getFormErrorMessage($v.initialInspectionByAssetCategory)
                "
              />
            </div>

            <div v-else class="mt-16">
              <SInput
                v-padding="'0px 48px 20px 48px'"
                label="Initial Inspection Template Title"
                v-model="workOrderSummary.initialInspectionTitle"
                v-if="!checkExistingInitialInspection"
                @input="initialInspectionFunc"
              />
              <div class="finalInspection"></div>

              <div
                v-for="(initial, index) in questionTypeFormInitial"
                :key="index + '_quest'"
              >
                <div class="column-grid-2" v-padding="'16px 48px 16px 48px'">
                  <SInput
                    label="Item Name*"
                    v-model="initial.name"
                    :error="
                      getFormErrorMessage(
                        $v.questionTypeFormInitial.$each[index].name
                      )
                    "
                  />
                  <SInput
                    label="Question*"
                    v-model="initial.question"
                    :error="
                      getFormErrorMessage(
                        $v.questionTypeFormInitial.$each[index].question
                      )
                    "
                  />
                </div>

                <div class="items-row mt-8" v-padding="'0px 48px 20px 48px'">
                  <SSelect
                    label="Answer Type*"
                    v-model="initial.typeLabel"
                    :source="answerTypeOptions"
                    resultsValue="label"
                    resultsDisplay="label"
                    :autocomplete="true"
                    @selected="
                      (value) => {
                        addAnswersArray(value, index);
                      }
                    "
                    @clear="clearSelectedAnswer(index)"
                    :error="
                      getFormErrorMessage(
                        $v.questionTypeFormInitial.$each[index].typeLabel
                      )
                    "
                    :key="initialAssetIndex + 'answerType'"
                  />
                  <div style="width: 30px; text-align: right">
                    <img
                      v-if="questionTypeFormInitial.length > 1"
                      width="16px"
                      style="cursor: pointer"
                      src="assets/icons/Delete.svg"
                      alt=""
                      @click="
                        () => {
                          removeInputFieldsInitial(index);
                        }
                      "
                    />
                  </div>

                  <div style="width: 30px; text-align: right">
                    <img
                      v-if="index === questionTypeFormInitial.length - 1"
                      width="18px"
                      style="cursor: pointer"
                      src="assets/icons/Add.svg"
                      alt=""
                      @click="addInputFieldsInitial"
                    />
                  </div>
                </div>

                <div v-if="initial.typeLabel === 'Multiple Choice'">
                  <div
                    v-padding="'0px 48px 0px 48px'"
                    class="multiple-choice-row"
                    v-for="(answ, multiAnsIndex) in initial.answers"
                    :key="'answer_' + multiAnsIndex"
                  >
                    <div class="col-instruction-gap mt-8">
                      <SInput
                        label="Option"
                        v-model="initial.answers[multiAnsIndex]"
                      />
                    </div>

                    <div style="width: 30px; text-align: right">
                      <img
                        width="16px"
                        style="cursor: pointer"
                        src="assets/icons/Delete.svg"
                        alt=""
                        @click="
                          removeMultipleChoiceInitial(index, multiAnsIndex)
                        "
                        v-if="multiAnsIndex > 1"
                      />
                    </div>

                    <div style="width: 30px; text-align: right">
                      <img
                        v-if="
                          initial.answers.length < 4 &&
                          initial.answers.length - 1 === multiAnsIndex
                        "
                        width="18px"
                        style="cursor: pointer"
                        src="assets/icons/Add.svg"
                        alt=""
                        @click="addMultipleChoiceInitial(index)"
                      />
                    </div>
                  </div>
                  <div class="finalInspection mt-16"></div>
                </div>
                <div class="finalInspection mt-16"></div>
              </div>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          v-if="
            workOrderDetail !== null &&
            workOrderDetail.workOrder.status === 'Open' &&
            workOrderType === 'edit'
          "
          title="Final Inspection*"
          expandIcon="arrows"
          :open="false"
          padding="32"
          :border="false"
          ref="finalInspectionsAccordion"
          @state="finalInspectionsAccordionFunction"
          :shadow="true"
          class="mt-32"
        >
          <div class="finalInspection" v-padding="'0px 48px 16px 48px'"></div>

          <SSelect
            v-padding="'0px 48px 16px 48px'"
            label="Inspection by Asset Category*"
            v-model="finalInspectionSelection"
            :source="finalInspectionOptions"
            resultsValue="label"
            resultsDisplay="label"
            :autocomplete="false"
            @selected="finalInspectionOptionSelected"
          />

          <div
            v-grid="1"
            class="row-col-gap"
            v-if="finalInspectionSelection !== 'Same As Initial'"
          >
            <div class="finalInspection mt-8"></div>

            <div
              v-padding="'0px 48px 20px 48px'"
              v-grid="1"
              v-if="finalInspectionSelection === 'Select Existing'"
              class="row-col-gap mt-8"
              :key="finalInspectionReset"
            >
              <SSelect
                label="Final Inspection by Asset Category*"
                v-model="finalInspectionByAssetCategory"
                :source="inpsectionByAssetCategoryOptions"
                resultsValue="name"
                resultsDisplay="name"
                :autocomplete="false"
                @selected="finalInspectionByAssetCategorySelected"
                :error="getFormErrorMessage($v.finalInspectionByAssetCategory)"
                @clear="clearSelectedFinalInspectionByAsset"
              />
            </div>
            <div v-else class="mt-16">
              <SInput
                v-padding="'0px 48px 16px 48px'"
                label="Final Inspection Template Title"
                v-model="workOrderSummary.finalInspectionTitle"
              />
              <div class="finalInspection"></div>

              <div
                v-for="(final, index) in questionTypeFormFinal"
                :key="index + 'quest'"
              >
                <div class="column-grid-2" v-padding="'16px 48px 16px 48px'">
                  <SInput
                    label="Item Name*"
                    v-model="final.name"
                    :error="
                      getFormErrorMessage(
                        $v.questionTypeFormFinal.$each[index].name
                      )
                    "
                  />
                  <SInput
                    label="Question*"
                    v-model="final.question"
                    :error="
                      getFormErrorMessage(
                        $v.questionTypeFormFinal.$each[index].question
                      )
                    "
                  />
                </div>
                <div class="items-row" v-padding="'16px 48px 16px 48px'">
                  <SSelect
                    label="Answer Type*"
                    v-model="final.typeLabel"
                    :source="answerTypeOptions"
                    resultsValue="label"
                    resultsDisplay="label"
                    :autocomplete="true"
                    @selected="
                      (value) => {
                        addAnswersArrayFinal(value, index);
                      }
                    "
                    :error="
                      getFormErrorMessage(
                        $v.questionTypeFormFinal.$each[index].typeLabel
                      )
                    "
                  />

                  <div style="width: 30px; text-align: right">
                    <img
                      v-if="questionTypeFormFinal.length > 1"
                      width="16px"
                      style="cursor: pointer"
                      src="assets/icons/Delete.svg"
                      alt=""
                      @click="removeInputFieldsFinal(index)"
                    />
                  </div>

                  <div style="width: 30px; text-align: right">
                    <img
                      v-if="index === questionTypeFormFinal.length - 1"
                      width="18px"
                      style="cursor: pointer"
                      src="assets/icons/Add.svg"
                      alt=""
                      @click="addInputFieldsFinal()"
                    />
                  </div>
                </div>

                <div v-if="final.typeLabel === 'Multiple Choice'" class="mt-16">
                  <div
                    class="multiple-choice-row"
                    v-padding="'0px 48px 0px 48px'"
                    v-for="(answ, multiAnsIndex) in final.answers"
                    :key="multiAnsIndex"
                  >
                    <div class="col-instruction-gap mt-8">
                      <SInput
                        label="Option"
                        v-model="final.answers[multiAnsIndex]"
                      />
                    </div>
                    <div style="width: 30px; text-align: right">
                      <img
                        v-if="multiAnsIndex > 1"
                        width="16px"
                        style="cursor: pointer"
                        src="assets/icons/Delete.svg"
                        alt=""
                        @click="removeMultipleChoiceFinal(index, multiAnsIndex)"
                      />
                    </div>

                    <div style="width: 30px; text-align: right">
                      <img
                        v-if="
                          final.answers.length < 4 &&
                          final.answers.length - 1 === multiAnsIndex
                        "
                        width="18px"
                        style="cursor: pointer"
                        src="assets/icons/Add.svg"
                        alt=""
                        @click="addMultipleChoiceFinal(index)"
                      />
                    </div>
                  </div>
                  <div class="finalInspection mt-16"></div>
                </div>
                <div class="finalInspection mt-16"></div>
              </div>
            </div>
          </div>
        </SAccordion>
      </div>
      <div class="empty-sec"></div>
      <div class="info-sec" id="sidebar-container">
        <div id="sidebar">
          <Sidebar
            v-if="
              assetInfo !== null &&
              workOrderDetail !== null &&
              workOrderUUID !== ''
            "
            :workOrderDetail="workOrderDetail"
            :assetInfo="assetInfo"
            :type="workOrderType"
            :currency="currency"
            :workUUID="workOrderUUID"
            :workOrderSummary="workOrderSummary"
            @updateWorkOrder="updateWorkOrder"
            :key="sidebarUpdate + '_sidebar'"
          />
        </div>
      </div>
      <!-- Loader Components -->
      <loader v-if="loaderFlag" />
      <!-- Loader Components -->
    </div>
    <SToast
      :message="toastMessage"
      :time-out="toastTimeOut"
      :type="toastType"
      :key="toastFlag"
    />
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import AssetInfo from "./components/AssetInfo";
import InspectionReports from "./components/InspectionReports";
import Assignment from "./components/Assignment";
import WorkOrderService from "../../services/WorkOrderService";
import AssetManagementService from "../../services/AssetManagementService";
import AssetPersonnelService from "../../services/AssetPersonnelService";
import InspectionService from "../../services/InspectionService";
import Issue from "./components/Issue";
import WorkOrderTime from "./components/Time";
import WorkOrderSummary from "./components/workOrderSummary";
import moment from "moment";
import ViewIssue from "../../views/issues/components/ViewIssue";
import { Functions } from "@/shared/Functions";
import { required, maxLength } from "vuelidate/lib/validators";

import loader from "@/components/Loader.vue";
export default {
  name: "WorkOrderDetails",
  components: {
    Sidebar,
    AssetInfo,
    InspectionReports,
    Assignment,
    WorkOrderTime,
    Issue,
    WorkOrderSummary,
    ViewIssue,
    loader,
  },
  data() {
    return {
      loaderFlag: false,
      /* Toast Properties */
      toastTimeOut: 3000,
      toastMessage: "",
      toastType: "",
      toastFlag: 0,
      /* Toast Properties */
      sidebarUpdate: 0,
      assetInfo: null,
      workOrderDetail: null,
      currency: "",
      currentUserDetails: "",
      pooledIssues: [],
      workOrderType: "",
      workOrderUUID: "",
      viewPoolIssue: false,
      issueUUID: "",
      totalWorkOrderCost: 0,
      disableFields: false,
      issuesArrayList: [],
      issuesSelected: [],
      // issueNumber: "",
      initialInspectionReport: null,
      finalInspectionReport: null,
      checkExistingInitialInspection: false,
      checkExistingFinalInspection: false,
      sameAsInitialInspection: true,
      initialInspectionByAsset: "",
      initialInspectionByAssetCategory: "",
      initialInspectionByWorkOrder: "",
      finalInspectionByAsset: "",
      finalInspectionByAssetCategory: "",
      finalInspectionByWorkOrder: "",
      selectedInitialInspectionByAsset: "",
      selectedInitialInspectionByAssetCategory: "",
      selectedInitialInspectionByWorkOrder: "",
      selectedFinalInspectionByAsset: "",
      selectedFinalInspectionByAssetCategory: "",
      selectedFinalInspectionByWorkOrder: "",
      inspectionByAssetOptions: [],
      inpsectionByAssetCategoryOptions: [],
      inpsectionByWorkOrderOptions: [],
      initialInspectionTemp: "",
      finalInspectionTitle: "",
      answerTypeOptions: [
        { label: "Text/Image/Audio", value: "input" },
        { label: "Yes/No", value: "boolean" },
        { label: "Multiple Choice", value: "multiple" },
      ],
      questionTypeFormInitial: [],
      questionTypeFormFinal: [],
      finalInspectionOptions: [
        { label: "Same As Initial", value: "same" },
        { label: "Select Existing", value: "existing" },
        { label: "Create New Inspection Template", value: "createNew" },
      ],
      finalInspectionSelection: "Same As Initial",
      same: true,
      workOrderSummaryIndex: 0,
      initialAssetIndex: 0,
      inspectionReset: 0,
      finalInspectionReset: 0,
      workOrderSummary: {
        priority: "",
        shift: "",
        shedule: "",
        userGroup: "",
        user: "",
        issues: [],
        initialInspectionTitle: "",
        finalInspectionTitle: "",
        category: "",
        name: "",
        selectedInitialInspectionByAssetCategory: "",
        selectedFinalInspectionByAssetCategory: "",
      },
      perivousInitialTemplate: {},
      previousFinalTemplate: {},
      perivousInitialExisting: {},
      perivousFinalExisting: {},
    };
  },
  props: {
    workuuid: {},
  },

  methods: {
    setTypeLabel(items) {
      items.map((item) => {
        if (item.type === "input") {
          item.typeLabel = "Text/Image/Audio";
        } else if (item.type === "boolean") {
          item.typeLabel = "Yes/No";
        } else {
          item.typeLabel = "Multiple Choice";
        }
      });
      return items;
    },

    getInspectionTemplateByUUID(uuid, type) {
      WorkOrderService.getInspectionTemplateByInspectionUUID(uuid)
        .then((response) => {
          if (response.status === 200) {
            let workOrderInspectionTemplate =
              response.data.workOrderInspectionTemplate;
            if (type === "same") {
              this.workOrderSummary.initialInspectionTitle =
                workOrderInspectionTemplate.name;
              this.workOrderSummary.finalInspectionTitle =
                workOrderInspectionTemplate.name;
              this.questionTypeFormInitial = this.setTypeLabel(
                workOrderInspectionTemplate.inspectionItems
              );
              this.perivousInitialTemplate = workOrderInspectionTemplate;
            } else if (type === "New Initial") {
              this.workOrderSummary.initialInspectionTitle =
                workOrderInspectionTemplate.name;
              this.questionTypeFormInitial = this.setTypeLabel(
                workOrderInspectionTemplate.inspectionItems
              );
              this.perivousInitialTemplate = workOrderInspectionTemplate;
            } else if (type === "New Final") {
              this.workOrderSummary.finalInspectionTitle =
                workOrderInspectionTemplate.name;
              this.questionTypeFormFinal = this.setTypeLabel(
                workOrderInspectionTemplate.inspectionItems
              );
              this.previousFinalTemplate = workOrderInspectionTemplate;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //function will map existing Initial Inspection Template Data
    mapInitialExistingTemplate(planning) {
      let selectedOption = this.inpsectionByAssetCategoryOptions.find(
        (val) => val.uuid === planning.initialInspectionUUID
      );
      this.initialInspectionByAssetCategory = selectedOption.name;
      this.perivousInitialExisting = selectedOption;
      this.initialInspectionByAssetCategorySelected({
        selectedObject: selectedOption,
      });
    },

    //function will map existing Final Inspection Template Data
    mapFinalExistingTemplate(planning) {
      let selectedOption = this.inpsectionByAssetCategoryOptions.find(
        (val) => val.uuid === planning.finalInspectionUUID
      );
      this.finalInspectionByAssetCategory = selectedOption.name;
      this.perivousFinalExisting = selectedOption;
      this.finalInspectionByAssetCategorySelected({
        selectedObject: selectedOption,
      });
    },

    //function will map Final and Initial Templates Data
    mapInitialAndFinalInspectionTemplatesData(planning) {
      //checking if final and initial inspection Templates are same
      if (planning.sameInspection) {
        //checking if its new template or existing one
        if (
          !planning.fromExistingInitial &&
          !planning.fromExistingFinal &&
          !planning.fromInspectionInitial &&
          !planning.fromInspectionFinal
        ) {
          this.finalInspectionSelection = "Same As Initial";
          this.checkExistingInitialInspection = false;
          this.getInspectionTemplateByUUID(
            planning.initialInspectionUUID,
            "same"
          ); // calling function to get new template
        } else {
          this.finalInspectionSelection = "Same As Initial";
          this.checkExistingInitialInspection = true;
          this.mapInitialExistingTemplate(planning); //calling function to map existing template
        }
      } else {
        this.same = false;
        //checking if new initial inpseciton template or Existing one
        if (!planning.fromExistingInitial && !planning.fromInspectionInitial) {
          this.checkExistingInitialInspection = false;
          this.getInspectionTemplateByUUID(
            planning.initialInspectionUUID,
            "New Initial"
          );
        } else {
          this.checkExistingInitialInspection = true;
          this.mapInitialExistingTemplate(planning);
        }
        //checking if new final inpseciton template or Existing one
        if (!planning.fromExistingFinal && !planning.fromInspectionFinal) {
          this.finalInspectionSelection = "Create New Inspection Template";
          this.getInspectionTemplateByUUID(
            planning.finalInspectionUUID,
            "New Final"
          );
        } else {
          this.finalInspectionSelection = "Select Existing";
          this.mapFinalExistingTemplate(planning);
        }
      }
    },

    getInspectionTemplates(assetUUID, tenantUUID) {
      InspectionService.getInspectionTemplateNameAndUUID(assetUUID, tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            this.inspectionByAssetOptions = response.data.inspections;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getInspectionTemplateFromWorkOrder(tenantUUID) {
      WorkOrderService.getWorkOrderInspectionTemplates(tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            this.inpsectionByWorkOrderOptions = response.data.inspections;
            for (let inspection of this.inpsectionByWorkOrderOptions) {
              if (inspection.name === "" || !inspection.name) {
                inspection.name = "-";
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getInspectionTemaplatesByAssetCategory(categoryUUID) {
      InspectionService.getInspectionTemplateNameAndUUIDByCategoryUUID(
        categoryUUID
      )
        .then((response) => {
          if (response.status === 200) {
            this.inpsectionByAssetCategoryOptions = response.data.inspections;
            if (this.workOrderDetail.workOrder.status === "Open") {
              this.mapInitialAndFinalInspectionTemplatesData(
                this.workOrderDetail.workOrder.planning
              );
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    removeMultipleChoiceInitial(index, m) {
      this.questionTypeFormInitial[index].answers.splice(m, 1);
    },

    removeMultipleChoiceFinal(index, m) {
      this.questionTypeFormFinal[index].answers.splice(m, 1);
    },

    addAnswersArray(value, index) {
      this.questionTypeFormInitial[index].type = value.selectedObject.value;
      if (value.value === "Multiple Choice") {
        this.questionTypeFormInitial[index].answers.push("", "");
      } else {
        this.questionTypeFormInitial[index].answers = [];
      }
    },

    addAnswersArrayFinal(value, index) {
      this.questionTypeFormFinal[index].type = value.selectedObject.value;
      if (value.value === "Multiple Choice") {
        this.questionTypeFormFinal[index].answers.push("", "");
      } else {
        this.questionTypeFormFinal[index].answers = [];
      }
    },

    addMultipleChoiceInitial(index) {
      this.questionTypeFormInitial[index].answers.push("");
    },

    addMultipleChoiceFinal(index) {
      this.questionTypeFormFinal[index].answers.push("");
    },

    removeInputFieldsInitial(index) {
      this.questionTypeFormInitial.splice(index, 1);
    },

    removeInputFieldsFinal(index) {
      this.questionTypeFormFinal.splice(index, 1);
    },

    addInputFieldsInitial() {
      this.questionTypeFormInitial.push({
        name: "",
        type: "",
        question: "",
        answers: [],
        mandatory: true,
      });
    },

    addInputFieldsFinal() {
      this.questionTypeFormFinal.push({
        name: "",
        type: "",
        question: "",
        answers: [],
        mandatory: true,
      });
    },

    finalInspectionByAssetSelected(value) {
      this.selectedFinalInspectionByAsset = value.selectedObject;
      this.finalInspectionByAssetCategory = "";
      this.selectedFinalInspectionByAssetCategory = "";
      this.finalInspectionByWorkOrder = "";
      this.selectedFinalInspectionByWorkOrder = "";
      this.finalInspectionReset++;
    },

    finalInspectionByAssetCategorySelected(value) {
      this.selectedFinalInspectionByAssetCategory = value.selectedObject;
      this.workOrderSummary.selectedFinalInspectionByAssetCategory =
        this.selectedFinalInspectionByAssetCategory;
      this.finalInspectionByAsset = "";
      this.selectedFinalInspectionByAsset = "";
      this.finalInspectionByWorkOrder = "";
      this.selectedFinalInspectionByWorkOrder = "";
      this.finalInspectionReset++;
    },

    finalInspectionByWorkOrderSelected(value) {
      this.selectedFinalInspectionByWorkOrder = value.selectedObject;
      this.finalInspectionByAsset = "";
      this.selectedFinalInspectionByAsset = "";
      this.finalInspectionByAssetCategory = "";
      this.selectedFinalInspectionByAssetCategory = "";
      this.finalInspectionReset++;
    },

    initialInspectionByAssetSelected(value) {
      this.selectedInitialInspectionByAsset = value.selectedObject;
      this.initialInspectionByAssetCategory = "";
      this.selectedInitialInspectionByAssetCategory = "";
      this.initialInspectionByWorkOrder = "";
      this.selectedInitialInspectionByWorkOrder = "";
      this.inspectionReset++;
    },

    initialInspectionByAssetCategorySelected(value) {
      this.initialInspectionTemp = value.selectedObject;
      if (this.same === true) {
        if (this.checkExistingInitialInspection === true) {
          this.workOrderSummary.selectedFinalInspectionByAssetCategory =
            value.selectedObject;
          this.workOrderSummaryIndex++;
        }
      }

      this.selectedInitialInspectionByAssetCategory = value.selectedObject;
      this.workOrderSummary.selectedInitialInspectionByAssetCategory =
        this.selectedInitialInspectionByAssetCategory;
      this.initialInspectionByAsset = "";
      this.selectedInitialInspectionByAsset = "";
      this.initialInspectionByWorkOrder = "";
      this.selectedInitialInspectionByWorkOrder = "";
      this.inspectionReset++;
    },

    clearInitialInspectionByAssetCategory() {
      this.initialInspectionByAssetCategory = null;
      this.initialAssetIndex++;
    },

    initialInspectionByWorkOrderSelected(value) {
      this.selectedInitialInspectionByWorkOrder = value.selectedObject;
      this.initialInspectionByAsset = "";
      this.selectedInitialInspectionByAsset = "";
      this.initialInspectionByAssetCategory = "";
      this.selectedInitialInspectionByAssetCategory = "";
      this.inspectionReset++;
    },

    finalInspectionOptionSelected(value) {
      this.workOrderSummary.finalInspectionTitle = "";
      this.workOrderSummary.selectedFinalInspectionByAssetCategory = "";

      this.finalInspectionByAssetCategory = [];
      this.selectedFinalInspectionByAssetCategory = "";
      if (value.value === "Same As Initial") {
        this.same = true;
        if (this.checkExistingInitialInspection) {
          this.workOrderSummary.selectedFinalInspectionByAssetCategory =
            this.workOrderSummary.selectedInitialInspectionByAssetCategory;
        } else {
          this.workOrderSummary.finalInspectionTitle =
            this.workOrderSummary.initialInspectionTitle;
        }
      } else {
        this.same = false;
        if (value.value === "Select Existing") {
          //checking if existing template was the perivous template
          if (
            this.workOrderDetail.workOrder.planning.fromExistingFinal ||
            this.workOrderDetail.workOrder.planning.fromInspectionFinal
          ) {
            this.mapFinalExistingTemplate(
              this.workOrderDetail.workOrder.planning
            );
            this.questionTypeFormFinal = [];
            this.addInputFieldsFinal();
          }
        } else {
          //checking if new template was the perivous template
          if (
            !this.workOrderDetail.workOrder.planning.fromExistingFinal &&
            !this.workOrderDetail.workOrder.planning.fromInspectionFinal
          ) {
            if (!this.workOrderDetail.workOrder.planning.sameInspection) {
              this.workOrderSummary.finalInspectionTitle =
                this.previousFinalTemplate.name;
              this.questionTypeFormFinal = this.setTypeLabel(
                this.previousFinalTemplate.items
              );
            } else {
              this.questionTypeFormFinal = [];
              this.addInputFieldsFinal();
            }
          } else {
            this.questionTypeFormFinal = [];
            this.addInputFieldsFinal();
          }
        }
      }
      this.workOrderSummaryIndex++;
    },

    initialInspectionFunc(value) {
      if (this.same === true) {
        if (this.checkExistingInitialInspection === false) {
          this.workOrderSummary.finalInspectionTitle = value;
        }
      }
      this.workOrderSummaryIndex++;
    },

    existingFunction(value) {
      this.workOrderSummary.initialInspectionTitle = "";
      this.workOrderSummary.selectedInitialInspectionByAssetCategory = "";

      if (this.same === true) {
        this.workOrderSummary.finalInspectionTitle = "";
        this.workOrderSummary.selectedFinalInspectionByAssetCategory = "";
      }
      //when check or un-check check-box checking then mapping Templates data again
      if (this.workOrderDetail.workOrder.planning.sameInspection) {
        this.finalInspectionSelection = "Same As Initial";
      }

      if (value === true) {
        //checking if existing template was the perivous template
        if (
          this.workOrderDetail.workOrder.planning.fromExistingInitial ||
          this.workOrderDetail.workOrder.planning.fromInspectionInitial
        ) {
          this.mapInitialExistingTemplate(
            this.workOrderDetail.workOrder.planning
          );
          this.questionTypeFormInitial = [];
          this.addInputFieldsInitial();
        }
      } else {
        //checking if new template was the perivous template
        if (
          !this.workOrderDetail.workOrder.planning.fromExistingInitial &&
          !this.workOrderDetail.workOrder.planning.fromInspectionInitial
        ) {
          this.workOrderSummary.initialInspectionTitle =
            this.perivousInitialTemplate.name;
          if (this.workOrderDetail.workOrder.planning.sameInspection) {
            this.workOrderSummary.finalInspectionTitle =
              this.workOrderSummary.initialInspectionTitle;
          }
          this.questionTypeFormInitial = this.setTypeLabel(
            this.perivousInitialTemplate.inspectionItems
          );
        } else {
          this.questionTypeFormInitial = [];
          this.addInputFieldsInitial();
        }
        this.initialInspectionByAssetCategory = "";
        this.selectedInitialInspectionByAssetCategory = "";
        this.initialAssetIndex++;
      }
      this.workOrderSummaryIndex++;
    },

    sideBarIndex() {
      this.sidebarUpdate++;
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation && fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    onIssueNumberSelect(value) {
      this.workOrderDetail.workOrder.issues = [];
      if (value.length > 0) {
        this.workOrderDetail.workOrder.issues = value.filter(
          (v) => v.id !== null && v.id !== undefined
        );
      } else {
        this.workOrderDetail.workOrder.issues = null;
      }
    },

    closeIssueDialog() {
      this.viewPoolIssue = false;
    },

    viewIssue(issue) {
      this.issueUUID = issue.uuid;
      this.viewPoolIssue = true;
    },

    updateWorkOrder() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }

      let summary_form_valdiations =
        this.$refs.workOrderSummaryForm &&
        this.$refs.workOrderSummaryForm.checkValidations()
          ? this.$refs.workOrderSummaryForm.checkValidations()
          : null;
      let assignment_form_validations =
        this.$refs.workOrderAssignmentForm &&
        this.$refs.workOrderAssignmentForm.checkValidations()
          ? this.$refs.workOrderAssignmentForm.checkValidations()
          : null;

      if (summary_form_valdiations) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }

      if (assignment_form_validations) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }

      this.loaderFlag = true;

      let initialInspectionTemplate = null;
      let finalInspectionTemplate = null;
      let fromInspectionInitial = false;
      let fromInspectionFinal = false;

      let initialInspectionOption = null;
      let finalInspectionOption = null;

      var initialInspectionTemplateLinkingUUID = null;
      let finalInspectionTemplateLinkingUUID = null;
      let initialLinkInspectionType = null;
      let finalLinkInspectionType = null;
      this.$refs.issuesAccordion.openFlag = false;
      if (this.checkExistingInitialInspection === true) {
        if (this.selectedInitialInspectionByAssetCategory !== "") {
          initialLinkInspectionType = "inspection";
        }
      }
      if (this.finalInspectionSelection === "Select Existing") {
        if (this.selectedFinalInspectionByAssetCategory !== "") {
          finalLinkInspectionType = "inspection";
        }
      }

      if (this.questionTypeFormInitial.length > 0) {
        initialInspectionTemplate = {
          name: this.workOrderSummary.initialInspectionTitle,
          inspectionItems: this.questionTypeFormInitial,
          uuid:
            this.perivousInitialTemplate.uuid !== null &&
            this.perivousInitialTemplate.uuid !== undefined
              ? this.perivousInitialTemplate.uuid
              : null,
        };
        initialInspectionOption = "save";
        fromInspectionInitial = false;
      } else {
        fromInspectionInitial = true;
      }

      if (this.questionTypeFormFinal.length > 0) {
        finalInspectionTemplate = {
          name: this.workOrderSummary.finalInspectionTitle,
          inspectionItems: this.questionTypeFormFinal,
          uuid:
            this.previousFinalTemplate.uuid !== null &&
            this.previousFinalTemplate.uuid !== undefined
              ? this.previousFinalTemplate.uuid
              : null,
        };
        finalInspectionOption = "save";
        fromInspectionFinal = false;
      } else {
        fromInspectionFinal = true;
      }

      if (this.sameAsInitialInspection) {
        this.workOrderDetail.workOrder.planning.sameInspection = true;
      }

      if (this.workOrderDetail.workOrder.planning.fromInspectionInitial) {
        if (this.selectedInitialInspectionByAsset !== null) {
          this.workOrderDetail.workOrder.planning.initialInspectionUUID =
            this.selectedInitialInspectionByAsset.value;
        } else if (this.selectedInitialInspectionByAssetCategory !== null) {
          this.workOrderDetail.workOrder.planning.initialInspectionUUID =
            this.selectedInitialInspectionByAssetCategory.value;
        } else {
          this.workOrderDetail.workOrder.planning.initialInspectionUUID =
            this.selectedFinalInspectionByWorkOrder.value;
        }
      }

      if (this.workOrderDetail.workOrder.planning.fromInspectionFinal) {
        if (this.sameAsInitialInspection) {
          this.workOrderDetail.workOrder.planning.finalInspectionUUID =
            this.workOrderDetail.workOrder.planning.initialInspectionUUID;
        } else {
          if (this.selectedFinalInspectionByAsset !== null) {
            this.workOrderDetail.workOrder.planning.finalInspectionUUID =
              this.selectedFinalInspectionByAsset.value;
          } else if (this.selectedFinalInspectionByAssetCategory !== null) {
            this.workOrderDetail.workOrder.planning.finalInspectionUUID =
              this.selectedFinalInspectionByAssetCategory.value;
          } else {
            this.workOrderDetail.workOrder.planning.finalInspectionUUID =
              this.selectedFinalInspectionByWorkOrder.value;
          }
        }
      }

      if (this.checkExistingInitialInspection) {
        this.workOrderDetail.workOrder.planning.fromExistingInitial = true;
        this.workOrderDetail.workOrder.planning.fromInspectionInitial = false;
        this.workOrderDetail.workOrder.planning.initialInspectionUUID =
          this.initialInspectionTemp.uuid;
      } else {
        this.workOrderDetail.workOrder.planning.initialInspectionUUID = null;
      }

      if (this.finalInspectionSelection === "Select Existing") {
        this.workOrderDetail.workOrder.planning.fromExistingFinal = true;
        this.workOrderDetail.workOrder.planning.fromInspectionInitial = false;
        this.workOrderDetail.workOrder.planning.finalInspectionUUID =
          this.selectedFinalInspectionByAssetCategory.uuid;
      } else {
        this.workOrderDetail.workOrder.planning.finalInspectionUUID = null;
      }

      if (
        this.finalInspectionSelection === "Same As Initial" &&
        this.checkExistingInitialInspection
      ) {
        this.workOrderDetail.workOrder.planning.finalInspectionUUID =
          this.initialInspectionTemp.uuid;
        this.workOrderDetail.workOrder.planning.fromExistingFinal = true;
      }

      if (
        this.workOrderDetail.workOrder.planning.initialInspectionUUID ===
        this.workOrderDetail.workOrder.planning.finalInspectionUUID
      ) {
        this.workOrderDetail.workOrder.planning.sameInspection = true;
      } else if (
        this.workOrderDetail.workOrder.planning.initialInspectionUUID == null ||
        this.workOrderDetail.workOrder.planning.finalInspectionUUID == null
      ) {
        this.workOrderDetail.workOrder.planning.sameInspection = false;
      }

      if (this.workOrderDetail.workOrder.startTime === "-") {
        this.workOrderDetail.workOrder.startTime = null;
      }
      if (this.workOrderDetail.workOrder.endTime === "-") {
        this.workOrderDetail.workOrder.endTime = null;
      }

      if (this.workOrderDetail.workOrder.endTime === "-") {
        this.workOrderDetail.workOrder.endTime = null;
      }

      for (let issue of this.workOrderDetail.workOrder.issues) {
        issue.orderInstructions = JSON.stringify(issue.orderInstructions);
      }

      this.workOrderDetail.workOrder.schedule = moment(
        this.workOrderDetail.workOrder.schedule
      ).toISOString();
      this.workOrderDetail.workOrder.startTime = moment(
        this.workOrderDetail.workOrder.startTime
      ).toISOString();

      this.workOrderDetail.workOrder.endTime = moment(
        this.workOrderDetail.workOrder.endTime
      ).toISOString();

      let updateWorkOrderReq = {
        workOrder: this.workOrderDetail.workOrder,
        updateWorkOrder: true,
        templateUpdate: true,
      };

      if (this.checkExistingInitialInspection === true) {
        updateWorkOrderReq.initialInspectionTemplate = null;
      } else {
        updateWorkOrderReq.initialInspectionTemplate =
          initialInspectionTemplate;
        this.workOrderDetail.workOrder.planning.fromExistingInitial = false;
        this.workOrderDetail.workOrder.planning.fromInspectionInitial = false;
      }

      if (this.finalInspectionSelection === "Create New Inspection Template") {
        updateWorkOrderReq.finalInspectionTemplate = finalInspectionTemplate;
        this.workOrderDetail.workOrder.planning.fromExistingFinal = false;
        this.workOrderDetail.workOrder.planning.fromInspectionFinal = false;
        this.workOrderDetail.workOrder.planning.sameInspection = false;
      } else if (
        this.finalInspectionSelection === "Same As Initial" &&
        this.checkExistingInitialInspection !== true
      ) {
        updateWorkOrderReq.finalInspectionTemplate = initialInspectionTemplate;
        this.workOrderDetail.workOrder.planning.fromExistingFinal =
          this.workOrderDetail.workOrder.planning.fromExistingInitial;
        this.workOrderDetail.workOrder.planning.fromInspectionFinal =
          this.workOrderDetail.workOrder.planning.fromInspectionInitial;
      } else if (this.finalInspectionSelection === "Select Existing") {
        updateWorkOrderReq.finalInspectionTemplate = null;
        this.workOrderDetail.workOrder.planning.sameInspection = false;
      } else {
        updateWorkOrderReq.finalInspectionTemplate = null;
      }
      updateWorkOrderReq.initialInspectionOption = initialInspectionOption;
      updateWorkOrderReq.finalInspectionOption = finalInspectionOption;
      updateWorkOrderReq.initialInspectionTemplateLinkingUUID =
        initialInspectionTemplateLinkingUUID;
      updateWorkOrderReq.finalInspectionTemplateLinkingUUID =
        finalInspectionTemplateLinkingUUID;
      updateWorkOrderReq.initialLinkInspectionType = initialLinkInspectionType;
      updateWorkOrderReq.finalLinkInspectionType = finalLinkInspectionType;

      //return
      WorkOrderService.updateWorkOrder(updateWorkOrderReq)
        .then((response) => {
          if (response.status === 200) {
            this.$router.push({
              name: "work-order",
              params: {
                toastFlag: true,
                message: "Work Order Updated Successfully",
                toastType: "success",
              },
            });
            this.loaderFlag = false;
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          console.log(error);
        });
    },

    getPooledIssues() {
      InspectionService.filterIssuesByAssetUUID(
        this.assetInfo.assetDetail.uuid,
        "POOLED"
      )
        .then((response) => {
          if (response.status === 200) {
            this.pooledIssues = response.data.issues;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getIssuesByAssetUUID() {
      InspectionService.filterIssuesByAssetUUID(
        this.assetInfo.assetDetail.uuid,
        "reported"
      )
        .then((response) => {
          if (response.status === 200) {
            this.issuesArrayList = response.data.issues;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getCurrency() {
      AssetPersonnelService.getCompanyCurrency(
        this.currentUserDetails.profile.organizationId
      ).then((response) => {
        this.currency = response.data.currency;
      });
    },

    getWorkOrder() {
      WorkOrderService.getWorkOrderByUUID(this.$route.params.workuuid).then(
        (response) => {

          if (response.status === 200) {
            for (let workorder_issue of response.data.workOrder.issues) {
              workorder_issue.orderInstructions = JSON.parse(
                workorder_issue.orderInstructions
              );
            }

            this.issuesArrayList = response.data.workOrder.issues;
            this.issuesSelected = this.issuesArrayList;
            // for (let x in this.issuesArrayList) {
            //   this.issueNumber = this.issuesSelected[x].issueNumber;
            //   console.log("issueNumber", this.issueNumber);
            // }

            this.workOrderDetail = response.data;
            document.title = `${this.workOrderDetail.workOrder.workOrderNumber} ${this.$route.meta.title}`;

            document.title = `${this.workOrderDetail.workOrder.workOrderNumber} ${this.$route.meta.title}`;

            if (this.workOrderDetail.workOrder.startTime === null) {
              this.workOrderDetail.workOrder.startTime = "-";
            } else {
              this.workOrderDetail.workOrder.startTime = moment(
                this.workOrderDetail.workOrder.startTime
              ).format();
            }
            if (this.workOrderDetail.workOrder.endTime === null) {
              this.workOrderDetail.workOrder.endTime = "-";
            } else {
              this.workOrderDetail.workOrder.endTime = moment(
                this.workOrderDetail.workOrder.endTime
              ).format();
            }
            if (this.workOrderDetail.workOrder.elapsedTimeFormatted === null) {
              this.workOrderDetail.workOrder.elapsedTimeFormatted = "-";
            }
            this.workOrderDetail.workOrder.schedule = moment(
              this.workOrderDetail.workOrder.schedule
            ).format("DD MMM YYYY");
            this.getAsset(response.data.workOrder.assetUUID);
          }
        }
      );
    },

    getAsset(assetUUID) {
      AssetManagementService.getAssetWithDetails(assetUUID, true, true)
        .then((response) => {
          if (response.status === 200) {
            this.assetInfo = response.data.assetDetail;
            this.getPooledIssues();
            if (this.workOrderDetail.workOrder.status === "Open") {
              this.getInspectionTemplates(
                assetUUID,
                this.currentUserDetails.profile.organizationId
              );
              this.getInspectionTemplateFromWorkOrder(
                this.currentUserDetails.profile.organizationId
              );
              this.getInspectionTemaplatesByAssetCategory(
                this.assetInfo.category.uuid
              );
            }

            this.loaderFlag = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    assetInfoAccordionFunction() {
      if (this.$refs.assetInfoAccordion.openFlag === true) {
        if (this.workOrderType === "edit") {
          this.$refs.assignmentAccordion.openFlag = false;
        }

        this.$refs.timingAccordion.openFlag = false;
        if (this.$refs.inspectionReportsAccordion !== undefined) {
          this.$refs.inspectionReportsAccordion.openFlag = false;
        }
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.issuePoolAccordion.openFlag = false;
        if (this.$refs.finalInspectionsAccordion !== undefined) {
          this.$refs.finalInspectionsAccordion.openFlag = false;
        }
        if (this.$refs.inspectionsAccordion !== undefined) {
          this.$refs.inspectionsAccordion.openFlag = false;
        }
      }
    },

    assignmentAccordionFunction() {
      if (this.$refs.assignmentAccordion.openFlag === true) {
        this.$refs.timingAccordion.openFlag = false;
        if (this.$refs.inspectionReportsAccordion !== undefined) {
          this.$refs.inspectionReportsAccordion.openFlag = false;
        }
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.issuePoolAccordion.openFlag = false;
        if (this.$refs.finalInspectionsAccordion !== undefined) {
          this.$refs.finalInspectionsAccordion.openFlag = false;
        }
        if (this.$refs.inspectionsAccordion !== undefined) {
          this.$refs.inspectionsAccordion.openFlag = false;
        }
      }
    },

    timingAccordionFunction() {
      if (this.$refs.timingAccordion.openFlag === true) {
        if (this.workOrderType === "edit") {
          this.$refs.assignmentAccordion.openFlag = false;
        }
        this.$refs.assetInfoAccordion.openFlag = false;
        if (this.$refs.inspectionReportsAccordion !== undefined) {
          this.$refs.inspectionReportsAccordion.openFlag = false;
        }
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.issuePoolAccordion.openFlag = false;
        if (this.$refs.finalInspectionsAccordion !== undefined) {
          this.$refs.finalInspectionsAccordion.openFlag = false;
        }
        if (this.$refs.inspectionsAccordion !== undefined) {
          this.$refs.inspectionsAccordion.openFlag = false;
        }
      }
    },

    inspectionReportsAccordionFunction() {
      if (this.$refs.inspectionReportsAccordion.openFlag === true) {
        this.$refs.timingAccordion.openFlag = false;
        if (this.workOrderType === "edit") {
          this.$refs.assignmentAccordion.openFlag = false;
        }
        this.$refs.assetInfoAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.issuePoolAccordion.openFlag = false;
      }
    },

    issuesAccordionFunction() {
      if (this.$refs.issuesAccordion.openFlag === true) {
        this.$refs.timingAccordion.openFlag = false;
        if (this.workOrderType === "edit") {
          this.$refs.assignmentAccordion.openFlag = false;
        }
        this.$refs.assetInfoAccordion.openFlag = false;
        if (this.$refs.inspectionReportsAccordion !== undefined) {
          this.$refs.inspectionReportsAccordion.openFlag = false;
        }
        this.$refs.issuePoolAccordion.openFlag = false;
        if (this.$refs.finalInspectionsAccordion !== undefined) {
          this.$refs.finalInspectionsAccordion.openFlag = false;
        }
        if (this.$refs.inspectionsAccordion !== undefined) {
          this.$refs.inspectionsAccordion.openFlag = false;
        }
      }
    },

    inspectionsAccordionFunction() {
      if (this.$refs.inspectionsAccordion.openFlag === true) {
        this.$refs.timingAccordion.openFlag = false;
        if (this.workOrderType === "edit") {
          this.$refs.assignmentAccordion.openFlag = false;
        }
        this.$refs.assetInfoAccordion.openFlag = false;
        this.$refs.issuePoolAccordion.openFlag = false;
        this.$refs.finalInspectionsAccordion.openFlag = false;
      }
    },

    finalInspectionsAccordionFunction() {
      if (this.$refs.finalInspectionsAccordion.openFlag === true) {
        this.$refs.timingAccordion.openFlag = false;
        if (this.workOrderType === "edit") {
          this.$refs.assignmentAccordion.openFlag = false;
        }
        this.$refs.assetInfoAccordion.openFlag = false;
        this.$refs.issuePoolAccordion.openFlag = false;
        this.$refs.inspectionsAccordion.openFlag = false;
      }
    },

    issueAccordionFunction(indx) {
      for (let index = 0; index < this.$refs.issueAccordion.length; index++) {
        // this.loaderFlag = true
        if (index !== indx) {
          this.$refs.issueAccordion[index].openFlag = false;
        }
      }
    },
    loaderFalse() {
      this.loaderFlag = false;
    },
    issuePoolAccordionFunction() {
      if (this.$refs.issuePoolAccordion.openFlag === true) {
        this.$refs.timingAccordion.openFlag = false;
        if (this.workOrderType === "edit") {
          this.$refs.assignmentAccordion.openFlag = false;
        }
        this.$refs.assetInfoAccordion.openFlag = false;
        if (this.$refs.inspectionReportsAccordion !== undefined) {
          this.$refs.inspectionReportsAccordion.openFlag = false;
        }
        if (this.$refs.finalInspectionsAccordion !== undefined) {
          this.$refs.finalInspectionsAccordion.openFlag = false;
        }
        if (this.$refs.inspectionsAccordion !== undefined) {
          this.$refs.inspectionsAccordion.openFlag = false;
        }
      }
    },

    setSidebarPos() {
      let sideBarContainer = document.getElementById("sidebar-container");
      let sidebar = document.getElementById("sidebar");
      sidebar.style.width = sideBarContainer.offsetWidth + "px";
      sidebar.style.position = "fixed";
      sidebar.style.left = sideBarContainer.offsetLeft;
    },

    clearSelectedAnswer(index) {
      this.questionTypeFormInitial[index].typeLabel = "";
      this.initialAssetIndex++;
    },

    clearSelectedFinalInspectionByAsset() {
      this.finalInspectionByAssetCategory = "";
      this.finalInspectionReset++;
    },

    inspectionTemplateValidation() {
      let valdiations = {};
      if (this.workOrderDetail.workOrder.status == "Open") {
        if (
          this.finalInspectionSelection == "Create New Inspection Template" &&
          !this.checkExistingInitialInspection
        ) {
          valdiations = {
            workOrderSummary: {
              initialInspectionTitle: { required, maxLength: maxLength(190) },
              finalInspectionTitle: { required, maxLength: maxLength(190) },
            },
          };
        }
      }

      return valdiations;
    },

    initialInspectionValidation() {
      let validations = {};
      if (this.workOrderDetail.workOrder.status == "Open") {
        if (this.checkExistingInitialInspection) {
          validations = {
            initialInspectionByAssetCategory: { required },
            questionTypeFormInitial: {
              $each: {
                name: {},
                question: {},
                typeLabel: {},
              },
            },
          };
        } else {
          validations = {
            initialInspectionByAssetCategory: {},
            questionTypeFormInitial: {
              $each: {
                name: { required, maxLength: maxLength(190) },
                question: { required, maxLength: maxLength(190) },
                typeLabel: { required },
              },
            },
          };
        }
      } else {
        validations = {
          initialInspectionByAssetCategory: {},
          questionTypeFormInitial: {
            $each: {
              name: {},
              question: {},
              typeLabel: {},
            },
          },
        };
      }
      return validations;
    },

    finalInspectionValidation() {
      let valdiations = {};
      if (this.workOrderDetail.workOrder.status == "Open") {
        if (this.finalInspectionSelection == "Create New Inspection Template") {
          valdiations = {
            questionTypeFormFinal: {
              $each: {
                name: { required, maxLength: maxLength(190) },
                question: { required, maxLength: maxLength(190) },
                typeLabel: { required },
              },
            },
          };
        } else {
          valdiations = {
            questionTypeFormFinal: {
              $each: {
                name: {},
                question: {},
                typeLabel: {},
              },
            },
          };
        }

        if (this.finalInspectionSelection === "Select Existing") {
          valdiations.finalInspectionByAssetCategory = { required };
        } else {
          valdiations.finalInspectionByAssetCategory = {};
        }
      } else {
        valdiations = {
          finalInspectionByAssetCategory: {},
          questionTypeFormFinal: {
            $each: {
              name: {},
              question: {},
              typeLabel: {},
            },
          },
        };
      }
      return valdiations;
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  updated() {
    this.setSidebarPos();
  },

  validations: function () {
    return {
      issuesSelected: { required },
      ...this.initialInspectionValidation(),
      ...this.finalInspectionValidation(),
    };
  },
  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.workOrderType = this.$route.params.type;
    if (this.$route.name === "work-order-details") {
      this.disableFields = true;
    }
    this.getCurrency();
    this.loaderFlag = true;
    this.workOrderUUID = this.$route.params.workuuid;
    this.getWorkOrder();
  },
};
</script>

<style lang="scss" scoped>
.items-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr) 32px 32px;
  grid-column-gap: 8px;
  align-items: center;
}

.multiple-choice-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr) 32px 32px;
  grid-column-gap: 8px;
  align-items: center;
}

.col-instruction-gap {
  display: grid;
  grid-template-columns: 1fr 16px;
  column-gap: 16px;
  align-items: center;
}

.finalInspection {
  border-top: 1px solid var(--very-light-pink);
}
.page-container {
  // display: flex;
  font-family: Euclid Circular B;
  color: #000;
  background-color: rgba(255, 255, 255, 0.5);
  margin-bottom: 32px;
}
.flex-container {
  position: relative;
  margin-top: 40px;
  display: flex;

  .data-sec {
    flex: 8;
    display: flex;
    flex-direction: column;
  }

  .empty-sec {
    flex: 1;
  }

  .info-sec {
    flex: 3;
    position: relative;
  }
  .row-col-gap {
    column-gap: 8px;
    row-gap: 16px;
  }
  table {
    margin-top: 24px;
    border-spacing: 0;
    font-size: 12px;
    line-height: 1.17;
    width: 100%;
    // white-space: nowrap;

    th {
      width: 14%;
      font-weight: bold;
      background: var(--secondary);
      color: #fff;
      padding: 16px;
      text-align: start;
    }

    td {
      padding: 16px;
      text-align: start;
    }

    tr:not(:first-child):hover {
      background-color: #e1e1e1;
    }
  }
  .c-grid {
    display: grid;
    grid-template-columns: 5fr 1fr;
    align-items: center;
  }
}
</style>
