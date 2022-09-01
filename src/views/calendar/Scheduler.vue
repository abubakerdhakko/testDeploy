<template>
  <div id="app">
    <div id="container">
      <div class="main-row">
        <div class="left-column">
          <div>
            <img
              class="filter-btn"
              src="/assets/icons/Filter.svg"
              alt=""
              @click="filterFun()"
            />
          </div>

          <div>
            <SSelect
              label="All Categories"
              v-model="CategoryValue"
              :source="CategoryOption"
              resultsValue="resultsValue"
              resultsDisplay="resultsDisplay"
              :autocomplete="false"
              @selected="onSelectedCategory"
              v-width="137"
            />
            <!-- :error="$v.model.$error" -->
          </div>
          <div>
            <SInput label="Search here" v-model="searchModel" />
          </div>
          <div>
            <img
              class="search-btn"
              src="/assets/icons/Search.svg"
              alt=""
              @click="searchFunction()"
            />
          </div>
        </div>
        <div class="right-column">
          <!-- <SButton
						title="+"
						@click="addEvent()"
						class="btn-class"
						:fontSize="'16'"
						padding="12px 0"
					></SButton> 
					<SButton
						title="+"
						@click="onSave()"
						class="btn-class"
						:fontSize="'16'"
						padding="12px 0"
					></SButton>-->
        </div>

        <SDialog
          :title="'Add Event'"
          :persistent="true"
          :width="950"
          v-show="EventDialog"
          @close="close"
        >
          <div class="tabs" style="padding: 24px">
            <SToggle
              v-model="eventTabs"
              :options="eventTabsOptions"
              :tabs="true"
              :background="'#ffffff'"
              @selected="selectEventType"
            />
            <div v-if="eventTabs === 'inspection'">
              <!-- <InspectionAssignment
                :tempObj="tempObj"
                @requestObj="inspectionAssignment"
                :calenderDateObj="calenderDateObj"
                :key="keyIndex"
              /> -->
              <GInspectionTemplates
                :EditScheTenantUUId="EditScheTenantUUId"
                :EditScheId="EditScheId"
                :tempObj="tempObj"
                @requestObj="inspectionAssignment"
                @updateAssignedTemplate="updateAssignedTemplate"
                :calenderDateObj="calenderDateObj"
                :key="keyIndex"
              />
            </div>
            <div v-if="eventTabs === 'workOrder'">
              <WorkOrderAssignment
                :calenderDateObj="calenderDateObj"
                @requestObject="workOrderAssignment"
              />
            </div>
            <div v-if="eventTabs === 'assignment'">
              <AssetAssignmentUnAssignment
                :assignmentHistoryUsers="this.assignmentHistoryUsers"
                :allUsers="this.Users"
                @unassigned="this.unAssignAsset"
                @editAssigned="this.editAssigned"
                @openPopUp="this.openPopUp"
                @showToast="showToast"
              />
              <AssignUserPopUp
                @close="closePopUp"
                v-show="ShowPopUp"
                @AssignUser="this.assignUser"
                @updateAssignUser="this.updateAssignUser"
                :users="this.Users"
                @onSelected="this.onSelected"
                :assignedUsers="this.valueEditAssign"
                :key="this.keyIndex + 'assign'"
                :calenderDateObj="calenderDateObj"
              />
              <UnAssignUserPopUp
                @close="closePopUp"
                v-show="ShowUnPopUp"
                :assignedUsers="this.valueEditAssign"
                @UnAssignUser="unAssignUser"
                :key="this.keyIndex + 'un-assign'"
                :calenderDateObj="calenderDateObj"
              />
            </div>

            <div v-if="eventTabs === 'issues'">
              <IssueAssignment
                @requestObject="issueAssignment"
                @updateIssueAssignment="updateIssueAssignment"
                :issueFlag="editFlag"
                :issueID="issueID"
                :key="this.keyIndex + 'íssueComponents'"
              />
            </div>
            <div v-if="eventTabs === 'srRequest'">
              <ServiceRequestAssignment
                :calenderDateObj="calenderDateObj"
                @issueRequest="createServiceRequest"
                :srFlag="editFlag"
                :serviceRequestUUID="serviceRequestUUID"
              />
            </div>
          </div>
        </SDialog>
      </div>
      <ejs-schedule
        id="Schedule"
        ref="ScheduleObj"
        :height="height"
        :selectedDate="selectedDate"
        :workHours="workHours"
        :cellClick="onCellClick"
        :popupOpen="onPopupOpen"
        :eventSettings="eventSettings"
        :eventRendered="oneventRendered"
        :key="scheduleKey + 'eventCard'"
        :actionBegin="onActionBegin"
        :actionComplete="onActionComplete"
      >
        <!-- :onSubmit="onSubmit" -->
        <!-- :popupClose='onPopupClose'  -->
        <!-- <e-views>
                        <e-view option="Week" :eventTemplate="weekTemplate"></e-view>
                        <e-view option="TimelineWeek" :eventTemplate="
                        
                        "></e-view>
                    </e-views> -->
      </ejs-schedule>

      <SideBarFilter :flag="flag" :key="filterIndex" />
      <SToast
        :message="toastMessage"
        :time-out="3000"
        :type="toastType"
        v-if="toastFlag"
      />
      <loader v-if="loaderFlag" />
      <DeleteDialog
        v-if="deleteInspectionDialog"
        @close="closeDialog"
        @deleteData="deleteDialog"
        @canceled="closeDialog"
      ></DeleteDialog>
    </div>
  </div>
</template>

<script>
import {
  SchedulePlugin,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Resize,
DragAndDrop
} from "@syncfusion/ej2-vue-schedule";
import loader from "@/components/Loader.vue";
import inspectionService from "../../services/InspectionService";
import GInspectionTemplates from "../../components/G_InspectionTemplate.vue";
import InspectionAssignment from "../calendar/components/InspectionAssignment.vue";
import ServiceRequestAssignment from "../calendar/components/ServiceRequestAssignment.vue";
import IssueAssignment from "../calendar/components/IssueAssignment.vue";
import AssetAssignmentUnAssignment from "./components/AssetAssignmentUnAssignment.vue";
import WorkOrderAssignment from "../calendar/components/WorkOrderAssignment.vue";
import AssignUserPopUp from "../calendar/components/AssignUserPopUp.vue";
import UnAssignUserPopUp from "../calendar/components/UnAssignUserPopUp.vue";
// import { scheduleData } from './datasource'; // only for testing
// Scheduler Api
import schedulerService from "../../services/schedulerService";
//
import InspectionService from "../../services/InspectionService";
import WorkOrderService from "../../services/WorkOrderService";
import AssetPersonnelService from "../../services/AssetPersonnelService";
import SideBarFilter from "../calendar/components/SideBarFilter.vue";
import DeleteDialog from "../../components/DeleteDialog";
import moment from "moment";
var scheduleData = [];

