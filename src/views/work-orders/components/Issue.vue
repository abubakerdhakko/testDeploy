<template>
  <div class="content-wrapper" v-if="issue">
    
    <div class="title-grid" v-padding="'0px 16px 0px 16px'">
      <div>
        <SInput label="Issue Name" v-model="issue.name" :disabled="true" />
      </div>

      <div>
        <SInput label="status" v-model="issue.status" :disabled="true" />
      </div>
      <div>
        <SInput
          :label="'Total Issue Cost (' + currency + ')'"
          :value="totalWorkOrderCost"
          :disabled="true"
          :key="totalIndex"
        />
      </div>
    </div>
    <div v-grid="1" v-padding="'16px'">
      <STextarea
        :required="true"
        v-model="workOrder.workOrder.issues[workOrderindex].instructions"
        label="Comments*"
        :disable="true"
      />
    </div>

    <div v-grid="1" v-padding="'0px 16px 0px 16px'">
      <span><b>Instruction CheckList</b></span>
    </div>

    <div
      v-grid="1"
      v-padding="'16px'"
      v-for="(instruction, index) in workOrder.workOrder.issues[workOrderindex]
        .orderInstructions"
      :key="index + '_orderInstruction'"
    >
      <SCheckBox
        v-model="
          workOrder.workOrder.issues[workOrderindex].orderInstructions[index]
            .checked
        "
        :label="
          workOrder.workOrder.issues[workOrderindex].orderInstructions[index]
            .name
        "
        :disabled="true"
        :readonly="true"
      />
    </div>

    <div v-margin-top="24" class="header bold c-grid">
      <SToggle
        v-model="selectedTab"
        :options="[
          { label: 'Parts', value: 'parts' },
          { label: 'Costs', value: 'costs' },
        ]"
        :tabs="true"
        :background="'#ffffff'"
      />
      <SButton
        v-if="this.selectedTab === 'parts'"
        title="Add Part"
        @click="addFunction"
        pill
        small
      />
      <SButton v-else title="Add Cost" @click="addFunction" pill small />
    </div>
    <table v-if="selectedTab === 'parts'" :key="partTable">
      <tr>
        <th>Name</th>
        <th>Qty.</th>
        <th>Unit Cost ({{ currency }}})</th>
        <th>Total Tax ({{ currency }}})</th>
        <th>Total Cost ({{ currency }}})</th>
        <th>Action</th>
      </tr>
      <tr v-for="(part, index) in parts" :key="index">
        <td>{{ part.partName }}</td>
        <td>{{ part.quantity }}</td>
        <td>{{ part.cost.amount }}</td>
        <td>{{ part.cost.taxAmount }}</td>
        <td>{{ part.quantity * part.cost.amount + part.cost.taxAmount }}</td>
        <td>
          <img
            src="/assets/icons/Edit.svg"
            alt=""
            width="20px"
            style="cursor: pointer"
            @click="editPart(part)"
          />
          <img
            src="/assets/icons/Delete.svg"
            alt=""
            width="20px"
            style="cursor: pointer; margin-left: 16px"
            @click="deletePart(part)"
          />
        </td>
      </tr>
    </table>

    <table v-if="selectedTab === 'costs'" :key="costTable">
      <tr>
        <th>Cost Category</th>
        <th>Unit Cost ({{ currency }}})</th>
        <th>Qty.</th>
        <th>Total Tax ({{ currency }}})</th>
        <th>total Cost ({{ currency }}})</th>
        <th>Action</th>
      </tr>
      <tr v-for="(cost, index) in costs" :key="index">
        <td>{{ cost.category }}</td>
        <td>{{ cost.amount }}</td>
        <td>{{ cost.costQuantity }}</td>
        <td>{{ cost.taxAmount }}</td>
        <td>{{ cost.costQuantity * cost.amount + cost.taxAmount }}</td>

        <td>
          <img
            src="/assets/icons/Edit.svg"
            alt=""
            width="20px"
            style="cursor: pointer"
            @click="editCost(cost)"
          />
          <img
            src="/assets/icons/Delete.svg"
            alt=""
            width="20px"
            style="cursor: pointer; margin-left: 16px"
            @click="deleteCost(cost)"
          />
        </td>
      </tr>
    </table>

    <AddPart
      v-if="addPartsDialog"
      :issueUUID="issueUUID"
      :workOrder="workOrder"
      :currency="currency"
      :type="partType"
      :parts="part"
      @close="closeDialog"
      @UpdatePart="UpdatePart"
      @createPart="createPart"
    />

    <AddCost
      v-if="addCostsDialog"
      :issueUUID="issueUUID"
      :workOrder="workOrder"
      :currency="currency"
      :type="costType"
      :costs="cost"
      @close="closeDialog"
      @updateCost="updateCost"
      @createCost="createCost"
    />
  </div>
