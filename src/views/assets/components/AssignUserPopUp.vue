<template>
  <SDialog
    title="Select User"
    :width="700"
    :persistent="true"
    class="popup"
    :closeIcon="false"
    @close="close"
  >
    <div class="main-wrapper" v-padding="'20px'">
      <div class="cate-field">
        <!-- <SMultipleSelect
					:checkbox="true"
					label="Users"
					v-model="selectUser.user"
					:avatar="false"
					:data="Users"
					optionLabel="label"
					@selected="onSelected"
					:key="index"
				/> -->
        <SSelect
          label="User"
          v-model="selectUser.selectedUser"
          :source="this.Users"
          resultsValue="name"
          resultsDisplay="label"
          :autocomplete="true"
          :key="index"
          @selected="onUserSelected"
          @clear="clearUser"
          @input-value="clearUser"
        />
        <SInput
          label="Assignment Date"
          v-model="selectUser.assignmentDate"
          :icon="'calendar'"
          :type="'datePicker'"
          :disabled="disable"
          :error="$v.selectUser.assignmentDate.$error ? 'Invalid' : ''"
          :key="index + 'date'"
        />

        <STimePicker
          manual-input
          label="Assignment Time"
          :format="''"
          :disabled="disable"
          :border="true"
          close-on-complete
          v-model="selectUser.assignmentTime"
          :error="$v.selectUser.assignmentTime.$error ? 'Invalid' : ''"
          :key="index + 'time'"
        />
      </div>
      <div class="pt-16">
        <SCheckBox
          v-model="selectUser.currentDateTime"
          label="Current Date and Time"
          @input="funcName"
        />
      </div>
      <div v-if="this.assignedUsers.flag !== true" class="button-row pt-16">
        <SButton title="Assign" @click="AssignUser" />
      </div>
      <div v-if="this.assignedUsers.flag === true" class="button-row pt-16">
        <SButton title="Update" @click="updateAssignUser" />
      </div>
    </div>
        <!-- Load Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </SDialog>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import moment from "moment";
import loader from "../../../components/Loader.vue";
export default {
  name: "AssignUserPopUp",

  components: {
    loader
  },

  data() {
    return {
      index: 0,
      selectUser: {
        selectedUser: "",
        user: [],
        assignmentDate: null,
        assignmentTime: "",
        currentDateTime: false,
      },
      loaderFlag: false,
      disable: false,
    };
  },
  props: {
    Users: { type: Array },
    assignedUsers: {},
    //key:{}
  },
  methods: {
    clearUser() {
      this.selectUser.user = [];
      this.selectUser.selectedUser = "";
    },

    onUserSelected(val) {
      let user = this.Users.filter(
        (u) => u.uuid === val.selectedObject.uuid
      )[0];
      if (user !== undefined && user !== null) {
        this.selectUser.user.push(user);
      }
    },

    close() {
      this.$emit("close");
      this.selectUser = {
        selectedUser: "",
        user: [],
        assignmentDate: null,
        assignmentTime: "",
        currentDateTime: false,
      };
      this.assignedUsers.flag = false;
      this.disable = false;
      this.index++;
    },
    AssignUser() {

      if (
        this.selectUser.currentDateTime === true &&
        this.selectUser.user != ""
      ) {
        this.$emit("AssignUser", this.selectUser);
              
      } else if (
        this.selectUser.currentDateTime === false &&
        this.selectUser.user != ""
      ) {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }

        this.$emit("AssignUser", this.selectUser);
        this.close();

      }
    },
    updateAssignUser() {
      let date = Date();
      var currentDate = moment(date).format("DD-MM-YYYY");
      if (
        currentDate > this.selectUser.assignmentDate ||
        currentDate == this.selectUser.assignmentDate
      ) {
        this.selectUser.assignmentId = this.assignedUsers.assignmentId;
        this.$emit("updateAssignUser", this.selectUser);
        this.close();
      } else if (this.selectUser.assignmentDate > currentDate) {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.selectUser.assignmentId = this.assignedUsers.assignmentId;
        this.$emit("updateAssignUser", this.selectUser);
        this.close();
      }
    },
    onSelected(value) {
      this.selectUser = value;
      this.$emit("onSelected", value);
    },
    funcName(val) {
      if (val === true) {
        this.selectUser.assignmentDate = "";
        this.selectUser.assignmentTime = "";
        this.disable = true;
        this.index++;
      } else {
        this.disable = false;
      }
    },
  },

  created() {
    // debugger
    if (this.assignedUsers.flag === true) {
      let date = Date();
      var currentDate = moment(date).format("DD-MM-YYYY");
      if (
        currentDate > this.assignedUsers.startDate ||
        currentDate == this.assignedUsers.startDate
      ) {
        let assign = this.assignedUsers;
        this.selectUser.user.push({
          label: assign.name,
          name: assign.name,
          uuid: assign.uuid,
        });
        this.selectUser.selectedUser = assign.name;
        this.selectUser.assignmentDate = moment(
          this.assignedUsers.startDate
        ).format("DD MMM YYYY");
        this.selectUser.assignmentTime = moment(
          this.assignedUsers.startDate
        ).format("hh:mm:ss A");
        this.index++;
      } else if (this.assignedUsers.startDate > currentDate) {
        this.selectUser.user.push({
          label: this.assignedUsers.name,
          name: this.assignedUsers.name,
          uuid: this.assignedUsers.uuid,
        });
        this.selectUser.selectedUser = this.assignedUsers.name;
        this.selectUser.assignmentDate = moment(
          this.assignedUsers.startDate
        ).format("DD MMM YYYY");
        this.selectUser.assignmentTime = moment(
          this.assignedUsers.startDate
        ).format("hh:mm:ss A");
        this.index++;
      } else if (this.assignedUsers.startDate < currentDate) {
        this.selectUser.user.push({
          label: this.assignedUsers.name,
          name: this.assignedUsers.name,
          uuid: this.assignedUsers.uuid,
        });
        this.selectUser.selectedUser = this.assignedUsers.name;
        this.selectUser.assignmentDate = moment(
          this.assignedUsers.startDate
        ).format("DD MMM YYYY");
        this.selectUser.assignmentTime = moment(
          this.assignedUsers.startDate
        ).format("hh:mm:ss A");
        this.index++;
      }
    }
  },

  validations: function () {
    return {
      selectUser: {
        assignmentDate: { required },
        assignmentTime: { required },
      },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.button-row {
  display: grid;
  grid-gap: 10px;
  float: right;
  align-items: right;
  margin-bottom: 250px;
}
.cate-field {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 20px;
}
.popup {
  height: 470px;
}
</style>