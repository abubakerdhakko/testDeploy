<template>
  <div class="content-wrapper">
    <div v-grid="1"></div>
    <div class="row-grid-3" :key="userReset">
      <SSelect
        label="User Group"
        v-model="userGroup"
        :source="usersGroupData"
        resultsValue="groupName"
        resultsDisplay="groupName"
        :autocomplete="true"
        @selected="userGroupsHandler"
        @clear="clearSelectedUserGroup"
        :key="userReset + '_userGroup'"
      />
      <SSelect
        label="User*"
        v-model="workOrderDetail.workOrder.assignedToUserName"
        :source="usersData"
        resultsValue="name"
        resultsDisplay="name"
        :autocomplete="true"
        @selected="selectedUser"
        :key="userReset + '_user'"
        :error="
          getFormErrorMessage(
            this.$v.workOrderDetail.workOrder.assignedToUserName
          )
        "
        @clear="clearSelectedUser"
      />
    </div>

    <div v-margin-top="32" class="header bold"></div>
  </div>
</template>

<script>
import AssetPersonnelService from "@/services/AssetPersonnelService";

import { Functions } from "@/shared/Functions";
import { required } from "vuelidate/lib/validators";
export default {
  name: "Assignment",

  components: {},

  data() {
    return {
      user: "",
      userGroup: "",
      selectedPoolUser: "",
      userReset: 0,
      usersData: [],
      usersGroupData: [],
      allUsers: [],
      currentUserDetails: null,
      workOrderPoolData: [],
    };
  },

  props: {
    assignUser: { type: String },
    workOrderDetail: { type: Object },
  },
  validations: function() {
    return {
      workOrderDetail: {
        workOrder: {
          assignedToUserName: { required },
        },
      },
    };
  },
  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    clearSelectedUserGroup() {
      this.userGroup = [];
      this.workOrderDetail.workOrder.assignedToUserName = null;
      this.usersData = this.allUsers;
      this.userReset++;
    },

    clearSelectedUser() {
      this.workOrderDetail.workOrder.assignedToUserName = null;
      this.userReset++;
    },

    checkValidations() {
      this.$v.$touch();
      return this.$v.$invalid ? true : false;
    },

    selectedUser(value) {
      this.selectedPoolUser = value.selectedObject;
      this.workOrderDetail.workOrder.assignedToUserName = this.selectedPoolUser.name;
      this.workOrderDetail.workOrder.assignedToUserUUID = this.selectedPoolUser.uuid;
    },

    userGroupsHandler(data) {
      if (data.selectedObject.groupName === "Old") {
        this.usersData = this.allUsers;
      } else {
        AssetPersonnelService.getUserGroupByUUID(
          data.selectedObject.groupUUID
        ).then((response) => {
          this.usersData = [];
          this.user = "";
          this.usersData = response.data.userGroup.users;
        });
      }
      this.workOrderDetail.workOrder.assignedToUserName = "";
      this.userReset++;
    },

    getUsersGroup(tenantUUID) {
      AssetPersonnelService.getAllUserGroup(tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            this.usersGroupData = response.data.groups;
            this.usersGroupData.push({
              groupUUID: "Old",
              groupName: "Old",
            });
          }
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },

    getAllUsers(tenantUUID) {
      AssetPersonnelService.getAllUsers(tenantUUID)
        .then((response) => {
          if (response.status === 200) {
            this.allUsers = response.data.users;
            this.usersData = response.data.users;
          }
        })
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getUsersGroup(this.currentUserDetails.profile.organizationId);
    this.getAllUsers(this.currentUserDetails.profile.organizationId);
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  padding: 24px 24px;
  border-top: 1px solid var(--very-light-pink);
}

.header {
  font-size: 14px;
  line-height: 1;
}

.sub-header {
  font-size: 12px;
  line-height: 1.17;
}
.sec-text {
  font-size: 10px;
  line-height: 1.25;
}
.title-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  white-space: nowrap;
}
table {
  margin-top: 16px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  white-space: nowrap;
  cursor: default;

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
.row-grid-3 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 16px;
  align-items: center;
}
</style>
