<template>
  <div class="pt-32 pb-80">
    <div class="head-title">{{ `${formTitle} Usage` }}</div>
    <div class="subtitle pt-8">
      {{ `${formTitle} a Usage and fill its details below` }}
    </div>

    <div class="main-page pt-32">
      <div>
        <SAccordion
          title="Asset Details"
          expandIcon="arrows"
          :open="true"
          :border="false"
          padding="32"
          ref="assetDetailsAccordion"
          @state="assetDetailsAccordionFunction"
        >
          <div class="items-row" v-padding="'16px 32px 24px 32px'">
            <SSelect
              label="Category*"
              v-model="assetCategoryLabel"
              :source="assetCategories"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="onSelectedCategory"
              @clear="clearSelectedCategory"
              :error="getFormErrorMessage($v.assetCategoryLabel)"
              :key="indexKey + 'category'"
              :readonly="stateDisable"
            />
            <SSelect
              label="Name*"
              v-model="assetNameLabel"
              :source="assetsNames"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="onSelectedName"
              @clear="clearSelectedAssetName"
              :error="getFormErrorMessage($v.assetNameLabel)"
              :key="indexKey + 'assetName'"
              :readonly="stateDisable"
            />
          </div>
        </SAccordion>

        <SAccordion
          title="Usage"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="usageDetailsAccordion"
          @state="usageAccordionFunction"
          class="mt-32"
        >
          <div v-if="usage_loaderFlag">
            <img
              src="assets/loader/medium.gif"
              alt="loader"
              class="loaders"
              style="height: 50px; top: 50%"
            />
          </div>

          <div v-padding="'16px 32px 16px 32px'">
            <span><strong>Usage Category</strong></span>

            <div div class="column-grid-2" v-padding="'16px 0px 8px 0px'">
              <SSelect
                label="Category*"
                v-model="fieldCategoryLabel"
                :source="fieldCategories"
                resultsValue="name"
                resultsDisplay="name"
                :autocomplete="true"
                @selected="onSelectedFieldCategory"
                @clear="clearSelectedFieldCategory"
                :error="getFormErrorMessage($v.fieldCategoryLabel)"
                :key="indexKey + 'tripCate'"
                :readonly="stateDisable"
              />
            </div>
          </div>
          <div class="row-border" v-margin="'8px 0px 8px 0px'"></div>

          <div v-padding="'0px 32px 16px 32px'">
            <span><strong>Primary Usage</strong></span>

            <div class="column-grid-2" v-padding="'16px 0px 0px 0px'">
              <SInput
                label="Value*"
                type="number"
                v-model="usages.primaryUsageValue"
                @input="checkValidation('primaryUsageValue')"
                :error="getFormErrorMessage($v.usages.primaryUsageValue)"
                :disabled="usage_loaderFlag"
                :key="indexKey + 'primaryUsageValue'"
                :readonly="stateDisable"
              />
              <SInput
                label="Unit"
                :key="indexKey + 'primary'"
                v-model="primaryUsageUnit"
                disabled
              />
            </div>
          </div>
          <div class="row-border" v-margin="'8px 0px 8px 0px'"></div>

          <div v-padding="'16px 32px 16px 32px'">
            <span><strong>Secondary Usage</strong></span>

            <div class="column-grid-2" v-padding="'16px 0px 16px 0px'">
              <SInput
                label="Value*"
                type="number"
                v-model="usages.secondaryUsageValue"
                @input="checkValidation('secondaryUsageValue')"
                :error="getFormErrorMessage($v.usages.secondaryUsageValue)"
                :disabled="usage_loaderFlag"
                :key="indexKey + 'secondaryUsageValue'"
                :readonly="stateDisable"
              />
              <SInput
                label="Unit"
                :key="indexKey + 'secondary'"
                v-model="secondaryUsageUnit"
                disabled
              />
            </div>
          </div>
          <div class="row-border" v-margin="'8px 0px 8px 0px'"></div>

          <div v-padding="'16px 32px 16px 32px'">
            <span><strong>Usage Description</strong></span>

            <div class="column-grid-1" v-padding="'16px 0px 16px 0px'">
              <STextarea
                :columns="70"
                label="Description"
                :key="`${indexKey}description`"
                v-model="usages.description"
                :error="getFormErrorMessage($v.usages.description)"
                :disabled="usage_loaderFlag"
                :readonly="stateDisable"
              />
            </div>
          </div>
        </SAccordion>

        <SAccordion
          title="Time"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="timeDetailsAccordion"
          @state="timeAccordionFunction"
          class="mt-32"
        >
          <div class="items-row" v-padding="'16px 32px 24px 32px'">
            <div>
              <ejs-datetimepicker
                :placeholder="'Start Date*'"
                v-model="startDate"
                :min="new Date()"
                :max="maxStartDate"
                :readonly="stateDisable"
                :showClearButton="!stateDisable"
              ></ejs-datetimepicker>
              <p class="error-section" v-if="$v.startDate">
                {{ getFormErrorMessage($v.startDate) }}
              </p>
            </div>
            <div>
              <ejs-datetimepicker
                :placeholder="'End Date*'"
                v-model="endDate"
                :min="minEndDate"
                :readonly="stateDisable"
                :showClearButton="!stateDisable"
              ></ejs-datetimepicker>
              <p class="error-section" v-if="$v.endDate">
                {{ getFormErrorMessage($v.endDate) }}
              </p>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          title="Usage Location"
          expandIcon="arrows"
          :open="false"
          :border="false"
          padding="32"
          ref="mapDetailsAccordion"
          @state="mapAccordionFunction"
          class="mt-32"
        >
          <div v-if="location_loaderFlag">
            <img
              src="assets/loader/medium.gif"
              alt="loader"
              class="loaders"
              style="height: 50px; top: 50%"
            />
          </div>
          <div style="padding: 24px 30px;">
            <div class="mb-24 column-grid-2">
              <SRadio
                v-model="usages.type"
                :options="typeOptions"
                :optionsPerRow="2"
                style="display:flex; gap: 1rem"
                :disabled="stateDisable"
              />
              <SInput
                v-if="stateDisable"
                :value="usages.location"
                :readonly="stateDisable"
              />
              <SSelect
                v-if="$route.params.type != 'view'"
                label="Add Location*"
                v-model="usages.location"
                :source="suggestionSource"
                resultsValue="place_name"
                resultsDisplay="place_name"
                :autocomplete="true"
                :editable="true"
                :error="getFormErrorMessage($v.usages.location)"
                :clearButtonIcon="true"
                @selected="onSelected"
                @input-value="onInput"
                @clear="clearSelectedLocation"
                :readonly="stateDisable"
              />
            </div>
            <div class="mb-24">
              <SMap
                v-if="stateDisable"
                :height="400"
                :markers="default_location"
                :animation="false"
                :zoom="16"
              />
              <SMap
                v-else
                :height="400"
                :clusters="false"
                :route="false"
                :searchFlag="true"
                :searchtText="usages.location"
                :source="mapSearchObj"
                @search-suggestions="getSuggestions"
                @selected-location="selectedLoc"
                :markers="default_location"
                :animation="false"
                :zoom="16"
              />
            </div>
          </div>
        </SAccordion>
      </div>

      <div></div>

      <div>
        <SideBar
          @submit="
            formTitle == 'Add'
              ? createUsage()
              : formTitle == 'Edit'
              ? updateUsage()
              : ''
          "
          :assetCategory="assetCategoryLabel"
          :usages="usages"
          :key="indexKey + 'sidebar'"
          :assets="assets"
        />
      </div>

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
  </div>
