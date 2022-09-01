<template>
  <div class="main-grid mt-32">
    <div class="row-header">
      <div>
        <span class="head-title">My Profile</span><br />
        <span class="subtitle"
          >Manage your profiles and preferences below.</span
        >
      </div>
    </div>
    <div class="row-content">
      <div>
        <SAccordion
          :title="'User Information'"
          :open="true"
          :subAccordion="false"
          :border="false"
          :formContent="true"
          :padding="'96'"
          @state="personalInfoAccordionClick"
          ref="personalInfoAccordion"
        >
          <div class="border-custom" style="padding: 32px 0px 0px 96px">
            <span>PERSONAL INFORMATION</span>
          </div>
          <div class="info-grid">
            <div>
              <s-input
                :label="'First Name'"
                v-model="usrObj.firstName"
              ></s-input>

              <s-input
                :label="'Gender'"
                v-model="usrObj.gender"
                class="mt-30"
              ></s-input>

              <s-input
                :label="'Email Address'"
                v-model="usrObj.email"
                class="mt-30"
              >
              </s-input>

              <s-input :label="'City'" v-model="usrObj.city" class="mt-30">
              </s-input>
            </div>
            <div>
              <s-input :label="'Last Name'" v-model="usrObj.lastName"></s-input>

              <s-input
                :label="'Contact'"
                v-model="usrObj.firstName"
                class="mt-30"
              >
              </s-input>

              <s-input
                :label="'Address'"
                v-model="usrObj.address"
                class="mt-30"
              >
              </s-input>

              <s-input
                :label="'Country'"
                v-model="usrObj.country"
                class="mt-30"
              >
              </s-input>
              <SButton
                class="create-profile"
                style="margin-top: 16px"
                title="Update Personal Info"
                v-width="180"
                @click="editPersonalInfo()"
              ></SButton>
            </div>
          </div>
          <div class="border-custom" style="padding: 32px 0px 0px 96px">
            <span>COMPNAY INFORMATION</span>
          </div>
          <div class="info-grid">
            <div>
              <s-input :label="'Name'" v-model="companyInfo.name"></s-input>

              <s-input
                :label="'Conatct'"
                v-model="companyInfo.contact"
                class="mt-30"
              ></s-input>

              <s-input
                :label="'Email Address'"
                v-model="companyInfo.email"
                class="mt-30"
              >
              </s-input>

              <s-input
                :label="'Website'"
                v-model="companyInfo.website"
                class="mt-30"
              >
              </s-input>
            </div>
            <div>
              <s-input :label="'City'" v-model="companyInfo.city"></s-input>

              <s-input
                :label="'Address'"
                v-model="companyInfo.address"
                class="mt-30"
              >
              </s-input>

              <s-input
                :label="'Country'"
                v-model="companyInfo.country"
                class="mt-30"
              >
              </s-input>

              <s-input
                :label="'Currency'"
                v-model="companyInfo.currency"
                class="mt-30"
              >
              </s-input>
              <SButton
                class="create-profile"
                style="margin-top: 16px"
                title="Update Company Info"
                v-width="180"
                @click="editCompanyInfo()"
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
          :padding="'96'"
          ref="securityInfoAccordion"
          @state="securityAccordionClick"
        >
          <div class="sec-content border-custom">
            <div>
              <span>CHANGE PASSWORD</span>
            </div>
            <div class="row-input mt-16">
              <s-input
                :label="'Enter Old Password'"
                v-model="oldPassword"
                :type="'password'"
              ></s-input>
              <div></div>
            </div>
            <div class="row-input mt-16">
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
            <div class="row-input mt-16">
              <div></div>
              <div>
                <SButton
                  class="create-profile"
                  title="Update Password"
                  v-width="180"
                  @click="editPassword()"
                ></SButton>
              </div>
            </div>
          </div>
          <div class="sec-content border-custom" v-if="this.isAdmin === true">
            <div>
              <span>CHANGE OTHER USER PASSWORD</span>
            </div>
            <div class="row-input mt-16">
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
            </div>
            <div class="row-input mt-16">
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
            <div class="row-input mt-16">
              <div></div>
              <div>
                <SButton
                  class="create-profile"
                  title="Change User Password"
                  v-width="180"
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
          :padding="'96'"
          ref="notificationInfoAccordion"
          @state="notificationAccordionClick"
        >
          <div class="sec-content border-custom">
            <div class="row-input mt-24">
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
                  >Receive notifications when your assign a person to an
                  asset</span
                >
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
                  >Receive notifications when your unassign a person from an
                  asset</span
                >
              </div>
            </div>
            <div class="row-input mt-24">
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
                  >Receive notifications for your due/pending inspections</span
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
            </div>
            <div class="row-input mt-24">
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
            </div>
            <div class="row-input mt-24">
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
                <span>Receive notifications when your issues are created</span>
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
                <span>Receive notifications when on incoming messages </span>
              </div>
            </div>
            <div class="row-input mt-24">
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
                  >Receive notifications when your work orders are updated
                </span>
              </div>
            </div>
            <div class="row-input mt-24">
              <div></div>
              <div>
                <SButton
                  class="create-profile"
                  title="Update Notifications"
                  v-width="180"
                  @click="editNotifications()"
                ></SButton>
              </div>
            </div>
          </div>
        </SAccordion>

        <SAccordion
          :title="'User Preference'"
          :open="false"
          :subAccordion="false"
          :border="false"
          :formContent="true"
          :padding="'96'"
          @state="preferenceInfoAccordionClick"
          ref="preferenceInfoAccordion"
        >
          <div class="border-custom" style="padding: 32px 96px">
            <SSelect
              label="Currency Location*"
              v-model="currency"
              :source="currencyOption"
              resultsDisplay="label"
              resultsValue="value"
              :autocomplete="true"
              :error="getFormErrorMessage(this.$v.currency)"
            />
            <div style="padding-top: 16px">
              <SButton
                class="create-profile"
                title="Update Preferences"
                v-width="180"
                @click="editPreference()"
              ></SButton>
            </div>
          </div>
        </SAccordion>
      </div>
      <div></div>
      <div>
        <div class="edit-block">
          <div class="circle" ref="circle" id="testing">
            <!-- :style="bgImg" -->
            <img id="profileImage" class="profileImg" :src="profileImage" />
            <!-- style="display:none" -->
            <div class="edit">
              <!-- <img  src="../../assets/icons/Edit.png" class="icon" alt="Edit" @click="click"/> -->
            </div>
          </div>
        </div>
        <!-- <input type="file" :id="'hiddenInput'" v-bind:value="valuee" @change="getFile" hidden multiple/> -->
        <input type="file" id="fileUpload" @change="getFile" class="hidden" />
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from "../../services/AuthService";
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import countriesByCurrency from "../../shared/CountriesByCurrency";
import { Functions } from "@/shared/Functions";
import { required } from "vuelidate/lib/validators";