export default {
  data() {
    return {
      height: "550px",
      eventSettings: {
        dataSource: scheduleData,
      },
      Users: [],
      allUsers: [],
      ShowPopUp: false,
      ShowUnPopUp: false,
      assignedUsers: [],
      valueEditAssign: {},
      assignmentHistoryUsers: [],
      page: 0,
      rowsPerPage: 5,
      currentUserDetails: null,
      keyIndex: 0,
      filterIndex: 0,
      scheduleKey: 0,
      index: 0,
      workHours: { highlight: true, start: "08:00", end: "16:00" },
      selectedDate: new Date(),
      EventDialog: false,
      eventTabs: "inspection",
      assetUuid: "",
      eventTabsOptions: [
        {
          label: "Inspection",
          value: "inspection",
        },
        {
          label: "Work Order",
          value: "workOrder",
        },
        {
          label: "Assignment",
          value: "assignment",
        },
        {
          label: "Report Issue",
          value: "issues",
          id: "gjhgj",
        },
        {
          label: "Service Request",
          value: "srRequest",
        },
      ],
      CategoryOption: [],
      searchModel: "",
      CategoryValue: "",
      tempObj: {},
      loaderFlag: false,
      toastFlag: false,
      toastMessage: "",
      toastType: "",
      calenderDateObj: "",
      submittedbyUserUUID: "",
      issueCategory: "",
      editFlag: false,
      issueID: "",
      serviceRequestUUID: "",
      tempScheduleName: "",
      flag: false,
      schedulerName: "scheduler",
      EditScheTenantUUId: "",
      EditScheId: "",
      deleteId: "",
      deleteInspectionDialog: false,
      archiveInspectionDialog: false,
      schedulerStartTime: "",
      schedulerEndTime: "",
    };
  },
  provide: {
    schedule: [Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop],
  },
  components: {
    GInspectionTemplates,
    InspectionAssignment,
    loader,
    WorkOrderAssignment,
    ServiceRequestAssignment,
    IssueAssignment,
    AssetAssignmentUnAssignment,
    AssignUserPopUp,
    UnAssignUserPopUp,
    SideBarFilter,
    DeleteDialog,
  },
  methods: {
    getDateNavigate(){
    var scheduleObj = document.getElementById("Schedule").ej2_instances[0];
    var selDate = scheduleObj.selectedDate;
    var currentViewDates = scheduleObj.getCurrentViewDates();
    var startDate = currentViewDates[0];
    var endDate = currentViewDates[currentViewDates.length - 1];
    this.scheduleStartTime = endDate, 
    this.schedulerEndTime = startDate
    },
    closeDialog() {
        this.deleteInspectionDialog = false;
        this.archiveInspectionDialog = false;
    },
    deleteDialog() {
        this.loaderFlag = true;
        this.deleteInspectionDialog = true;
        inspectionService
          .deleteInspectionTemplateByUUID(this.deleteId, "delete")
          .then((response) => {
            if (response.status == 200) {
              this.$emit(
                "showToast",
                "Pending Inspection Deleted Successfully",
                "success"
              );

              let scheduleObj = document.getElementById("Schedule").ej2_instances[0]; 
              var list = scheduleObj.eventSettings.dataSource 
              var lists = list.filter(x => {
                return x.id != this.deleteId;
              })
              scheduleObj.eventSettings.dataSource = [{}]
              scheduleObj.eventSettings.dataSource = lists
              this.loaderFlag = false;
              this.deleteInspectionDialog = false;
              // this.GetSchedulerTickets();
              // this.schedulerStartTime = "";
              // this.schedulerEndTime = "";
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

    addEvent: function (value) {
      this.keyIndex++;
      this.EventDialog = true;
    },
    deleteEvent: function (value) {
      this.keyIndex++;
    },
    onCellClick: function (args) {
      //
      args.cancel = true;
      this.calenderDateObj = args;
      this.keyIndex++;
      this.EventDialog = true;
      // Date
      this.schedulerStartTime = args.startTime;
      let numWeeks = 2;
      let now = args.endTime;
      now.setDate(now.getDate() + numWeeks * 7);
      this.schedulerEndTime = now;
    },
    oneventRendered: function (args) {
      //	console.log("on event render",  args.data.CategoryColor);
      let categoryColor = args.data.CategoryColor;
      if (!args.element || !categoryColor) {
        return;
      }
      args.element.style.backgroundColor = categoryColor;
    },
    onSave: function (args) {
      let scheduleObj = document.getElementById("Schedule").ej2_instances[0];
      //	console.log(scheduleObj);
      var date = new Date();
      var subOneHour = moment(date).subtract(1, "h").format();
      let eventData = {
        //	Id: index,
        Subject: "",
        StartTime: new Date(subOneHour),
        EndTime: new Date(),
        IsAllDay: false,
        cardType: "Service Request",
        issueId: "c06295c1-0355-4a4d-8b8d-3543f7f50a95",
        srId: "c06295c1-0355-4a4d-8b8d-3543f7f50a95",
        // StartTimezone: null,
        // Description: "undefined",
        // EndTimezone: null,
        // Guid: "8b5370a2-9cfa-b957-0b5f-1e86b94abebb",
        Id: 1,
        // Location: "undefined",
        // RecurrenceRule: null,
      };
      console.log("save", eventData);
      scheduleObj.addEvent(eventData);
      console.log("scheduleData", scheduleData);
      //document.getElementsByClassName(".e-schedule .e-vertical-view .e-day-wrapper .e-appointment.e-lib.e-draggable").style.backgroundColor = "green";
    },
    onActionBegin: function (args) {
      // console.log("onActionBegin",args)
      if (args.requestType === "eventRemove") {
        var changedRecords = args.changedRecords
        for (let index = 0; index < changedRecords.length; index++) {
         var recordId = changedRecords[index].id 
        }
        args.cancel = true;
        this.deleteInspectionDialog = true;
        this.deleteId = recordId;

        
      }

      // if (args.requestType === "dateNavigate") {
      //   console.log("### navigating to: ", args.currentDate);
      //   // this.scheduleObj.scrollTo('12:00', args.currentDate);
      // }
      // let scheduleObj = document.getElementById("Schedule").ej2_instances[0];
      //   if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      //       let data;
      //       if (args.requestType === 'eventCreate') {
      //           data = args.data[0];
      //       } else if (args.requestType === 'eventChange') {
      //           data = args.data;
      // 	//	data.Subject = this.tempScheduleName;
      // 		console.log("update data save function",data);
      // 		return data;
      //       }
      //       if (!scheduleObj.isSlotAvailable(data.StartTime, data.EndTime)) {
      // 		console.log("is slot avala");
      //         //  args.cancel = true;
      //       }else{
      // 		console.log("create new");
      // 		//scheduleObj.saveEvent(data)
      // 	}endDate
      //   }
    },
    onActionComplete: function (args) {
      if (
        args.requestType === "viewNavigate" ||
        args.requestType === "dateNavigate"
      ) {
        var scheduleObj = document.getElementById("Schedule").ej2_instances[0];
        var selDate = scheduleObj.selectedDate;
        var currentViewDates = scheduleObj.getCurrentViewDates();
        var startDate = currentViewDates[0];
        var endDate = currentViewDates[currentViewDates.length - 1];
        // console.log("e-month-view-startDate: " + startDate);
        // console.log("e-month-view-endDateendDate: " + endDate);

        if (scheduleObj.activeView.viewClass === "e-month-view") {
          // console.log("e-month-view");
        }
      }
    },

    onPopupOpen: function (args) {
      // console.log("scheduler", args);

      if (args.type === "Editor") {
        args.cancel = true;
        this.EditScheTenantUUId = args.data.tenantUUID;
        this.EditScheId = args.data.id;
        this.tempObj.editFlag = true;
        // this.editFlag = true;
        this.issueID = args.data.srId;
        this.serviceRequestUUID = args.data.srId;
        this.EventDialog = true;
        // for date
        this.schedulerStartTime = args.data.StartTime;
        let numWeeks = 2;
        let now = args.data.EndTime;
        now.setDate(now.getDate() + numWeeks * 7);
        this.schedulerEndTime = now;
      } else if (args.type === "DeleteAlert") {
        args.cancel = true;
        this.deleteInspectionDialog = true;
        this.deleteId = args.data.id;
        // this.$refs.ScheduleObj.deleteEvent(args.data);

      } else if (args.type === "RecurrenceAlert") {
      }
    },
    selectEventType(obj) {
      this.eventTabs = obj.value;
      //	this.calenderDateObj = "";
    },
    close() {
      (this.eventTabs = "inspection"), (this.EventDialog = false);
      this.tempObj.editFlag = false;
     if (this.EditScheTenantUUId !== "" && this.EditScheId !== ""){
       this.EditScheTenantUUId = "",
       this.EditScheId = ""
     }
    },
    closePopUp() {
      this.ShowPopUp = false;
      this.ShowUnPopUp = false;
    },
    onSelected(value) {
      console.log("seleted value", value);
    },
    onSelectedCategory() {},
    searchFunction() {},
    filterFun() {
      this.flag;
      this.flag = !this.flag;
      this.filterIndex++;
    },
    SchedulerEditFunc(){


      let scheduleObj = document.getElementById("Schedule").ej2_instances[0]; 
      var arrOfObj = scheduleObj.eventSettings.dataSource
    
      var dataArr = arrOfObj.map(item=>{
          return [item.id,item]
      }); 
      var maparr = new Map(dataArr); 
      var result = [...maparr.values()];

      scheduleObj.eventSettings.dataSource = [{}]
      scheduleObj.eventSettings.dataSource = result
    },
    async inspectionAssignment(obj) {
            // console.log("obj",obj)
      try {
      this.loaderFlag = true;
      if (obj.frequencyType === "ad-hoc") {
        let date = obj.deadLineDate;
        let time = obj.deadLineTime;
        var dateSplit = date.split("T");
        var objDate = dateSplit[0];
        var timeSplit = time.split(":");
        var hour = timeSplit[0];
        var min = timeSplit[1];
        var startDate = objDate + "T" + hour + ":" + min + ":" + "00+05:00";
        var subOneHour = moment(startDate).subtract(1, "h").format();
        let endTime = new Date(startDate);
        let startTime = new Date(subOneHour);
        const res = await InspectionService.assignScheduleInspectionTemplate(obj)
          if (res.status === 200) {
            this.tempAssignment = false;
            this.close();
           this.showToast(res.data.description, "success");
           await this.GetSchedulerTickets();
           await this.SchedulerEditFunc();
          }
        }
        else if (obj.frequencyType === "daily") {
        let ceilDate = moment(this.ceilStartDateTime).format("YYYY-MM-DD");
        let appendTime = moment(obj.deadLineDate).format("HH:mm");
        let time = appendTime+":00+05:00";
        startDate = ceilDate + "T" + time;
        // obj.deadLineDate = moment(startDate).format();

       let res = await InspectionService.assignScheduleInspectionTemplate(obj)
        if (res.status === 200) {
           
          this.tempAssignment = false;
          this.close();
           this.showToast(res.data.description, "success");
           await this.GetSchedulerTickets();
           await this.SchedulerEditFunc();
          }
        } else if(obj.frequencyType === "weekly" || obj.frequencyType === "monthly" || obj.frequencyType === "yearly"){
       let res = await InspectionService.assignScheduleInspectionTemplate(obj)
        if (res.status === 200) {
           
          this.tempAssignment = false;
          this.close();
           this.showToast(res.data.description, "success");
           await this.GetSchedulerTickets();
           await this.SchedulerEditFunc();
          }
        } 
        }catch (e) {
          this.loaderFlag = false;
          this.showToast(e.data.description, "error");
          throw e;
      }
    },
    popupOpen(args){
      console.log('popupOpen')
    },
    async updateAssignedTemplate(obj) {

        try {
          let res = await inspectionService.updateAssignScheduleInspectionTemplate(obj)
        if (res.status === 200){
          this.tempAssignment = false;
          this.$emit("showToast", res.data.description, "success");
          await this.GetSchedulerTickets();
          await this.SchedulerEditFunc();
          
          this.loaderFlag = false;
          this.close();
        }
         
        } catch (e) {
          this.$emit("showToast", e.data.response, "error");
          throw e;
        }
    },
    workOrderAssignment(createWorkOrderRequest) {
      console.log(createWorkOrderRequest);

      WorkOrderService.addWorkOrder(
        createWorkOrderRequest,
        this.currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (response) {
            console.log("response", response);
            let startDate =
              createWorkOrderRequest.workOrder.schedule.format("MM DD YYYY");
            var today = new Date();
            var time =
              today.getHours() +
              ":" +
              today.getMinutes() +
              ":" +
              today.getSeconds();
            var dateTime = startDate + " " + time;
            var date = moment(dateTime).format();
            let endDate = moment(date).subtract(1, "h").format();
            let scheduleObj =
              document.getElementById("Schedule").ej2_instances[0];
            let eventData = {
              Id: this.generateUUID(),
              Subject: "Work Order",
              StartTime: new Date(endDate),
              EndTime: new Date(dateTime),
              IsAllDay: false,
            };
            console.log("data", eventData);
            scheduleObj.addEvent(eventData);
            this.loaderFlag = false;
            this.close();
          }
        })
        .catch((error) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast(error.data.response, "error");
          }
        });
    },
    issueAssignment(issueRequest) {
      console.log("issueRequest", issueRequest);
      //return;
      InspectionService.addIssue(issueRequest)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            let scheduleObj =
              document.getElementById("Schedule").ej2_instances[0];
            let eventData = {
              Id: this.generateUUID(),
              Subject: issueRequest.issueReporting.issueName,
              StartTime: this.calenderDateObj.startTime,
              EndTime: this.calenderDateObj.endTime,
              IsAllDay: false,
              IssueId: res.data.objectId,
            };
            console.log("data", eventData);
            scheduleObj.addEvent(eventData);
            this.close();
            this.loaderFlag = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.loaderFlag = false;
          this.showToast(err.response.data.description, "error");
        });
    },
    updateIssueAssignment(updateIssueRequest) {
      this.tempScheduleName = updateIssueRequest.issueReporting.issueName;
      InspectionService.updateIssue(updateIssueRequest)
        .then((response) => {
          if (response.status === 200) {
            //this.onActionBegin();
            this.loaderFlag = false;
            this.close();
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
        });
    },
    createServiceRequest(issueRequest) {
      console.log(issueRequest);
      console.log(this.calenderDateObj);
      InspectionService.addIssue(issueRequest)
        .then((res) => {
          if (res.status === 200) {
            this.loaderFlag = false;
            this.showToast(res.data.description, "success");
            let scheduleObj =
              document.getElementById("Schedule").ej2_instances[0];
            let eventData = {
              Id: this.generateUUID(),
              Subject: issueRequest.issueReporting.issueName,
              StartTime: this.calenderDateObj.startTime,
              EndTime: this.calenderDateObj.endTime,
              IsAllDay: false,
            };
            console.log("data", eventData);
            scheduleObj.addEvent(eventData);
            this.close();
          }
        })
        .catch((err) => {
          this.loaderFlag = false;
          this.showToast(err, "error");
          console.log(err);
        });
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
    generateUUID() {
      let d = new Date().getTime();
      if (Date.now()) {
        d = Date.now();
      }

      let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (c) => {
          let r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    selectUser() {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      AssetPersonnelService.getAllUsers(
        currentUserDetails.profile.organizationId
      )
        .then((response) => {
          let users = [];
          for (let index = 0; index < response.data.users.length; index++) {
            let user = {};
            user.label = response.data.users[index].name;
            user.value = response.data.users[index].name;
            user.uuid = response.data.users[index].uuid;
            user.name = response.data.users[index].name;
            users.push(user);
            this.allUsers.push({
              firstName: response.data.users[index].firstName,
              lastName: response.data.users[index].lastName,
              profileImage: response.data.users[index].imageUrl,
              uuid: response.data.users[index].uuid,
            });
          }
          this.Users = users;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    unAssignAsset(index, value) {
      this.assignTableValue = value;
      var currentDate = moment().format();
      if (moment(value.startDate).format() > currentDate) {
        this.futuredUnAssignment(value.assignmentId);
      } else {
        console.log(value);
        this.valueEditAssign = value;
        this.userIndex = index;
        this.assetUuid = value.assetUuid;
        this.keyIndex++;
        this.ShowUnPopUp = true;
      }
    },
    futuredUnAssignment(uuid) {
      this.loaderFlag = true;
      AssetPersonnelService.deletePostAssignmentByUUID(uuid)
        .then((res) => {
          this.showToast(res.data.description, "success");
          //   this.getAssignedUsersOfAsset();
          this.loaderFlag = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editAssigned(index, val) {
      // console.log("edit", val);
      this.valueEditAssign = val;
      this.assetUuid = val.assetUuid;
      this.keyIndex++;
      this.ShowPopUp = true;
      //console.log("test");
    },
    openPopUp(val) {
      this.assetUuid = val;
      this.ShowPopUp = true;
    },
    unAssignUser(value) {
      this.loaderFlag = true;
      console.log(value);
      var currentDate = moment().format();
      var selectedDate = moment(value.assignmentDate).format(
        "YYYY-MM-DDTHH:MM:SSZ"
      );
      var dateSplit = selectedDate.split("T");
      var objDate = dateSplit[0];
      var timeSplit = value.assignmentTime.split(":");
      var hour = timeSplit[0];
      var min = timeSplit[1];
      var assignmentDate = objDate + "T" + hour + ":" + min + ":" + "00+05:00";
      if (
        Date.parse(this.assignTableValue.startDate) > Date.parse(assignmentDate)
      ) {
        this.showToast(
          "Select Date and time later to current assignment date and time.",
          "success"
        );
        return;
      }
      if (value.currentDateTime == true) {
        let DeleteAssignmentRecordRequest = {
          assetUUID: this.assetUuid,
          userUUID: value.uuid,
          endingDate: currentDate,
        };
        console.log(
          "DeleteAssignmentRecordRequest",
          DeleteAssignmentRecordRequest
        );
        //return;
        AssetPersonnelService.unassignAsset(DeleteAssignmentRecordRequest).then(
          (response) => {
            if (response.status === 200) {
              console.log(response);
            }
            //	let users = this.assignedUsers;
            //	let historyUsers = this.assignmentHistoryUsers;
            //	let historyAdded = false;
            //	console.log(users);
            //	debugger
            //	this.deleteModel = false;
            // historyUsers.map((historyItem) => {
            // 	if (historyItem.uuid === value.uuid) {
            // 		historyItem.userEndingDates;
            // 		historyItem.userStartDates;
            // 		historyAdded = true;
            // 	}
            // 	return historyItem;
            // });

            // if (!historyAdded) {
            // 	let newUser = {
            // 		uuid: value.uuid,
            // 		name: users[this.userIndex].name,
            // 		durations: users[this.userIndex].durations,
            // 		userStartDates: users[this.userIndex].userStartDates,
            // 		userEndingDates: users[this.userIndex].userEndingDates,
            // 	};
            // historyUsers.push(newUser);
            //}
            //	users.splice(this.userIndex, 1);
            this.showToast("User Un-Assigned Successfully", "success");
            //this.getAssignedUsersOfAsset();
            //this.getAssignmentHistoryByAsset();
            this.ShowUnPopUp = false;
            this.loaderFlag = false;
          }
        );
      } else if (
        value.currentDateTime == false &&
        currentDate > moment(value.assignmentDate).format()
      ) {
        selectedDate = moment(value.assignmentDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        dateSplit = selectedDate.split("T");
        objDate = dateSplit[0];
        timeSplit = value.assignmentTime.split(":");
        hour = timeSplit[0];
        min = timeSplit[1];
        let assignmentDate =
          objDate + "T" + hour + ":" + min + ":" + "00+05:00";
        let DeleteAssignmentRecordRequest = {
          assetUUID: value.assetUuid,
          userUUID: value.uuid,
          endingDate: moment(assignmentDate).format(),
        };
        AssetPersonnelService.unassignAsset(DeleteAssignmentRecordRequest).then(
          (response) => {
            if (response.status === 200) {
              console.log(response);
            }
            let users = this.assignedUsers;
            let historyUsers = this.assignmentHistoryUsers;
            let historyAdded = false;
            historyUsers.map((historyItem) => {
              if (historyItem.uuid === value.uuid) {
                historyItem.userEndingDates;
                historyItem.userStartDates;
                historyAdded = true;
              }
              return historyItem;
            });

            if (!historyAdded) {
              let newUser = {
                uuid: value.uuid,
                name: users[this.userIndex].name,
                durations: users[this.userIndex].durations,
                userStartDates: users[this.userIndex].userStartDates,
                userEndingDates: users[this.userIndex].userEndingDates,
              };
              historyUsers.push(newUser);
            }
            users.splice(this.userIndex, 1);
            this.showToast("User Un-Assigned Successfully", "success");
            //	this.getAssignedUsersOfAsset();
            //this.getAssignmentHistoryByAsset();
            this.ShowUnPopUp = false;
            this.loaderFlag = false;
          }
        );
      } else if (
        currentDate < moment(value.assignmentDate).format() &&
        value.currentDateTime == false
      ) {
        selectedDate = moment(value.assignmentDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        dateSplit = selectedDate.split("T");
        objDate = dateSplit[0];
        timeSplit = value.assignmentTime.split(":");
        hour = timeSplit[0];
        min = timeSplit[1];
        let assignmentDate =
          objDate + "T" + hour + ":" + min + ":" + "00+05:00";
        value.startDate = assignmentDate;
        this.unAssignmentUserLater(value);
      }
    },
    unAssignmentUserLater(value) {
      this.loaderFlag = true;
      InspectionService.getInspectionTempaltesByAsset(this.assetUuid)
        .then((response) => {
          if (response.status === 200) {
            let postAssignment = [];
            let obj = {
              assignmentUUID: value.assignmentUUID,
              assetId: this.assetUuid,
              userId: value.uuid,
              assign: false,
              endDate: value.startDate,
            };
            postAssignment.push(obj);
            let UpdateAssetAssignmentRequest = {};
            UpdateAssetAssignmentRequest.inspectionTemplates =
              response.data.inspectionTemplates;
            UpdateAssetAssignmentRequest.postAssignment = postAssignment;
            AssetPersonnelService.addPostAssignmentOrUnAssignment(
              UpdateAssetAssignmentRequest
            )
              .then((res) => {
                this.showToast(res.data.description, "success");
                this.ShowUnPopUp = false;
                //	this.getAssignedUsersOfAsset();
                //	this.getAssignmentHistoryByAsset();
                this.loaderFlag = false;
              })
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
    updateAssignUser(value) {
      console.log("before value", value);
      //	this.loaderFlag = true;

      var selectedDate = moment(value.assignmentDate).format(
        "YYYY-MM-DDTHH:MM:SSZ"
      );
      var dateSplit = selectedDate.split("T");
      var objDate = dateSplit[0];
      var timeSplit = value.assignmentTime.split(":");
      var hour = timeSplit[0];
      var min = timeSplit[1];
      let futureAssignmentDate =
        objDate + "T" + hour + ":" + min + ":" + "00+05:00";
      value.startDate = futureAssignmentDate;
      var currentDate = moment().format();
      console.log("after value", value);
      console.log(new Date(currentDate));
      // end Date Handler
      var unAssignmentDate = moment(value.unAssignmentDate).format(
        "YYYY-MM-DD"
      );
      var unTimeSplit = value.unAssignmentTime.split(":");
      var endHour = unTimeSplit[0];
      var endMin = unTimeSplit[1];
      let endAssignmentDate =
        unAssignmentDate + "T" + endHour + ":" + endMin + ":" + "00+05:00";

      let scheduleObj = document.getElementById("Schedule").ej2_instances[0];
      let eventData = {
        Id: this.generateUUID(),
        Subject: "Asset Assignment",
        // StartTime: currentDate,
        // EndTime: new Date(futureAssignmentDate),
        IsAllDay: false,
      };
      if (value.currentDateTime && value.endCurrentDateTime) {
        console.log("1");
        eventData.StartTime = new Date(currentDate);
        eventData.EndTime = new Date(currentDate);
      } else if (
        value.currentDateTime === false &&
        value.endCurrentDateTime === false
      ) {
        console.log("2");
        (eventData.StartTime = new Date(futureAssignmentDate)),
          (eventData.EndTime = new Date(endAssignmentDate));
      }
      if (value.endCurrentDateTime && value.currentDateTime === false) {
        console.log("3");
        eventData.StartTime = new Date(futureAssignmentDate);
        eventData.endTime = new Date(currentDate);
      } else if (
        value.endCurrentDateTime === false &&
        value.currentDateTime === true
      ) {
        console.log("4");
        eventData.StartTime = new Date(currentDate);
        eventData.endTime = new Date(endAssignmentDate);
      }
      console.log("data", eventData);
      scheduleObj.addEvent(eventData);

      this.updateCurrentAssignment(value);
    },
    updateCurrentAssignment(value) {
      if (value.user.length > 1) {
        this.showToast("Select only one user", "error");
        return;
      }
      InspectionService.getInspectionTempaltesByAsset(value.assetUuid)
        .then((response) => {
          if (response.status == 200) {
            let UpdateAssetAssignmentRequest = {
              assignmentId: value.assignmentId,
              assetId: value.assetUuid,
              userId: value.user[0].uuid,
            };
            //let date = Date();
            var currentDate = moment().format();
            if (value.currentDateTime == true) {
              UpdateAssetAssignmentRequest.startDate = currentDate;
            } else {
              UpdateAssetAssignmentRequest.startDate = value.startDate;
            }

            AssetPersonnelService.editAssignmentRecord(
              UpdateAssetAssignmentRequest
            )
              .then((response1) => {
                if (response1.status === 200) {
                  this.showToast("Asset Update successfully", "success");
                  //  this.getAssignedUsersOfAsset();
                  this.ShowPopUp = false;
                  this.loaderFlag = false;
                }
              })
              .catch((error1) => {
                // this.setState({loading:false});
                if (error1.response.status === 406) {
                  this.showToast(
                    "Error while assigning user to the asset",
                    "error"
                  );
                } else {
                  this.showToast(
                    "Error while assigning user to the asset",
                    "error"
                  );
                }
              });
          }
        })
        .catch((error) => {
          if (error) {
            this.showToast("Error while assigning user to the asset", "error");
          } else {
            this.showToast("Error while assigning user to the asset", "error");
          }
        });
    },
    assignUser(value) {
      if (this.value !== null) {
        var selectedDate = moment(value.assignmentDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        var dateSplit = selectedDate.split("T");
        var objDate = dateSplit[0];
        var timeSplit = value.assignmentTime.split(":");
        var hour = timeSplit[0];
        var min = timeSplit[1];
        let assignmentDate =
          objDate + "T" + hour + ":" + min + ":" + "00+05:00";
        var currentDate = moment().format();
        if (value.currentDateTime == true) {
          value.startDate = assignmentDate;
          this.assignmentUserCurrentDate(value);
        } else if (
          assignmentDate > currentDate &&
          value.currentDateTime == false
        ) {
          value.startDate = assignmentDate;
          this.assignmentUserLater(value);
        } else if (assignmentDate < currentDate) {
          value.startDate = assignmentDate;
          this.pastAssignmentUserCurrentDate(value);
        }
      }
    },
    assignmentUserCurrentDate(value) {
      var unAssignmentDate = moment(value.unAssignmentDate).format(
        "YYYY-MM-DD"
      );
      var timeSplit = value.unAssignmentTime.split(":");
      var hour = timeSplit[0];
      var min = timeSplit[1];
      let assignmentDate =
        unAssignmentDate + "T" + hour + ":" + min + ":" + "00+05:00";
      var currentDate = moment().format();
      this.loaderFlag = true;
      InspectionService.getInspectionTempaltesByAsset(this.assetUuid)
        .then((response) => {
          //	var currentDate = moment().format();
          if (response.status === 200) {
            let assignmentRecord = [];
            for (let index = 0; index < value.user.length; index++) {
              const userId = value.user[index].uuid;
              let obj = {
                assetId: this.assetUuid,
                assetManagerId: userId,
                type: "",
                startedAt: currentDate,
              };
              assignmentRecord.push(obj);
            }
            let addAssetAssignmentRequest = {};
            addAssetAssignmentRequest.inspectionTemplates =
              response.data.inspectionTemplates;
            addAssetAssignmentRequest.assignmentRecord = assignmentRecord;
            console.log("assignmentRecord", assignmentRecord);
            AssetPersonnelService.addAssignmentRecord(addAssetAssignmentRequest)
              .then((response1) => {
                if (response1.status === 200) {
                  this.sendNotificationToAssignedUserOfAssets(
                    addAssetAssignmentRequest
                  );
                  let userdetail = [];
                  AssetPersonnelService.getUserDetailByAssetIdAndUserId(
                    this.assetUuid,
                    value.value
                  )
                    .then((response2) => {
                      if (response2.status === 200) {
                        userdetail.uuid = value.value;
                        userdetail.name = value.display;
                        userdetail.startDate = response2.data.user.startDate;
                        userdetail.count = response2.data.user.count;
                        this.assignedUsers.push(userdetail);
                        let scheduleObj =
                          document.getElementById("Schedule").ej2_instances[0];
                        let eventData = {
                          Id: this.generateUUID(),
                          Subject: "Asset Assignment",
                          StartTime: currentDate,
                          EndTime: new Date(assignmentDate),
                          IsAllDay: false,
                        };
                        console.log("data", eventData);
                        scheduleObj.addEvent(eventData);
                        console.log("assignmentRecord", assignmentRecord);
                        this.showToast(
                          "Asset Assigned to user Successfully",
                          "success"
                        );
                        this.ShowPopUp = false;
                        this.loaderFlag = false;
                        this.close();
                      } else {
                        this.showToast(
                          "Error while assigning user to the asset",
                          "error"
                        );
                      }
                    })
                    .catch((error2) => {
                      if (error2.response.status === 406) {
                        this.showToast(
                          "Error while assigning user to the asset",
                          "error"
                        );
                      } else {
                        this.showToast(
                          "Error while assigning user to the asset",
                          "error"
                        );
                      }
                    });
                } else {
                  console.log("error");
                }
              })
              .catch((error1) => {
                console.log(error1.response);
                if (error1.response === undefined) {
                  this.showToast(
                    "Error while assigning user to the asset",
                    "error"
                  );
                } else if (error1.response.data.responseCode === "F500") {
                  this.showToast(error1.response.data.description, "error");
                }
              });
          }
        })
        .catch((error) => {
          if (error) {
            this.showToast("Error while assigning user to the asset", "error");
          } else {
            this.showToast("Error while assigning user to the asset", "error");
          }
        });
    },
    assignmentUserLater(value) {
      //combine start Date and time....
      var assignmentDate = moment(value.assignmentDate).format("YYYY-MM-DD");
      var startTimeSplit = value.assignmentTime.split(":");
      var startHour = startTimeSplit[0];
      var startMin = startTimeSplit[1];
      let startDate =
        assignmentDate + "T" + startHour + ":" + startMin + ":" + "00+05:00";

      //combine end Date and time....
      var unAssignmentDate = moment(value.unAssignmentDate).format(
        "YYYY-MM-DD"
      );
      var endTimeSplit = value.unAssignmentTime.split(":");
      var endHour = endTimeSplit[0];
      var endMin = endTimeSplit[1];
      let endDate =
        unAssignmentDate + "T" + endHour + ":" + endMin + ":" + "00+05:00";
      this.loaderFlag = true;
      InspectionService.getInspectionTempaltesByAsset(this.assetUuid)
        .then((response) => {
          if (response.status === 200) {
            let postAssignment = [];
            for (let index = 0; index < value.user.length; index++) {
              const userId = value.user[index].uuid;
              let obj = {
                assignmentUUID: "",
                assetId: this.assetUuid,
                userId: userId,
                assign: true,
                startDate: value.startDate,
              };
              postAssignment.push(obj);
            }
            let UpdateAssetAssignmentRequest = {};
            UpdateAssetAssignmentRequest.inspectionTemplates =
              response.data.inspectionTemplates;
            UpdateAssetAssignmentRequest.postAssignment = postAssignment;
            //	return;
            AssetPersonnelService.addPostAssignmentOrUnAssignment(
              UpdateAssetAssignmentRequest
            )
              .then((res) => {
                let scheduleObj =
                  document.getElementById("Schedule").ej2_instances[0];
                let eventData = {
                  Id: this.generateUUID(),
                  Subject: "Asset Assignment",
                  StartTime: new Date(startDate),
                  EndTime: new Date(endDate),
                  IsAllDay: false,
                };
                console.log("data", eventData);
                scheduleObj.addEvent(eventData);
                this.showToast(res.data.description, "success");
                this.ShowPopUp = false;
                this.loaderFlag = false;
                this.close();
                //	this.getAssignedUsersOfAsset();
              })
              .catch((e) => {
                console.log(e);
              });
          }
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
    pastAssignmentUserCurrentDate(value) {
      this.loaderFlag = true;
      InspectionService.getInspectionTempaltesByAsset(this.assetUuid)
        .then((response) => {
          if (response.status === 200) {
            //	debugger
            let assignmentRecord = [];
            for (let index = 0; index < value.user.length; index++) {
              const userId = value.user[index].uuid;
              let obj = {
                assetId: this.assetUuid,
                assetManagerId: userId,
                type: "",
                startedAt: value.startDate,
              };
              assignmentRecord.push(obj);
            }
            let addAssetAssignmentRequest = {};
            addAssetAssignmentRequest.inspectionTemplates =
              response.data.inspectionTemplates;
            addAssetAssignmentRequest.assignmentRecord = assignmentRecord;
            //	return;
            AssetPersonnelService.addAssignmentRecord(addAssetAssignmentRequest)
              .then((response1) => {
                if (response1.status === 200) {
                  this.sendNotificationToAssignedUserOfAssets(
                    addAssetAssignmentRequest
                  );
                  let userdetail = [];
                  AssetPersonnelService.getUserDetailByAssetIdAndUserId(
                    this.assetUuid,
                    value.value
                  )
                    .then((response2) => {
                      if (response2.status === 200) {
                        userdetail.uuid = value.value;
                        userdetail.name = value.display;
                        userdetail.startDate = response2.data.user.startDate;
                        userdetail.count = response2.data.user.count;
                        this.assignedUsers.push(userdetail);
                        this.showToast(
                          "Asset Assigned to user Successfully",
                          "success"
                        );
                        //this.getAssignedUsersOfAsset();
                        this.loaderFlag = false;
                        this.ShowPopUp = false;
                      } else {
                        this.showToast(
                          "Error while assigning user to the asset",
                          "error"
                        );
                      }
                    })
                    .catch((error2) => {
                      //   this.setState({loading:false});
                      if (error2.response.status === 406) {
                        this.showToast(
                          "Error while assigning user to the asset",
                          "error"
                        );
                      } else {
                        this.showToast(
                          "Error while assigning user to the asset",
                          "error"
                        );
                      }
                    });
                }
              })
              .catch((error1) => {
                if (error1.response.status === 406) {
                  this.showToast(
                    "Error while assigning user to the asset",
                    "error"
                  );
                } else {
                  this.showToast(
                    "Error while assigning user to the asset",
                    "error"
                  );
                }
              });
          }
        })
        .catch((error) => {
          if (error) {
            this.showToast("Error while assigning user to the asset", "error");
          } else {
            this.showToast("Error while assigning user to the asset", "error");
          }
        });
    },
    sendNotificationToAssignedUserOfAssets(addAssetAssignmentRequest) {
      AssetPersonnelService.sendNotificationToAssignedUsers(
        addAssetAssignmentRequest
      )
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // remove after Completing
    getPaginatedInspectionTemplates() {
      let requestObj = {
        // searchQuery: searchQuery,
        // searchColumns: searchColumns,
        filters: [],
        sortField: "createdAt",
        sortDirection: "desc",
        offset: 0,
        limit: 100,
        tenantUUID: this.currentUserDetails.profile.organizationId,
        assigned: true,
      };

      InspectionService.getPaginatedPendingInspectionReportsForSDT(requestObj)
        .then((response) => {
          if (response.status == 200) {
            response.data.sdtData.content.map((item) => {
              item.createdAt = moment.utc(item.createdAt).local().format();
            });
            let inspectionTemplates = response.data.sdtData.content;
            let array = [];
            for (let i = 0; i < inspectionTemplates.length; i++) {
              if (
                (inspectionTemplates[i].deadLineDate !== null &&
                  inspectionTemplates[i].deadLineTime !== null) ||
                (inspectionTemplates[i].deadLineDate !== "" &&
                  inspectionTemplates[i].deadLineTime !== "")
              ) {
                // end Date Handler
                var deadLineDate = moment(
                  inspectionTemplates[i].deadLineDate
                ).format("YYYY-MM-DD");
                var deadLineTime =
                  inspectionTemplates[i].deadLineTime.split(":");
                var endHour = deadLineTime[0];
                var endMin = deadLineTime[1];
                let endAssignmentDate =
                  deadLineDate +
                  "T" +
                  endHour +
                  ":" +
                  endMin +
                  ":" +
                  "00+05:00";
                let ScheduleObj = {
                  id: 1,
                  // GId: inspectionTemplates[i].uuid,
                  Subject: inspectionTemplates[i].name,
                  StartTime: new Date(inspectionTemplates[i].createdAt),
                  EndTime: new Date(endAssignmentDate),
                  IsAllDay: false,
                };
                scheduleData.push(ScheduleObj);
                //console.log(scheduleData)
                this.scheduleKey++;
              }
            }

            this.loaderFlag = false;
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
            // alert(error.response.data.description);
            this.$emit("showToast", error.response.data.description, "error");
          }
        });
    },
    // remove after Completing
    async GetSchedulerTickets() {
      this.loaderFlag = true;
      var startDate = moment().startOf("week");
      var endDate = moment().endOf("week");
      let requestObj = {
        tenantUUID: this.currentUserDetails.profile.organizationId,
        dataBy: "week",
        startDate:
          this.scheduleStartTime == "" && this.schedulerEndTime == ""
          ? this.scheduleStartTime : startDate,
        endDate:
          this.scheduleStartTime == "" && this.schedulerEndTime == ""
          ? this.scheduleEndTime :  endDate ,
        searchQuery: "",
        inspectionFilters: {},
        assignmentFilters: {},
        serviceRequestFilters: {},
        issueFilters: {},
        workOrderFilters: {},
      };
      // console.log("requestObj", requestObj);
  

      this.currentUserDetails.profile.organizationId;
      try {
      let response = await schedulerService.getSchedularTickets(requestObj)
      
          if (response.status == 200) {
            let schedulerTemplates = response.data.schedulers;
            let array = [];

            for (let i = 0; i < schedulerTemplates.length; i++) {
              var templateData = JSON.parse(schedulerTemplates[i].templateData);
              var reOcurrenceRule = "";
              if (schedulerTemplates[i].frequencyType == "ad-hoc") {
                this.scheduleObjStartDate = moment
                  .utc(templateData.deadLineDate)
                  .format();
                this.scheduleObjEndDate = moment
                  .utc(this.scheduleObjStartDate)
                  .add(30, "minutes")
                  .format();
              } else if (schedulerTemplates[i].frequencyType == "daily") {


              this.scheduleObjStartDate = moment.utc(templateData.deadLineDate).format();
              this.scheduleObjEndDate = moment.utc(this.scheduleObjStartDate).add(30, "minutes").format();


                if (templateData.endType == "never") {
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";";
                } else if (templateData.endType == "on") {
                  let date = moment(templateData.endDate).format("YYYY-MM-DD");
                  let time = moment(templateData.deadLineDate).format(
                    "HH:mm:ss"
                  );
                  startDate = date + "T" + time;
                  let DateFormatString =
                    moment(startDate).format("YYYYMMDDTHHmmss");
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";UNTIL=" +
                    DateFormatString +
                    ";";
                } else if (templateData.endType === "after") {
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";COUNT=" +
                    templateData.occurrence +
                    ";";
                } else {
                  reOcurrenceRule = "";
                }
              } else if (schedulerTemplates[i].frequencyType == "weekly") {
                this.scheduleObjStartDate = moment
                  .utc(templateData.startDate)
                  .format();
                this.scheduleObjEndDate = moment
                  .utc(this.scheduleObjStartDate)
                  .add(30, "minutes")
                  .format();
                let freDay = JSON.parse(templateData.frequencyDays);
                let array = [];
                for (let index = 0; index < freDay.length; index++) {
                  var element = freDay[index].value.slice(0, 2);
                  array.push(element);
                }
                let freDays = array.join();

                if (
                  templateData.endType === "never" &&
                  schedulerTemplates[i].frequencyType == "weekly"
                ) {
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";BYDAY=" +
                    freDays +
                    ";";
                } else if (
                  templateData.endType === "on" &&
                  schedulerTemplates[i].frequencyType == "weekly"
                ) {
                  let date = moment(templateData.endDate).format("YYYY-MM-DD");
                  let time = "00:00:00.000+00:00";
                  startDate = date + "T" + time;

                  let DateFormatString =
                    moment(startDate).format("YYYYMMDDTHHmmss");
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";UNTIL=" +
                    DateFormatString +
                    ";BYDAY=" +
                    freDays +
                    ";";

                } else if (
                  templateData.endType === "after" &&
                  schedulerTemplates[i].frequencyType == "weekly"
                ) {
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";COUNT=" +
                    templateData.occurrence +
                    ";BYDAY=" +
                    freDays +
                    ";";
                }
              } else if (schedulerTemplates[i].frequencyType == "monthly") {
                this.scheduleObjStartDate = moment
                  .utc(templateData.startDate)
                  .format();
                this.scheduleObjEndDate = moment
                  .utc(this.scheduleObjStartDate)
                  .add(30, "minutes")
                  .format();

                if (templateData.endType === "never") {
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";BYMONTHDAY=" +
                    templateData.repeatMonthDay +
                    ";";
                } 
                else if (
                  templateData.endType === "on" &&
                  schedulerTemplates[i].frequencyType === "monthly"
                ) {
                  let date = templateData.endDate;
                  var objDate = moment(date).format("YYYYMMDD");
                  let DateFormatString = objDate + "T" + "0000" + "00Z";
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";UNTIL=" +
                    DateFormatString +
                    ";BYMONTHDAY=" +
                    templateData.repeatMonthDay +
                    ";";
                } 
                else if (templateData.endType === "after") {
                  reOcurrenceRule = "FREQ=" +schedulerTemplates[i].frequencyType.toUpperCase() +";INTERVAL=" +templateData.repeatEvery+";COUNT=" +templateData.occurrence +";BYMONTHDAY="+templateData.repeatMonthDay +";";
          
                }

              } else if (schedulerTemplates[i].frequencyType == "yearly") {
                this.scheduleObjStartDate = moment
                  .utc(templateData.startDate)
                  .format();
                this.scheduleObjEndDate = moment
                  .utc(this.scheduleObjStartDate)
                  .add(30, "minutes")
                  .format();
                let monthNo = JSON.parse(templateData.frequencyDays);
                for (let index = 0; index < monthNo.length; index++) {
                  var monthValue = monthNo[index].value;
                }
                if (templateData.endType === "never") {
                   reOcurrenceRule = "FREQ=" +schedulerTemplates[i].frequencyType.toUpperCase() +";INTERVAL=" +templateData.repeatEvery +";BYMONTHDAY=" +templateData.repeatMonthDay+";BYMONTH=" +monthValue +";";
                } else if (
                  templateData.endType === "on" &&
                  schedulerTemplates[i].frequencyType === "yearly"
                ) {
                  let date = templateData.endDate;
                  let objDate = moment(date).format("YYYYMMDD");
                  let DateFormatString = objDate + "T" + "0000" + "00Z";
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";UNTIL=" +
                    DateFormatString +
                    ";BYMONTHDAY=" +
                    templateData.repeatMonthDay +
                    ";BYMONTH=" +
                    monthValue +
                    ";";
                } else if (templateData.endType === "after") {
                  reOcurrenceRule =
                    "FREQ=" +
                    schedulerTemplates[i].frequencyType.toUpperCase() +
                    ";INTERVAL=" +
                    templateData.repeatEvery +
                    ";COUNT=" +
                    templateData.occurrence +
                    ";BYMONTHDAY=" +
                    templateData.repeatMonthDay +
                    ";BYMONTH=" +
                    monthValue +
                    ";";
                }
              } else {
              }
              // console.log("schedulerTemplates[i]", schedulerTemplates[i]);
              let ScheduleObj = {
                id: schedulerTemplates[i].dataUuid,
                tenantUUID: this.currentUserDetails.profile.organizationId,
                Subject: schedulerTemplates[i].eventName,
                StartTime: new Date(this.scheduleObjStartDate),
                EndTime: new Date(this.scheduleObjEndDate),
                IsAllDay: false,
                RecurrenceRule: reOcurrenceRule,
              };
              scheduleData.push(ScheduleObj);
              // console.log("ScheduleObj", ScheduleObj);
              let scheduleObj = document.getElementById("Schedule").ej2_instances[0]; 
              scheduleObj.eventSettings.dataSource = scheduleData

            }
            this.scheduleKey++;
            this.loaderFlag = false;
          } else {
            this.$emit(
              "showToast",
              "Opps its look like our server is offline",
              "error"
            );
          }
        }
        catch(error) {
          if (error.response !== undefined && error.response.status === 406) {
            // alert(error.response.data.description);
            this.$emit("showToast", error.response.data.description, "error");
          }
        }
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.selectUser();
    // this.getPaginatedInspectionTemplates();
    this.GetSchedulerTickets();
    //this.onActionBegin();
    //this.getAssignedUsersOfAsset();
    //this.getAssignmentHistoryByAsset();
  },
};
</script>
<style>
.main-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.left-column {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 36px 0 36px;
  display: flex;
}

.filter-btn,
.search-btn {
  margin-right: 8px;
  width: 23px;
  height: 43px;
  padding: 0 12px;
  background-color: #d9d9d9;
  cursor: pointer;
}

.filter-btn:hover,
.search-btn:hover {
  background-color: #597498;
  color: white;
}

.btn-clas {
  float: right;
  /* margin: 36px 0; */
  height: 88px;
  width: 44px !important;
}

.btn-class {
  float: right;
  margin: 36px 0;
  height: 88px;
  width: 44px !important;
  margin-left: 10px;
}

.arrow-right .arrow-icon {
  position: unset;
}
</style>
