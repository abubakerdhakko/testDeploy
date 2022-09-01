<template>
  <div>
    <div class="" v-if="tempAssignment == true">
      <div id="myModal" class="modal">
        <div class="modal-content">
          <div class="pos_rel">
            <span class="close" @click="close">&times;</span>
            <GInspectionTemplates
              :tempObj="tempObj"
              v-if="tempAssignment"
              :assignedTemplateObj="assignedTemplateObj"
              @updateAssignedTemplate="updateAssignedTemplate"
              @close="close"
              :key="indexKey"
            />
          </div>
        </div>
      </div>
    </div>

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
    />
    <!-- <TemplateAssignment
      :tempObj="tempObj"
      v-if="tempAssignment"
      :assignedTemplateObj="assignedTemplateObj"
      @updateAssignedTemplate="updateAssignedTemplate"
      @close="close"
      :key="indexKey"
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
      v-if="toastFlag"
    />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import inspectionService from "../../services/InspectionService";
import Endpoints from "../../services/EndPoints";
import TemplateAssignment from "../../views/manage-inspection-templates/components/TemplateAssignment";
import GInspectionTemplates from "../../components/G_InspectionTemplate.vue";
import moment from "moment";
import DeleteDialog from "../../components/DeleteDialog";
import ArchiveDialog from "../../components/ArchiveDialog";

import loader from "@/components/Loader.vue";
export default {
  name: "InspectionTemplates",
  components: {
    DeleteDialog,
    ArchiveDialog,
    TemplateAssignment,
    GInspectionTemplates,
    loader,
  },
  data() {
    return {
      isActive: false,
      loaderFlag: false,
      toastFlag: false,
      toastMessage: "",
      toastType: "",
      inspectionID: "",
      deleteInspectionDialog: false,
      archiveInspectionDialog: false,
      tempAssignment: false,
      tempObj: "",
      user: "",
      indexKey: 0,
      assignedTemplateObj: "",
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
        actionsOptions: ["View", "Edit", "Delete"],
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
      fieldNames: [],
    };
  },

  props: {
    configs: { required: true },
    showToast: {
      type: Function,
    },
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
            this.$emit(
              "showToast",
              "Pending Inspection Deleted Successfully",
              "success"
            );
            this.loadTable(this.sdtData);
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.$emit("showToast", error.response.data.description, "error");
          } else {
            this.$emit("showToast", "An unexpected Error Occurred.", "error");
          }
        });
    },

    archiveDialog() {
      this.archiveInspectionDialog = false;
      inspectionService
        .deleteInspectionTemplateByUUID(this.inspectionID, "archive")
        .then((response) => {
          if (response.status == 200) {
            this.loadTable(this.sdtData);
            this.$emit(
              "showToast",
              "Pending Inspection Archived Successfully",
              "success"
            );
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.$emit("showToast", error.response.data.description, "error");
          } else {
            this.$emit("showToast", "An unexpected Error Occurred.", "error");
          }
        });
    },
    updateAssignedTemplate(obj) {
      this.isActive = true;
      this.loaderFlag = true;
      inspectionService
        .updateAssignScheduleInspectionTemplate(obj)
        .then((res) => {
          this.tempAssignment = false;
          this.$emit(
            "showToast",
            "Schedule Inspection updated Successfully",
            "success"
          );
          this.loaderFlag = false;
          this.loadTable(this.sdtData);
        })
        .catch((e) => {
          if (e.response !== undefined && e.response.status === 406) {
            this.$emit("showToast", e.response.data.description, "error");
          } else {
            this.$emit("showToast", "An unexpected Error Occurred.", "error");
          }
          this.loaderFlag = false;
        });
    },
    close() {
      this.tempAssignment = false;
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
          name: "view-assigned-template",
          params: {
            templateUUID: val.row.inspectionUUID,
            assetUUID: val.row.assetUUID,
            TemplateType: "View",
            flag: true,
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
      if (val.value == "Edit") {
        this.tempAssignment = true;
        this.tempObj = val.row;
        this.tempObj.editFlag = true;
      }
      if (val.value == "Assign") {
        this.tempAssignment = true;
        this.tempObj = val.row;
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
        (col) => col.labelName == "Inspection Number"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }
    },
    extractFieldNamesForSearchQuery(config) {
      config.columns.map((element) => {
        this.fieldNames.push(element.fieldName);
      });
    },

    catchDeparture: function (data) {
      // console.log("data", data);
      this.sdtData = data;
      if (data.status == 1 || data.status == 3) {
        this.loadTable(data);
      } else if (data.status == 4) {
        this.loadTable(data);
      } else if (data.status == 10) {
      }
    },

    loadTable(sdtData) {
      let filters = [];
      this.loaderFlag = true;
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
        searchQuery: searchQuery,
        // searchColumns: searchColumns,
        filters: filters,
        sortField: sortField,
        sortDirection: sortDirection,
        offset: offset,
        limit: limit,
        tenantUUID: currentUserDetails.profile.organizationId,
        assigned: true,
        fieldNames: this.fieldNames,
      };
      inspectionService
        .getPaginatedPendingInspectionReportsForSDT(requestObj)
        .then((response) => {
          if (response.status == 200) {
            response.data.sdtData.content.map((item) => {
              item.createdAt = moment
                .utc(item.createdAt)
                .local()
                .format("DD/MM/YYYY hh:mm a");
            });

            let inspectionTemplates = response.data.sdtData.content;
            response.data.sdtData.offset = offset + 1;
            this.loaderFlag = false;
            this.loadSDT(response, inspectionTemplates);
          } else {
            this.loading = false;
            this.$emit(
              "showToast",
              "Opps its look like our server is offline",
              "error"
            );
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.$emit("showToast", error.response.data.description, "error");
          }
        });
    },

    // ------------ SDT Functions END --------------

    getExistingInspectionTemplate(uuid) {
      let inspectionItem = null;
      inspectionService.getInspectionTemplateByUUID(uuid).then((response) => {
        if (response.status === 200) {
          inspectionItem = response.data.inspectionTemplate;
          this.assignedTemplateObj = inspectionItem;
          this.indexKey++;
        }
      });
    },
  },

  created() {
    document.title = this.$route.meta.title;
    let currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    if (currentUserDetails === null) {
      localStorage.setItem("forceSignout", "yes");
      return;
    }

    // fetching configs
    this.tableConfig = this.configs;
    this.extractFieldNamesForSearchQuery(this.tableConfig);
    this.setStaticColumn();
    this.setTableConfigs();
  },

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
// popup style start
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
// popup style end
</style>
