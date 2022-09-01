<template>
  <div>
    <SDialog
      v-if="consumption"
      :title="formTitles"
      :persistent="true"
      :width="610"
      @close="close"
    >
      <div style="padding: 24px 30px">
        <div class="heading pb-16">Asset Details</div>
        <div class="column-grid-2">
          <SSelect
            label="Category*"
            v-model="consumption.assetCategory"
            :source="assetCategories"
            resultsValue="name"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onSelectedCategory"
            @clear="clearSelectedCategory"
            :key="keyIndex + 'cate'"
            :error="getFormErrorMessage($v.consumption.assetCategory)"
            :readonly="stateDisable"
          />
          <SSelect
            label="Name*"
            v-model="consumption.assetName"
            :source="assetsNames"
            resultsValue="name"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onSelectedName"
            @clear="clearSelectedAsset"
            :key="keyIndex + 'assetName'"
            :error="getFormErrorMessage($v.consumption.assetName)"
            :readonly="stateDisable"
          />
          <SInput
            label="asset #"
            v-if="formTitles == 'View Consumption'"
            v-model="consumption.assetNumber"
            :readonly="stateDisable"
          />
        </div>

        <div class="separator"></div>

        <div class="heading pb-16">Consumption Details</div>
        <div class="column-grid-2">
          <SInput
            label="consumption value*"
            v-model="consumption.consumptionValue"
            type="number"
            :readonly="editFlag"
            @input="checkFieldValidation('consumptionValue')"
            :error="getFormErrorMessage($v.consumption.consumptionValue)"
          />
          <SInput
            label="consumption unit*"
            v-model="consumption.consumptionUnit"
            readonly
            :error="getFormErrorMessage($v.consumption.consumptionUnit)"
            :key="keyIndex + 'unit'"
          />
          <SInput label="currency" v-model="consumption.currency" readonly />
          <SSelect
            label="consumption level*"
            v-model="consumption.updatedConsumptionPoints"
            :source="ConsumptionPoints"
            resultsValue="name"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onSelectedField"
            @clear="clearSelectedConsumptionLevel"
            :readonly="editFlag"
            :key="keyIndex + 'point'"
            :error="
              getFormErrorMessage($v.consumption.updatedConsumptionPoints)
            "
          />
          <SInput
            label="Price*"
            v-model="consumption.price"
            type="number"
            :readonly="editFlag"
            :key="keyIndex + 'price'"
            @input="checkFieldValidation('price')"
            :error="getFormErrorMessage($v.consumption.price)"
          />
        </div>

        <div class="separator"></div>

        <div class="heading pb-16">Meter Details</div>
        <div class="column-grid-2">
          <SSelect
            label="Meter Type*"
            v-model="consumption.meterType"
            :source="fieldCategories"
            resultsValue="name"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onSelectedFieldCategory"
            @clear="clearSelectedMeterType"
            :readonly="stateDisable"
            :key="keyIndex + 'meterType'"
            :error="getFormErrorMessage($v.consumption.meterType)"
          />
          <SInput
            label="Meter Unit"
            v-model="consumption.usageUnit"
            readonly
            :key="keyIndex + 'meterUnit'"
          />
          <SInput
            label="Meter Reading*"
            v-model="consumption.meterValue"
            :readonly="stateDisable"
            :error="getFormErrorMessage($v.consumption.meterValue)"
          />
        </div>

        <div class="separator"></div>

        <div class="column-grid-1">
          <div>
            <div class="heading bold">Current Location:</div>
            <span
              ><img
                src="/assets/icons/Location.svg"
                alt=""
                width="20px"
                style="cursor: pointer"
                @click="locatorButtonPressed"
            /></span>
          </div>

          <div></div>
          <SMap
            v-if="locationDialog"
            :height="400"
            :markers="markers"
            :animation="false"
            :zoom="16"
          />
        </div>

        <div class="separator"></div>

        <div
          v-if="
            formTitles === 'View Consumption' ||
              formTitles === 'Edit Consumption'
          "
          class="column-grid-1"
        >
          <div
            v-for="(image, index) in this.imageVoices"
            :key="index + '_image'"
            v-padding="'0px 32px 32px 32px'"
            style="float: left"
          >
            <img
              :src="'data:image/png;base64,' + image.content"
              style="width: 100px; height: 100px"
              @click="fullscreenImage(image)"
            />
            <img
              src="/assets/icons/Delete.svg"
              alt=""
              width="20px"
              style="cursor: pointer; margin-left: 10px; margin-bottom: 80px"
              v-if="formTitles === 'Edit Consumption'"
              @click="deleteConsumptionImage(image.id)"
            />
            <SDialog
              title=""
              :width="700"
              :persistent="false"
              :closeIcon="true"
              @close="closeDialog"
              v-show="imageDialog"
            >
              <img
                :src="'data:image/png;base64,' + popupImage.content"
                style="width: 100%; height: auto"
              />
            </SDialog>
          </div>
        </div>
        <div class="separator" v-if="imageVoices.length > 0"></div>
        <div
          v-if="formTitles === 'Add Consumption'"
          class="mt-24 column-grid-1"
        >
          <SFilePicker v-on:input="receiveImage" v-model="fileRecord" />
        </div>

        <SButton
          v-if="formTitles === 'Add Consumption'"
          class="dialog-btn"
          title="Add Consumption"
          @click="addConsumption"
        />
        <SButton
          v-if="formTitles === 'Edit Consumption'"
          class="dialog-btn"
          title="Update Consumption"
          @click="updateConsumption"
        />
      </div>
    </SDialog>
    <SDialog
      title="Location Map"
      :width="700"
      :persistent="false"
      :closeIcon="false"
      @close="closeDialog"
      v-show="locationDialog"
    >
      <SMap
        v-if="locationDialog"
        :height="400"
        :markers="markers"
        :animation="false"
        :zoom="16"
      />
    </SDialog>

    <!-- Loader Compnent  -->
    <loader v-if="loaderFlag" />
    <!-- Loader Compnent  -->

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
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import { required, minValue } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";

