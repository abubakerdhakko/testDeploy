<template>
  <div class="shark-data-table">
    <div class="pt-32 mb-32">
      <span class="head-title">Manage Templates</span><br />
      <span class="subtitle"
        >View all the information related to Inspection Template</span
      >
    </div>
    <div class="buttons-row">
      <SToggle
        v-model="templateType"
        :options="templateTypeOptions"
        :tabs="true"
        :background="'#ffffff'"
        style="margin-top: 0px !important"
        @selected="selectTemplateType"
      />
      <SButton
        v-if="selectedTemplate === 'generalized'"
        title="Create Inspection Template"
        pill
        outline
        small
        @click="openCreateInspectionTemplate()"
        v-width="210"
      ></SButton>
    </div>

    <div class="" v-if="this.tempAssignment == true">
        <div id="myModal" class="modal">         
          <div class="modal-content">
            <div class="pos_rel">
            <span class="close" @click="close">&times;</span>
            <GInspectionTemplates
              :tempObj="tempObj"
              @requestObj="TemplateAssignment"
              @showToast="showToast"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedTemplate === 'generalized'">
      <Sdt
        v-if="parentDefaultSystemView.defaultTable.columns.length > 0"
        :filteredDataCount="filterCount"
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
        :key="resetTable + '_inspectionTemplate'"
      />
    </div>

    <div v-if="selectedTemplate === 'archived'">
      <ArchivedTemplate :configs="archivedTemplatesConfigs" />
    </div>

    <!-- <TemplateAssignment
      :tempObj="tempObj"
      v-if="tempAssignment"
      @close="close"
      @requestObj="TemplateAssignment"
      @showToast="showToast"
    /> -->

    <DeleteDialog
      v-if="deleteInspectionDialog"
      @close="closeDialog"
      @deleteData="deleteDialog"
      @canceled="closeDialog"
    ></DeleteDialog>
    <ArchiveDialog
      v-if="archiveInspectionDialog"
      @close="closeDialog"
      @archiveData="archiveDialog"
      @canceled="closeDialog"
    ></ArchiveDialog>

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
import GInspectionTemplates from "../../components/G_InspectionTemplate.vue";
import assetPersonnelService from "../../services/AssetPersonnelService";
import inspectionService from "../../services/InspectionService";
import Endpoints from "../../services/EndPoints";
import TemplateAssignment from "../../views/manage-inspection-templates/components/TemplateAssignment";
import ArchivedTemplate from "./archivedTemplates.vue";
import moment from "moment";
import DeleteDialog from "../../components/DeleteDialog";
import ArchiveDialog from "../../components/ArchiveDialog";

