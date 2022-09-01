<template>
  <SDialog
    title="Alert"
    :width="700"
    :persistent="true"
    :closeIcon="false"
    @close="close"
  >
    <div class="main-grid">
      <span class="px-16 pt-32 pb-32">Are you sure you want to Restore?</span>

      <div class="column-grid-2">
        <div></div>
        <div class="mt-8 mb-32 dialog-btn float-right" v-grid="2">
          <SButton
            rounded
            dense
            title="NO"
            @clicked-item="cancelData"
          ></SButton>
          <SButton
            rounded
            dense
            title="YES"
            style="margin-left: 5px"
            @clicked-item="restoreData"
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
    return {};
  },

  methods: {
    close() {
      this.$emit("close");
    },
    restoreData() {
      this.$emit("restoreData");
    },
    cancelData() {
      this.$emit("canceled");
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