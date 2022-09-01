<template>
  <div class="pt-32 pb-80">
    <div v-if="this.assetID == undefined" class="head-title">Create Asset</div>
    <div v-if="this.assetID !== undefined" class="head-title">
      {{ assetObj.name }} - {{ assetObj.assetNumber }}
    </div>
    <div class="subtitle pb-32">Create Asset in a few simple steps</div>
    <!-- <div class="upload-csv"  style="padding-bottom: 0.5em; padding-left: 40em;" v-if="(this.assetID === undefined || this.assetID !== undefined) && category">
			<span 
				@click="uploadCSV"
				style="cursor: pointer; font-size: 17px; color: #4285f4"
			>
				Upload CSV
			</span>
		</div> -->
    <div class="main-page">
      <div class="column-grid-2">
        <SInput
          label="ASSET NAME*"
          v-model="assetObj.name"
          :error="getFormErrorMessage($v.assetObj.name)"
        />
        <SSelect
          label="ASSET CATEGORY"
          :source="AssetCategory"
          v-model="category"
          resultsValue="uuid"
          resultsDisplay="name"
          :error="getFormErrorMessage($v.category)"
          @selected="selectAssetCate"
          @clear="clearSelectedAssetCate"
          :key="cateIndex"
        />

        <!-- @input="selectAssetCate" -->
      </div>
      <div></div>
      <!-- <div class="right-column">
        <div class="column-grid-2">
          <SButton
            :dropdown="false"
            :disable="disableAddButton"
            rounded
            dense
            :title="'Add Category'"
            :style="disableAddButton ? styleButton2 : styleButton1"
            @click="openPopUp"
          ></SButton>
          <SButton
            :dropdown="false"
            rounded
            :disable="disableEditButton"
            dense
            :title="'Edit Category'"
            :style="disableEditButton ? styleButton2 : styleButton1"
            @click="EditCategory"
          ></SButton>
        </div>
      </div> -->

    </div>
    <div class="main-page pt-32">
      <div class="">
        <SAccordion
          :title="'Asset Information'"
          :expandIcon="'arrows'"
          :open="true"
          :padding="'32'"
          ref="assetInformationAccordion"
          @state="assetInformationAccordionFunction"
        >
          <div class="column-grid-2" v-padding="'32px'">
            <!-- <SInput
							label="Quantity*"
							v-model="assetObj.quantity"
							:error="getFormErrorMessage($v.assetObj.quantity)"
						/> -->
            <SInput
              label="Model #*"
              v-model="assetObj.modelNumber"
              :error="getFormErrorMessage($v.assetObj.modelNumber)"
            />
            <!-- <SInput
							label="Inventory*"
							v-model="assetObj.inventory"
							:error="getFormErrorMessage($v.assetObj.inventory)"
						/> -->
            <SInput
              label="Manufacturer Name/ID*"
              v-model="assetObj.manufacture"
              :error="getFormErrorMessage($v.assetObj.manufacture)"
            />
            <SDatePicker
              :label="'Purchased Date'"
              v-model="date"
              :border="true"
              class="mt-8"
              @input="purchaseDateHandler(date)"
            />
            <SSelect
              label="Status"
              class="mt-8"
              v-model="assetObj.status"
              :source="assetStatus"
              resultsValue="value"
              resultsDisplay="name"
              :autocomplete="false"
              @selected="onSelected"
              @clear="clearSelectedStatus"
              :key="cateIndex + 'status'"
            />
            <SInput
              v-if="assetObj.cost"
              :label="'Maintenance Cost ' + '(' + currency + ')'"
              v-model="assetObj.cost"
              :readonly="true"
              :error="getFormErrorMessage($v.assetObj.manufacture)"
            />
            <div v-padding="">
              <STextarea
                :columns="70"
                label="Write Asset description here"
                v-model="description"
                :error="getFormErrorMessage($v.description)"
              />
            </div>
            <div></div>
          </div>
        </SAccordion>
        <SAccordion
          v-if="assetID !== undefined"
          :title="'Asset Assignment'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="assetAssignmentAccordion"
          @state="assetAssignmentAccordionFunction"
          class="mt-32"
        >
          <Assignment
            :assignmentHistoryUsers="assignmentHistoryUsers"
            :allUsers="Users"
            :assetObj="assetObj"
            @unassigned="unAssignAsset"
            @editAssigned="editAssigned"
            @openPopUp="showAssignPopUp"
            :assignedUsers="assignedUsers"
            :userAssigned="userAssigned"
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
          :title="'Additional Details'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="categoryFieldAccordion"
          @state="categoryFieldAccordionFunction"
          class="mt-32"
        >
          <div class="column-grid-2" v-padding="'32px'">
            <div v-if="category === ''">
              <span style="font-weight: 100; font-size: 15px"
                >Kindly select a category to view its category fields.
              </span>
            </div>

            <div
              v-else-if="customCategoryFields.length > 0"
              v-for="(input, k) in customCategoryFields"
              :key="k"
            >
              <!-- text -->
              <div
                v-if="
                  input.elementConfig.type === 'text' &&
                  input.elementConfig.label !== '# of Washes'
                "
              >
                <SInput
                  :label="
                    input.validation
                      ? input.elementConfig.label + '*'
                      : input.elementConfig.label
                  "
                  v-model="input.value"
                  :error="
                    getFormErrorMessage(
                      input.validation
                        ? $v.customCategoryFields.$each[k].value
                        : ''
                    )
                  "
                />
              </div>
              <!-- numeric -->
              <div
                v-if="
                  input.elementConfig.type === 'numeric' &&
                  input.elementConfig.label !== '# of Washes'
                "
              >
                <SInput
                  :label="
                    input.validation
                      ? input.elementConfig.label + '*'
                      : input.elementConfig.label
                  "
                  v-model="input.value"
                  type="number"
                  :error="
                    getFormErrorMessage(
                      input.validation
                        ? $v.customCategoryFields.$each[k].value
                        : ''
                    )
                  "
                />
              </div>
              <!-- boolean -->
              <div
                v-if="
                  input.elementConfig.type === 'boolean' &&
                  input.elementConfig.label !== '# of Washes'
                "
              >
                  <!-- :source="optionsBoolean" -->
                <SSelect
                  :label="
                    input.validation
                      ? input.elementConfig.label + '*'
                      : input.elementConfig.label
                  "
                  v-model="input.value"
                  :source="input.elementConfig.options"
                  resultsValue="label"
                  resultsDisplay="label"
                  :autocomplete="false"
                  :key="selectInput"
                  :error="
                    getFormErrorMessage(
                      input.validation
                        ? $v.customCategoryFields.$each[k].value
                        : ''
                    )
                  "
                />
                <!--  -->
              </div>
              <!-- calender -->
              <div
                v-if="
                  input.elementConfig.type === 'calender' &&
                  input.elementConfig.label !== '# of Washes'
                "
              >
                <!-- timeDateDiv -->
                <div class="">
                  <div class="addlabelVal">
                    <label :for="input.value" class="labelVal">{{
                      input.validation
                        ? input.elementConfig.label + "*" + " Time"
                        : input.elementConfig.label + " Time"
                    }}</label>
                  </div>
                  <input
                    type="datetime-local"
                    :id="input.value"
                    :name="input.value"
                    v-model="input.value"
                    :class="
                      getFormErrorMessage(
                        input.validation
                          ? $v.customCategoryFields.$each[k].value
                          : ''
                      )
                    "
                    :error="
                      getFormErrorMessage(
                        input.validation
                          ? $v.customCategoryFields.$each[k].value
                          : ''
                      )
                    "
                  />
                </div>
              </div>
              <!-- select -->
              <div
                v-if="
                  input.elementConfig.type === 'select' &&
                  input.elementConfig.label !== '# of Washes'
                "
              >
                <SSelect
                  :label="
                    input.validation
                      ? input.elementConfig.label + '*'
                      : input.elementConfig.label
                  "
                  v-model="input.value"
                  :source="input.elementConfig.options"
                  resultsValue="label"
                  resultsDisplay="label"
                  :autocomplete="false"
                  :key="selectInput"
                  :error="
                    getFormErrorMessage(
                      input.validation
                        ? $v.customCategoryFields.$each[k].value
                        : ''
                    )
                  "
                />
                <!--  -->
              </div>
            </div>
            <div class="" v-else>
              <span
                v-if="customCategoryFields.length === 0"
                style="font-weight: 100; font-size: 15px"
                >No Category Fields for this category.
              </span>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          :title="'Asset Warranty'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="assetWarrantyAccordion"
          @state="assetWarrantyAccordionFunction"
          class="mt-32"
        >
          <div class="column-grid-2" v-padding="'32px'">
            <SSelect
              label="Warranty Unit*"
              v-model="assetObj.warrantyUnit"
              :source="warrantyUnitOption"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="false"
              @clear="clearSelectedWarrantyUnit"
              :key="cateIndex + 'warrantyUnit'"
              :error="getFormErrorMessage($v.assetObj.warrantyUnit)"
            />
            <SInput
              label="Warranty*"
              v-model="assetObj.warranty"
              :error="getFormErrorMessage($v.assetObj.warranty)"
            />
          </div>
        </SAccordion>
        <SAccordion
          :title="'Usages and Consumption'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="usageDescriptionInformationAccordion"
          @state="usageDescriptionInformationAccordionFunction"
          class="mt-32"
        >
          <div class="column-grid-2" v-padding="'16px 32px 20px 32px'">
            <SInput
              label="Primary Usage Unit*"
              v-model="assetObj.primaryUsageUnit"
              :error="getFormErrorMessage($v.assetObj.primaryUsageUnit)"
            />
            <SInput
              label="Secondary Usage Unit*"
              v-model="assetObj.secondaryUsageUnit"
              :error="getFormErrorMessage($v.assetObj.secondaryUsageUnit)"
            />

            <SInput
              label="Consumption Unit*"
              v-model="assetObj.consumptionUnit"
              :error="getFormErrorMessage($v.assetObj.consumptionUnit)"
            />
          </div>
        </SAccordion>
        <SAccordion
          :title="'Attachments'"
          :expandIcon="'arrows'"
          :open="false"
          :padding="'32'"
          ref="attachImageAccordion"
          @state="attachImageAccordionFunction"
          class="mt-32"
        >
          <div
            v-for="(image, index) in imageVoices"
            :key="index + '_image'"
            v-padding="'20px 32px 20px 32px'"
            style="float: left"
          >
            <img
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

          <div class="filePickerRow">
            <div class="Warning-p">
              (Only JPG, JPEG, PNG and PDF formats are allowed)
            </div>
            <SFilePicker
              v-on:input="handleImageFile"
              :ref="'imageFile'"
              v-model="value"
            ></SFilePicker>
          </div>
        </SAccordion>
      </div>
      <div></div>
      <div class="right-column">
        <Sidebar
          :assetObj="assetObj"
          :currency="currency"
          :description="description"
        />
        <SButton
          :dropdown="false"
          rounded
          v-if="assetID == undefined"
          dense
          :title="'Create Asset'"
          @clicked-item="createAsset"
        ></SButton>

        <SButton
          :dropdown="false"
          rounded
          v-if="assetID !== undefined"
          dense
          :title="'Update Asset'"
          @clicked-item="updateAsset"
        ></SButton>
      </div>
    </div>
    <CreateCategory
      v-if="categoryPopUp"
      :cateObject="selectAssetCategory"
      @close="close"
      @addCategory="saveAddCategory"
      @updateCategory="updateAddCategory"
      @showToast="showToast"
    />
    <ImportExportDialog
      v-if="importExportDialog"
      @close="close"
      @export="exportExcel"
      @import="importExcel"
      :success="importSuccess"
      :id="assetID"
    />
    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->

    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      :key="toastFlag"
    />
  </div>
