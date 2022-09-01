<template>
  <div class="page-content mt-32">
    <div class="row-content">
      <div>
        <SAccordion
          :title="'User Information'"
          :open="true"
          :subAccordion="false"
          :border="false"
          :formContent="true"
          :padding="'30'"
          @state="personalInfoAccordionClick"
          ref="personalInfoAccordion"
        >
          <div class="border-custom" style="padding:32px 0px 0px 30px;">
            <span>PERSONAL INFORMATION</span>
          </div>
          <div style="padding: 24px 30px">
            <div class="column-grid-2">
              <s-input
                :label="'First Name'"
                v-model="usrObj.firstName"
                :error="getFormErrorMessage($v.usrObj.firstName)"
              ></s-input>

              <s-input
                :label="'Last Name'"
                v-model="usrObj.lastName"
                :error="getFormErrorMessage($v.usrObj.lastName)"
              ></s-input>

              <s-input
                :label="'Email Address'"
                v-model="usrObj.email"
                :error="getFormErrorMessage($v.usrObj.email)"
                readonly
              >
              </s-input>

              <s-input
                :label="'Contact Number'"
                v-model="usrObj.contactNumber"
                :error="getFormErrorMessage($v.usrObj.contactNumber)"
              >
              </s-input>

              <s-input
                :label="'City'"
                v-model="usrObj.city"
                :error="getFormErrorMessage($v.usrObj.city)"
              >
              </s-input>

              <s-input
                :label="'Address'"
                v-model="usrObj.address"
                :error="getFormErrorMessage($v.usrObj.address)"
              >
              </s-input>

              <s-input
                :label="'Country'"
                v-model="usrObj.country"
                :error="getFormErrorMessage($v.usrObj.country)"
              >
              </s-input>
            </div>
            <div class="dialog-btn">
              <SButton
                class="create-profile mt-16"
                title="Update Personal Info"
                v-width="180"
                @click="editPersonalInfo()"
                :disable="loaderFlag"
              ></SButton>
            </div>
          </div>
          <div class="border-custom" style="padding:32px 0px 0px 30px;">
            <span>COMPANY INFORMATION</span>
          </div>
          <div style="padding: 24px 30px">
            <div class="column-grid-2">
              <s-input
                :label="'Name'"
                v-model="companyInfo.name"
                :error="getFormErrorMessage($v.companyInfo.name)"
              ></s-input>

              <s-input
                :label="'Contact Number'"
                v-model="companyInfo.contact"
                :error="getFormErrorMessage($v.companyInfo.contact)"
              ></s-input>

              <s-input
                :label="'Email Address'"
                v-model="companyInfo.email"
                :error="getFormErrorMessage($v.companyInfo.email)"
              >
              </s-input>

              <s-input
                :label="'Website'"
                v-model="companyInfo.website"
                :error="getFormErrorMessage($v.companyInfo.website)"
              >
              </s-input>

              <s-input :label="'Address'" v-model="companyInfo.address">
              </s-input>

              <s-input :label="'City'" v-model="companyInfo.city"></s-input>

              <s-input :label="'Country'" v-model="companyInfo.country">
              </s-input>

              <s-input :label="'Currency'" v-model="companyInfo.currency">
              </s-input>
            </div>
            <div class="dialog-btn">
              <SButton
                class="create-profile mt-16"
                title="Update Company Info"
                v-width="180"
                @click="editCompanyInfo()"
                :disable="loaderFlag"
              ></SButton>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          :title="'Security Settings'"
          :open="false"
          :subAccordion="false"
          :border="false"
          :formContent="true"
          class="mt-40"
          :padding="'30'"
          ref="securityInfoAccordion"
          @state="securityAccordionClick"
        >
          <div class="border-custom" style="padding:32px 0px 0px 30px;">
            <span>CHANGE PASSWORD</span>
          </div>
          <div style="padding: 24px 30px">
            <div class="column-grid-2">
              <s-input
                :label="'Enter Old Password'"
                v-model="oldPassword"
                :type="'password'"
              ></s-input>
              <div></div>
              <s-input
                :label="'Enter New Password'"
                v-model="password"
                :type="'password'"
              ></s-input>
              <s-input
                :label="'RE-Enter New Password'"
                v-model="newPassword"
                :type="'password'"
              ></s-input>
            </div>
            <div></div>
            <div class="dialog-btn">
              <SButton
                class="create-profile mt-16"
                title="Update Password"
                v-width="180"
                @click="editPassword()"
                :disable="loaderFlag"
              ></SButton>
            </div>
          </div>

          <div v-if="isAdmin === true">
            <div class="border-custom" style="padding:32px 0px 0px 30px;">
              <span>CHANGE OTHER USER PASSWORD</span>
            </div>

            <div style="padding:24px 30px">
              <div class="column-grid-2">
                <SSelect
                  label="Select User"
                  v-model="selectedUser"
                  :source="usersOptions"
                  resultsValue="label"
                  resultsDisplay="label"
                  :autocomplete="true"
                  @selected="onUserSelect"
                />
                <div></div>
                <s-input
                  :label="'Enter New Password'"
                  v-model="otherPassword"
                  :type="'password'"
                ></s-input>

                <s-input
                  :label="'RE-Enter New Password'"
                  v-model="otherNewPassword"
                  :type="'password'"
                ></s-input>
              </div>
              <div class="dialog-btn">
                <SButton
                  class="create-profile mt-16"
                  title="Change User Password"
                  v-width="200"
                  @click="editOtherUserPassword()"
                ></SButton>
              </div>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          :title="'Notification Settings'"
          :open="false"
          :subAccordion="false"
          :border="false"
          :formContent="true"
          class="mb-30 mt-40"
          :padding="'30'"
          ref="notificationInfoAccordion"
          @state="notificationAccordionClick"
        >
          <div class="border-custom" style="padding: 24px 30px">
            <div class="column-grid-2">
              <div>
                <s-select
                  :label="'Asset Assignment'"
                  :value="notificationPreset('assetAssignment')"
                  @selected="setNotifiValue($event, 'assetAssignment')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span
                  >Receive notifications when you assign a person to an asset
                </span>
              </div>

              <div>
                <s-select
                  :label="'Asset UnAssignment'"
                  :value="notificationPreset('assetUnassignment')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  @selected="setNotifiValue($event, 'assetUnassignment')"
                  class="mb-8"
                ></s-select>
                <span
                  >Receive notifications when you unassign a person from an
                  asset</span
                >
              </div>

              <div>
                <s-select
                  :label="'Inspection Reminder'"
                  :value="notificationPreset('inspectionReminder')"
                  @selected="setNotifiValue($event, 'inspectionReminder')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span
                  >Receive notifications on your due/pending inspections</span
                >
              </div>

              <div>
                <s-select
                  :label="'Faulty Inspection Created'"
                  :value="notificationPreset('faultyInspectionCreated')"
                  @selected="setNotifiValue($event, 'faultyInspectionCreated')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span
                  >Receive notifications when you create faulty inspections
                </span>
              </div>

              <div>
                <s-select
                  :label="'Inspection Created'"
                  :value="notificationPreset('inspectonCreated')"
                  @selected="setNotifiValue($event, 'inspectonCreated')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span
                  >Receive notifications when your inspections are created</span
                >
              </div>

              <div>
                <s-select
                  :label="'Updates On Issue'"
                  :value="notificationPreset('issueUpdated')"
                  @selected="setNotifiValue($event, 'issueUpdated')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span>Receive notifications when your issues are created </span>
              </div>

              <div>
                <s-select
                  :label="'Issue Created'"
                  :value="notificationPreset('issueCreated')"
                  @selected="setNotifiValue($event, 'issueCreated')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span>Receive notifications when your issues gets updated</span>
              </div>

              <div>
                <s-select
                  :label="'Recieve Messages'"
                  :value="notificationPreset('messages')"
                  @selected="setNotifiValue($event, 'messages')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span>Receive notifications on incoming messages</span>
              </div>

              <div>
                <s-select
                  :label="'Work Order Created'"
                  :value="notificationPreset('workOrderCreated')"
                  @selected="setNotifiValue($event, 'workOrderCreated')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span
                  >Receive notifications when your work orders are created</span
                >
              </div>

              <div>
                <s-select
                  :label="'Updates on Work Order'"
                  :value="notificationPreset('workOrderUpdated')"
                  @selected="setNotifiValue($event, 'workOrderUpdated')"
                  :source="notifyOptions"
                  resultsDisplay="name"
                  resultsValue="value"
                  class="mb-8"
                ></s-select>
                <span
                  >Receive notifications when your work orders gets updated
                </span>
              </div>
            </div>

            <div class="dialog-btn">
              <SButton
                class="create-profile mt-16"
                title="Update Notifications"
                v-width="180"
                @click="editNotifications()"
                :disable="loaderFlag"
              ></SButton>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          :title="'User Preference'"
          :open="false"
          :subAccordion="false"
          :border="false"
          :formContent="true"
          :padding="'30'"
          @state="preferenceInfoAccordionClick"
          ref="preferenceInfoAccordion"
        >
          <div class="border-custom" style="padding:32px 96px;">
            <SSelect
              label="Currency Location*"
              v-model="currency"
              :source="currencyOption"
              resultsDisplay="label"
              resultsValue="value"
              :autocomplete="true"
              :error="getFormErrorMessage($v.currency)"
              @clear="clearSelectedCurrency"
            />
            <div class="btn">
              <SButton
                title="Update Preferences"
                @click="editPreference()"
                v-width="180"
                :disable="loaderFlag"
              />
            </div>
          </div>
        </SAccordion>
      </div>
      <div></div>
      <div>
        <div class="edit-block">
          <div class="circle" ref="circle" id="testing">
            <img
              id="profileImage"
              class="profileImg"
              :src="profileImage"
              alt=""
            />
            <div class="edit"></div>
          </div>
        </div>
        <input type="file" id="fileUpload" @change="getFile" class="hidden" />
      </div>
    </div>

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
import { AuthService } from "../../services/AuthService";
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import countriesByCurrency from "../../shared/CountriesByCurrency";
import { Functions } from "@/shared/Functions";
import { required, email } from "vuelidate/lib/validators";