import loader from "@/components/Loader.vue";
export default {
  name: "InspectionTemplates",
  components: {
    TemplateAssignment,
    GInspectionTemplates,
    DeleteDialog,
    ArchiveDialog,
    ArchivedTemplate,
    loader,
  },
  data() {
    return {
      schedulerName: "schedule",
      isActive: false,
      loaderFlag: false,
      orgConfigsResponse: null,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      templateType: "generalized",
      templateTypeOptions: [
        {
          label: "Generalized",
          value: "generalized",
        },
        {
          label: "Archived",
          value: "archived",
        },
      ],
      selectedTemplate: "generalized",
      inspectionID: "",
      deleteInspectionDialog: false,
      archiveInspectionDialog: false,
      resetTable: 0,
      tempAssignment: false,
      tempObj: "",
      user: "",
      // ------------- SDT Data START ----------------
      sdt_token: JSON.parse(localStorage.getItem("currentUserDetails"))
        .access_token,
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
        actionsOptions: ["View", "Assign", "Edit", "Delete", "Archive"],
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
          position: 1, // always pass 1
          privacy: "private",
          columns: [],
        },
      },
      parentData: [],
      filterCount: "",
      // ------------- SDT Data END ----------------
      inspections: [],
      sdtData: "",
      archivedTemplatesConfigs: "",
      fieldNames:[]
    };
  },

  methods: {
    closeDialog() {
      this.deleteInspectionDialog = false;
      this.archiveInspectionDialog = false;
    },
    deleteDialog() {
      this.deleteInspectionDialog = false;
      inspectionService
        .deleteInspectionTemplateByUUID(this.inspectionID, "delete")
        .then((response) => {
          if (response.status == 200) {
            this.showToast(response.data.description, "success");
            this.loadTable(this.sdtData);
          }
        })
        .catch((error) => {
          this.showToast("An unexpected Error Occurred.", "error");
        });
    },

    archiveDialog() {
      this.archiveInspectionDialog = false;
      inspectionService
        .deleteInspectionTemplateByUUID(this.inspectionID, "archive")
        .then((response) => {
          if (response.status == 200) {
            this.showToast(response.data.description, "success");
            this.loadTable(this.sdtData);
          }
        })
        .catch((error) => {
          this.showToast("An unexpected Error Occurred.", "error");
        });
    },
    close() {
      this.tempAssignment = false;
    },
    TemplateAssignment(obj) {
      this.isActive = true;
      this.loaderFlag = true;
      inspectionService
        .assignScheduleInspectionTemplate(obj)
        .then((res) => {
          this.tempAssignment = false;
          this.loaderFlag = false;
          this.isActive = false;
          this.showToast("Inspection Template Assigned Successfully", "success");
          this.loadTable(this.sdtData);
        })
        .catch((e) => {
          this.loaderFlag = false;
          this.showToast(e.data.description, "error");
        });
    },
    // ------------ SDT Functions START --------------
    openCreateInspectionTemplate() {
      this.$router.push({
        name: "create-inspection-template",
      });
    },
    getActionsOption(val) {
      if (val.value == "View") {
        this.$router.push({
          name: "inspection-template-detail",
          params: {
            templateUUID: val.row.inspectionUUID,
            assetUUID: val.row.assetUUID,
            TemplateType: "View",
            flag: true,
          },
        });
      }
      if (val.value == "Edit") {
        this.$router.push({
          name: "edit-inspection-template-detail",
          params: {
            templateUUID: val.row.inspectionUUID,
            assetUUID: val.row.assetUUID,
            TemplateType: "Edit",
            flag: false,
            disableFields: true,
          },
        });
      }
      if (val.value == "Delete") {
        this.deleteInspectionDialog = true;
        this.inspectionID = val.row.inspectionUUID;
      }
      if (val.value == "Archive") {
        this.archiveInspectionDialog = true;
        this.inspectionID = val.row.inspectionUUID;
      }
      if (val.value == "Assign") {
        this.tempAssignment = true;
        this.tempObj = val.row;
        this.tempObj.editFlag = false;
      }
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

    setStaticColumn() {
      let staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "Template Number"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }

      staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "Template Name"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }
    },

    extractFieldNamesForSearchQuery(config){
      for(let column of config.columns){
        this.fieldNames.push(column.fieldName)
      }
    },

    catchDeparture: function (data) {
      this.sdtData = data;
      this.loadTable(data);
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

      this.getPaginatedInspectionTemplates(
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
        totalElements: response.data.sdtData.totalElements,
        totalPages: response.data.sdtData.totalPages,
        pageNumber: response.data.sdtData.offset,
      };
      this.loaderFlag = false;
      this.$refs.test.dataLoadEvent(eventData);
    },

    getPaginatedInspectionTemplates(
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
        filters: filters,
        sortField: sortField,
        sortDirection: sortDirection,
        offset: offset,
        limit: limit,
        tenantUUID: currentUserDetails.profile.organizationId,
        searchQuery: searchQuery,
        fieldNames:this.fieldNames
      };
      inspectionService
        .getPaginatedInspectionTemplatesForSDT(requestObj)
        .then((response) => {

          if (response.status == 200) {
            response.data.sdtData.content.map((item) => {
              item.createdAt = moment.utc(item.createdAt).local().format('DD/MM/YYYY hh:mm a');
              item.lastUpdateDate = moment.utc(item.lastUpdateDate).local().format('DD/MM/YYYY hh:mm a');
            }
            );
            let inspectionTemplates = response.data.sdtData.content;
            response.data.sdtData.offset = offset + 1;
            this.loaderFlag = false;
            this.loadSDT(response, inspectionTemplates);
          } else {
            this.loading = false;
            this.showToast("Oops its look like our server is offline", "error");
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          }
        });
    },

    // ------------ SDT Functions END --------------

    selectTemplateType(obj) {
      this.selectedTemplate = obj.value;
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  computed: {
    loaderPosition: function () {
      return this.content["loaderPosition"]
        ? "fa-checkbox-marked"
        : "fa-checkbox-blank-outline";
    },
  },
  watch: {
    selectedTemplate: function (newVal, oldVal) {
      if (newVal === "archived") {
        let allConfigs = JSON.parse(this.orgConfigsResponse.data.tableConfigs);
        allConfigs = allConfigs.filter(
          (data) => data.pageName === "archivedInspectionTemplate"
        )[0];
        this.archivedTemplatesConfigs = allConfigs;
      }
    },
  },

  created() {
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
          (data) => data.pageName === "inspectionTemplate"
        )[0];
        this.extractFieldNamesForSearchQuery(this.tableConfig)
        this.setStaticColumn();
        this.setTableConfigs();
      })
      .catch((error) => {
        console.log("Error fetching configs", error);
      });
  },

  validations: function () {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.Req_Ins {
    position: absolute;
    top: -80px;
    left: 0px;
    z-index: 1;
}
.pos_rel {
  position: relative;
}
span.close {
    position: absolute;
    right: -36px;
    top: -37px;
    background-color: #000;
    border-radius: 100%;
    padding: 0px 8px;


}
.modal {
  position: fixed; /* Stay in place */
  z-index: 99; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: hidden; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 50px;
  border: 1px solid #888;
  width: 70%;
  max-width: 950px;
  max-height: 450px;
  overflow: scroll;
}

/* The Close Button */
.close {
color: #fff;
float: right;
font-size: 22px;
font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
