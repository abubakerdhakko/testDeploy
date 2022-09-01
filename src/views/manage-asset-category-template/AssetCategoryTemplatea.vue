<template>
  <div class="shark-data-table">
    <div class="pt-32 mb-32">
      <span class="head-title">{{
        issueTab === "issues" ? "Category Templates" : "Asset Categories"
      }}</span
      ><br />
      <span class="subtitle"
        >View all the information related to Categories</span
      >

    </div>
    <template>
      <div class="buttons-row">
        <div>
          <SToggle
            v-model="issueTab"
            :options="issueTabOptions"
            :tabs="true"
            :background="'#ffffff'"
            style="margin-top: 0px !important"
            @selected="selectTab"
          />
        </div>
        <div style="display: flex">
          <SButton
            v-if="issueTab === 'issues'"
            title="Create Asset Category Template"
            pill
            outline
            small
            @click="createAssetCateTemplate()"
            v-width="210"
          ></SButton>
          <SButton
            v-if="issueTab !== 'issues'"
            title="Create Asset Category"
            pill
            outline
            small
            @click="openCreateCategory()"
            v-width="210"
          ></SButton>
          <!-- <SButton
              title="Create Issue"
              v-width="150"
              pill
              outline
              small
              style="margin-right: 5px"
              @click="createIssue()"
            ></SButton>-->
          <SButton
            v-if="issuesUUID.length > 0"
            title="Create Work Order"
            v-width="150"
            pill
            outline
            small
            class="red-Btn"
            @click="createWorkOrder()"
          ></SButton>
        </div>
      </div>

      <div class="selected-issue-count" v-if="issuesUUID.length > 0">
        <span class="selected-issues"
          >{{ issuesUUID.length }} Selected Issues</span
        >
      </div>
    </template>

    <div v-if="issueTab === 'issues'">
      <SDialog
        :width="600"
        :crossIcon="true"
        @close="closeModal"
        :title="''"
        v-if="showCreateOrder"
      >
        <div class="dialog-page-grid">
          <div class="dialog-title">Work Order</div>
          <div class="separator"></div>
          <div class="dialog-tagline">
            Create a new work order or add to an existing work order?
          </div>
          <div class="dialog-btn mt-8">
            <SButton
              title="Existing"
              v-width="100"
              :pill="true"
              :small="true"
              @click="existingWorkOrder()"
              style="margin-right: 5px"
            ></SButton>
            <SButton
              title="New"
              v-width="100"
              :pill="true"
              :small="true"
              @click="newWorkOrder()"
            ></SButton>
          </div>
          <div v-if="existing">
            <div class="separator"></div>
            <div
              class="dialog-tagline"
              style="text-align: center; margin-bottom: 5px"
            >
              Please select a Work Order :
            </div>
            <SSelect
              label="Work Order Number*"
              v-model="workOrderNumber"
              :source="workOrderOpt"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              :error="getFormErrorMessage($v.workOrderNumber)"
              @clear="onClearSelectedWorkOrder"
              :key="updateComp + 'workOrderField'"
            />
            <div class="dialog-btn mt-8 mb-8">
              <SButton
                title="Cancel"
                v-width="100"
                :pill="true"
                :small="true"
                @click="cancel()"
                style="margin-right: 5px"
              ></SButton>
              <SButton
                title="Add"
                v-width="100"
                :pill="true"
                :small="true"
                @click="existingAddWorkOrder()"
              ></SButton>
            </div>
          </div>
        </div>
      </SDialog>

      <!-- SDT -->
      <div>
        <Sdt
          :filteredDataCount="filterCount"
          v-if="parentDefaultSystemView.defaultTable.columns.length > 0"
          :parentData="parentData"
          :parentDefaultSystemView="parentDefaultSystemView"
          :parentSystemSettings="parentSystemSettings"
          :dataDepart="(value) => catchDeparture(value)"
          :rowHeights="false"
          :token="sdt_token"
          :customViews="true"
          :tableSearch="true"
          :downloadAs="false"
          :actionsButton="true"
          :moreButton="false"
          ref="test"
          v-on:clicked-option="getActionsOption"
          v-on:download-as-option="getDownloadAsOption"
        />
      </div>

      <ViewIssue
        v-if="editIssue === true || viewIssue === true"
        :viewIssue="viewIssue"
        :editIssue="editIssue"
        :issueuuid="issueuuid"
        @close="closeIssueDialog"
      ></ViewIssue>
      <IgnoreRequest
        v-if="ignoreIssue"
        @ignoreRequest="ignoreRequest"
        @close="close"
        @showToast="showToast"
      />
      <CreateIssue
        @close="closeIssue"
        @save="save"
        v-show="createIssues"
        @toastFlag="displayMessage"
        :key="'createIssue' + createIssueComp"
      />
      <DeleteDialog
        v-if="deleteIssueDialog"
        @close="closeDialog"
        @deleteData="deleteDialog"
        @canceled="closeDialog"
      ></DeleteDialog>
      <ArchiveDialog
        v-if="archiveIssueDialog"
        @close="closeDialog"
        @archiveData="archiveDialog"
        @canceled="closeDialog"
      ></ArchiveDialog>
    </div>

    <div v-if="issueTab === 'archived'">
      <ArchivedIssues @showToast="showToast" />
    </div>

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->

    <SToast
      :message="toastMessage"
      :time-out="toastTimeOut"
      :type="toastType"
      :key="toastFlag"
    />
  </div>
