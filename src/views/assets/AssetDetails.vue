<template>
  <div class="page-container pt-32 pb-80">
    <span class="head-title"
      >{{ assetDetail.name }} - {{ assetDetail.assetNumber }}</span
    ><br />
    <span class="subtitle"
      >View all the information related to an asset here</span
    >
    <!-- <div class="upload-csv"  style="padding-left: 40em;" >
			<span
				@click="exportCsv"
				style="cursor: pointer; font-size: 17px; color: #4285f4"
			>
				Export CSV
			</span>
		</div> -->
    <div class="flex-container">
      <div class="data-sec">
        <div class="AssetSummary">
          <AssetSummary
            v-if="assetDetail !== null"
            :assetDetail="assetDetail"
            :disableFields="disableFields"
            :currency="currency"
            :key="keyIndex"
          />
        </div>

        <SAccordion
          :title="'Assignment'"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'48'"
          v-margin-top="32"
          ref="assignmentAccordion"
          @state="assignmentAccordionFunction"
        >
          <Assignment
            :assignmentHistoryUsers="assignmentHistoryUsers"
            :allUsers="Users"
            @unassigned="unAssignAsset"
            @editAssigned="editAssigned"
            @openPopUp="openPopUp"
            :assignedUsers="assignedUsers"
            @showToast="showToast"
          />
          <AssignUserPopUp
            @close="close"
            v-show="ShowPopUp"
            @AssignUser="assignUser"
            @updateAssignUser="updateAssignUser"
            :Users="Users"
            @onSelected="onSelected"
            :assignedUsers="valueEditAssign"
            :key="index + 'assign'"
          />
          <UnAssignUserPopUp
            @close="close"
            v-show="ShowUnPopUp"
            :assignedUsers="valueEditAssign"
            @UnAssignUser="unAssignUser"
            :key="index"
          />
        </SAccordion>

        <SAccordion
          :title="'Issues'"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'48'"
          v-margin-top="32"
          ref="issuesAccordion"
          @state="issuesAccordionFunction"
        >
          <Issues
            :assetData="assetDetail"
            :issues="issues"
            @toastFlag="displayMessage"
          />
        </SAccordion>

        <SAccordion
          :title="'Work Orders'"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'48'"
          v-margin-top="32"
          ref="workOrdersAccordion"
          @state="workOrdersAccordionFunction"
        >
          <WorkOrders :workOrders="WorkOrderList" :assetData="assets" />
        </SAccordion>

        <SAccordion
          :title="'Additional Details'"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'48'"
          v-margin-top="32"
          ref="categoryFieldsAccordion"
          @state="categoryFieldsAccordionFunction"
        >
          <CategoriesFields
            :assetFields="this.assetFields"
            :fields="this.fields"
          />
        </SAccordion>

        <SAccordion
          :title="'Consumptions'"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'48'"
          v-margin-top="32"
          ref="consumptionsAccordion"
          @state="consumptionsAccordionFunction"
        >
          <Consumptions :assetData="assetDetail" :consumptions="consumptions" />
        </SAccordion>

        <SAccordion
          :title="'Usages'"
          :expandIcon="'arrows'"
          :open="false"
          :border="false"
          :padding="'48'"
          v-margin-top="32"
          ref="usagesAccordion"
          @state="usagesAccordionFunction"
        >
          <Usages :assetData="assetDetail" :usages="usages" />
        </SAccordion>
        <SAccordion
          :title="'Attachments'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'48'"
          ref="attachmentAccordion"
          @state="attachmentAccordionFunction"
          class="mt-32"
        >
          <div
            v-for="(image, index) in this.imageVoices"
            :key="index + '_image'"
            v-padding="'20px 32px 20px 32px'"
            style="float: left"
          >
            <img
              class="images"
              v-if="image.imageFlag === true"
              :src="'data:image/png;base64,' + image.content"
              style="width: 100px; height: 100px"
              @click="fullscreenImage(image)"
            />
            <img
              src="/assets/icons/Delete.svg"
              alt=""
              width="20px"
              style="cursor: pointer; margin-left: 10px; margin-bottom: 80px"
              @click="deleteAssetImage(image.id)"
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
                class="images-row"
                v-if="popupImage.imageFlag === true"
                :src="'data:image/png;base64,' + popupImage.content"
                style="width: 100%; height: auto"
              />
            </SDialog>
          </div>

          <div
            class="attachments"
            v-for="(item, index) in attachments"
            :key="index + 'attach'"
          >
            <div class="fileName">
              <span @click="downloadFile(item.contentUrl, index)">{{
                item.fileName.split("-").pop()
              }}</span>
              <img
                src="/assets/icons/Delete.svg"
                alt=""
                width="20px"
                style="padding-left: 12px; position: absolute"
                @click="deleteAssetAttachment(item.id)"
              />
            </div>
          </div>
        </SAccordion>
      </div>
      <div class="empty-sec"></div>
      <div class="info-sec">
        <Sidebar
          style="position: fixed"
          :assetObj="assetDetail"
          :currency="currency"
        />
      </div>

      <!-- Loader Component -->
      <loader v-if="loaderFlag" />
      <!-- Loader Component -->

      <SToast
        :message="toastMessage"
        :time-out="3000"
        :type="toastType"
        :key="toastFlag"
      />
      <DeleteDialog
        v-if="deleteDialogAttachment"
        @close="close"
        @deleteData="deleteAttachmentFun"
        @canceled="close"
      ></DeleteDialog>
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar";
import AssetManagementService from "./../../services/AssetManagementService";
import WorkOrderService from "./../../services/WorkOrderService";
import InspectionService from "./../../services/InspectionService";
import AssetPersonnelService from "./../../services/AssetPersonnelService";
import AssignUserPopUp from "./components/AssignUserPopUp";
import UnAssignUserPopUp from "./components/UnAssignUserPopUp";
import CategoriesFields from "./components/CategoriesFields";
import moment from "moment";
import Assignment from "./components/Assignment";
import WorkOrders from "./components/WorkOrders";
import Issues from "./components/Issues";
import Consumptions from "./components/Consumptions";
import Usages from "./components/Usages";
import AssetSummary from "./components/AssetSummary";
import DeleteDialog from "../../components/DeleteDialog";

