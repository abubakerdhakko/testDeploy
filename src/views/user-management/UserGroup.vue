<template>
  <div>
    <div>
      <SButton
        title="Create Group"
        pill
        outline
        small
        @click="openUserGroupDialog()"
        v-width="200"
        style="float: right; margin-top: -40px"
      ></SButton>
    </div>
    <CreateUserGroup
      v-if="viewUserGroupDialog"
      :userNameOptions="userNameOptions"
      @close="closeUserGroupDialog"
      :viewObj="viewObj"
      :formLabel="formLabel"
      :userGroupDetail="userGroupDetail"
      :key="userGroupKey + 'createGroupComp'"
      @showToast="showToast"
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
import CreateUserGroup from "./CreateUserGroup.vue";
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import Endpoints from "../../services/EndPoints";
import moment from "moment";
import loader from "@/components/Loader.vue";
export default {
  name: "UserGroup",

  components: {
    CreateUserGroup,
    loader,
  },

  data() {
    return {
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      isActive: false,
      userGroupKey: 0,
      userGroupDetail: "",
      loaderFlag: false,
      tableConfig: {},
      viewUserGroupDialog: false,
      currentUserDetails: null,
      roleOptions: [],
      userNameOptions: [],
      orgConfigsResponse: null,
      viewObj: {},
      formLabel: "Create User Group",
      sdtData: "",
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
        buttons: [],
        searchValue: "",
        height: "950px",
        selectionColumn: false,
        selectType: "none",
        moreOptions: [],
        actionsOptions: ["View", "Edit"],
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
        dateFormat: "DD/MM/YYYY hh:mm a", //pass any moment date format here
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
      fieldNames:[]
      // ------------- SDT Data END ----------------
    };
  },

  methods: {
    viewUserGroup(val) {
      if (val == undefined) {
        this.formLabel = "Create User Group";
        this.viewObj = {};
        this.viewUserGroupDialog = true;
      } else if (val.value == "View") {
        this.formLabel = val.row.groupName;
        this.getUserGroup();
      } else if (val.value == "Edit") {
        this.formLabel = "Edit User Group";
        this.getUserGroup();
      }
    },

    openUserGroupDialog(val) {
      this.viewUserGroup(val);
    },

    getActionsOption(val) {
      if (val.value == "View") {
        let viewObj = {
          editable: true,
          obj: val.row,
        };
        this.viewObj = viewObj;
        this.viewUserGroup(val);
      } else if (val.value == "Edit") {
        let viewObj = {
          editable: false,
          obj: val.row,
        };
        this.viewObj = viewObj;
        this.viewUserGroup(val);
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

    closeUserGroupDialog(reload) {
      this.viewUserGroupDialog = false;
      if (reload) {
        this.loadTable(this.sdtData);
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
        (col) => col.labelName === "Group Name"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }
    },

    extractFieldNamesForSearchQuery(config){
        config.columns.map(element => {
          this.fieldNames.push(element.fieldName)
        });
    },

    catchDeparture: function (data) {
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

      this.getPaginatedUserGroups(
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

    getPaginatedUserGroups(filters, sortField, sortDirection, offset, limit,searchQuery) {
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
        fieldNames:this.fieldNames
      };

      AssetPersonnelService.getPaginatedUserGroupsForSDT(requestObj)
        .then((response) => {
          if (response.status == 200) {
            let userGroups = response.data.sdtData.content;
            userGroups.map((item) => {
              item.createdAt = moment.utc(item.createdAt).local().format();
            });
            this.loaderFlag = false;
            response.data.sdtData.offset = offset + 1;
            this.loadSDT(response, userGroups);
          } else {
            this.loaderFlag = false;
            this.showToast("Oops its look like our server is offline", "error");
          }
        })
        .catch((error) => {
          if (error.response !== undefined && error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          }
        });
    },

    getUserGroup() {
      this.isActive = true;
      this.loaderFlag = true;
      AssetPersonnelService.getUserGroupByUUID(this.viewObj.obj.uuid)
        .then((res) => {
          this.userGroupDetail = res.data.userGroup;
          this.userGroupKey++;
          this.loaderFlag = false;
          this.viewUserGroupDialog = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
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

    AssetPersonnelService.getAllRoles(
      this.currentUserDetails.profile.organizationId
    ).then((response) => {
      this.roleOptions = response.data.role;
    });

    AssetPersonnelService.getAllUsers(
      this.currentUserDetails.profile.organizationId
    ).then((response) => {
      for (let index = 0; index < response.data.users.length; index++) {
        let user = {
          uuid: response.data.users[index].uuid,
          name:
            response.data.users[index].email +
            " " +
            "(" +
            response.data.users[index].name +
            ")",
          userName: response.data.users[index].userName,
          gender: response.data.users[index].gender,
          fname: response.data.users[index].name,
          email: response.data.users[index].email,
          contact: response.data.users[index].contactNumber,
          city: response.data.users[index].city,
          selected: false,
          manager: false,
        };
        this.userNameOptions.push(user);
      }
    });

    let uuid = this.currentUserDetails.profile.organizationId;

    AssetPersonnelService.getOrgConfigs(uuid, "tableConfigs")
      .then((response) => {
        this.orgConfigsResponse = response;
        let allConfigs = JSON.parse(response.data.tableConfigs);
        allConfigs = allConfigs.filter(
          (data) => data.pageName === "UserGroups"
        )[0];
        this.tableConfig = allConfigs;
        this.tableConfig.columns.map((column) => {
          column.filters = [];
        });
        this.extractFieldNamesForSearchQuery(this.tableConfig)
        this.setStaticColumn();
        this.setTableConfigs();
      })
      .catch((error) => {
        if (error) {
          this.showToast("Error fetching configs", "error");
        }
      });
  },

  // mounted(){
  // 	console.log('mounted')
  // 	this.currentUserDetails = JSON.parse(localStorage.getItem("currentUserDetails"));
  //     if (this.currentUserDetails === null) {
  //       localStorage.setItem("forceSignout", "yes");
  //       return;
  // 	}

  // 	// fetching configs
  //   	let uuid = this.currentUserDetails.profile.organizationId;

  //  	 AssetPersonnelService.getOrgConfigs(uuid, "tableConfigs")
  //   	 .then((response) => {
  // 	    // console.log(response.data)
  // 		this.orgConfigsResponse = response;
  // 		let allConfigs = JSON.parse(response.data.tableConfigs);
  // 		console.log(allConfigs)
  // 		allConfigs = allConfigs.filter((data) => data.pageName === "UserGroups")[0];
  // 		this.tableConfig = allConfigs;
  // 		console.log(this.tableConfig)
  // 		this.tableConfig.columns.map(column => {column.filters = []});
  // 		this.setTableConfigs();
  //       })
  // 	  .catch((error) => {
  //         console.log("Error fetching configs", error);
  // 	  });
  // },

  // watch: {
  // 	tableConfig: function(newVal,oldVal){
  // 		console.log('old:', oldVal)
  // 		console.log('new:', newVal)
  // 		if(newVal!=oldVal){
  // 			this.setTableConfigs();
  // 		}
  // 	}
  // }
};
</script>

<style lang="scss" scoped>
</style>