</template>

<script>
import assetManagementService from "../../services/AssetManagementService";
import assetPersonnelService from "../../services/AssetPersonnelService";
import InspectionService from "../../services/InspectionService";
import workOrderService from "../../services/WorkOrderService";
import { required } from "vuelidate/lib/validators";
import Endpoints from "../../services/EndPoints";
import moment from "moment";
import ArchivedIssues from "./../issues/archivedIssues.vue";
import ViewIssue from "../../views/issues/components/ViewIssue";
import IgnoreRequest from "../../components/IgnoreRequest";
import CreateIssue from "../../components/CreateIssue";
import DeleteDialog from "../../components/DeleteDialog";
import ArchiveDialog from "../../components/ArchiveDialog";
import { Functions } from "@/shared/Functions";

import loader from "@/components/Loader.vue";
let stringOptionWorkOrderUUID = [];
export default {
  name: "Issues",
  components: {
    ViewIssue,
    IgnoreRequest,
    CreateIssue,
    DeleteDialog,
    ArchiveDialog,
    ArchivedIssues,
    loader,
  },
  data() {
    return {
      updateComp: 0,
      createIssueComp: 0,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      toastTimeOut: 3000,
      loaderFlag: false,
      issueTab: "issues",
      issueTabOptions: [
        {
          label: "Category Templates",
          value: "issues",
        },
        {
          label: "Asset categories",
          value: "archived",
        },
      ],
      filterCount: "",
      currentUserDetails: "",
      issueID: "",
      archiveIssueDialog: false,
      deleteIssueDialog: false,
      createIssues: false,
      viewIssue: false,
      editIssue: false,
      ignoreIssue: false,
      user: "",
      username: "",
      isLoadingPage: false,
      isLoading: false,
      prompt: false,
      promptViewName: "",
      serverData: "",
      filterFieldList: [],
      issue: "",
      eventData: "",
      sdt_token: JSON.parse(localStorage.getItem("currentUserDetails"))
        .access_token,
      parentSystemSettings: {
        serviceURL: Endpoints.preferenceService.preference,
        // serviceURL: 'http://localhost:8099/preferences',
        buttons: [],
        searchValue: "",
        height: "950px",
        selectionColumn: true,
        selectType: "checkbox",
        moreOptions: [],
        actionsOptions: ["View", "Edit", "Archive", "Ignore"],
        columnIcons: [
          { field: "", icon: "port" },
          { field: "", icon: "port" },
        ],
        pillConfig: [
          { column: "", state: "success", data: "" },
          { column: "", state: "error", data: "" },
          { column: "", state: "normal", data: "" },
        ],
        staticColumns: [],
        user: "",
        uppercaseColumns: [], // pass column name whose data should be shown in caps
        dateFormat: "DD/MM/yyyy hh:mm a", //pass any moment date format here
      },

      parentDefaultSystemView: {
        viewNames: [
          {
            name: "Default View",
            tileFlag: true,
            position: 1,
            privacy: "private",
          },
          {
            name: "Add A View Tile",
            tileFlag: true,
            position: 0,
            privacy: "private",
          },
        ],

        defaultTable: {
          id: null,
          viewName: "Default View",
          density: "",
          pageSize: "",
          pageName: "",
          user: JSON.parse(localStorage.getItem("currentUserDetails")).profile
            .username,
          defaultViewFlag: true,
          sortField: "",
          sortDirection: "",
          tileFlag: true,
          position: 1, // always pass 1
          privacy: "private",
          columns: [],
        },
      },
      parentData: [],
      issuesUUID: [],
      issuesNumber: [],
      issuesAssetObj: [],
      issuesStatus: [],
      issuesWorkobj: [],
      assetUUID: [],
      issueResolved: [],
      workOrderOpt: stringOptionWorkOrderUUID,
      existing: false,
      workOrderNumber: "",
      tableConfig: "",
      showCreateOrder: false,
      sdtData: "",
      fieldNames: [],
    };
  },

  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    closeDialog() {
      this.deleteIssueDialog = false;
      this.archiveIssueDialog = false;
    },
    selectTab() {},
    displayMessage() {
      this.showToast("Issue Created Succussfully.", "success");
    },
    deleteDialog() {
      this.deleteIssueDialog = false;
      this.deleteIssues(this.issueID, "Delete");
    },
    archiveDialog() {
      this.archiveIssueDialog = false;
      this.deleteIssues(this.issueID, "Archive");
    },
    // createIssue() {
    // this.createIssues = true;
    // },
    createAssetCateTemplate() {
      this.$router.push({
        name: "asset-category-template",
      });
    },
    openCreateCategory() {
      this.$router.push({
        name: "create-asset-category",
      });
    },
    closeIssue() {
      this.createIssues = false;
      this.createIssueComp++;
    },
    save() {
      this.createIssues = false;
      this.createIssueComp++;
      this.loadTable(this.sdtData);
    },
    ignoreRequest(value) {
      let issueIgnoreRequest = {};
      this.issue.ignoreComments = value.value;
      issueIgnoreRequest.issueReporting = {
        id: this.issue.id,
        uuid: this.issue.uuid,
        status: "Ignored",
        tenantUUID: this.issue.tenantUUID,
        issueFlag: this.issue.issueFlag,
        ignoreComments: value.value,
        ignoredBy: this.currentUserDetails.profile.username,
      };
      issueIgnoreRequest.imageVoices = [];
      this.loaderFlag = true;
      InspectionService.updateIssue(issueIgnoreRequest)
        .then((response) => {
          if (response.status === 200) {
            this.showToast("Issue Ignored Successfully", "success");
            this.ignoreIssue = false;
            this.loadTable(this.sdtData);
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
        });
    },
    close() {
      this.ignoreIssue = false;
    },
    deleteIssues(uuid, type) {
      this.loaderFlag = true;
      InspectionService.deleteIssues(uuid, type)
        .then((response) => {
          if (response.status === 200) {
            if (type === "Delete") {
              this.showToast("Issue Deleted Successfully", "success");
              this.loadTable(this.sdtData);
            } else {
              this.showToast("Issue Archived Successfully", "success");
              this.loadTable(this.sdtData);
            }
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
        });
    },
    closeIssueDialog() {
      this.editIssue = false;
      this.viewIssue = false;
    },
    // SDT functions start here
    catchDeparture: function (data) {
      // console.log("data", data);
      this.sdtData = data;
      if (data.status == 1 || data.status == 3) {
        this.loadTable(data);
      } else if (data.status == 4) {
        this.loadTable(data);
      } else if (data.status == 10) {
        var i = [];
        // console.log(data.message);
        if (data.message.checkbox.checked === false) {
          for (let index = 0; index < this.issuesUUID.length; index++) {
            if (this.issuesUUID[index] !== data.message.uuid) {
              i.push(index);
            }
          }
          this.issuesUUID = this.issuesUUID.filter((issue, index) => {
            for (let j = 0; j < i.length; j++) {
              if (i[j] === index) {
                return issue;
              }
            }
          });

          this.issuesNumber = this.issuesNumber.filter((issue, index) => {
            for (let j = 0; j < i.length; j++) {
              if (i[j] === index) {
                return issue;
              }
            }
          });
          this.issuesAssetObj = this.issuesAssetObj.filter((issue, index) => {
            for (let j = 0; j < i.length; j++) {
              if (i[j] === index) {
                return issue;
              }
            }
          });
          this.issuesWorkobj = this.issuesWorkobj.filter((issue, index) => {
            for (let j = 0; j < i.length; j++) {
              if (i[j] === index) {
                return issue;
              }
            }
          });
          this.assetUUID = this.assetUUID.filter((issue, index) => {
            for (let j = 0; j < i.length; j++) {
              if (i[j] === index) {
                return issue;
              }
            }
          });
          this.issueResolved = this.issueResolved.filter((issue, index) => {
            for (let j = 0; j < i.length; j++) {
              if (i[j] === index) {
                return issue;
              }
            }
          });

          this.issuesStatus = this.issuesStatus.filter((issue, index) => {
            for (let j = 0; j < i.length; j++) {
              if (i[j] === index) {
                return issue;
              }
            }
          });
        } else {
          this.issuesAssetObj.push(data.message.assetName);
          this.issuesStatus.push(data.message.status);
          this.issuesWorkobj.push(data.message.workOrderNumber);
          this.issuesUUID.push(data.message.uuid);
          this.issuesNumber.push(data.message.issueNumber);
          this.assetUUID.push(data.message.assetUUID);
          this.issueResolved.push(data.message.resolved);
        }
      }
    },

    loadTable(sdtData) {
      let filters = [];
      this.loaderFlag = true;
      let filterFlag = false;
      for (let sdt_data of sdtData.message) {
        if (sdt_data.fieldName !== "actions") {
          let newDate = "";
          if (sdt_data.fieldType === "date" && sdt_data.filterValue !== "") {
            let date = sdt_data.filterValue.toLowerCase();
            date = date.split("/");
            newDate = new Date(`${date[1]}/${date[0]}/${date[2]}`);
          }
          if (sdt_data.filterValue === null) {
            sdt_data.filterValue = "";
          }
          filters.push({
            fieldName: sdt_data.fieldName,
            fieldType: sdt_data.fieldType,
            filterValue:
              newDate === null || newDate === ""
                ? sdt_data.filterValue
                : newDate.getTime(),
            secondValue: sdt_data.secondValue,
            comparisonType: sdt_data.comparisonType,
          });
        }
      }
      this.getPaginatedIssues(
        filters,
        sdtData.data.sortField,
        sdtData.data.sortDirection,
        sdtData.data.offset,
        sdtData.data.limit,
        sdtData.data.searchQuery
      );
    },

    loadSDT(response, data) {
      this.parentData = data;
      let eventData = {
        data: this.parentData,
        totalElements: response.data.issueReportings.totalElements,
        totalPages: response.data.issueReportings.totalPages,
        pageNumber: response.data.issueReportings.offset,
      };
      this.$refs.test.dataLoadEvent(eventData);
    },

    getPaginatedIssues(
      filters,
      sortField,
      sortDirection,
      offset,
      limit,
      searchQuery
    ) {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );

      let requestObj = {
        searchQuery: searchQuery,
        // searchColumns: searchColumns,
        filters: filters,
        sortField: sortField,
        sortDirection: sortDirection,
        offset: offset,
        limit: limit,
        tenantUUID: currentUserDetails.profile.organizationId,
        fieldNames: this.fieldNames,
      };

      InspectionService.getPaginatedIssues(requestObj)
        .then((response) => {
          if (response.status === 200) {
            response.data.issueReportings.offset = offset;
            let issues = response.data.issueReportings.content;
            this.filterCount = response.data.issueReportings.totalElements;
            if (issues.length === 0) {
              this.loadSDT(response, issues);
              this.loaderFlag = false;
              return;
            }

            if (issues.length === 0) {
              this.countOfTotalIssues =
                response.data.issueReportings.totalElements;
              this.issues = issues;
            } else {
              issues.map((issue) => {
                if (issue.resolved === true) {
                  issue.resolved = "Yes";
                } else {
                  issue.resolved = "No";
                }
                if (issue.linked === true) {
                  issue.linked = "Yes";
                } else {
                  issue.linked = "No";
                }
                if (!issue.workOrderAssigned) {
                  issue.workOrderNumber = "Not Assigned";
                }
                if (issue.workOrderAssigned === true) {
                  issue.workOrderAssigned = "Yes";
                } else {
                  issue.workOrderAssigned = "No";
                }

                issue.reportedAt = moment
                  .utc(issue.reportedAt)
                  .local()
                  .format();
                issue.checked = false;
                issues.title = issues.title ? issue.title : issue.issueName;
                if (!issue.title) {
                  issue.title = issue.issueDescription;
                }
              });
            }
            response.data.issueReportings.offset = offset + 1;
            this.loadSDT(response, issues);
            this.loaderFlag = false;
            this.issues = issues;
          } else {
            this.showToast(
              "Error while getting issues.Please try again",
              "error"
            );
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          } else {
            this.showToast(
              "An Error occurred while getting Issues. Please try again.",
              "error"
            );
          }
        });
    },

    getActionsOption(val) {
      if (val.value == "View") {
        this.$router.push({
          name: "issue-detail",
          params: {
            issueID: val.row.uuid,
            flag: true,
          },
        });
      }

      if (val.value == "Edit") {
        this.$router.push({
          name: "edit-issue",
          params: {
            issueID: val.row.uuid,
            flag:
              val.row.status === "In progress" || val.row.status === "Resolved"
                ? true
                : false,
          },
        });
      }

      if (val.value == "Archive") {
        this.issueID = val.row.uuid;
        if (val.row.status == "In progress") {
          this.showToast("Inprogress issue can't be archive", "error");
          return;
        }
        this.archiveIssueDialog = true;
      }

      if (val.value == "Delete") {
        this.issueID = val.row.uuid;
        this.deleteIssueDialog = true;
      }
      if (val.value == "Ignore") {
        this.issue = val.row;
        if (this.issue.workOrderNumber !== null) {
          this.showToast("Inprogress issue can't be ignore", "error");
          return;
        }
        this.ignoreIssue = true;
      }
    },

    getDownloadAsOption(opt) {
      // console.log('download as option',opt);
      if (opt.option == "pdf") {
        // notificationAndCommunicationService.downloadSelectedPDF(obj)
        // .then((res) => {
        // // console.log(res)
        // let fileContents = null;
        //     let popupWin=null;
        //     popupWin = window.open('', '_blank', 'top=0,left=0,height=700,width=1000;');
        //     let document = {
        //         'documentName': 'Billing'
        //     };
        // fileContents = res.data.type + res.data.content;
        //   popupWin.document.write(`
        //     <html>
        //         <head>
        //          <!--title>Print tab</title-->
        //             <style>
        //                 #buttons{display:none;}
        //                  body {
        //                     margin: 0;
        //                     font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Euclid Circular B, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        //                     font-size: 1rem;
        //                     font-weight: 400;
        //                     line-height: 1.5;
        //                     color: #212529;
        //                     text-align: left;
        //                     background-color: #fff;
        //                 }
        //                 button, meter, progress {
        //                     -webkit-writing-mode: horizontal-tb !important;
        //                 }
        //                 input, textarea, select, button {
        //                     text-rendering: auto;
        //                     color: initial;
        //                     letter-spacing: normal;
        //                     word-spacing: normal;
        //                     text-transform: none;
        //                     text-indent: 0px;
        //                     text-shadow: none;
        //                     display: inline-block;
        //                     text-align: start;
        //                     margin: 0em;
        //                     font: 400 13.3333px Arial;
        //                 }
        //                 input[type="button" i], input[type="submit" i], input[type="reset" i], input[type="file" i]::-webkit-file-upload-button, button {
        //                     align-items: flex-start;
        //                     text-align: center;
        //                     cursor: default;
        //                     color: buttontext;
        //                     background-color: buttonface;
        //                     box-sizing: border-box;
        //                     padding: 2px 6px 3px;
        //                     border-width: 2px;
        //                     border-style: outset;
        //                     border-color: buttonface;
        //                     border-image: initial;
        //                 }
        //                 input, button, select, optgroup, textarea {
        //                     margin: 0;
        //                     font-family: inherit;
        //                     font-size: inherit;
        //                     line-height: inherit;
        //                 }
        //                 button, select {
        //                     text-transform: none;
        //                 }
        //                 .btn {
        //                     display: inline-block;
        //                     font-weight: 400;
        //                     text-align: center;
        //                     white-space: nowrap;
        //                     vertical-align: middle;
        //                     -webkit-user-select: none;
        //                     -moz-user-select: none;
        //                     -ms-user-select: none;
        //                     user-select: none;
        //                     border: 1px solid transparent;
        //                     padding: 0.375rem 0.75rem;
        //                     font-size: 1rem;
        //                     line-height: 1.5;
        //                     border-radius: 0.25rem;
        //                     transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        //                 }
        //                 .btn-outline-primary {
        //                     color: #007bff;
        //                     background-color: transparent;
        //                     background-image: none;
        //                     border-color: #007bff;
        //                 }
        //                 .btn-outline-primary {
        //                     color: #ffffff;
        //                     border-color: #d03232;
        //                     background-color: #d03232;
        //                 }
        //                 element.style {
        //                 }
        //                 <style>.fa {
        //                     display: inline-block;
        //                     font: normal normal normal 14px/1 FontAwesome;
        //                     font-size: inherit;
        //                     text-rendering: auto;
        //                     -webkit-font-smoothing: antialiased;
        //                     -moz-osx-font-smoothing: grayscale;
        //                 }</style>
        //                 <style>*, *::before, *::after {
        //                     box-sizing: border-box;
        //                 }
        //                 Style Attribute {
        //                     cursor: pointer;
        //                 }
        //                 .btn, .form-control {
        //                     padding: 0.25rem 0.5rem;
        //                     font-size: 0.875rem;
        //                     line-height: 1.5;
        //                     border-radius: 0.3rem;
        //                     margin: 15px;
        //                     margin-right: 23px;
        //                 }</style>
        //             </style>
        //         </head>
        //         <body onload="">
        //             <div style="text-align:right;" >
        //                 <a href="${fileContents}" download="${document.documentName}"><button class="btn btn-sm btn-outline-primary">Download</button></a>
        //             </div>
        //             <br>
        //             <iframe src='${fileContents}'  style="min-width: 100%;height: 100%;" ></iframe>
        //         </body>
        //     </html>`
        // );
        // })
        // .catch((err) => console.log(err));
      } else if (opt.option == "csv") {
        // 	let fileTitle = 'Billings';
        // 	let headers = {
        //       createdDate: 'Requested On'.replace(/,/g, ''), // remove commas to avoid errors
        //       dueDate: "Due Date",
        //       shipmentNumber: "Shipment #",
        // 		  portOfLoading: "Port of Load",
        // 		  portOfDischarge: "Port Of Discharge",
        // 		  amount: "Amount",
        // 		  balance: "Balance",
        // 		  netsuiteStatus: "Status"
        // 	};
        // 	let dataObj = [];
        // 	for (let i = 0; i < opt.rows.length; i++) {
        // 		const bill = opt.rows[i];
        // 		dataObj.push({
        // 			createdDate: bill.createdDate,
        // 			dueDate: bill.dueDate,
        // 			shipmentNumber: bill.shipmentNumber,
        // 			portOfLoading: bill.portOfLoading,
        // 			portOfDischarge: bill.portOfDischarge,
        // 			amount: bill.amount,
        // 			balance: bill.balance,
        // 			netsuiteStatus: bill.netsuiteStatus
        // 		});
        // 	}
        // 	this.exportCSVFile(headers, dataObj, fileTitle);
      }
    },

    exportCSVFile(headers, billingData, fileTitle) {
      // if (headers) {
      //     billingData.unshift(headers);
      // }
      // // Convert Object to JSON
      // var jsonObject = JSON.stringify(billingData);
      // var csv = this.convertToCSV(jsonObject);
      // var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
      // var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      // if (navigator.msSaveBlob) { // IE 10+
      //     navigator.msSaveBlob(blob, exportedFilenmae);
      // } else {
      //     var link = document.createElement("a");
      //     if (link.download !== undefined) { // feature detection
      //         // Browsers that support HTML5 download attribute
      //         var url = URL.createObjectURL(blob);
      //         link.setAttribute("href", url);
      //         link.setAttribute("download", exportedFilenmae);
      //         link.style.visibility = 'hidden';
      //         document.body.appendChild(link);
      //         link.click();
      //         document.body.removeChild(link);
      //     }
      // }
    },

    convertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          if (line != "") line += ",";

          line += array[i][index];
        }

        str += line + "\r\n";
      }

      return str;
    },

    setTableConfigs() {
      this.parentDefaultSystemView.defaultTable.density =
        this.tableConfig.density;
      this.parentDefaultSystemView.defaultTable.pageSize =
        this.tableConfig.pageSize;
      this.parentDefaultSystemView.defaultTable.pageName =
        this.tableConfig.pageName;
      this.parentDefaultSystemView.defaultTable.sortField =
        this.tableConfig.sortField;
      this.parentDefaultSystemView.defaultTable.sortDirection =
        this.tableConfig.sortDirection;
      this.parentDefaultSystemView.defaultTable.columns =
        this.tableConfig.columns;
    },

    extractFieldNamesForSearchQuery(config) {
      for (let column of config.columns) {
        this.fieldNames.push(column.fieldName);
      }
    },

    // SDT functions end here

    createWorkOrder() {
      let issue = [];
      if ((new Set(this.issuesAssetObj).size === 1) === false) {
        this.showToast("Please select issue of Same Asset Name!", "error");
      } else if (this.issuesWorkobj.length > 0) {
        let workOrder = this.issuesWorkobj.map((issue) => {
          if (issue === "Not Assigned") {
            return true;
          } else {
          }
        });

        if (this.issuesStatus.length > 0) {
          issue = this.issuesStatus.map((issue) => {
            if (issue === "Ignored") {
              return true;
            } else {
            }
          });
        }

        if (workOrder[0] !== true) {
          this.showToast(
            "Please select issues that do not have a work order assigned to them!",
            "error"
          );
        } else if (issue[0] === true) {
          this.showToast("Selected Issue Status is ignored", "success");
        } else {
          this.getWorkOrders(this.assetUUID[0]);
          this.showCreateOrder = true;
        }
      }
    },

    getWorkOrders(assetUUID) {
      this.loaderFlag = true;
      workOrderService
        .getAllWorkOrdersByAsset(assetUUID)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response);
            this.loaderFlag = false;
            let workOrders = [];
            stringOptionWorkOrderUUID = [];
            for (
              let index = 0;
              index < response.data.workOrders.length;
              index++
            ) {
              let workOrder = {};
              workOrder.label = response.data.workOrders[index].workOrderNumber;
              workOrder.value = response.data.workOrders[index].workOrderNumber;
              workOrder.uuid = response.data.workOrders[index].uuid;
              workOrders.push(workOrder);
              stringOptionWorkOrderUUID.push({ label: workOrder.value });
            }
            this.workOrders = workOrders;
            this.workOrderOpt = stringOptionWorkOrderUUID;
          } else {
            this.showToast("Error while getting work orders", "error");
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          } else {
            this.showToast("Error while getting work orders", "error");
          }
        });
    },

    existingWorkOrder() {
      this.existing = true;
      this.getWorkOrders(this.assetUUID[0]);
    },

    newWorkOrder() {
      this.existing = false;
      this.$router.push({
        name: "create-work-order",
        params: {
          issueuuid: this.issuesUUID,
          issuenumber: this.issuesNumber,
          assetUUID: this.assetUUID[0],
          createWorkOrder: true,
        },
      });
    },

    existingAddWorkOrder() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please Select Work Order Number", "error");
      } else {
        this.addIssuesInWorkOrder();
      }
    },

    onClearSelectedWorkOrder() {
      this.workOrderNumber = "";
      this.updateComp++;
    },

    addIssuesInWorkOrder() {
      //create an array of selected issues
      let index = stringOptionWorkOrderUUID.findIndex(
        (workOrder) => workOrder.label === this.workOrderNumber
      );
      let workOrderUUID = this.workOrders[index];
      let addIssueInWorkOrderRequest = {};
      let issues = [];
      for (let idx = 0; idx < this.issuesUUID.length; idx++) {
        let issue = {};
        issue.issueNumber = this.issuesNumber[idx];
        issue.issueUUID = this.issuesUUID[idx];
        issue.resolved = false;
        issue.recommendedAction = null;
        issues.push(issue);
      }
      addIssueInWorkOrderRequest.issues = issues;
      addIssueInWorkOrderRequest.workOrderUUID = workOrderUUID.uuid;
      workOrderService
        .addIssuesInWorkOrder(addIssueInWorkOrderRequest)
        .then((response) => {
          if (response.status === 200) {
            this.$router.push({
              name: "work-order",
              params: {
                toastFlag: true,
                toastType: "success",
                message: "WorkOrder created successfully",
              },
            });
          } else {
            this.showToast("Error while adding issues in work order", "error");
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.showToast("Error while adding issues in work order", "error");
          } else {
            this.showToast("An unexpected Error Occurred", "error");
          }
        });
    },

    cancel() {
      this.showCreateOrder = false;
      this.existing = false;
    },

    closeModal() {
      this.showCreateOrder = false;
      this.existing = false;
    },

    setStaticColumn() {
      let staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "Issue Number"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  created() {
    if (this.$route.params.toastFlag === true) {
      this.showToast(
        this.$route.params.toasstMessage,
        this.$route.params.toastType
      );
    }
    let d = new Date();
    d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();

    this.$cookie.set("userId", "anees", expires);
    document.title = this.$route.meta.title;
    let currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.currentUserDetails = currentUserDetails;
    // sending only first and last name for SDT
    let name = currentUserDetails.profile.username;
    if (name.includes("@")) {
      name = name.split("@");
      name = name[0];
    }
    this.parentSystemSettings.user = name;

    if (currentUserDetails === null) {
      localStorage.setItem("forceSignout", "yes");
      return;
    }

    // fetching configs
    let uuid = currentUserDetails.profile.organizationId;
    assetPersonnelService
      .getOrgConfigs(uuid, "tableConfigs")
      .then((response) => {
        console.log('ssssssssss',response.data.tableConfigs)
        let allConfigs = JSON.parse(response.data.tableConfigs);
        allConfigs = allConfigs.filter((data) => data.pageName === "ViewIssue")[0];
        this.tableConfig = allConfigs;
        this.extractFieldNamesForSearchQuery(this.tableConfig);
        this.setStaticColumn();
        this.setTableConfigs();
      })
      .catch((error) => {
        this.showToast(error.data.response, "error");
      });
     },

  computed: {
    cssVars() {
      return {
        "--th-primary": JSON.parse(localStorage.getItem("themeConfigs"))
          .primary,
        "--th-primaryText": JSON.parse(localStorage.getItem("themeConfigs"))
          .primaryText,
        "--th-secondary": JSON.parse(localStorage.getItem("themeConfigs"))
          .secondary,
        "--th-secondaryText": JSON.parse(localStorage.getItem("themeConfigs"))
          .secondaryText,
        "--th-fond-family": "Heebo",
      };
    },
    qBtnStyle() {
      return {
        background: "var(--th-secondary)",
        color: "var(--th-secondaryText)",
        "text-transform": "initial",
        // "width":"100%",
        float: "right",
      };
    },
  },

  validations: function () {
    return {
      workOrderNumber: { required },
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-page-grid {
  margin-top: 20px;
  padding: 8px 18px;
}

.selected-issues {
  font-size: 14px;
  margin-right: 5px;
  font-family: "Euclid Circular B";
}

.selected-issue-count {
  display: flex;
  width: 100%;
  justify-content: right;
}
</style>