import loader from "@/components/Loader.vue";

export default {
  name: "Profile",
  data() {
    return {
      updateComp: 0,
      loaderFlag: false,
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      isAdmin: false,
      id: "",
      valuee: "",
      fileName: "",
      fstName: "",
      lstName: "",
      designation: "",
      cmpnyName: "",
      mailAddr: "",
      cntNum: "",
      oldPassword: "",
      password: "",
      newPassword: "",
      otherPassword: "",
      otherNewPassword: "",
      profileImage:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      notifyOptions: [
        { name: "None", value: 3 },
        { name: "Email", value: 2 },
        { name: "In-App Notification", value: 1 },
        { name: "Email & In-App Notification", value: "0" },
      ],
      preferences: {
        assetAssignment: 3,
        assetUnassignment: 3,
        inspectionReminder: 3,
        faultyInspectionCreated: 3,
        inspectonCreated: 3,
        issueUpdated: 3,
        issueCreated: 3,
        messages: 3,
        workOrderCreated: 3,
        workOrderUpdated: 3,
      },
      notificationValue: {},
      usrObj: {}, // To store and send user's data to backend
      personalInfo: {},
      currentUserDetails: "",
      usersOptions: [],
      selectedUser: "",
      userSelected: "",
      companyInfo: {},
      currencyOption: [],
      currency: "",
    };
  },
  components: {
    loader,
  },
  methods: {
    clearSelectedCurrency() {
      this.currency = null;
      this.updateComp++;
    },
    personalInfoAccordionClick() {
      if (this.$refs.personalInfoAccordion.openFlag) {
        this.$refs.securityInfoAccordion.openFlag = false;
        this.$refs.notificationInfoAccordion.openFlag = false;
        this.$refs.preferenceInfoAccordion.openFlag = false;
      }
    },
    securityAccordionClick() {
      if (this.$refs.securityInfoAccordion.openFlag) {
        this.$refs.personalInfoAccordion.openFlag = false;
        this.$refs.notificationInfoAccordion.openFlag = false;
        this.$refs.preferenceInfoAccordion.openFlag = false;
      }
    },
    notificationAccordionClick() {
      if (this.$refs.notificationInfoAccordion.openFlag) {
        this.$refs.personalInfoAccordion.openFlag = false;
        this.$refs.securityInfoAccordion.openFlag = false;
        this.$refs.preferenceInfoAccordion.openFlag = false;
      }
    },
    preferenceInfoAccordionClick() {
      if (this.$refs.preferenceInfoAccordion.openFlag) {
        this.$refs.personalInfoAccordion.openFlag = false;
        this.$refs.securityInfoAccordion.openFlag = false;
        this.$refs.notificationInfoAccordion.openFlag = false;
      }
    },

    click() {
      let x = document.getElementById("fileUpload");
      x.click();
    },
    setNotifications(usrObj) {
      this.notificationValue = usrObj.profile.userNotification;
    },
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    getData() {
      AssetPersonnelService.getUser(this.currentUserDetails.profile.userid)
        .then((res) => {
          if (res !== undefined && res.data.userResponse) {
            this.usrObj = res.data.userResponse;

            AuthService.getRolesByUserNameAndOrganizationId(
              this.usrObj.email,
              this.usrObj.organizationUUID
            )
              .then((res) => {
                if (res.status === 200) {
                  this.usrObj.roles = res.data;
                  this.usrObj.rolesLabel = res.data;
                }
              })
              .catch((error) => {
                console.log(error);
              });
            AssetPersonnelService.getCompany(
              this.currentUserDetails.profile.organizationId
            )
              .then((res1) => {
                this.companyInfo = res1.data.companyResponse;
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onUserSelect(obj) {
      this.userSelected = obj.selectedObject.username;
    },

    fetchOrganizationUsers() {
      AuthService.getOrganizationUsers(
        this.currentUserDetails.profile.organizationId
      )
        .then((response) => {
          if (response !== undefined && response.status === 200) {
            let fetchedUsers = [];
            response.data.forEach((user, index) => {
              fetchedUsers.push({
                id: index,
                label:
                  user.firstName + " " + user.lastName + " - " + user.username,
                value: user.firstName + " " + user.lastName,
                username: user.username,
              });
            });
            this.usersOptions = fetchedUsers;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setNotifiValue($event, val) {
      this.preferences[val] = $event.selectedObject.value;
    },

    notificationPreset(val) {
      if (this.preferences[val] === 3) {
        return "None";
      }
      if (this.preferences[val] === 2) {
        return "Email";
      }
      if (this.preferences[val] === 1) {
        return "In-App Notification";
      }
      if (this.preferences[val] === "0") {
        return "Email & In-App Notification";
      } else {
        return "None";
      }
    },

    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    getFile(e) {
      this.fileName = e.target.files[0].name;

      if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (this.fileName != null) {
          if (e.target.files.length > 1) {
            // if multiple files are uploaded
            this.showToast("Please Upload a single file at a time.", "error");
          } else {
            //in case of single file
            var size = Number(e.target.files[0].size / Math.pow(1024, 2));
            if (size > 4) {
              this.showToast(
                "The File size limit exceeded. Please upload a picture less than 4 MBs",
                "error"
              );
            } else {
              var reader = new FileReader();
              reader.readAsDataURL(e.target.files[0]);
              reader.onload = function() {
                document.getElementById("profileImage").src = reader.result;
                this.profileImage = document.getElementById("profileImage").src;
              };
            }
          }
        } else {
          this.errorFlag = true;
        }
      } else {
        this.showToast(
          "The File APIs are not fully supported in this browser.",
          "error"
        );
      }
    },
    editNotifications() {
      for (let key of Object.keys(this.preferences)) {
        if (this.preferences[key] === "0") {
          this.preferences[key] = parseInt(this.preferences[key]);
        }
      }
      let notification = {
        preferences: this.preferences,
        userUUID: this.currentUserDetails.profile.userid,
      };
      AssetPersonnelService.updatePreferencesNotifcation(notification)
        .then((res) => {
          if (res.data.responseCode === "F200") {
            this.showToast(
              "Personal Notification Updated Successfully",
              "success"
            );
          } else {
            this.showToast(
              "Personal Notification Not Updated Successfully",
              "error"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.showToast("Personal Notification Service Error", "error");
        });
    },
    editPassword() {
      if (this.oldPassword === "") {
        this.showToast("Old Password field is empty", "error");
        return;
      }

      if (this.password === "" || this.newPassword === "") {
        this.showToast("Password field is empty", "error");
        return;
      }
      if (this.password === this.newPassword) {
        let updateUserPassword = {
          oldPassword: this.oldPassword,
          newPassword: this.password,
          confirmPassword: this.newPassword,
        };
        AuthService.updateOtherUsersPassword(updateUserPassword)
          .then((response) => {
            if (response !== undefined && response.status === 200) {
              this.showToast("Password Updated Successfully.", "success");
            } else {
              this.showToast(
                "Password Cannot Be Updated Successfully!",
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
            this.showToast(
              "Change password request failed. Service is not working",
              "error"
            );
          });
      } else {
        this.showToast("Password not matched", "error");
      }
    },
    editOtherUserPassword() {
      if (this.userSelected === "") {
        this.showToast("Other User is not selected", "warning");
        return;
      }
      if (this.otherPassword === "" || this.otherNewPassword === "") {
        this.showToast("Password field is empty", "warning");
        return;
      }

      if (this.otherPassword === this.otherNewPassword) {
        let updateUserPassword = {
          username: this.userSelected,
          newPassword: this.otherPassword,
          confirmPassword: this.otherNewPassword,
        };
        AuthService.updateOtherUsersPassword(updateUserPassword)
          .then((response) => {
            if (response !== undefined && response.status === 200) {
              this.showToast(
                "Other User Password Updated Successfully.",
                "success"
              );
            } else {
              this.showToast(
                "Other User Password Cannot Be Updated Successfully!",
                "error"
              );
            }
          })
          .catch((error) => {
            console.log(error);
            this.showToast(
              "Other User Password Cannot Be Changed Service is not working!",
              "error"
            );
          });
      } else {
        this.showToast("Password not matched of other user", "error");
      }
    },

    editCompanyInfo() {
      this.$v.companyInfo.$touch();
      if (this.$v.companyInfo.$invalid) {
        return this.showToast("Please fill all required fields", "warning");
      }
      this.loaderFlag = true;

      this.companyInfo.companyFields = [];
      AssetPersonnelService.updateCompany({ company: this.companyInfo })
        .then((res) => {
          this.loaderFlag = false;
          if (res.status === 200) {
            this.showToast(
              "Company Information Updated Successfully",
              "success"
            );
          } else {
            this.showToast(
              "Company Information Not Updated Successfully",
              "error"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.showToast("Company Information Saving Error", "error");
          this.loaderFlag = false;
        });
    },

    editPersonalInfo() {
      this.$v.usrObj.$touch();
      if (this.$v.usrObj.$invalid) {
        return this.showToast("Please fill all required fields", "warning");
      }
      this.loaderFlag = true;
      this.personalInfo.contactNumber = this.usrObj.contactNumber;
      this.personalInfo.firstName = this.usrObj.firstName;
      this.personalInfo.lastName = this.usrObj.lastName;
      this.personalInfo.address = this.usrObj.address;
      this.personalInfo.country = this.usrObj.country;
      this.personalInfo.city = this.usrObj.city;
      this.personalInfo.email = this.usrObj.email;
      this.personalInfo.uuid = this.usrObj.uuid;
      this.personalInfo.roles = this.usrObj.roles;
      this.personalInfo.rolesLabel = this.usrObj.rolesLabel;
      this.personalInfo.organizationUUID = this.currentUserDetails.profile.organizationId;
      this.personalInfo.name =
        this.usrObj.firstName + " " + this.usrObj.lastName;
      this.personalInfo.assigned = this.usrObj.assigned;
      this.personalInfo.id = this.usrObj.id;
      this.personalInfo.perivousEmail = this.usrObj.email;
      AuthService.updateUser(this.personalInfo)
        .then((res) => {
          if (res.status === 200) {
            this.loaderFlag = false;
            this.showToast(
              "Personal Information Updated Successfully",
              "success"
            );
          } else {
            this.loaderFlag = false;
            this.showToast(
              "Personal Information Not Updated Successfully",
              "error"
            );
          }
        })
        .catch((err) => {
          console.log(err);
          this.showToast("Personal Information Saving Error", "error");
          this.loaderFlag = false;
        });
    },
    getCompanyCurrency() {
      AssetPersonnelService.getCompanyCurrency(
        this.currentUserDetails.profile.organizationId
      )
        .then((res) => {
          if (res.status === 200) {
            let index = this.currencyOption.findIndex(
              (c) => c.value === res.data.currency
            );
            this.currency = this.currencyOption[index].label;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    editPreference() {
      this.$v.currency.$touch();
      if (this.$v.currency.$invalid) {
        return this.showToast("Please fill all required fields", "warning");
      }
      this.loaderFlag = true;
      let requestObject = {
        uuid: this.currentUserDetails.profile.organizationId,
        currency: this.currency,
      };
      AssetPersonnelService.createCurrency(requestObject)
        .then((res) => {
          this.loaderFlag = false;
          if (res.status === 200) {
            this.showToast("Currency Saved Successfully!", "success");
          } else {
            this.showToast("Saving Currency Failed", "error");
          }
        })
        .catch((err) => {
          this.loaderFlag = false;
          console.log(err);
          this.showToast("Saving Currency Failed", "error");
        });
    },

    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  computed: {
    bgImg() {
      return {
        background: "url(" + this.profileImage + ")",
        "background-size": "contain",
        "object-fit": "fill",
      };
    },
  },
  mounted() {
    document.title = this.$route.meta.title;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.isAdmin = this.currentUserDetails.authorities.includes("ROLE_ADMIN");
    if (this.isAdmin) {
      this.fetchOrganizationUsers();
    }
    this.getData();
    this.getCompanyCurrency();
    countriesByCurrency.map((item) => {
      this.currencyOption.push({
        label: item.country,
        value: item.currency_code,
      });
    });
  },
  validations: function() {
    return {
      currency: { required },
      usrObj: {
        firstName: { required },
        lastName: { required },
        email: { email, required },
        contactNumber: { required },
        city: { required },
        address: { required },
        country: { required },
      },
      companyInfo: {
        name: { required },
        email: {
          required,
          email,
        },
        contact: { required },
        website: { required },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.page-content {
  display: grid;
  grid-template-rows: auto auto;
  row-gap: 40px;
  background-color: #fff;
  font-family: Euclid Circular B;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  color: #000000;
  cursor: default;

  .row-header {
    display: grid;
    grid-template-columns: 7fr 3fr;
    .dropdowns {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 30px;
    }
  }

  .column-grid-2 {
    span {
      font-size: 12px;
      color: #979797;
      line-height: 1.4;
      padding: 0px !important;
    }
  }

  .row-content {
    display: grid;
    grid-template-columns: 9fr 0.5fr 2.5fr;
    .border-custom {
      border-top: solid 1px var(--very-light-pink);
    }
    .info-grid {
      display: grid;
      padding: 32px 96px 32px 96px;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 30px;
    }
    .sec-content {
      padding: 32px 0px 32px 0px;
      span {
        font-size: 12px;
        font-weight: bold;
      }
      .row-input {
        padding: 0px 96px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 30px;
        span {
          font-size: 10px;
          color: #979797;
          line-height: 1.4;
          padding: 0px !important;
        }
      }
    }
    .edit-block {
      display: grid;
      justify-items: center;
      align-items: center;
      box-shadow: 0 0 50px 0 var(--very-light-pink);
      background-color: rgba(255, 255, 255, 0);
      padding: 48px 66px;
      .circle {
        position: relative;
        display: grid;
        justify-items: center;
        align-items: center;
        height: 125px;
        width: 125px;
        border-radius: 50%;
        background: #d8d8d8;
        border: 1px solid var(--very-light-pink);
        overflow: hidden;
        .profileImg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          object-fit: fit;
          border: none !important;
        }
        .edit {
          position: absolute;
          top: 37%;
          left: 37%;
          z-index: 999;
          display: grid;
          justify-items: center;
          align-items: center;
          height: 32px;
          width: 32px;
          border-radius: 5px;
          background: #fff;
          .icon {
            height: 16px;
            width: 16px;
            opacity: 0.5;
          }
          .icon:hover {
            opacity: 1;
          }
        }
      }
    }
  }
  .mt-30 {
    margin-top: 30px;
  }
  .mb-30 {
    margin-bottom: 30px;
  }
  .mb-8 {
    margin-bottom: 8px;
  }
  .mt-40 {
    margin-top: 40px;
  }
  hr {
    border: none;
    border-top: solid 1px var(--very-light-pink);
  }
}
.hidden {
  opacity: 0;
  height: 0px;
  width: 0px;
}
.create-profile {
  float: right;
}
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