import loader from "@/components/Loader.vue";
export default {
  name: "ViewConsumption",
  data() {
    return {
      editFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      consumption: {
        meterType: "",
      },
      stateDisable: false,
      currentUserDetails: "",
      assetCategories: "",
      assetCategory: "",
      assetCategoryLabel: "",
      assetsNames: [],
      totalAssetNames: "",
      fileRecord: null,
      assetName: "",
      assetNameLabel: "",
      assetUUID: "",
      imageVoices: [],
      keyIndex: 0,
      fieldCategoryLabel: "",
      markers: [],
      popupImage: "",
      imageDialog: false,
      locationDialog: false,
      fieldCategories: [
        { name: "Primary", value: "1" },
        { name: "Secondary", value: "2" },
      ],
      lat: "",
      lang: "",
      primaryUsageUnit: "",
      secondaryUsageUnit: "",
      ConsumptionPoints: [
        { name: "0", value: "0" },
        { name: "1", value: "1" },
        { name: "2", value: "2" },
        { name: "3", value: "3" },
        { name: "4", value: "4" },
        { name: "5", value: "5" },
        { name: "6", value: "6" },
        { name: "7", value: "7" },
        { name: "8", value: "8" },
        // { name: "9", value: "9" },
        // { name: "10", value: "10" },
      ],
      view:false,
    };
  },
  props: {
    id: {},
    readOnly: Boolean,
    formTitles: String,
  },
  methods: {
    checkFieldValidation(field) {
      this.$v.consumption[field].$touch();
    },
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation && fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    close() {
      this.$emit("close");
    },
    fullscreenImage(value) {
      this.popupImage = value;
      this.imageDialog = true;
    },
    deleteConsumptionImage(uuid) {
      AssetManagementService.deleteConsumptionImage(uuid)
        .then((res) => {
          if (res.status === 200) {
            this.showToast("Image removed successfully.", "success");
            this.viewConsumption();
          }
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
        });
    },

    closeDialog() {
      this.locationDialog = false;
      this.imageDialog = false;
    },
    addConsumption() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields.", "warning");
        return;
      }
      if (this.fileRecord === null) {
        this.showToast("Please select an image", "error");
        return;
      }
      let obj = {};
      let consumption = {
        consumptionValue: this.consumption.consumptionValue,
        price: this.consumption.price,
        currency: this.consumption.currency,
        updatedConsumptionPoints: this.consumption.updatedConsumptionPoints,
        meterType: this.consumption.meterType,
        meterValue: this.consumption.meterValue,
        lat: this.lat,
        lng: this.long,
        tenantUUID: this.currentUserDetails.profile.organizationId,
        assetUUID: this.assetUUID,
      };

      obj.consumption = consumption;
      obj.imageVoices = this.imageVoices;
      obj.assetUUID = this.assetUUID;
      obj.userUUID = this.currentUserDetails.profile.userid;
      AssetManagementService.addConsumption(obj)
        .then((res) => {
          this.$emit("toastFlag", res.data.description, "success");
          this.close();
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
          this.loaderFlag = false;
        });
    },
    updateConsumption() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields.", "warning");
        return;
      }
      this.loaderFlag = true;
      let consumption = {
        uuid: this.consumption.uuid,
        consumptionValue: this.consumption.consumptionValue,
        price: this.consumption.price,
        currency: this.consumption.currency,
        updatedConsumptionPoints: this.consumption.updatedConsumptionPoints,
        // meterType: this.consumption.meterType,
        // meterValue: this.consumption.meterValue,
        // lat: this.lat,
        // lng: this.long,
        // tenantUUID: this.currentUserDetails.profile.organizationId,
        // assetUUID: this.assetUUID,
      };

      // return
      AssetManagementService.editConsumption(consumption)
        .then((res) => {
          this.$emit("toastFlag", res.data.description, "success");
          this.loaderFlag = false;
          this.close();
        })
        .catch((e) => {
          this.showToast(e.data.response, "error");
          this.loaderFlag = false;
        });
    },
    locatorButtonPressed() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          if (position && !this.view) {
            this.markers.push({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              type: "office",
            });
          }
          this.locationDialog = true;
        },
        (error) => {
          console.log(error.response);
        }
      );
    },
    onSelectedField() {},
    clearSelectedConsumptionLevel() {
      this.consumption.updatedConsumptionPoints = "";
      this.keyIndex++;
    },
    receiveImage(file) {
      this.loaderFlag = true;
      AssetManagementService.uploadFileTos3(this.fileRecord)
        .then((res) => {
          if (res.data.responseIdentifier === "Success") {
            let imageVoice = {
              contentUrl: res.data.fileUrl,
            };
            this.imageVoices = [];
            this.imageVoices.push(imageVoice);
            this.showToast("Image added successfully");
            this.loaderFlag = false;
          }
        })
        .catch((e) => {
          this.showToast("Please upload the image again", "error");
          this.loaderFlag = false;
        });
    },

    onSelectedCategory(value) {
      this.assetsNames = [];
      this.assetCategory = value.selectedObject;
      for (let index = 0; index < this.totalAssetNames.length; index++) {
        if (
          this.totalAssetNames[index].categoryUUID === this.assetCategory.uuid
        ) {
          this.assetsNames.push(this.totalAssetNames[index]);
        }
      }
    },
    clearSelectedCategory() {
      this.consumption.assetCategory = "";
      this.assetsNames = [];
      this.consumption.assetName = "";
      this.keyIndex++;
    },

    onSelectedFieldCategory(value) {
      this.consumption.meterType = value.selectedObject.value;
      if (value.selectedObject.value === "1") {
        this.consumption.usageUnit = this.primaryUsageUnit;
        this.keyIndex++;
      } else if (value.selectedObject.value === "2") {
        this.consumption.usageUnit = this.secondaryUsageUnit;
        this.keyIndex++;
      }
      //  this.keyIndex++;
      //   this.fieldCategory = value.selectedObject;
    },
    clearSelectedMeterType() {
      this.consumption.meterType = "";
      this.consumption.usageUnit = "";
      this.fieldCategory = {};
      this.keyIndex++;
    },

    onSelectedName(value) {
      AssetManagementService.getAsset(value.selectedObject.uuid)
        .then((res) => {
          let asset = res.data.asset;
          this.consumption.consumptionUnit = asset.consumptionUnit;
          this.consumption.updatedConsumptionPoints = asset.consumptionPoints.toString();
          this.assetUUID = value.selectedObject.uuid;
          this.primaryUsageUnit = asset.primaryUsageUnit;
          this.secondaryUsageUnit = asset.secondaryUsageUnit;
          this.keyIndex++;
        })
        .catch((e) => {
          console.log(e);
        });
      this.assetNameLabel = value.selectedObject.name;
    },
    clearSelectedAsset() {
      this.consumption.assetName = "";
      this.consumption.consumptionUnit = "";
      this.consumption.updatedConsumptionPoints = "";
      this.primaryUsageUnit = "";
      this.secondaryUsageUnit = "";
      this.assetNameLabel = "";
      this.keyIndex++;
    },

    getAllCategories(currentUserDetails) {
      AssetManagementService.getAllAssetCategories(
        currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (response.status === 200) {
            this.assetCategories = response.data.categories;
          }
        })
        .catch((error) => {});
    },

    getAllAsset(currentUserDetails) {
      AssetManagementService.getAllAssets(
        currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (response.status === 200) {
            this.totalAssetNames = response.data.assets;
          }
        })
        .catch((error) => {});
    },

    viewConsumption() {
      this.loaderFlag = true;
      AssetManagementService.getConsumptionById(this.id)
        .then((response) => {
          if (response.status === 200) {
            let consumption = response.data.consumption;
            this.imageVoices = response.data.imageVoices;
            let assetuuids = [];
            assetuuids.push(consumption.assetUUID);
            AssetManagementService.getNameAndTypeOfAssetsByUUIDS({
              uuids: assetuuids,
            })
              .then((res1) => {
                let cByUUID = res1.data.assets[consumption.assetUUID];
                //	console.log(cByUUID);
                consumption.assetName = cByUUID.name;
                consumption.assetCategory = cByUUID.type;
                consumption.assetNumber = cByUUID.assetNumber;
                consumption.consumptionUnit = cByUUID.consumptionUnit;
                consumption.maximumConsumptionLevel =
                  cByUUID.maximumCsumptionLevel;
                if (consumption.meterType === "1") {
                  consumption.meterType = "Primary";
                  consumption.usageUnit = cByUUID.primaryUsageUnit;
                } else if (consumption.meterType === "2") {
                  consumption.meterType = "Secondary";
                  consumption.usageUnit = cByUUID.secondaryUsageUnit;
                }
                consumption.updatedConsumptionPoints = consumption.updatedConsumptionPoints.toString()
                this.markers.push({
                  lat: consumption.lat,
                  lng: consumption.lng,
                  type: "office",
                });
                this.view = true
                this.consumption = consumption;
                this.keyIndex++;
                this.loaderFlag = false;
              })
              .catch((error) => {
                this.loaderFlag = true;
                this.showToast(error.data.response, "error");
              });
          }
        })
        .catch((error) => {
          this.loaderFlag = true;
          this.showToast(error.data.response, "error");
        });
    },

    getCurrency() {
      AssetPersonnelService.getCompanyCurrency(
        this.currentUserDetails.profile.organizationId
      ).then((response) => {
        this.consumption.currency = response.data.currency;
      });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getCurrency();
    this.getAllCategories(this.currentUserDetails);
    this.getAllAsset(this.currentUserDetails);
    if (this.formTitles === "View Consumption") {
      this.stateDisable = true;
      this.editFlag = true;
      this.viewConsumption();
    }
    if (this.formTitles === "Edit Consumption") {
      this.stateDisable = true;
      this.editFlag = false;
      this.viewConsumption();
    }
  },
  validations: function() {
    return {
      consumption: {
        consumptionValue: { required, minValue: minValue(1) },
        price: { required, minValue: minValue(1) },
        updatedConsumptionPoints: { required },
        meterType: { required },
        meterValue: { required },
        assetCategory: { required },
        assetName: { required },
        consumptionUnit:{ required}
      },
    };
  },

  components: { loader },
};
</script>

<style lang="scss" scoped>
.heading {
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
}
</style>
