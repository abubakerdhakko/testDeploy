<template>
  <div class="pt-32 pb-80">
    <div class="head-title">
      {{ serviceRequest.issueName }} - {{ serviceRequest.issueNumber }}
    </div>
    <div class="subtitle pt-8">
      View all the information related to a service request
    </div>
    <div class="main-page pt-32">
      <div class="column-grid-2"></div>
      <div></div>
      <div class="right-column">
        <div class="column-grid-1">
          <SSelect
            label="Actions"
            v-model="model"
            :source="source"
            resultsValue="value"
            resultsDisplay="name"
            :autocomplete="false"
            @selected="onSelected"
          />
        </div>
      </div>
    </div>

    <div class="main-page pt-32">
      <div>
        <div>
          <ServiceRequestSummary
            :serviceRequestObj="serviceRequestObj"
            ref="mychild"
            :disableFields="disableFields"
            :key="indexValue"
          />
        </div>

        <SAccordion
          v-if="
            serviceRequestObj !== {} &&
              serviceRequestObj.serviceRequestIssueNumber !== null &&
              serviceRequestObj.serviceRequestIssueNumber !== ''
          "
          :title="'Issues'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="IssuesAccordion"
          class="mt-32"
          @state="issuesInformationAccordionFunction"
        >
          <Issue :issueUUID="issueUUID" :currency="currency" />
        </SAccordion>

        <SAccordion
          :title="'Additional Inspection'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="assetInformationAccordion"
          class="mt-32"
          @state="assetInformationAccordionFunction"
        >
          <div class="table-grid">
            <div class="btn-class pt-16 mb-8">
              <SButton
                :dropdown="false"
                rounded
                dense
                :title="'Request Additional Inspection'"
                @clicked-item="requestAdditional"
              ></SButton>
            </div>

            <div v-if="this.parentServiceRequestUUID == null">
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
                  <td>{{ item.createdAt | dateTime }}</td>
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

              <div v-if="parentServiceRequestUUID !== null">
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
          </div>
        </SAccordion>
        <SAccordion
          :title="'Attachments'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="AttachmentsAccordion"
          @state="AttachmentsAccordionFunction"
          class="mt-32"
        >
          <div
            v-padding="'0px 32px 0px 32px'"
            style="
              font-weight: bold;
              font-size: 14px;
              margin-top: 16px;
              margin-bottom: 16px;
            "
          >
            Gallery
          </div>
          <div style="padding: 24px 30px; display: flex; gap: 2%">
            <div
              style="display: flex"
              v-for="(image, index) in attachments"
              :key="index + '_image'"
            >
              <img
                v-if="image.imageFlag === true && image.content  !== null"
                :src="'data:image/png;base64,' + image.content"
                style="width: 100px; height: 100px"
                @click="fullscreenImage(image)"
                alt=""
              />
              <img
                src="/assets/icons/Delete.svg"
                alt=""
                width="20px"
                style="cursor: pointer; margin-left: 10px; margin-bottom: 80px"
                @click="deleteAssetImage(image.uuid)"
                v-if="$route.name == 'service-requests-edit'"
                class="del_Icon"
              />
              <SDialog
                title=""
                :width="700"
                :persistent="false"
                :closeIcon="true"
                @close="close"
                v-show="imageDialog"
              >
                <img
                  v-if="popupImage.imageFlag === true"
                  :src="'data:image/png;base64,' + popupImage.content"
                  style="width: 100%; height: auto"
                  alt=""
                />
              </SDialog>
            </div>
          </div>
          <div style="padding: 24px 30px;">
            <div
              v-padding="'16px 32px 16px 0'"
              class="filePickerRow"
              v-if="$route.name == 'service-requests-edit'"
            >
              <SFilePicker v-on:input="receiveDocument" v-model="fileRecord" />
            </div>
          </div>
        </SAccordion>
      </div>

      <div></div>
      <div class="right-column">
        <Sidebar
          :serviceRequestObj="serviceRequestObj"
          @create="updateServiceRequest"
        />
      </div>

      <div class="dialog">
        <ignoreRequest
          v-if="IgnoreIssueValue"
          :modelInstruction="modelInstruction"
          @close="closeIgnoreIssue"
          @ignoreRequest="ignoreRequest"
        />
        <CreateIssue
          v-if="submitNewIssue"
          @close="closeNewIssue"
          :serviceRequestDetail="serviceRequestObj"
          @toastFlag="displayMessage"
        />
      </div>
    </div>
    <RequestInspection
      v-if="inspectionRequest"
      @createInspection="createAdditonalInspection"
      :asset="asset"
      :tempName="templateName"
      @selectedTemplates="selectedTemplates"
      :serviceRequestUUID="serviceRequestUUID"
      @close="closeAdditional"
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
import { AssetManagementService } from "../../services/AssetManagementService";
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import InspectionService from "../../services/InspectionService";

