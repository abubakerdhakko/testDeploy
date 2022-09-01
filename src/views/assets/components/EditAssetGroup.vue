<template>
  <div>
    <SDialog
      :title="'Update Asset Group'"
      :persistent="true"
      :width="610"
      class="popup"
      @close="close"
      v-if="assetNameLabel"
    >
      <div class="grid-create-user">
        <SInput
          label="Group Name*"
          v-model="groupName"
          :error="getFormErrorMessage($v.groupName)"
        />

        <SSelect
          label="Asset Category"
          v-model="assetCategoryLabel"
          :source="assetCategoryOptions"
          resultsValue="name"
          resultsDisplay="name"
          :autocomplete="true"
          @selected="onAssetGroupSelect"
          :key="assetCategoryIndex"
        />

        <SMultipleSelect
          :checkbox="true"
          :avatar="false"
          v-model="assetNameLabel"
          :label="'Asset Name*'"
          :data="assetNameOptions"
          optionLabel="name"
          @selected-values="onAssetNameSelect"
          :key="assetNameIndex + 'key'"
        />
      </div>
      <div style="text-align: right">
        <SButton
          style="padding: 24px 30px; margin-bottom: 150px"
          title="Update"
          @click="updateAssetGroup"
          v-width="100"
          :small="true"
        />
      </div>
    </SDialog>
  </div>
</template>

<script>
import { AssetManagementService } from "../../../services/AssetManagementService";
import { required } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";
export default {
  name: "EditAssetGroup",
  data() {
    return {
      currentUserDetails: "",
      groupName: "",
      assetCategory: [],
      assetUUID: [],
      allAssets: [],
      assetNameOptions: [],
      assetName: [],
      stateDisable: true,
      assetCategoryIndex: 0,
      assetNameIndex: 0,
      assetCategoryLabel: [],
      assetNameLabel: [],
      editGroupsObject: "",
    };
  },
  props: {
    assetCategoryOptions: { type: Array },
    groupUUID: {},
    editGroupObj: {},
  },
  methods: {
    close() {
      this.$emit("close");
    },
    updateAssetGroup() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      if (this.assetUUID.length > 0) {
        let group = {
          groupUUID: this.groupUUID,
          assetUUIDs: this.assetUUID,
          groupName: this.groupName,
          createdByUserName: this.currentUserDetails.username,
          createdByUserUUID: this.currentUserDetails.profile.userid,
          tenantUUID: this.currentUserDetails.profile.organizationId,
        };
        this.$emit("assetGroupObj", group);
        // AssetManagementService.editAssetGroup(group).then((response) => {
        //   console.log(response);
        //   if (response.status === 200) {
        //     alert("Successfully Update Asset Group");
        //     this.close();
        //   }
        // });
      } else {
        alert("Kindly Fill Asset Name field");
      }
    },
    onAssetGroupSelect(val) {
      this.assetNameOptions = [];
      this.assetUUID = [];
      this.assetNameLabel = [];
      for (let i = 0; i < this.allAssets.length; i++) {
        if (this.allAssets[i].categoryUUID === val.selectedObject.uuid) {
          let asset = {
            uuid: this.allAssets[i].uuid,
            name: this.allAssets[i].name + "-" + this.allAssets[i].type,
          };
          this.assetNameOptions.push(asset);
        }
      }
    },
    getAllAssetsbyUUID() {
      AssetManagementService.getAllAssets(
        this.currentUserDetails.profile.organizationId
      )
        .then((response) => {
          this.allAssets = response.data.assets;
          this.getAssetGroupbyUUID();
        })
        .catch((error) => {});
    },
    getAssetGroupbyUUID() {
      this.groupName = this.editGroupsObject.assetGroup.groupName;
      this.assetCategoryLabel =
        this.editGroupsObject.assetGroup.categories[0].name;
      this.assetCategoryIndex++;
      this.assetNameOptions = [];
      this.assetUUID = [];
      this.assetNameLabel = [];
      for (let i = 0; i < this.allAssets.length; i++) {
        if (
          this.allAssets[i].categoryUUID ===
          this.editGroupsObject.assetGroup.categories[0].assets[0].categoryUUID
        ) {
          let asset = {
            uuid: this.allAssets[i].uuid,
            name: this.allAssets[i].name + " - " + this.allAssets[i].type,
          };
          this.assetNameOptions.push(asset);
        }
      }
      this.assetNameLabel =
        this.editGroupsObject.assetGroup.categories[0].assets;
      this.assetNameIndex++;
      this.loaderFlag = false;
    },
    onAssetNameSelect(val) {
      this.assetNameLabel = [];
      this.assetName = [];
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
    this.editGroupsObject = this.editGroupObj;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAllAssetsbyUUID();
  },
  validations: function () {
    return {
      groupName: { required },
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
</style>
