<template>
  <div class="shark-data-table pt-32 pb-80">
    <div class="mb-32">
      <span class="head-title">Users</span><br />
      <span class="subtitle">View all the information related to users</span>
    </div>
    <SToggle
      v-model="managementType"
      :options="userManagementOptions.options"
      :tabs="true"
      :background="'#ffffff'"
      style="margin-top: 0px !important"
      @selected="selectManagementType"
    />
    <div v-if="manageOption === 'user-management'">
      <div>
        <SButton
          title="Create User"
          pill
          outline
          small
          @click="openUserDialog()"
          v-width="200"
          style="float: right; margin-top: -40px"
        ></SButton>
      </div>
      <CreateUser
        v-if="viewUserDialog"
        :roleOptions="roleOptions"
        :userId="userId"
        @close="closeUserDialog"
        :flag="stateDisbale"
        :formTitle="formTitle"
        :userDetails="userDetails"
        :key="userKey"
        @refreshSDT="responseMessage"
      />
      <SDialog
        title="Change Password"
        :persistent="true"
        :width="610"
        @close="closeUserDialog"
        v-if="userPasswordDialog"
      >
        <passwordChangePopUp :userId="userId" @showToast="showToast" />
      </SDialog>
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

    <div v-if="manageOption === 'user-group'">
      <UserGroup />
    </div>

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

