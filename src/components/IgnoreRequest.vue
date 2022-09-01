<template>
  <SDialog
    title="Ignore Issue"
    :width="700"
    :persistent="true"
    :closeIcon="false"
    @close="close"
  >
    <div class="main-grid">
      <span class="pt-16 pb-16"> {{ modelInstruction }}</span>
      <STextarea
        :columns="70"
        label="User Comments *"
        v-model="ignoreCommentsField.value"
      />

      <div class="column-grid-2">
        <div></div>
        <div class="mt-16 mb-8 dialog-btn float-right">
          <SButton
            :dropdown="false"
            rounded
            dense
            :title="'Ignore Request'"
            @clicked-item="ignoreRequest"
          ></SButton>
        </div>
      </div>
    </div>
  </SDialog>
</template>

<script>
export default {
  name: "name",

  components: {},
  props: {
    modelInstruction: String,
  },
  data() {
    return {
      ignoreCommentsField: {
        value: "",
        valid: true,
        validMessage: "",
      },
    };
  },

  methods: {
    close() {
      this.$emit("close");
    },
    ignoreRequest() {
      if (this.ignoreCommentsField.value == "") {
        return this.$emit("showToast", "Pleae add comments.", "warning");
      } else {
        this.$emit("ignoreRequest", this.ignoreCommentsField);
      }
    },
  },

  created() {},

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>

</style>