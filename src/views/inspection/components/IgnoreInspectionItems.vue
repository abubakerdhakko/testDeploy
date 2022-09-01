<template>
  <SDialog
    title="Ignore Inspection Items"
    :width="700"
    :persistent="true"
    :closeIcon="false"
    @close="close"
  >
    <div class="main-grid">
      <STextarea
        :columns="70"
        label="Comments"
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
  props: {},
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
      this.$emit("ignoreRequest", this.ignoreCommentsField);
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