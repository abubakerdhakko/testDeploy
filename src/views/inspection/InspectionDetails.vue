<template>
  <div class="pt-32" v-margin-top="40">
    <span class="head-title"
      >{{ inspectionDetail.name }} -
      {{ inspectionDetail.inspectionNumber }}</span
    ><br />
    <span class="subtitle"
      >View all the information related to an Inspection here</span
    >

    <div class="flex-container">
      <div class="data-sec">
        <SAccordion
          :title="'Inspection Items'"
          :expandIcon="'arrows'"
          :open="true"
          :padding="'36'"
          ref="allItemsAccordion"
          @state="allItemsAccordionFunction"
        >
          <div>
            <InspectionItems
              v-if="inspectionReportItems && imageVoices"
              :inspectionReportItem="
                inspectionReportItems.inspectionReportCategories
              "
              :imageVoices="imageVoices"
              :assetUUID="assetUUID"
              @showToast="showToast"
              :key="updateComp"
              @updateInspectionItems="refreshInspectionReport"
              @setLoading="setLoading"
            >
            </InspectionItems>
          </div>
        </SAccordion>
        <SAccordion
          v-if="
            (inspectionDetail && inspectionDetail.inspectionType != 'ad-hoc') &&
              ($route.params.inspectionChild === false &&
                $route.params.serviceRequestChild === false) ||
              ($route.params.inspectionChild === 'false' &&
                $route.params.serviceRequestChild === 'false')
          "
          :title="'Additional Inspections'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'48'"
          v-margin-top="32"
          ref="additionalInspectionsAccordion"
          @state="additionalInspectionsAccordionFunction"
        >
          <div class="table-grid">
            <div class="btn-class pt-16 mb-8">
              <SButton
                v-if="
                  inspectionDetail &&
                    inspectionDetail.inspectionType != 'ad-hoc'
                "
                title="Request Additional Inspection"
                @click="requestAdditional"
              />
            </div>
            <!-- <span class="table-heading">Pending</span> -->
            <table>
              <tr>
                <th>Name</th>
                <th>Created On</th>
                <th>Submitted By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

              <tr v-for="(item, index) in dataPending" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.createdAt }}</td>
                <td>{{ item.submittedByUserName }}</td>
                <td>{{ item.status }}</td>

                <td>
                  <img
                    src="/assets/icons/Results.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer"
                    @click="openPopUp(item)"
                  />
                </td>
              </tr>
            </table>

            <div class="pagination">
              <SPagination
                v-model="currentPage"
                :page-count="numberOfPages"
                @input="pagination"
                :minimal="false"
              />
            </div>

            <div v-if="parentInspection !== null">
              <span class="table-heading pt-8"
                >parent inspection name or ID
              </span>
              <table>
                <tr>
                  <th>Inspection #</th>
                  <th>Name</th>
                  <th>Date & Time</th>
                  <th>Inspected By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

                <tr v-for="(item, index) in submittedInpection" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.createdAt | date }}</td>
                  <td>{{ item.submittedByUserName }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.createdAt | date }}</td>
                  <td>{{ item.submittedByUserName }}</td>
                </tr>
              </table>

              <div class="pagination">
                <SPagination
                  v-model="currentPage"
                  :page-count="numberOfPages"
                  @input="pagination"
                  :minimal="false"
                />
              </div>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          :title="'Source of Additional Inspection'"
          v-if="
            $route.params.inspectionChild === 'true' ||
              $route.params.serviceRequestChild === true ||
              $route.params.serviceRequestChild === 'true'
          "
          :expandIcon="'arrows'"
          :open="false"
          :padding="'48'"
          v-margin-top="32"
          v-margin-bottom="50"
          ref="additionalInspectionsSourceAccordion"
          @state="additionalInspectionsSourceAccordionFunction"
        >
          <div
            class="table-grid"
            v-if="
              $route.params.inspectionChild === true ||
                $route.params.inspectionChild === 'true'
            "
          >
            <table>
              <tr>
                <th>Inspection No.</th>
                <th>Name</th>
                <!-- <th>Type</th> -->
                <th>Status</th>
                <th>Inspected By</th>
                <th>Inspected At</th>
                <th>Actions</th>
              </tr>

              <tr>
                <td>{{ parentInspectionDetail.inspectionNumber }}</td>
                <td>{{ parentInspectionDetail.name }}</td>
                <td>{{ parentInspectionDetail.inspectionType }}</td>
                <td>{{ parentInspectionDetail.status }}</td>
                <td>{{ parentInspectionDetail.submittedByUserName }}</td>
                <td>{{ parentInspectionDetail.createdAt }}</td>

                <td>
                  <img
                    src="/assets/icons/Results.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer"
                    @click="openParentInspection(parentInspectionDetail.uuid)"
                  />
                </td>
              </tr>
            </table>
          </div>
          <div
            class="table-grid"
            v-if="
              $route.params.serviceRequestChild === true ||
                $route.params.serviceRequestChild === 'true'
            "
          >
            <table>
              <tr>
                <th>SR No.</th>
                <th>Name</th>
                <!-- <th>Request by</th> -->
                <th>Periority</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Resolved By</th>
                <th>Resolved At</th>
                <th>Action</th>
              </tr>

              <tr>
                <td>{{ serviceReuqestDetail.issueNumber }}</td>
                <td>{{ serviceReuqestDetail.issueName }}</td>
                <!-- <td>{{ serviceReuqestDetail.reportedBy }}</td> -->
                <td>{{ serviceReuqestDetail.priority }}</td>
                <td>{{ serviceReuqestDetail.reportedAt }}</td>
                <td>{{ serviceReuqestDetail.status }}</td>
                <td>{{ serviceReuqestDetail.resolvedByUserName }}</td>
                <td>{{ serviceReuqestDetail.resolvedAt }}</td>

                <td>
                  <img
                    src="/assets/icons/Results.svg"
                    alt=""
                    width="20px"
                    style="cursor: pointer"
                    @click="openParentServiceRequest(serviceReuqestDetail)"
                  />
                </td>
              </tr>
            </table>
          </div>
        </SAccordion>
      </div>
      <div class="empty-sec"></div>
      <div class="info-sec" id="position-sidebar">
        <div id="position-sidebar-container">
          <Sidebar
            :asset="asset"
            :locations="inspectionItemslocations"
            :inspectionObj="inspectionDetail"
          />
        </div>
      </div>
    </div>
    <RequestInspection
      v-if="inspectionRequest"
      @createInspection="createAdditonalInspection"
      :asset="asset"
      :tempName="templateName"
      @selectedTemplates="selectedTemplates"
      @close="close"
      @showToast="showToast"
    />

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
import Sidebar from "../inspection/components/Sidebar";
import InspectionService from "../../services/InspectionService";
import RequestInspection from "../../views/inspection/components/RequestInspection";
import AssetManagementService from "../../services/AssetManagementService";
import AssetPersonnelService from "../../services/AssetPersonnelService";
import moment from "moment";
import InspectionItems from "../../components/InspectionItems";

