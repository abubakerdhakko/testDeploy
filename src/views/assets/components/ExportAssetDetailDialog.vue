<template>
  <div>
    <SDialog
      title="Export Asset CSV"
      :width="700"
      :persistent="true"
      :closeIcon="false"
      @close="close"
    >
      <div class="main-grid">
        <span class="pt-16 pb-16">Kindly Select Type of Asset Export</span>
        <div class="column-grid-2">
          <div></div>
          <div class="mt-8 mb-32 dialog-btn float-right" v-grid="2">
            <SButton
              rounded
              dense
              title="Table Export"
              @clicked-item="tableExport('table')"
            ></SButton>
            <SButton
              rounded
              dense
              title="Detail Export"
              style="margin-left: 5px"
              @clicked-item="tableExport('detail')"
            ></SButton>
          </div>
        </div>
      </div>
    </SDialog>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  name: "ExportAssetDetailDialog.vue",

  components: {},
  props: {},

  data() {
    return {};
  },

  watch: {},

  methods: {
    close() {
      this.$emit("close");
    },

    tableExport(val) {
      this.$emit("exportData", val);
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
  },

  validations: function () {
    return {
      file: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>

</style>