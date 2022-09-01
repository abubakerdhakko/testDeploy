<template>
  <SDialog
    title="Create Issue"
    :width="700"
    :persistent="true"
    :closeIcon="false"
    @close="close"
  >
    <div class="main-grid">
      <span class="pt-16 mb-16">
        Create a new issue or add to an existing issue?</span
      >
      <div class="mt-8 mb-32 dialog-btn btn-gap">
        <SButton
          :dropdown="false"
          rounded
          dense
          :title="'Existing'"
          @clicked-item="existingIssue"
        ></SButton>
        <SButton
          :dropdown="false"
          rounded
          dense
          :title="'New'"
          @clicked-item="newIssue"
        ></SButton>
      </div>
    </div>
  </SDialog>
</template>

<script>
export default {
  name: "name",

  components: {},

  data() {
    return {};
  },

  methods: {
    close() {
      this.$emit("close");
    },
    existingIssue() {
      this.$emit("existingIssue");
    },
    newIssue() {
      this.$emit("newIssue");
    },
    createAsset() {},
  },

  created() {},

  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.btn-gap {
  gap: 2%;
}
</style>
