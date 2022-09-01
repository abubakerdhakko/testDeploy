<template>
  <div class="content-wrapper">
    <div v-grid="2">
      <span><b>Work Order Number</b></span>
      <span>{{ workOrderDetail.workOrder.workOrderNumber}}</span>
    </div>
    <div class="row-grid-3" v-if="assignUser === '-'">
     
    </div>
  </div>
</template>

<script>
import AssetPersonnelService from "../../../services/AssetPersonnelService";
import WorkOrderService from "../../../services/WorkOrderService";
export default {
  name: "WorkOrderDetail",

  components: {},

  data() {
    return {
      
    };
  },

  props: {
    workOrderDetail:{type:Object}
  },

  methods: {
    
  },

  created() {},

  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  padding: 24px 96px;
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
  margin-top: 16px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  white-space: nowrap;
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
.row-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 8px;
  align-items: center;
}
</style>
