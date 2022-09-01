<template>
  <SDialog
    title="Un Assigned User"
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
        <div class="pt-16">
          <SCheckBox
            v-model="selectUser.currentDateTime"
            label="Current Date and Time"
            @input="funcName"
          />
        </div>
        <SInput
          label="Un-Assignment Date"
          v-model="selectUser.assignmentDate"
          :icon="'calendar'"
          :type="'datePicker'"
          :disabled="disable"
          :error="$v.selectUser.assignmentDate.$error ? 'Invalid' : ''"
        />
        <STimePicker
          manual-input
          label="Un-Assignment Time"
          :format="''"
          :disabled="disable"
          :border="true"
          close-on-complete
          v-model="selectUser.assignmentTime"
          :error="$v.selectUser.assignmentTime.$error ? 'Invalid' : ''"
          :key="index + 'time'"
        />
      </div>

      <div class="button-row pt-16">
        <SButton title="Un-Assign" @click="UnAssignUser" />
      </div>
    </div>
  </SDialog>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import moment from "moment";
export default {
  name: "AssignUserPopUp",

  components: {},

  data() {
    return {
      index: 0,
      selectUser: {
        user: [],
        assignmentDate: null,
        assignmentTime: "",
        currentDateTime: false,
      },

      disable: false,
    };
  },
  props: {
    assignedUsers: {},
  },
  methods: {
    close() {
      this.$emit("close");
      this.selectUser = {
        assignmentDate: null,
        assignmentTime: "",
        currentDateTime: false,
      };
      this.index++;
    },
    UnAssignUser() {
      if (this.selectUser.currentDateTime === true) {
        //  console.log("test true curent time",this.selectUser);
        this.selectUser.uuid = this.assignedUsers.uuid;
        this.$emit("UnAssignUser", this.selectUser);
      } else if (this.selectUser.currentDateTime === false) {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.selectUser.uuid = this.assignedUsers.uuid;
        this.selectUser.assignmentUUID = this.assignedUsers.assignmentId;
        this.$emit("UnAssignUser", this.selectUser);
      }
    },
    funcName(val) {
      if (val === true) {
        this.disable = true;
        this.selectUser.assignmentDate = "";
        this.selectUser.assignmentTime = "";
        this.index++;
      } else {
        this.disable = false;
      }
    },
  },

  created() {},

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