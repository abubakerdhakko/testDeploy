<template>
  <div class="pt-32 pb-80">
    <div class="head-title">Create Work Order</div>
    <div class="subtitle pt-8"></div>

    <div class="main-page pt-32">
      <!-- SAccordion -->
      <div class="left-column">
        <SAccordion
          title="Basic Details*"
          expandIcon="arrows"
          :open="true"
          :border="false"
          padding="48"
          ref="basicDetailsAccordion"
          @state="basicDetailsAccordionFunction"
        >

          <div class="column-grid-2" v-padding="'48px'">
            <SSelect
              label="Asset Category*"
              v-model="workOrderSummary.category"
              :source="assetCategoryOptions"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              @selected="onSelectedAssetCategory"
              @clear="clearSelectedAssetCategory"
              :key="categoryIndex + 'category'"
              :disabled="disbablefield"
              :error="getFormErrorMessage($v.workOrderSummary.category)"
            />

            <SSelect
              label="Asset Name*"
              v-model="workOrderSummary.name"
              :source="assetNames"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              :key="assetIndex + 'assetName'"
              :noResultText="workOrderSummary.category==''?'No Result':'No Asset added under this category'"
              @selected="onSelectedAssetName"
              @clear="clearSelectedAssetName"
              :disabled="disbablefield"
              :error="getFormErrorMessage($v.workOrderSummary.name)"
            />
            <SSelect
              label="Priority*"
              v-model="workOrderSummary.priority"
              :source="priorityOptions"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              @clear="clearSelectedPriority"
              :key="assetIndex + 'priority'"
              :error="getFormErrorMessage($v.workOrderSummary.priority)"
            />

            <SSelect
              label="Shift*"
              v-model="workOrderSummary.shift"
              :source="shiftOptions"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              @clear="clearSelectedShift"
              :key="assetIndex + 'shift'"
              :error="getFormErrorMessage($v.workOrderSummary.shift)"
            />
            <SDatePicker
              label="Schedule*"
              :error="getFormErrorMessage($v.workOrderSummary.shedule)"
              v-model="workOrderSummary.shedule"
              :border="true"
            >
            </SDatePicker>
            <!-- @input="valdiateDate" -->
            <div></div>
          </div>
        </SAccordion>

        <SAccordion
          title="Issues*"
          expandIcon="arrows"
          :open="false"
          padding="48"
          :border="false"
          ref="issuesAccordion"
          @state="issuesAccordionFunction"
          dense
          class="mt-32"
        >
          <div class="issues">
            <!-- <span
              v-if="
                issuesArrayList.length === 0 && workOrderSummary.category == ''
              "
              v-padding="'16px 48px 16px 48px'"
              >Please select Asset Category</span
            >
            <span
              v-if="
                issuesArrayList.length == 0 && workOrderSummary.category != ''
              "
              v-padding="'16px 48px 16px 48px'"
              >No new issue against the selected Asset Category</span
            > -->
            <div
              v-if="$route.params.createWorkOrder !== true"
              v-padding="'16px 48px 16px 48px'"
            >
              <SMultipleSelect
                label="Issue Number*"
                :checkbox="true"
                :avatar="false"
                :data="issuesArrayList"
                :optionLabel="'name'"
                v-model="issuesSelected"
                @selected-values="onIssueNumberSelect"
                :error="getFormErrorMessage($v.issuesSelected)"
                :disabled="issuesArrayList.length == 0"
              />
              
              <span class="error-class ptWoEror"
              v-if="
                issuesArrayList.length === 0 && workOrderSummary.category
              "
                >Work Order already created against this category</span
              >
              <span class="error-class"
              v-if="
                issuesArrayList.length === 0 && !workOrderSummary.category
              "
                >Please Select Asset Category</span
              >

            </div>
            <div
              v-for="(issue, index) in workOrderSummary.issues"
              :key="index + 'issue'"
            >
              <div v-padding="'16px 48px 0px 48px'">
                <div v-grid="3" class="row-col-gap">
                  <div class="issue-title">{{ issue.issueNumber }}</div>
                  <div class="issue-title">{{ issue.reportedAt }}</div>
                </div>
                <div v-grid="3" class="row-col-gap">
                  <SInput label="Name*" v-model="issue.issueName" />
                  <SInput label="type* " v-model="issue.issueType" />
                  <SInput label="category*" v-model="issue.issueCategory" />
                </div>
                <div v-grid="1" class="mt-16">
                  <STextarea
                    :required="true"
                    v-model="issue.issueDescription"
                    label="Comments*"
                  >
                  </STextarea>
                </div>

                <div
                  class="col-Orderinstruction-gap pt-16"
                  v-for="(instruction,
                  instructionIndex) in issue.instructionChecklist"
                  :key="instructionIndex"
                >
                  <SInput
                    label="Your Checklist here*"
                    v-model="instruction.value"
                  />
                  <img
                    v-if="instructionIndex > 0"
                    width="16px"
                    style="cursor: pointer"
                    src="assets/icons/Delete.svg"
                    alt=""
                    @click="subInstruction(index, instructionIndex)"
                  />
                  <img
                    v-if="
                      instructionIndex === issue.instructionChecklist.length - 1
                    "
                    width="16px"
                    style="cursor: pointer"
                    src="assets/icons/Add.svg"
                    alt=""
                    @click="addInstruction(index)"
                  />
                </div>

                <div class="issues mt-16"></div>
                <div v-grid="2" class="row-col-gap mt-32">
                  <div>Parts</div>
                  <div style="text-align: right">
                    <img
                      width="16px"
                      style="cursor: pointer"
                      src="assets/icons/Add.svg"
                      alt=""
                      @click="addPart(index)"
                    />
                  </div>
                </div>
                <div
                  class="mt-16"
                  v-for="(part, k) in issue.parts"
                  :key="k + 'part'"
                >
                  <div v-grid="1" v-padding="'0px 8px 0px 8px'">
                    <SInput label="Part Name" v-model="part.name" />
                  </div>

                  <div class="parts-row mt-16">
                    <SInput
                      label="Quantity"
                      v-model="part.quantity"
                      type="number"
                      @input="QuantityChange(part.quantity)"
                      :class="quantityVal == true ? 'Q_Error':''"
                    />
                                          <!--  -->
                    <SInput
                      :label="'Unit Cost' + '(' + currency + ')'"
                      v-model="part.cost.amount"
                      type="number"
                      :class="costAmountVal == true ? 'Q_Error':''"
                      @input="costAmountChange(part.cost.amount)"
                    />
                    <SInput
                      :label="'Total Tax' + '(' + currency + ')'"
                      v-model="part.cost.taxAmount"
                      type="number"
                      :class="taxAmountVal == true ? 'Q_Error':''"
                      @input="taxAmountChange(part.cost.taxAmount)"
                    />

                    <SInput
                      :label="'Total' + '(' + currency + ')'"
                      :value="
                        (parseInt(part.quantity)
                          ? parseInt(part.quantity)
                          : 0) *
                          (parseInt(part.cost.amount)
                            ? parseInt(part.cost.amount)
                            : 0) +
                          (parseInt(part.cost.taxAmount)
                            ? parseInt(part.cost.taxAmount)
                            : 0)
                      "
                      readonly
                    />
                    <div>
                      <img
                        v-if="k > 0"
                        width="16px"
                        style="cursor: pointer"
                        src="assets/icons/Delete.svg"
                        alt=""
                        @click="removeParts(index, k)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="finalInspection mt-16"></div>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          title="User Assignments*"
          expandIcon="arrows"
          :open="false"
          padding="48"
          :border="false"
          ref="userAssignmentAccordion"
          @state="userAssignmentAccordionFunction"
          dense
          class="mt-32"
        >
          <div class="column-grid-2" :key="userReset" v-padding="'48px'">
            <SSelect
              label="User Group"
              v-model="workOrderSummary.userGroup"
              :source="userGroupOptions"
              resultsValue="groupName"
              resultsDisplay="groupName"
              :autocomplete="true"
              @selected="userGroupsHandler"
              @clear="clearSelectedUserGroup"
            />

            <SSelect
              label="User*"
              v-model="workOrderSummary.user"
              :source="userOptions"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="usersSelected"
              @clear="clearSelectedUser"
              :error="getFormErrorMessage($v.workOrderSummary.user)"
            />
          </div>
        </SAccordion>

        <SAccordion
          title="Initial Inspection*"
          expandIcon="arrows"
          :open="false"
          padding="48"
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
                :error="
                  getFormErrorMessage($v.initialInspectionByAssetCategory)
                "
                :source="inpsectionByAssetCategoryOptions"
                resultsValue="name"
                resultsDisplay="name"
                :autocomplete="true"
                @selected="initialInspectionByAssetCategorySelected"
                :key="initialAssetIndex + '_asset'"
              />
            </div>

            <div v-else class="mt-16">
              <SInput
                v-padding="'0px 48px 20px 48px'"
                label="Initial Inspection Template Title"
                v-model="workOrderSummary.initialInspectionTitle"
                :error="
                  getFormErrorMessage(
                    $v.workOrderSummary.initialInspectionTitle
                  )
                "
                v-if="checkExistingInitialInspection === false"
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
                    :key="updateSelectComp + 'answerType'"
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
                </div>
                <div class="" v-padding="'16px 48px 16px 48px'">
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
                <div class="finalInspection mt-16"></div>
              </div>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          title="Final Inspection*"
          expandIcon="arrows"
          :open="false"
          padding="48"
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
            :error="getFormErrorMessage($v.finalInspectionSelection)"
            :source="finalInspectionOptions"
            resultsValue="label"
            resultsDisplay="label"
            :autocomplete="false"
            @selected="finalInspectionOptionSelected"
            @clear="clearSelectedFinalInspectionOption"
            :key="finalInspectionReset + 'selectedOption'"
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
                :error="getFormErrorMessage($v.finalInspectionByAssetCategory)"
                :source="inpsectionByAssetCategoryOptions"
                resultsValue="name"
                resultsDisplay="name"
                :autocomplete="false"
                @selected="finalInspectionByAssetCategorySelected"
                @clear="clearSelectedFinalInspectionByAsset"
              />
            </div>
            <div v-else class="mt-16">
              <SInput
                v-padding="'0px 48px 16px 48px'"
                label="Final Inspection Template Title"
                v-model="workOrderSummary.finalInspectionTitle"
                :error="
                  getFormErrorMessage($v.workOrderSummary.finalInspectionTitle)
                "
              />
              <div class="finalInspection"></div>

              <div
                v-for="(final, index) in questionTypeFormFinal"
                :key="index + 'quest'"
              >
                <div
                  class="mt-16 column-grid-2"
                  v-padding="'0px 48px 0px 48px'"
                >
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
                <div class="items-row mt-16" v-padding="'16px 48px 16px 48px'">
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
      <div></div>
      <div class="right-column">
        <WorkOrderSidebar
          @create="createWorkOrder"
          :workOrderSummary="workOrderSummary"
        />
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
import WorkOrderSidebar from "../work-orders/components/WorkOrderSidebar";
import AssetPersonnelService from "../../services/AssetPersonnelService";
import InspectionService from "../../services/InspectionService";
import AssetManagementService from "../../services/AssetManagementService";
import WorkOrderService from "../../services/WorkOrderService";
import moment from "moment";
import { Functions } from "@/shared/Functions";
import { required, maxLength ,numeric, integer} from "vuelidate/lib/validators";

