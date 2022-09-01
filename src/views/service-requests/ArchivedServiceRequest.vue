<template>
  <div class="shark-data-table">
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
    />

    <!-- Dialogs -->
    <DeleteDialog
      v-if="deleteInspectionDialog"
      @close="closeDialog"
      @deleteData="deleteOrArchiveServiceRequests"
      @canceled="closeDialog"
    ></DeleteDialog>
    <RestoreDialog
      v-if="restoreDialog"
      @close="closeDialog"
      @restoreData="deleteOrArchiveServiceRequests"
      @canceled="closeDialog"
    ></RestoreDialog>
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
import inspectionService, {
  InspectionService,
} from "../../services/InspectionService";
import Endpoints from "../../services/EndPoints";
import moment from "moment";
import DeleteDialog from "../../components/DeleteDialog";
import RestoreDialog from "../../components/RestoreDialog";
import loader from "@/components/Loader.vue";
export default {
  name: "ArchivedServiceRequest",
  components: {
    DeleteDialog,
    loader,
    RestoreDialog,
  },

  data() {
    return {
      loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      currentUserDetails: "",
      deleteInspectionDialog: false,
      restoreDialog: false,
      processType: "",
      uuid: "",
      serviceRequest: "",
      sdtData: "",
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
        actionsOptions: ["View", "Restore", "Delete"],
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
      fieldNames: [],
      // ------------- SDT Data END ----------------
    };
  },

  props: {
    configs: { required: true },
  },

  methods: {
    updateSDTFunction() {
      this.updateSDT = true;
      this.loadTable(this.sdtData);
    },
    closeDialog() {
      this.deleteInspectionDialog = false;
      this.restoreInspectionDialog = false;
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

      if (val.value === "Restore") {
        this.restoreDialog = true;
        this.uuid = val.row.uuid;
        this.processType = "restore";
      }

      if (val.value === "Delete") {
        this.deleteInspectionDialog = true;
        this.uuid = val.row.uuid;
        this.processType = "delete";
      }
    },

    setTableConfigs() {
      this.parentDefaultSystemView.defaultTable.density = this.tableConfig.density;
      this.parentDefaultSystemView.defaultTable.pageSize = this.tableConfig.pageSize;
      this.parentDefaultSystemView.defaultTable.pageName = this.tableConfig.pageName;
      this.parentDefaultSystemView.defaultTable.sortField = this.tableConfig.sortField;
      this.parentDefaultSystemView.defaultTable.sortDirection = this.tableConfig.sortDirection;
      this.parentDefaultSystemView.defaultTable.columns = this.tableConfig.columns;
    },

    extractFieldNamesForSearchQuery(config) {
      config.columns.map((element) => {
        this.fieldNames.push(element.fieldName);
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
        filters: filters,
        sortField: sortField,
        sortDirection: sortDirection,
        offset: offset,
        limit: limit,
        tenantUUID: currentUserDetails.profile.organizationId,
        fieldNames: this.fieldNames,
        archived: true,
      };

      inspectionService
        .getPaginatedServiceRequests(requestObj)
        .then((response) => {
          if (response.status === 200) {
            response.data.issueReportings.offset = offset;
            let serviceRequests = response.data.issueReportings.content;
            if (serviceRequests.length === 0) {
              this.loaderFlag = false;
              this.loadSDT(response, serviceRequests);
              return;
            }
            for (let service_request of serviceRequests) {
              service_request.reportedAt = moment
                .utc(service_request.reportedAt)
                .local()
                .format();
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
      let staticCol = this.tableConfig.columns.filter(
        (col) => col.labelName == "Asset Name"
      )[0];

      this.parentSystemSettings.staticColumns.push(staticCol);

      for (let i = 0; i < this.tableConfig.columns.length; i++) {
        if (this.tableConfig.columns[i].labelName == staticCol.labelName) {
          this.tableConfig.columns.splice(i, 1);
        }
      }

      staticCol = this.tableConfig.columns.filter(
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
      this.restoreDialog = false;
      InspectionService.deleteOrArchiveServiceRequest(
        this.uuid,
        this.processType
      )
        .then((response) => {
          if (response.status === 200) {
            if (this.processType === "restore") {
              this.showToast(
                "Service Request Restored Successfully.",
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

    // Setting configs
    this.tableConfig = this.configs;
    this.extractFieldNamesForSearchQuery(this.tableConfig);
    this.setStaticColumn();
    this.setTableConfigs();
  },

  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped></style>
