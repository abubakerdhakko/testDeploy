<template>
  <div>
    <div>
      <SButton
        title="Create Asset Group"
        pill
        outline
        small
        @click="assetGroupDialog()"
        v-width="200"
        v-padding="'0px'"
        style="float: right; margin-top: -36px"
      ></SButton>
    </div>
    <CreateAssetGroup
      v-if="viewAssetGroupDialog"
      :assetCategoryOptions="assetCategoryOptions"
      @close="closeAssetGroupDialog"
      @assetGroupObj="createAssetGroup"
      @showToast="showToast"
    />
    <EditAssetGroup
      v-if="updateAssetGroupDialog"
      :assetCategoryOptions="assetCategoryOptions"
      :groupUUID="groupuuid"
      @close="closeUpdateAssetGroupDialog"
      @assetGroupObj="editAssetGroup"
      :editGroupObj="editGroupsObject"
      :key="assetgroupUpdate"
    />
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
import CreateAssetGroup from "./CreateAssetGroup.vue";
import EditAssetGroup from "./components/EditAssetGroup";
import { AssetManagementService } from "../../services/AssetManagementService";
import Endpoints from "../../services/EndPoints";
import moment from "moment";
import DeleteDialog from "../../components/DeleteDialog";
import ArchiveDialog from "../../components/ArchiveDialog";

import loader from "@/components/Loader.vue";

