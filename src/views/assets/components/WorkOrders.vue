<template>
  <div class="main-content">
    <div class="two-column-grid pt-8 pb-8">
      <SButton title="Create Work Order" @click="redirect" />
    </div>

    <div class="accordion-content">
      <table>
        <tr>
          <th>Work Order #</th>
          <th>Asset Name</th>
          <th>Issues</th>
          <th>Created At</th>
          <th>Priority</th>
          <th>Assigned To</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        <tr v-for="(items, index) in WorkOrderList" :key="index">
          <td>{{ items.workOrderNumber }}</td>
          <td>{{ items.assetName }}</td>
          <td>{{ items.issueCount }}</td>
          <td>{{ items.createdAt }}</td>

          <td>{{ items.priority }}</td>

          <td>{{ items.assignedToUserName }}</td>
          <td>{{ items.status }}</td>

          <td>
            <img
              src="/assets/icons/Add.svg"
              alt=""
              width="20px"
              style="cursor: pointer"
              @click="viewWorkOrder(items.uuid)"
            />
          </td>
        </tr>
      </table>
      <div class="pagination">
        <SPagination
          v-model="currentPage"
          :page-count="totalPages"
          @input="pagination"
          :minimal="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import WorkOrderService from "../../../services/WorkOrderService";
import AssetManagementService from "../../../services/AssetManagementService";

import moment from "moment";
export default {
  name: "Work Orders",

  components: {},

  data() {
    return {
      assetUuid: "",
      currentPage: 0,
      numberOfPages: 5,
      totalPages: 0,
      currentUserDetails: "",
      countOfTotalWorkOrders: "",
      WorkOrderList: [],
    };
  },

  props: {
    workOrders: {
      type: Object,
    },
    assetData: {
      type: Object,
    },
  },

  methods: {
    pagination(val) {
      WorkOrderService.getPaginatedWorkOrdersByAsset(
        (val > 0 ? val - 1: 0),
        this.numberOfPages,
        this.assetUuid
      ).then((response) => {
        if (response.status === 200) {
          // debugger;

          this.countOfTotalWorkOrders = response.data.workOrders.totalElements;
          this.totalPages = response.data.workOrders.totalPages;
          let workOrders = response.data.workOrders.content;
          if (workOrders.length === 0) {
            //this.setState({ loading: false, workOrders: workOrders });
          }
          let assetuuids = [];
          for (let index = 0; index < workOrders.length; index++) {
            if (workOrders[index].priority === null) {
              workOrders[index].priority = "Not Assigned";
            }
            //add uuid of asset in the list if it does not exist
            let assetuuidAdded = false;
            for (
              let assetuuidsIndex = 0;
              assetuuidsIndex < assetuuids.length;
              assetuuidsIndex++
            ) {
              if (assetuuids[assetuuidsIndex] === workOrders[index].assetUUID) {
                assetuuidAdded = true;
                break;
              }
            }
            if (!assetuuidAdded) {
              assetuuids.push(workOrders[index].assetUUID);
            }
            //setting date to string (DD mmM YYYY hh:mm am/pm) formt
            //start
            // debugger;
            workOrders[index].createdAt = moment(
              workOrders[index].createdAt
            ).format("DD MMM YYYY hh:mm a");
            //end
            //calculate issue count of work order
            let issueCount = workOrders[index].issues.length;
            workOrders[index].issueCount = issueCount;
          }
          //get basic info of assets from asset management service like name and category name of asset
          AssetManagementService.getNameAndTypeOfAssetsByUUIDS({
            uuids: assetuuids,
          })
            .then((response1) => {
              // debugger;
              for (let index = 0; index < workOrders.length; index++) {
                workOrders[index].assetName =
                  response1.data.assets[workOrders[index].assetUUID].name;
                workOrders[index].assetCategory =
                  response1.data.assets[workOrders[index].assetUUID].type;
                workOrders[index].assetNumber =
                  response1.data.assets[
                    workOrders[index].assetUUID
                  ].assetNumber;
              }
              this.WorkOrderList = workOrders;
            })
            .catch((error) => {
              if (error.response.status === 406) {
                alert("Error while getting work orders. Please try again");
              } else {
                alert("Error while getting work orders. Please try again");
              }
            });
        } else {
          alert("Error while getting work orders. Please try again");
        }
      });
    },
    viewWorkOrder(value) {
      this.$router.push({
        name: "work-order-details",
        params: {
          workuuid: value,
        },
      });
    },
    getPaginatedWorkOrders() {},
    openWorkOrder(value) {
      this.$router.push({
        name: "view-work-order",
        params: {
          workuuid: value.row.uuid,
        },
      });
    },
    redirect() {
      let asset_detail = {};
      asset_detail.name = this.assetData.name;
      asset_detail.category = this.assetData.category.name;
      
      this.$router.push({
        name: "create-work-order",
        params: {
          asset: asset_detail,
        },
      });
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.assetUuid = this.$route.params.assetID;
    this.currentPage = this.workOrders.number + 1;
    this.totalPages = this.workOrders.totalPages;
    this.WorkOrderList = this.workOrders.workOrders;
  },

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.main-content {
  display: grid;
  padding-left: 32px;
  padding-right: 32px;
  margin-bottom: 32px;
}
.two-column-grid {
  div {
    display: inline-block;
    float: right;
    max-width: 200px;
    padding-left: 10px;
  }
}
table {
  margin-top: 16px;
  border-spacing: 0;
  font-size: 12px;
  line-height: 1.17;
  white-space: nowrap;
  cursor: default;
  box-shadow: 0 0 10px #e1e1e1;
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