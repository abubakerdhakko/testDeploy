<template>
  <div class="pt-32 pb-80">
    <div class="head-title">
      {{ issues.issueName }} - {{ issues.issueNumber }}
    </div>
    <div class="subtitle pt-8">View all the information related to a Issue</div>

    <div class="main-page pt-32">
      <div>
        <SAccordion
          v-if="
            issues.status == 'reported' ||
            issues.status == 'ignored' ||
            issues.status == 'Resolved' ||
            issues.status == 'inprogress'
          "
          title="Issue Details"
          expandIcon="arrows"
          :open="openFlag"
          :border="false"
          padding="32"
          ref="issueDetailsAccordion"
          @state="issueDetailsAccordionFunction"
          :key="categoryIndex + 'acc'"
        >
          <div
            class="items-row row-col-gap"
            v-padding="'16px 32px 16px 32px'"
            :key="issueIndex"
          >
            <SInput
              label="Issue Name"
              v-model="issues.issueName"
              :error="getFormErrorMessage($v.issues.issueName)"
              :disabled="fieldsDisable"
            />
            <SSelect
              label="Priority"
              v-model="issues.priority"
              :source="priorityOptions"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              :error="getFormErrorMessage($v.issues.priority)"
              :disabled="fieldsDisable"
              @clear="clearSelectedPriority"
              :key="issueCategoryIndex + 'priority'"
            />
            <SSelect
              label="Issue Category"
              v-model="issues.issueCategory"
              :error="getFormErrorMessage($v.issues.issueCategory)"
              :source="categoryOptions"
              resultsValue="value"
              resultsDisplay="label"
              :autocomplete="true"
              @selected="selectCate"
              :disabled="fieldsDisable"
              @clear="clearSelectedCategory"
              :key="issueCategoryIndex + 'cate'"
            />

            <SSelect
              label="Issue type"
              v-model="issues.issueType"
              :source="typeOptions"
              resultsValue="value"
              resultsDisplay="label"
              :autocomplete="true"
              :error="getFormErrorMessage($v.issues.issueType)"
              :disabled="fieldsDisable"
              @clear="clearSelectedCategortType"
              :key="issueCategoryIndex + 'type'"
            />

            <SInput
              v-if="issues.ignoredBy !== null"
              label="Ignored By"
              v-model="issues.ignoredBy"
              readonly
              :disabled="fieldsDisable"
            />
            <SSelect
              v-if="issues.status !== ''"
              label="Status"
              v-model="issues.status"
              :source="statusOptions"
              resultsValue="value"
              resultsDisplay="label"
              :autocomplete="true"
              :disabled="fieldsDisable"
            />
            <SInput
              :label="'Issue Cost (' + currency + ')'"
              v-model="totalWorkOrderCosts"
              :key="updateCostIndex + 'cost'"
              :disabled="true"
            />

            <STextarea
              v-if="issues.status === 'ignored'"
              label="Ignored Comments"
              v-model="issues.ignoreComments"
              readonly
              type="TextArea"
              :disabled="fieldsDisable"
            />
            <STextarea
              v-if="issues.issueDescription"
              label="Comments"
              v-model="issues.issueDescription"
              type="TextArea"
              :disabled="fieldsDisable"
            />
          </div>
        </SAccordion>

        <SAccordion
          v-if="
            issues.status == 'reported' ||
            issues.status == 'ignored' ||
            issues.status == 'Resolved' ||
            issues.status == 'inprogress'
          "
          title="Asset Details"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="assetDetailsAccordion"
          @state="assetDetailAccordionFunction"
          class="mt-32"
        >
          <div
            class="items-row row-col-gap"
            v-padding="'16px 32px 16px 32px'"
            :key="categoryIndex"
          >
            <SSelect
              label="Asset Category"
              v-model="issues.assetCategory"
              :source="assetCategoryOptions"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              @selected="onSelectedAssetCategory"
              :disabled="assetFieldsDisable"
              :key="categoryIndex + 'assetcate'"
              @clear="onClearAssetCate"
            />

            <SSelect
              label="Asset Name"
              v-model="issues.assetName"
              :source="assetNames"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              @selected="onSelectedAssetName"
              :disabled="assetFieldsDisable"
              :key="categoryIndex + 'assetName'"
              @clear="onClearAsset"
            />

            <SInput
              label="manufacture"
              v-model="manufacture"
              :disabled="true"
              :key="categoryIndex + 'assteMenufecturer'"
            />
          </div>
        </SAccordion>

        <SAccordion
          v-if="
            issues.status == 'reported' && issues.inpectionItemsUUID !== null
          "
          title="Inspection Details"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="inspectionDetailsAccordion"
          @state="inspectionDetailsAccordionFunction"
          class="mt-32"
        >
          <div class="createBtn">
            <SButton
              title="Create Inspection Template"
              pill
              outline
              v-padding-top="5"
              small
              @click="openCreateInspectionTemplate()"
              v-width="200"
              style="
                float: right;
                margin-bottom: 10px;
                margin-top: 10px;
                margin-right: 30px;
              "
            ></SButton>
          </div>

          <div v-padding="'16px 32px 16px 32px'">
            <table :key="partTable">
              <tr>
                <th>Inspection Number</th>
                <th>Inspection Name</th>
                <th>inspection Type</th>
                <th>Created At</th>
                <th>Inspected By</th>
                <th>Status</th>
                <th>View Action</th>
                <th>Archive Action</th>
              </tr>
              <tr v-for="(issue, index) in inspectionIssue" :key="index">
                <td>{{ issue.inspectionNumber }}</td>
                <td>{{ issue.name }}</td>
                <td>{{ issue.inspectionType }}</td>
                <td>{{ issue.createdAt | date }}</td>
                <td>
                  {{ issue.submittedByUserName }}
                </td>
                <td>
                  {{ issue.status }}
                </td>
                <td>
                  <img
                    src="/assets/icons/Results.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer; margin-left: 16px"
                    @click="ViewInspection(issue.uuid)"
                  />
                </td>
                <td>
                  <img
                    src="/assets/icons/delete_outline.png"
                    alt=""
                    width="27px"
                    style="cursor: pointer; margin-left: 16px"
                    @click="archiveInspection(issue.uuid)"
                  />
                </td>
              </tr>
            </table>
          </div>
        </SAccordion>

        <SAccordion
          title="Parts & Cost"
          v-if="issues.status == 'Resolved'"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="partsDetailsAccordion"
          @state="partsDetailsAccordionFunction"
          class="mt-32"
        >
          <div v-margin-top="24" class="header bold c-grid">
            <SToggle
              v-model="selectedTab"
              :options="[
                { label: 'Parts', value: 'parts' },
                { label: 'Costs', value: 'costs' },
              ]"
              :tabs="true"
              :background="'#ffffff'"
            />
            <SButton
              v-if="selectedTab === 'parts'"
              title="Add Part"
              @click="addFunction"
              pill
              small
            />
            <SButton v-else title="Add Cost" @click="addFunction" pill small />
          </div>

          <div v-padding="'16px 32px 16px 32px'">
            <table v-if="selectedTab === 'parts'" :key="partTable">
              <tr>
                <th>Name</th>
                <th>Qty.</th>
                <th>Unit Cost ({{ currency }}})</th>
                <th>Total Tax ({{ currency }}})</th>
                <th>Total Cost ({{ currency }}})</th>
                <th>Action</th>
              </tr>
              <tr v-for="(part, index) in parts" :key="index">
                <td>{{ part.partName }}</td>
                <td>{{ part.quantity }}</td>
                <td>{{ part.cost.amount }}</td>
                <td>{{ part.cost.taxAmount }}</td>
                <td>
                  {{ part.quantity * part.cost.amount + part.cost.taxAmount }}
                </td>
                <td>
                  <img
                    src="/assets/icons/Edit.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer"
                    @click="editPart(part)"
                  />
                  <img
                    src="/assets/icons/Delete.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer; margin-left: 16px"
                    @click="deletePart(part)"
                  />
                </td>
              </tr>
            </table>

            <table v-if="selectedTab === 'costs'" :key="costTable">
              <tr>
                <th>Cost Category</th>
                <th>Unit Cost ({{ currency }}})</th>
                <th>Qty.</th>
                <th>Total Tax ({{ currency }}})</th>
                <th>total Cost ({{ currency }}})</th>
                <th>Action</th>
              </tr>
              <tr v-for="(cost, index) in costs" :key="index">
                <td>{{ cost.category }}</td>
                <td>{{ cost.amount }}</td>
                <td>{{ cost.costQuantity }}</td>
                <td>{{ cost.taxAmount }}</td>
                <td>{{ cost.costQuantity * cost.amount + cost.taxAmount }}</td>

                <td>
                  <img
                    src="/assets/icons/Edit.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer"
                    @click="editCost(cost)"
                  />
                  <img
                    src="/assets/icons/Delete.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer; margin-left: 16px"
                    @click="deleteCost(cost)"
                  />
                </td>
              </tr>
            </table>
          </div>
          <AddPart
            v-if="addPartsDialog"
            :issueUUID="issueUUID"
            :currency="currency"
            :workOrder="issueWorkOrder"
            :type="partType"
            :parts="part"
            @close="closeDialog"
            @UpdatePart="UpdatePart"
            @createPart="createPart"
          />

          <AddCost
            v-if="addCostsDialog"
            :issueUUID="issueUUID"
            :workOrder="issueWorkOrder"
            :currency="currency"
            :type="costType"
            :costs="cost"
            @close="closeDialog"
            @updateCost="updateCost"
            @createCost="createCost"
          />
        </SAccordion>
        <SAccordion
          v-if="
            issues.status == 'reported' ||
            issues.status == 'ignored' ||
            issues.status == 'Resolved' ||
            issues.status == 'inprogress'
          "
          title="Attachments*"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="attachmentsDetailsAccordion"
          @state="attachmentsDetailsAccordionFunction"
          class="mt-32"
        >
          <div
            v-padding="'0px 32px 0px 32px'"
            style="
              font-weight: bold;
              font-size: 14px;
              margin-top: 16px;
              margin-bottom: 16px;
            "
          >
            Gallery
          </div>
          <div
            v-for="(image, index) in imageVoices"
            :key="index + '_image'"
            v-padding="'0px 32px 0px 32px'"
            style="float: left"
          >
            <img
              v-if="image.imageFlag"
              :src="'data:image/png;base64,' + image.content"
              style="width: 100px; height: 100px"
              @click="fullscreenImage(image)"
              alt=""
            />
            <img
              src="/assets/icons/Delete.svg"
              alt=""
              width="20px"
              style="cursor: pointer; margin-left: 10px; margin-bottom: 80px"
              @click="deleteIssueImage(image.uuid)"
              v-if="!$route.params.flag"
            />
            <SDialog
              title=""
              :width="700"
              :persistent="false"
              :closeIcon="true"
              @close="close"
              v-show="imageDialog"
            >
              <img
                v-if="popupImage.imageFlag"
                :src="'data:image/png;base64,' + popupImage.content"
                style="width: 100%; height: auto"
                alt=""
              />
            </SDialog>
          </div>
          <div class="filePickerRow" v-padding="'16px 32px 16px 0'">
            <SFilePicker
              :disabled="fieldsDisable"
              v-on:input="receiveDocument"
              v-model="fileRecord"
              v-if="!$route.params.flag"
            />
          </div>
        </SAccordion>
        <SAccordion
          v-if="
            issueWorkOrder.workOrderNumber !== null &&
            issueWorkOrder.status !== 'ignored'
          "
          title="Related Work Order"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="relatedWorkOrderDetailsAccordion"
          @state="relatedWorkOrderDetailsAccordionFunction"
          class="mt-32"
        >
          <div v-padding="'16px 32px 16px 32px'">
            <table :key="partTable">
              <tr>
                <th>WorkOrder Number</th>
                <th>Created At</th>
                <th>Priority</th>
                <th>Assign to</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              <tr>
                <td>{{ issueWorkOrder.workOrderNumber }}</td>
                <td>{{ issueWorkOrder.createdAt }}</td>
                <td>{{ issueWorkOrder.priority }}</td>
                <td>{{ issueWorkOrder.assignedToUserName }}</td>
                <td>
                  {{ issueWorkOrder.status }}
                </td>
                <td>
                  <img
                    src="/assets/icons/Results.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer"
                    @click="viewWorkOrder(issueWorkOrder.uuid)"
                  />
                </td>
              </tr>
            </table>
          </div>
        </SAccordion>
        <SAccordion
          v-if="
            issues.status == 'reported' ||
            issues.status == 'ignored' ||
            issues.status == 'Resolved' ||
            issues.status == 'inprogress'
          "
          title="Related Issues"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="relatedIssueDetailsAccordion"
          @state="relatedIssueDetailsAccordionFunction"
          class="mt-32"
        >
          <span v-padding="'16px 32px 0 32px'" v-if="assetIssues != ''"
            ><b>Asset Related Issues</b></span
          >
          <div v-padding="'16px 32px 0 32px'" v-if="assetIssues != ''">
            <table :key="partTable">
              <tr>
                <th>Issue Number</th>
                <th>Issue Name</th>
                <th>Issue Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>ReportedAt</th>
                <th>Action</th>
              </tr>
              <tr v-for="(issue, index) in assetIssues" :key="index">
                <td>{{ issue.issueNumber }}</td>
                <td>{{ issue.issueName }}</td>
                <td>{{ issue.issueType }}</td>
                <td>{{ issue.priority }}</td>
                <td>
                  {{ issue.status }}
                </td>
                <td>
                  {{ issue.reportedAt }}
                </td>
                <td>
                  <img
                    src="/assets/icons/Results.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer; margin-left: 16px"
                    @click="ViewIssue(issue.uuid)"
                  />
                </td>
              </tr>
            </table>

            <div class="pagination">
              <SPagination
                v-model="currentPageOfAssetRelatedIssues"
                :page-count="numberOfpageOfAssetRelatedIssues"
                @input="paginationOfAssetRelatedIssue"
                :minimal="false"
              />
            </div>
          </div>

          <span v-padding="'16px 32px 16px 32px'" v-if="issuesObj != []"
            ><b>Issue Category Related Issues</b></span
          >
          <div v-padding="'16px 32px 16px 32px'" v-if="issuesObj != []">
            <table :key="partTable">
              <tr>
                <th>Issue Number</th>
                <th>Issue Name</th>
                <th>Issue Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>ReportedAt</th>
                <th>Action</th>
              </tr>
              <tr v-for="(issue, index) in issuesObj" :key="index">
                <td>{{ issue.issueNumber }}</td>
                <td>{{ issue.issueName }}</td>
                <td>{{ issue.issueType }}</td>
                <td>{{ issue.priority }}</td>
                <td>
                  {{ issue.status }}
                </td>
                <td>
                  {{ issue.reportedAt }}
                </td>
                <td>
                  <img
                    src="/assets/icons/Results.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer; margin-left: 16px"
                    @click="ViewIssue(issue.uuid)"
                  />
                </td>
              </tr>
            </table>

            <div class="pagination">
              <SPagination
                v-model="currentPageOfIssueCategoryRelatedIssues"
                :page-count="numberOfpageOfIssueCategoryRelatedIssues"
                @input="paginationOfIssueCategoryRelatedIssue"
                :minimal="false"
              />
            </div>
          </div>
        </SAccordion>
      </div>

      <div></div>

      <div>
        <SideBar
          @submit="updateIssue"
          v-if="issues"
          :issues="issues"
          :key="updateSide + 'sidebar'"
          :currency="currency"
          @totalCost="testCost"
        />
        <SButton
          :dropdown="false"
          rounded
          v-if="$route.name == 'edit-issue'"
          dense
          :title="'Update Issue'"
          @clicked-item="updateIssue"
        ></SButton>
      </div>
    </div>
    <ArchiveDialog
      v-if="archiveInspectionDialog"
      @close="closeDialog"
      @archiveData="archiveDialog"
      @canceled="closeDialog"
    ></ArchiveDialog>

    <SToast
      :message="toastMessage"
      :time-out="toastTimeOut"
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
import AssetPersonnelService from "../../services/AssetPersonnelService";
import WorkOrderService from "../../services/WorkOrderService";
import moment from "moment";
import AddPart from "../issues/components/AddPart";
import AddCost from "../issues/components/AddCost";
import InspectionService from "../../services/InspectionService";
import SideBar from "../issues/components/SideBar";
import { Functions } from "@/shared/Functions";
import { required, maxLength } from "vuelidate/lib/validators";
import archiveDialog from "../../components/ArchiveDialog.vue";
import loader from "@/components/Loader.vue";
export default {
  name: "IssueDetail",

  components: {
    SideBar,
    AddPart,
    archiveDialog,
    AddCost,
    loader,
  },
  props: {
    issueUUID: {},
    workOrder: {},
    workOrderindex: {},
  },
  data() {
    return {
      loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      toastTimeOut: 3000,
      popupImage: "",
      currentPageOfAssetRelatedIssues: 1,
      numberOfpageOfAssetRelatedIssues: "",
      rowsPerPageOfAssetReltedIssue: 5,
      currentPageOfIssueCategoryRelatedIssues: 1,
      numberOfpageOfIssueCategoryRelatedIssues: "",
      rowsPerPageOfIssueCategoryReltedIssue: 5,
      openFlag: true,
      imageDialog: false,
      updateSide: 0,
      currentUserDetails: "",
      fileRecord: null,
      inspectionID: "",
      archiveInspectionDialog: false,
      selectedTab: "parts",
      costs: [],
      cost: "",
      issues: {
        issueName: "",
        priority: "",
        issueCategory: "",
        issueType: "",
        assetCategory: "",
        assetName: "",
        assetUUID: "",
        submittedByUserName: "",
        reportedAt: "",
        issueDescription: "",
        description: "",
        ignoreComments: "",
        status: "",
      },
      submittedbyUserUUID: "",
      parts: [],
      serviceRequest: "",
      inspectionReport: "",
      issueIndex: 0,
      serviceIndex: 0,
      inspectionIndex: 0,
      partTable: 0,
      priorityOptions: [
        { label: "low" },
        { label: "Medium" },
        { label: "High" },
      ],
      statusOptions: [
        { label: "Reported", value: "reported" },
        { label: "Inprogress", value: "inprogress" },
        { label: "Resolved", value: "Resolved" },
        { label: "Ignore", value: "ignored" },
      ],
      addPartsDialog: false,
      addCostsDialog: false,
      costTotal: 0,
      costTable: 0,
      costType: false,
      totalWorkOrderCosts: 0,
      value: "",
      categoryOptions: [],
      typeOptions: [],
      assetName: "",
      assetCategoryOptions: [],
      allAssetData: [],
      assetNames: [],
      categoryIndex: 0,
      assetIndex: 0,
      partType: false,
      part: "",
      currency: "",
      assetIssues: "",
      IssueCatgoryRelatedIssues: "",
      issueWorkOrder: "",
      inspectionIssue: "",
      imageVoices: [],
      fieldsDisable: "",
      assetRelatedIssues: "",
      issueCategory: "",
      issuesObj: [],
      issueStatus: "",
      assetFieldsDisable: "",
      manufacture: "",
      objAssetName: "",
      objAssetUUID: "",
      uuid: "",
      updateCostIndex: 0,
      fileUpload: [],
      issueCategoryIndex: 0,
      assetInfo: {},
      categoryList: "",
      cateOptions: [],
    };
  },

  methods: {
    clearSelectedPriority() {
      this.issues.priority = "";
      this.issueCategoryIndex++;
    },

    clearSelectedCategory() {
      this.issues.issueCategory = "";
      this.issues.issueType = "";
      this.typeOptions = [];
      this.issueCategoryIndex++;
    },

    clearSelectedCategortType() {
      this.issues.issueType = "";
      this.issueCategoryIndex++;
    },

    testCost(value) {
      this.totalWorkOrderCosts = value;
      this.updateCostIndex++;
    },
    getPartsByUUId(uuid) {
      WorkOrderService.getPartsByIssueUUID(uuid)
        .then((response) => {
          if (response.status === 200) {
            for (
              let index = 0;
              index < response.data.partUsed.length;
              index++
            ) {
              this.totalWorkOrderCosts +=
                response.data.partUsed[index].quantity *
                  response.data.partUsed[index].cost.amount +
                response.data.partUsed[index].cost.taxAmount;
            }
            this.updateSide++;
          }
        })
        .catch((error) => {});
    },
    receiveDocument(file) {
      this.loaderFlag = true;
      AssetManagementService.uploadFileTos3(this.fileRecord)
        .then((res) => {
          if (res.data.responseIdentifier === "Success") {
            let imageVoice = {
              contentUrl: res.data.fileUrl,
            };
            this.fileUpload = [];
            this.fileUpload.push(imageVoice);
            this.loaderFlag = false;
            this.showToast("Image added Succussfully.", "success");
          }
        })
        .catch((e) => {
          this.loaderFlag = false;
          this.showToast("Please upload image again.", "error");
        });
    },
    getCostByUUID(uuid) {
      WorkOrderService.getCostsByIssueUUID(uuid)
        .then((response) => {
          if (response.status === 200) {
            for (let index = 0; index < response.data.cost.length; index++) {
              this.totalWorkOrderCosts +=
                response.data.cost[index].costQuantity *
                  response.data.cost[index].amount +
                response.data.cost[index].taxAmount;
            }
            this.updateSide++;
          }
        })
        .catch((error) => {});
    },
    updateCost() {
      this.addCostsDialog = false;
      this.costType = false;
      this.getCosts(this.uuid);
      this.$emit("sideBarIndex");
    },

    createCost() {
      this.addCostsDialog = false;
      this.getCosts(this.uuid);
      this.$emit("sideBarIndex");
    },
    editCost(cost) {
      this.cost = cost;
      this.costType = true;
      this.addCostsDialog = true;
    },
    deleteCost(cost) {
      WorkOrderService.deleteCost(cost.uuid)
        .then((response) => {
          if (response.status === 200) {
            this.showToast("Cost Delete Successfully", "success");
            this.costTable++;
            this.updateSide++;
            this.getCosts(this.uuid);
          }
        })
        .catch((error) => {});
    },
    getCosts(uuid) {
      WorkOrderService.getCostsByIssueUUID(uuid)
        .then((res) => {
          this.costs = res.data.cost;
          for (let index = 0; index < this.costs.length; index++) {
            this.costTotal =
              this.costs[index].amount * this.costs[index].costQuantity +
              this.costs[index].taxAmount;
          }
          this.totalWorkOrderCost += this.costTotal;
          this.totalIndex++;
          this.updateSide++;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getInspectionbyIssueUUID(uuid) {
      InspectionService.getInspectionbyIssueUUID(uuid)
        .then((res) => {
          this.inspectionIssue = res.data.inspectionReports;
          this.partTable++;
        })
        .catch((e) => {
          this.showToast("Error", "error");
        });
    },
    getWorkOrderByissueUUID(uuid) {
      WorkOrderService.getWorkOrderByissueUUID(uuid)
        .then((res) => {
          this.issueWorkOrder = res.data.workOrder;
          this.partTable++;
        })
        .catch((e) => {
          this.showToast("Error", "error");
        });
    },
    getCurrency() {
      AssetPersonnelService.getCompanyCurrency(
        this.currentUserDetails.profile.organizationId
      ).then((response) => {
        this.currency = response.data.currency;
      });
    },
    getParts(uuid) {
      WorkOrderService.getPartsByIssueUUID(uuid)
        .then((res) => {
          this.parts = res.data.partUsed;

          for (let index = 0; index < this.parts.length; index++) {
            this.partsTotal =
              this.parts[index].quantity * this.parts[index].cost.amount +
              this.parts[index].cost.taxAmount;
          }
          this.totalWorkOrderCost += this.partsTotal;
          this.totalIndex++;
          this.updateSide++;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addFunction() {
      if (this.selectedTab === "parts") {
        this.addPartsDialog = true;
      } else if (this.selectedTab === "costs") {
        this.addCostsDialog = true;
      }
    },
    editPart(part) {
      this.part = part;
      this.partType = true;
      this.addPartsDialog = true;
    },
    UpdatePart() {
      this.addPartsDialog = false;
      this.partType = false;
      this.getParts(this.uuid);
    },
    createPart() {
      this.addPartsDialog = false;
      this.getParts(this.uuid);
      this.updateSide++;
    },
    fullscreenImage(value) {
      this.popupImage = value;
      this.imageDialog = true;
    },
    close() {
      this.imageDialog = false;
    },
    closeDialog() {
      this.addPartsDialog = false;
      this.partType = false;
      this.archiveInspectionDialog = false;
      this.addCostsDialog = false;
      this.costType = false;
    },
    archiveDialog() {
      InspectionService.deleteInspectionByUUID(this.inspectionID, "archive")
        .then((response) => {
          if (response.status === 200) {
            this.resetTable++;

            this.showToast("Inspection Archived Successfully", "success");
            this.archiveInspectionDialog = false;
          }
        })
        .catch((error) => {});
    },
    deletePart(part) {
      WorkOrderService.deletePart(part.uuid)
        .then((response) => {
          if (response.status === 200) {
            this.showToast("Part Delete Successfully", "success");
            this.partTable++;
            this.updateSide++;
            this.getParts(this.uuid);
          }
        })
        .catch((error) => {});
    },
    selectManagementType(obj) {
      this.manageOption = obj.value;
    },
    onSelectedAssetName(value) {
      this.assetUuid = value.selectedObject.uuid;
      this.objAssetName = value.selectedObject.label;
      this.objAssetUUID = value.selectedObject.uuid;
      this.currentPageOfAssetRelatedIssues = 1;
      this.assetInfo = value.selectedObject;
      this.getPaginatedAssetRelatedIssues(
        this.currentPageOfAssetRelatedIssues,
        this.assetUuid
      );
    },

    paginationOfAssetRelatedIssue(val) {
      this.getPaginatedAssetRelatedIssues(val, this.issues.assetUUID);
    },

    getPaginatedAssetRelatedIssues(val, assetUUID) {
      let request = {
        offset: val - 1,
        limit: this.rowsPerPageOfAssetReltedIssue,
        assetUUID: assetUUID,
        status: "reported",
        tenantUUID: this.currentUserDetails.profile.organizationId,
        issueUUID: this.$route.params.issueID,
      };
      InspectionService.getPaginatedAssetRelatedIssues(request)
        .then((response) => {
          if (response.status === 200) {
            this.numberOfpageOfAssetRelatedIssues =
              response.data.issueReportings.totalPages;
            this.assetIssues = response.data.issueReportings.content;
            this.assetIssues.map((issue) => {
              issue.reportedAt = moment(issue.reportedAt).format(
                "DD MMM YYYY hh:mm a"
              );
            });
          }
        })
        .catch((error) => {
          console.log(error); // no snackabar component so console the error
        });
    },
    onSelectedAssetCategory(value) {
      // console.log('value',value)
      this.assetNames = [];
      this.issues.assetName = "";
            this.assetName = "";
      for (let index = 0; index < this.allAssetData.length; index++) {
        if (
          this.allAssetData[index].categoryUUID ===
          value.selectedObject.categoryUUID
        ) {
          this.assetNames.push(this.allAssetData[index]);
        }
      }

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

      this.issues.assetName = "";
      this.categoryIndex++;
      this.assetIndex++;
      this.updateSide++;
      // this.getInspectionTemaplatesByAssetCategory(
      //   value.selectedObject.categoryUUID
      // );
      // this.workOrderSumary.name = "";
      //	this.assetIndex++;
    },

    onClearAssetCate() {

      // this.issues.assetCategory = "";
      // this.issues.assetName = "";
      // this.assetName = "";
      // this.issues.issueCategory = "";
      // this.issues.issueType = "";
      // console.log('this.issues.assetName',this.issues.assetName,this.assetName)

},
    onClearAsset() {
      this.issues.assetName = "";
      this.issues.issueCategory = "";
      this.issues.issueType = "";
    },

    issueDetailsAccordionFunction(value) {
      if (this.$refs.issueDetailsAccordion.openFlag === true) {
        this.$refs.assetDetailsAccordion.openFlag = false;
        if (
          this.issues.status == "reported" &&
          this.issues.inpectionItemsUUID !== null
        ) {
          this.$refs.inspectionDetailsAccordion.openFlag = false;
        }
        if (this.issues.status == "Resolved") {
          this.$refs.partsDetailsAccordion.openFlag = false;
        }
        this.$refs.attachmentsDetailsAccordion.openFlag = false;
        if (
          this.issueWorkOrder.workOrderNumber !== null &&
          this.issueWorkOrder.status !== "ignored"
        ) {
          this.$refs.relatedWorkOrderDetailsAccordion.openFlag = false;
        }
        this.$refs.relatedIssueDetailsAccordion.openFlag = false;
      }
    },

    assetDetailAccordionFunction(value) {
      if (this.$refs.assetDetailsAccordion.openFlag === true) {
        this.$refs.issueDetailsAccordion.openFlag = false;
        if (
          this.issues.status == "reported" &&
          this.issues.inpectionItemsUUID !== null
        ) {
          this.$refs.inspectionDetailsAccordion.openFlag = false;
        }
        if (this.issues.status == "Resolved") {
          this.$refs.partsDetailsAccordion.openFlag = false;
        }
        this.$refs.attachmentsDetailsAccordion.openFlag = false;
        if (
          this.issueWorkOrder.workOrderNumber !== null &&
          this.issueWorkOrder.status !== "ignored"
        ) {
          this.$refs.relatedWorkOrderDetailsAccordion.openFlag = false;
        }
        this.$refs.relatedIssueDetailsAccordion.openFlag = false;
      }
    },
    partsDetailsAccordionFunction(value) {
      if (this.$refs.partsDetailsAccordion.openFlag === true) {
        this.$refs.assetDetailsAccordion.openFlag = false;
        if (
          this.issues.status == "reported" &&
          this.issues.inpectionItemsUUID !== null
        ) {
          this.$refs.inspectionDetailsAccordion.openFlag = false;
        }
        this.$refs.issueDetailsAccordion.openFlag = false;
        this.$refs.attachmentsDetailsAccordion.openFlag = false;
        if (
          this.issueWorkOrder.workOrderNumber !== null &&
          this.issueWorkOrder.status !== "ignored"
        ) {
          this.$refs.relatedWorkOrderDetailsAccordion.openFlag = false;
        }
        this.$refs.relatedIssueDetailsAccordion.openFlag = false;
      }
    },

    inspectionDetailsAccordionFunction(value) {
      if (this.$refs.inspectionDetailsAccordion.openFlag === true) {
        this.$refs.assetDetailsAccordion.openFlag = false;
        this.$refs.issueDetailsAccordion.openFlag = false;
        if (this.issues.status == "Resolved") {
          this.$refs.partsDetailsAccordion.openFlag = false;
        }
        this.$refs.attachmentsDetailsAccordion.openFlag = false;
        if (
          this.issueWorkOrder.workOrderNumber !== null &&
          this.issueWorkOrder.status !== "ignored"
        ) {
          this.$refs.relatedWorkOrderDetailsAccordion.openFlag = false;
        }
        this.$refs.relatedIssueDetailsAccordion.openFlag = false;
      }
    },

    attachmentsDetailsAccordionFunction(value) {
      if (this.$refs.attachmentsDetailsAccordion.openFlag === true) {
        this.$refs.assetDetailsAccordion.openFlag = false;
        if (
          this.issues.status == "reported" &&
          this.issues.inpectionItemsUUID !== null
        ) {
          this.$refs.inspectionDetailsAccordion.openFlag = false;
        }
        if (this.issues.status == "Resolved") {
          this.$refs.partsDetailsAccordion.openFlag = false;
        }

        this.$refs.issueDetailsAccordion.openFlag = false;
        if (
          this.issueWorkOrder.workOrderNumber !== null &&
          this.issueWorkOrder.status !== "ignored"
        ) {
          this.$refs.relatedWorkOrderDetailsAccordion.openFlag = false;
        }
        this.$refs.relatedIssueDetailsAccordion.openFlag = false;
      }
    },
    relatedWorkOrderDetailsAccordionFunction(value) {
      if (this.$refs.relatedWorkOrderDetailsAccordion.openFlag === true) {
        this.$refs.assetDetailsAccordion.openFlag = false;
        if (
          this.issues.status == "reported" &&
          this.issues.inpectionItemsUUID !== null
        ) {
          this.$refs.inspectionDetailsAccordion.openFlag = false;
        }
        if (this.issues.status == "Resolved") {
          this.$refs.partsDetailsAccordion.openFlag = false;
        }
        this.$refs.attachmentsDetailsAccordion.openFlag = false;
        this.$refs.issueDetailsAccordion.openFlag = false;
        this.$refs.relatedIssueDetailsAccordion.openFlag = false;
      }
    },
    relatedIssueDetailsAccordionFunction(value) {
      if (this.$refs.relatedIssueDetailsAccordion.openFlag === true) {
        this.$refs.assetDetailsAccordion.openFlag = false;
        if (
          this.issues.status == "reported" &&
          this.issues.inpectionItemsUUID !== null
        ) {
          this.$refs.inspectionDetailsAccordion.openFlag = false;
        }
        if (this.issues.status == "Resolved") {
          this.$refs.partsDetailsAccordion.openFlag = false;
        }
        this.$refs.attachmentsDetailsAccordion.openFlag = false;
        if (
          this.issueWorkOrder.workOrderNumber !== null &&
          this.issueWorkOrder.status !== "ignored"
        ) {
          this.$refs.relatedWorkOrderDetailsAccordion.openFlag = false;
        }
        this.$refs.issueDetailsAccordion.openFlag = false;
      }
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    getUserName(userUUID) {
      AssetPersonnelService.getNameOfUsersByUUIDS({ uuids: userUUID })
        .then((response) => {
          if (response.status === 200) {
            this.issues.submittedByUserName =
              response.data.users[this.issues.submittedByUserUUID].name;
            this.issueIndex++;
          }
        })
        .catch((error) => {});
    },
    ViewIssue(uuid) {
      this.$router.replace({
        name: "issue-detail",
        params: {
          issueID: uuid,
        },
      });
      window.location.reload();
    },
    viewWorkOrder(uuid) {
      this.$router.push({
        name: "work-order-details",
        params: {
          workuuid: uuid,
        },
      });
    },
    ViewInspection(uuid) {
      this.$router.go({
        name: "inspection-details",
        params: {
          inspectionUUID: uuid,
        },
      });
    },
    archiveInspection(uuid) {
      this.inspectionID = uuid;
      this.archiveInspectionDialog = true;
    },
    getAsset(assetUUID) {
      AssetManagementService.getAssetWithDetails(assetUUID, false, true)
        .then((response) => {
          if (response.status == 200) {
            this.loaderFlag = false;
            this.issues.assetName = response.data.assetDetail.assetDetail.name;
            this.assetName = response.data.assetDetail.assetDetail.name;
            this.manufacture =
              response.data.assetDetail.assetDetail.manufacture;
            this.categoryIndex++;
            this.updateSide++;
            this.issues.assetCategory = response.data.assetDetail.category.name;
            this.issues.issueIndex = this.issueIndex++;
            // this.getIssuesByAssetUUID(response.data.asset.assetDetail.uuid);
            this.getPaginatedAssetRelatedIssues(
              this.currentPageOfAssetRelatedIssues,
              assetUUID
            );
            this.categoryIndex++;
            this.updateSide++;
            this.openFlag = true;
            //	this.issueIndex++;
          }
        })
        .catch((error) => {});
    },
    selectCate(value) {
      // this.typeOptions = [];
      // this.issueType = "";
      // for (
      //   let index = 0;
      //   index < this.dropDownConfigs.issueCategories.length;
      //   index++
      // ) {
      //   if (value.value === this.dropDownConfigs.issueCategories[index].value) {
      //     for (
      //       let index1 = 0;
      //       index1 < this.dropDownConfigs.issueCategories[index].types.length;
      //       index1++
      //     ) {
      //       let obj = {
      //         label: this.dropDownConfigs.issueCategories[index].types[index1]
      //           .label,
      //         value: this.dropDownConfigs.issueCategories[index].types[index1]
      //           .value,
      //       };
      //       this.typeOptions.push(obj);
      //     }
      //   }
      // }

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
    getServiceRequest(serviceUUID) {
      InspectionService.getServiceRequestByUUID(serviceUUID)
        .then((response) => {
          if (response.status === 200) {
            this.serviceRequest = response.data.serviceRequest;
            this.serviceIndex++;
          }
        })
        .catch((error) => {});
    },

    getInspection(inspectionUUID) {
      InspectionService.getInspectionReportByUUID(inspectionUUID)
        .then((response) => {
          if (response.status === 200) {
            this.inspectionReport = response.data.inspectionReport;
            this.inspectionIndex++;
          }
        })
        .catch((error) => {});
    },
    getAllCategories(currentUserDetails) {
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
          }
          this.getAllAsset(currentUserDetails);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getAllAsset(currentUserDetails) {
      let categoryUUID = "";
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
          }

          if (this.$route.params.createWorkOrder === true) {
            for (let index = 0; index < this.allAssetData.length; index++) {
              if (
                this.$route.params.assetUUID === this.allAssetData[index].uuid
              ) {
                categoryUUID = this.allAssetData[index].categoryUUID;
              }
            }

            for (
              let indx = 0;
              indx < this.assetCategoryOptions.length;
              indx++
            ) {
              if (
                this.assetCategoryOptions[indx].categoryUUID === categoryUUID
              ) {
                this.workOrderSumary.category =
                  this.assetCategoryOptions[indx].label;
              }
            }

            for (let j = 0; j < this.allAssetData.length; j++) {
              if (this.allAssetData[j].categoryUUID === categoryUUID) {
                this.workOrderSumary.name = this.allAssetData[j].label;
                this.assetNames.push(this.allAssetData[j]);
              }
            }

            this.categoryIndex++;
            this.assetIndex++;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteIssueImage(uuid) {
      InspectionService.deleteIssueImage(uuid)
        .then((res) => {
          if (res.status === 200) {
            this.showToast("Image removed successfully", "success");
            this.getIssueDetails();
          }
        })
        .catch((e) => {});
    },

    updateIssue() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }
      this.loaderFlag = true;
      this.issues.reportedAt = moment(this.issues.reportedAt).toISOString();
      this.issues.assetCategory = this.assetInfo.type;
      this.issues.assetNumber = this.assetInfo.assetNumber;
      this.issues.assetName = this.assetInfo.label;
      this.issues.assetUUID = this.objAssetUUID;
      let updateIssueRequest = {
        issueReporting: this.issues,
        imageVoices: [],
      };
      if (this.fileRecord !== null) {
        //means file is attached to it
        updateIssueRequest.imageVoices = this.fileUpload;
        InspectionService.updateIssue(updateIssueRequest)
          .then((response) => {
            if (response.status === 200) {
              this.loaderFlag = false;
              this.$router.push({
                name: "issues",
                params: {
                  toastFlag: true,
                  toasstMessage: "Issue Updated Successfully",
                  toastType: "success",
                },
              });
            }
          })
          .catch((error) => {
            this.showToast(error.data.response, "error");
          });
      } else if (this.fileRecord == null) {
        InspectionService.updateIssue(updateIssueRequest)
          .then((response) => {
            if (response.status === 200) {
              this.loaderFlag = false;
              this.$router.push({
                name: "issues",
                params: {
                  toastFlag: true,
                  toasstMessage: "Issue Updated Successfully",
                  toastType: "success",
                },
              });
            }
          })
          .catch((error) => {
            this.showToast(error.data.response, "error");
          });
      }
    },

    paginationOfIssueCategoryRelatedIssue(val) {
      this.getPaginatedIssueCategoryRelatedIssues(val, this.issueCategory);
    },

    getPaginatedIssueCategoryRelatedIssues(val, issueCategory) {
      let request = {
        issueCategory: issueCategory,
        offset: val - 1,
        limit: this.rowsPerPageOfIssueCategoryReltedIssue,
        tenantUUID: this.currentUserDetails.profile.organizationId,
        issueUUID: this.$route.params.issueID,
      };

      InspectionService.getPaginatedIssueCategoryRelatedIssues(request)
        .then((response) => {
          if (response.status === 200) {
            this.numberOfpageOfIssueCategoryRelatedIssues =
              response.data.issueReportings.totalPages;
            this.issuesObj = response.data.issueReportings.content;
            this.issuesObj.map((obj) => {
              obj.reportedAt = moment(obj.reportedAt).format(
                "DD MMM YYYY  hh:mm a"
              );
            });
          }
        })
        .catch((error) => {
          console.log(error); // as no snack bar component is made so using console for this.
        });
    },

    getIssueDetails() {
      this.loaderFlag = true;
      InspectionService.getIssueByUUID(this.$route.params.issueID)
        .then((response) => {
          this.imageVoices = response.data.imageVoices;
          if (response.status === 200) {
            // console.log('response',response)
            this.issues = response.data.issueReporting;
            this.submittedbyUserUUID = this.issues.submittedByUserUUID;
            this.issueCategory = this.issues.issueCategory;
            this.issueStatus = this.issues.status;

            if (this.issueStatus == "reported") {
              this.assetFieldsDisable = false;
            }
            this.getUserName([this.issues.submittedByUserUUID]);
            this.getAsset(this.issues.assetUUID);
            this.issues.reportedAt = moment(this.issues.reportedAt).format(
              "DD MMM YYYY"
            );
            document.title = this.issues.issueNumber + " | " + "Erohal";
            this.getPaginatedIssueCategoryRelatedIssues(
              this.currentPageOfIssueCategoryRelatedIssues,
              this.issueCategory
            );
            if (
              this.issueStatus.toLowerCase() === "inprogress" ||
              this.issueStatus.toLowerCase() === "resolved"
            ) {
              this.fieldsDisable = true;
            }
            // InspectionService.getPaginatedIssues(
            // 	[],
            // 	"reportedAt",
            // 	"desc",
            // 	0,
            // 	10000,
            // 	this.currentUserDetails.profile.organizationId
            // ).then((res) => {
            // 	for (
            // 		let index = 0;
            // 		index < res.data.issueReportings.content.length;
            // 		index++
            // 	) {
            // 		if (
            // 			this.issueCategory ===
            // 			res.data.issueReportings.content[index].issueCategory
            // 		) {
            // 			res.data.issueReportings.content[index].reportedAt = moment(
            // 				res.data.issueReportings.content[index].reportedAt
            // 			).format("DD MMM YYYY  hh:mm a");
            // 			this.issuesObj.push(res.data.issueReportings.content[index]);
            // 		}
            // 	}
            // });
            //	console.log("service request", this.issues.serviceUUID);

            if (this.issues.serviceUUID !== null) {
              this.getServiceRequest(this.issues.serviceUUID);
            }
            if (this.issues.inspectionUUID !== null) {
              this.getInspection(this.issues.inspectionUUID);
            }
          }
        })
        .catch((error) => {});
    },
    openCreateInspectionTemplate() {
      this.$router.push({
        name: "create-inspection-template",
      });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  watch: {},
  created() {
    this.getIssueDetails();
    this.uuid = this.$route.params.issueID;
    this.fieldsDisable = this.$route.params.flag;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );

    this.getAllCategories(this.currentUserDetails);
    // this.getAllAsset(this.currentUserDetails);
    this.getCurrency();
    this.getPartsByUUId(this.$route.params.issueID);
    this.getCostByUUID(this.$route.params.issueID);
    this.getInspectionbyIssueUUID(this.$route.params.issueID);
    this.getWorkOrderByissueUUID(this.$route.params.issueID);
    // this.dropDownConfigs = JSON.parse(localStorage.getItem("dropDownConfigs"));

    // for (
    //   let index = 0;
    //   index < this.dropDownConfigs.issueCategories.length;
    //   index++
    // ) {
    //   let obj = {
    //     label: this.dropDownConfigs.issueCategories[index].label,
    //     value: this.dropDownConfigs.issueCategories[index].value,
    //   };
    //   this.categoryOptions.push(obj);
    // }
    this.getParts(this.$route.params.issueID);
    this.getCosts(this.$route.params.issueID);
    //	this.$refs.issueDetailsAccordion.openFlag === true;
  },

  validations: function () {
    return {
      issues: {
        issueName: { required, maxLength: maxLength(190) },
        issueType: { required },
        issueCategory: { required },
        priority: { required },
        issueDescription: { maxLength: maxLength(500) },
        ignoreComments: { maxLength: maxLength(500) },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.items-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 16px;
  align-items: center;
}
.row-border {
  border-top: 1px solid var(--very-light-pink);
}
.row-col-gap {
  display: grid;
  column-gap: 16px;
  row-gap: 16px;
}
.c-grid {
  display: grid;
  grid-template-columns: 5fr 1fr;
  align-items: center;
}
.header {
  font-size: 14px;
  line-height: 1;
  padding: 0 24px;
}
table {
  margin-top: 24px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  width: 100%;
  // white-space: nowrap;
  cursor: default;

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
    opacity: 1;
    background-color: #e1e1e1;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
}
.filePickerRow {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}
</style>
