<template>
  <div class="shark-data-table pt-32 pb-80">
    <div style="margin-bottom: 40px">
      <span class="head-title">{{
        assetOption === "asset"
          ? "Asset Category Templates"
          : "Asset Category Archived Templates"
      }}</span
      ><br />
      <span class="subtitle"
        >View all the information related to archived assets category templates</span
      >
    </div>

    <div class="buttons-row">
      <SToggle
        v-model="assetType"
        :options="assetOptions"
        :tabs="true"
        :background="'#ffffff'"
        style="margin-top: 0px !important"
        @selected="selectAssetType"
      />
      <div style="display: flex">
        <SButton
          v-if="assetOption === 'asset'"
          title="Create Asset Category Template"
          pill
          outline
          small
          @click="createAssetCateTemplate()"
          v-width="210"
        ></SButton>
        <SButton
          v-if="assetOption === 'asset-group'"
          title="Create Asset Category"
          pill
          outline
          small
          @click="openCreateCategory()"
          v-width="210"
        ></SButton>
      </div>
    </div>

    <div v-if="assetOption === 'asset'">
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
        :actionsButton="true"
        :moreButton="false"
        ref="test"
        v-on:clicked-option="getActionsOption"
        v-on:download-as-option="getDownloadAsOption"
      />
    </div>
    <div v-if="assetOption === 'archivedAssets'">
      <ArchivedCateTemplate :configs="archivedAssetsConfigs" />
    </div>
    <!-- <div v-if="assetOption === 'asset-group'">
      <AssetGroup :configs="assetGroupConfigs" @showToast="showToast" />
    </div> -->

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

    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      :key="toastFlag + 'toast'"
    />
  </div>
</template>

<script>
import Endpoints from "../../services/EndPoints";
import assetPersonnelService from "../../services/AssetPersonnelService";
import { AssetManagementService } from "../../services/AssetManagementService";

import DeleteDialog from "../../components/DeleteDialog";
import ArchiveDialog from "../../components/ArchiveDialog";
import ArchivedCateTemplate from "./components/ArchivedCateTemplate.vue";
import moment from "moment";

import loader from "@/components/Loader.vue";

