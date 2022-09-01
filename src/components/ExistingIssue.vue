<template>
  <SDialog
    title="Existing Issue"
    :width="700"
    :persistent="true"
    :closeIcon="false"
    @close="close"
  >
    <div class="main-grid">
      <span class="pt-16 pb-16"> Select Existing Issue</span>
      <SSelect
        label="Issue Number"
        v-model="existingIssue"
        :source="IssueNumberOption"
        resultsValue="value"
        resultsDisplay="name"
        :autocomplete="false"
        @selected="selectedIssue"
        @clear="clearSelectedIssue"
        :key="updateField"
        :error="getFormErrorMessage($v.existingIssue)"
      />
      <div class="column-grid-2">
        <div></div>
        <div class="mt-8 mb-32 dialog-btn float-right">
          <SButton
            :dropdown="false"
            rounded
            dense
            :title="'Merge'"
            @clicked-item="mergeIssue"
          ></SButton>
        </div>
      </div>
    </div>
  </SDialog>
</template>

<script>
import { Functions } from "@/shared/Functions";
import { required } from "vuelidate/lib/validators";

export default {
  name: "name",

  components: {},
  props: {
    IssueNumberOption: { type: Array },
  },
  data() {
    return {
      existingIssue: "",
      updateField: 0,
    };
  },

  methods: {
    close() {
      this.$emit("close");
    },
    mergeIssue() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$emit("showToast", "Please select issue number!", "warning");
        return;
      }
      
      this.$emit("mergeIssue", this.existingIssue);

      
    },
    newIssue() {
      this.$emit("newIssue");
    },
    selectedIssue(value) {
      this.existingIssue = value.value;
    },
    clearSelectedIssue() {
      this.existingIssue = "";
      this.updateField++;
    },
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
  },

  created() {},

  validations: function () {
    return {
      existingIssue: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>

</style>