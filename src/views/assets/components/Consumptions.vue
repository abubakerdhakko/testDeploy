<template>
  <div class="accordion-content">
    <table v-if="consumptionsArray.content.length > 0">
      <tr>
        <th>Date</th>
        <th>Consumption Value</th>
        <th>Consumption Unit</th>
        <th>Submitted By</th>
        <th>Actions</th>
      </tr>
      <tr
        v-for="(consumption, index) in consumptionsArray.content"
        :key="index"
      >
        <td>{{ consumption.createdAt | date }}</td>
        <td>{{ consumption.consumptionValue }}</td>
        <td>{{ assetData.consumptionUnit }}</td>
        <td>{{ consumption.submittedBy }}</td>
        <td>
          <img
            src="/assets/icons/Results.svg"
            alt=""
            width="20px"
            style="cursor: pointer; margin-left: 16px"
            @click="view(consumption.id)"
          />
        </td>
      </tr>
    </table>
    <div class="pagination" v-if="consumptionsArray.content.length > 0">
      <SPagination
        v-model="currentPage"
        :page-count="numberOfPages"
        @input="pagination"
        :minimal="false"
      />
    </div>
    <AddConsumption
      v-if="viewConsumptionDialog"
      :id="comsumptionId"
      @close="closeConsumptionDialog"
    />
    <div v-padding="'32px'" v-if="consumptionsArray.content.length === 0">
      No consumptions added against this asset.
    </div>
  </div>
</template>

<script>
import AssetManagementService from "../../../services/AssetManagementService";
import AddConsumption from "../../consumption/AddConsumption.vue";
import moment from "moment";
export default {
  name: "Consumptions",

  components: {
    AddConsumption,
  },

  data() {
    return {
      currentPage: "",
      numberOfPages: "",
      rowsPerPage: 5,
      viewConsumptionDialog: false,
      comsumptionId: "",
      consumptionsArray: [],
    };
  },

  props: {
    consumptions: {
      type: Object,
    },
    assetData: {
      type: Object,
    },
  },

  methods: {
    pagination(val) {
      AssetManagementService.getConsumptionsByAsset(
        this.assetData.uuid,
        val,
        this.rowsPerPage
      )
        .then((response) => {
          this.consumptionsArray = response.data.consumptions;
          if (response.status === 200) {
            let consumptions = response.data.consumptions.content;
            //	console.log(consumptions);
            for (let index = 0; index < consumptions.length; index++) {
              consumptions[index].createdAt = moment(
                consumptions[index].createdAt
              ).format("DD MMM YYYY hh:mm a");
              consumptions[index].consumptionUnit = this.consumptionUnit;
              // console.log(this.props.consumptionUnit);
            }
          } else {
            alert("Error while getting consumptions of asset");
          }
        })
        .catch((error) => {
          //   this.setState({ loading: false });
          if (error.response !== undefined && error.response.status === 406) {
            alert("Error while getting consumptions of asset");
          } else {
            alert("Error while getting consumptions of asset");
          }
        });
    },
    closeConsumptionDialog() {
      this.viewConsumptionDialog = false;
    },

    view(value) {
      this.comsumptionId = value;
      this.viewConsumptionDialog = true;
    },
  },

  created() {
    this.numberOfPages = this.consumptions.totalPages;
    this.currentPage = this.consumptions.number;
    this.consumptionsArray = this.consumptions;
  },

  validations: function () {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
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
.accordion-content {
  padding: 48px;
  border-top: 1px solid var(--very-light-pink);
}
</style>