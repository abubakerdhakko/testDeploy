<template>
  <div class="pt-32 pb-80">
    <span class="head-title">Create Wallet</span><br />
    <span class="subtitle">Create a new wallet and fill its details below</span>
    <WalletForm
      :walletData="walletInfo"
      @asset-category-select="assetCategorySelected"
      @asset-selected="assetSelected"
      @user-selected="userSelected"
      @submit="createWalletRequest"
      @showToast="showToast"
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
import WalletForm from "./components/WalletForm";
import { AssetManagementService } from "../../services/AssetManagementService";

import loader from "@/components/Loader.vue";

export default {
  name: "CreateWallet",

  components: {
    WalletForm,
    loader,
  },

  data() {
    return {
      walletInfo: {},
      loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
    };
  },

  methods: {
    assetCategorySelected(value) {
      if (value) {
        this.walletInfo.assetCategory = value.selectedObject.categoryUUID;
      }
    },

    assetSelected(val) {
      if (val) {
        this.walletInfo.assetName = val.name
        this.walletInfo.assetUUID = val.uuid;
      }
    },

    userSelected(val) {
      if (val) {
        this.walletInfo.userName = val.name
        this.walletInfo.userUUID = val.uuid;
      }
    },

    createWalletRequest(value) {
      if (value && value.capacity < value.thresholdValue) {
        this.showToast(
          "Capacity should be Greater Than Threshold Value",
          "error"
        );
        return;
      }
      this.loaderFlag = true;
      AssetManagementService.createWallet(value)
        .then((response) => {
          if (response.data.responseCode === "F200") {
            this.loaderFlag = false;
            this.$router.push({
              name: "wallets",
              params: {
                toastFlag: true,
                toastSuccess: "success",
                message: response.data.description,
              },
            });
          }
        })
        .catch((error) => {
          if (error) {
            this.loaderFlag = false;
            this.showToast(error.response.data.description, "error");
          }
        });
    },

    getWallet() {
      AssetManagementService.GetWalletByWalletUUID(
        this.$route.params.walletUUID
      )
        .then((res) => {
          this.walletInfo = res.data.wallet;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  created() {
    document.title = this.$route.meta.title;
  },

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
</style>