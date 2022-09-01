<template>
  <div class="page-wrapper">
    <div>
      <SAccordion
        title="Basic Information"
        expandIcon="arrows"
        :open="true"
        :border="false"
        :padding="'32'"
        v-margin-top="48"
        ref="walletInfoAccordion"
        @state="walletInfoAccordionFunction"
        :shadow="true"
      >
        <div class="accordion-content" :key="update + 'basicInfo'">
          <span class="sec-header column-grid-1">Wallet Info</span>
          <div class="column-grid-2">
            <SInput
              label="Wallet Name"
              v-model="walletInfo.walletName"
              :error="getFormErrorMessage($v.walletInfo.walletName)"
              :readonly="stateDisable"
            />
            <SCheckBox
              v-model="walletInfo.allowedNegative"
              label="Allow Negative"
              @input="checkboxInput"
              :readonly="stateDisable"
            />

            <SSelect
              label="Wallet Type"
              v-model="walletInfo.walletType"
              :source="walletTypeData"
              resultsValue="resultsValue"
              resultsDisplay="resultsDisplay"
              :autocomplete="false"
              @selected="onSelected"
              @clear="clearSelectedWalletType"
              @input="onInput"
              :error="getFormErrorMessage($v.walletInfo.walletType)"
              :readonly="$route.name === 'create-wallet' ? false : true"
            />

            <SSelect
              label="Product Type"
              v-model="walletInfo.productType"
              :source="
                walletInfo.walletType === 'Currency'
                  ? currencyData
                  : productTypeFuel
              "
              resultsValue="resultsValue"
              resultsDisplay="resultsDisplay"
              :autocomplete="true"
              @selected="onSelectedProductType"
              @clear="clearSelectedProductType"
              :error="getFormErrorMessage($v.walletInfo.productType)"
              :readonly="$route.name === 'create-wallet' ? false : true"
            />
          </div>
          <div class="separator"></div>
          <div class="py-24">
            <span class="sec-header column-grid-1">Capacity</span>
            <div class="column-grid-2">
              <SInput
                label="Capacity"
                v-model="walletInfo.capacity"
                type="number"
                :error="getFormErrorMessage($v.walletInfo.capacity)"
                :readonly="stateDisable"
              />
              <SSelect
                label="Capacity Unit"
                v-model="walletInfo.capacityUnit"
                :source="
                  walletInfo.walletType == 'Currency'
                    ? currencyData
                    : CapacityUnitFuel
                "
                resultsValue="resultsValue"
                resultsDisplay="resultsDisplay"
                :autocomplete="true"
                @selected="onSelectedCapacityUnit"
                @clear="clearSelectedCapacityUnit"
                :error="getFormErrorMessage($v.walletInfo.capacityUnit)"
                :readonly="stateDisable"
              />
            </div>
          </div>
          <div class="separator"></div>
          <span class="sec-header column-grid-1">Threshold</span>
          <div class="column-grid-2">
            <SSelect
              label="Threshold Type"
              v-model="walletInfo.thresholdType"
              :source="thresholdSrc"
              resultsValue="resultsValue"
              resultsDisplay="resultsDisplay"
              :autocomplete="true"
              @selected="onSelected"
              :error="getFormErrorMessage($v.walletInfo.thresholdType)"
              :readonly="stateDisable"
            />

            <SInput
              label="Threshold Value"
              v-model="walletInfo.thresholdValue"
              type="number"
              :error="getFormErrorMessage($v.walletInfo.thresholdValue)"
              :readonly="stateDisable"
            />
          </div>
        </div>
      </SAccordion>

      <SAccordion
        title="Asset & User Information"
        expandIcon="arrows"
        :open="false"
        :border="false"
        :padding="'32'"
        v-margin-top="32"
        ref="assetInformationAccordion"
        @state="assetInformationAccordionFunction"
        :shadow="true"
      >
        <div class="accordion-content" :key="update + 'AssetUserInfo'">
          <span class="sec-header column-grid-1">Asset</span>
          <div
            v-margin-top="16"
            v-margin-bottom="16"
            v-grid="2"
            class="column-grid-2"
          >
            <SSelect
              label="Asset Category"
              v-model="walletInfo.categoryName"
              :source="categories"
              resultsValue="label"
              resultsDisplay="label"
              :autocomplete="true"
              @selected="onSelectedAssetCategory"
              @clear="clearSelectedAssetCategory"
              @input="onInputAssetCategory"
              :error="getFormErrorMessage($v.walletInfo.categoryName)"
              :readonly="stateDisable"
            />
            <SSelect
              label="Asset Name"
              v-model="walletInfo.assetName"
              :source="assetList"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="onSelectedAssetName"
              @clear="clearSelectedAssetName"
              :error="getFormErrorMessage($v.walletInfo.assetName)"
              :readonly="stateDisable"
            />
          </div>
          <div class="separator"></div>
          <span class="sec-header column-grid-1">User</span>
          <div class="column-grid-2">
            <SSelect
              label="User"
              v-model="walletInfo.fullName"
              :source="users"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="onSelectedUser"
              @clear="clearSelectedUser"
              :error="getFormErrorMessage($v.walletInfo.fullName)"
              :readonly="stateDisable"
            />
          </div>
        </div>
      </SAccordion>

      <SAccordion
        v-if="transactions && transactions.length > 0"
        title="Transactions"
        expandIcon="arrows"
        :open="false"
        :border="false"
        :padding="'32'"
        v-margin-top="32"
        ref="transactionsInformationAccordion"
        @state="transactionsInformationAccordionFunction"
        :shadow="true"
      >
        <div class="transaction-accordion-content">
          <table>
            <tr>
              <th>Transaction Type</th>
              <th>Transaction Date</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
            <tr v-for="(item, index) in transactions" :key="index">
              <td>
                {{
                  item.transactiontype ? $title_case(item.transactiontype) : "-"
                }}
              </td>
              <td>{{ item.dateTime ? item.dateTime : "-" }}</td>
              <td>
                {{
                  item.quantity && item.quantityUnit
                    ? `${item.quantity} ${$title_case(item.quantityUnit)}`
                    : item.quantity
                    ? item.quantity
                    : "-"
                }}
              </td>
              <td>
                {{
                  item.rate && item.rateCurrency
                    ? `${item.rate} ${item.rateCurrency}`
                    : item.rate
                    ? item.rate
                    : "-"
                }}
              </td>
              <td>
                {{
                  item.total && item.rateCurrency
                    ? `${item.total.toFixed(2)} ${item.rateCurrency}`
                    : item.total
                    ? `${item.total.toFixed(2)}`
                    : "-"
                }}
              </td>
            </tr>
          </table>
        </div>
      </SAccordion>
    </div>
    <div></div>
    <div style="position: relative">
      <sidebar
        class="sidebar"
        :walletInfo="walletInfo"
        @submit-clicked="submitClicked"
        v-margin-top="48"
        :key="update + 'sideBar'"
        :stateDisable="stateDisable"
      />
    </div>
  </div>