import loader from "@/components/Loader.vue";

var stringOptionsAssignUsers = [];
export default {
  name: "InspectionDetails",

  components: {
    Sidebar,
    RequestInspection,
    InspectionItems,
    loader,
  },

  data() {
    return {
      updateComp: 0,
      /* Toast Properties */
      toastTimeOut: 3000,
      toastMessage: "",
      toastType: "",
      toastFlag: 0,
      /* Toast Properties */
      loaderFlag: false,
      assetCategoryOptions: [],
      allAssetData: [],
      inspectionDetail: {},
      parentInspectionDetail: {},
      asset: {},
      additionalInspectionsAccordion: false,
      inspectionRequest: false,
      selectedInspectionItems: [],
      currentPage: 1,
      numberOfPages: "",
      dataPending: [],
      inspectionReportUUID: "",
      allUsers: [],
      submittedInpection: [],
      imageVoices: "",
      inspectionReportItems: "",
      assetUUID: "",
      templateName: "",
      inspectionItemslocations: [],
      inspectionuuid: "",
      SelectedItems: {},
      type: "Ad-hoc",
      parentInspection: "",
      ParentUUID: "",
      serviceReuqestDetail: "",
    };
  },

  props: {
    inspectionUUID: {},
  },
  methods: {
    createAdditonalInspection(value) {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      if (value.assignedTo === "Users") {
        this.$v.assignedUser.$touch();
        if (this.$v.assignedUser.$error) {
          this.showToast("Please Select Users", "error");
          return;
        }
      }
      if (value.selectedTemplate === "") {
        this.showToast("Please Select Template", "error");
        return;
      }

      let addInspectionTemplateRequest = {};
      let inspectionTemplate = {};
      let inspectionItemCategories = [];
      inspectionTemplate.name = value.name;
      inspectionTemplate.deadLineDate = moment(value.deadline).toISOString();
      inspectionTemplate.deadLineTime = value.adhocTime;
      inspectionTemplate.description = null;
      inspectionTemplate.type = this.type + " Inspection Report";
      if (value.assignedUser === "") {
        inspectionTemplate.createdForUserUUID = null;
      } else {
        inspectionTemplate.createdForUserUUID = value.assignedUser;
      }
      if (value.assignedUserGroup === "") {
        inspectionTemplate.createdForUserGroupUUID = null;
      } else {
        inspectionTemplate.createdForUserGroupUUID = value.assignedUserGroup;
      }
      inspectionTemplate.newAdditional = true;
      inspectionTemplate.serviceRequestUUID = null;
      inspectionTemplate.parentInspectionUUID = this.$route.params.inspectionUUID;
      inspectionTemplate.companyUUID =
        currentUserDetails.profile.organizationId;
      inspectionTemplate.assetCategoryUUID = this.asset.categoryUUID;
      inspectionTemplate.assetUUID = this.asset.uuid;
      inspectionTemplate.frequencyType = "ad-hoc";
      inspectionTemplate.createdByUserUUID = currentUserDetails.profile.userid;
      inspectionTemplate.createdByUserName =
        currentUserDetails.profile.firstName +
        " " +
        currentUserDetails.profile.lastName;

      let reminderarray = [];
      for (let index = 0; index < value.reminderArray.length; index++) {
        let obj = {
          reminder: value.reminderArray[index].reminder,
          durationValue: value.reminderArray[index].durationValue,
          durationType: value.reminderArray[index].durationType,
        };
        reminderarray.push(obj);
        inspectionTemplate.reminder = JSON.stringify(reminderarray);
      }

      for (let index = 0; index < value.selectedTemplate.length; index++) {
        let inspectionItemCategory = {};
        let inspectionItems = [];
        inspectionItemCategory.name =
          value.selectedTemplate[index].itemName.value;
        let answers = value.selectedTemplate[index].answers.value;
        let answer = [];
        for (let index = 0; index < answers.length; index++) {
          answer.push(answers[index].value);
        }
        let obj = {
          name: value.selectedTemplate[index].itemName.value,
          //	answers: value.selectedTemplate[index].answers.value,
          type: value.selectedTemplate[index].type.value,
          mandatory: value.selectedTemplate[index].mandatory.value,
          description: "",
        };
        obj.answers = answer;
        inspectionItemCategories.push(inspectionItemCategory);
        inspectionItems.push(obj);
        inspectionItemCategory.inspectionItems = inspectionItems;
      }

      inspectionTemplate.inspectionItemCategories = inspectionItemCategories;
      addInspectionTemplateRequest.inspectionTemplate = inspectionTemplate;
      //return;
      InspectionService.addInspectionTemplateOfInspectionRequest(
        addInspectionTemplateRequest
      )
        .then((response) => {
          if (response.status === 200) {
            this.loaderFlag = false;
            this.showToast("Additonal Schedule Created Successfuly", "success");
            this.inspectionRequest = false;
            this.submittedAndPendingInspection();
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.showToast("Request Error", "error");
          } else {
            this.showToast("An unexpected Error Occurred", "error");
          }
        });
    },
    selectedTemplates(value) {
      this.SelectedItems = value;
    },

    requestAdditional() {
      this.inspectionRequest = true;
    },
    openPopUp(item) {
      if (item.status === "Pending") {
        this.$router.push({
          name: "view-assigned-template",
          params: {
            templateUUID: item.uuid,
            assetUUID: this.assetUUID,
            TemplateType: "View",
            flag: true,
          },
        });
      } else {
        this.$router.replace({
          name: "inspection-details",
          params: {
            inspectionUUID: item.uuid,
            inspectionChild: true,
            parentUUID: this.inspectionuuid,
            serviceRequestChild: false,
          },
        });
        window.location.reload();
      }
    },
    openParentInspection(uuid) {
      this.$router.replace({
        name: "inspection-details",
        params: {
          inspectionUUID: uuid,
          inspectionChild: false,
          parentUUID: this.inspectionuuid,
          serviceRequestChild: false,
        },
      });
      window.location.reload();
    },
    openParentServiceRequest(val) {
      this.$router.push({
        name: "service-requests-details",
        params: {
          serviceRequestUUID: val.uuid,
          serviceRequestChild: false,
          issueuuid: val.uuid,
          assetUUID: val.assetUUID,
          issuenumber: val.issueNumber,
          templateType: "viewIssue",
          flag: true,
          workOrderType: val.workOrderNumber,
        },
      });
    },
    close() {
      this.inspectionRequest = false;
    },

    getAllUsers() {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      AssetPersonnelService.getAllUsers(
        currentUserDetails.profile.organizationId
      )
        .then((response) => {
          stringOptionsAssignUsers = [];
          for (let index = 0; index < response.data.users.length; index++) {
            this.allUsers.push({
              label:
                response.data.users[index].firstName +
                " " +
                response.data.users[index].lastName,
              firstName: response.data.users[index].firstName,
              lastName: response.data.users[index].lastName,
              profileImage: response.data.users[index].imageUrl,
              uuid: response.data.users[index].uuid,
            });
            stringOptionsAssignUsers.push(response.data.users[index].name);
          }
          stringOptionsAssignUsers.sort();
          this.users = [];
          this.users = this.allUsers;
          this.assignUsers = stringOptionsAssignUsers;
          this.assignNoUsersGroup = this.assignUsers;
          //this.getInspectionTemplates();
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
        });
    },
    allItemsAccordionFunction() {
      if (
        this.$route.params.inspectionChild === "true" ||
        this.$route.params.serviceRequestChild === "true"
      ) {
        this.$refs.additionalInspectionsSourceAccordion.openFlag = false;
      }
    },
    additionalInspectionsAccordionFunction() {
      this.$refs.allItemsAccordion.openFlag = false;
      if (
        this.$route.params.inspectionChild === "true" ||
        this.$route.params.serviceRequestChild === "true"
      ) {
        this.$refs.additionalInspectionsSourceAccordion.openFlag = false;
      }
    },
    additionalInspectionsSourceAccordionFunction() {
      this.$refs.allItemsAccordion.openFlag = false;
    },
    getInspectionReport() {
      this.loaderFlag = true;
      InspectionService.getInspectionReportByUUID(
        this.$route.params.inspectionUUID
      )
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.data.inspectionReport
          ) {
            this.assetUUID = response.data.inspectionReport.assetUUID;
            this.inspectionReportItems = response.data.inspectionReport;

            /* Remove Element with 0 inspectionReportFields */
            let inspection_report = this.inspectionReportItems.inspectionReportCategories.filter(
              (element) => {
                if (element.inspectionReportFields.length > 0) {
                  return element;
                }
              }
            );
            this.inspectionReportItems.inspectionReportCategories = [];
            this.inspectionReportItems.inspectionReportCategories = inspection_report;
            /* Remove Element with 0 inspectionReportFields */

            this.imageVoices = response.data.imageVoicesHashmap;
            this.inspectionDetail = response.data.inspectionReport;
            this.parentInspection = response.data.parentInspection;
            document.title =
              this.inspectionDetail.inspectionNumber + " | " + "Erohal";
            let inspectionReport = response.data.inspectionReport;
            let locations = [];
            let totalFields = 0;
            let issueFields = 0;
            for (
              let categoryIndex = 0;
              categoryIndex <
              inspectionReport.inspectionReportCategories.length;
              categoryIndex++
            ) {
              for (
                let fieldIndex = 0;
                fieldIndex <
                inspectionReport.inspectionReportCategories[categoryIndex]
                  .inspectionReportFields.length;
                fieldIndex++
              ) {
                totalFields++;
                if (
                  inspectionReport.inspectionReportCategories[categoryIndex]
                    .inspectionReportFields[fieldIndex].lat != null &&
                  inspectionReport.inspectionReportCategories[categoryIndex]
                    .inspectionReportFields[fieldIndex].lng != null
                ) {
                  let location = {
                    lat:
                      inspectionReport.inspectionReportCategories[categoryIndex]
                        .inspectionReportFields[fieldIndex].lat,
                    lng:
                      inspectionReport.inspectionReportCategories[categoryIndex]
                        .inspectionReportFields[fieldIndex].lng,
                  };
                  locations.push(location);
                }
                if (
                  inspectionReport.inspectionReportCategories[categoryIndex]
                    .inspectionReportFields[fieldIndex].issueReporting != null
                ) {
                  issueFields++;
                }
              }
            }
            inspectionReport.createdAt = moment(
              inspectionReport.createdAt
            ).format("DD MMM YYYY hh:mm a");
            inspectionReport.locations = locations;
            inspectionReport.issueCount = issueFields + "/" + totalFields;
            inspectionReport.passFields = totalFields - issueFields;
            inspectionReport.totalFields = totalFields;
            (this.inspectionReport = response.data.inspectionReport),
              (this.inspectionItemslocations = locations);
            (this.isLoading = false),
              (this.passFieldPercentage =
                this.inspectionReport.passFields /
                this.inspectionReport.totalFields);
            this.templateName = inspectionReport.name;
            //this.getActivityWall();

            if (inspectionReport.assetUUID != null) {
              this.getAsset(inspectionReport.assetUUID);
            }
          }
          this.updateComp++;
        })
        .catch((error) => {
          this.loaderFlag = false;
          this.showToast("Failed to load Inspection Report!", "error");
        });
    },

    getAsset(uuid) {
      this.loading = true;
      AssetManagementService.getAssetNameAndNumberAndCategoryByAssetUUID(uuid)
        .then((response) => {
          this.asset = response.data.assetInfoDTO;
          this.assetIndex++;
          this.show = true;
          this.loaderFlag = false;
        })
        .catch((e) => {
          // console.log(e);
          this.loading = false;
          this.assetError = true;
          this.showToast("Failed to load asset information!.", "error");
        });
    },
    addTemplateItems() {
      this.selectedInspectionItems = [];
      let array = [];
      for (let index = 0; index < this.inspectionItemForm.length; index++) {
        if (this.inspectionItemForm[index].value === true) {
          let obj = {
            answers: this.inspectionItemForm[index].answers,
            askQuestion: this.inspectionItemForm[index].askQuestion,
            itemName: this.inspectionItemForm[index].itemName,
            mandatory: this.inspectionItemForm[index].mandatory,
            type: this.inspectionItemForm[index].type,
          };
          array.push(obj);
        }
        this.selectedInspectionItems = array;
        this.modelInspection = array;
        this.btnLabel = "CHANGE INSPECTION TEMPLATE";
      }
      this.inspectionTempDialog = false;
    },
    // getInspectionTemplates() {
    // 	let currentUserDetails = JSON.parse(
    // 		localStorage.getItem("currentUserDetails")
    // 	);
    // 	InspectionService.getPaginatedInspectionTemplatesForInspection(
    // 		0,
    // 		5,
    // 		currentUserDetails.profile.organizationId,
    // 		this.inspectionReportUUID
    // 	)
    // 		.then((response) => {
    // 			this.currentPage = 0;
    // 			this.numberOfPages =  response.data.inspectionTemplate.totalPages
    // 			response.data.inspectionTemplate.content.map((report) => {
    // 				report.createdAt = moment(report.createdAt).format(
    // 					"DD MMM YYYY hh:mm a"
    // 				);
    // 			});
    // 			this.dataPending = response.data.inspectionTemplate.content;

    // 			for (let index = 0; index < this.allUsers.length; index++) {
    // 				for (let j = 0; j < this.dataPending.length; j++) {
    // 					if (
    // 						this.allUsers[index].uuid ===
    // 						this.dataPending[j].createdForUserUUID
    // 					) {
    // 						this.dataPending[j].assignedTo = this.allUsers[index].label;
    // 					}
    // 				}
    // 			}
    // 		})
    // 		.catch((error) => {
    // 			console.log("Fetch Pending Inspections Error", error);
    // 			alert("An Error occurred while fetching Pending Inspections");
    // 		});
    // },
    // getAdditonalInspection(currentUserDetails) {
    // 	InspectionService.getPaginatedAdditonalInspections(
    // 		0,
    // 		50,
    // 		currentUserDetails.profile.organizationId,
    // 		this.inspectionReportUUID
    // 	)
    // 		.then((response) => {
    // 			response.data.inspectionReports.content.map((report) => {
    // 				report.createdAt = moment(report.createdAt).format(
    // 					"DD MMM YYYY hh:mm a"
    // 				);
    // 			});
    // 			this.submittedInpection = response.data.inspectionReports.content;
    // 		})
    // 		.catch((error) => {
    // 			console.log("Fetch Additional Inspections Error", error);
    // 			alert("An Error occurred while fetching Additional Inspections");

    // 		});
    // },
    pagination(value) {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      let obj = {
        limit: 5,
        offset: value,
        tenantUUID: currentUserDetails.profile.organizationId,
        parentInspectionUUID: this.inspectionReportUUID,
        newAdditional: true,
      };
      InspectionService.getInspectionTemplatesPendingandSubmitted(obj)
        .then((response) => {
          this.currentPage = value;
          this.numberOfPages = response.data.content.totalPages;
          response.data.content.additionalInspection.map((report) => {
            report.createdAt = moment(report.createdAt).format(
              "DD MMM YYYY hh:mm a"
            );
          });
          this.dataPending = response.data.content.additionalInspection;

          for (let index = 0; index < this.allUsers.length; index++) {
            for (let j = 0; j < this.dataPending.length; j++) {
              if (
                this.allUsers[index].uuid ===
                this.dataPending[j].createdForUserUUID
              ) {
                this.dataPending[j].assignedTo = this.allUsers[index].label;
              }
            }
          }
        })
        .catch((error) => {
          this.showToast(
            "An Error occurred while fetching Pending Inspections",
            "error"
          );
        });
    },
    submittedAndPendingInspection() {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      let obj = {
        limit: 5,
        offset: 0,
        tenantUUID: currentUserDetails.profile.organizationId,
        parentInspectionUUID: this.inspectionReportUUID,
        newAdditional: true,
      };
      InspectionService.getInspectionTemplatesPendingandSubmitted(obj)
        .then((res) => {
          res.data.content.additionalInspection.map((report) => {
            report.createdAt = moment(report.createdAt).format(
              "DD MMM YYYY hh:mm a"
            );
          });
          this.dataPending = res.data.content.additionalInspection;
          this.numberOfPages = res.data.content.totalPages;
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
        });
    },
    setSidebarPosition() {
      let sB = document.getElementById("position-sidebar-container");
      let sidebar = document.getElementById("position-sidebar");
      sB.style.width = sidebar.offsetWidth + "px";
      sB.style.position = "fixed";
      sB.style.top = sidebar.offsetLeft;
      sB.style.left = sidebar.offsetLeft;
    },
    getAllAsset(currentUserDetails) {
      AssetManagementService.getAllAssets(
        currentUserDetails.profile.organizationId
      ).then((res) => {
        for (let index = 0; index < res.data.assets.length; index++) {
          let obj = {
            uuid: res.data.assets[index].uuid,
            categoryUUID: res.data.assets[index].categoryUUID,
            label: res.data.assets[index].name,
            type: res.data.assets[index].type,
          };
          this.allAssetData.push(obj);
        }
      });
    },
    getAllCategories(currentUserDetails) {
      AssetManagementService.getAllAssetCategories(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          for (let index = 0; index < res.data.categories.length; index++) {
            let obj = {
              id: res.data.categories[index].id,
              categoryUUID: res.data.categories[index].uuid,
              label: res.data.categories[index].name,
            };
            this.assetCategoryOptions.push(obj);
          }
          this.getAllAsset(currentUserDetails);
        })
        .catch((err) => {
          this.showToast(err.data.response, "error");
        });
    },
    getParentInspectionReport() {
      InspectionService.getInspectionReportByUUID(this.$route.params.parentUUID)
        .then((response) => {
          if (
            response &&
            response.status === 200 &&
            response.data.inspectionReport
          ) {
            this.parentInspectionDetail = response.data.inspectionReport;
            let inspectionReport = response.data.inspectionReport;
            this.ParentUUID = inspectionReport.uuid;
            inspectionReport.createdAt = moment(
              inspectionReport.createdAt
            ).format("DD MMM YYYY hh:mm a");
          }
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
        });
    },
    getParentServiceRequestByUUID() {
      InspectionService.getServiceRequestByUUID(this.$route.params.parentUUID)
        .then((response) => {
          if (response.status === 200) {
            this.serviceReuqestDetail = response.data.serviceRequest;
            this.serviceReuqestDetail.reportedAt = moment(
              this.serviceReuqestDetail.reportedAt
            ).format("DD MMM YYYY hh:mm a");
            if (this.serviceReuqestDetail.resolvedAt !== null) {
              this.serviceReuqestDetail.resolvedAt = moment(
                this.serviceReuqestDetail.resolvedAt
              ).format("DD MMM YYYY hh:mm a");
            }
          }
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
        });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },

    refreshInspectionReport() {
      this.getInspectionReport();
    },

    setLoading(value) {
      this.loaderFlag = value;
    },
  },

  updated() {
    this.setSidebarPosition();
  },

  mounted() {
    this.setSidebarPosition();
  },

  created() {
    this.inspectionuuid = this.$route.params.inspectionUUID;
    this.inspectionReportUUID = this.$route.params.inspectionUUID;

    let currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    if (currentUserDetails === null) {
      localStorage.setItem("forceSignout", "yes");
      return;
    }
    this.loaderFlag = true;
    this.getAllUsers();
    this.getInspectionReport();
    this.getAllCategories(currentUserDetails);
    this.submittedAndPendingInspection();
    if (this.$route.params.inspectionChild) {
      this.getParentInspectionReport();
    }
    if (this.$route.params.serviceRequestChild) {
      this.getParentServiceRequestByUUID();
    }
  },
  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.btn-class {
  display: grid;
  grid-column: 1fr 1fr 1fr;
  width: 250px;
  float: right;
  margin-right: 32px;
}
.page-container {
  // display: flex;
  font-family: Euclid Circular B;
  color: #000;
  background-color: rgba(255, 255, 255, 0.5);
  margin-bottom: 32px;
}
.flex-container {
  position: relative;
  margin-top: 40px;
  display: flex;

  .data-sec {
    flex: 8;
    display: flex;
    flex-direction: column;
  }

  .empty-sec {
    flex: 1;
  }

  .info-sec {
    flex: 3;
    position: relative;
  }
}
.table-grid {
  display: grid;
  padding-left: 32px;
  padding-right: 32px;
}
table {
  margin-top: 16px;
  margin-bottom: 16px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  white-space: nowrap;
  cursor: default;
  box-shadow: 0 0 10px #e1e1e1;
  th {
    width: 14%;
    font-weight: bold;
    background: var(--greyish-brown);
    color: rgb(0, 0, 0);
    padding: 16px;
    text-align: start;
  }

  td {
    padding: 16px;
    text-align: start;
  }

  tr:not(:first-child):hover {
    opacity: 1;
    background-color: #e1e1e1;
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
.table-heading {
  font-size: 20px;
  font-weight: 700;
  padding-left: 16px;
}
</style>
