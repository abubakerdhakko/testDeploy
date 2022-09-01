<template>
  <div class="content-wrapper" v-if="issue">
    <div class="column-grid-3">
      <div>
        <SInput label="Issue Name" v-model="issue.issueName" :disabled="true" />
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
    <div class="column-grid-1 mt-16">
      <STextarea
        :required="true"
        v-model="issue.issueDescription"
        label="Comments*"
        :disable="true"
      />
    </div>

    <div class="column-grid-1">
      <span><strong>Instruction CheckList</strong></span>
    </div>

    <div
      class="column-grid-1"
      v-for="(instruction, index) in checklist"
      :key="index + '_orderInstruction'"
    >
      <SCheckBox
        v-model="instruction.checked"
        :label="instruction.value"
        :disabled="true"
        :readonly="true"
      />
    </div>

    <div v-margin-top="24" class="header">
      <SToggle
        v-model="selectedTab"
        :options="[
          { label: 'Parts', value: 'parts' },
          { label: 'Costs', value: 'costs' },
        ]"
        :tabs="true"
        :background="'#ffffff'"
      />
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
      </tr>
    </table>
  </div>
</template>

<script>
import InspectionService from "../../../services/InspectionService";
import WorkOrderService from "../../../services/WorkOrderService";
export default {
  name: "Issue",

  components: {},

  data() {
    return {
      issue: [],
      parts: [],
      costs: [],
      selectedTab: "parts",
      partsTotal: 0,
      costTotal: 0,
      totalIndex: 0,
      partTable: 0,
      costTable: 0,
      partType: false,
      costType: false,
      totalWorkOrderCost: 0,
      checklist: "",
      // '[{"name":"eewq","checked":false},{"name":"gteg","checked":false}]',
    };
  },

  props: {
    issueUUID: {},
    currency: {},
  },

  methods: {
    getParts(uuid) {
      WorkOrderService.getPartsByIssueUUID(uuid)
        .then((res) => {
          this.parts = res.data.partUsed;

          for (let part of this.parts) {
            this.partsTotal =
              part.quantity * part.cost.amount + part.cost.taxAmount;
          }
          this.totalWorkOrderCost += this.partsTotal;
          this.totalIndex++;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCosts(uuid) {
      WorkOrderService.getCostsByIssueUUID(uuid)
        .then((res) => {
          this.costs = res.data.cost;
          for (let cost of this.costs) {
            this.costTotal = cost.amount * cost.costQuantity + cost.taxAmount;
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
    InspectionService.servicerequestRelatedIssues(
      this.$route.params.serviceRequestUUID,
      "1",
      "0"
    )
      .then((res) => {
        this.issue = res.data.issueReportings[0];
        this.checklist = JSON.parse(
          res.data.issueReportings[0].instructionChecklist
        );
        if (res.data.issueReportings.length > 0) {
          this.getParts(this.issue.uuid);
          this.getCosts(this.issue.uuid);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  },

  validations: function() {
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
table {
  margin-top: 24px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  width: 100%;
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
