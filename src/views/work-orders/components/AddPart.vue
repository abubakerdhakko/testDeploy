<template>
  <div>
    <SDialog title="Part" :persistent="true" :width="600" @close="close">
      <div class="column-grid-2 pt-32 px-32">
        <SInput
          label="Part Name"
          v-model="part.partName"
          :error="$v.part.partName.$error ? 'Required' : ''"
        />
        <SInput
          label="Qty"
          v-model="part.quantity"
          type="number"
          :error="$v.part.quantity.$error ? 'Required' : ''"
          @input="QuantityChange(part.quantity)"
          :class="quantityVal == true ? 'Q_Error' : ''"
        />
        <SInput
          :label="'Unit Cost (' + currency + ')'"
          v-model="part.cost.amount"
          type="number"
          :error="$v.part.cost.amount.$error ? 'Required' : ''"
          :class="costAmountVal == true ? 'Q_Error' : ''"
          @input="costAmountChange(part.cost.amount)"
        />
        <SInput
          :label="'Total tax (' + currency + ')'"
          v-model="part.cost.taxAmount"
          type="number"
          :error="$v.part.cost.taxAmount.$error ? 'Required' : ''"
          :class="taxAmountVal == true ? 'Q_Error' : ''"
          @input="taxAmountChange(part.cost.taxAmount)"
        />
      </div>
      <div>
        <SButton
          v-if="type"
          style="width: 150px; padding: 24px 30px"
          title="Update"
          @click="updatePart"
        />
        <SButton
          v-else
          style="width: 150px; padding: 24px 30px"
          title="Save"
          @click="addPart"
        />
      </div>
    </SDialog>
  </div>
</template>
<script>
import WorkOrderService from "../../../services/WorkOrderService";
import { required } from "vuelidate/lib/validators";
export default {
  name: "AddPart",
  data() {
    return {
      currentUserDetails: "",
      part: {
        cost: {
          amount: 0,
          taxAmount: 0,
        },
      },
      resolutionUUID: "",
      quantityVal: true,
      costAmountVal: true,
      taxAmountVal: true,
    };
  },
  methods: {
    QuantityChange(val) {
      if (val == 0) {
        this.quantityVal = true;
      } else {
        this.quantityVal = false;
      }
    },
    costAmountChange(val) {
      if (val == 0) {
        this.costAmountVal = true;
      } else {
        this.costAmountVal = false;
      }
    },
    taxAmountChange(val) {
      if (val == 0) {
        this.taxAmountVal = true;
      } else {
        this.taxAmountVal = false;
      }
    },
    close() {
      this.$emit("close");
    },

    updatePart() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let data = {
        partName: this.part.partName,
        issueUUID: this.issueUUID,
        quantity: this.part.quantity,
        uuid: this.part.uuid,
        partUUID: "dummy-part-uuid-link-with-inventory", //TODO: partUUID is to be set when their are parts and inventory in project
        addedByUserName:
          this.currentUserDetails.profile.firstName +
          " " +
          this.currentUserDetails.profile.lastName,
        addedByUserUUID: this.currentUserDetails.profile.userid,
        cost: {
          amount: this.part.cost.amount,
          addedByUserName:
            this.currentUserDetails.profile.firstName +
            " " +
            this.currentUserDetails.profile.lastName,
          addedByUserUUID: this.currentUserDetails.profile.userid,
          taxAmount: this.part.cost.taxAmount,
          description: "Part cost",
          issueUUID: this.part.issue,
        },
      };
      let addPartRequest = {
        partUsed: data,
        issueUUID: this.issueUUID,
        workOrderUUID: this.workOrder.workOrder.uuid,
        resolutionUUID: this.resolutionUUID,
      };
      WorkOrderService.updatePart(addPartRequest)
        .then((res) => {
          console.log(res);
          if (res.data.responseCode === "200") {
            alert("update Part Successfully");
            this.$emit("updatePart");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addPart() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let data = {
        partName: this.part.partName,
        issueUUID: this.issueUUID,
        quantity: this.part.quantity,
        partUUID: "dummy-part-uuid-link-with-inventory", //TODO: partUUID is to be set when their are parts and inventory in project
        addedByUserName:
          this.currentUserDetails.profile.firstName +
          " " +
          this.currentUserDetails.profile.lastName,
        addedByUserUUID: this.currentUserDetails.profile.userid,
        cost: {
          amount: this.part.cost.amount,
          addedByUserName:
            this.currentUserDetails.profile.firstName +
            " " +
            this.currentUserDetails.profile.lastName,
          addedByUserUUID: this.currentUserDetails.profile.userid,
          taxAmount: this.part.cost.taxAmount,
          description: "Part cost",
          issueUUID: this.part.issue,
        },
      };
      let addPartRequest = {
        partUsed: data,
        issueUUID: this.issueUUID,
        workOrderUUID: this.workOrder.workOrder.uuid,
        resolutionUUID: this.resolutionUUID,
      };
      WorkOrderService.addPart(addPartRequest)
        .then((res) => {
          // console.log(res);
          if (res.data.responseCode === "200") {
            alert("add Part Successfully");
            this.$emit("createPart");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {},
  created() {
    if (this.type === true) {
      this.part = this.parts;
      if (this.parts.quantity > 0) {
        this.quantityVal = false;
      } if (this.parts.cost.amount > 0) {
        this.costAmountVal = false;
      }  if (this.parts.cost.taxAmount > 0) {
        this.taxAmountVal = false;
      }
    }

    WorkOrderService.getResolutionsByWorkOrderUUID(
      this.workOrder.workOrder.uuid
    )
      .then((res) => {
        for (let i = 0; i < res.data.resolutions.length; i++) {
          if (
            res.data.resolutions[i].workOrderUUID ===
            this.workOrder.workOrder.uuid
          ) {
            this.resolutionUUID = res.data.resolutions[i].uuid;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
  },
  validations: function () {
    return {
      part: {
        partName: { required },
        quantity: { required },
        cost: {
          amount: { required },
          taxAmount: { required },
        },
      },
    };
  },

  components: {},
  props: {
    issueUUID: {},
    workOrder: {},
    currency: {},
    type: {},
    parts: {},
  },
};
</script>

<style lang="scss" scoped>
.c-grid {
  padding: 24px 30px;
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 26px;
}
.px-30 {
  padding: 0px 30px 0px 30px;
}
</style>