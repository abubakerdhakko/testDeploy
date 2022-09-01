<template>
  <SDialog
    title="Import Excel"
    :width="700"
    :persistent="true"
    :closeIcon="false"
    @close="close"
  >
    <div class="main-grid">
      <span class="pt-16 pb-16"
        >Use the sample Excel and fill your own data:
        <span
          @click="exportFile()"
          style="cursor: pointer; font-size: 17px; color: #4285f4"
        >
          Download sample Excel file
        </span>
      </span>
      <div class="filePickerRow">
        <span style="padding-bottom: 0.5em">Select Excel File:</span>
        <SFilePicker :ref="'imageFile'" v-model="file"></SFilePicker>
      </div>
      <div class="column-grid-2">
        <div></div>
        <div class="mt-8 mb-32 dialog-btn float-right" v-grid="2">
          <SButton
            rounded
            dense
            :title="label"
            @clicked-item="importFile"
          ></SButton>
          <SButton
            rounded
            dense
            title="Cancel"
            style="margin-left: 5px"
            @clicked-item="close"
          ></SButton>
        </div>
      </div>
    </div>
  </SDialog>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  name: "ImportExportDialog",

  components: {},
  props: {
    success: Boolean,
    id: String,
  },

  data() {
    return {
      file: "",
      label: "Import",
    };
  },

  watch: {
    success: function (newVal, oldVal) {
      if (newVal) {
        if (this.id === undefined) {
          this.label = "Create";
        } else {
          this.label = "Edit";
        }
      } else {
        this.label = "Import";
      }
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },

    exportFile() {
      this.$emit("export");
    },

    importFile() {
      this.$emit("import", { file: this.file, label: this.label });
    },
  },

  created() {},

  validations: function () {
    return {
      file: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>

.filePickerRow {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}
</style>