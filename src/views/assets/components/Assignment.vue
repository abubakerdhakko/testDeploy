<template>
  <div class="accordion-content">
    <div class="">
      <span><b>Assigned</b></span>
      <div class="add-icon">
        <img
          src="/assets/icons/Add.svg"
          alt=""
          width="20px"
          style="cursor: pointer"
          @click="openPopUp"
          v-if="assetObj && assetObj.status != 'Expired/disposed' && assetObj.status != 'sold' && this.assignedUsers.length == 0"
        />

      </div>
    </div>
    <div v-padding="'32px'" v-if="assignedUsers.length === 0">
      No user assigned to this asset.
    </div>
    <table v-if="assignedUsers.length > 0">
      <tr>
        <th>Name</th>
        <th>Started Date</th>
        <th>Status</th>
        <th>No. of Time Assigned</th>
        <th></th>
      </tr>
      <tr v-for="(item, index) in assignedUsers" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.startDate }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.count }}</td>
        <td>
          <img
            src="/assets/icons/Delete.svg"
            alt=""
            width="20px"
            style="cursor: pointer"
            @click="unassigned(index, item)"
          />
          <img
            src="/assets/icons/Edit.svg"
            alt=""
            width="20px "
            style="cursor: pointer; margin-left: 20px"
            @click="editAssigned(index, item)"
            v-if="assetObj && assetObj.status != 'Expired/disposed' && assetObj.status != 'sold'"
          />
        </td>
      </tr>
    </table>

    <!-- <div class="pagination" v-if="assignedUsers.length > 0">
			<SPagination
				v-model="currentPage"
				:page-count="numberOfPages"
				@input="pagination"
				:minimal="false"
			/>
		</div> -->

    <div class="">
      <span><b>Assignment History</b></span>
    </div>
    <table>
      <tr>
        <th>Name</th>
        <th>Duration</th>
        <th>Start Date</th>
        <th>Ending Date</th>
        <!-- <th >Status</th> -->
        <!-- v-for="a in columnCount" :key="a" -->
      </tr>
      <tr v-for="(item, index) in assignmentHistoryUsers" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.durations }}</td>
        <td>{{ item.userStartDates }}</td>
        <td>{{ item.userEndingDates }}</td>
        <!-- <td>{{ item.status  }}</td>	 -->

        <!-- <td v-for="i in item.userStartDates" :key="i"><br>
					{{ i }}
				</td> -->

        <!-- <td v-for="j in item.userEndingDates" :key="j"><br>
					{{ j }}
				</td> -->
      </tr>
    </table>

    <div class="pagination">
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
import AssetPersonnelService from "../../../services/AssetPersonnelService";
import moment from "moment";
export default {
  name: "Assignment",
  components: {},
  props: {
    userAssigned:{
      type:Boolean
    },
    assignedUsers: {
      type: Array,
    },
    assetObj: {
      type: Object,
    },
    assignmentHistoryUsers: {
      type: Array,
    },
  },

  data() {
    return {
      currentPage: 1,
      numberOfPages: 0,
      rowsPerPage: 5,
      page: 0,
      assetUuid: "",
      columnCount: "",
    };
  },

  methods: {
    pagination(val) {
      AssetPersonnelService.getAssignmentHistoryByAsset(
        this.assetUuid,
        val - 1,
        this.rowsPerPage
      )
        .then((response) => {
          this.numberOfPages = response.data.totalPages;
          if (response.status === 200) {
            let users = [];
            for (let index = 0; index < response.data.details.length; index++) {
              let obj = {};
              obj.name = response.data.details[index].name;
              obj.count = response.data.details[index].count;
              obj.userStartDates = moment(
                response.data.details[index].startDate
              ).format("DD MMM YYYY hh:mm a");
              obj.userEndingDates = moment(
                response.data.details[index].endDate
              ).format("DD MMM YYYY hh:mm a");
              obj.uuid = response.data.details[index].uuid;
              obj.durations = response.data.details[index].duration;
              users.push(obj);
            }
            this.assignmentHistoryUsers = users;
          }
        })
        .catch((error) => {
          if (error.response.status === 406) {
            this.$emit(
              "showToast",
              "Oops it looks like our server is offline",
              "error"
            );
          }
          //   this.setState({ loading: false});
          else {
            this.$emit(
              "showToast",
              "Oops it looks like our server is offline",
              "error"
            );
          }
        });
    },
    unassigned(index, value) {
      this.$emit("unassigned", index, value);
    },
    editAssigned(index, value) {
      value.flag = true;
      this.$emit("editAssigned", index, value);
    },
    openPopUp() {
      this.$emit("openPopUp");
    },
  },

  created() {
    this.assetUuid = this.$route.params.assetID;
    this.numberOfPages = this.assignmentHistoryUsers.totalPages;
  },

  validations: function() {
    return {};
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
}
.accordion-content {
  padding: 48px;
  border-top: 1px solid var(--very-light-pink);
}
.add-icon {
  float: right;
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
</style>