export default {
  name: "Account",
  data() {
    return {
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
      currentUserDetails: "",
      usersOptions: [],
      selectedUser: "",
      userSelected: "",
      companyInfo: {},
      currencyOption: [],
      currency: "",
    };
  },
  methods: {
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
            //preference need to be add here as it not coming from backend
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
        // alert("Successfully created");
        if (this.fileName != null) {
          if (e.target.files.length > 1) {
            // if multiple files are uploaded
            alert("Please Upload a single file at a time.");
          } else {
            //in case of single file
            var size = Number(e.target.files[0].size / Math.pow(1024, 2));
            if (size > 4) {
              alert(
                "The File size limit exceeded. Please upload a picture less than 4 MBs"
              );
            } else {
              // this.successFlag = true;
              var reader = new FileReader();
              reader.readAsDataURL(e.target.files[0]);
              reader.onload = function () {
                document.getElementById("profileImage").src = reader.result;
                this.profileImage = document.getElementById("profileImage").src;
              };
            }
          }
        } else {
          this.errorFlag = true;
        }
      } else {
        alert("The File APIs are not fully supported in this browser.");
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
            alert("Personal Notification Updated Scccessfully");
          } else {
            alert("Personal Notification Not Updated Scccessfully");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Personal Notification Service Error ");
        });
    },
    editPassword() {
      if (this.oldPassword === "") {
        alert("Old Password Field is not filled");
        return;
      }

      if (this.password === "" || this.newPassword === "") {
        alert("Password Field is not filled");
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
              alert("Password Updated Scccessfully.");
            } else {
              alert("Password Cannot Be Updated Scccessfully!");
            }
          })
          .catch((error) => {
            console.log(error);
            alert("Password Cannot Be Change Serivce not working!");
          });
      } else {
        alert("Password not matched ");
      }
    },
    editOtherUserPassword() {
      if (this.userSelected === "") {
        alert("other User is not selected");
        return;
      }
      if (this.otherPassword === "" || this.otherNewPassword === "") {
        alert("Password Field is not filled");
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
              alert("Other User Password Updated Scccessfully.");
            } else {
              alert("Other User Password Cannot Be Updated Scccessfully!");
            }
          })
          .catch((error) => {
            console.log(error);
            alert("Other User Password Cannot Be Change Serivce not working!");
          });
      } else {
        alert("Password not matched of other user");
      }
    },
    editCompanyInfo() {
      AssetPersonnelService.updateCompany({ company: this.companyInfo })
        .then((res) => {
          if (res.status === 200) {
            alert("Company Information Updated Scccessfully");
          } else {
            alert("Company Information Not Updated Scccessfully");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Company Information Saving Error ");
        });
    },
    editPersonalInfo() {
      AssetPersonnelService.updateUser({ user: this.usrObj })
        .then((res) => {
          if (res.status === 200) {
            alert("Personal Information Updated Scccessfully");
          } else {
            alert("Personal Information Not Updated Scccessfully");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Personal Information Saving Error ");
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
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let requestObject = {
        uuid: this.currentUserDetails.profile.organizationId,
        currency: this.currency,
      };
      AssetPersonnelService.createCurrency(requestObject)
        .then((res) => {
          if (res.status === 200) {
            alert("Successfully Save Currency");
          } else {
            alert("Fail Saveing Currency");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  computed: {
    bgImg() {
      // let imgStr = new Buffer(this.profileImage, "base64");
      // let img = imgStr.toString();
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
  validations: function () {
    return {
      currency: { required },
    };
  },
};
</script>

<style lang="scss" scoped>
.main-grid {
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

  .row-content {
    display: grid;
    grid-template-columns: 7fr 1fr 2fr;
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
        padding: 0px 96px 16px 96px;
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
</style>