import loader from "@/components/Loader.vue";
export default {
  name: "CreateWorkOrder",

  components: {
    WorkOrderSidebar,
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
      updateSelectComp: 0,
      totalCost: 0,
      same: true,
      workOrderSummaryIndex: 0,
      initialAssetIndex: 0,
      inspectionReset: 0,
      finalInspectionReset: 0,
      userReset: 0,
      categoryIndex: 0,
      assetIndex: 0,
      issueIndex: 0,
      currentUserDetails: null,
      disbablefield: false,

      priorityOptions: [
        { label: "Low" },
        { label: "Medium" },
        { label: "High" },
      ],
      shiftOptions: [
        { label: "Morning" },
        { label: "Afternoon" },
        { label: "Evening" },
      ],
      selectedUserGroup: "",
      userGroupOptions: [],

      selectedUser: "",
      userOptions: [],
      allUsers: [],
      assets: null,
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
        { label: "Numeric", value: "Numeric" },
      ],
      questionTypeFormInitial: [],
      questionTypeFormFinal: [],
      orderInstructions: [
        {
          value: "",
        },
      ],
      assetCategoryOptions: [],
      allAssetData: [],
      assetNames: [],
      assetUUID: "",
      issuesArrayList: [],
      issuesSelected: [],
      finalInspectionOptions: [
        { label: "Same As Initial", value: "same" },
        { label: "Select Existing", value: "existing" },
        { label: "Create New Inspection Template", value: "createNew" },
      ],
      finalInspectionSelection: "Same As Initial",
      quantityVal: true,
      costAmountVal: true,
      taxAmountVal:true
    };
  },

  methods: {
    // valdiateDate() {
    //   let currentDate = `${new Date().getFullYear()}-${
    //     new Date().getMonth() + 1
    //   }-${new Date().getDate()}`;

    //   if (!moment(this.workOrderSummary.shedule).isSameOrAfter(currentDate)) {
    //     this.showToast("Please select current or future date", "error");
    //     return false;
    //   }
    // },
    QuantityChange(val){
      if(val == 0){
          this.showToast('Negative value not allowed', "error");
          this.quantityVal = true
      }else{
          this.quantityVal = false
      }
    },
    costAmountChange(val){
      if(val == 0){
          this.showToast('Negative value not allowed', "error");
          this.costAmountVal = true
      }else{
          this.costAmountVal = false
      }
    },
    taxAmountChange(val){

      if(val == 0){
          this.showToast('Negative value not allowed', "error");
          this.taxAmountVal = true
      }else{
          this.taxAmountVal = false
      }
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
      if (value === true) {
        this.questionTypeFormInitial = [];
        this.addInputFieldsInitial();
      } else {
        this.initialInspectionByAssetCategory = "";
        this.selectedInitialInspectionByAssetCategory = "";
        this.initialAssetIndex++;
      }
      this.workOrderSummaryIndex++;
    },

    getCurrency() {
      AssetPersonnelService.getCompanyCurrency(
        this.currentUserDetails.profile.organizationId
      ).then((response) => {
        this.currency = response.data.currency;
      });
    },

    finalInspectionOptionSelected(value) {
      this.workOrderSummary.finalInspectionTitle = "";
      this.workOrderSummary.selectedFinalInspectionByAssetCategory = "";
      this.questionTypeFormFinal = [];
      this.addInputFieldsFinal();
      this.finalInspectionByAssetCategory = [];
      this.selectedFinalInspectionByAssetCategory = "";
      if (value.value === "Same As Initial") {
        this.same = true;
        if (this.checkExistingInitialInspection) {
          this.workOrderSummary.selectedFinalInspectionByAssetCategory = this.workOrderSummary.selectedInitialInspectionByAssetCategory;
        } else {
          this.workOrderSummary.finalInspectionTitle = this.workOrderSummary.initialInspectionTitle;
        }
      } else {
        this.same = false;
      }
      this.workOrderSummaryIndex++;
    },

    clearSelectedFinalInspectionOption() {
      this.finalInspectionSelection = "";
      this.finalInspectionReset++;
    },

    onIssueNumberSelect(value) {
      this.workOrderSummary.issues = [];
      if (value.length > 0) {
        this.workOrderSummary.issues = value;
      }
    },
    getIssuesByAssetUUID(AssetUUID) {
      this.issuesArrayList = [];
      InspectionService.filterIssuesByAssetUUID(AssetUUID, "reported")
        .then((response) => {
          if (response.status === 200) {
            for (let issue of response.data.issues) {
              let part = {
                name: "",
                uuid: this.generateUUID(),
                quantity: 0,
                cost: {
                  category: "part-cost",
                  amount: 0,
                  taxAmount: 0,
                  reportable: true,
                },
                extraCost: [
                  {
                    category: "tax-cost",
                    amount: 0,
                    reportable: true,
                  },
                ],
              };

              issue.instructionChecklist = JSON.parse(
                issue.instructionChecklist
              );
              if (issue.instructionChecklist === null) {
                issue.instructionChecklist = [];
                issue.instructionChecklist.push({
                  value: "",
                });
              }
              issue.parts = [];
              issue.parts.push(part);
              issue.reportedAt = moment(issue.reportedAt).format("DD MMM YYYY");
              issue.name = issue.issueName + " - " + issue.issueNumber;
              this.issuesArrayList.push(issue);
            }
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
        });
    },

    onSelectedAssetCategory(value) {
      this.assetNames = [];
      for (let asset of this.allAssetData) {
        if (asset.categoryUUID === value.selectedObject.categoryUUID) {
          this.assetNames.push(asset);
        }
      }
      this.getInspectionTemaplatesByAssetCategory(
        value.selectedObject.categoryUUID
      );
      this.workOrderSummary.name = "";
      this.assetIndex++;
    },

    clearSelectedAssetCategory() {
      this.assetNames = [];
      this.workOrderSummary.category = "";
      this.workOrderSummary.name = "";
      this.categoryIndex++;
      this.assetIndex++;
    },

    onSelectedAssetName(value) {
      this.assetUUID = value.selectedObject.uuid;
      this.getIssuesByAssetUUID(this.assetUUID);
    },

    clearSelectedAssetName() {
      this.assetUUID = "";
      this.workOrderSummary.name = "";
      this.getIssuesByAssetUUID(this.assetUUID);
      this.assetIndex++;
    },

    clearSelectedPriority() {
      this.workOrderSummary.priority = "";
      this.assetIndex++;
    },

    clearSelectedShift() {
      this.workOrderSummary.shift = "";
      this.assetIndex++;
    },

    getAllCategories(currentUserDetails) {
      this.loaderFlag= true
      AssetManagementService.getAllAssetCategories(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          for (let category of res.data.categories) {
            let obj = {
              id: category.id,
              categoryUUID: category.uuid,
              label: category.name,
            };
            this.assetCategoryOptions.push(obj);
          }
          this.getAllAsset(currentUserDetails);
          if (this.$route.params.workuuid !== "") {
            this.assetDetailsfromStd(this.$route.params.workuuid);
          }
          this.loaderFlag= false
        })
        .catch((err) => {
          this.showToast(err.data.response, "error");
        });
    },

    getAllAsset(currentUserDetails) {
      let categoryUUID = "";
      AssetManagementService.getAllAssets(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          for (let asset of res.data.assets) {
            let obj = {
              uuid: asset.uuid,
              categoryUUID: asset.categoryUUID,
              label: asset.name,
              type: asset.type,
            };
            this.allAssetData.push(obj);
          }

          if (this.$route.params.createWorkOrder === true) {
            for (let asset_data of this.allAssetData) {
              if (this.$route.params.assetUUID === asset_data.uuid) {
                categoryUUID = asset_data.categoryUUID;
              }
            }

            for (let asset_option of this.assetCategoryOptions) {
              if (asset_option.categoryUUID === categoryUUID) {
                this.workOrderSummary.category = asset_option.label;
              }
            }

            for (let assetData of this.allAssetData) {
              if (assetData.categoryUUID === categoryUUID) {
                this.assetNames.push(assetData);
              }
            }
            for (let asset_name of this.assetNames) {
              if (asset_name.uuid === this.$route.params.assetUUID) {
                this.workOrderSummary.name = asset_name.label;
              }
            }
            this.categoryIndex++;
            this.assetIndex++;
          }
        })
        .catch((err) => {
          this.showToast(err.data.response, "error");
        });
    },

    basicDetailsAccordionFunction() {
      if (this.$refs.basicDetailsAccordion.openFlag === true) {
        this.$refs.finalInspectionsAccordion.openFlag = false;
        this.$refs.userAssignmentAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.inspectionsAccordion.openFlag = false;
      }
    },
    userAssignmentAccordionFunction() {
      if (this.$refs.userAssignmentAccordion.openFlag === true) {
        this.$refs.basicDetailsAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.inspectionsAccordion.openFlag = false;
        this.$refs.finalInspectionsAccordion.openFlag = false;
      }
    },
    issuesAccordionFunction() {
      if (this.$refs.issuesAccordion.openFlag === true) {
        this.$refs.basicDetailsAccordion.openFlag = false;
        this.$refs.userAssignmentAccordion.openFlag = false;
        this.$refs.inspectionsAccordion.openFlag = false;
        this.$refs.finalInspectionsAccordion.openFlag = false;
      }
    },
    inspectionsAccordionFunction() {
      if (this.$refs.inspectionsAccordion.openFlag === true) {
        this.$refs.basicDetailsAccordion.openFlag = false;
        this.$refs.userAssignmentAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.finalInspectionsAccordion.openFlag = false;
      }
    },
    finalInspectionsAccordionFunction() {
      if (this.$refs.finalInspectionsAccordion.openFlag === true) {
        this.$refs.basicDetailsAccordion.openFlag = false;
        this.$refs.userAssignmentAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.inspectionsAccordion.openFlag = false;
      }
    },
    createWorkOrder() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }

      if (this.issuesSelected.lenght < 0) {
        this.showToast("Please select an issue", "warning");
        return;
      }

      this.loaderFlag = true;
      let workOrder = {};
      let resolutions = [];
      let issues = [];
      let tempOrder = [];
      let orderJson = null;
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
      let createWorkOrderRequest = {};

      for (let work_order_issue of this.workOrderSummary.issues) {
        let issue = {};
        let resolution = {};
        resolution.uuid = this.generateUUID();
        resolution.partsUsed = [];
        work_order_issue.parts.map((part) => {
          let partObject = part;
          partObject.partName = part.name;
          partObject.issueUUID = work_order_issue.uuid;
          partObject.partUUID = "dummy-part-uuid-link-with-inventory";
          partObject.addedByUserName =
            this.currentUserDetails.profile.firstName +
            " " +
            this.currentUserDetails.profile.lastName;
          partObject.addedByUserUUID = this.currentUserDetails.profile.userid;
          partObject.cost.adedByUserName = partObject.addedByUserName;
          partObject.cost.addedByUserUUID = partObject.addedByUserUUID;
          partObject.cost.issueUUID = work_order_issue.uuid;
          resolution.partsUsed.push(partObject);
          return part;
        });

        resolutions.push(resolution);
        issue.issueNumber = work_order_issue.issueNumber;
        issue.issueUUID = work_order_issue.uuid;
        issue.resolved = false;
        issue.inspectionUUID = work_order_issue.inspectionUUID;
        issue.serviceUUID = work_order_issue.serviceUUID;
        issue.instructions = work_order_issue.issueDescription;
        issue.resolutionUUID = resolution.uuid;
        issue.status = work_order_issue.status;
        work_order_issue.instructionChecklist.map((element) => {
          tempOrder.push({ name: element.value, checked: false });
          orderJson = JSON.stringify(tempOrder);
          issue.orderInstructions = orderJson;
        });
        issues.push(issue);
        orderJson = null;
        tempOrder = [];
      }

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
        };
        initialInspectionOption = "save";
        fromInspectionInitial = false;
      } else {
        fromInspectionInitial = true;
      }

      // if (initialInspectionTemplate) {
      // 	//	finalInspectionTemplate = initialInspectionTemplate;
      // } else {
      // 	fromInspectionFinal = fromInspectionInitial;
      // }

      // finalInspectionOption = initialInspectionOption;

      if (this.questionTypeFormFinal.length > 0) {
        finalInspectionTemplate = {
          name: this.workOrderSummary.finalInspectionTitle,
          inspectionItems: this.questionTypeFormFinal,
        };
        finalInspectionOption = "save";
        fromInspectionFinal = false;
      } else {
        fromInspectionFinal = true;
      }

      workOrder.planning = {
        userGroupUUID: this.selectedUserGroup
          ? this.selectedUserGroup.groupUUID
          : null,
        userGroupName: this.selectedUserGroup
          ? this.selectedUserGroup.groupName
          : null,
        fromInspectionInitial: fromInspectionInitial,
        fromInspectionFinal: fromInspectionFinal,
      };
      if (this.sameAsInitialInspection) {
        workOrder.planning.sameInspection = true;
      }

      if (workOrder.planning.fromInspectionInitial) {
        if (this.selectedInitialInspectionByAsset !== null) {
          workOrder.planning.initialInspectionUUID = this.selectedInitialInspectionByAsset.value;
        } else if (this.selectedInitialInspectionByAssetCategory !== null) {
          workOrder.planning.initialInspectionUUID = this.selectedInitialInspectionByAssetCategory.value;
        } else {
          workOrder.planning.initialInspectionUUID = this.selectedFinalInspectionByWorkOrder.value;
        }
      }

      if (workOrder.planning.fromInspectionFinal) {
        if (this.sameAsInitialInspection) {
          workOrder.planning.finalInspectionUUID =
            workOrder.planning.initialInspectionUUID;
        } else {
          if (this.selectedFinalInspectionByAsset !== null) {
            workOrder.planning.finalInspectionUUID = this.selectedFinalInspectionByAsset.value;
          } else if (this.selectedFinalInspectionByAssetCategory !== null) {
            workOrder.planning.finalInspectionUUID = this.selectedFinalInspectionByAssetCategory.value;
          } else {
            workOrder.planning.finalInspectionUUID = this.selectedFinalInspectionByWorkOrder.value;
          }
        }
      }

      if (this.checkExistingInitialInspection) {
        workOrder.planning.fromExistingInitial = true;
        workOrder.planning.fromInspectionInitial = false;
        workOrder.planning.initialInspectionUUID = this.initialInspectionTemp.uuid;
      } else {
        workOrder.planning.initialInspectionUUID = null;
      }

      if (this.finalInspectionSelection === "Select Existing") {
        workOrder.planning.fromExistingFinal = true;
        workOrder.planning.fromInspectionInitial = false;
        workOrder.planning.finalInspectionUUID = this.selectedFinalInspectionByAssetCategory.uuid;
      } else {
        workOrder.planning.finalInspectionUUID = null;
      }

      if (
        this.finalInspectionSelection === "Same As Initial" &&
        this.checkExistingInitialInspection == true
      ) {
        workOrder.planning.finalInspectionUUID = this.initialInspectionTemp.uuid;
        workOrder.planning.fromExistingFinal = true;
      }

      if (
        workOrder.planning.initialInspectionUUID ===
        workOrder.planning.finalInspectionUUID
      ) {
        workOrder.planning.sameInspection = true;
      } else if (
        workOrder.planning.initialInspectionUUID == null ||
        workOrder.planning.finalInspectionUUID == null
      ) {
        workOrder.planning.sameInspection = false;
      }
      if (this.selectedUser) {
        workOrder.assignedToUserName = this.selectedUser.name;
        workOrder.assignedToUserUUID = this.selectedUser.uuid;
      }
      if (workOrder.assignedToUserName) {
        workOrder.assignees = [
          {
            uuid: workOrder.assignedToUserUUID,
            name: workOrder.assignedToUserName,
          },
        ];
      } else {
        let response = AssetPersonnelService.getUserGroupByUUID(
          this.selectedUserGroup.selectedObject.groupUUID
        );
        if (response.status === 200) {
          workOrder.assignees = [];
          response.data.userGroup.users.map((user) => {
            workOrder.assignees.push({
              uuid: user.uuid,
              name: user.firstName + " " + user.lastName,
            });
            return user;
          });
        }
      }
      workOrder.priority = this.workOrderSummary.priority;
      workOrder.schedule = moment(this.workOrderSummary.shedule);
      workOrder.assetUUID = this.workOrderSummary.issues[0].assetUUID;
      workOrder.assetName = this.workOrderSummary.name;
      workOrder.tenantUUID = this.currentUserDetails.profile.organizationId;
      workOrder.status = this.workOrderSummary.issues[0].status;
      workOrder.shift = this.workOrderSummary.shift;

      workOrder.issues = issues;
      createWorkOrderRequest.workOrder = workOrder;

      if (this.checkExistingInitialInspection === true) {
        createWorkOrderRequest.initialInspectionTemplate = null;
      } else {
        createWorkOrderRequest.initialInspectionTemplate = initialInspectionTemplate;
        workOrder.planning.fromExistingInitial = false;
        workOrder.planning.fromInspectionInitial = false;
      }

      if (this.finalInspectionSelection === "Create New Inspection Template") {
        createWorkOrderRequest.finalInspectionTemplate = finalInspectionTemplate;
        workOrder.planning.fromExistingFinal = false;
        workOrder.planning.fromInspectionFinal = false;
        workOrder.planning.sameInspection = false;
      } else if (
        this.finalInspectionSelection === "Same As Initial" &&
        this.checkExistingInitialInspection !== true
      ) {
        createWorkOrderRequest.finalInspectionTemplate = initialInspectionTemplate;
        workOrder.planning.fromExistingFinal =
          workOrder.planning.fromExistingInitial;
        workOrder.planning.fromInspectionFinal =
          workOrder.planning.fromInspectionInitial;
      } else if (this.finalInspectionSelection === "Select Existing") {
        createWorkOrderRequest.finalInspectionTemplate = null;
        workOrder.planning.sameInspection = false;
      } else {
        createWorkOrderRequest.finalInspectionTemplate = null;
      }

      createWorkOrderRequest.initialInspectionOption = initialInspectionOption;
      createWorkOrderRequest.finalInspectionOption = finalInspectionOption;
      createWorkOrderRequest.initialInspectionTemplateLinkingUUID = initialInspectionTemplateLinkingUUID;
      createWorkOrderRequest.finalInspectionTemplateLinkingUUID = finalInspectionTemplateLinkingUUID;
      createWorkOrderRequest.initialLinkInspectionType = initialLinkInspectionType;
      createWorkOrderRequest.finalLinkInspectionType = finalLinkInspectionType;
      createWorkOrderRequest.resolutions = resolutions;

      WorkOrderService.addWorkOrder(
        createWorkOrderRequest,
        this.currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (response) {
            this.loaderFlag = false;
            this.$router.push({
              name: "work-order",
              params: {
                toastFlag: true,
                toastType: "success",
                message: response.data.description,
              },
            });
          }
        })
        .catch((error) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast(error.data.response, "error");
          }
        });
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    addInstruction(index) {
      this.workOrderSummary.issues[index].instructionChecklist.push({
        value: "",
      });
    },

    subInstruction(index, instructionIndex) {
      this.workOrderSummary.issues[index].instructionChecklist.splice(
        instructionIndex,
        1
      );
    },

    usersSelected(value) {
      this.selectedUser = value.selectedObject;
    },

    clearSelectedUser() {
      this.workOrderSummary.user = "";
      this.selectedUser = "";
      this.userReset++;
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
      this.workOrderSummary.selectedFinalInspectionByAssetCategory = this.selectedFinalInspectionByAssetCategory;
      this.finalInspectionByAsset = "";
      this.selectedFinalInspectionByAsset = "";
      this.finalInspectionByWorkOrder = "";
      this.selectedFinalInspectionByWorkOrder = "";
      this.finalInspectionReset++;
    },

    clearSelectedFinalInspectionByAsset() {
      this.finalInspectionByAssetCategory = "";
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
      this.workOrderSummary.selectedInitialInspectionByAssetCategory = this.selectedInitialInspectionByAssetCategory;
      this.initialInspectionByAsset = "";
      this.selectedInitialInspectionByAsset = "";
      this.initialInspectionByWorkOrder = "";
      this.selectedInitialInspectionByWorkOrder = "";
      this.inspectionReset++;
    },

    initialInspectionByWorkOrderSelected(value) {
      this.selectedInitialInspectionByWorkOrder = value.selectedObject;
      this.initialInspectionByAsset = "";
      this.selectedInitialInspectionByAsset = "";
      this.initialInspectionByAssetCategory = "";
      this.selectedInitialInspectionByAssetCategory = "";
      this.inspectionReset++;
    },

    getIssueByUUID(issueUUIDS) {
      issueUUIDS.map((issueuuid, index) => {
        InspectionService.getIssueByUUID(issueuuid)
          .then((response) => {
            if (response.status === 200) {
              let part = {
                name: "",
                uuid: this.generateUUID(),
                quantity:0,
                cost: {
                  category: "part-cost",
                  amount: 0,
                  reportable: true,
                },
                extraCost: [
                  {
                    category: "tax-cost",
                    amount: 0,
                    reportable: true,
                  },
                ],
              };
              response.data.issueReporting.instructionChecklist = JSON.parse(
                response.data.issueReporting.instructionChecklist
              );
              if (response.data.issueReporting.instructionChecklist === null) {
                response.data.issueReporting.instructionChecklist = [];
                response.data.issueReporting.instructionChecklist.push({
                  value: "",
                });
              }

              response.data.issueReporting.parts = [];
              response.data.issueReporting.parts.push(part);
              response.data.issueReporting.reportedAt = moment(
                response.data.issueReporting.reportedAt
              ).format("DD MMM YYYY");

              this.workOrderSummary.issues.push(response.data.issueReporting);
              if (index === 0) {
                this.getAsset(this.workOrderSummary.issues[index].assetUUID);
              }
            }
          })
          .catch((error) => {
            this.showToast(error.data.response, "error");
          });
      });
    },

    getAsset(uuid) {
      AssetManagementService.getAssetWithDetails(uuid, true, true).then(
        (response) => {
          this.assets = response.data.assetDetail;
          this.getInspectionTemplates(
            uuid,
            this.currentUserDetails.profile.organizationId
          );
          this.getInspectionTemplateFromWorkOrder(
            this.currentUserDetails.profile.organizationId
          );
          this.getInspectionTemaplatesByAssetCategory(
            this.assets.category.uuid
          );
        }
      );
    },

    getUsersGroup(tenantUUID) {
      AssetPersonnelService.getAllUserGroup(tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            this.userGroupOptions = response.data.groups;
            this.userGroupOptions.push({
              groupUUID: "All",
              groupName: "All",
            });
          }
        })
        .catch((error) => {
          if (error) {
            this.showToast(error.data.response, "error");
          }
        });
    },

    getAllUsers(tenantUUID) {
      AssetPersonnelService.getAllUsers(tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            this.allUsers = response.data.users;
            this.userOptions = response.data.users;
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
        });
    },

    userGroupsHandler(data) {
      this.selectedUserGroup = data.selectedObject;
      if (data.selectedObject.groupName === "All") {
        this.userOptions = this.allUsers;
      } else {
        this.user = "";
        AssetPersonnelService.getUserGroupByUUID(
          data.selectedObject.groupUUID
        ).then((response) => {
          this.userOptions = [];
          this.user = "";
          this.userOptions = response.data.userGroup.users;
        });
      }
      this.user = "";
      this.workOrderSummary.user = "";
      this.userReset++;
    },

    clearSelectedUserGroup() {
      this.workOrderSummary.userGroup = "";
      this.userOptions = this.allUsers;
      this.userReset++;
    },

    getInspectionTemplates(assetUUID, tenantUUID) {
      InspectionService.getInspectionTemplateNameAndUUID(assetUUID, tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            this.inspectionByAssetOptions = response.data.inspections;
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
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
          this.showToast(error.data.response, "error");
        });
    },

    getInspectionTemaplatesByAssetCategory(categoryUUID) {
      InspectionService.getInspectionTemplateNameAndUUIDByCategoryUUID(
        categoryUUID
      )
        .then((response) => {
          if (response.status === 200) {
            this.inpsectionByAssetCategoryOptions = response.data.inspections;
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
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

    clearSelectedAnswer(index) {
      this.questionTypeFormInitial[index].typeLabel = "";
      this.updateSelectComp++;
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
    addPart(index) {
      let issues = this.workOrderSummary.issues;
      let part = {
        name: "",
        uuid: this.generateUUID(),
        quantity: 0,
        cost: {
          category: "part-cost",
          amount: 0,
          reportable: true,
        },
        extraCost: [
          {
            category: "tax-cost",
            amount: 0,
            reportable: true,
          },
        ],
      };

      issues[index].parts.push(part);

      this.workOrderSummary.issues = issues;
    },

    removeParts(index, k) {
      {
        let part = this.workOrderSummary.issues[index].parts;
        part.splice(k, 1);
      }
    },
    assetDetailsfromStd(uuid) {
      if (uuid !== undefined) {
        AssetManagementService.getAsset(uuid).then((res) => {
          this.workOrderSummary.name = res.data.asset.name;

          if (this.assetCategoryOptions !== "") {
            for (let asset_category of this.assetCategoryOptions) {
              if (asset_category.categoryUUID === res.data.categoryId) {
                this.workOrderSummary.category = asset_category.label;
              }
            }
          }
          this.getIssuesByAssetUUID(res.data.asset.uuid);
          this.assetIndex++;
          this.categoryIndex++;
        });
      }
    },

    initialInspectionValidation() {
      let validations = {};
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
      return validations;
    },

    workOrderValidation() {
      let validations = {};
      if (
        !this.checkExistingInitialInspection &&
        this.finalInspectionSelection == "Create New Inspection Template"
      ) {
        validations = {
          workOrderSummary: {
            priority: { required },
            shift: { required },
            shedule: { required },
            user: { required },
            category: { required },
            name: { required },
            initialInspectionTitle: { required, maxLength: maxLength(190) },
            finalInspectionTitle: { required, maxLength: maxLength(190) },
          },
        };
      } else if (
        this.checkExistingInitialInspection &&
        this.finalInspectionSelection == "Create New Inspection Template"
      ) {
        validations = {
          workOrderSummary: {
            priority: { required },
            shift: { required },
            shedule: { required },
            user: { required },
            category: { required },
            name: { required },
            initialInspectionTitle: {},
            finalInspectionTitle: { required },
          },
        };
      } else if (
        !this.checkExistingInitialInspection &&
        this.finalInspectionSelection !== "Create New Inspection Template"
      ) {
        validations = {
          workOrderSummary: {
            priority: { required },
            shift: { required },
            shedule: { required },
            user: { required },
            category: { required },
            name: { required },
            initialInspectionTitle: { required },
            finalInspectionTitle: {},
          },
        };
      } else {
        validations = {
          workOrderSummary: {
            priority: { required },
            shift: { required },
            shedule: { required },
            user: { required },
            category: { required },
            name: { required },
            initialInspectionTitle: {},
            finalInspectionTitle: {},
          },
        };
      }
      return validations;
    },

    finalInspectionValidation() {
      let valdiations = {};
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

      return valdiations;
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  watch: {
    quantityVal:function(){
      if(this.quantityVal == true){
          // decrement background-e1e1e1
      }
    }
  },
  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getCurrency();
    this.getAllCategories(this.currentUserDetails);
    this.getUsersGroup(this.currentUserDetails.profile.organizationId);
    this.getAllUsers(this.currentUserDetails.profile.organizationId);

    if (this.$route.params.createWorkOrder) {
      this.disbablefield = true;
      this.issuesSelected = this.$route.params.issueuuid;
      this.getIssueByUUID(this.$route.params.issueuuid);
    }
    if (this.$route.params.asset) {
      this.workOrderSummary.name = this.$route.params.asset.name;
      this.workOrderSummary.category = this.$route.params.asset.category;
    }
    this.addInputFieldsInitial();
    this.addInputFieldsFinal();
  },

  validations: function() {
    return {
      ...this.workOrderValidation(),
      ...this.initialInspectionValidation(),
      ...this.finalInspectionValidation(),
      finalInspectionSelection: { required },
      issuesSelected: { required },
      part:{
        quantity:{numeric}
      }
          
      
      /* issues:{
			$each:{
				issueName:{required},
			},
		},*/
    };
  },
};
</script>

<style lang="scss" scoped>
.right-column {
  .card {
    border: 1px solid var(--very-light-pink);
  }
}
.parts-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 16px;
  grid-column-gap: 8px;
  align-items: center;
}
.inspection-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 16px;
  grid-column-gap: 8px;
  align-items: center;
}
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

.padding-30 {
  padding: 10px;
}
.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;
}
.row-col-gap {
  column-gap: 8px;
  row-gap: 16px;
}
.mt-32 {
  margin-top: 32px;
}
.issues {
  border-top: 1px solid var(--very-light-pink);
}
.issue-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}
.col-instruction-gap {
  display: grid;
  grid-template-columns: 1fr 16px;
  column-gap: 16px;
  align-items: center;
}
.col-Orderinstruction-gap {
  display: grid;
  grid-template-columns: 1fr 16px 16px;
  column-gap: 16px;
  align-items: center;
}
.finalInspection {
  border-top: 1px solid var(--very-light-pink);
}

.error-class {
  font-size: 12px;
  color: red;
  padding: 48px 24px;
}
</style>