</template>

<script>
import Sidebar from "../../wallet/components/Sidebar.vue";
import countriesByCurrency from "../../../shared/CountriesByCurrency";
import { AssetManagementService } from "../../../services/AssetManagementService";
import { AssetPersonnelService } from "../../../services/AssetPersonnelService";
import { Functions } from "@/shared/Functions";
import { required, maxValue } from "vuelidate/lib/validators";

export default {
  name: "Wallet",

  components: {
    Sidebar,
  },

  data() {
    return {
      walletName: "",
      walletType: "",
      wallet: "",
      assetCategory: "",
      assetName: "",
      user: null,
      currencyData: [],
      categories: [],
      update: 0,
      users: [],
      asstes: [],
      assetList: [],
      walletInfo: {
        allowedNegative: false,
        assetCategory: "",
        assetName: "",
        assetUUID: "",
        capacity: "",
        capacityUnit: "",
        categoryName: "",
        fullName: "",
        productType: "",
        thresholdType: "",
        thresholdValue: "",
        userUUID: "",
        walletName: "",
        walletType: "",
      },
      selectedCategory: {},
      walletTypeData: [
        { resultsValue: "Fuel", resultsDisplay: "Fuel" },
        { resultsValue: "Currency", resultsDisplay: "Currency" },
      ],
      productTypeFuel: [
        { resultsValue: "Diesel", resultsDisplay: "Diesel" },
        { resultsValue: "Petrol", resultsDisplay: "Petrol" },
      ],
      CapacityUnitFuel: [
        { resultsValue: "Gal", resultsDisplay: "Gal" },
        { resultsValue: "Ltr", resultsDisplay: "Ltr" },
      ],
      thresholdSrc: [{ resultsValue: "Lower", resultsDisplay: "Lower" }],

      source: [
        { resultsDisplay: "one", resultsValue: 1 },
        { resultsDisplay: "otwo", resultsValue: 2 },
        { resultsDisplay: "three", resultsValue: 3 },
      ],
    };
  },
  props: {
    edit: {
      Type: Boolean,
      default: false,
    },
    walletData: {
      type: Object,
    },
    showToast: {
      type: Function,
    },
    stateDisable: {
      type: Boolean,
      default: false,
    },
    transactions: {
      type: Array,
    },
  },
  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    walletInfoAccordionFunction(val) {
      if (this.$refs.walletInfoAccordion.openFlag === true) {
        this.$refs.assetInformationAccordion.openFlag = false;
        if (this.$refs.transactionsInformationAccordion) {
          this.$refs.transactionsInformationAccordion.openFlag = false;
        }
      }
    },

    assetInformationAccordionFunction(val) {
      if (this.$refs.assetInformationAccordion.openFlag === true) {
        this.$refs.walletInfoAccordion.openFlag = false;
        if (this.$refs.transactionsInformationAccordion) {
          this.$refs.transactionsInformationAccordion.openFlag = false;
        }
      }
    },

    transactionsInformationAccordionFunction() {
      if (this.$refs.transactionsInformationAccordion.openFlag === true) {
        this.$refs.walletInfoAccordion.openFlag = false;
        this.$refs.assetInformationAccordion.openFlag = false;
      }
    },

    onSelected(val) {},

    clearSelectedWalletType() {
      this.walletInfo.walletType = "";
      this.walletInfo.capacityUnit = "";
      this.walletInfo.productType = "";
      this.update++;
    },

    onInput(val) {
      this.walletInfo.capacityUnit = "";
      this.walletInfo.productType = "";
      this.update++;
    },

    onInputAssetCategory(val) {},

    onSelectedAssetCategory(val) {
      this.$emit("asset-category-select", val);
      let temp = [];
      this.assetList = [];
      if (this.walletInfo.assetUUID === null || this.assets === undefined) {
        return temp;
      }
      for (let asset of this.assets) {
        if (asset.categoryUUID === this.walletInfo.assetCategory) {
          temp.push({ name: asset.label, uuid: asset.uuid });
        }
      }
      this.assetList = temp;
      this.update++;
    },

    clearSelectedAssetCategory() {
      this.$emit("asset-category-select", null);
      this.walletInfo.categoryName = "";
      this.walletInfo.assetName = "";
      this.assetList = [];
      this.update++;
    },

    getUserName() {
      if (!this.users) {
        return "";
      }
      for (let user of this.users) {
        if (user.uuid === this.walletInfo.userUUID) {
          return user.name;
        }
      }
    },

    onSelectedAssetName(val) {
      this.$emit("asset-selected", val.selectedObject);
      this.update++;
    },

    clearSelectedAssetName() {
      this.$emit("asset-selected", null);
      this.walletInfo.assetName = "";
      this.update++;
    },

    onSelectedProductType(val) {
      if (this.walletInfo.walletType === "Currency") {
        this.walletInfo.capacityUnit = val.value;
      }
      this.update++;
    },

    clearSelectedProductType() {
      this.walletInfo.productType = "";
      if (this.walletInfo.walletType === "Currency") {
        this.walletInfo.capacityUnit = "";
      }
      this.update++;
    },

    onSelectedCapacityUnit(val) {
      if (this.walletInfo.walletType === "Currency") {
        this.walletInfo.productType = val.value;
      }
      this.update++;
    },

    clearSelectedCapacityUnit() {
      this.walletInfo.capacityUnit = "";
      if (this.walletInfo.walletType === "Currency") {
        this.walletInfo.productType = "";
      }
      this.update++;
    },

    onSelectedUser(val) {
      this.$emit("user-selected", val.selectedObject);
      this.update++;
    },

    clearSelectedUser() {
      this.$emit("user-selected", null);
      this.walletInfo.fullName = "";
      this.update++;
    },

    checkboxInput(val) {},

    filterCurrency(val, update, abort) {
      update(() => {
        const value = val.toLowerCase();
        //  let temp = [];
        this.currencyData = this.filterCurrencyOption.filter(
          (v) => console.log("fil", v) //v.resultsDisplay.toLowerCase().indexOf(value) > -1
        );
      });
    },

    getAllCategories(currentUserDetails) {
      let stringOptionAssetCategory = [];
      AssetManagementService.getAllAssetCategories(
        currentUserDetails.organizationId
      )
        .then((response) => {
          let categories = [];
          for (let categoryObj of response.data.categories) {
            let category = {
              value: categoryObj.id,
              categoryUUID: categoryObj.uuid,
              label: categoryObj.name,
            };
            categories.push(category);
            stringOptionAssetCategory.push(category);
          }
          categories.sort((category1, category2) => {
            let value = 0; // no change
            if (category1.label < category2.label) {
              value = -1; // 2 before 1
            } else if (category2.label < category1.label) {
              value = 1; // 1 before 2
            }
            return value;
          });
          this.categories = categories;
          stringOptionAssetCategory = this.categories;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAllAsset(currentUserDetails) {
      AssetManagementService.getAllAssets(currentUserDetails.organizationId)
        .then((response) => {
          let assets = [];
          for (let assetObj of response.data.assets) {
            if (assetObj) {
              let asset = {
                uuid: assetObj.uuid,
                categoryUUID: assetObj.categoryUUID,
                label: assetObj.name,
              };
              assets.push(asset);
            }
          }
          this.assets = assets;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getAllUsers(currentUserDetails) {
      AssetPersonnelService.getAllUsers(currentUserDetails.organizationId)
        .then((response) => {
          let users = [];
          for (let userObj of response.data.users) {
            let user = {
              uuid: userObj.uuid,
              name: userObj.name,
              userName: userObj.userName,
            };
            users.push(user);
            users.sort((user1, user2) => {
              let value = 0; // no change
              if (user1.name < user2.name) {
                value = -1; // 2 before 1
              } else if (user2.name < user1.name) {
                value = 1; // 1 before 2
              }
              return value;
            });
          }
          this.users = users;
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.$emit("showToast", error.response.description, "error");
          } else {
            this.$emit("showToast", "An Unexpectd Error Occurred.", "error");
          }
        });
    },

    submitClicked() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit("showToast", "Please fill all required fields.", "warning");
        return;
      }
      this.walletInfo.orgUUID = this.currentUserDetails.profile.organizationId;
      this.walletInfo.capacity = parseInt(this.walletInfo.capacity);
      this.walletInfo.thresholdValue = parseInt(this.walletInfo.thresholdValue);

      this.$emit("submit", this.walletInfo);
    },

    // getAssets() {
    // 	let temp = [];
    // 	if (this.walletInfo.assetUUID === null || this.assets === undefined) {
    // 		return [];
    // 	}
    // 	for (let i = 0; i < this.assets.length; i++) {
    // 		if (this.assets[i].categoryUUID === this.assetCategory) {
    // 			temp.push({ name: this.assets[i].name, uuid: this.assets[i].uuid });
    // 		}
    // 	}
    // 	return temp;
    // },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAllCategories(this.currentUserDetails);
    this.getAllUsers(this.currentUserDetails);
    this.getAllAsset(this.currentUserDetails);
    countriesByCurrency.map((item) => {
      this.currencyData.push({
        resultsDisplay: item.currency_name + " - " + item.currency_code,
        resultsValue: item.currency_code,
      });
    });
  },
  mounted() {
    this.walletInfo = this.walletData;
  },

  validations: function() {
    return {
      walletInfo: {
        walletName: { required },
        walletType: { required },
        productType: { required },
        capacity: { required },
        thresholdType: { required },
        thresholdValue: {
          required,
          maxValue: maxValue(Number(this.walletInfo.capacity) - 1),
        },
        categoryName: { required },
        assetName: { required },
        fullName: { required },
        capacityUnit: { required },
      },
    };
  },

  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  display: grid;
  grid-template-columns: 8fr 0.5fr 3fr;
}
.row-col-gap {
  row-gap: 16px;
  column-gap: 16px;
}
.sec-header {
  font-size: 14px;
  line-height: 1.17;
  font-weight: bold;
}
.sidebar-container {
  position: relative;
}
.sidebar {
  //	position: fixed;
  width: 275px;
}
.py-24 {
  padding-top: 24px;
  padding-bottom: 24px;
}

.accordion-content {
  padding: 32px;
  border-top: 1px solid var(--very-light-pink);
}

.transaction-accordion-content {
  padding: 32px;
  border-top: 1px solid var(--very-light-pink);
  display: flex;
  justify-content: center;
}
.add-icon {
  float: right;
}
table {
  margin-top: 16px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  white-space: nowrap;
  cursor: default;
  box-shadow: 0 0 10px #e1e1e1;
  width: 90%;
  th {
    width: 14%;
    font-weight: bold;
    background: var(--secondary);
    color: #fff;
    padding: 16px;
    text-align: start;
  }

  td {
    padding: 16px;
    text-align: start;
  }

  tr:not(:first-child):hover {
    opacity: 1;
    background-color: #e1e1e1;
  }
}
</style>
