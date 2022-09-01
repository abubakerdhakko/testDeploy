<template>
  <SDialog
    :persistent="true"
    :title="edit == true ? 'Edit Role' : 'Create Role'"
    :width="400"
    @close="close"
  >
    <div style="padding: 24px">
      <SInput
        label="Role Name"
        v-model="roleName"
        @selected="roleInput"
        :error="getFormErrorMessage(this.$v.roleName)"
      />
      <div class="btns">
        <SButton title="Submit" @click="Create" small />

        <SButton title="Cancel" @click="Cancel" small />
      </div>
    </div>
  </SDialog>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { Functions } from "@/shared/Functions";

export default {
  name: "AddRole",

  components: {},

  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
  },

  data() {
    return {
      roleName: "",
    };
  },

  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
    roleInput(val) {
      this.$emit("get-role-name", val);
    },
    close() {
      this.$emit("close", true);
    },

    Create() {
      this.$v.roleName.$touch();
      if (this.$v.roleName.$invalid) {
        return;
      }
      this.$emit("get-role-name", this.roleName);
    },
    Cancel() {
      this.$emit("close", true);
    },
  },

  created() {
    if (this.title) {
      this.roleName = this.title;
    }
  },

  validations: function () {
    return {
      roleName: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.btns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 32px;
  margin-top: 24px;
  .btns * {
    height: 40px;
  }
}
</style>