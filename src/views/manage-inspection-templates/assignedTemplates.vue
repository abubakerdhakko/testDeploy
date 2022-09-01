<template>
  <div>
    <!-- <div class="pt-32 mb-32">
			<span class="head-title">Manage Templates</span><br />
			<span class="subtitle"
				>View all the information related to Inspection Template</span
			>
		</div> -->
    <!-- <SButton
			title="Create Inspection Template"
			pill
			outline
			small
			@click="openCreateInspectionTemplate()"
			v-width="200"
			style="float: right"
		></SButton> -->

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
    <TemplateAssignment
      :tempObj="tempObj"
      v-if="tempAssignment"
      :assignedTemplateObj="assignedTemplateObj"
      @updateAssignedTemplate="updateAssignedTemplate"
      @close="close"
    />
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

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import assetPersonnelService from "../../services/AssetPersonnelService";
import inspectionService from "../../services/InspectionService";
import Endpoints from "../../services/EndPoints";
import TemplateAssignment from "../../views/manage-inspection-templates/components/TemplateAssignment";
import moment from "moment";
import DeleteDialog from "../../components/DeleteDialog";
import ArchiveDialog from "../../components/ArchiveDialog";

import loader from "@/components/Loader.vue";
export default {
  name: "InspectionTemplates",
  components: {
    TemplateAssignment,
    DeleteDialog,
    ArchiveDialog,
    loader,
  },
  data() {
    return {
      loaderFlag: false,
      inspectionID: "",
      deleteInspectionDialog: false,
      archiveInspectionDialog: false,
      resetTable: 0,
      tempAssignment: false,
      tempObj: "",
      assignedTemplateObj: "",
      indexKey: 0,
      user: "",
      editFlag: false,
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
        actionsOptions: ["View", "Edit", "Delete", "Archive"],
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
    };
  },

  methods: {
    updateAssignedTemplate(obj) {
      this.loaderFlag = true;
      inspectionService
        .updateAssignScheduleInspectionTemplate(obj)
        .then((res) => {
          this.loaderFlag = true;
          alert("Assigned Template Updated successfully");
          this.close();
          this.resetTable++;
        })
        .catch((e) => {
          alert("Error occured while Assigning Template");
          console.log(e);
        });
    },
    closeDialog() {
      this.deleteInspectionDialog = false;
      this.archiveInspectionDialog = false;
    },

    deleteDialog() {
      this.deleteInspectionDialog = false;
      this.loaderFlag = true;
      inspectionService
        .deleteInspectionTemplateByUUID(this.inspectionID, "delete")
        .then((response) => {
          if (response.status == 200) {
            this.loaderFlag = false;
            this.resetTable++;
            alert("Inspection Template Deleted Successfully");
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            alert(error.response.data.description + " " + "error");
          } else {
            alert("An unexpected Error Occurred." + " " + "error");
          }
        });
    },

    archiveDialog() {
      this.archiveInspectionDialog = false;
      this.loaderFlag = true;
      inspectionService
        .deleteInspectionTemplateByUUID(this.inspectionID, "archive")
        .then((response) => {
          if (response.status == 200) {
            this.loaderFlag = false;
            this.setTableConfigs();
            this.resetTable++;
            alert("Inspection Template Archived Successfully");
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            alert(error.response.data.description + " " + "error");
          } else {
            alert("An unexpected Error Occurred." + " " + "error");
          }
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

    catchDeparture: function (data) {
      // console.log("data", data);
      // debugger
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
      // for (let index = 0; index < sdtData.message.length; index++) {
      // 	if (sdtData.message[index].fieldName.includes("#")) {
      // 		let name = sdtData.message[index].fieldName;
      // 		name = name.split("#");
      // 		name = name[0];
      // 		sdtData.message[index].fieldName = name;
      // 	}
      // 	if (sdtData.message[index].filterValue !== "") {
      // 		filters.push({
      // 			fieldName: sdtData.message[index].fieldName,
      // 			fieldType: sdtData.message[index].fieldType,
      // 			filterValue: sdtData.message[index].filterValue,
      // 			secondValue: sdtData.message[index].secondValue,
      // 			comparisonType: sdtData.message[index].comparisonType,
      // 		});
      // 	}
      // }

      //if (sdtData.data.offset !== 0)
      //sdtData.data.offset = sdtData.data.offset - 1;

      this.getPaginatedInspectionTemplates(
        filters,
        sdtData.data.sortField,
        sdtData.data.sortDirection,
        sdtData.data.offset,
        sdtData.data.limit
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
      limit
    ) {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );

      let requestObj = {
        // searchQuery: searchQuery,
        // searchColumns: searchColumns,
        filters: filters,
        sortField: sortField,
        sortDirection: sortDirection,
        offset: offset,
        limit: limit,
        tenantUUID: currentUserDetails.profile.organizationId,
        assigned: true,
      };
      inspectionService
        .getPaginatedInspectionTemplatesForSDT(requestObj)
        .then((response) => {
          if (response.status == 200) {
            response.data.sdtData.content.map((item) => {
              item.createdAt = moment.utc(item.createdAt).local().format();
            });

            let inspectionTemplates = response.data.sdtData.content;
            //	console.log(inspectionTemplates);
            response.data.sdtData.offset = offset + 1;
            this.loadSDT(response, inspectionTemplates);
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
            alert(error.response.data.description);
          }
        });
    },

    setStaticColumn() {
      let staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "Inspection Number"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      // for (let i = 0; i < this.tableConfig.columns.length; i++) {
      // 	if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
      // 		//  console.log("testssss", this.tableConfig.columns[i]);
      // 		this.tableConfig.columns.splice(i, 1);
      // 	}
      // }
    },

    // ------------ SDT Functions END --------------
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
    let uuid = currentUserDetails.profile.organizationId;

    assetPersonnelService
      .getOrgConfigs(uuid, "tableConfigs")
      .then((response) => {
        let allConfigs = JSON.parse(response.data.tableConfigs);
        this.tableConfig = allConfigs.filter(
          (data) => data.pageName === "assignedInspectionTemplate"
        )[0];
        // this.tableConfig.columns.map((column) => {
        // 	column.filters = [];
        // });
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

  computed: {},
};
</script>

<style lang="scss" scoped>
</style>
