<template>
  <div>
    <SCard :border="true" :shadow="true">
      <div v-grid="1" v-padding="'16px 32px 16px 32px'">
        <span><b>Asset Detail</b></span>
      </div>

      <div v-grid="3" v-padding="'16px 32px 16px 32px'" class="row-col-gap">
        <SInput label="Asset Name" v-model="assetDetail.name" readonly />
        <SInput label="Model #" v-model="assetDetail.modelNumber" readonly />
        <SInput
          label="Manufacturer Name/ID"
          v-model="assetDetail.manufacture"
          readonly
        />
        <SInput
          label="Purchase Date"
          v-model="assetDetail.purchaseDate"
          readonly
        />
        <SInput label="Warranty" v-model="assetDetail.warranty" readonly />

        <SInput
          label="Consumption Unit"
          v-model="assetDetail.consumptionUnit"
          readonly
        />
        <SInput
          label="Primary Usage Unit"
          v-model="assetDetail.primaryUsageUnit"
          readonly
        />
        <SInput
          label="Secondary Usage Unit"
          v-model="assetDetail.secondaryUsageUnit"
          readonly
        />
        <SInput
          label="Description"
          v-model="assetDetail.description"
          readonly
        />
        <SInput
          :label="'Maintenance Cost ' + '(' + costUnit + ')'"
          v-model="assetDetail.cost"
          :disabled="true"
        />
      </div>
    </SCard>
  </div>
</template>

<script>
import { Functions } from "@/shared/Functions";
import { required } from "vuelidate/lib/validators";
export default {
  name: "AssetSummary",

  components: {},

  data() {
    return {
      priorityOptions: [
        { label: "Low" },
        { label: "Medium" },
        { label: "High" },
      ],
      shiftOptions: [
        { label: "Morning" },
        { label: "Afternoon" },
        { label: "Evening" },
      ],
      stausOptions: [
        { label: "Open" },
        { label: "Closed" },
        { label: "In progress	" },
      ],
      costUnit: "",
    };
  },

  props: {
    assetInfo: {},
    assetDetail: {},
    disableFields: {},
    currency: {},
  },

  methods: {
    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },
  },
  validations: function () {
    return {
      assetDetail: {
        workOrder: {
          priority: { required },
          shift: { required },
          schedule: { required },
          status: { required },
          assignedToUserName: { required },
        },
      },
    };
  },
  created() {
    //	console.log(this.assetInfo);
    //console.log(this.assetDetail);
    this.costUnit = this.currency;
    //console.log(this.disableFields);
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.row-col-gap {
  column-gap: 8px;
  row-gap: 16px;
}
</style>