import Sidebar from "../service-requests/components/Sidebar";
import ServiceRequestSummary from "../service-requests/components/ServiceRequestSummary";
import RequestInspection from "../../views/inspection/components/RequestInspection.vue";
import Issue from "./components/Issue.vue";
import IgnoreRequest from "../../components/IgnoreRequest";
import CreateIssue from "../../components/CreateIssue";
import moment from "moment";

import loader from "@/components/Loader.vue";

export default {
  name: "name",
  components: {
    Sidebar,
    IgnoreRequest,
    CreateIssue,
    ServiceRequestSummary,
    RequestInspection,
    Issue,
    loader,
  },

  data() {
    return {
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      currency: "AED",
      indexValue: 0,
      popupImage: "",
      disableFields: "",
      imageDialog: false,
      inspectionRequest: false,
      asset: {},
      fileRecord: null,
      attachments: [],
      currentPage: 1,
      numberOfPages: "",
      dataPending: [],
      assetUUID: "",
      issueUUID: "",
      additionalInspection: [],
      currentUserDetails: "",
      submitNewIssue: false,
      IgnoreIssueValue: false,
      modelInstruction: "Ignore Service Request",
      serviceRequestObj: {},
      issueOptions: [],
      srIssues: [],
      parentServiceRequestUUID: "",
      serviceRequest: {},
      submittedInpection: "",
      model: "",
      type: "Ad-hoc",
      templateName: "",
      SelectedItems: {},
      fileUpload: [],
      source: [
        {
          name: "Create Issue",
          value: "Create Issue",
        },
        {
          name: "Ignore Request",
          value: "Ignore Request",
        },
      ],
      info: {
        assetName: "glass",
        modelNumber: "231as3",
        manufacturer: "Some Company",
      },
      assetId: "",
    };
  },

  methods: {
    displayMessage() {
      this.loaderFlag = true;
      this.getServiceRequestByUUID();
      this.showToast("Issue Created Successfully.", "success");
    },
    createAdditonalInspection(value) {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      if (value.assignedTo === "Users") {
        this.$v.assignedUser.$touch();
        if (this.$v.assignedUser.$error) {
          this.showToast("Please Select Users.", "error");
          return;
        }
      }
      if (value.selectedTemplate === "") {
        this.showToast("Please Select Template.", "error");
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
      inspectionTemplate.serviceRequestUUID = value.serviceRequestUUID;
      inspectionTemplate.parentInspectionUUID = null;
      inspectionTemplate.companyUUID =
        currentUserDetails.profile.organizationId;
      inspectionTemplate.assetCategoryUUID = this.asset.categoryUUID;
      inspectionTemplate.assetUUID = this.asset.uuid;
      inspectionTemplate.frequencyType = "ad-hoc";
      inspectionTemplate.createdByUserUUID = currentUserDetails.profile.userid;
      inspectionTemplate.createdByUserName = `${currentUserDetails.profile.firstName} 
        ${currentUserDetails.profile.lastName}`;

      let reminderarray = [];
      for (let reminder of value.reminderArray) {
        let obj = {
          reminder: reminder.reminder,
          durationValue: reminder.durationValue,
          durationType: reminder.durationType,
        };
        reminderarray.push(obj);
        inspectionTemplate.reminder = JSON.stringify(reminderarray);
      }

      for (let template of value.selectedTemplate) {
        let inspectionItemCategory = {};
        let inspectionItems = [];
        inspectionItemCategory.name = template.itemName.value;
        let answers = template.answers.value;
        let answer = [];
        for (let ans of answers) {
          answer.push(ans.value);
        }
        let obj = {
          name: template.itemName.value,
          type: template.type.value,
          mandatory: template.mandatory.value,
          description: "",
        };
        obj.answers = answer;
        inspectionItemCategories.push(inspectionItemCategory);
        inspectionItems.push(obj);
        inspectionItemCategory.inspectionItems = inspectionItems;
      }
      inspectionTemplate.inspectionItemCategories = inspectionItemCategories;
      addInspectionTemplateRequest.inspectionTemplate = inspectionTemplate;
      InspectionService.addInspectionTemplateOfInspectionRequest(
        addInspectionTemplateRequest
      )
        .then((response) => {
          if (response.status === 200) {
            this.showToast(
              "Additional Schedule Created Successfully.",
              "success"
            );
            this.inspectionRequest = false;
            this.submittedAndPendingInspection();
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.showToast("Request Error.", "error");
          } else {
            this.showToast(error.response.data, "error");
          }
        });
    },

    checkValidation(){
      
    },
    updateServiceRequest() {

      this.$refs.mychild.$v.$touch()
      this.loaderFlag = true;
      if (this.fileRecord !== null) {
        let UpdateServiceRequestRequest = {
          uuid: this.serviceRequestObj.uuid,
          name: this.serviceRequestObj.issueName,
          assetUUID: this.serviceRequestObj.assetUUID,
          priority: this.serviceRequestObj.priority,
          status: this.serviceRequestObj.status,
          comments: this.serviceRequestObj.issueDescription,
          ignoreComments: this.serviceRequestObj.ignoreComments,
        };

        UpdateServiceRequestRequest.imageVoices = this.fileUpload;

        InspectionService.updateServiceRequest(UpdateServiceRequestRequest)
          .then((res) => {
            if (res.data.responseCode == "F200") {
              this.$router.push({
                name: "service-requests",
                params: {
                  toastFlag: true,
                  toastSuccess: "success",
                  message: "Service Request Updated Successfully.",
                },
              });
              this.loaderFlag = false;
            }
          })
          .catch((e) => {
            this.showToast(e.response.data, "error");
            this.loaderFlag = false;
          });
      } else {
        this.loaderFlag = true;
        let UpdateServiceRequestRequest = {
          uuid: this.serviceRequestObj.uuid,
          name: this.serviceRequestObj.issueName,
          assetUUID: this.serviceRequestObj.assetUUID,
          priority: this.serviceRequestObj.priority,
          status: this.serviceRequestObj.status,
          comments: this.serviceRequestObj.issueDescription,
          ignoreComments: this.serviceRequestObj.ignoreComments,
        };

        InspectionService.updateServiceRequest(UpdateServiceRequestRequest)
          .then((res) => {
            if (res.data.responseCode == "F200") {
              this.loaderFlag = false;
              this.$router.push({
                name: "service-requests",
                params: {
                  toastFlag: true,
                  toastSuccess: "success",
                  message: "Service Request Updated Successfully.",
                },
              });
            }
          }
          )
          .catch((e) => {
            this.showToast(e.response.data, "error");
            this.loaderFlag = false;
          });
      }
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
        this.$router.push({
          name: "inspection-details",
          params: {
            inspectionUUID: item.uuid,
            inspectionChild: false,
            parentUUID: this.inspectionReportUUID,
            serviceRequestChild: true,
          },
        });
      }
    },
    openIssuePopUp(uuid) {
      this.$router.push({
        name: "issue-detail",
        params: {
          issueID: uuid,
        },
      });
    },
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
        serviceRequest: true,
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

          for (let user of this.allUsers) {
            for (let data of this.dataPending) {
              if (user.uuid === data.createdForUserUUID) {
                data.assignedTo = user.label;
              }
            }
          }
        })
        .catch((error) => {
          this.showToast(
            "An Error occurred while fetching Pending Inspections.",
            "error"
          );
        });
    },
    closeAdditional() {
      this.inspectionRequest = false;
    },
    requestAdditional() {
      this.inspectionRequest = true;
    },
    selectedTemplates(value) {
      this.SelectedItems = value;
    },
    fullscreenImage(value) {
      this.popupImage = value;
      this.imageDialog = true;
    },
    getAsset(uuid) {
      this.loading = true;
      AssetManagementService.getAssetNameAndNumberAndCategoryByAssetUUID(uuid)
        .then((response) => {
          this.asset = response.data.assetInfoDTO;
          this.assetIndex++;
          this.show = true;
        })
        .catch((e) => {
          this.loading = false;
          this.assetError = true;
          this.showToast("Failed to load asset information!", "error");
        });
    },
    receiveDocument(file) {
      this.loaderFlag = true;
      AssetManagementService.uploadFileTos3(this.fileRecord)
        .then((res) => {
          if (res.data.responseIdentifier === "Success") {
            let imageVoice = {
              contentUrl: res.data.fileUrl,
            };
            this.fileUpload = [];
            this.fileUpload.push(imageVoice);
            this.showToast("Image added successfully!", "success");
            this.loaderFlag = false;
          }
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
          this.loaderFlag = false;
        });
    },
    assetInformationAccordionFunction() {
      if (this.$refs.assetInformationAccordion.openFlag === true) {
        this.$refs.AttachmentsAccordion.openFlag = false;
        if (this.$refs.IssuesAccordion) {
          this.$refs.IssuesAccordion.openFlag = false;
        }
      }
    },
    CommentsAccordionFunction() {
      if (this.$refs.CommentsAccordion.openFlag === true) {
        this.$refs.AttachmentsAccordion.openFlag = false;
        this.$refs.assetInformationAccordion.openFlag = false;
      }
    },
    AttachmentsAccordionFunction() {
      if (this.$refs.AttachmentsAccordion.openFlag === true) {
        this.$refs.assetInformationAccordion.openFlag = false;
        if (this.$refs.IssuesAccordion) {
          this.$refs.IssuesAccordion.openFlag = false;
        }
      }
    },
    issuesInformationAccordionFunction() {
      if (this.$refs.IssuesAccordion.openFlag === true) {
        this.$refs.assetInformationAccordion.openFlag = false;
        this.$refs.AttachmentsAccordion.openFlag = false;
      }
    },

    close() {
      this.imageDialog = false;
    },
    closeNewIssue() {
      this.submitNewIssue = false;
    },
    closeIgnoreIssue() {
      this.IgnoreIssueValue = false;
    },
    ignoreIssue() {
      this.IgnoreIssueValue = true;
    },
    ignoreRequest(value) {
      let ignoreCommentsField = value;
      if (!ignoreCommentsField.value) {
        ignoreCommentsField.valid = false;
        ignoreCommentsField.validMessage = "Required!";
        this.ignoreCommentsField = ignoreCommentsField;
        return;
      }
      this.loaderFlag = true;
      let updateIssueRequest = {};
      let serviceRequest = this.serviceRequest;
      serviceRequest.status = "ignored";
      serviceRequest.ignoredBy =
        this.currentUserDetails.profile.firstName +
        " " +
        this.currentUserDetails.profile.lastName;
      serviceRequest.reportedAt = new moment(
        serviceRequest.reportedAt
      ).toISOString();
      serviceRequest.ignoreComments = ignoreCommentsField.value;
      updateIssueRequest.issueReporting = serviceRequest;
      this.closeIgnoreIssue();
      InspectionService.updateIssue(updateIssueRequest)
        .then((response) => {
          try {
            if (response.status === 200) {
              this.loaderFlag = false;
              this.serviceRequest.status = "ignored";
              this.showToast(
                "Service request ignored successfully!",
                "success"
              );
              // zzzz
              this.$router.push({name: 'service-requests'})
            } else {
              this.showToast(
                "Error while ignoring service request. Please try again!",
                "error"
              );
            }
          } catch (e) {
            this.showToast(e.data.response, "error");
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          if (error.response.status === 406) {
            this.showToast("An unexpected Error Occurred.", "error");
          } else {
            this.showToast(error.data.response, "error");
          }
        })
        .finally(() => {
          this.serviceRequest = serviceRequest;
        });
    },
    getServiceRequestByUUID() {
      InspectionService.getServiceRequestByUUID(this.issueUUID)
        .then((response) => {
          if (response.status === 200) {

            this.attachments = response.data.attachments;
            let serviceRequest = response.data.serviceRequest;
            document.title = serviceRequest.issueNumber + " | " + "Erohal";
            this.userComments = serviceRequest.issueDescription;
            this.repairInstruction = serviceRequest.description;
            this.issueName = serviceRequest.issueName;
            this.issueType = serviceRequest.issueType;
            this.issueCategory = serviceRequest.issueCategory;
            this.serviceRequestUUID = serviceRequest.uuid;
            this.templateName = serviceRequest.issueName;
            this.parentServiceRequestUUID =
              serviceRequest.parentServiceRequestUUID;
            let useruuids = [];
            let assetuuids = [];
            this.getIssuesByAssets(serviceRequest.assetUUID);
            assetuuids.push(serviceRequest.assetUUID);
            this.assetId = serviceRequest.assetUUID;
            this.submittedAndPendingInspection();
            this.getAsset(serviceRequest.assetUUID);
            useruuids.push(serviceRequest.submittedByUserUUID);
            let attachments = [];
            let comments = "";
            let attachmentsResponse = response.data.attachments;
            if (attachmentsResponse && attachmentsResponse.length > 0) {
              for (let attachment of attachmentsResponse) {
                if (attachment.messageFlag) {
                  if (comments.length > 0) {
                    comments = `${comments} ${attachment.message}`;
                  } else {
                    comments = attachment.message;
                  }
                } else {
                  attachment.loading = true;
                  if (attachment.contentUrl !== null){
                  attachments.push(attachment);
                  }
                }
              }
            }
            if (!comments) {
              //request may not be created in mobile app, use description
              comments = serviceRequest.issueDescription;
            }
            serviceRequest.reportedDate = serviceRequest.reportedAt;
            serviceRequest.reportedAt = moment(
              serviceRequest.reportedAt
            ).format("DD MMM YYYY hh:mm a");
            if (serviceRequest.resolvedAt !== null) {
              serviceRequest.resolvedAt = moment(
                serviceRequest.resolvedAt
              ).format("DD MMM YYYY hh:mm a");
            }
            if (serviceRequest.priority === null) {
              serviceRequest.priority = "Not Assigned";
            }

            this.comments = comments;
            //get basic info of assets from asset management service like name and category name of asset
            AssetManagementService.getNameAndTypeOfAssetsByUUIDS({
              uuids: assetuuids,
            })
              .then((response1) => {
                if (response1.status === 200) {
                  serviceRequest.assetName =
                    response1.data.assets[serviceRequest.assetUUID].name;
                  serviceRequest.assetCategory =
                    response1.data.assets[serviceRequest.assetUUID].type;
                  serviceRequest.assetNumber =
                    response1.data.assets[serviceRequest.assetUUID].assetNumber;

                  AssetPersonnelService.getNameOfUsersByUUIDS({
                    uuids: useruuids,
                  })
                    .then((response2) => {
                      if (response2.status === 200) {
                        serviceRequest.reportedBy =
                          response2.data.users[
                            serviceRequest.submittedByUserUUID
                          ].name;

                        this.serviceRequest = serviceRequest;
                        this.serviceRequestObj = serviceRequest;
                        this.loaderFlag = false;
                        this.indexValue++;
                      } else {
                        this.showToast(
                          "Error in getting asset basic detail. Please try again",
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      this.showToast(error.data.response, "error");
                    });
                } else {
                  this.showToast(
                    "Error in getting asset basic detail. Please try again",
                    "error"
                  );
                }
              })
              // eslint-disable-next-line handle-callback-err
              .catch((error) => {
                this.showToast(error.data.response, "error");
              });
            //get attachment content
            for (let attachment_item of attachments) {
              InspectionService.getFile(attachment_item.contentUrl).then(
                (response5) => {
                  if (response5.data.responseIdentifier === "Success") {
                    attachment_item.loading = false;
                    attachment_item.content = response5.data.content;
                    this.allexecute = true;
                    this.attachments = attachments;
                  }
                }
              );
            }
          } else {
            this.showToast("An Error occurred", "error");
          }
        })
        .catch((error) => {
          this.showToast(error.data.response, "error");
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
        serviceRequest: true,
      };
      InspectionService.getInspectionTemplatesPendingandSubmitted(obj)
        .then((res) => {
          this.dataPending = res.data.content.additionalInspection;
          this.numberOfPages = res.data.content.totalPages;
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
        });
    },
    getInspectionReportsForServiceRequest() {
      InspectionService.getPaginatedInspectionReportsForServiceRequest(
        0,
        50,
        this.currentUserDetails.profile.organizationId,
        this.serviceRequestUUID
      )
        .then((response) => {
          response.data.inspectionReports.content.map((report) => {
            report.createdAt = moment(report.createdAt).format(
              "DD MMM,YYYY hh:mm a"
            );
          });
          this.additionalInspection = response.data.inspectionReports.content;
        })
        .catch((error) => {
          this.showToast("Fetch Additional Inspections Error", "error");
        });
    },
    ViewInspection() {},
    onSelected(value) {
      if (value.display === "Create Issue") {
        if (
          this.serviceRequest.status === "new" ||
          this.serviceRequest.status === "New"
        ) {
          this.submitNewIssue = true;
        } else {
          this.showToast(
            "You can only create issue with new service request.",
            "error"
          );
        }
      } else if (value.display === "Ignore Request") {
        if (this.serviceRequest.status === "new") {
          this.IgnoreIssueValue = true;
        } else {
          this.showToast("You can only ignore new service request.", "error");
        }
      }
    },
    deleteAssetImage(uuid) {
      this.loaderFlag = true;
      InspectionService.deleteIssueImage(uuid)
        .then((res) => {
          if (res.status === 200) {
            this.loaderFlag = false;
            this.showToast("Image Deleted Successfully", "success");
            this.getServiceRequestByUUID();
          } else {
            this.showToast(res.data.description, "error");
          }
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
          this.loaderFlag = true;
        });
    },
    getIssuesByAssets(assetUUID) {
      InspectionService.filterIssuesByAssetUUID(assetUUID)
        .then((response) => {
          if (response.status === 200) {
            this.issues = response.data.issues;
            for (let issue of response.data.issues) {
              this.issueOptions.push({
                name: issue.issueName + ", " + issue.issueNumber,
                value: issue.uuid,
              });
            }
          }
        })
        .catch((error) => {});
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  created() {

    document.title = this.$route.meta.title;
    this.inspectionReportUUID = this.$route.params.serviceRequestUUID;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.disableFields = this.$route.params.flag;
    if (this.$route.params.assetUUID !== undefined) {
      localStorage.setItem("assetUUID", this.$route.params.assetUUID);
    }
    if (this.$route.params.assetUUID !== undefined) {
      localStorage.setItem("issueUUID", this.$route.params.issueuuid);
    }
    this.assetUUID = localStorage.getItem("assetUUID");
    this.issueUUID = localStorage.getItem("issueUUID");
    this.loaderFlag = true;

    this.getServiceRequestByUUID();
  },

  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.right-column {
  .card {
    border: 1px solid var(--very-light-pink);
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
}
.table-grid {
  display: grid;
  padding-left: 32px;
  padding-right: 32px;
}
.btn-class {
  display: grid;
  grid-column: 1fr 1fr 1fr;
  width: 250px;
  float: right;
  margin-right: 32px;
}
.filePickerRow {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}
table {
  margin-top: 16px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  white-space: nowrap;
  cursor: default;

  th {
    width: 14%;
    font-weight: bold;
    background: var(--secondary);
    color: #fff;
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
</style>
