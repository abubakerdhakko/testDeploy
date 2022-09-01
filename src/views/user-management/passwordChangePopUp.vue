<template>
  <div>
    <div style="padding: 24px 30px">
      <div class="column-grid-2 pb-16">
        <SInput
          label="New Password"
          v-model="password"
          :error="getFormErrorMessage($v.password)"
          type="password"
        />
        <SInput
          label="Confirm Password"
          v-model="newPassword"
          :error="getFormErrorMessage($v.newPassword)"
          type="password"
        />
      </div>
      <div>
        <SButton
          class="dialog-btn"
          title="Update Password"
          @click="comingSoon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { required, sameAs } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";

import { AuthService } from "../../services/AuthService";

export default {
  name: "passwordChangePopUp",

  components: {},
  props: {
    userId: {},
  },

  data() {
    return {
      password: "",
      newPassword: "",
    };
  },

  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

    updatePassword() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit("showToast", "Please fill password fields.!", "warning");
        return;
      }

      /* todo::emits a function to invoke loader 
    this.loaderFlag = true;  */
      let updateUserPassword = {
        /* username: this.personalInfo.email, */
        newPassword: this.password,
        confirmPassword: this.newPassword,
      };
      AuthService.updateOtherUsersPassword(updateUserPassword)
        .then((res) => {
          if (res.status === 200) {
            /* todo::emits a function to invoke loader
            this.loaderFlag = false; */
            this.$emit(
              "showToast",
              "Password updated successfully!",
              "success"
            );
            this.close();
            return;
          }
        })
        .catch((error) => {
          if (error) {
            /* todo::emits a function to invoke loader
            this.loaderFlag = false; */
            this.$emit(
              "showToast",
              "Password is not updated, Please try again later",
              "error"
            );
          }
        });
    },

    comingSoon() {
      this.$emit(
        "showToast",
        "This functionality is under process and will be live soon.",
        "warning"
      );
    },
  },

  created() {},

  validations: function() {
    return {
      password: { required },
      newPassword: { sameAs: sameAs("password") },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.grid-create-user {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 8px;
  row-gap: 16px;
  padding: 32px 30px;
  padding-bottom: 0px;
}
</style>
