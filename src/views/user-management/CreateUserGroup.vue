<template>
  <div>
    <SDialog :title="formLabel" :persistent="true" :width="610" @close="close">
      <div style="padding: 24px 30px">
        <div class="column-grid-2 pb-16" :key="value + 'user'">
          <SInput
            label="Group Name*"
            v-model="groupName"
            :readonly="editable"
            :error="getFormErrorMessage($v.groupName)"
          />
          <SMultipleSelect
            :checkbox="true"
            :avatar="false"
            label="Select Users*"
            v-model="selectedUsers"
            :data="test"
            :optionLabel="'userName'"
            @selected-values="onSelectUser"
            :readonly="editable"
            :error="getFormErrorMessage($v.selectedUsers)"
          />
          <SSelect
            label="Group Manager*"
            v-model="managerName"
            :source="selectUsers"
            resultsValue="name"
            resultsDisplay="name"
            :autocomplete="true"
            @selected="onManagerNameSelect"
            :readonly="editable"
            :error="getFormErrorMessage($v.managerName)"
            @clear="clearSelectedManagerName"
          />
        </div>
        <div class="separator"></div>
        <SButton
          v-if="this.formLabel == 'Create User Group'"
          class="dialog-btn"
          title="Save"
          @click="createUserGroup"
        />
        <SButton
          v-if="this.formLabel == 'Edit User Group'"
          class="dialog-btn"
          title="Update"
          @click="UpdateUserGroup"
        />
      </div>
    </SDialog>

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import { AssetPersonnelService } from "../../services/AssetPersonnelService";
import loader from "@/components/Loader.vue";

import { required } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";

export default {
  name: "CreateUserGroup",
  components: { loader },
  data() {
    return {
      loaderFlag: false,
      //   formLable:"Create User Group",
      groupName: "",
      selectedUsers: [],
      selectUsers: [],
      managerName: "",
      managerUUID: "",
      currentUserDetails: "",
      test: [],
      editable: false,
      value: 0,
    };
  },
  props: {
    //	userNameOptions: { type: Array },
    viewObj: {},
    formLabel: String,
    userGroupDetail: {},
  },

  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    clearSelectedManagerName() {
      this.managerName = "";
      this.value++;
    },
    close(reload) {
      this.$emit("close", reload);
      this.formLable = "Create User Group";
    },
    onSelectUser(val) {
      this.selectUsers = val;
    },
    onManagerNameSelect(obj) {
      this.managerUUID = obj.selectedObject.uuid;
    },
    createUserGroup() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit("showToast", "Please fill all required fields.!", "warning");
        return;
      }
      this.loaderFlag = true;
      let temporary = [];
      for (let index = 0; index < this.selectedUsers.length; index++) {
        temporary.push(this.selectedUsers[index].uuid);
      }

      let group = {
        userUUIDs: temporary,
        groupName: this.groupName,
        managerUserName: this.managerName,
        managerUUID: this.managerUUID,
        groupMember: this.selectedUsers,
        createdByUserName: this.currentUserDetails.profile.username,
        createdByUserUUID: this.currentUserDetails.profile.userid,
        tenantUUID: this.currentUserDetails.profile.organizationId,
      };
      AssetPersonnelService.createGroup(group)
        .then((response) => {
          if (response.status === 200) {
            this.loaderFlag = false;
            this.$emit(
              "showToast",
              "User Group Created Successfully",
              "success"
            );
            this.close(true);
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          this.$emit("showToast", error.data.description, "error");
        });
    },
    UpdateUserGroup() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit("showToast", "Please fill all required fields.!", "warning");
        return;
      }
      this.loaderFlag = true;
      let temporary = [];
      for (let index = 0; index < this.selectedUsers.length; index++) {
        temporary.push(this.selectedUsers[index].uuid);
      }
      let group = {
        userUUIDs: temporary,
        groupUUID: this.viewObj.obj.uuid,
        groupName: this.groupName,
        managerName: this.managerName,
        managerUUID: this.managerUUID,
        groupMember: this.selectedUsers,
        editByUserName: this.currentUserDetails.profile.username,
        editByUserUUID: this.currentUserDetails.profile.userid,
        tenantUUID: this.currentUserDetails.profile.organizationId,
      };
      AssetPersonnelService.updateGroup(group)
        .then((response) => {
          if (response.status === 200) {
            this.loaderFlag = false;
            this.$emit(
              "showToast",
              "User Group Updated Successfully",
              "success"
            );
            this.close(true);
          }
        })
        .catch((error) => {
          this.loaderFlag = false;
          this.$emit("showToast", error.data.description, "error");
        });
    },
  },
  created() {
    document.title = this.$route.meta.title;
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.loaderFlag = true;
    AssetPersonnelService.getAllUsers(
      this.currentUserDetails.profile.organizationId
    ).then((response) => {
      for (let index = 0; index < response.data.users.length; index++) {
        //   response.data.users[index].createdAt = moment(response.data.users[index].createdAt).format("DD/MM/yyyy");
        let user = {
          uuid: response.data.users[index].uuid,
          name:
            response.data.users[index].email +
            " " +
            "(" +
            response.data.users[index].name +
            ")",
          userName: response.data.users[index].userName,
          gender: response.data.users[index].gender,
          fname: response.data.users[index].name,
          email: response.data.users[index].email,
          contact: response.data.users[index].contactNumber,
          city: response.data.users[index].city,
          Managerselected: false,
          manager: false,
        };
        this.test.push(user);
      }
      if (this.viewObj.obj !== undefined) {
        // AssetPersonnelService.getUserGroupByUUID(this.viewObj.obj.uuid)
        // .then((res) => {
        let userGroupDetail = this.userGroupDetail;
        this.groupName = userGroupDetail.groupName;

        for (let index = 0; index < userGroupDetail.users.length; index++) {
          let user = {
            uuid: userGroupDetail.users[index].uuid,
            name:
              userGroupDetail.users[index].email +
              " " +
              "(" +
              userGroupDetail.users[index].name +
              ")",
            userName: userGroupDetail.users[index].userName,
            gender: userGroupDetail.users[index].gender,
            fname: userGroupDetail.users[index].name,
            email: userGroupDetail.users[index].email,
            contact: userGroupDetail.users[index].contactNumber,
            city: userGroupDetail.users[index].city,
            Managerselected: false,
            manager: false,
          };
          this.selectedUsers.push(user);
        }
        this.managerName = userGroupDetail.managerUserName;
        this.value++;
        this.loaderFlag = false;
        // })
        // .catch((e) => {
        // 	console.log(e);
        // });
      } else {
        this.loaderFlag = false;
      }

      if (this.viewObj.editable) {
        this.editable = true;
      }
    });
  },

  validations: function() {
    return {
      groupName: { required },
      selectedUsers: { required },
      managerName: { required },
    };
  },
};
</script>

<style lang="scss" scoped></style>
