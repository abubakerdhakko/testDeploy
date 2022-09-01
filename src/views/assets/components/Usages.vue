<template>
  <div class="accordion-content">
    <div v-padding="'32px'" v-if="usagesArray.content.length === 0">
      No usages added against this asset.
    </div>
    <table v-if="usagesArray.content.length > 0">
      <tr>
        <th>Date</th>
        <th>Primary Usage Value ({{ assetData.primaryUsageUnit }})</th>
        <th>Secondary Usage Value ({{ assetData.secondaryUsageUnit }})</th>
        <th>Submitted By</th>
        <th>Action</th>
      </tr>
      <tr v-for="(usage, index) in usagesArray.content" :key="index">
        <td v-if="usage.primaryUsageTime !== null">
          {{ usage.primaryUsageTime }}
        </td>
        <td v-else>{{ usage.secondaryUsageTime }}</td>
        <td>{{ usage.primaryUsageValue ? usage.primaryUsageValue : "-" }}</td>
        <td>
          {{ usage.secondaryUsageValue ? usage.secondaryUsageValue : "-" }}
        </td>
        <td>{{ usage.submittedBy ? usage.submittedBy : "-" }}</td>
        <td>
          <img
            src="/assets/icons/Results.svg"
            alt=""
            width="20px"
            style="cursor: pointer; margin-left: 16px"
            @click="viewUsage(usage.id)"
          />
        </td>
      </tr>
    </table>

    <div class="pagination" v-if="usagesArray.content.length > 0">
      <SPagination
        v-model="currentPage"
        :page-count="numberOfPages"
        @input="pagination"
        :minimal="false"
      />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import AssetManagementService from "../../../services/AssetManagementService";
export default {
  name: "Usages",

  components: {},

  data() {
    return {
      currentPage: "",
      numberOfPages: "",
      rowsPerPage: 5,
      usagesArray: [],
    };
  },

  props: {
    usages: {
      type: Object,
    },
    assetData: {
      type: Object,
    },
  },

  methods: {
    pagination(val) {
      // console.log(val);
      AssetManagementService.getUsagesByAsset(
        this.assetData.uuid,
        val - 1,
        this.rowsPerPage
      )
        .then((response) => {
          this.usagesArray = response.data.usages;
          // console.log(response);
          if (response.status === 200) {
            let usages = response.data.usages.content;
            for (let index = 0; index < usages.length; index++) {
              usages[index].createdAt = moment(usages[index].createdAt).format(
                "DD MMM YYYY hh:mm a"
              );
              usages[index].primaryUsageTime =
                usages[index].primaryUsageTime !== null
                  ? moment(usages[index].primaryUsageTime).format(
                      "DD MMM YYYY hh:mm a"
                    )
                  : null;
              usages[index].secondaryUsageTime =
                usages[index].secondaryUsageTime !== null
                  ? moment(usages[index].secondaryUsageTime).format(
                      "DD MMM YYYY hh:mm a"
                    )
                  : null;
              usages[index].primaryUsageUnit = this.primaryUsageUnit;
              usages[index].secondaryUsageUnit = this.secondaryUsageUnit;
            }
            this.countOfTotalUsages = response.data.usages.totalElements;
            this.usagesArray.content = usages;
          } else {
            alert("Error while getting usages of asset");
          }
        })
        .catch((error) => {
          if (error) {
            alert("Error while getting usages of asset");
          }
          //   this.setState({ loading: false });
        });
    },

    viewUsage(id) {
      this.$router.push({
        name: "usage-detail",
        params: {
          usageID: id,
          type: "view",
        },
      });
    },
  },

  created() {
    this.numberOfPages = this.usages.totalPages;
    this.currentPage = this.usages.number + 1;
    this.usagesArray = this.usages;
  },

  validations: function() {
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