import loader from "@/components/Loader.vue"
export default {
  name: "AssetDetails",
  components: {
    Sidebar,
    Assignment,
    WorkOrders,
    Issues,
    Consumptions,
    Usages,
    AssignUserPopUp,
    CategoriesFields,
    AssetSummary,
    UnAssignUserPopUp,
    DeleteDialog,
    loader
  },
  data() {
    return {
      deleteDialogAttachment: false,
      deleteDialog: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      WorkOrderList: {},
      loaderFlag: false,
      index: 0,
      keyIndex: 0,
      popupImage: "",
      imageVoices: [],
      imageDialog: false,
      assetUuid: "",
      page: 0,
      rowsPerPage: 5,
      assetDetail: {},
      fields: [],
      assetFields: [],
      assetImages: [],
      attachments: [],
      assets: [],
      consumptions: {},
      issues: {},
      usages: {},
      Users: [],
      allUsers: [],
      ShowPopUp: false,
      ShowUnPopUp: false,
      assignedUsers: [],
      assignmentHistoryUsers: [],
      disableFields: true,
      valueEditAssign: {},
      cost: "",
      assignTableValue: "",
      imageVoicesCheck: [],
      currency: "",
      issueTable: 0,
      attachmentID: "",
    };
  },
  props: {},
  methods: {
    downloadFile(fileUrl, index) {
      this.loaderFlag = true;
      AssetManagementService.getFile(fileUrl)
        .then((res) => {
          if (res.data.responseIdentifier === "Success") {
            this.downloadPDF(res.data, index);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    closeDialog() {
      this.deleteDialogAttachment = false;
    },
    downloadPDF(pdf, index) {
      const linkSource = `data:application/pdf;base64,${pdf.content}`;
      const downloadLink = document.createElement("a");
      let fileName = null;
      for (let index2 = 0; index2 < this.attachments.length; index2++) {
        fileName = this.attachments[index].fileName.split("-").pop();
      }
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      this.loaderFlag = false;
    },
    displayMessage() {
      this.showToast("Issue Created Succussfully.", "success");
    },
    deleteAssetAttachment(id) {
      this.attachmentID = id;
      this.deleteDialogAttachment = true;
    },
    deleteAttachmentFun() {
      AssetManagementService.deleteAssetAttachment(this.attachmentID)
        .then((res) => {
          if (res.data.responseCode === "200") {
            this.close();
            this.AssetsDetails();
            this.showToast(res.data.description, "success");
          }
        })
        .catch((e) => {
          this.showToast(e.response.description, "error");
        });
    },
    exportCsv() {
      this.loaderFlag = true;
      let request = {
        assetExcelData: this.buildExportDataRequest(),
        assignments: this.buildAssignmentRequest(),
        assignmentHistories: this.buildAssignmentHistories(),
        issues: this.buildIssues(),
        workOrders: this.buildWorkOrders(),
        consumptions: this.buildConsumptions(),
        usages: this.buildUsages(),
      };
      AssetManagementService.exportAssetDetails(request)
        .then((response) => {
          if (response.status === 200) {
            this.loaderFlag = false;
            var sampleArray = this.base64ToArrayBuffer(response.data.file);
            let fileUrl = window.URL.createObjectURL(
              new Blob([sampleArray], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              })
            );
            var fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.setAttribute("download", response.data.fileName);
            document.body.appendChild(fileLink);
            fileLink.click();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    buildWorkOrders() {
      let workOrdersData = [];
      this.WorkOrderList.workOrders.map((workOrders) => {
        workOrdersData.push({
          workOrderNumber: workOrders.workOrderNumber,
          assetName: workOrders.assetName,
          issues: workOrders.issueCount,
          createdAt:
            workOrders.createdAt !== null
              ? moment(workOrders.createdAt).toISOString()
              : null,
          priority: workOrders.priority,
          assignedTo: workOrders.assignedToUserName,
          status: workOrders.status,
        });
      });
      return workOrdersData;
    },

    buildUsages() {
      let usages = [];
      this.usages.content.map((usage) => {
        usages.push({
          date:
            usage.primaryUsageTime !== null
              ? moment(usage.primaryUsageTime).toISOString()
              : usage.secondaryUsageTime !== null
              ? moment(usage.secondaryUsageTime).toISOString()
              : null,
          value: usage.primaryUsageValue,
          secondaryValue: usage.secondaryUsageValue,
        });
      });
      return usages;
    },

    buildConsumptions() {
      let consumptions = [];
      this.consumptions.content.map((consumption) => {
        consumptions.push({
          date:
            consumption.createdAt !== null
              ? moment(consumption.createdAt).toISOString()
              : null,
          consumptionValue: consumption.consumptionValue,
          unit: this.assetDetail.consumptionUnit,
        });
      });
      return consumptions;
    },

    buildIssues() {
      let issues = [];
      this.issues.issues.map((issue) => {
        issues.push({
          issueNumber: issue.issueNumber,
          issueName: issue.issueName,
          status: issue.status,
          workOrderNumber: issue.workOrderNumber,
          reportedBy: issue.reportedBy,
          reportedAt:
            issue.reportedAt != null
              ? moment(issue.reportedAt).toISOString()
              : null,
        });
      });
      return issues;
    },

    buildAssignmentHistories() {
      let assignmentHistories = [];
      this.assignmentHistoryUsers.map((users) => {
        assignmentHistories.push({
          name: users.name,
          duration: users.durations,
          startDate:
            users.userStartDates[0] !== null
              ? moment(users.userStartDates[0]).toISOString()
              : null,
          endDate:
            users.userEndingDates[0] !== null
              ? moment(users.userEndingDates[0]).toISOString()
              : null,
        });
      });
      return assignmentHistories;
    },

    buildAssignmentRequest() {
      let assignments = [];
      this.assignedUsers.map((user) => {
        assignments.push({
          name: user.name,
          status: user.status,
          startDate:
            user.startDate != null
              ? moment(user.startDate).toISOString()
              : null,
          assigned: user.count,
        });
      });
      return assignments;
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

    buildExportDataRequest() {
      let request = {
        name: this.assetDetail.name,
        modelNumber: this.assetDetail.modelNumber,
        manufacturer: this.assetDetail.manufacture,
        purchaseDate:
          this.assetDetail.purchaseDate !== null &&
          this.assetDetail.purchaseDate !== ""
            ? moment(this.assetDetail.purchaseDate).toISOString()
            : null,
        status: this.assetDetail.status,
        warranty: this.assetDetail.warranty,
        primaryUsageUnit: this.assetDetail.primaryUsageUnit,
        secondaryUsageUnit: this.assetDetail.secondaryUsageUnit,
        consumptionUnit: this.assetDetail.consumptionUnit,
        description: this.assetDetail.description,
        cost: this.assetDetail.cost,
        currency: this.currency,
        additionalFields: [],
      };
      // this.fields
      this.assetFields.map((field) => {
        let label = this.fields.find((f) => f.uuid === field.fieldId).label;
        request.additionalFields.push({
          fieldLabel: label !== undefined && label !== null ? label : "",
          fieldValue: JSON.parse(field.fieldValue).values[0],
        });
      });
      return request;
    },

    close() {
      this.ShowPopUp = false;
      this.imageDialog = false;
      this.ShowUnPopUp = false;
      this.deleteDialogAttachment = false;
    },
    openPopUp() {
      this.ShowPopUp = true;
    },
    onSelected(value) {
      console.log("seleted value", value);
    },
    getCurrency() {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      AssetPersonnelService.getCompanyCurrency(
        currentUserDetails.profile.organizationId
      ).then((response) => {
        this.currency = response.data.currency;
        this.keyIndex++;
      });
    },
    issuesAccordionFunction(val) {
      if (this.$refs.issuesAccordion.openFlag === true) {
        this.$refs.workOrdersAccordion.openFlag = false;
        this.$refs.assignmentAccordion.openFlag = false;
        this.$refs.categoryFieldsAccordion.openFlag = false;
        this.$refs.consumptionsAccordion.openFlag = false;
        this.$refs.usagesAccordion.openFlag = false;
        this.$refs.attachmentAccordion.openFlag === false;
      }
    },

    workOrdersAccordionFunction(val) {
      if (this.$refs.workOrdersAccordion.openFlag === true) {
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.assignmentAccordion.openFlag = false;
        this.$refs.categoryFieldsAccordion.openFlag = false;
        this.$refs.consumptionsAccordion.openFlag = false;
        this.$refs.usagesAccordion.openFlag = false;
        this.$refs.attachmentAccordion.openFlag === false;
      }
    },

    assignmentAccordionFunction(val) {
      if (this.$refs.assignmentAccordion.openFlag === true) {
        this.$refs.workOrdersAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.categoryFieldsAccordion.openFlag = false;
        this.$refs.consumptionsAccordion.openFlag = false;
        this.$refs.usagesAccordion.openFlag = false;
        this.$refs.attachmentAccordion.openFlag === false;
      }
    },

    categoryFieldsAccordionFunction() {
      if (this.$refs.categoryFieldsAccordion.openFlag === true) {
        this.$refs.assignmentAccordion.openFlag = false;
        this.$refs.workOrdersAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.consumptionsAccordion.openFlag = false;
        this.$refs.usagesAccordion.openFlag = false;
        this.$refs.attachmentAccordion.openFlag === false;
      }
    },

    consumptionsAccordionFunction() {
      if (this.$refs.consumptionsAccordion.openFlag === true) {
        this.$refs.categoryFieldsAccordion.openFlag = false;
        this.$refs.assignmentAccordion.openFlag = false;
        this.$refs.workOrdersAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.usagesAccordion.openFlag = false;
        this.$refs.attachmentAccordion.openFlag === false;
      }
    },

    attachmentAccordionFunction() {
      if (this.$refs.attachmentAccordion.openFlag === true) {
        this.$refs.categoryFieldsAccordion.openFlag = false;
        this.$refs.assignmentAccordion.openFlag = false;
        this.$refs.workOrdersAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.usagesAccordion.openFlag = false;
        this.$refs.consumptionsAccordion.openFlag === false;
        if (this.imageVoicesCheck.length > 0) {
          this.loaderFlag = true;
          this.getAssetImages();
        }
      }
    },

    getAssetRelatedIssue() {
      InspectionService.getPaginatedIssuesByAsset(
        this.assetUuid,
        "any",
        this.page,
        this.rowsPerPage
      )
        .then((res) => {
          let issues = res.data;
          let uuids = [];
          for (let index = 0; index < issues.issues.length; index++) {
            uuids.push(issues.issues[index].submittedByUserUUID);
          }
          AssetPersonnelService.getNameOfUsersByUUIDS({
            uuids: uuids,
          }).then((response2) => {
            let users = response2.data.users;
            this.issues.issues.map((issue) => {
              issue.reportedBy = users[issue.submittedByUserUUID].name;
            });
          });
          this.issues = issues;
        })
        .catch((e) => {
          console.log("error", e);
        });
    },

    getAssetWorkOrders() {
      WorkOrderService.getPaginatedWorkOrdersByAsset(
        this.page,
        this.rowsPerPage,
        this.assetUuid
      ).then((response) => {
        if (response.status === 200) {
          let countOfTotalWorkOrders = response.data.workOrders.totalElements;
          let totalPages = response.data.workOrders.totalPages;
          let workOrders = response.data.workOrders.content;
          if (workOrders.length === 0) {
            //this.setState({ loading: false, workOrders: workOrders });
          }
          let assetuuids = [];
          for (let index = 0; index < workOrders.length; index++) {
            if (workOrders[index].priority === null) {
              workOrders[index].priority = "Not Assigned";
            }
            //add uuid of asset in the list if it does not exist
            let assetuuidAdded = false;
            for (
              let assetuuidsIndex = 0;
              assetuuidsIndex < assetuuids.length;
              assetuuidsIndex++
            ) {
              if (assetuuids[assetuuidsIndex] === workOrders[index].assetUUID) {
                assetuuidAdded = true;
                break;
              }
            }
            if (!assetuuidAdded) {
              assetuuids.push(workOrders[index].assetUUID);
            }
            //setting date to string (DD mmM YYYY hh:mm am/pm) formt
            //start
            // debugger;
            workOrders[index].createdAt = moment(
              workOrders[index].createdAt
            ).format("DD MMM YYYY hh:mm a");
            //end
            //calculate issue count of work order
            let issueCount = workOrders[index].issues.length;
            workOrders[index].issueCount = issueCount;
          }
          //get basic info of assets from asset management service like name and category name of asset
          AssetManagementService.getNameAndTypeOfAssetsByUUIDS({
            uuids: assetuuids,
          })
            .then((response1) => {
              // debugger;
              for (let index = 0; index < workOrders.length; index++) {
                workOrders[index].assetName =
                  response1.data.assets[workOrders[index].assetUUID].name;
                workOrders[index].assetCategory =
                  response1.data.assets[workOrders[index].assetUUID].type;
                workOrders[index].assetNumber =
                  response1.data.assets[
                    workOrders[index].assetUUID
                  ].assetNumber;
              }
              this.WorkOrderList.totalElements = countOfTotalWorkOrders;
              this.WorkOrderList.number = response.data.workOrders.number;
              this.WorkOrderList.totalPages = totalPages;
              this.WorkOrderList.workOrders = workOrders;
            })
            .catch((error) => {
              if (error.response.status === 406) {
                this.showToast(
                  "Error while getting work orders. Please try again",
                  "error"
                );
              } else {
                this.showToast(
                  "Error while getting work orders. Please try again",
                  "error"
                );
              }
            });
        } else {
          this.showToast(
            "Error while getting work orders. Please try again",
            "error"
          );
        }
      });
    },

    usagesAccordionFunction() {
      if (this.$refs.usagesAccordion.openFlag === true) {
        this.$refs.categoryFieldsAccordion.openFlag = false;
        this.$refs.assignmentAccordion.openFlag = false;
        this.$refs.workOrdersAccordion.openFlag = false;
        this.$refs.issuesAccordion.openFlag = false;
        this.$refs.consumptionsAccordion.openFlag = false;
      }
    },

    getAssetImages() {
      AssetManagementService.getAssetImagesByUuid(this.assetUuid)
        .then((response) => {
          this.loaderFlag = false;
          if (response.status === 200) {
            this.imageVoices = response.data.assetImages;
          }
        })
        .catch((error) => {
          console.log("An Error Occurred while getting Asset Images.");
        });
    },

    AssetsDetails() {
      AssetManagementService.getAssetWithDetails(
        this.assetUuid,
        true,
        true,
        true,
        true,
        true,
        false,
        false
      ).then((response) => {
        if (response.status === 200) {
          this.loaderFlag = true;
          let tempAsset = response.data.assetDetail;
          this.assetDetail = tempAsset.assetDetail;
          this.assetDetail.cost = this.cost;
          this.imageVoicesCheck = tempAsset.assetImage;
          this.assetUuid = tempAsset.assetDetail.uuid;
          let asset = tempAsset.assetDetail;
          asset.purchaseDate = moment(asset.purchaseDate).format("DD MMM YYYY");
          asset.activityWall = tempAsset.activityWall;
          asset.assetFields = tempAsset.assetField;
          asset.attachments = tempAsset.attachment;
          asset.documents = tempAsset.attachment;
          asset.assetImages = tempAsset.assetImage;
          for (let index = 1; index < asset.assetImages.length; index++) {
            asset.assetImages[index].loading = false;
            asset.assetImages[index].imageFlag = true;
            asset.attachments.push(asset.assetImages[index]);
          }
          asset.category = tempAsset.category;
          asset.fieldTemplate =
            tempAsset.category && tempAsset.category.fieldTemplate
              ? tempAsset.category.fieldTemplate
              : null;
          this.assets = asset;
          this.renderImage();
          this.assetImages = asset.assetImages;
          this.attachments = asset.attachments;

          this.fields = this.assets.fieldTemplate.fields;
          this.assetFields = this.assets.assetFields;
          this.loaderFlag = false;
          document.title = this.assetDetail.assetNumber + " | " + "Erohal";
          response.data.assetDetail.activityWall.messages.map((item) => {
            item.firstName = item.userName;
            item.id = item.uuid;
            item.replies.map((replyItem) => {
              replyItem.firstName = replyItem.userName;
            });
            item.attachments = "";
          });
        }
      });
    },

    fullscreenImage(value) {
      this.popupImage = value;
      this.imageDialog = true;
    },

    renderImage() {
      if (this.assets.assetImages.length !== 0) {
        let imageUrl = this.assets.assetImages[0].imageUrl;
        InspectionService.getFile(imageUrl)
          .then((response) => {
            let imageContent = "data:image/png;base64," + response.data.content;
            this.placeholderImg = imageContent;
          })
          .catch((error) => {
            if (error.response.status === 406) {
              this.showToast("An unexpected Error Occurred", "error");
            } else {
              this.showToast("An unexpected Error Occurred", "error");
            }
          });
      } else {
        // this.placeholderImg =require("../../assets/images/Placeholder.png");
      }
    },

    getPaginatedConsumptionsByAsset() {
      AssetManagementService.getConsumptionsByAsset(
        this.assetUuid,
        this.page,
        this.rowsPerPage
      )
        .then((response) => {
          this.consumptions = response.data.consumptions;
          if (response.status === 200) {
            let consumptions = response.data.consumptions.content;
            for (let index = 0; index < consumptions.length; index++) {
              consumptions[index].createdAt = moment(
                consumptions[index].createdAt
              ).format("DD MMM YYYY hh:mm a");
              consumptions[index].consumptionUnit = this.consumptionUnit;
            }
          } else {
            this.showToast(
              "Error while getting consumptions of asset",
              "error"
            );
          }
        })
        .catch((error) => {
          //   this.setState({ loading: false });
          if (error.response !== undefined && error.response.status === 406) {
            this.showToast(
              "Error while getting consumptions of asset",
              "error"
            );
          } else {
            this.showToast(
              "Error while getting consumptions of asset",
              "error"
            );
          }
        });
    },

    getPaginatedUsagesByAsset() {
      AssetManagementService.getUsagesByAsset(
        this.assetUuid,
        this.page,
        this.rowsPerPage
      )
        .then((response) => {
          this.usages = response.data.usages;
          if (response.status === 200) {
            let usages = response.data.usages.content;
            for (let index = 0; index < usages.length; index++) {
              usages[index].createdAt = moment(usages[index].createdAt).format(
                "DD MMM YYYY hh:mm a"
              );
              usages[index].primaryUsageTime =
                usages[index].primaryUsageTime !== null
                  ? moment(usages[index].primaryUsageTime).format(
                      "DD MMM YYYY hh:mm a"
                    )
                  : null;
              usages[index].secondaryUsageTime =
                usages[index].secondaryUsageTime !== null
                  ? moment(usages[index].secondaryUsageTime).format(
                      "DD MMM YYYY hh:mm a"
                    )
                  : null;
              usages[index].primaryUsageUnit = this.primaryUsageUnit;
              usages[index].secondaryUsageUnit = this.secondaryUsageUnit;
            }
            this.countOfTotalUsages = response.data.usages.totalElements;
            this.data = usages;
          } else {
            this.showToast("Error while getting usages of asset", "error");
          }
        })
        .catch((error) => {
          if (error) {
            this.showToast("Error while getting usages of asset", "error");
          }
          //   this.setState({ loading: false });
        });
    },

    unAssignAsset(index, value) {
      this.assignTableValue = value;
      var currentDate = moment().format();
      if (moment(value.startDate).format() > currentDate) {
        this.futuredUnAssignment(value.assignmentId);
      } else {
        this.valueEditAssign = value;
        this.index++;
        this.ShowUnPopUp = true;
        this.userIndex = index;
      }
    },

    unAssignUser(value) {
      //	this.loaderFlag = true;
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
        AssetPersonnelService.unassignAsset(DeleteAssignmentRecordRequest).then(
          (response) => {
            if (response.status === 200) {
              console.log(response);
            }
            let users = this.assignedUsers;
            let historyUsers = this.assignmentHistoryUsers;
            let historyAdded = false;
            //return;
            //	this.deleteModel = false;
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
              // historyUsers.push(newUser);
            }
            users.splice(this.userIndex, 1);
            this.showToast("User Un-Assigned Successfully", "success");
            this.getAssignedUsersOfAsset();
            this.getAssignmentHistoryByAsset();
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
          assetUUID: this.assetUuid,
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
            this.getAssignedUsersOfAsset();
            this.getAssignmentHistoryByAsset();
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
                this.getAssignedUsersOfAsset();
                this.getAssignmentHistoryByAsset();
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
        //let date = Date();
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

    unassignAsset(index, id) {
      this.loaderFlag = true;
      this.userIndex = index;
      AssetPersonnelService.unassignAsset(this.assetUuid, id)
        .then((response) => {
          if (response.status === 200) {
            // debugger;
            let users = this.assignedUsers;
            let historyUsers = this.assignmentHistoryUsers;
            let historyAdded = false;

            historyUsers.map((historyItem) => {
              if (historyItem.uuid === id) {
                historyItem.userEndingDates.push(
                  moment().format("DD MMM YYYY hh:mm a")
                );
                historyAdded = true;
              }
              return historyItem;
            });

            if (!historyAdded) {
              let newUser = {
                uuid: id,
                name: users[this.userIndex].name,
                userEndingDates: [moment().format("DD MMM YYYY hh:mm a")],
              };
              historyUsers.push(newUser);
            }
            users.splice(this.userIndex, 1);
            this.showToast("User Un-Assigned Successfully", "success");
            this.loaderFlag = false;
          } else {
            this.showToast(
              "Error while Un-Assigning the user. Please try again",
              "error"
            );

            // this.snackBarRef.current.showSnackBar('Error while Un-Assigning the user. Please try again','error');
          }
        })
        .catch((error) => {
          //  this.setState({ loading: false});
          if (error.response.status === 406) {
            this.showToast(
              "Error while Un-Assigning the user. Please try again",
              "error"
            );
          } else {
            this.showToast(
              "Error while Un-Assigning the user. Please try again",
              "error"
            );
          }
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
                        this.getAssignedUsersOfAsset();
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

    assignmentUserCurrentDate(value) {
      this.loaderFlag = true;
      InspectionService.getInspectionTempaltesByAsset(this.assetUuid)
        .then((response) => {
          var currentDate = moment().format();
          if (response.status === 200) {
            //	debugger
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
            //return;
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
                        this.getAssignedUsersOfAsset();
                        this.ShowPopUp = false;
                        this.loaderFlag = false;
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

    assignmentUserLater(value) {
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
                this.showToast(res.data.description, "success");
                this.ShowPopUp = false;
                this.loaderFlag = false;
                this.getAssignedUsersOfAsset();
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
      this.loaderFlag = true;
      var selectedDate = moment(value.assignmentDate).format(
        "YYYY-MM-DDTHH:MM:SSZ"
      );
      var dateSplit = selectedDate.split("T");
      var objDate = dateSplit[0];
      var timeSplit = value.assignmentTime.split(":");
      var hour = timeSplit[0];
      var min = timeSplit[1];
      let assignmentDate = objDate + "T" + hour + ":" + min + ":" + "00+05:00";
      value.startDate = assignmentDate;
      this.updateCurrentAssignment(value);
    },
    updateCurrentAssignment(value) {
      if (value.user.length > 1) {
        this.showToast("Select only one user", "error");
        return;
      }
      InspectionService.getInspectionTempaltesByAsset(this.assetUuid)
        .then((response) => {
          if (response.status == 200) {
            let UpdateAssetAssignmentRequest = {
              assignmentId: value.assignmentId,
              assetId: this.assetUuid,
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
                  debugger
                  this.showToast("User Update successfully", "success");
                  this.getAssignedUsersOfAsset();
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
    futuredUnAssignment(uuid) {
      this.loaderFlag = true;
      AssetPersonnelService.deletePostAssignmentByUUID(uuid)
        .then((res) => {
          this.showToast(res.data.description, "success");
          this.getAssignedUsersOfAsset();
          this.loaderFlag = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editAssigned(index, val) {
      this.ShowPopUp = true;
      this.valueEditAssign = val;
      this.index++;
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
    getAssignedUsersOfAsset() {
      AssetPersonnelService.getAssignedUsersOfAsset(this.assetUuid)
        .then((response1) => {
          if (response1.status === 200) {
            let users = [];
            for (
              let index = 0;
              index < response1.data.details.length;
              index++
            ) {
              let obj = {};
              obj.name = response1.data.details[index].name;
              obj.count = response1.data.details[index].count;
              obj.status = response1.data.details[index].status;
              obj.startDate = moment(
                response1.data.details[index].startDate
              ).format("DD MMM YYYY hh:mm a");
              obj.uuid = response1.data.details[index].uuid;
              obj.userEndingDates =
                response1.data.details[index].userEndingDates;
              obj.assignmentId = response1.data.details[index].assignmentId;
              users.push(obj);
            }
            this.assignedUsers = users;
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.showToast("An unexpected Error Occurred", "error");
          } else {
            this.showToast(
              "Error Occurred while getting Asset Assignment",
              "error"
            );
          }
        });
    },
    getAssignmentHistoryByAsset() {
      AssetPersonnelService.getAssignmentHistoryByAsset(
        this.assetUuid,
        this.page,
        this.rowsPerPage
      )
        .then((response) => {
          if (response.status === 200) {
            let users = [];
            for (let index = 0; index < response.data.details.length; index++) {
              let obj = {};
              obj.name = response.data.details[index].name;
              obj.count = response.data.details[index].count;
              obj.userStartDates = moment(
                response.data.details[index].startDate
              ).format("DD MMM YYYY hh:mm a");
              obj.userEndingDates = moment(
                response.data.details[index].endDate
              ).format("DD MMM YYYY hh:mm a");
              obj.uuid = response.data.details[index].uuid;
              obj.durations = response.data.details[index].duration;
              // obj.status = response.data.details[index].status;
              users.push(obj);
            }
            this.assignmentHistoryUsers = users;
            this.assignmentHistoryUsers.totalPages = response.data.totalPages;
            this.assignmentHistoryUsers.totalElements =
              response.data.totalElements;
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.showToast("Opps its look like our server is offline", "error");
          }
          //   this.setState({ loading: false});
          else {
            this.showToast("Opps its look like our server is offline", "error");
          }
        });
    },
    deleteAssetImage(id) {
      AssetManagementService.deleteAssetImage(id)
        .then((res) => {
          this.getAssetImages();
          this.showToast("Images deleted successfully", "success");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getMaintainanceCost(assetId) {
      {
        WorkOrderService.getAssetMaintenanceCostByAssetUUID(assetId)
          .then((res) => {
            this.cost = res.data.maintenanceCost;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  mounted() {},
  created() {
    this.loaderFlag = true;
    this.assetUuid = this.$route.params.assetID;
    this.getMaintainanceCost(this.assetUuid);
    this.AssetsDetails();
    this.getPaginatedConsumptionsByAsset();
    this.getPaginatedUsagesByAsset();
    this.selectUser();
    this.getAssignedUsersOfAsset();
    this.getAssignmentHistoryByAsset();
    this.getAssetRelatedIssue();
    this.getCurrency();
    this.getAssetWorkOrders();
    //	this.getMaintainanceCost(this.assetUuid);
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
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

.loader {
  width: 20px;
  height: 20px;
}

.upload-csv {
  div {
    padding-top: 0.5em;
    display: inline-block;
    max-width: 200px;
  }
}
.fileName {
  padding: 20px 50px;
  cursor: pointer;
  color: blue;
}
</style>