export default {
  name: "Assets",

  components: {
    DeleteDialog,
    ArchiveDialog,
    loader,
    ArchivedCateTemplate,
  },

  data() {
    return {
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      deleteInspectionDialog: false,
      archiveInspectionDialog: false,
      newIssue: false,
      addServiceDialog: false,
      assetUUID: "",
      resetTable: 0,
      assetObj: "",
      // ------------- Assets SDT Data START ----------------
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
      indexKey: 0,
      parentSystemSettings: {
        serviceURL: Endpoints.preferenceService.preference,
        // serviceURL: "http://localhost:8099/preferences",
        buttons: [],
        searchValue: "",
        height: "950px",
        selectionColumn: true,
        selectType: "checkbox",
        moreOptions: [],
        actionsOptions: [
          "View",
          "Edit",
          "Add Category",
          "Archive",
          "Delete",
        ],
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
          pageName: "assets",
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
      // ------------- Assets SDT Data END ----------------

      inspections: [],
      orgConfigsResponse: null,
      assetType: "asset",
      assetOptions: [
        {
          label: "Templates",
          value: "asset",
        },
        {
          label: "Archived",
          value: "archivedAssets",
        },
      ],

      assetOption: "asset",
      currentUserDetails: "",
      assetCategoryOptions: [],
      viewAssetGroupDialog: false,
      assetGroupConfigs: "",
      archivedAssetsConfigs: "",
      tableConfig2: null,
      currency: "",
      sdtData: "",
      openAddPopUp: false,
      exportFlag: false,
      opt: [],
      openUpdatePopUp: false,
      importType: "Add",
      fieldNames: [],
      columns: [],
    };
  },

  methods: {
    createAssetCateTemplate() {
      this.$router.push({
        name: "create-asset-category-template",
      });
    },
    openCreateCategory() {
      this.$router.push({
        name: "create-asset-category",
      });
    },

    importOption(val) {
      if (val === "add") {
        this.openAddPopUp = true;
        this.importType = "Add";
      } else if (val === "update") {
        this.openAddPopUp = true;
        this.importType = "Update";
      } else if (val === "existing") {
        this.$router.push({ name: "existing-templates" });
      } else if (val === "history") {
        this.$router.push({ name: "last-import-records" });
      }
    },

    closeAddPopup() {
      this.openAddPopUp = false;
    },

    refreshTable() {
      this.openAddPopUp = false;
      this.loadTable(this.sdtData);
    },

    closeDialog() {
      this.deleteInspectionDialog = false;
      this.archiveInspectionDialog = false;
      this.exportFlag = false;
    },
    displayMessage() {
      this.showToast("Issue Created Successfully.", "success");
    },
    deleteDialog() {
      this.deleteInspectionDialog = false;
            this.loader=false
      AssetManagementService.archiveOrDeleteAssetCateTemplate(this.assetUUID, "delete")
        .then((response) => {
          if (response.status === 200) {
            this.loadTable(this.sdtData);
            this.showToast("Template Asset Deleted Successfully", "success");
            this.deleteInspectionDialog = false;
            this.loader=false
          }
        })
        .catch((error) => {
          this.showToast(error, "error");
        });
    },

    archiveDialog() {
      this.archiveInspectionDialog = false;
      this.loader=false
      AssetManagementService.archiveOrDeleteAssetCateTemplate(this.assetUUID, "archived")
        .then((response) => {
          if (response.status === 200) {
            this.loadTable(this.sdtData);
            this.showToast("Template Archived Successfully", "success");
            this.archiveInspectionDialog = false;
            this.loader=false
          }
        })
        .catch((error) => {
          this.showToast(error, "error");
        });
    },
    // ------------ Assets SDT Functions START --------------

    getActionsOption(val) {
      if (val.value == "View") {
        this.$router.push({
          name: "detail-asset-category-template",
          params: {
            viewFlag: true,
            assetCateTemplateID: val.row.uuid,
          },
        });
      } else if (val.value == "Edit") {
        this.$router.push({
          name: "edit-asset-category-template",
          params: {
            editFlag: true,
            assetCateTemplateID: val.row.uuid,
          },
        });
      } else if (val.value == "Add Category") {
        this.$router.push({
          name: "create-asset-category",
          params: {
            addCateFlag: true,
            assetCateTemplateID: val.row.uuid,
          },
        });
      }
       else if (val.value == "Archive") {
        this.assetUUID = val.row.uuid;
        this.archiveInspectionDialog = true;
      } else if (val.value == "Delete") {
        this.assetUUID = val.row.uuid;
        this.deleteInspectionDialog = true;
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
      if (opt.rows == "") {
        this.showToast("Please Select Record(s)", "warning");
      } else {
        if (opt.option == "pdf") {
          this.loaderFlag = true;
          // adding customer details
          let obj = {
            rows: opt.rows,
            option: opt.option,
            organizationId: this.currentUserDetails.profile.organizationId,
            organizationName: "Erohal",
            columns: this.columns,
          };

          let object = obj.rows;
          obj.rows = object;
          AssetManagementService.downloadSelectedPDF(obj).then((res) => {
            this.loaderFlag = false;
            let fileContents = null;
            let popupWin = null;
            popupWin = window.open(
              "",
              "_blank",
              "top=0,left=0,height=700,width=1000;"
            );
            let document = {
              documentName: "Assets",
            };
            fileContents = res.data.type + res.data.content;
            popupWin.document.write(`
            <html>
                <head>
                 <!--title>Print tab</title-->
                    <style>
                        #buttons{display:none;}
                         body {
                            margin: 0;
                            font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Euclid Circular B, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                            font-size: 1rem;
                            font-weight: 400;
                            line-height: 1.5;
                            color: #212529;
                            text-align: left;
                            background-color: #fff;
                        }
                        button, meter, progress {
                            -webkit-writing-mode: horizontal-tb !important;
                        }
                        input, textarea, select, button {
                            text-rendering: auto;
                            color: initial;
                            letter-spacing: normal;
                            word-spacing: normal;
                            text-transform: none;
                            text-indent: 0px;
                            text-shadow: none;
                            display: inline-block;
                            text-align: start;
                            margin: 0em;
                            font: 400 13.3333px Arial;
                        }
                        input[type="button" i], input[type="submit" i], input[type="reset" i], input[type="file" i]::-webkit-file-upload-button, button {
                            align-items: flex-start;
                            text-align: center;
                            cursor: default;
                            color: buttontext;
                            background-color: buttonface;
                            box-sizing: border-box;
                            padding: 2px 6px 3px;
                            border-width: 2px;
                            border-style: outset;
                            border-color: buttonface;
                            border-image: initial;
                        }
                        input, button, select, optgroup, textarea {
                            margin: 0;
                            font-family: inherit;
                            font-size: inherit;
                            line-height: inherit;
                        }
                        button, select {
                            text-transform: none;
                        }
                        .btn {
                            display: inline-block;
                            font-weight: 400;
                            text-align: center;
                            white-space: nowrap;
                            vertical-align: middle;
                            -webkit-user-select: none;
                            -moz-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            border: 1px solid transparent;
                            padding: 0.375rem 0.75rem;
                            font-size: 1rem;
                            line-height: 1.5;
                            border-radius: 0.25rem;
                            transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                        }
                        .btn-outline-primary {
                            color: #007bff;
                            background-color: transparent;
                            background-image: none;
                            border-color: #007bff;
                        }
                        .btn-outline-primary {
                            color: #ffffff;
                            border-color: #d03232;
                            background-color: #d03232;
                        }
                        element.style {
                        }
                        <style>.fa {
                            display: inline-block;
                            font: normal normal normal 14px/1 FontAwesome;
                            font-size: inherit;
                            text-rendering: auto;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                        }</style>
                        <style>*, *::before, *::after {
                            box-sizing: border-box;
                        }
                        Style Attribute {
                            cursor: pointer;
                        }
                        .btn, .form-control {
                            padding: 0.25rem 0.5rem;
                            font-size: 0.875rem;
                            line-height: 1.5;
                            border-radius: 0.3rem;
                            margin: 15px;
                            margin-right: 23px;
                        }</style>
                    </style>
                </head>
                <body onload="">
                    <div style="text-align:right;" >
                        <a href="${fileContents}" download="${document.documentName}"><button class="btn btn-sm btn-outline-primary">Download</button></a>
                    </div>
                    <br>
                    <iframe src='${fileContents}'  style="min-width: 100%;height: 100%;" ></iframe>
                </body>
            </html>`);
          });
        } else if (opt.option == "csv") {
          if (this.opt.length <= 0) {
            this.toastMessage = "Kindly Select Assets to Export.";
            this.toastType = "warning";
            this.loaderFlag = false;
            this.toastFlag++;
            return;
          }
          this.exportFlag = true;
        }
      }
    },

    base64ToArrayBuffer(base64) {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes;
    },

    exportData(val) {
      if (val === "table") {
        this.simpleExport(this.opt);
        this.exportFlag = false;
      } else {
        this.downLoadDetailedCsv(this.opt);
        this.exportFlag = false;
      }
    },

    downLoadDetailedCsv(opt) {
      let assetUUIDS = [];
      for (let i = 0; i < opt.length; i++) {
        const asset = opt[i];
        assetUUIDS.push(asset.uuid);
      }

      let request = {
        assetUUIDS: assetUUIDS,
        tenantUUID: this.currentUserDetails.profile.organizationId,
      };
      this.loaderFlag = true;
      AssetManagementService.exportAssetsInBulk(request)
        .then((res) => {
          if (res.status === 200 && res.data.responseIdentifier === "Success") {
            this.loaderFlag = false;
            var sampleArray = this.base64ToArrayBuffer(res.data.content);
            let fileUrl = window.URL.createObjectURL(
              new Blob([sampleArray], { type: "text/csv;charset=utf-8;" })
            );
            var fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.setAttribute("download", res.data.fileName);
            document.body.appendChild(fileLink);
            fileLink.click();
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          this.showToast(
            "An Unexpected Error occurred while downloading import templates.",
            "error"
          );
        });
    },

    simpleExport(opt) {
      let fileTitle = "Assets";
      let headers = {
        // createdDate: 'Requested On'.replace(/,/g, ''), // remove commas to avoid errors
        assetNumber: "Asset Number",
        name: "Name",
        category: "Category",
        assignees: "Assigned To",
        status: "Status",
        cost: "Maintainence Cost" + " (" + this.currency + ")",
        openIssues: "Open Issues",
        assignedIssues: "Assigned Issues",
        repairs: "Repairs",
        workOrders: "Work Orders",
      };
      let dataObj = [];
      for (let i = 0; i < opt.length; i++) {
        const asset = opt[i];
        dataObj.push({
          assetNumber:
            asset.assetNumber !== null && asset.assetNumber !== ""
              ? asset.assetNumber
              : "",
          name: asset.name !== null && asset.name !== "" ? asset.name : "",
          category:
            asset.categoryName !== null && asset.categoryName !== ""
              ? asset.categoryName
              : "",
          assignees:
            asset.assignedTo !== null && asset.assignedTo !== ""
              ? asset.assignedTo.replace(/,/g, " ")
              : "",
          status:
            asset.status !== null && asset.status !== "" ? asset.status : "",
          cost:
            asset.maintenanceCost !== null && asset.maintenanceCost !== ""
              ? asset.maintenanceCost
              : 0,
          openIssues:
            asset.openIssues !== null && asset.openIssues !== ""
              ? asset.openIssues
              : 0,
          assignedIssues:
            asset.assignedIssues !== null && asset.assignedIssues !== ""
              ? asset.assignedIssues
              : 0,
          repairs:
            asset.repairs !== null && asset.repairs !== "" ? asset.repairs : 0,
          workOrders:
            asset.workorders !== null && asset.workorders !== ""
              ? asset.workorders
              : 0,
        });
      }
      this.exportCSVFile(headers, dataObj, fileTitle);
    },

    exportCSVFile(headers, assetData, fileTitle) {
      if (headers) {
        assetData.unshift(headers);
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(assetData);

      var csv = this.convertToCSV(jsonObject);

      var exportedFilenmae = fileTitle + ".csv" || "export.csv";

      var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
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
        this.columns.push(column.labelName);
      }
    },

    catchDeparture: function (data) {
      this.sdtData = data;
      if (data.status == 1 || data.status == 3) {
        this.loadTable(data);
      } else if (data.status == 4) {
        this.loadTable(data);
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
      this.getPaginatedAssets(
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
        pageNumber: response.data.offset,
      };
      this.$refs.test.dataLoadEvent(eventData);
    },

    getPaginatedAssets(
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
        fieldNames: this.fieldNames,
        archived: false,
      };
      let req = {
        searchQuery: null,
        filters: [],
        sortField: "id",
        sortDirection: "desc",
        offset: 0,
        limit: 10,
        tenantUUID: "TEST-ORG",
        archived: false,
      };
      AssetManagementService.getPaginatedAssetCateTemplate(requestObj)
        .then((response) => {
          if (response.status === 200) {
            response.data.sdtData.content.map((item) => {
              item.createdAt = moment
                .utc(item.createdAt)
                .local()
                .format('DD/MM/YYYY hh:mm a');
            });
            response.data.offset = offset + 1;
            this.loadSDT(response, response.data.sdtData.content);
            this.loaderFlag = false;
          } else {
            this.showToast(
              "Error while getting assets. Please try again",
              "error"
            );
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          } else {
            // this.showToast("Oops its look like our server is offline");
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          }
        });
    },

    setStaticColumn() {
      let staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "Name"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);
      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }
    },


    // ------------Assets SDT Functions END --------------

    assetDialog() {
      this.$router.push({ name: "create-asset" });
    },

    assetGroupDialog() {
      this.viewAssetGroupDialog = true;
    },

    selectAssetType(obj) {
      this.assetOption = obj.value;
    },

    closeAssetGroupDialog() {
      this.viewAssetGroupDialog = false;
    },

    saveServiceRequestDialog() {
      this.addServiceDialog = false;
    },

    closeServiceDialog() {
      this.addServiceDialog = false;
    },

    closeIssueDialog() {
      this.newIssue = false;
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
      this.closeIssueDialog();
    },
  },

  watch: {
    assetOption: function (newVal, oldVal) {
      if (newVal === "asset-group") {
        // let allConfigs = JSON.parse(this.orgConfigsResponse.data.tableConfigs);
        // allConfigs = allConfigs.filter(
        //   (data) => data.pageName === "assetgroups"
        // )[0];
        // this.assetGroupConfigs = allConfigs;
        console.log("asset-group");
      } else if (newVal === "archivedAssets") {
        let allConfigs = JSON.parse(this.orgConfigsResponse.data.tableConfigs);
        allConfigs = allConfigs.filter(
          (data) => data.pageName === "assetCategoryTemplates"
        )[0];

        this.archivedAssetsConfigs = allConfigs;
      }
    },
  },

  created() {
    if (this.$route.params.toastFlag === true) {
      this.showToast(
        this.$route.params.toasstMessage,
        this.$route.params.toastType
      );
    }
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

    let uuid = this.currentUserDetails.profile.organizationId;
    assetPersonnelService
      .getCompanyCurrency(uuid)
      .then((currencyResponse) => {
        this.currency = currencyResponse.data.currency;
        assetPersonnelService
          .getOrgConfigs(uuid, "tableConfigs")
          .then((response) => {
            this.orgConfigsResponse = response;
            let allConfigs = JSON.parse(response.data.tableConfigs);
            allConfigs = allConfigs.filter(
              (data) => data.pageName === "assetCategoryTemplates"
            )[0];
            this.tableConfig = allConfigs;
            this.extractFieldNamesForSearchQuery(this.tableConfig);
            this.setStaticColumn();
            this.setTableConfigs();
          })
          .catch((error) => {
            this.showToast("Error fetching configs", "error");
          });
      })
      .catch((error) => {
        this.showToast("Error fetching company currency", "error");
      });
  },

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.dropbtn {
  width: 100% !important;
  padding: 16px;
  cursor: pointer;
  font-family: Euclid Circular B;
  font-weight: 700;
  background-color: #d8d8d8;
  color: #000;
  border: none;
  outline: 0;
}

.smallButton {
  padding: 10px !important;
  font-size: 14px;
}

.outlineDesign {
  background-color: #fff !important;
  border: 1px solid var(--brown-grey) !important;
}

.pillDesign {
  border-radius: 16px;
}

.pillDesign:hover {
  color: #fff !important;
  background-color: var(--secondary) !important;
}

.dropbtn:hover,
.smallButton:hover {
  border: none !important;
  outline: none !important;
  background-color: var(--secondary) !important;
  color: #fff !important;
  cursor: pointer;
  transition: all 0.4s;
}

.import-asset {
  width: 12px;
  height: 12px;
  margin-left: 40px;
}

.dropdown {
  // float: right;
  // margin-top: -36px;
  // margin-right: 5px;
  width: 200px;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 11;
}

.dropdown-content a {
  float: none;
  font-family: Euclid Circular B;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  font-size: 12px;
  border-bottom: 1px solid #e1e1e1;
  cursor: pointer;
}

.dropdown-content a:hover {
  background-color: #f4f4f4;
  cursor: pointer;
}

.dropdown:hover .dropdown-content {
  display: block;
}

#add:hover .smallButton {
  border: none !important;
  outline: none !important;
  background-color: var(--secondary) !important;
  color: #fff !important;
  cursor: pointer;
  transition: all 0.4s;
}

.assets-btn {
  display: flex;
  gap: 0.5em;
}
</style>

