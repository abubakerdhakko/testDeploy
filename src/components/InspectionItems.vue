<template>
  <div v-padding="'16px 32px 16px 32px'">
    <SToggle
      title="Failed only"
      v-model="failedOnly"
      :options="[
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ]"
      @selected="failedEvent"
    />
    <br /><br />

    <div class="column-grid-2">
      <SSelect
        label="Filter By"
        v-model="filterLabel"
        :source="filterOptions"
        resultsValue="label"
        resultsDisplay="label"
        :autocomplete="false"
        :key="filterIndex + 'filter'"
        @selected="filterSelected"
      />
      <SSelect
        label="Actions"
        v-model="model"
        :source="source"
        resultsValue="value"
        resultsDisplay="name"
        :autocomplete="false"
        @selected="onSelected"
        :disabled="disableActions"
      />
    </div>
    <div v-if="inspectionReportItems" v-padding="'16px 0px 16px 0px'">
      <CreateIssue
        v-if="createIssue === true"
        @close="closedIssue"
        @save="createNewIssue"
        :inspectionAssetUUID="inspectionAssetUUID"
        :selectedInspectionItm="selectedInspectionItm"
        :InspectionItemImage="InspectionItemImage"
      ></CreateIssue>
      <ExistingIssue
        v-if="mergeIssue === true && issuesOption.length > 0"
        @close="closedMerge"
        @mergeIssue="mergeNewIssue"
        :IssueNumberOption="issuesOption"
      ></ExistingIssue>

      <IgnoreInspectionItems
        v-if="ignoreNewIssue === true"
        @close="closeIgnoreIssue"
        @ignoreRequest="ignoreRequest"
      ></IgnoreInspectionItems>

      <div
        v-for="(inspection, index) in inspectionReportItems"
        :key="index + '_items'"
      >
        <div class="inspection-column-grid">
          <SCheckBox
            v-model="inspection.value"
            label=""
            v-padding="'23px 0 0 0'"
            icon="true"
            @input="funcName(inspection, index)"
            :disabled="type == 'Initial'"
          />

          <SAccordion
            :icon="inspection.status === 'pass' ? 'pass.png' : 'fail.png'"
            :title="
              inspection.itemStatusWithName == undefined
                ? ''
                : inspection.itemStatusWithName
            "
            :subTitle="
              inspection.issueNumber == null
                ? ''
                : inspection.issueNumber + ' ' + inspection.issueName
            "
            expandIcon="arrows"
            :open="false"
            ref="refAccordion"
            @state="clickAccordionFunction(index)"
            :shadow="true"
            :border="false"
            :padding="'36'"
          >
            <div class="row" v-padding="'16px 36px 16px 36px'">
              <div
                v-for="value in inspection.inspectionReportFields"
                :key="value + 'coments'"
              >
                <span
                  ><strong>{{ value.instructions }}</strong></span
                ><br />
                <span v-if="value.fieldValue != null">
                  {{ value.fieldValue }}
                </span>
                <span
                  v-if="
                    value.fieldValue === null && value.fieldStatus === 'pass'
                  "
                >
                  Yes
                </span>
                <span
                  v-if="
                    value.fieldValue === null && value.fieldStatus != 'pass'
                  "
                >
                  No </span
                ><br />
                <div
                  style="font-size: 14px; margin-top: 24px; margin-bottom: 10px"
                >
                  <span v-if="value.ignoreComments"
                    ><strong>Ignore Comments:</strong>
                  </span>
                  <span
                    style="
                      font-size: 14px;
                      margin-top: 16px;
                      margin-bottom: 16px;
                    "
                    v-if="value.ignoreComments"
                  >
                    {{ value.ignoreComments }}</span
                  >
                </div>
              </div>
              <div v-if="inspection.image">
                <div
                  v-for="(comments, index) in inspection.image"
                  :key="index + '_comment'"
                >
                  <span
                    v-padding="'16px 0px 16px 0px'"
                    v-if="comments.messageFlag"
                    style="
                      font-size: 14px;
                      margin-top: 16px;
                      margin-bottom: 16px;
                    "
                    ><strong>Comments</strong></span
                  ><br />

                  <span
                    style="
                      font-size: 14px;
                      margin-top: 16px;
                      margin-bottom: 16px;
                    "
                    v-if="comments.messageFlag"
                    >{{ comments.message }}</span
                  >
                </div>

                <div style="margin-top: 16px">
                  <div><strong>Gallery</strong></div>
                  <!-- <img
                    v-if="loaderFlag && imagesPresent"
                    src="assets/loader/medium.gif"
                    alt="loader"
                    class="loaders"
                  /> -->

                  <div
                    v-for="(image, index) in itemImages"
                    :key="index + '_image'"
                  >
                    <div
                      v-if="image.imageFlag === true"
                      style="
                        font-weight: bold;
                        font-size: 14px;
                        margin-top: 16px;
                        margin-bottom: 16px;
                      "
                    ></div>

                    <img
                      class="images-row"
                      alt=""
                      v-if="
                        image.imageFlag &&
                        !loaderFlag &&
                        imagesPresent &&
                        index <= maximumImage
                      "
                      :src="'data:image/png;base64,' + image.content"
                      style="
                        width: 100px;
                        height: 100px;
                        float: left;
                        padding-right: 20px;
                        padding-bottom: 20px;
                      "
                      @click="fullscreenImage(image)"
                      :key="imageIndex"
                    />

                    <span
                      @click="showAllImages()"
                      style="
                        width: 100px;
                        height: 100px;
                        float: left;
                        padding-right: 20px;
                        padding-bottom: 20px;
                        cursor: pointer;
                        font-size: 14px;
                        text-decoration: underline;
                        color: blue;
                      "
                      v-if="
                        !loaderFlag &&
                        imagesPresent &&
                        itemImages.length > 3 &&
                        index === 2 &&
                        hideAddIcon
                      "
                      >View More</span
                    >
                  </div>

                  <SDialog
                    title=""
                    :width="700"
                    :persistent="false"
                    :closeIcon="false"
                    @close="close"
                    v-show="locationDialog"
                  >
                    <img
                      class="images-row"
                      :src="'data:image/png;base64,' + dialogImage"
                      style="width: 100%; height: auto"
                      alt=""
                    />
                  </SDialog>
                </div>
              </div>
              <div
                class="btn-row"
                v-if="
                  inspection.status === 'fail' &&
                  inspection.inspectionReportFields[0].issueReporting != null
                "
                v-padding="'16px 0px 16px 0px'"
              ></div>
            </div>
          </SAccordion>
        </div>
      </div>
    </div>
    <loader v-if="loaderFlag" />
  </div>
