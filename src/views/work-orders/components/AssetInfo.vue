<template>
  <div class="content-wrapper">
    <div class="title-grid">
      <div>
        <SInput
          label="Asset Name"
          v-model="assetInfo.assetDetail.name"
          :disabled="true"
        />
      </div>

      <div>
        <SInput
          label="Model Number"
          v-model="assetInfo.assetDetail.modelNumber"
          :disabled="true"
        />
      </div>

      <div>
        <SInput
          label="Manufacture"
          v-model="assetInfo.assetDetail.manufacture"
          :disabled="true"
        />
      </div>
    </div>
    <div v-margin-top="32" class="header bold">Work Orders</div>
    <table>
        <tr>
            <th>Work Order #</th>
            
            <th>Date</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        <tr v-for="(workOrder, index) in workOrders" :key="index">
            <td>{{workOrder.workOrderNumber}}</td>
           
            <td>{{workOrder.createdAt | date}}</td>
            <td>{{workOrder.priority}}</td>
            <td>{{workOrder.assignedToUserName}}</td>
            <td>{{workOrder.status}}</td>
            <td> <img
            src="/assets/icons/Results.svg"
            alt=""
            width="20px"
            style="cursor: pointer"
            @click="vieWorkOrder(workOrder)"
          /></td>
        </tr>
    </table>
    <div class="pagination" v-if="workOrders.length > 0">
			<SPagination
				v-model="currentPage"
				:page-count="numberOfPages"
				@input="pagination"
				:minimal="false"
			/>
		</div>
    <SSnackbar
				:message="snackBarMessage"
				v-if="snackbarFlag"
				:time="3000"
				:close="false"
				color="#00000"
				:background="SnackBarBackground"
				borderColor="rgba(42, 193, 236,1)"
			/>
  </div>
</template>

<script>
import WorkOrderService from '../../../services/WorkOrderService';
export default {
  name: "AssetInfo",

  components: {},

  data() {
    return {
      workOrders:[],
      currentPage: 1,
      numberOfPages: 0,
      rowsPerPage:5,
      snackbarFlag: false,
      snackBarMessage: "",
      SnackBarBackground: ""
    };
  },

  props: {
    assetInfo: { type: Object },
  },

  methods: {

    getPaginatedWorkOrders(val){
      WorkOrderService.getPaginatedWorkOrdersByAsset(val - 1,this.rowsPerPage,this.assetInfo.assetDetail.uuid)
        .then((response) => {
          if(response.status === 200){
            this.numberOfPages = response.data.workOrders.totalPages
            this.workOrders = response.data.workOrders.content
          }
        }).catch(error => {
            this.SnackBarBackground = "#Ff0000";
						this.snackBarMessage = error;
						this.snackbarFlag = true;
        })
    },

    pagination(val){
      this.getPaginatedWorkOrders(val)
    },

    vieWorkOrder(WorkOrder){
       this.$router.push({
          name: "work-order-details",
          params:{
            workuuid:WorkOrder.uuid,
            type:'view'
          }
        });

      this.$router.go({
        name: "work-order-details",
        params:{
          workuuid:WorkOrder.uuid,
          type:'view'
        }
      });
      window.location.reload();
    },
  },

  created() {
    this.getPaginatedWorkOrders(this.currentPage)
  },

  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
  .content-wrapper {
    border-top: 1px solid var(--very-light-pink);
      padding: 24px 24px;
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
    cursor: default;
      // white-space: nowrap;

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

  .pagination {
      display: flex;
      justify-content: flex-end;
  }
</style>
