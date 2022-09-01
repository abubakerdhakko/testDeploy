<template>
  <div>
    <SDialog
      v-if="usage"
      :title="usage.assetName"
      :persistent="true"
      :width="610"
      @close="close"
    >
      <div style="padding: 24px 30px">
        <span class="item-title">Asset Details</span>
        <div class="column-grid-2">
          <SSelect
            label="Category*"
            v-model="usage.assetCategory"
            :source="assetCategories"
            resultsValue="name"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onSelectedCategory"
            @clear="clearSelectedCategory"
            :error="getFormErrorMessage($v.usage.assetCategory)"
            :key="keyValue + 'assetCategory'"
          />
          <!-- :error="getFormErrorMessage(this.$v.assetCategoryLabel)" -->
          <SSelect
            label="Asset Name*"
            v-model="usage.assetName"
            :source="assetsNames"
            resultsValue="name"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onSelectedName"
            @clear="clearSelectedAssetName"
            :key="keyValue + 'assetName'"
            :error="getFormErrorMessage($v.usage.assetName)"
          />
          <!-- :error="getFormErrorMessage(this.$v.assetNameLabel)" -->
          <!-- <SInput
					label="asset #"
					v-model="usage.assetNumber"
				/>

				<SInput
					label="asset category"
					v-model="usage.assetCategory"
				/> -->
        </div>

        <div class="separator"></div>

        <span class="item-title">Primary Usage</span>
        <div class="column-grid-2">
          <SInput
            label="Value"
            type="number"
            v-model="usage.primaryUsageValue"
            @input="checkValidation('primaryUsageValue')"
            :error="getFormErrorMessage($v.usage.primaryUsageValue)"
          />

          <SInput label="Unit" v-model="usage.primaryUsageUnit" readonly />
        </div>

        <div class="separator"></div>

        <span class="item-title">Secondary Usage</span>

        <div class="column-grid-2">
          <SInput
            label="Value"
            type="number"
            v-model="usage.secondaryUsageValue"
            @input="checkValidation('secondaryUsageValue')"
            :error="getFormErrorMessage($v.usage.secondaryUsageValue)"
          />

          <SInput label="Unit" v-model="usage.secondaryUsageUnit" readonly />
          <SInput label="Category" v-model="usage.category" readonly />
        </div>

        <div class="separator"></div>

        <span class="item-title">Time</span>
        <div class="column-grid-2 mb-24">
          <SInput label="Start Time" v-model="usage.startTime" readonly />
          <SInput label="Stop Time" v-model="usage.stopTime" readonly />
        </div>
        <div>
          <SButton
            class="dialog-btn"
            title="Update Usage"
            @click="updateUsages"
          />
        </div>
      </div>
    </SDialog>

    <!-- Loader Compnent  -->
    <loader v-if="loaderFlag" />
    <!-- Loader Compnent  -->
  </div>
</template>
<script>
import moment from "moment";
import { AssetManagementService } from "../../services/AssetManagementService";
import { required, minValue } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";

import loader from "@/components/Loader.vue";

export default {
  name: "ViewUsage",
  components: { loader },

  data() {
    return {
      keyValue: 0,
      usage: null,
      loaderFlag: false,
      currentUserDetails: "",
      assetCategories: "",
      assetCategory: "",
      assetCategoryLabel: "",
      assetsNames: [],
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    onSelectedCategory(value) {
      this.usage.assetNumber = "";
      this.keyValue++;
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
      this.usage.assetCategory = "";
      this.usage.assetName = "";
      this.assetsNames = [];
      this.keyValue++;
    },

    onSelectedName(value) {
      this.assetNameLabel = value.selectedObject.name;
      this.assets = value.selectedObject;
      this.usage.assetUUID = value.selectedObject.uuid;
      this.usage.primaryUsageUnit = value.selectedObject.primaryUsageUnit;
      this.usage.secondaryUsageUnit = value.selectedObject.secondaryUsageUnit;
      this.indexKey++;
      //	console.log(this.usages);
    },

    clearSelectedAssetName() {
      this.usage.assetName = "";
      this.usage.assetUUID = "";
      this.indexKey++;
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

    getUsageById() {
      this.loaderFlag = true;
      AssetManagementService.getUsageById(this.id)
        .then((response) => {
          if (response.status === 200) {
            let usage = response.data.usage;
            let assetuuids = [];
            assetuuids.push(usage.assetUUID);
            usage.createdDate = moment
              .utc(usage.createdAt)
              .local()
              .format("DD MMM YYYY hh:mm a");
            if (usage.category !== null) {
              usage.startTime = moment
                .utc(usage.startTime)
                .local()
                .format("DD MMM YYYY hh:mm a");
              usage.stopTime = moment
                .utc(usage.stopTime)
                .local()
                .format("DD MMM YYYY hh:mm a");
            }
            AssetManagementService.getNameAndTypeOfAssetsByUUIDS({
              uuids: assetuuids,
            })
              .then((response1) => {
                usage.assetName = response1.data.assets[usage.assetUUID].name;
                usage.assetCategory =
                  response1.data.assets[usage.assetUUID].type;
                usage.assetNumber =
                  response1.data.assets[usage.assetUUID].assetNumber;
                usage.primaryUsageUnit =
                  response1.data.assets[usage.assetUUID].primaryUsageUnit;
                usage.secondaryUsageUnit =
                  response1.data.assets[usage.assetUUID].secondaryUsageUnit;

                this.usage = usage;
                this.loaderFlag = false;
              })
              .catch((error) => {});
          }
        })
        .catch((error) => {});
    },

    updateUsages() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit(
          "toastFlagFun",
          "Please fill all required fields",
          "warning"
        );
        return;
      }
      this.loaderFlag = true;
      let request = {
        usage: this.usage,
      };
      request.usage.startTime = moment(this.usage.startTime).format(
        "YYYY-MM-DDTHH:MM:SSZ"
      );
      request.usage.stopTime = moment(this.usage.stopTime).format(
        "YYYY-MM-DDTHH:MM:SSZ"
      );
      request.usage.assetUUID = this.usage.assetUUID;
      AssetManagementService.editUsages(request)
        .then((res) => {
          if (res.data.responseCode == "200") {
            this.loaderFlag = false;
            this.$emit(
              "toastFlagFun",
              "Usage updated successfully.",
              "success"
            );
            this.close();
          }
        })
        .catch((e) => {
          this.loaderFlag = false;
          this.$emit("toastFlagFun", "Error while updating usage.", "error");
        });
    },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation && fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    checkValidation(field) {
      this.$v.usage[field].$touch();
    },
  },
  props: {
    id: {},
  },
  created() {
    document.title = this.$route.meta.title;
    this.getUsageById();
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAllCategories(this.currentUserDetails);
    this.getAllAsset(this.currentUserDetails);
  },
  validations: function() {
    return {
      usage: {
        assetCategory: { required },
        assetName: { required },
        primaryUsageValue: {
          required,
          minValue: minValue(0),
        },
        secondaryUsageValue: {
          required,
          minValue: minValue(this.usage.primaryUsageValue),
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.Viewusage-dialog {
  .modal {
    width: 980px;
  }
}
.item-title {
  display: inline-block;
  font-weight: bold;
  margin-bottom: 10px;
}
.px-32 {
  padding: 32px 32px 16px 32px;
}
</style>