export default {
  name: "AssetGroup",

  data() {
    return {
            /* Toast Properties */
      toastTimeOut: 3000,
      toastMessage: "",
      toastType: "",
      toastFlag: 0,
      /* Toast Properties */
      isActive: false,
      loaderFlag: false,
      deleteInspectionDialog: false,
      archiveInspectionDialog: false,
      viewAssetGroupDialog: false,
      updateAssetGroupDialog: false,
      groupuuid: "f187db04-94b1-4012-a3eb-86d1e4c53bb5",
      user: "",
      username: "",
      isLoadingPage: false,
      isLoading: false,
      prompt: false,
      promptViewName: "",
      serverData: "",
      filterFieldList: [],
      eventData: "",
      assetgroupUpdate: 0,
      editGroupsObject: "",
      // ------------- Assets Group SDT Data START ----------------

      sdt_token: JSON.parse(localStorage.getItem("currentUserDetails"))
        .access_token,
      parentSystemSettings: {
        serviceURL: Endpoints.preferenceService.preference,
        buttons: [],
        searchValue: "",
        height: "950px",
        selectionColumn: false,
        selectType: "",
        moreOptions: [],
        actionsOptions: ["Edit", "Archive", "Delete"],
        columnIcons: [],
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
          density: "sm",
          pageSize: "50",
          pageName: "asset-group",
          user: JSON.parse(localStorage.getItem("currentUserDetails")).profile
            .username,
          defaultViewFlag: true,
          sortField: "dateCreated",
          sortDirection: "asc",
          tileFlag: true,
          position: 1, // always pass 1
          privacy: "private",
          columns: [],
        },
      },
      parentData: [],
      filterCount: "",
      sdtData: "",
      fieldNames: [],
      // ------------- Assets Group SDT Data END ----------------
    };
  },

  props: {
    configs: { required: true },
    editGroupObj: {},
  },

  methods: {
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },

    closeDialog() {
      this.deleteInspectionDialog = false;
      this.archiveInspectionDialog = false;
    },
    archiveDialog() {
      AssetManagementService.archiveAssetGroup(this.groupuuid, "archive")
        .then((res) => {
          alert(res.data.description);
          this.archiveInspectionDialog = false;
          this.loadTable(this.sdtData);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteDialog() {
      console.log(this.assetUUID);
      AssetManagementService.deleteAssetGroup(this.groupuuid, "delete")
        .then((res) => {
          alert(res.data.description);
          this.deleteInspectionDialog = false;
          this.loadTable(this.sdtData);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    createAssetGroup(value) {
      console.log(value);
      this.loaderFlag = true;
      AssetManagementService.addAssetGroup(value).then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.loaderFlag = false;
          alert("Successfully Created Asset Group");
          this.closeAssetGroupDialog();
          this.loadTable(this.sdtData);
        }
      });
    },

    editAssetGroup(value) {
      this.loaderFlag = true;
      AssetManagementService.editAssetGroup(value).then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.loaderFlag = false;
          alert("Successfully Update Asset Group");
          this.closeUpdateAssetGroupDialog();
          this.loadTable(this.sdtData);
        }
      });
    },

    catchDeparture: function(data) {
      this.sdtData = data;
      if (data.status == 1 || data.status == 3) {
        this.loadTable(data);
      } else if (data.status == 4) {
        this.loadTable(data);
      } else if (data.status == 10) {
      }
    },

    assetGroupDialog() {
      this.viewAssetGroupDialog = true;
    },

    closeAssetGroupDialog() {
      this.viewAssetGroupDialog = false;
    },

    assetUpdateGroupDialog() {
      this.updateAssetGroupDialog = true;
    },

    closeUpdateAssetGroupDialog() {
      this.updateAssetGroupDialog = false;
    },

    setTableConfigs() {
      this.parentDefaultSystemView.defaultTable.density = this.tableConfigs.density;
      this.parentDefaultSystemView.defaultTable.pageSize = this.tableConfigs.pageSize;
      this.parentDefaultSystemView.defaultTable.pageName = this.tableConfigs.pageName;
      this.parentDefaultSystemView.defaultTable.sortField = this.tableConfigs.sortField;
      this.parentDefaultSystemView.defaultTable.sortDirection = this.tableConfigs.sortDirection;
      this.parentDefaultSystemView.defaultTable.columns = this.tableConfigs.columns;
    },

    extractFieldNamesForSearchQuery(config) {
      for (let column of config.columns) {
        this.fieldNames.push(column.fieldName);
      }
    },

    loadTable(sdtData) {
      this.loaderFlag = true;
      let filters = [];
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

      let requestObject = {
        searchQuery: sdtData.data.searchQuery,
        filters: filters,
        sortField: sdtData.data.sortField,
        sortDirection: sdtData.data.sortDirection,
        offset: sdtData.data.offset,
        limit: sdtData.data.limit,
        tenantUUID: JSON.parse(localStorage.getItem("currentUserDetails"))
          .profile.organizationId,
        fieldNames: this.fieldNames,
      };

      AssetManagementService.getPaginatedAssetsGroupForSDT(requestObject)
        .then((response) => {
          let data = response.data.sdtData.content;
          for (let item of data) {
            item.createdAt = moment
              .utc(item.createdAt)
              .local()
              .format('DD/MM/YYYY hh:mm a');
          }
          this.parentData = data;
          let eventData = {
            data: this.parentData,
            totalElements: response.data.sdtData.totalElements,
            totalPages: response.data.sdtData.totalPages,
            pageNumber: sdtData.data.offset + 1,
          };
          this.$refs.test.dataLoadEvent(eventData);
          this.loaderFlag = false;
        })
        .catch((error) => {
          // alert(error);
        });
    },

    getActionsOption(val) {
      if (val.value == "View") {
        this.$router.push({
          name: "view-asset",
          params: {
            groupUUID: val.row.uuid,
          },
        });
      } else if (val.value == "Edit") {
        this.groupuuid = val.row.uuid;
        this.getAssetGroupbyUUID(this.groupuuid);
        this.loaderFlag = true;
        this.isActive = true;
      } else if (val.value == "Archive") {
        this.groupuuid = val.row.uuid;
        this.archiveInspectionDialog = true;
      } else if (val.value == "Delete") {
        this.groupuuid = val.row.uuid;
        this.deleteInspectionDialog = true;
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

    getAssetGroupbyUUID(id) {
      AssetManagementService.getAssetGroup(id)
        .then((response) => {
          if (response.status === 200) {
            this.editGroupsObject = response.data;
            this.assetgroupUpdate++;
            this.loaderFlag = false;
            this.updateAssetGroupDialog = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
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

    setStaticColumn() {
      let staticCol = this.tableConfigs.columns.filter(
        (col) => col.labelName == "Group Name"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfigs.columns.length; i++) {
        if (this.tableConfigs.columns[i].labelName == staticCol.labelName) {
          this.tableConfigs.columns.splice(i, 1);
        }
      }
    },
  },

  components: {
    CreateAssetGroup,
    EditAssetGroup,
    ArchiveDialog,
    DeleteDialog,
    loader,
  },

  created() {
    document.title = this.$route.meta.title;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );

    // sending only first and last name for SDT
    let name = this.currentUserDetails.profile.username;
    if (name.includes("@")) {
      name = name.split("@");
      name = name[0];
    }
    this.parentSystemSettings.user = name;

    AssetManagementService.getAllAssetCategories(
      this.currentUserDetails.profile.organizationId
    ).then((response) => {
      this.assetCategoryOptions = response.data.categories;
    });
    this.tableConfigs = this.configs;
    this.extractFieldNamesForSearchQuery(this.tableConfigs);
    this.setStaticColumn();
    this.setTableConfigs();
  },
};
</script>

<style lang="scss" scoped></style>