</template>

<script>
import { AssetManagementService } from "../../services/AssetManagementService";
import { WorkOrderService } from "../../services/WorkOrderService";
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import { InspectionService } from "../../services/InspectionService";
import AssignUserPopUp from "./components/AssignUserPopUp";
import Assignment from "./components/Assignment";
import Sidebar from "../assets/components/Sidebar";
import { maxLength, required } from "vuelidate/lib/validators";
import CreateCategory from "../assets/components/CreateCategory";
import moment from "moment";
import { Functions } from "@/shared/Functions";
import UnAssignUserPopUp from "./components/UnAssignUserPopUp";
import ImportExportDialog from "../../components/ImportExportDialog.vue";

import loader from "@/components/Loader.vue";

export default {
  name: "createAsset",

  components: {
    Sidebar,
    CreateCategory,
    Assignment,
    AssignUserPopUp,
    UnAssignUserPopUp,
    ImportExportDialog,
    loader,
  },
  props: {},

  data() {
    return {
      loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      currency: "",
      importExportDialog: false,
      assetObj: {
        id: "",
        name: "",
        quantity: "",
        modelNumber: "",
        assetNumber: "",
        categoryUUID: "",
        inventory: "",
        manufacture: "",
        warranty: "",
        warrantyUnit: "",
        consumptionUnit: "",
        primaryUsageUnit: "",
        secondaryUsageUnit: "",
        purchaseDate: null,
        status: "",
        assetFields: [],
      },
      selectInput: 0,
      ShowUnPopUp: false,
      index: 0,
      popupImage: "",
      imageDialog: false,
      imageVoices: [],
      cateIndex: 0,
      page: 0,
      rowsPerPage: 5,
      assignedUsers: [],
      selectedCategoryId: "",
      disableAddButton: false,
      disableEditButton: true,
      date: "",
      cargoDate: "",
      description: "",
      category: "",
      AssetCategory: [],
      value: "",
      currentUserDetails: "",
      categoryPopUp: false,
      customCategoryFields: [],
      selectAssetCategory: "",
      assetCategoryUUID: "",
      imagePath: [],
      multipartAttachments: [],
      docPath: [],
      ShowPopUp: false,
      warrantyUnitOption: [
        { label: "Years", value: "Years" },
        { label: "Months", value: "Months" },
        { label: "Days", value: "Days" },
      ],
      optionsBoolean: [
        { label: "Yes", value: "No" },
        { label: "NO", value: "No" },
      ],
      indexReminder: 0,
      assetStatus: [
        { name: "Active", value: "Active" },
        { name: "Inactive", value: "Inactive" },
        { name: "Out of Service", value: "OutofService" },
        { name: "Spare", value: "Spare" },
        { name: "Expired / disposed", value: "Expired/disposed" },
        { name: "sold", value: "sold" },
      ],
      valueEditAssign: {},
      assetID: "",
      assignmentHistoryUsers: [],
      Users: [],
      allUsers: [],
      cost: "",
      assignTableValue: "",
      imageVoicesCheck: [],
      importSuccess: false,
      assetData: [],
      userAssigned: true,
      styleButton1: "margin-left:5px;",
      styleButton2: "margin-left:5px; pointer-events: none",
      AddByCateFlag:false,
      assetCateID: ""
    };
  },

  methods: {
    validateDate(date, field) {
      let currentDate = moment().format().split("T");
      currentDate = currentDate[0];
      if (moment(date).isBefore(currentDate)) {
        this[field] = "";
        return this.$showToast(
          "showToast",
          "Please Select Current Date or Future Date.",
          "error"
        );
      }
    },
    purchaseDateHandler(value) {
      let currentDate = moment().format().split("T");
      currentDate = currentDate[0];
      if (moment(currentDate).isBefore(value)) {
        this.date = "";
        this.showToast(
          "You can not select future date as Purchase Date",
          "error"
        );
      } else {
        let purchase_date = moment(value);
        purchase_date = purchase_date.format("YYYY-MM-DDTHH:MM:SSZ");
        this.assetObj.purchaseDate = moment(value).format("DD-MM-YYYY");
        this.cargoDate = purchase_date;
      }
    },

    uploadCSV() {
      this.importExportDialog = true;
    },

    exportExcel() {
      // logic to export Asset file
      this.loaderFlag = true;
      let request = {
        assetExcelData: this.buildExportDataRequest(),
      };
      AssetManagementService.exportExcelFile(request)
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
          this.loaderFlag = false;
          console.log(error);
        });
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
        name: this.assetObj.name,
        category:
          this.selectedCategoryId.display !== undefined
            ? this.selectedCategoryId.display
            : this.selectedCategoryId.name,
        modelNumber: this.assetObj.modelNumber,
        manufacturer: this.assetObj.manufacture,
        purchaseDate:
          this.date !== null && this.date !== ""
            ? moment(this.date, "DD/MM/yyyy hh:mm a").toISOString()
            : null,
        status: this.assetObj.status,
        warrantyUnit: this.assetObj.warrantyUnit,
        warranty: this.assetObj.warranty,
        primaryUsageUnit: this.assetObj.primaryUsageUnit,
        secondaryUsageUnit: this.assetObj.secondaryUsageUnit,
        consumptionUnit: this.assetObj.consumptionUnit,
        description: this.description,
        additionalFields: [],
      };
      this.customCategoryFields.map((field) => {
        request.additionalFields.push({
          fieldLabel: field.elementConfig.label,
          fieldValue: field.value,
        });
      });
      return request;
    },

    importExcel(value) {
      //logic to import Asset file
      if (value.label === "Import") {
        if (value.file !== null && value.file !== "") {
          this.loaderFlag = true;
          let category =
            this.selectedCategoryId.display !== undefined
              ? this.selectedCategoryId.display
              : this.selectedCategoryId.name;
          AssetManagementService.importExcelFile(value.file, category)
            .then((resposne) => {
              if (
                resposne.status === 200 &&
                resposne.data.responseIdentifier === "Success"
              ) {
                this.loaderFlag = false;
                this.assetData = resposne.data.assetExcelData;
                this.importSuccess = true;
              }
            })
            .catch((error) => {
              this.loaderFlag = false;
              console.log(error);
            });
        }
      } else {
        this.assetObj.name = this.assetData.name;
        this.assetObj.modelNumber = this.assetData.modelNumber;
        this.assetObj.manufacture = this.assetData.manufacturer;
        this.assetObj.status = this.assetData.status;
        this.assetObj.warranty = this.assetData.warranty;
        this.assetObj.warrantyUnit = this.assetData.warrantyUnit;
        this.assetObj.primaryUsageUnit = this.assetData.primaryUsageUnit;
        this.assetObj.secondaryUsageUnit = this.assetData.secondaryUsageUnit;
        this.assetObj.consumptionUnit = this.assetData.consumptionUnit;
        this.description = this.assetData.description;
        this.date = moment(this.assetData.purchaseDate).format("DD-MMM-YYYY");
        this.cargoDate = this.assetData.purchaseDate;
        let findCategory = this.AssetCategory.find(
          (category) => category.name === this.assetData.category
        );
        if (
          findCategory !== undefined &&
          findCategory !== null &&
          findCategory !== ""
        ) {
          this.selectAssetCategory = findCategory;
          this.selectedCategoryId = findCategory;
          this.category = findCategory.name;
          this.cateIndex++;
        }
        this.customCategoryFields.map((field) => {
          let foundField = this.assetData.additionalFields.find(
            (f) => f.fieldLabel === field.elementConfig.label
          );
          if (
            foundField !== undefined &&
            foundField !== null &&
            foundField !== ""
          ) {
            if (field.elementType === "input") {
              field.value = foundField.fieldValue;
            } else if (field.elementType === "select") {
              let options = field.elementConfig.options;
              let value = options.find(
                (v) =>
                  v.label.trim() === foundField.fieldValue.toLowerCase().trim()
              );
              if (value !== undefined && value !== null && value !== "") {
                field.value = foundField.fieldValue;
              }
            }
          }
        });
        this.selectInput++;
        this.importExportDialog = false;
        this.importSuccess = false;
      }
    },

    getAssetDetails() {
      this.loaderFlag = true;
      AssetManagementService.getAsset(this.assetID).then((response) => {
        this.imageVoicesCheck = response.data.asset.assetImages;
        this.assetObj.id = response.data.asset.id;
        this.assetObj.name = response.data.asset.name;
        this.assetObj.assetNumber = response.data.asset.assetNumber;
        document.title = this.assetObj.assetNumber + " | " + "Erohal";
        this.assetObj.modelNumber = response.data.asset.modelNumber;
        this.assetObj.inventory = response.data.asset.inventory;
        this.assetObj.manufacture = response.data.asset.manufacture;
        this.assetObj.status = response.data.asset.status;
        this.assetCategoryUUID = response.data.asset.categoryUUID;
        this.assetObj.warranty = response.data.asset.warranty.split(" ")[0];
        this.assetObj.warrantyUnit = response.data.asset.warranty.split(" ")[1];
        this.description = response.data.asset.description;
        this.assetObj.consumptionUnit = response.data.asset.consumptionUnit;
        this.assetObj.primaryUsageUnit = response.data.asset.primaryUsageUnit;
        this.assetObj.secondaryUsageUnit =
          response.data.asset.secondaryUsageUnit;
        this.date = moment(response.data.asset.purchaseDate).format(
          "DD-MMM-YYYY"
        );
        this.assetObj.purchaseDate = moment(
          response.data.asset.purchaseDate
        ).format("DD-MM-YYYY");
        this.assetObj.cost = this.cost;
        this.assetObj.assetFields = response.data.asset.assetFields;
        if (this.asssetCategoryUUID !== "") {
          for (let index = 0; index < this.AssetCategory.length; index++) {
            if (this.assetCategoryUUID === this.AssetCategory[index].uuid) {
              this.selectAssetCategory = this.AssetCategory[index];
              this.selectedCategoryId = this.AssetCategory[index];
              this.category = this.AssetCategory[index].name;
              this.cateIndex++;
              this.disableAddButton = true;
              this.disableEditButton = false;
            }
          }
        }
        this.getAssignedUsersOfAsset();
        this.getAssignmentHistoryByAsset();

        let categoryAssetFields = [];
        if (response.data.fieldTemplate != null) {
          if (response.data.fieldTemplate.fields != null) {
            for (
              let index = 0;
              index < response.data.fieldTemplate.fields.length;
              index++
            ) {
              if (response.data.fieldTemplate.fields[index].type === "text") {
                let field = response.data.fieldTemplate.fields[index];
                let categoryField = {
                  id: field.uuid,
                  elementType: "input",
                  elementConfig: {
                    type: "text",
                    name: field.label,
                    label: field.label,
                  },
                  value: response.data.asset.assetFields[field.uuid]
                    ? this.mapFieldValues(
                        response.data.asset.assetFields[field.uuid].fieldValue
                      )
                    : "No value found",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                response.data.fieldTemplate.fields[index].type === "select"
              ) {
                let field = response.data.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "select",
                  elementConfig: {
                    type: "select",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: response.data.asset.assetFields[field.uuid]
                    ? this.mapFieldValues(
                        response.data.asset.assetFields[field.uuid].fieldValue
                      )
                    : "No value found",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                response.data.fieldTemplate.fields[index].type === "boolean"
              ) {
                let field = response.data.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "boolean",
                  elementConfig: {
                    type: "boolean",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: response.data.asset.assetFields[field.uuid]
                    ? this.mapFieldValues(
                        response.data.asset.assetFields[field.uuid].fieldValue
                      )
                    : "No value found",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                response.data.fieldTemplate.fields[index].type === "calender"
              ) {
                let field = response.data.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "calender",
                  elementConfig: {
                    type: "calender",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: response.data.asset.assetFields[field.uuid]
                    ? this.mapFieldValues(
                        response.data.asset.assetFields[field.uuid].fieldValue
                      )
                    : "No value found",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                response.data.fieldTemplate.fields[index].type === "calender"
              ) {
                let field = response.data.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "calender",
                  elementConfig: {
                    type: "calender",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: response.data.asset.assetFields[field.uuid]
                    ? this.mapFieldValues(
                        response.data.asset.assetFields[field.uuid].fieldValue
                      )
                    : "No value found",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                response.data.fieldTemplate.fields[index].type === "numeric"
              ) {
                let field = response.data.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "numeric",
                  elementConfig: {
                    type: "numeric",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: response.data.asset.assetFields[field.uuid]
                    ? this.mapFieldValues(
                        response.data.asset.assetFields[field.uuid].fieldValue
                      )
                    : "No value found",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              }
            }
            if (categoryAssetFields.length !== 0) {
              for (let index = 0; index < categoryAssetFields.length; index++) {
                if (
                  categoryAssetFields[index].elementConfig.label.includes(
                    "Dimension"
                  )
                ) {
                  categoryAssetFields[index].value = this.dimensions;
                }
              }
            }
          }
        }
        this.categoryFieldsReserve = categoryAssetFields;
        this.customCategoryFields = categoryAssetFields.filter(
          (fields) => fields.elementConfig.label !== "# of Washes"
        );
        this.loaderFlag = false;
      });
    },

    mapFieldValues(fieldValue) {
      let value = "No value found";
      if (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== ""
      ) {
        value = JSON.parse(fieldValue).values[0];
      }
      return value;
    },

    getCurrency() {
      let currentUserDetails = JSON.parse(
        localStorage.getItem("currentUserDetails")
      );
      AssetPersonnelService.getCompanyCurrency(
        currentUserDetails.profile.organizationId
      ).then((response) => {
        this.currency = response.data.currency;
      });
    },

    deleteAssetImage(id) {
      AssetManagementService.deleteAssetImage(id)
        .then((res) => {
          if (res) {
            this.getAssetImages();
            this.showToast("Images deleted successfully", "success");
          }
        })
        .catch((e) => {
          this.showToast(e.data.description, "error");
        });
    },

    editAssigned(index, val) {
      this.ShowPopUp = true;
      this.valueEditAssign = val;
      this.index++;
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

    updateAssignUser(value) {
      this.loaderFlag = true;
      var selectedDate = moment(value.assignmentDate).format(
        "YYYY-MM-DDTHH:MM:SSZ"
      );
      var dateSplit = selectedDate.split("T");
      var objDate = dateSplit[0];
      var timeSplit = value.assignmentTime.split(":");
      var hour = timeSplit[0];
      var mints = timeSplit[1];
      let assignmentDate =
        objDate + "T" + hour + ":" + mints + ":" + "00+05:00";
      value.startDate = assignmentDate;
      this.updateCurrentAssignment(value);
    },

    updateCurrentAssignment(value) {
      if (value.user.length > 1) {
        this.showToast("Select only one user", "error");
        return;
      }

      InspectionService.getInspectionTempaltesByAsset(this.assetID)
        .then((response) => {
          if (response.status == 200) {
            let UpdateAssetAssignmentRequest = {
              assignmentId: value.assignmentId,
              assetId: this.assetID,
              userId: value.user[0].uuid,
            };
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
                  this.showToast("User Update successfully", "success");
                  this.getAssignedUsersOfAsset();
                  this.ShowPopUp = false;
                  this.loaderFlag = false;
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

    createAsset() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }
      this.loaderFlag = true;
      let assetObj = {
        categoryId:
          this.selectedCategoryId.value !== undefined
            ? this.selectedCategoryId.value
            : this.selectedCategoryId.uuid,
        images: [],
        documents: [],
        asset: {
          //	id:this.assetObj.id,
          tenantUUID: "",
          description: this.description,
          name: this.assetObj.name,
          status: this.assetObj.status,
          //	quantity: this.assetObj.quantity,
          modelNumber: this.assetObj.modelNumber,
          //	inventory: this.assetObj.inventory,
          manufacture: this.assetObj.manufacture,
          purchaseDate: this.cargoDate,
          warranty: this.assetObj.warranty + " " + this.assetObj.warrantyUnit,
          consumptionUnit: this.assetObj.consumptionUnit,
          primaryUsageUnit: this.assetObj.primaryUsageUnit,
          secondaryUsageUnit: this.assetObj.secondaryUsageUnit,
          assetFields: [],
          assetImages: [],
          attachments: [],
        },
      };

      let assetFields = [];

      if (this.customCategoryFields.length !== 0) {
        for (let index = 0; index < this.customCategoryFields.length; index++) {
          let assetField = {};
          assetField.fieldTemplateId =
            this.selectAssetCategory.fieldTemplate.uuid;
          assetField.fieldId = this.customCategoryFields[index].id;
          assetField.fieldValue =
            '{"values":["' + this.customCategoryFields[index].value + '"]}';
          assetFields.push(assetField);
        }
      }
      (assetObj.asset.tenantUUID =
        this.selectAssetCategory.tenantUUID == undefined
          ? this.selectAssetCategory.tenantuuid
          : this.selectAssetCategory.tenantUUID),
        (assetObj.asset.assetFields = assetFields);
      assetObj.asset.assetImages = this.imagePath;
      assetObj.asset.attachments = this.docPath;
      //	return;
      console.log("assetObj", assetObj);
      AssetManagementService.addAsset(assetObj)
        .then((response) => {
          this.loaderFlag = false;
          if (response.data.responseIdentifier === "Success") {
            this.$router.push({
              name: "assets",
              params: {
                toastFlag: true,
                toastType: "success",
                toasstMessage: response.data.description,
              },
            });
          } else {
            this.showToast(
              "There was a problem in adding asset. Kindly try again",
              "error"
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast(
              "There was a problem in adding asset. Kindly try again",
              "error"
            );
          }
        });
    },

    updateAsset() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }
      this.loaderFlag = true;
      let assetObj = {
        categoryId: this.selectedCategoryId.uuid,
        images: null,
        documents: null,
        asset: {
          id: this.assetObj.id,
          tenantUUID: "",
          description: this.description,
          name: this.assetObj.name,
          uuid: this.assetID,
          assetNumber: this.assetObj.assetNumber,
          categoryUUID: this.assetObj.categoryUUID,
          status: this.assetObj.status,
          //	quantity: this.assetObj.quantity,
          modelNumber: this.assetObj.modelNumber,
          //	inventory: this.assetObj.inventory,
          manufacture: this.assetObj.manufacture,
          purchaseDate: this.cargoDate,
          warranty: this.assetObj.warranty + " " + this.assetObj.warrantyUnit,
          consumptionUnit: this.assetObj.consumptionUnit,
          primaryUsageUnit: this.assetObj.primaryUsageUnit,
          secondaryUsageUnit: this.assetObj.secondaryUsageUnit,
          assetFields: [],
          assetImages: [],
          attachments: [],
        },
      };
      let assetFields = [];

      if (this.customCategoryFields.length !== 0) {
        for (let index = 0; index < this.customCategoryFields.length; index++) {
          let assetField = {};
          assetField.id =
            this.assetObj.assetFields[this.customCategoryFields[index].id].id;
          assetField.uuid =
            this.assetObj.assetFields[this.customCategoryFields[index].id].uuid;
          assetField.assetUUID =
            this.assetObj.assetFields[
              this.customCategoryFields[index].id
            ].assetUUID;
          assetField.fieldTemplateId =
            this.selectAssetCategory.fieldTemplate.uuid;
          assetField.fieldId = this.customCategoryFields[index].id;
          assetField.fieldValue =
            '{"values":["' + this.customCategoryFields[index].value + '"]}';
          assetFields.push(assetField);
        }
      }

      // let assetFields = [];
      // for (let index = 0; index < this.customCategoryFields.length; index++) {
      // 	let assetField = {};
      // 	assetField.fieldTemplateId = this.selectAssetCategory.fieldTemplate.uuid;
      // 	assetField.fieldId = this.customCategoryFields[index].id;
      // 	assetField.fieldValue = '{"values":["' + this.customCategoryFields[index].value + '"]}';
      // 	assetFields.push(assetField);
      // }
      (assetObj.asset.tenantUUID = this.selectAssetCategory.tenantUUID),
        (assetObj.asset.assetFields = assetFields);
      assetObj.asset.assetImages = this.imagePath;

      assetObj.asset.attachments = this.docPath;
      // return
      AssetManagementService.editAsset(assetObj)
        .then((response) => {
          this.loaderFlag = false;
          if (response.data.responseIdentifier === "Success") {
            this.$router.push({
              name: "assets",
              params: {
                toastFlag: true,
                toastType: "success",
                toasstMessage: "Asset updated successfully",
              },
            });
          } else {
            this.showToast(
              "There was a problem in adding asset. Kindly try again",
              "error"
            );
          }
        })
        .catch((error) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast(
              "There was a problem in adding asset. Kindly try again",
              "error"
            );
          }
        });
    },

    unassignAsset(index, id) {
      this.userIndex = index;
      AssetPersonnelService.unassignAsset(this.assetID, id)
        .then((response) => {
          if (response.status === 200) {
            // debugger;
            let users = this.assignedUsers;
            let historyUsers = this.assignmentHistoryUsers;
            let historyAdded = false;
            //	this.deleteModel = false;
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
          } else {
            this.showToast(
              "Error while Un-Assigning the user. Please try again",
              "error"
            );
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

    assignUser(value) {
      this.loaderFlag = true;
      if (this.value !== null) {
        var selectedDate = moment(value.assignmentDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        var dateSplit = selectedDate.split("T");
        var objDate = dateSplit[0];
        var timeSplit = value.assignmentTime.split(":");
        var hour = timeSplit[0];
        var mints = timeSplit[1];
        let assignmentDate =
          objDate + "T" + hour + ":" + mints + ":" + "00+05:00";

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

    pastAssignmentUserCurrentDate(value) {
      InspectionService.getInspectionTempaltesByAsset(this.assetID)
        .then((response) => {
          if (response.status === 200) {
            //	debugger
            let assignmentRecord = [];
            for (let index = 0; index < value.user.length; index++) {
              const userId = value.user[index].uuid;
              let obj = {
                assetId: this.assetID,
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
            AssetPersonnelService.addAssignmentRecord(addAssetAssignmentRequest)
              .then((response1) => {
                if (response1.status === 200) {
                  this.sendNotificationToAssignedUserOfAssets(
                    addAssetAssignmentRequest
                  );
                  let userdetail = [];
                  AssetPersonnelService.getUserDetailByAssetIdAndUserId(
                    this.assetID,
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

    unAssignUser(value) {
      this.loaderFlag = true;
      var currentDate = moment().format();
      var selectedDate = moment(value.assignmentDate).format(
        "YYYY-MM-DDTHH:MM:SSZ"
      );
      var dateSplit = selectedDate.split("T");
      var objDate = dateSplit[0];
      var timeSplit = value.assignmentTime.split(":");
      var hour = timeSplit[0];
      var mints = timeSplit[1];
      var assignmentDate =
        objDate + "T" + hour + ":" + mints + ":" + "00+05:00";
      if (
        Date.parse(this.assignTableValue.startDate) > Date.parse(assignmentDate)
      ) {
        this.showToast(
          "Select Date and time later to current assignment date and time.",
          "error"
        );
        this.loaderFlag = false;
        return;
      }
      if (value.currentDateTime == true) {
        let DeleteAssignmentRecordRequest = {
          assetUUID: this.assetID,
          userUUID: value.uuid,
          endingDate: currentDate,
        };
        AssetPersonnelService.unassignAsset(DeleteAssignmentRecordRequest).then(
          (response) => {
            if (response.status === 200) {
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
            this.useras;
          }
        );
      } else if (
        value.currentDateTime == false &&
        currentDate > moment(assignmentDate).format()
      ) {
        selectedDate = moment(value.assignmentDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        dateSplit = selectedDate.split("T");
        objDate = dateSplit[0];
        timeSplit = value.assignmentTime.split(":");
        hour = timeSplit[0];
        mints = timeSplit[1];
        let assignmentDate =
          objDate + "T" + hour + ":" + mints + ":" + "00+05:00";
        let DeleteAssignmentRecordRequest = {
          assetUUID: this.assetID,
          userUUID: value.uuid,
          endingDate: moment(assignmentDate).format(),
        };
        //	return;
        AssetPersonnelService.unassignAsset(DeleteAssignmentRecordRequest).then(
          (response) => {
            if (response.status === 200) {
            }
            let users = this.assignedUsers;
            let historyUsers = this.assignmentHistoryUsers;
            let historyAdded = false;
            //return;
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
            this.useras;
          }
        );
      } else if (
        currentDate < moment(assignmentDate).format() &&
        value.currentDateTime == false
      ) {
        selectedDate = moment(value.assignmentDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        dateSplit = selectedDate.split("T");
        objDate = dateSplit[0];
        timeSplit = value.assignmentTime.split(":");
        hour = timeSplit[0];
        mints = timeSplit[1];
        let assignmentDate =
          objDate + "T" + hour + ":" + mints + ":" + "00+05:00";
        value.startDate = assignmentDate;
        this.unAssignmentUserLater(value);
      }
    },

    unAssignmentUserLater(value) {
      InspectionService.getInspectionTempaltesByAsset(this.assetID)
        .then((response) => {
          if (response.status === 200) {
            let postAssignment = [];
            let obj = {
              assignmentUUID: value.assignmentUUID,
              assetId: this.assetID,
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
                this.loaderFlag = false;
                this.getAssignedUsersOfAsset();
                this.getAssignmentHistoryByAsset();
              })
              .catch((e) => {
                console.log(e);
                this.loaderFlag = false;
              });
          }
        })
        .catch((e) => {
          console.log("error", e);
          this.loaderFlag = false;
        });
    },

    assignmentUserLater(value) {
      InspectionService.getInspectionTempaltesByAsset(this.assetID)
        .then((response) => {
          if (response.status === 200) {
            let postAssignment = [];
            for (let index = 0; index < value.user.length; index++) {
              const userId = value.user[index].uuid;
              let obj = {
                assignmentUUID: "",
                assetId: this.assetID,
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
            AssetPersonnelService.addPostAssignmentOrUnAssignment(
              UpdateAssetAssignmentRequest
            )
              .then((res) => {
                this.showToast(res.data.description, "success");
                this.ShowPopUp = false;
                this.getAssignedUsersOfAsset();
                this.loaderFlag = false;
              })
              .catch((e) => {
                console.log(e);
                this.loaderFlag = false;
              });
          }
        })
        .catch((e) => {
          console.log("error", e);
          this.loaderFlag = false;
        });
    },

    sendNotificationToAssignedUserOfAssets(addAssetAssignmentRequest) {
      AssetPersonnelService.sendNotificationToAssignedUsers(
        addAssetAssignmentRequest
      )
        .then((response) => {
          if (response.status === 200) {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    assignmentUserCurrentDate(value) {
      InspectionService.getInspectionTempaltesByAsset(this.assetID)
        .then((response) => {
          var currentDate = moment().format();
          if (response.status === 200) {
            let assignmentRecord = [];
            for (let index = 0; index < value.user.length; index++) {
              const userId = value.user[index].uuid;
              let obj = {
                assetId: this.assetID,
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

    getAssignmentHistoryByAsset() {
      AssetPersonnelService.getAssignmentHistoryByAsset(
        this.assetID,
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
              obj.status = response.data.details[index].status;
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

    futuredUnAssignment(uuid) {
      AssetPersonnelService.deletePostAssignmentByUUID(uuid)
        .then((res) => {
          this.showToast(res.data.description, "success");
          this.getAssignedUsersOfAsset();
        })
        .catch((e) => {
          this.showToast(e.data.description, "error");
        });
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
          this.showToast("An error occurred while fetching the users", "error");
        });
    },

    showAssignPopUp() {
      this.ShowPopUp = true;
    },

    openPopUp() {
      this.categoryPopUp = true;
    },

    close() {
      this.categoryPopUp = false;
      this.ShowPopUp = false;
      this.imageDialog = false;
      this.ShowUnPopUp = false;
      this.importExportDialog = false;
      this.importSuccess = false;
    },

    fullscreenImage(value) {
      this.popupImage = value;
      this.imageDialog = true;
    },

    onSelected(value) {
      // console.log("seleted value", value);
    },

    clearSelectedStatus() {
      this.assetObj.status = "";
      this.cateIndex++;
    },

    clearSelectedWarrantyUnit() {
      this.assetObj.warrantyUnit = "";
      this.cateIndex++;
    },

    saveAddCategory(value) {
      this.loaderFlag = true;
      let addCategory = {
        category: {
          name: value.categoryName,
          description: value.messageBox,
          tenantUUID: this.currentUserDetails.profile.organizationId,
          fieldTemplate: {
            type: value.categoryName + " field template",
            tenantUUID: this.currentUserDetails.profile.organizationId,
            fields: [],
          },
        },
      };

      let fields = [];
      for (let index = 0; index < value.categoryFields.length; index++) {
        let addCategoryField = value.categoryFields[index];
        let field = {};
        field.label = addCategoryField.label;
        field.type = addCategoryField.type;
        field.fieldPosition = addCategoryField.position;
        field.mandatory = addCategoryField.mandatory;
        field.options = addCategoryField.options;
        fields.push(field);
      }
      addCategory.category.fieldTemplate.fields = fields;
      AssetManagementService.addCategory(addCategory)
        .then((response) => {
          if (response.data.responseIdentifier === "Success") {
            this.loaderFlag = false;
            this.categoryPopUp = false;
            this.showToast("Category added successfully", "success");
          }
        })
        .catch((error) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast(error.data.description, "error");
          }
        });
    },

    updateAddCategory(value) {
      this.loaderFlag = true;
      let addCategory = {
        category: {
          id: this.selectAssetCategory.id,
          uuid: this.selectAssetCategory.uuid,
          name: value.categoryName,
          description: value.messageBox,
          iconUrl: this.selectAssetCategory.iconUrl,
          tenantUUID: this.currentUserDetails.profile.organizationId,
          inspectionTemplate: this.selectAssetCategory.inspectionTemplate,
          assets: this.selectAssetCategory.assets,
          fieldTemplate: {
            id: this.selectAssetCategory.fieldTemplate.id,
            uuid: this.selectAssetCategory.fieldTemplate.uuid,
            type: value.categoryName + " field template",
            tenantUUID: this.currentUserDetails.profile.organizationId,
            fields: [],
            private: this.selectAssetCategory.fieldTemplate.private,
          },
        },
      };

      let fields = [];
      for (let index = 0; index < value.categoryFields.length; index++) {
        let addCategoryField = value.categoryFields[index];
        let field = {};
        field.label = addCategoryField.label;
        field.fieldMetadata = "";
        field.type = addCategoryField.type;
        field.fieldPosition = addCategoryField.position;
        field.fieldTemplateUUID = this.selectAssetCategory.fieldTemplate.uuid;
        field.mandatory = addCategoryField.mandatory;
        field.options = addCategoryField.options;
        field.iconUrl = "";
        fields.push(field);
      }
      addCategory.category.fieldTemplate.fields = fields;
      
      
      // console.log('addCategory-old',addCategory)
      // debugger
      AssetManagementService.editCategory(addCategory)
        .then((response) => {
          if (response.data.responseIdentifier === "Success") {
            this.loaderFlag = false;
            this.categoryPopUp = false;
            this.showToast("Category updated successfully", "success");
          }
        })
        .catch((error) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast(error.data.description, "error");
          }
        });
    },

    EditCategory() {
      if (this.selectAssetCategory == "") {
        this.showToast("Please Select Category.", "error");
        return;
      }
      this.categoryPopUp = true;
    },

    selectAssetCate(value) {
      this.disableAddButton = true;
      this.disableEditButton = false;
      this.selectedCategoryId = value;
      this.$refs.categoryFieldAccordion.openFlag = true;
      if (value === null) {
      } else {
        this.selectAssetCategory = value.selectedObject;
        if (value.selectedObject.fieldTemplate != null) {
          if (value.selectedObject.fieldTemplate.fields != null) {
            value.selectedObject.fieldTemplate.fields.sort((a, b) => {
              return a.fieldPosition - b.fieldPosition;
            });
          }
        }
        let categoryAssetFields = [];
        if (value.selectedObject.fieldTemplate != null) {
          if (value.selectedObject.fieldTemplate.fields != null) {
            for (
              let index = 0;
              index < value.selectedObject.fieldTemplate.fields.length;
              index++
            ) {
              if (
                value.selectedObject.fieldTemplate.fields[index].type === "text"
              ) {
                let field = value.selectedObject.fieldTemplate.fields[index];
                let categoryField = {
                  id: field.uuid,
                  elementType: "input",
                  elementConfig: {
                    type: "text",
                    name: field.label,
                    label: field.label,
                  },
                  value: "",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                value.selectedObject.fieldTemplate.fields[index].type ===
                "select"
              ) {
                let field = value.selectedObject.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "select",
                  elementConfig: {
                    type: "select",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: "",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                value.selectedObject.fieldTemplate.fields[index].type ===
                "numeric"
              ) {
                let field = value.selectedObject.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "numeric",
                  elementConfig: {
                    type: "numeric",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: "",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                value.selectedObject.fieldTemplate.fields[index].type ===
                "boolean"
              ) {
                let field = value.selectedObject.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                options.push({ label: option[0] });
                options.push({ label: option[1] });
                // for (let index = 0; index < option.length; index++) {
                //   options.push({ label: option[index] });
                // }
                let categoryField = {
                  id: field.uuid,
                  elementType: "boolean",
                  elementConfig: {
                    type: "boolean",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: "",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              } else if (
                value.selectedObject.fieldTemplate.fields[index].type ===
                "calender"
              ) {
                let field = value.selectedObject.fieldTemplate.fields[index];
                let option = field.options.split(",");
                let options = [];
                for (let index = 0; index < option.length; index++) {
                  options.push({ label: option[index] });
                }
                let categoryField = {
                  id: field.uuid,
                  elementType: "calender",
                  elementConfig: {
                    type: "calender",
                    name: field.label,
                    label: field.label,
                    options: options,
                  },
                  value: "",
                  valid: true,
                  touched: false,
                };
                if (field.mandatory) {
                  categoryField.validation = true;
                } else {
                  categoryField.validation = false;
                }
                categoryAssetFields.push(categoryField);
              }
            }
            if (categoryAssetFields.length !== 0) {
              for (let index = 0; index < categoryAssetFields.length; index++) {
                if (
                  categoryAssetFields[index].elementConfig.label.includes(
                    "Dimension"
                  )
                ) {
                  categoryAssetFields[index].value = this.dimensions;
                }
              }
            }
          }
        }
        this.categoryFieldsReserve = categoryAssetFields;
        this.customCategoryFields = categoryAssetFields.filter(
          (fields) => fields.elementConfig.label !== "# of Washes"
        );
      }
    },

    clearSelectedAssetCate() {
      this.category = "";
      this.customCategoryFields = [];
      this.selectedCategoryId = null;
      this.selectAssetCategory = "";
      this.cateIndex++;
      this.disableAddButton = false;
      this.disableEditButton = true;
    },

    assetInformationAccordionFunction(val) {
      if (this.$refs.assetInformationAccordion.openFlag === true) {
        this.$refs.categoryFieldAccordion.openFlag = false;
        this.$refs.assetWarrantyAccordion.openFlag = false;
        this.$refs.usageDescriptionInformationAccordion.openFlag = false;
        this.$refs.attachImageAccordion.openFlag = false;
        this.$refs.assetAssignmentAccordion.openFlag === false;
      }
    },

    assetAssignmentAccordionFunction(val) {
      if (this.$refs.assetAssignmentAccordion.openFlag === true) {
        this.$refs.categoryFieldAccordion.openFlag = false;
        this.$refs.assetWarrantyAccordion.openFlag = false;
        this.$refs.usageDescriptionInformationAccordion.openFlag = false;
        this.$refs.attachImageAccordion.openFlag = false;
        this.$refs.assetInformationAccordion.openFlag === false;
      }
    },

    categoryFieldAccordionFunction(val) {
      if (this.$refs.categoryFieldAccordion.openFlag === true) {
        this.$refs.assetInformationAccordion.openFlag = false;
        this.$refs.assetWarrantyAccordion.openFlag = false;
        this.$refs.usageDescriptionInformationAccordion.openFlag = false;
        this.$refs.attachImageAccordion.openFlag = false;
        this.$refs.assetAssignmentAccordion.openFlag === false;
      }
    },

    assetWarrantyAccordionFunction(val) {
      if (this.$refs.assetWarrantyAccordion.openFlag === true) {
        this.$refs.categoryFieldAccordion.openFlag = false;
        this.$refs.assetInformationAccordion.openFlag = false;
        this.$refs.usageDescriptionInformationAccordion.openFlag = false;
        this.$refs.attachImageAccordion.openFlag = false;
      }
    },

    usageDescriptionInformationAccordionFunction(val) {
      if (this.$refs.usageDescriptionInformationAccordion.openFlag === true) {
        this.$refs.categoryFieldAccordion.openFlag = false;
        this.$refs.assetWarrantyAccordion.openFlag = false;
        this.$refs.assetInformationAccordion.openFlag = false;
        this.$refs.attachImageAccordion.openFlag = false;
      }
    },

    attachImageAccordionFunction(val) {
      if (this.$refs.attachImageAccordion.openFlag === true) {
        this.$refs.categoryFieldAccordion.openFlag = false;
        this.$refs.assetWarrantyAccordion.openFlag = false;
        this.$refs.assetInformationAccordion.openFlag = false;
        this.$refs.usageDescriptionInformationAccordion.openFlag = false;
        if (this.imageVoicesCheck.length > 0) {
          this.getAssetImages();
        }
      }
    },

    getAssetImages() {
      AssetManagementService.getAssetImagesByUuid(this.assetID)
        .then((response) => {
          this.loaderFlag = false;
          if (response.status === 200) {
            this.imageVoices = response.data.assetImages;
          }
        })
        .catch((error) => {
          this.showToast(
            "An Error Occurred while getting Asset Images.",
            "error"
          );
        });
    },

    buildImageArray(file) {
      this.multipartAttachments.push({
        fileName: file.name,
        file: file,
        type: file.name,
      });
    },

    handleImageFile(value) {
      this.imagePath = [];
      this.loaderFlag = true;
      if (value) {
        this.buildImageArray(value);
        var extVideo = this.value.name.split(".").pop();
        if (extVideo === "mp4" || extVideo === "webm") {
          this.showToast("Video upload not supported.", "warning");
          this.loaderFlag = false;
        } else {
          AssetManagementService.uploadFileTos3(this.value)
            .then((response) => {
              if (response.data.responseIdentifier === "Success") {
                var ext = response.data.fileName.split(".").pop();
                if (ext === "jpeg" || ext === "png" || ext === "jpg") {
                  let obj = {};
                  (obj.id = this.assetObj.id),
                    (obj.assetUUID = this.assetID),
                    (obj.imageUrl = response.data.fileUrl);
                  obj.imageFlag = true;
                  this.imagePath.push(obj);
                } else if (ext === "pdf") {
                  let obj = {};
                  (obj.id = this.assetObj.id),
                    (obj.assetUUID = this.assetID),
                    (obj.contentUrl = response.data.fileUrl);
                  obj.fileName = response.data.fileName;
                  this.docPath.push(obj);
                }
              }
              this.showToast(
                ext === "jpeg" || ext === "png" || ext === "jpg"
                  ? "Image added Successfully."
                  : "Document added Successfully.",
                "success"
              );
              this.loaderFlag = false;
            })
            .catch((error) => {
              if (error.response.status === 406) {
                this.showToast(
                  "An error occurred while adding Image or file",
                  "error"
                );
                this.loaderFlag = false;
              }
            });
        }
      }
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    getAssignedUsersOfAsset() {
      AssetPersonnelService.getAssignedUsersOfAsset(this.assetID)
        .then((response1) => {
          if (response1.status === 200) {
            if (response1.data.details.length > 0) {
              this.userAssigned = false;
            }
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
            this.showToast("An unexpected Error Occurred", "error");
          }
        });
    },

    titleFunction() {
      if (this.assetID == undefined) {
        document.title = this.$route.meta.title;
      } else {
        document.title = "Erohal - Edit Asset";
      }
    },

    getMaintainanceCost(assetId) {
      {
        WorkOrderService.getAssetMaintenanceCostByAssetUUID(assetId)
          .then((res) => {
            this.cost = res.data.maintenanceCost;
          })
          .catch((e) => {
            this.showToast("An unexpected Error Occurred", "error");
          });
      }
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  created() {

    this.assetID = this.$route.params.assetID;
    

    this.titleFunction();
    this.getCurrency();
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.selectUser();

    AssetManagementService.getAllAssetCategories(
      this.currentUserDetails.profile.organizationId
    ).then((response) => {
      response.data.categories.sort((category1, category2) => {
        let value = 0; // no change
        if (category1.name < category2.name) {
          value = -1; // 2 before 1
        } else if (category2.name < category1.name) {
          value = 1; // 1 before 2
        }
        return value;
      });
      this.AssetCategory = response.data.categories;
      if (this.assetID !== undefined) {
        this.getAssetDetails();
        this.getMaintainanceCost(this.assetID);
        this.getAssignedUsersOfAsset();
      }


   if (this.$route.name == 'create-asset-by-category'){
      localStorage.setItem("AddByCateFlag",this.$route.params.AddByCateFlag);
      localStorage.setItem("assetCateID",this.$route.params.assetCateID);
      this.AddByCateFlag = localStorage.getItem("AddByCateFlag");
      this.assetCateID = localStorage.getItem("assetCateID");

      if(this.AddByCateFlag){
      if (this.assetCateID !== "") {
          for (let index = 0; index < this.AssetCategory.length; index++) {
            if (this.assetCateID === this.AssetCategory[index].uuid) {
              this.selectAssetCategory = this.AssetCategory[index];
              this.selectedCategoryId = this.AssetCategory[index];
              this.category = this.AssetCategory[index].name;
              this.cateIndex++;
              this.disableAddButton = true;
              this.disableEditButton = false;
              let obj = {
                "display":this.AssetCategory[index].name,
                "selectedObject":this.AssetCategory[index],
                "value":this.AssetCategory[index].uuid
              }

              this.selectAssetCate(obj)
            }
          }
        }

      }
     }
    });
  },

  validations: function () {
    return {
      customCategoryFields: {
        $each: {
          value: { required },
        },
      },
      assetObj: {
        name: { required, maxLength: maxLength(190) },
        modelNumber: { required, maxLength: maxLength(190) },
        manufacture: { required, maxLength: maxLength(190) },
        warranty: { maxLength: maxLength(190) },
        warrantyUnit: { required },
        consumptionUnit: { required, maxLength: maxLength(190) },
        primaryUsageUnit: { required, maxLength: maxLength(190) },
        secondaryUsageUnit: { required, maxLength: maxLength(190) },
        // quantity: { required },
        // inventory: { required },
      },
      category: { required },
      description: { required, maxLength: maxLength(500) },
    };
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
.text-field {
  padding-left: 48px;
  padding-right: 48px;
}
.filePickerRow {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}

.upload-csv {
  div {
    padding-top: 0.5em;
    display: inline-block;
    float: right;
    max-width: 200px;
  }
}
</style>