import CreateUser from "./CreateUser.vue";
import UserGroup from "./UserGroup.vue";
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import Endpoints from "../../services/EndPoints";
import AuthService from "../../services/AuthService";
import moment from "moment";
import PasswordChangePopUp from "./passwordChangePopUp.vue";
import loader from "@/components/Loader.vue";
export default {
  name: "UserManagement",

  components: {
    CreateUser,
    UserGroup,
    PasswordChangePopUp,
    loader,
  },
  props: {
    //	userDetails:{}
  },
  data() {
    return {
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      sdtData: "",
      userDetails: "",
      userKey: 0,
      isActive: false,
      loaderFlag: false,
      stateDisbale: false,
      // ------------- User Management SDT Data START ----------------
      sdt_token: JSON.parse(localStorage.getItem("currentUserDetails"))
        .access_token,
      user: "",
      username: "",
      isLoadingPage: false,
      isLoading: false,
      prompt: false,
      userPasswordDialog: false,
      promptViewName: "",
      serverData: "",
      filterFieldList: [],
      eventData: "",
      parentSystemSettings: {
        serviceURL: Endpoints.preferenceService.preference,
        //   serviceURL: "http://localhost:8099/preferences",
        buttons: [],
        searchValue: "",
        height: "950px",
        selectionColumn: false,
        selectType: "",
        moreOptions: [],
        actionsOptions: ["View", "Edit", "Change Password"],
        columnIcons: [],
        pillConfig: [
          { column: "", state: "success", data: "" },
          { column: "", state: "error", data: "" },
          { column: "", state: "normal", data: "" },
        ],
        staticColumns: [],
        user: "",
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
      tableConfig: null,
      // ------------- User Management SDT Data END ----------------

      viewUserDialog: false,
      roleOptions: [],
      userId: null,
      userManagementOptions: {
        value: true,
        options: [
          {
            label: "Users",
            value: "user-management",
          },
          {
            label: "User Groups",
            value: "user-group",
          },
        ],
      },
      managementType: "user-management",
      manageOption: "user-management",
      userNameOptions: [],
      orgConfigsResponse: null,
    };
  },

  methods: {
    closeUserDialog() {
      this.viewUserDialog = false;
      this.userId = null;
      this.stateDisbale = false;
      this.userPasswordDialog = false;
    },

    viewUser() {
      this.viewUserDialog = true;
      this.formTitle = "Create User";
    },

    closeUserGroupDialog() {
      this.viewUserGroupDialog = false;
    },

    selectManagementType(obj) {
      this.manageOption = obj.value;
    },

    openUserDialog() {
      this.viewUser();
    },
    responseMessage(value) {
      this.showToast(value, "success");
      this.loadTable(this.sdtData);
    },

    //  ------------ User Management SDT starts here -------------
    catchDeparture: function (data) {
      this.sdtData = data;
      if (data.status == 1 || data.status == 3) {
        this.loadTable(data);
      } else if (data.status == 4) {
        this.loadTable(data);
      } else if (data.status == 10) {
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

    setStaticColumn() {
      let staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "First Name"
      )[0];
      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }

      staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "Last Name"
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

      this.getPaginatedUserManagement(
        filters,
        sdtData.data.sortField,
        sdtData.data.sortDirection,
        sdtData.data.offset,
        sdtData.data.limit,
        sdtData.data.searchQuery
      );
    },

    getPaginatedUserManagement(
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
        fieldNames:this.fieldNames
      };

      AssetPersonnelService.getPaginatedUsersForSDT(requestObj)
        .then((response) => {
          if (response.status == 200) {
            let users = response.data.sdtData.content;
            for (let index = 0; index < users.length; index++) {
              if (users[index].createdAt) {
                users[index].createdAt = moment
                  .utc(users[index].createdAt)
                  .local()
                  .format('DD/MM/YYYY hh:mm a');
              }
            }
            response.data.sdtData.offset = offset + 1;
            this.loadSDT2(response, users);
            this.loaderFlag = false;
          } else {
            this.loaderFlag = false;
            this.showToast("Oops it looks like our server is offline", "error");
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          if (error.response !== undefined && error.response.status === 406) {
            this.showToast(error.response.data.description, "error");
          }
        });
    },

    loadSDT2(response, data) {
      this.parentData = data;
      let eventData = {
        data: this.parentData,
        totalElements: response.data.sdtData.totalElements,
        totalPages: response.data.sdtData.totalPages,
        pageNumber: response.data.sdtData.offset,
      };
      this.$refs.test.dataLoadEvent(eventData);
    },

    getActionsOption(val) {
      if (val.value == "View") {
        this.userId = val.row.uuid;
        this.formTitle = val.row.firstName + " " + val.row.lastName;
        this.stateDisbale = true;
        this.getUserDetail();
      }
      if (val.value == "Edit") {
        this.userId = val.row.uuid;
        this.stateDisbale = false;
        this.formTitle = "Edit User";
        this.getUserDetail();
      }
      if (val.value == "Change Password") {
        this.userId = val.row.uuid;
        this.userPasswordDialog = true;
      }
    },
    getUserDetail() {
      this.isActive = true;
      this.loaderFlag = true;
      AssetPersonnelService.getUser(this.userId)
        .then((response) => {
          this.userDetails = response.data.userResponse;
          this.userKey++;
          this.loaderFlag = false;
          this.viewUserDialog = true;
        })
        .catch((e) => {
          console.log(e);
        });
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
        //  let fileTitle = 'Billings';
        //  let headers = {
        //       createdDate: 'Requested On'.replace(/,/g, ''), // remove commas to avoid errors
        //       dueDate: "Due Date",
        //       shipmentNumber: "Shipment #",
        //        portOfLoading: "Port of Load",
        //        portOfDischarge: "Port Of Discharge",
        //        amount: "Amount",
        //        balance: "Balance",
        //        netsuiteStatus: "Status"
        //  };
        //  let dataObj = [];
        //  for (let i = 0; i < opt.rows.length; i++) {
        //      const bill = opt.rows[i];
        //      dataObj.push({
        //          createdDate: bill.createdDate,
        //          dueDate: bill.dueDate,
        //          shipmentNumber: bill.shipmentNumber,
        //          portOfLoading: bill.portOfLoading,
        //          portOfDischarge: bill.portOfDischarge,
        //          amount: bill.amount,
        //          balance: bill.balance,
        //          netsuiteStatus: bill.netsuiteStatus
        //      });
        //  }
        //  this.exportCSVFile(headers, dataObj, fileTitle);
      }
    },

    /* ------------ User Management SDT ends here ------------- */

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  watch: {
    manageOption: function (newVal, oldVal) {
      if (newVal == "user-management") {
        let allConfigs = JSON.parse(this.orgConfigsResponse.data.tableConfigs);
        allConfigs = allConfigs.filter(
          (data) => data.pageName === "UserManagement"
        )[0];
        this.tableConfig = allConfigs;
      }
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

    AuthService.getAllRoles(
      this.currentUserDetails.profile.organizationId
    ).then((response) => {
      this.roleOptions = response.data;
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
  },

  mounted() {
    let currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    if (currentUserDetails === null) {
      localStorage.setItem("forceSignout", "yes");
      return;
    }

    // sending only first and last name for SDT
    let name = this.currentUserDetails.profile.username;
    if (name.includes("@")) {
      name = name.split("@");
      name = name[0];
    }
    this.parentSystemSettings.user = name;

    // fetching configs
    let uuid = currentUserDetails.profile.organizationId;

    AssetPersonnelService.getOrgConfigs(uuid, "tableConfigs")
      .then((response) => {
        this.orgConfigsResponse = response;
        let allConfigs = JSON.parse(response.data.tableConfigs);
        this.tableConfig = allConfigs.filter(
          (data) => data.pageName === "UserManagement"
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

  computed: {},
};
</script>

<style lang="scss" scoped>
</style>