<template>
  <div class="rmCloseIcon">
    <SDialog :title="formTitle" :persistent="true" :width="610" @close="close">
      <div style="padding: 24px 30px">
        <div class="column-grid-2">
          <SInput
            label="first name"
            v-model="personalInfo.firstName"
            :error="getFormErrorMessage($v.personalInfo.firstName)"
            :readonly="stateDisbale"
          />
          <SInput
            label="last name"
            v-model="personalInfo.lastName"
            :error="getFormErrorMessage($v.personalInfo.lastName)"
            :readonly="stateDisbale"
          />
          <SInput
            label="email"
            v-model="personalInfo.email"
            :error="getFormErrorMessage($v.personalInfo.email)"
            :readonly="stateDisbale"
          />
          <SInput
            label="contact"
            v-model="personalInfo.contact"
            :error="getFormErrorMessage($v.personalInfo.contact)"
            :readonly="stateDisbale"
          />
        </div>
        <div
          class="address-field"
          v-for="(address, index) in addresses"
          :key="index + '_address'"
        >
          <SInput
            :label="'Add Line ' + (index + 1)"
            v-model="address.name"
            :readonly="stateDisbale"
          />
          <!-- <img src="/assets/icons/Delete.svg" style="width: 18px" alt="" /> -->
          <div>
            <span
              style="
                display: inline;
                color: darkgray;
                border: 1px solid darkgray;
                padding: 0px 5px 1px 5px;
              "
              v-if="addresses.length > 1"
              @click="
                () => {
                  deleteAddressFromArray(index);
                }
              "
              >x</span
            >
          </div>
          <div>
            <img
              src="/assets/icons/Add.svg"
              style="width: 20px; float: right"
              alt=""
              v-if="
                index === addresses.length - 1 && index !== 2 && !stateDisbale
              "
              @click="addAddressFromArray"
            />
          </div>
        </div>

        <div class="column-grid-2 pb-16" :key="item">
          <div class="cross-s">
            <SSelect
              label="Country"
              v-model="personalInfo.country"
              :source="allCountries"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              :error="getFormErrorMessage($v.personalInfo.country)"
              @clear="clearSelectedCountry"
              :readonly="stateDisbale"
            />
          </div>
          <SInput
            label="State"
            v-model="personalInfo.state"
            :error="getFormErrorMessage($v.personalInfo.state)"
            :readonly="stateDisbale"
          />
          <SInput
            label="city"
            v-model="personalInfo.city"
            :error="getFormErrorMessage($v.personalInfo.city)"
            :readonly="stateDisbale"
          />
          <!-- <SMultipleSelect
            :checkbox="true"
            :avatar="false"
            v-model="personalInfo.rolesLabel"
            :label="'Roles'"
            :data="roleOptions"
            optionLabel="name"
            @selected-values="onSelectRole"
            :readonly="stateDisbale"
            :error="getFormErrorMessage($v.personalInfo.rolesLabel)"
          /> -->
          <div class="cross-s">
            <SSelect
              label="Roles"
              v-model="personalInfo.rolesLabel"
              :source="roleOptions"
              resultsValue="name"
              resultsDisplay="name"
              :autocomplete="true"
              @selected="onSelectRole"
              :error="getFormErrorMessage($v.personalInfo.rolesLabel)"
              :readonly="stateDisbale"
              @clear="clearSelectedRole"
            />
          </div>
          <!--  -->
        </div>
        <div v-if="flag === false">
          <SButton
            class="dialog-btn"
            :title="userId ? 'Update' : 'Save'"
            @click="createUser"
          />
        </div>
      </div>

      <div style="padding: 24px 30px" v-if="userId != null && flag === false">
        <div class="separator"></div>
      </div>

      <div v-if="userId != null && flag === false">
        <div style="padding-left: 32px">
          <span>Change Password</span>
        </div>
        <passwordChangePopUp :userId="userId" @showToast="showToast" />
      </div>
    </SDialog>

    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      :key="toastFlag"
    />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>
<script>
import { Countries } from "../../data/Countries";
import { AuthService } from "../../services/AuthService";
import {
  required,
  email,
  alpha,
  numeric,
  helpers,
} from "vuelidate/lib/validators";

import { Functions } from "@/shared/Functions";

import PasswordChangePopUp from "./passwordChangePopUp.vue";