</template>

<script>
import InspectionService from "../../../services/InspectionService";
import WorkOrderService from "../../../services/WorkOrderService";
import AddPart from "./AddPart.vue";
import AddCost from "./AddCost.vue";
export default {
  name: "Issue",

  components: {
    AddPart,
    AddCost,
  },

  data() {
    return {
      issue: "",
      parts: [],
      costs: [],
      part: "",
      cost: "",
      selectedTab: "parts",
      addPartsDialog: false,
      addCostsDialog: false,
      partsTotal: 0,
      costTotal: 0,
      totalIndex: 0,
      partTable: 0,
      costTable: 0,
      partType: false,
      costType: false,
      totalWorkOrderCost: 0,
    };
  },

  props: {
    issueUUID: {},
    workOrder: {},
    workOrderindex: {},
    currency: {},
    loaderFlag: Boolean
  },

  methods: {
    UpdatePart() {
      this.addPartsDialog = false;
      this.partType = false;
      this.getParts();
      this.$emit("sideBarIndex");
    },

    createPart() {
      this.addPartsDialog = false;
      this.getParts();
      this.$emit("sideBarIndex");
    },

    updateCost() {
      this.addCostsDialog = false;
      this.costType = false;
      this.getCosts();
      this.$emit("sideBarIndex");
    },

    createCost() {
      this.addCostsDialog = false;
      this.getCosts();
      this.$emit("sideBarIndex");
    },

    editPart(part) {
      this.part = part;
      this.partType = true;
      this.addPartsDialog = true;
    },

    deletePart(part) {
      WorkOrderService.deletePart(part.uuid)
        .then((response) => {
          if (response.status === 200) {
            alert("Part Delete Successfully");
            this.partTable++;
            this.getParts();
            this.$emit("sideBarIndex");
          }
        })
        .catch((error) => {});
    },

    editCost(cost) {
      this.cost = cost;
      this.costType = true;
      this.addCostsDialog = true;
    },

    deleteCost(cost) {
      WorkOrderService.deleteCost(cost.uuid)
        .then((response) => {
          if (response.status === 200) {
            alert("Cost Delete Successfully");
            this.costTable++;
            this.getCosts();
          }
        })
        .catch((error) => {});
    },

    addFunction() {
      if (this.selectedTab === "parts") {
        this.addPartsDialog = true;
      } else if (this.selectedTab === "costs") {
        this.addCostsDialog = true;
      }
    },
    closeDialog() {
      this.addPartsDialog = false;
      this.addCostsDialog = false;
      this.partType = false;
      this.costType = false;
    },

    getParts() {
      WorkOrderService.getPartsByIssueUUID(this.issueUUID)
        .then((res) => {
          this.parts = res.data.partUsed;
          //    var  value = "";
          for (let index = 0; index < this.parts.length; index++) {
            this.partsTotal +=
              this.parts[index].quantity * this.parts[index].cost.amount +
              this.parts[index].cost.taxAmount;
          }
          this.totalWorkOrderCost += this.partsTotal;
          this.totalIndex++;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCosts() {
      WorkOrderService.getCostsByIssueUUID(this.issueUUID)
        .then((res) => {
          this.costs = res.data.cost;
          for (let index = 0; index < this.costs.length; index++) {
            this.costTotal =
              this.costs[index].amount * this.costs[index].costQuantity +
              this.costs[index].taxAmount;
          }
          this.totalWorkOrderCost += this.costTotal;
          this.totalIndex++;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  created() {

      InspectionService.getIssuesDetailByIssuesUUID([this.issueUUID])
      .then((res) => {
        this.issue = res.data.issueDetailForWorkOrderDetails[0];
        this.$emit("loaderFalse");
      })
      .catch((err) => {
        console.log(err);
      });
    this.getParts();
    this.getCosts();
  },

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  padding: 24px 24px;
  border-top: 1px solid var(--very-light-pink);
}

.header {
  font-size: 14px;
  line-height: 1;
}

.sub-header {
  font-size: 12px;
  line-height: 1.17;
}
.sec-text {
  font-size: 10px;
  line-height: 1.25;
}
.title-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  white-space: nowrap;
}
table {
  margin-top: 24px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  width: 100%;
  // white-space: nowrap;
  cursor: default;

  th {
    width: 14%;
    font-weight: bold;
    background: var(--secondary);
    color: #fff;
    padding: 16px;
    text-align: start;
  }

  td {
    padding: 16px;
    text-align: start;
  }

  tr:not(:first-child):hover {
    opacity: 1;
    background-color: #e1e1e1;
  }
}
.c-grid {
  display: grid;
  grid-template-columns: 5fr 1fr;
  align-items: center;
}
</style>
