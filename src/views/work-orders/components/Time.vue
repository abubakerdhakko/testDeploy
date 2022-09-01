<template>
  <div class="content-wrapper" v-padding-x="'24px'">
    <div v-margin-top="16" class="header bold">Work Orders Time</div>

    <div v-grid="3" class="box">
      <SInput
        label="Name"
        v-model="workOrderDetail.assignees[0].name"
        disabled
      />
      <SInput
        label="Time"
        v-model="workOrderDetail.assignees[0].totalWorkedTimeFormatted"
        disabled
      />
      <div
        style="text-align: right"
        v-if="workOrderDetail.assignees[0].totalWorkedTimeFormatted == null"
      >
        <SButton
          style="width: 100px; float: right"
          title="Add Time"
          @click="addTime"
        />
      </div>
    </div>
    <!-- <table>
      <tr>
        <th>Name</th>
        <th>Time</th>
      </tr>
      <tr v-for="(assign, index) in workOrderDetail.assignees" :key="index">
        <td>{{ assign.name }}</td>
        <td>{{ assign.totalWorkedTimeFormatted }}</td>
      </tr>
    </table> -->

    <TimeDialog
      :workOrderDetail="workOrderDetail"
      v-if="addTimeFlag"
      @close="closeDialog"
      @showToast="showToast"
    />

    <!-- Toast Component -->
    <SToast
      :message="toastMessage"
      :time-out="toastTimeOut"
      :type="toastType"
      :key="toastFlag"
    />
    <!-- Toast Component -->
  </div>
</template>

<script>
import TimeDialog from "../components/TimeDialog";
export default {
  name: "Time",

  components: {
    TimeDialog,
  },

  data() {
    return {
      currentUserDetails: null,
      addTimeFlag: false,
      toastMessage: "",
      toastType: "success",
      toastFlag: 0,
      toastTimeOut: 3000,
    };
  },

  props: {
    workOrderDetail: {
      type: Object,
    },
  },

  methods: {
    addTime() {
      this.addTimeFlag = true;
    },
    closeDialog() {
      this.addTimeFlag = false;
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      this.toastFlag++;
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
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

.box {
  text-align: right;
  align-items: center;
  column-gap: 8px;
  margin-top: 16px;
  align-content: end;
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
.row-col-gap {
  column-gap: 8px;
  row-gap: 16px;
}
</style>
