<template>
  <div>
    <SDialog
      title="Inspection Items"
      :persistent="true"
      :width="610"
      @close="close"
    >
      <InspectionItem
        v-if="inspectionReportItem && imageVoices && assetUUID"
        :inspectionReportItem="inspectionReportItem"
        :imageVoices="imageVoices"
        :assetUUID="assetUUID"
        :workOrder="workOrder"
        :type="type"
      >
      </InspectionItem>
    </SDialog>
  </div>
</template>
<script>
import InspectionItem from "@/components/InspectionItems";
export default {
  name: "InspectionItems",
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close");
    },
    accordionClick($event, index, length) {},
  },
  mounted() {},
  created() {},
  validations: function() {
    return {};
  },

  components: {
    InspectionItem,
  },
  props: {
    assetUUID: {},
    imageVoices: {},
    inspectionReportItem: {},
    workOrder: {},
    type: {}
  },
};
</script>

<style lang="scss" scoped></style>