</template>

<script>
import AssetManagementService from "../../../services/AssetManagementService";
import SideBar from "./SideBar";
import { Functions } from "@/shared/Functions";
import moment from "moment";
import {
  required,
  requiredIf,
  minValue,
  maxLength,
} from "vuelidate/lib/validators";
import axios from "axios";

import loader from "@/components/Loader.vue";
export default {
  name: "CreateUsages",

  components: {
    SideBar,
    loader,
  },

  data() {
    return {
      stateDisable: false,
      usage_loaderFlag: false,
      location_loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      indexKey: 0,
      loaderFlag: false,
      currentUserDetails: "",
      assetCategories: "",
      assetCategory: "",
      assetCategoryLabel: "",
      assetsNames: [],
      totalAssetNames: "",
      assetName: "",
      assetNameLabel: "",
      fieldCategory: "",
      fieldCategoryLabel: "",
      assets: {},
      assetNumber: "",
      fieldCategories: [
        { name: "Trip", value: "trip" },
        { name: "Regular", value: "normal" },
      ],
      asset: "",
      locationDialog: false,
      secondaryLocationDialog: false,

      /*Map Box Data*/
      suggestionSource: [],
      mapSearchObj: {},
      accessToken:
        "pk.eyJ1IjoibXVoYW1tYWQtc2FhZCIsImEiOiJjazVjNXk0eDMxaWdoM25wc3hwd2tjNnJ0In0.kv0JZTEZh-hgD6jMnV1zwg",
      default_location: [],
      /*Map Box Data*/
      markers: [],
      lat: "",
      long: "",
      primaryUsageUnit: "",
      secondaryUsageUnit: "",
      startDate: "",
      endDate: "",
      assetPrimaryValue: "",
      assetSecondaryValue: "",
      typeOptions: [
        { label: "Primary Location", value: "primary" },
        { label: "Secondary Location", value: "secondary" },
      ],
      usages: {
        primaryUsageValue: "",
        secondaryUsageValue: "",
        primaryUsageTime: "",
        primaryUsageLat: "",
        primaryUsageLng: "",
        secondaryUsageTime: "",
        secondaryUsageLat: "",
        secondaryUsageLng: "",
        category: "",
        startTime: "",
        stopTime: "",
        tripEndUsageValue: "",
        createdAt: "",
        assetUUID: "",
        tenantUUID: "",
        location: "",
        type: "primary",
        description: "",
      },
      formTitle: "Add",
    };
  },
  props: {},
  methods: {
    getSuggestions(objs) {
      this.suggestionSource = objs;
    },

    async getLocations(searchInput) {
      const url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        searchInput +
        ".json?access_token=" +
        this.accessToken;
      try {
        return await axios
          .get(url)
          .then((responseJson) => {
            return responseJson.data;
          })
          .catch((error) => {
            this.showToast(
              "Unable to fetch location. Enable location and try reloading the page",
              "errorI"
            );
          });
      } catch (e) {
        console.log("Map.getLocations_outer", e);
      }
    },

    async getDefaultLocationObj(lng, lat) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?type=address&access_token=${this.accessToken}`;
      try {
        return await axios
          .get(url)
          .then((responseJson) => {
            let location = responseJson.data;
            let currentLocation = {};
            currentLocation.selectedObject = location.features[1];
            this.onSelected(currentLocation);
            this.selectedLoc(location.features[1]);
          })
          .catch((error) => {
            console.log("Map.getLocations_innder", error);
          });
      } catch (e) {
        console.log("Map.getLocations_outer", e);
      }
    },

    selectedLoc(obj) {
      this.usages["location"] = obj.place_name;
      if (this.usages.type == "primary") {
        this.usages.primaryUsageLng = obj.geometry.coordinates[0];
        this.usages.primaryUsageLat = obj.geometry.coordinates[1];
      } else {
        this.usages.secondaryUsageLng = obj.geometry.coordinates[0];
        this.usages.secondaryUsageLat = obj.geometry.coordinates[1];
      }
    },

    onSelected(val) {
      this.mapSearchObj = val.selectedObject;
    },
    onInput(val) {
      this.usages.location = val;
    },
    clearSelectedLocation() {
      this.usages.location = "";
      this.defaultLocation = [];
      this.mapSearchObj = {};
      this.indexKey++;
    },

    dateHandler(date, key) {
      let currentDate = moment()
        .format()
        .split("T");
      currentDate = currentDate[0];
      if (key === "start_date") {
        if (
          moment(date).isBefore(currentDate) ||
          moment(this.endDate).isBefore(date)
        ) {
          this.startDate = "";
          return this.showToast(
            "Start Date must be current Date & Less than End Date",
            "error"
          );
        }
      } else {
        if (this.startDate && moment(date).isBefore(this.startDate)) {
          this.endDate = "";
          return this.showToast(
            "End Date must be same as Start Date or greater than the Start Date",
            "error"
          );
        }
      }
    },
    checkValidation(field) {
      this.$v.usages[field].$touch();
    },

    defaultLocation() {
      this.location_loaderFlag = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.default_location.push({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            type: "location",
          });
          this.getDefaultLocationObj(
            position.coords.longitude,
            position.coords.latitude
          );
          this.location_loaderFlag = false;
        },
        (error) => {
          this.location_loaderFlag = false;
          console.log(error.message);
        }
      );
    },

    createUsage() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }
      if (
        this.usages.primaryUsageValue &&
        this.usages.primaryUsageValue <= this.assetPrimaryValue
      ) {
        this.showToast(
          "Primary Usage value should be greater than " +
            this.assetPrimaryValue +
            ".",
          "warning"
        );
        return;
      }
      if (
        this.usages.secondaryUsageValue &&
        this.usages.secondaryUsageValue <= this.assetSecondaryValue
      ) {
        this.showToast(
          "Secondary Usage value should be greater than " +
            this.assetSecondaryValue +
            ".",
          "warning"
        );
        return;
      }

      let request = {
        usage: this.usages,
      };
      this.loaderFlag = true;
      if (this.startDate) {
        var selectedDate = moment(this.startDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        request.usage.startTime = selectedDate;
      }
      if (this.endDate) {
        var selectedDateEnd = moment(this.endDate).format(
          "YYYY-MM-DDTHH:MM:SSZ"
        );
        request.usage.stopTime = selectedDateEnd;
      }

      request.usage.tenantUUID = this.currentUserDetails.organizationId;
      request.usage.primaryUsageUnit = this.primaryUsageUnit;
      request.usage.secondaryUsageUnit = this.secondaryUsageUnit;
      request.usage.assetName = this.assetNameLabel;


      AssetManagementService.addUsages(request)
        .then((res) => {
          if (res.data.responseCode == "200") {
            this.loaderFlag = false;
            this.$router.push({
              name: "usage",
              params: {
                toastMessage: res.data.description,
                toastType: "success",
                toastFlag: true,
              },
            });
          }
        })
        .catch((e) => {
          this.showToast("Error while adding usage in asset.", "error");
          this.loaderFlag = false;
        });
    },

    updateUsage() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.showToast("Please fill all required fields", "warning");
        return;
      }
      this.loaderFlag = true;
      let request = {
        usage: {
          id: this.usages.id,
          primaryUsageValue: this.usages.primaryUsageValue,
          secondaryUsageValue: this.usages.secondaryUsageValue,
          primaryUsageTime: this.usages.primaryUsageTime,
          primaryUsageLat: this.usages.primaryUsageLat,
          primaryUsageLng: this.usages.primaryUsageLng,
          secondaryUsageTime: this.usages.secondaryUsageTime,
          secondaryUsageLat: this.usages.secondaryUsageLat,
          secondaryUsageLng: this.usages.secondaryUsageLng,
          category: this.usages.category,
          tripEndUsageValue: this.usages.tripEndUsageValue,
          tenantUUID: this.usages.tenantUUID,
          description: this.usages.description,
        },
      };
      var selectedDate = moment(this.startDate).format("YYYY-MM-DDTHH:MM:SSZ");
      var dateSplit = selectedDate.split("T");
      var objDate = dateSplit[0];
      var timeSplit = this.usages.startTime.split(":");
      var hour = timeSplit[0];
      var min = timeSplit[1];
      var assignmentDate = objDate + "T" + hour + ":" + min + ":" + "00+05:00";
      request.usage.startTime = assignmentDate;
      var selectedDateEnd = moment(this.endDate).format("YYYY-MM-DDTHH:MM:SSZ");
      var dateSplit1 = selectedDateEnd.split("T");
      var objDate1 = dateSplit1[0];
      var timeSplit1 = this.usages.stopTime.split(":");
      var hour1 = timeSplit1[0];
      var min1startDate = timeSplit1[1];
      var assignmentDateEnd =
        objDate1 + "T" + hour1 + ":" + min1startDate + ":" + "00+05:00";
      request.usage.stopTime = assignmentDateEnd;
      request.usage.assetUUID = this.usages.assetUUID;

      AssetManagementService.editUsages(request)
        .then((res) => {
          if (res.data.responseCode == "200") {
            this.loaderFlag = false;
            this.$router.push({
              name: "usage",
              params: {
                toastMessage: res.data.description,
                toastType: "success",
                toastFlag: true,
              },
            });
          }
        })
        .catch((e) => {
          this.loaderFlag = false;
          this.showToast("Error while adding usage in asset.", "error");
        });
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

    onSelectedCategory(value) {
      this.assetsNames = [];
      this.assetCategory = value.selectedObject;
      for (let asset of this.totalAssetNames) {
        if (asset.categoryUUID === this.assetCategory.uuid) {
          this.assetsNames.push(asset);
        }
      }
    },

    clearSelectedCategory() {
      this.assetCategoryLabel = "";
      this.assetNameLabel = "";
      this.assets = {};
      this.usages.primaryUsageValue = "";
      this.usages.secondaryUsageValue = "";
      this.primaryUsageUnit = "";
      this.secondaryUsageUnit = "";
      this.assetsNames = [];
      this.indexKey++;
    },

    onSelectedName(value) {
      if (value) {
        this.usage_loaderFlag = true;
        this.assetNameLabel = value.selectedObject.name;
        AssetManagementService.getAsset(value.selectedObject.uuid)
          .then((res) => {
            let asset = res.data.asset;
            this.assetPrimaryValue = asset.lastUsage.primaryUsageValue
              ? asset.lastUsage.primaryUsageValue
              : 0;
            this.assetSecondaryValue = asset.lastUsage.secondaryUsageValue
              ? asset.lastUsage.secondaryUsageValue
              : 0;
            this.usages.primaryUsageValue = asset.lastUsage.primaryUsageValue
              ? asset.lastUsage.primaryUsageValue
              : 0;
            this.usages.secondaryUsageValue = asset.lastUsage
              .secondaryUsageValue
              ? asset.lastUsage.secondaryUsageValue
              : 0;
            this.usage_loaderFlag = false;
          })
          .catch((e) => {
            console.log(e);
            this.showToast("Failed to load usage.", "error");
            this.usage_loaderFlag = false;
          });
        this.assets = value.selectedObject;
        this.usages.assetUUID = value.selectedObject.uuid;
        this.usages.assetNumber = value.selectedObject.assetNumber;
        this.primaryUsageUnit = value.selectedObject.primaryUsageUnit;
        this.secondaryUsageUnit = value.selectedObject.secondaryUsageUnit;
        this.indexKey++;
      }
    },

    clearSelectedAssetName() {
      this.assetNameLabel = "";
      this.assets = {};
      this.usages.primaryUsageValue = "";
      this.usages.secondaryUsageValue = "";
      this.primaryUsageUnit = "";
      this.secondaryUsageUnit = "";
      this.indexKey++;
    },

    onSelectedFieldCategory(value) {
      this.usages.category = value.selectedObject.value;
      this.fieldCategory = value.selectedObject;
    },

    clearSelectedFieldCategory() {
      this.usages.category = "";
      this.fieldCategory = "";
      this.fieldCategoryLabel = "";
      this.indexKey++;
    },

    assetDetailsAccordionFunction(value) {
      if (this.$refs.assetDetailsAccordion.openFlag === true) {
        this.$refs.usageDetailsAccordion.openFlag = false;
        this.$refs.timeDetailsAccordion.openFlag = false;
        this.$refs.mapDetailsAccordion.openFlag = false;
      }
    },

    usageAccordionFunction(value) {
      if (this.$refs.usageDetailsAccordion.openFlag === true) {
        this.$refs.timeDetailsAccordion.openFlag = false;
        this.$refs.mapDetailsAccordion.openFlag = false;
        this.$refs.assetDetailsAccordion.openFlag = false;
      }
    },

    timeAccordionFunction(value) {
      if (this.$refs.timeDetailsAccordion.openFlag === true) {
        this.$refs.usageDetailsAccordion.openFlag = false;
        this.$refs.mapDetailsAccordion.openFlag = false;
        this.$refs.assetDetailsAccordion.openFlag = false;
      }
    },

    mapAccordionFunction(value) {
      if (this.$refs.mapDetailsAccordion.openFlag === true) {
        this.$refs.usageDetailsAccordion.openFlag = false;
        this.$refs.timeDetailsAccordion.openFlag = false;
        this.$refs.assetDetailsAccordion.openFlag = false;
      }
    },
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation && fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    getUsageById() {
      this.loaderFlag = true;
      AssetManagementService.getUsageById(this.$route.params.usageID)
        .then((response) => {
          console.log('getUsageById',response)
          if (response.status === 200) {
            let usage = response.data.usage;
            let assetuuids = [];
            assetuuids.push(usage.assetUUID);
            this.usages.createdDate = moment
              .utc(usage.createdAt)
              .local()
              .format("DD MMM YYYY hh:mm a");
            if (usage.category !== null) {
              this.primaryUsageUnit = usage.primaryUsageUnit;
              this.secondaryUsageUnit = usage.secondaryUsageUnit;
              this.usages.assetName = usage.assetName;
              this.fieldCategoryLabel = this.$title_case(usage.category);
              this.usages.primaryUsageLat = usage.primaryUsageLat;
              this.usages.primaryUsageLng = usage.primaryUsageLng;
              this.usages.secondaryUsageLat = usage.secondaryUsageLat;
              this.usages.secondaryUsageLng = usage.secondaryUsageLng;

              usage.startDate = usage.startTime
                ? moment
                    .utc(usage.startTime)
                    .local()
                    .format("DD MMM YYYY")
                : "";
              usage.endDate = usage.stopTime
                ? moment
                    .utc(usage.stopTime)
                    .local()
                    .format("DD MMM YYYY")
                : "";
              this.startDate = usage.startTime;
              this.endDate = usage.stopTime;

              usage.startTime = usage.startTime
                ? moment
                    .utc(usage.startTime)
                    .local()
                    .format("hh:mm")
                : "";
              usage.stopTime = usage.stopTime
                ? moment
                    .utc(usage.stopTime)
                    .local()
                    .format("hh:mm")
                : "";
              this.default_location.push({
                lng: usage.primaryUsageLng
                  ? usage.primaryUsageLng
                  : usage.secondaryUsageLng
                  ? usage.secondaryUsageLng
                  : "",
                lat: usage.primaryUsageLat
                  ? usage.primaryUsageLat
                  : usage.secondaryUsageLat
                  ? usage.secondaryUsageLat
                  : "",
                type: "office",
              });
              usage.location = "";
              if (usage.primaryUsageLng) {
                usage.type = "primary";
              } else {
                if (usage.secondaryUsageLng) {
                  usage.type = "secondary";
                }
              }
            }
            AssetManagementService.getNameAndTypeOfAssetsByUUIDS({
              uuids: assetuuids,
            })
              .then((response1) => {
                this.assets = response1.data.assets[assetuuids];
                this.assetNameLabel =
                  response1.data.assets[usage.assetUUID].name;
                this.assetCategoryLabel =
                  response1.data.assets[usage.assetUUID].type;
                this.usages.assetNumber =
                  response1.data.assets[usage.assetUUID].assetNumber;
                this.usages.primaryUsageUnit =
                  response1.data.assets[usage.assetUUID].primaryUsageUnit;
                this.usages.secondaryUsageUnit =
                  response1.data.assets[usage.assetUUID].secondaryUsageUnit;
                this.usages = { ...usage };
                this.indexKey++;
                if (
                  this.$route.name != "create-usage" &&
                  this.default_location.length > 0
                ) {
                  this.getDefaultLocationObj(
                    this.default_location[0].lng,
                    this.default_location[0].lat
                  );
                }
                this.loaderFlag = false;
              })
              .catch((error) => {
                this.loaderFlag = false;
                this.showToast(error.response.message, "error");
              });
          }
        })
        .catch((error) => {
          this.showToast(error.response.message, "error");
        });
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  computed: {
    getSource() {
      return this.suggestionSource;
    },

    minEndDate() {
      let startDate = new Date();
      if (this.startDate) {
        return this.startDate;
      } else {
        return startDate;
      }
    },

    maxStartDate() {
      if (this.endDate) {
        return this.endDate;
      } else {
        return new Date(
          `${new Date().getMonth()}/1/${new Date().getFullYear + 100}`
        );
      }
    },
  },

  watch: {
    suggestionSource: {
      deep: true,
      handler(v, ov) {},
    },
  },
  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    /* Fetches Default Location */
    if (this.$route.name == "create-usage") {
      this.defaultLocation();
    }
    if (this.$route.name === "usage-detail") {
      if (this.$route.params.type == "view") {
        this.stateDisable = true;
      }
      this.formTitle = `${this.$title_case(this.$route.params.type)}`;
      this.getUsageById();
    }
    this.getAllCategories(this.currentUserDetails);
    this.getAllAsset(this.currentUserDetails);
  },

  validations: function() {
    return {
      assetCategoryLabel: { required },
      assetNameLabel: { required },
      fieldCategoryLabel: { required },
      startDate: {
        required: requiredIf(() => {
          return this.fieldCategoryLabel.toLowerCase() == "trip" ? true : false;
        }),
      },
      endDate: {
        required: requiredIf(() => {
          return this.fieldCategoryLabel.toLowerCase() == "trip" ? true : false;
        }),
      },
      usages: {
        primaryUsageValue: {
          required: requiredIf(() => {
            return this.usages.secondaryUsageValue ? false : true;
          }),
          minValue: minValue(0),
        },
        secondaryUsageValue: {
          required: requiredIf(() => {
            return this.usages.primaryUsageValue ? false : true;
          }),
          minValue: minValue(0),
        },
        location: { required },
        description: { required, maxLength: maxLength(500) },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.items-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 16px;
  align-items: center;
}
.row-border {
  border-top: 1px solid var(--very-light-pink);
}
.loaders {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
}

.error-section {
  position: absolute;
  margin: 0px;
  font-size: 12px;
  color: var(--text-error-color);
}
</style>
