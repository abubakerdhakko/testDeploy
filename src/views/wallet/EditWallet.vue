<template>
  <div class="pt-32 pb-80">
    <span class="head-title">{{ `${page_type} Wallet` }}</span
    ><br />
    <span class="subtitle">Edit the details of an existing wallet</span>
    <WalletForm
      :key="walletKey"
      :walletData="walletInfo"
      @submit="submitChange"
      @asset-category-select="assetCategorySelected"
      @asset-selected="assetSelected"
      @user-selected="userSelected"
      @showToast="showToast"
      :stateDisable="stateDisable"
      :transactions="transactions"
    />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import WalletForm from "./components/WalletForm";
import { AssetManagementService } from "../../services/AssetManagementService";
import InspectionService from "../../services/InspectionService";
import moment from "moment";

import loader from "@/components/Loader.vue";

export default {
  name: "name",

  components: {
    WalletForm,
    loader,
  },

  data() {
    return {
      loaderFlag: false,
      walletInfo: {},
      walletKey: 0,
      currentUserDetails: "",
      users: [],
      assets: [],
      transactions: [],
      page_type: "Edit",
      stateDisable: false,
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
        this.userUUID = val.uuid;
      }
    },
    submitChange() {
      this.loaderFlag = true;
      AssetManagementService.editWallet(this.walletInfo)
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
          this.walletInfo.categoryName = res.data.assetCategoryName;
          InspectionService.getInspectionTemplateByUUID(
            "none",
            this.currentUserDetails.organizationId
          )
            .then((response) => {
              let data = response.data;
              for (let asset of data.assetAndGroupsNameResponse.assetDTOS) {
                if (asset && this.walletInfo.assetUUID === asset.uuid) {
                  this.walletInfo.assetName = asset.name;
                  break;
                }
              }

              for (let user of data.userAndGroupResponse.userDTOS) {
                if (user && this.walletInfo.userUUID === user.uuid) {
                  this.walletInfo.userName = user.name
                  this.walletInfo.fullName = user.name;
                  break;
                }
              }

              this.walletKey++;
              this.loaderFlag = false;
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getAsset() {
      AssetManagementService.getAllAssets(
        this.currentUserDetails.organizationId
      )
        .then((response) => {
          this.assets = response.data.assets;
          this.getWallet();
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

    getTransaction() {
      AssetManagementService.getTransaction(
        this.$route.params.walletUUID,
        0,
        10000
      )
        .then((response) => {
          this.transactions = response.data.factList;
          this.transactions.forEach((element) => {
            element.dateTime = moment(element.dateTime).format("DD MMM YYYY");
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.loaderFlag = true;
    document.title = this.$route.meta.title;
    if (this.$route.params.type) {
      this.page_type = this.$route.params.type;
      this.stateDisable = true;
    }

    this.getWallet();
    this.getAsset();
    this.getTransaction();
  },

  computed: {},
};
</script>

<style lang="scss" scoped></style>