import loader from "@/components/Loader.vue";
export default {
  name: "CreateUser",
  components: { PasswordChangePopUp, loader },
  data() {
    return {
      addresses: [{ name: "" }],
      personalInfo: {
        email: "",
        firstName: "",
        lastName: "",
        contact: "",
        country: "",
        city: "",
        state: "",
        rolesLabel: "",
      },
      allCountries: Countries,
      currentUserDetails: "",
      stateDisbale: "",
      item: 0,
      password: "",
      newPassword: "",
      loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      editRoleValue: "",
    };
  },
  props: {
    roleOptions: { type: Array },
    userId: {},
    flag: Boolean,
    formTitle: String,
    userDetails: {},
    // stateDisbale:Boolean,
  },
  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    clearSelectedCountry() {
      this.personalInfo.country = "";
      this.item++;
    },
    clearSelectedRole() {
      this.personalInfo.roles = "";
      (this.personalInfo.rolesLabel = ""),
        (this.editRoleValue = ""),
        this.item++;
    },

    close() {
      this.$emit("close");
    },

    deleteAddressFromArray(index) {
      this.addresses.splice(index, 1);
    },

    addAddressFromArray() {
      this.addresses.push({ name: "" });
    },

    onSelectRole(val) {
      this.personalInfo.roles = [val.selectedObject];
      var arr = [val.selectedObject];
      for (let i = 0; i < arr.length; i++) {
        this.editRoleValue = arr[i].name;
      }
    },

    createUser() {
      this.$v.personalInfo.$touch();

      if (this.$v.$invalid) {
        this.showToast(
          "Please fill all required fields without Spaces.!",
          "warning"
        );
        return;
      }
      if (this.userId != null) {
        this.loaderFlag = true;
        this.personalInfo.contactNumber = this.personalInfo.contact;
        let tempadress = "";
        this.addresses.map((element) => {
          tempadress = tempadress + " " + element.name;
          this.personalInfo.address = tempadress;
        });
        // this.personalInfo.roles = [];
        // this.personalInfo.roles = this.personalInfo.rolesLabel;
        this.personalInfo.rolesLabel = this.editRoleValue;
        this.personalInfo.organizationUUID =
          this.currentUserDetails.profile.organizationId;
        this.personalInfo.name =
          this.personalInfo.firstName + " " + this.personalInfo.lastName;
        this.personalInfo.assigned = false;
        this.personalInfo.rolesLabel = this.editRoleValue;
      } else {
        this.loaderFlag = true;
        this.personalInfo.userName = this.currentUserDetails.profile.username;
        this.personalInfo.contactNumber = this.personalInfo.contact;
        this.personalInfo.organizationUUID =
          this.currentUserDetails.profile.organizationId;
        this.personalInfo.employeeCategoryUUID =
          "c91c3ce2-ef46-42a3-be03-5990881e7c85";
        let tempadress = "";
        this.addresses.map((element) => {
          tempadress = tempadress + " " + element.name;
          this.personalInfo.address = tempadress;
        });
        // this.personalInfo.roles = [];
        // this.personalInfo.roles = this.personalInfo.rolesLabel;
        this.personalInfo.rolesLabel = this.editRoleValue;

        AuthService.createUser(this.personalInfo)
          .then((response) => {
            if (
              response !== undefined &&
              response.data.responseIdentifier === "Success"
            ) {
              this.loaderFlag = false;
              this.close();
              this.$emit("refreshSDT", response.data.description);
            }
          })
          .catch((error) => {
            if (error) {
              this.loaderFlag = false;
              this.showToast(
                "Another user with same email ID is already existed",
                "error"
              );
            }
          });
      }
    },

    getUserDetail(response) {
      //  this.loaderFlag = true;
      this.personalInfo.id = response.id;
      this.personalInfo.email = response.email;
      this.personalInfo.firstName = response.firstName;
      this.personalInfo.lastName = response.lastName;
      this.personalInfo.contact = response.contactNumber;
      this.personalInfo.country = response.country;
      this.personalInfo.uuid = response.uuid;
      this.personalInfo.city = response.city;
      this.personalInfo.state = response.state;
      this.addresses = [];
      this.addresses.push({ name: response.address });
      this.personalInfo.perivousEmail = this.personalInfo.email;
      this.item++;
      AuthService.getRolesByUserNameAndOrganizationId(
        response.email,
        response.organizationUUID
      )
        .then((res) => {
          if (res.status === 200) {
            this.personalInfo.roles = res.data;
            // this.personalInfo.rolesLabel = res.data;

            var arr = res.data;
            for (let i = 0; i < arr.length; i++) {
              this.personalInfo.rolesLabel = arr[i].name;
              this.editRoleValue = arr[i].name;
            }
            this.item++; //for re-rendering the data as the call is late and the page is reloaded
            this.loaderFlag = false;
          }
        })
        .catch((error) => {});
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },
  mounted() {},
  created() {
    document.title = this.$route.meta.title;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.stateDisbale = this.flag;
    if (this.userId != null) {
      // this.stateDisbale = true;
      this.getUserDetail(this.userDetails);
    }
  },

  validations: function () {
    const alphab = helpers.regex("alpha", /^[a-zA-Z]*$/);
    return {
      personalInfo: {
        firstName: { required, alphab },
        lastName: { required, alpha },
        email: { required, email },
        contact: { required, numeric },
        country: { required },
        city: { required, alpha },
        rolesLabel: { required },
        state: { required, alpha },

        // ...this.getRoleValidation,
      },
      // ...this.getStateValidation,
    };
  },
  computed: {
    // getStateValidation() {
    //   let validations = {};
    //   if (this.userId != null) {
    //     validations = {
    //       state: {},
    //     };
    //   } else {
    //     validations = {
    //       state: { required },
    //     };
    //   }
    //   return validations;
    // },
  },
};
</script>

<style lang="scss" scoped>
.address-field {
  display: grid;
  grid-template-columns: 1fr 32px 32px;
  column-gap: 6px;
  align-content: right;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
