<template >
  <SAccordion
    v-if="inspection"
    :title="inspection.name"
    expandIcon="arrows"
    :open="true"
    padding="8"
    ref="refAccordion"
    @state="clickAccordionFunction"
    :shadow="false"
    :border="false"
  >
    <div class="row">
      <SInput label="Status" v-model="inspection.status" disabled/>
      <div style="font-weight: bold; font-size: 14px; margin-top: 16px; margin-bottom:16px">
        Gallery
      </div>
      <div v-if="images.length === 0">No Images Found</div>
      <div v-else v-for="(image, index) in images" :key="index + '_image'" class="images-row">
        <img
          :src="image.content"
          style="width: 100px; height: 100px"
          @click="fullscreenImage(image.content)"
        />
      </div>
    </div>
  </SAccordion>
</template>

<script>
import InspectionService from "../../../services/InspectionService";
import WorkOrderService from "../../../services/WorkOrderService";
export default {
  name: "InspectionItem",

  components: {},

  data() {
    return {
      value: "",
      labels: { checked: "Passed", unchecked: "Failed" },
      images: [],
    };
  },

  methods: {
    clickAccordionFunction() {
      this.$emit("accordion-click", this.$refs.refAccordion.openFlag);
    },
    fullscreenImage(){
      console.log("Full image function")
    }
  },

  created() {
    let uuids = [];
    for (let i = 0; i < this.inspection.inspectionReportFields.length; i++) {
      uuids.push(this.inspection.inspectionReportFields[i].uuid);
    }
    WorkOrderService.getImageVoicesByIssueUUIDSOrFieldUUIDS(uuids)
      .then((res) => {
        for (let [key, value] of Object.entries(res.data.imageVoices)) {
          for (let i = 0; i < res.data.imageVoices[key].length; i++) {
            InspectionService.getFile(res.data.imageVoices[key][i].contentUrl)
              .then((res) => {
                this.images.push({
                  content: "data:image/png;base64," + res.data.content,
                  name: res.data.fileName,
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  validations: function () {
    return {};
  },

  props: {
    inspection: {},
  },
};
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 24px;
}
.row {
  padding-left: 8px;
  padding-right: 8px;
}
.images-row{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-content: center;
  align-items: center;
  column-gap: 16px;
  row-gap:24px
}
</style>