<template>
  <div class="shark-data-table">
    <div class="pt-32">
      <span class="head-title">Service Requests</span><br />
      <span class="subtitle"
        >View all the information related to service requests</span
      >
    </div>
    <div class="buttons-row">
     <SToggle
        v-model="serviceRequestType"
        :options="serviceRequestOptions"
        :tabs="true"
        :background="'#ffffff'"
        style="margin-top: 0px !important"
        @selected="selectServiceRequestType"
      />
      <SButton
        v-if="selectServiceRequest === 'service-request'"
        title="Create New"
        pill
        outline
        small
        @click="openServiceDialog()"
        class="btn"
        v-width="200"
        style="float: right"
      ></SButton>
    </div>
    <div v-if="selectServiceRequest === 'service-request'">
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
    
    <div v-if="selectServiceRequest === 'archived'">
      <ArchivedServiceRequest :configs="archivedConfigs"/>
    </div>
    <!-- Dialogs -->
    <AddServiceRequest
      v-if="addServiceDialog"
      @close="closeServiceDialog"
      @save="saveServiceRequestDialog"
    />
    <DeleteDialog
      v-if="deleteInspectionDialog"
      @close="closeDialog"
      @deleteData="deleteOrArchiveServiceRequests"
      @canceled="closeDialog"
    ></DeleteDialog>
    <ArchiveDialog
      v-if="archiveInspectionDialog"
      @close="closeDialog"
      @archiveData="deleteOrArchiveServiceRequests"
      @canceled="closeDialog"
    ></ArchiveDialog>
    <ignoreRequest
      v-if="IgnoreIssueValue"
      :modelInstruction="this.modelInstruction"
      @close="closeIgnoreIssue"
      @ignoreRequest="ignoreRequest"
    />
    
    <CreateIssue
      v-if="submitNewIssue"
      @close="closeNewIssue"
      @save="issueCreated"
      @updateSDT="updateSDTFunction"
      :serviceRequestDetail="this.serviceRequest"
      @toastFlag="displayMessageIssue"
    />
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
import assetPersonnelService from "../../services/AssetPersonnelService";
import inspectionService, {
  InspectionService,
} from "../../services/InspectionService";

import Endpoints from "../../services/EndPoints";
import moment from "moment";
import ArchivedServiceRequest from "./ArchivedServiceRequest.vue"
import AddServiceRequest from "../../components/AddServiceRequest";
import DeleteDialog from "../../components/DeleteDialog";
import ArchiveDialog from "../../components/ArchiveDialog";
import IgnoreRequest from "../../components/IgnoreRequest";
import CreateIssue from "../../components/CreateIssue";

