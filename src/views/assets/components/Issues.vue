<template>
  <div class="main-content">
    <div class="two-column-grid pt-8 pb-8">
      <SButton title="Create New Issue" @click="newIssue1" />
    </div>
    <div class="accordion-content">
      <table>
        <tr>
          <th>Issue #</th>
          <th>Name</th>
          <th>Status</th>
          <th>Reported At</th>
          <th>Work Order #</th>
          <th>Reported By</th>
          <th>Actions</th>
        </tr>
        <tr v-for="(issue, index) in issuesData" :key="index">
          <td>{{ issue.issueNumber }}</td>
          <td>{{ issue.issueName }}</td>
          <td>{{ issue.status }}</td>
          <td>{{ issue.reportedAt | date }}</td>
          <td>{{ issue.workOrderNumber }}</td>
          <td>{{ issue.reportedBy }}</td>
          <td>
            <img
              src="/assets/icons/Results.svg"
              alt=""
              width="20px"
              style="cursor: pointer; margin-left: 16px"
              @click="view(issue.uuid)"
            />
          </td>
        </tr>
      </table>
    </div>
    <div class="pagination">
      <SPagination
        v-model="currentPage"
        :page-count="numberOfPages"
        @input="pagination"
        :minimal="false"
      />
    </div>
    <CreateIssue
      :assetObj="this.assetData"
      @close="close"
      v-show="newIssue"
      @getIssues="getAssetRelatedIssue"
      @toastFlag="displayMessage"
    />
  </div>
</template>

<script>
import CreateIssue from "../../../components/CreateIssue";
import InspectionService from "../../../services/InspectionService";
import AssetPersonnelService from "../../../services/AssetPersonnelService";
export default {
  name: "Issues",

  components: {
    CreateIssue,
  },
  props: {
    issues: {
      type: [],
    },
    assetData: {
      type: Object,
    },
  },
  data() {
    return {
      workOrder: true,
      newIssue: false,
      currentPage: 1,
      numberOfPages: 0,
      rowsPerPage: 5,
      issuesData: null,
      assetUUID: "",
      keyValue: 0,
    };
  },

  methods: {
    displayMessage() {
      this.$emit("toastFlag");
    },
    newIssue1() {
      this.newIssue = true;
    },
    close() {
      this.newIssue = false;
    },
    view(value) {
      this.$router.push({
        name: "issue-detail",
        params: {
          issueID: value,
        },
      });
    },
    pagination(val) {
      InspectionService.getPaginatedIssuesByAsset(
        this.assetData.uuid,
        "any",
        val - 1,
        this.rowsPerPage
      )
        .then((res) => {
          //	console.log("issue by assets", res.data.issues);
          let issues = res.data.issues;
          for (let index = 0; index < issues.length; index++) {
            //	console.log(issues[index].submittedByUserUUID);
            let uuid = [];
            uuid.push(issues[index].submittedByUserUUID);
            //	console.log(uuid);
            AssetPersonnelService.getNameOfUsersByUUIDS({
              uuids: uuid,
            }).then((response2) => {
              issues[index].reportedBy =
                response2.data.users[issues[index].submittedByUserUUID].name;
            });
          }
          this.issuesData = issues;
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
    getAssetRelatedIssue() {
      InspectionService.getPaginatedIssuesByAsset(
        this.assetData.uuid,
        "any",
        0,
        this.rowsPerPage
      )
        .then((res) => {
          let issues = res.data;
          let uuids = [];
          for (let index = 0; index < issues.issues.length; index++) {
            uuids.push(issues.issues[index].submittedByUserUUID);
          }
          AssetPersonnelService.getNameOfUsersByUUIDS({
            uuids: uuids,
          }).then((response2) => {
            let users = response2.data.users;
            issues.issues.map((issue) => {
              issue.reportedBy = users[issue.submittedByUserUUID].name;
            });
            this.issuesData = issues.issues;
          });

          //this.keyValue++
        })
        .catch((e) => {
          console.log("error", e);
        });
    },
  },

  created() {
    this.issuesData = this.issues.issues;
    this.numberOfPages = this.issues.totalPages;
    this.assetUUID = this.$route.params.assetID;
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