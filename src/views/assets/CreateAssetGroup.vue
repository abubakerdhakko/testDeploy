<template>
  <div>
    <SDialog
      :title="'Create Asset Group'"
      :persistent="true"
      :width="610"
      class="popup"
      @close="close"
    >
      <div class="column-grid-2" style="padding: 24px 30px">
        <SInput
          label="Group Name*"
          v-model="groupName"
          :error="getFormErrorMessage($v.groupName)"
        />
        <SSelect
          label="Asset Category"
          v-model="assetCategory"
          :source="assetCategoryOptions"
          resultsValue="name"
          resultsDisplay="name"
          :autocomplete="true"
          @selected="onAssetGroupSelect"
        />
        <SMultipleSelect
          :checkbox="true"
          :avatar="false"
          v-model="assetName"
          :label="'Asset Name*'"
          :data="assetNameOptions"
          :noResultText="'No Asset added under this category'"
          optionLabel="label"
          @selected-values="onAssetNameSelect"
        />
        </div>
        <div style="padding: 15px 30px">
        <SButton
          class="dialog-btn"
          title="Create"
          @click="createAssetGroup"
          :small="true"
        />
      </div>
    </SDialog>
  </div>
</template>

<script>
import { AssetManagementService } from "../../services/AssetManagementService";
import { required, maxLength } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";
export default {
  name: "CreateAssetGroup",
  data() {
    return {
      currentUserDetails: "",
      groupName: "",
      assetUUID: [],
      assetCategory: "",
      allAsset: [],
      assetNameOptions: [],
      assetName: [],
      stateDisable: true,
    };
  },
  props: {
    assetCategoryOptions: { type: Array },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    createAssetGroup() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if (this.assetUUID.length > 0) {
        let group = {
          assetUUIDs: this.assetUUID,
          groupName: this.groupName,
          createdByUserName: this.currentUserDetails.profile.username,
          category: this.assetCategory,
          createdByUserUUID: this.currentUserDetails.profile.userid,
          tenantUUID: this.currentUserDetails.profile.organizationId,
        };
        this.$emit("assetGroupObj", group);
        // AssetManagementService.addAssetGroup(group).then((response) => {
        // 	console.log(response);
        // 	if (response.status === 200) {
        // 		alert("Successfully Created Asset Group");
        // 		this.close();
        // 	}
        // });
      } else {
        alert("Kindly Fill Asset Name field");
      }
    },
    onAssetGroupSelect(val) {
      this.assetNameOptions = [];
      this.assetUUID = [];

      for (let i = 0; i < this.allAsset.length; i++) {
        if (this.allAsset[i].categoryUUID === val.selectedObject.uuid) {
          let asset = {
            uuid: this.allAsset[i].uuid,
            label: this.allAsset[i].name + "-" + this.allAsset[i].type,
          };
          this.assetNameOptions.push(asset);
        }
      }
    },
    getAllAsset() {
      AssetManagementService.getAllAssets(
        this.currentUserDetails.profile.organizationId
      )
        .then((response) => {
          this.allAsset = response.data.assets;
        })
        .catch((error) => {});
    },
    onAssetNameSelect(val) {
      this.assetUUID = [];
      for (let index = 0; index < val.length; index++) {
        this.assetUUID.push(val[index].uuid);
      }


    },
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
  },
  created() {
    document.title = this.$route.meta.title;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAllAsset();
  },
  validations: function() {
    return {
      groupName: { required, maxLength: maxLength(190) },
    };
  },
};
</script>

<style lang="scss" scoped>
.grid-create-user {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 16px;
  padding: 32px 30px;
  padding-bottom: 0px;
}
.model {
  height: 500px !important;
}
.px-30 {
  padding: 30px 30px 0px 30px;
}
</style>