import loader from "@/components/Loader.vue";
export default {
  name: "ServiceRequests",
  components: {
    AddServiceRequest,
    DeleteDialog,
    ArchiveDialog,
    IgnoreRequest,
    CreateIssue,
    loader,
    ArchivedServiceRequest
  },

  data() {
    return {
      archivedConfigs:null,
      serviceRequestType:"service-request",
      serviceRequestOptions:[
        {
          label: "Service Request",
          value: "service-request",
        },
        {
          label: "Archived",
          value: "archived",
        },
      ],
      selectServiceRequest:"service-request",
      loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      currentUserDetails: "",
      addServiceDialog: false,
      deleteInspectionDialog: false,
      archiveInspectionDialog: false,
      processType: "",
      uuid: "",
      IgnoreIssueValue: false,
      modelInstruction: "Ignore Service Request",
      serviceRequest: "",
      sdtData: "",
      submitNewIssue: false,
      updateSDT: false,
      // ------------- SDT Data START ----------------
      sdt_token: JSON.parse(localStorage.getItem("currentUserDetails"))
        .access_token,
      user: "",
      username: "",
      isLoadingPage: false,
      isLoading: false,
      prompt: false,
      promptViewName: "",
      serverData: "",
      filterFieldList: [],
      eventData: "",
      parentSystemSettings: {
        serviceURL: Endpoints.preferenceService.preference,
        // serviceURL: 'http://localhost:8099/preferences',
        buttons: [],
        searchValue: "",
        height: "950px",
        selectionColumn: false,
        selectType: "none",
        moreOptions: [],
        actionsOptions: [
          "View",
          "Edit",
          "Archive",
          "Delete",
          "Create Issue",
          "Ignore Request",
          // "Active",
        ],
        columnIcons: [],
        pillConfig: [
          { column: "", state: "success", data: "" },
          { column: "", state: "error", data: "" },
          { column: "", state: "normal", data: "" },
        ],
        staticColumns: [],
        user: JSON.parse(localStorage.getItem("currentUserDetails")).profile
          .username,
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
          columns: [],
          position: 1, // always pass 1
          privacy: "private",
        },
      },
      parentData: [],
      filterCount: "",
      fieldNames:[],
      orgConfigsResponse:null
      // ------------- SDT Data END ----------------
    };
  },

  methods: {
    selectServiceRequestType(obj){
      this.selectServiceRequest = obj.value;
    },

    issueCreated() {
      this.submitNewIssue = false;
      this.loadTable(this.sdtData);
    },

    displayMessage() {
      this.showToast("Service request created successfully", "success");
    },
    displayMessageIssue() {
      this.showToast("Issue Created Successfully", "success");
    },

    updateSDTFunction() {
      this.updateSDT = true;
      this.loadTable(this.sdtData);
    },

    closeDialog() {
      this.deleteInspectionDialog = false;
      this.archiveInspectionDialog = false;
    },

    saveServiceRequestDialog() {
      this.addServiceDialog = false;
      this.loaderFlag = false;
      this.showToast("Service Request Created Successfully.", "success");
      this.loadTable(this.sdtData);
    },

    closeNewIssue() {
      this.submitNewIssue = false;
    },

    openServiceDialog() {
      this.addServiceDialog = true;
    },

    closeServiceDialog() {
      this.addServiceDialog = false;
    },

    ignoreRequest(value) {
      let ignoreCommentsField = value;
      if (!ignoreCommentsField.value) {
        ignoreCommentsField.valid = false;
        ignoreCommentsField.validMessage = "Required!";
        this.ignoreCommentsField = ignoreCommentsField;
        return;
      }
      this.loaderFlag = true;
      let updateIssueRequest = {};
      let serviceRequest = this.serviceRequest;
      serviceRequest.status = "ignored";
      serviceRequest.reportedAt = moment(
        serviceRequest.reportedAt,
        "DD/MM/yyyy hh:mm a"
      ).toISOString();
      serviceRequest.ignoreComments = ignoreCommentsField.value;
      serviceRequest.ignoredBy =
        this.currentUserDetails.profile.firstName +
        " " +
        this.currentUserDetails.profile.lastName;
      updateIssueRequest.issueReporting = serviceRequest;
      InspectionService.updateIssue(updateIssueRequest)
        .then((response) => {
          try {
            if (response.status === 200) {
              this.loaderFlag = false;
              this.showToast(
                "Service request ignored successfully!",
                "success"
              );
              this.closeIgnoreIssue();
              this.loadTable(this.sdtData);
            } else {
              this.showToast(
                "Error while ignoring service request. Please try again",
                "error"
              );
            }
          } catch (e) {
            this.showToast(
              "Error while ignoring service request. Please try again",
              "error"
            );
          }
        })
        .catch((error) => {
          this.showToast("An unexpected Error Occurred.", "error");
        })
        .finally(() => {
          this.serviceRequest = serviceRequest;
        });
    },
    // ------------ SDT Functions START --------------

    getActionsOption(val) {
      if (val.value == "View") {
        this.$router.push({
          name: "service-requests-details",
          params: {
            serviceRequestUUID: val.row.uuid,
            serviceRequestChild: false,
            issueuuid: val.row.uuid,
            assetUUID: val.row.assetUUID,
            issuenumber: val.row.issueNumber,
            templateType: "viewIssue",
            flag: true,
            workOrderType: val.row.workOrderNumber,
          },
        });
      }
      if (val.value == "Edit") {
        if (
          val.row.status.toLowerCase() === "New".toLowerCase() ||
          val.row.status.toLowerCase() === "reported".toLowerCase() ||
          val.row.status.toLowerCase() === "Resolved".toLowerCase()
        ) {
          this.$router.push({
            name: "service-requests-edit",
            params: {
              serviceRequestUUID: val.row.uuid,
              serviceRequestChild: false,
              issueuuid: val.row.uuid,
              assetUUID: val.row.assetUUID,
              flag: false,
              status:val.row.status
            },
          });
        } else if (val.row.status.toLowerCase() === "Ignored".toLowerCase()) {
          this.$router.push({
            name: "service-requests-edit",
            params: {
              serviceRequestUUID: val.row.uuid,
              serviceRequestChildUUID: false,
              parentUUID: "",
              issueuuid: val.row.uuid,
              assetUUID: val.row.assetUUID,
              flag: true,
              status:val.row.status
            },
          });
        } else {
          this.showToast(
            "You can only edit reported and new service request",
            "error"
          );
        }
      }
      if (val.value == "Ignore Request") {
        this.serviceRequest = val.row;
        if (val.row.status.toLowerCase() == "New".toLowerCase()) {
          this.IgnoreIssueValue = true;
        } else {
          this.showToast("You can only ignore new service request", "error");
        }
      }
      if (val.value == "Create Issue") {
        this.serviceRequest = val.row;
        if (val.row.status.toLowerCase() == "New".toLowerCase()) {
          this.submitNewIssue = true;
        } else {
          this.showToast(
            "You can only create issue with new service request",
            "error"
          );
        }
      }

      if (val.value === "Archive") {
        if (val.row.status === "In Progress") {
          this.showToast(
            "In progress Service Request cannot be Archive.",
            "error"
          );
          return;
        }
        this.archiveInspectionDialog = true;
        this.uuid = val.row.uuid;
        this.processType = "archive";
        //	this.deleteOrArchiveServiceRequests(val.row.uuid,"archive")
      }

      if (val.value === "Delete") {
        if (val.row.status === "In Progress") {
          this.showToast(
            "In progress Service Request cannot be Delete.",
            "error"
          );
          return;
        }
        this.deleteInspectionDialog = true;
        this.uuid = val.row.uuid;
        this.processType = "delete";
        //	this.deleteOrArchiveServiceRequests(val.row.uuid,"delete")
      }
    },

    closeIgnoreIssue() {
      this.IgnoreIssueValue = false;
    },

    convertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var element of array) {
        var line = "";
        for (var index in element) {
          if (line != "") line += ",";

          line += element[index];
        }

        str += line + "\r\n";
      }

      return str;
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

    // exportCSVFile(headers, billingData, fileTitle) {
    //     // if (headers) {
    //     //     billingData.unshift(headers);
    //     // }

    //     // // Convert Object to JSON
    //     // var jsonObject = JSON.stringify(billingData);

    //     // var csv = this.convertToCSV(jsonObject);

    //     // var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    //     // var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //     // if (navigator.msSaveBlob) { // IE 10+
    //     //     navigator.msSaveBlob(blob, exportedFilenmae);
    //     // } else {
    //     //     var link = document.createElement("a");
    //     //     if (link.download !== undefined) { // feature detection
    //     //         // Browsers that support HTML5 download attribute
    //     //         var url = URL.createObjectURL(blob);
    //     //         link.setAttribute("href", url);
    //     //         link.setAttribute("download", exportedFilenmae);
    //     //         link.style.visibility = 'hidden';
    //     //         document.body.appendChild(link);
    //     //         link.click();
    //     //         document.body.removeChild(link);
    //     //     }
    //     // }
    // },

    setTableConfigs() {
      this.parentDefaultSystemView.defaultTable.density = this.tableConfig.density;
      this.parentDefaultSystemView.defaultTable.pageSize = this.tableConfig.pageSize;
      this.parentDefaultSystemView.defaultTable.pageName = this.tableConfig.pageName;
      this.parentDefaultSystemView.defaultTable.sortField = this.tableConfig.sortField;
      this.parentDefaultSystemView.defaultTable.sortDirection = this.tableConfig.sortDirection;
      this.parentDefaultSystemView.defaultTable.columns = this.tableConfig.columns;
    },

    extractFieldNamesForSearchQuery(config){
        config.columns.map(element => {
          this.fieldNames.push(element.fieldName)
        });
    },

    catchDeparture: function(data) {
      this.sdtData = data;
      this.loadTable(this.sdtData);
    },

    loadTable(sdtData) {
      let filters = [];
      this.loaderFlag = true;
      for (let sdt_data of sdtData.message) {
        if(sdt_data.fieldName !== "actions" ){
          let newDate = "";
          if(sdt_data.fieldType === "date" && sdt_data.filterValue !== ""){
            let date = sdt_data.filterValue.toLowerCase();
            date = date.split("/");
            newDate = new Date(`${date[1]}/${date[0]}/${date[2]}`)
          }
          if(sdt_data.filterValue === null){
            sdt_data.filterValue = ""
          }
          filters.push({
            fieldName: sdt_data.fieldName,
            fieldType: sdt_data.fieldType,
            filterValue:newDate === null || newDate === "" ? sdt_data.filterValue: newDate.getTime(),
            secondValue: sdt_data.secondValue,
            comparisonType: sdt_data.comparisonType,
          });
        }
      }

      this.getPaginatedServiceRequests(
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

    getPaginatedServiceRequests(
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
        fieldNames:this.fieldNames,
        archived:false
      };

      inspectionService.getPaginatedServiceRequests(requestObj)
        .then((response) => {
          if (response.status === 200) {
            response.data.issueReportings.offset = offset;
            let serviceRequests = response.data.issueReportings.content;
            if (serviceRequests.length === 0) {
              this.loaderFlag = false;
              this.loadSDT(response,serviceRequests)
              return
            }
            for (let service_request of serviceRequests) {
              service_request.reportedAt = moment
                .utc(service_request.reportedAt)
                .local()
                .format('DD/MM/YYYY hh:mm a');
              service_request.title = service_request.title
                ? service_request.title
                : service_request.issueName;
              if (!service_request.title) {
                service_request.title = service_request.issueDescription;
              }
            }
            response.data.issueReportings.offset = offset + 1;
            this.loadSDT(response, serviceRequests);
            this.loaderFlag = false;
          } else {
            this.loading = false;
            this.$q.notify({
              message: "Opps its look like our server is offline",
              color: "negative",
            });
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          } else {
            this.showToast("Oops it looks like our server is offline", "error");
          }
        });
    },

    setStaticColumn() {
      // let staticCol = this.tableConfig.columns.filter(
      //   (col) => col.labelName == "Asset Name"
      // )[0];

      // this.parentSystemSettings.staticColumns.push(staticCol);

      // for (let i = 0; i < this.tableConfig.columns.length; i++) {
      //   if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
      //     this.tableConfig.columns.splice(i, 1);
      //   }
      // }

      let staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "SR Number"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }
    },


    // ------------ SDT Functions END --------------,
    deleteOrArchiveServiceRequests() {
      this.deleteInspectionDialog = false;
      this.archiveInspectionDialog = false;
      InspectionService.deleteOrArchiveServiceRequest(
        this.uuid,
        this.processType
      )
        .then((response) => {
          if (response.status === 200) {
            if (this.processType === "archive") {
              this.showToast(
                "Service Request Archived Successfully.",
                "success"
              );
              this.loadTable(this.sdtData);
            } else {
              this.showToast(
                "Service Request Deleted Successfully.",
                "success"
              );
              this.loadTable(this.sdtData);
            }
          }
        })
        .catch((error) => {
          this.showToast(error.data.description, "error");
        });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  mounted() {
    document.title = this.$route.meta.title;
    if (this.$route.params.toastFlag === true) {
      this.showToast(
        this.$route.params.message,
        this.$route.params.toastSuccess
      );
    }
    let currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.currentUserDetails = currentUserDetails;
    if (currentUserDetails === null) {
      localStorage.setItem("forceSignout", "yes");
      return;
    }

    // fetching configs
    let uuid = currentUserDetails.profile.organizationId;

    assetPersonnelService
      .getOrgConfigs(uuid, "tableConfigs")
      .then((response) => {
        this.orgConfigsResponse = response;
        let allConfigs = JSON.parse(response.data.tableConfigs);
        this.tableConfig = allConfigs.filter(
          (data) => data.pageName === "ServiceRequest"
        )[0];
        this.extractFieldNamesForSearchQuery(this.tableConfig);
        this.setStaticColumn();
        this.setTableConfigs();
      })
      .catch((error) => {
        this.showToast("Error fetching configs", "error");
      });
  },

  validations: function() {
    return {};
  },

  watch: {
    serviceRequestType: function (newVal, oldVal) {
      if (newVal === "archived") {
        let allConfigs = JSON.parse(this.orgConfigsResponse.data.tableConfigs);
        allConfigs = allConfigs.filter(
          (data) => data.pageName === "archivedServiceRequest"
        )[0];
        this.archivedConfigs = allConfigs;
      }
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped></style>