</template>

<script>
import InspectionService from "../services/InspectionService";
import WorkOrderService from "../services/WorkOrderService";
import CreateIssue from "../components/CreateIssue";
import ExistingIssue from "../components/ExistingIssue";
import IgnoreInspectionItems from "../views/inspection/components/IgnoreInspectionItems";
import loader from "./Loader.vue";
export default {
  name: "InspectionItem",

  components: {
    CreateIssue,
    ExistingIssue,
    IgnoreInspectionItems,
    loader,
  },
  props: {
    inspectionReportItem: {},
    imageVoices: {},
    assetUUID: {},
    showToast: {},
    workOrder: {},
    setLoading: {},
    type: {},
  },
  data() {
    return {
      maximumImage: 2,
      hideAddIcon: true,
      itemImages: [],
      imageIndex: 0,
      loaderFlag: false,
      imagesPresent: false,
      currentUserDetails: "",
      disableActions: true,
      locationDialog: false,
      failedOnly: false,
      filterLabel: "all",
      filterOptions: [
        { label: "All", value: "all" },
        { label: "Image Only", value: "image" },
        { label: "Comments Only", value: "comments" },
      ],
      resetImages: 0,
      inspectionItems: null,
      filterIndex: 0,
      createIssue: false,
      mergeIssue: false,
      ignoreNewIssue: false,
      issuesOption: [],
      serviceRequest: "",
      issues: "",
      selectedInspectionItm: [],
      inspectionAssetUUID: "",
      model: "",
      inspectionuuid: "",
      status: "",
      inspectionDetail: "",
      dialogImage: "",
      source: [
        {
          name: "Create Issue",
          value: "Create Issue",
        },
        {
          name: "Ignore Request",
          value: "Ignore Request",
        },
        {
          name: "Add to Existing Issue",
          value: "Add to Existing Issue",
        },
        {
          name: "Restore Items",
          value: "Restore Items",
        },
      ],
      InspectionItemImage: [],
      newArrImg: [],
      checkAcc: false,
    };
  },

  methods: {
    showAllImages() {
      this.hideAddIcon = false;
      this.maximumImage = this.itemImages.length - 1;
    },
    close() {
      this.locationDialog = false;
    },
    closeIgnoreIssue() {
      this.ignoreNewIssue = false;
    },

    ignoreRequest(value) {
      let ignoreCommentsField = value;
      if (!ignoreCommentsField.value) {
        return;
      }
      let updateIssueRequest = {
        inspectionItemsUUID: [],
        username: this.currentUserDetails.profile.username,
        ignoreComments: value.value,
        type: "ignore",
      };

      this.$emit("setLoading", true);
      if (this.selectedInspectionItm !== undefined) {
        for (
          let index = 0;
          index < this.selectedInspectionItm.length;
          index++
        ) {
          const element =
            this.selectedInspectionItm[index].inspectionReportFields[0].uuid;
          updateIssueRequest.inspectionItemsUUID.push(element);
        }
      }
      // return;
      this.closeIgnoreIssue();
      InspectionService.ignoreInspectionItems(updateIssueRequest)
        .then((response) => {
          try {
            if (response.status === 200) {
              this.$emit(
                "showToast",
                " Ignored Items successfully!",
                "success"
              );
              // this.$router.go({
              //   name: "inspection-details",
              //   params: {
              //     inspectionUUID: this.inspectionuuid,
              //   },
              // });
              this.$emit("setLoading", false);
              this.$emit("updateInspectionItems");
            } else {
              this.$emit("setLoading", false);
              this.$emit(
                "showToast",
                "Error while ignoring service request. Please try again",
                "error"
              );
            }
          } catch (e) {
            this.$emit("setLoading", false);
            this.$emit(
              "showToast",
              "Error while ignoring service request. Please try again",
              "error"
            );
          }
        })
        .catch((error) => {
          this.$emit("setLoading", false);
          if (error.response.status === 406) {
            this.$emit("showToast", "An unexpected Error Occurred.", "error");
          } else {
            this.$emit("showToast", "An unexpected Error Occurred.", "error");
          }
        })
        .finally(() => {});
    },
    restoreRequest() {
      let updateIssueRequest = {
        inspectionItemsUUID: [],
        username: this.currentUserDetails.profile.username,
        ignoreComments: "",
        type: "",
      };

      this.$emit("setLoading", true);
      if (this.selectedInspectionItm !== undefined) {
        for (
          let index = 0;
          index < this.selectedInspectionItm.length;
          index++
        ) {
          const element =
            this.selectedInspectionItm[index].inspectionReportFields[0].uuid;
          updateIssueRequest.inspectionItemsUUID.push(element);
        }
      }
      InspectionService.ignoreInspectionItems(updateIssueRequest)
        .then((response) => {
          try {
            if (response.status === 200) {
              this.$emit("showToast", "Items Restore successfully!", "success");
              // this.$router.go({
              //   name: "inspection-details",
              //   params: {
              //     inspectionUUID: this.inspectionuuid,
              //   },
              // });
              this.$emit("setLoading", false);
              this.$emit("updateInspectionItems");
            } else {
              this.$emit("setLoading", false);
              this.$emit(
                "showToast",
                "Error while ignoring service request. Please try again",
                "error"
              );
            }
          } catch (e) {
            this.$emit("setLoading", false);
            this.$emit(
              "showToast",
              "Error while ignoring service request. Please try again",
              "error"
            );
          }
        })
        .catch((error) => {
          this.$emit("setLoading", false);
          if (error.response.status === 406) {
            this.$emit("showToast", "An unexpected Error Occurred.", "error");
          } else {
            this.$emit("showToast", "An unexpected Error Occurred.", "error");
          }
        });
    },
    onSelected(value) {
      if (value.display === "Create Issue") {
        for (
          let index = 0;
          index < this.selectedInspectionItm.length;
          index++
        ) {
          const element = this.selectedInspectionItm[index].itemStatus;
          const element1 = this.selectedInspectionItm[index].issueNumber;
          if (element !== "Ignore" && element1 == null) {
            this.createIssue = true;
          } else {
            this.$emit("showToast", "Please Select Other Items", "error");
          }
          // this.clickAccordionFunction();
        }
      } else if (value.display === "Ignore Request") {
        for (
          let index = 0;
          index < this.selectedInspectionItm.length;
          index++
        ) {
          const element = this.selectedInspectionItm[index].itemStatus;
          if (element !== "Ignore") {
            this.ignoredIssue();
          } else {
            this.$emit("showToast", "Please Select un-ignore Item", "error");
          }
        }
      } else if (value.display === "Add to Existing Issue") {
        this.createExistingIssue();
      } else if (value.display === "Restore Items") {
        for (
          let index = 0;
          index < this.selectedInspectionItm.length;
          index++
        ) {
          const element = this.selectedInspectionItm[index].itemStatus;
          if (element === "Ignore") {
            this.restoreRequest();
          } else {
            this.$emit("showToast", "Please Select Ignore Item", "error");
            // this.$router.go({
            //   name: "inspection-details",
            //   params: {
            //     inspectionUUID: this.inspectionuuid,
            //   },
            // });
          }
        }
      }
    },

    ignoredIssue() {
      this.ignoreNewIssue = true;
    },

    createExistingIssue() {
      this.mergeIssue = true;
    },

    closedMerge() {
      this.mergeIssue = false;
    },

    async mergeNewIssue(value) {
      this.loaderFlag = true;
      if (this.value === "") {
        this.$emit("showToast", "Please select required fields", "error");
      } else {
        this.existingIssue = false;
        let linkIssueRequest = {};
        linkIssueRequest.linkedWithIssueUUID = value;
        linkIssueRequest.issueUUID = this.serviceRequest.uuid;

        if (this.selectedInspectionItm !== undefined) {
          let inspectionItemObj = {
            inspectionUUID: this.selectedInspectionItm.inspectionUUID,
            inspectionReportsFields: [],
          };
          for (
            let index = 0;
            index < this.selectedInspectionItm.length;
            index++
          ) {
            const element =
              this.selectedInspectionItm[index].inspectionReportFields[0].uuid;

            inspectionItemObj.inspectionReportsFields.push(element);
          }

          linkIssueRequest.inpsectionItemsUUID =
            JSON.stringify(inspectionItemObj);
        }
        // console.log('linkIssueRequest',linkIssueRequest)

        try {
          var response = await InspectionService.linkIssues(linkIssueRequest);

          if (response.status === 200) {
            this.$emit("showToast", "Issue linked Successfully", "success");
            this.closedMerge();
            this.loaderFlag = false;
          }
          // business logic goes here
        } catch (error) {
          if (error.status === 422) {
            this.$emit("showToast", "Already Exist", "warning");
            this.closedMerge();
            this.loaderFlag = false;
          } else {
            console.error(error);
            // from creation or business logic
            this.$emit(
              "showToast",
              "Error while linking issues. Please try again",
              "error"
            );
            this.loaderFlag = false;
          }
        }
      }
    },

    getIssuesByAssets(assetUUID) {
      InspectionService.filterIssuesByAssetUUID(assetUUID)
        .then((response) => {
          if (response.status === 200) {
            this.issues = response.data.issues;
            for (let index = 0; index < response.data.issues.length; index++) {
              this.issuesOption.push({
                name:
                  response.data.issues[index].issueNumber +
                  "," +
                  response.data.issues[index].issueName,
                value: response.data.issues[index].uuid,
              });
            }
          }
        })
        .catch((error) => {});
    },
    closedIssue() {
      this.createIssue = false;
    },
    createNewIssue() {
      this.createIssue = false;
      this.$emit("showToast", "Issue created successfully", "success");
      this.$emit("updateInspectionItems");
    },

    clickAccordionFunction(indx) {
      for (let index = 0; index < this.$refs.refAccordion.length; index++) {
        if (index !== indx) {
          this.$refs.refAccordion[index].openFlag = false;
        }
      }
      this.itemImages = [];
      let present = false;
      for (
        let ind = 0;
        ind < this.inspectionReportItems[indx].image.length;
        ind++
      ) {
        if (this.inspectionReportItems[indx].image[ind].imageFlag == true) {
          present = true;
        }
      }
      if (present) {
        this.maximumImage = 2;
        this.loaderFlag = true;
        this.imagesPresent = true;
        this.hideAddIcon = true;
        this.itemImage(
          indx,
          this.inspectionReportItems[indx].inspectionReportFields[0].uuid,
          true
        );
      } else {
        this.imagesPresent = false;
        this.loaderFlag = false;
      }
      // voices
      this.itemVoices = [];
      let voicePresent = false;
      // for (
      //   let ind = 0;
      //   ind < this.inspectionReportItems[indx].image.length;
      //   ind++
      // ) {
      //   if (this.inspectionReportItems[indx].image[ind].imageFlag == true) {
      //     present = true;
      //   }
      // }
      // if (present) {
      //   this.maximumImage = 2;
      //   this.loaderFlag = true;
      //   this.imagesPresent = true;
      //   this.hideAddIcon = true;
      //   this.itemImage(
      //     indx,
      //     this.inspectionReportItems[indx].inspectionReportFields[0].uuid,
      //     true
      //   );
      // } else {
      //   this.imagesPresent = false;
      //   this.loaderFlag = false;
      // }
    },

    fullscreenImage(image) {
      this.dialogImage = image.content;
      this.locationDialog = true;
    },

    failedEvent(value) {
      this.$refs.refAccordion.map((ref) => {
        ref.openFlag = false;
      });
      this.inspectionReportItems = [];
      if (value.value === true) {
        for (let index = 0; index < this.inspectionItems.length; index++) {
          if (this.inspectionItems[index].status === "fail") {
            this.inspectionReportItems.push(this.inspectionItems[index]);
          }
        }
      } else {
        this.inspectionReportItems = this.inspectionItems;
        // this.inspectionStatus = "ship.png"
      }
      this.filterLabel = "";
      this.filterIndex++;
    },

    filterSelected(value) {
      this.$refs.refAccordion.map((ref) => {
        ref.openFlag = false;
      });
      this.failedOnly = false;
      this.inspectionReportItems = [];
      let found = false;
      if (value.selectedObject.value === "comments") {
        for (let index = 0; index < this.inspectionItems.length; index++) {
          found = false;
          for (let j = 0; j < this.inspectionItems[index].image.length; j++) {
            if (this.inspectionItems[index].image[j].messageFlag === true) {
              found = true;
            }
          }
          if (found === true) {
            this.inspectionReportItems.push(this.inspectionItems[index]);
          }
        }
      } else if (value.selectedObject.value === "image") {
        for (let index = 0; index < this.inspectionItems.length; index++) {
          found = false;

          for (let j = 0; j < this.inspectionItems[index].image.length; j++) {
            if (this.inspectionItems[index].image[j].imageFlag === true) {
              found = true;
            }
          }
          if (found === true) {
            this.inspectionReportItems.push(this.inspectionItems[index]);
          }
        }
      } else {
        this.inspectionReportItems = this.inspectionItems;
      }
    },
    funcName(value, index) {
      let inspectionItems = [];
      if (value.value === true) {
        this.loaderFlag = true;

        this.checkAcc = true;
        this.clickAccordionFunction(index);
        (this.disableActions = false), this.selectedInspectionItm.push(value);
        this.selectedInspectionItm.inspectionUUID = this.inspectionuuid;
      }

      if (value.value === false) {
        var result = this.InspectionItemImage.filter(
          (k) => !value.image.some((p) => p.id == k.id)
        );
        this.InspectionItemImage = result;
        for (
          let index = 0;
          index < this.selectedInspectionItm.length;
          index++
        ) {
          if (this.selectedInspectionItm[index].uuid !== value.uuid) {
            inspectionItems.push(this.selectedInspectionItm[index]);
          }
        }
        this.selectedInspectionItm = inspectionItems;

        if (this.selectedInspectionItm.length === 0) {
          this.disableActions = true;
        }
      }
    },

    getInspectionItem() {
      const keys = Object.keys(this.imageVoices);
      let uuid = null;

      for (let j = 0; j < this.inspectionReportItems.length; j++) {
        this.inspectionReportItems[j].image = [];
        this.inspectionReportItems[j].value = false;

        for (
          let k = 0;
          k < this.inspectionReportItems[j].inspectionReportFields.length;
          k++
        ) {
          if (
            this.inspectionReportItems[j].inspectionReportFields[k]
              .ignoreComments !== undefined &&
            this.inspectionReportItems[j].inspectionReportFields[k]
              .ignoreComments !== null
          ) {
            this.inspectionReportItems[j].itemStatusWithName =
              this.inspectionReportItems[j].name + " - Ignore";
            this.inspectionReportItems[j].itemStatus = "Ignore";
          } else {
            this.inspectionReportItems[j].itemStatusWithName =
              this.inspectionReportItems[j].name;
          }
          if (
            this.inspectionReportItems[j].inspectionReportFields[k]
              .issueReporting !== undefined &&
            this.inspectionReportItems[j].inspectionReportFields[k]
              .issueReporting !== null
          ) {
            uuid =
              this.inspectionReportItems[j].inspectionReportFields[k]
                .issueReporting.uuid;
            if (!keys.includes(uuid)) {
              uuid =
                this.inspectionReportItems[j].inspectionReportFields[k].uuid;
            }
          } else {
            uuid = this.inspectionReportItems[j].inspectionReportFields[k].uuid;
          }
          this.inspectionReportItems[j].image = this.imageVoices[uuid];
        }
      }

      this.inspectionItems = this.inspectionReportItems;
    },

    itemImage(index, uuid, present) {
      if (this.workOrder != undefined) {
        WorkOrderService.getImageVoicesByInspectionItemUUID(uuid)
          .then((res) => {
            if (res.data.responseIdentifier === "Success") {
              if (present) {
                this.hideAddIcon = true;
                this.maximumImage = 2;
                this.itemImages = res.data.imageVoices[uuid];
              }
              this.imageIndex++;
              this.loaderFlag = false;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        InspectionService.getImageVoicesByInspectionItemUUID(uuid)
          .then((res) => {
            if (res.data.responseIdentifier === "Success") {
              if (present) {
                this.hideAddIcon = true;
                this.maximumImage = 2;
                this.itemImages = res.data.imageVoices[uuid];

                if (this.checkAcc == true) {
                  var testArray = res.data.imageVoices[uuid];
                  for (var item of testArray) {
                    this.InspectionItemImage.push(item);
                  }
                  const uniqueIds = new Set();
                  const unique = this.InspectionItemImage.filter((element) => {
                    const isDuplicate = uniqueIds.has(element.id);
                    uniqueIds.add(element.id);
                    if (!isDuplicate) {
                      return true;
                    }
                    return false;
                  });
                  this.InspectionItemImage = unique;
                  // console.log('this.InspectionItemImage',this.InspectionItemImage)
                  this.checkAcc = false;
                  // this.loaderFlag = false;
                }
              }
              this.imageIndex++;
              this.loaderFlag = false;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },

  created() {
    this.inspectionuuid = this.$route.params.inspectionUUID;
    this.inspectionReportItems = this.inspectionReportItem;
    this.inspectionAssetUUID = this.assetUUID;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getIssuesByAssets(this.assetUUID);
    this.getInspectionItem();
    this.inspectionDetails = this.inspectionDetail;
  },

  validations: function () {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 24px;
}
.row {
  padding-left: 8px;
  padding-right: 8px;
}
.btn-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-content: center;
  align-items: center;
  column-gap: 16px;
  row-gap: 24px;
}
.images-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-content: center;
  align-items: center;
  column-gap: 16px;
  row-gap: 24px;
}

.inspection-column-grid {
  display: grid;
  grid-template-columns: 0.1fr 6fr;
  grid-column-gap: 8px;
}
.loaders {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
}
</style>
