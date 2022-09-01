<template>
  <div>
    <SDialog
      :title="assetImport.importName"
      :width="700"
      :height="500"
      :persistent="true"
      :closeIcon="false"
      @close="close"
    >
      <div class="main-grid">
        <div class="column-grid-2">
          <div></div>
          <div class="mt-8 mb-32 dialog-btn float-right" v-grid="2">
            <SCheckBox
              v-model="check"
              style="margin-top: 1em; margin-right: 0.5em"
              label="Show Failed Logs"
              icon="true"
            />
            <SButton
              rounded
              dense
              title="Download Failures"
              @clicked-item="downloadFailures"
            ></SButton>
          </div>
        </div>
        <div>
          <span><b>Message: </b>{{ assetImport.message }}</span>
        </div>
        <div style="margin-bottom: 1em">
          <table>
            <tr>
              <th>Row Number</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
            <tr v-for="(record, index) in importRecords" :key="index">
              <td v-if="record.status === 'Success'">{{ record.rowNumber }}</td>
              <td v-if="record.status === 'Success'">
                <span class="dot"></span>{{ record.status }}
              </td>
              <td v-if="record.status === 'Success'">{{ record.message }}</td>
              <td v-if="check && record.status === 'Failure'">
                {{ record.rowNumber }}
              </td>
              <td v-if="check && record.status === 'Failure'">
                <span class="dot-red"></span>{{ record.status }}
              </td>
              <td v-if="check && record.status === 'Failure'">
                {{ record.message }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </SDialog>
    <SToast
      :message="toastMessage"
      :time-out="3000"
      :type="toastType"
      :key="toastFlag"
    />

    <!-- Loader Component -->
    <loader v-if="loaderFlag" />
    <!-- Loader Component -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import AssetManagementService from "../../../services/AssetManagementService";

import loader from "@/components/Loader.vue";
export default {
  name: "SummaryPopUp",

  components: { loader },
  props: {
    importRecords: Array,
    assetImport: Object,
  },

  data() {
    return {
      currentUserDetails: "",
      toastFlag: 0,
      toastMessage: "",
      toastType: "",
      loaderFlag: false,
      check: false,
      index: 0,
    };
  },

  watch: {},

  methods: {
    downloadFailures() {
      let failuers = this.importRecords.filter((i) => i.status === "Failure");
      if (failuers === undefined || failuers.length <= 0) {
        this.toastMessage = "No failure imports to download.";
        this.toastType = "warning";
        this.loaderFlag = false;
        this.toastFlag++;
        return;
      }
      this.loaderFlag = true;
      AssetManagementService.downloadFailureImports(this.assetImport.uuid)
        .then((res) => {
          if (res.status === 200 && res.data.responseIdentifier === "Success") {
            this.loaderFlag = false;
            var sampleArray = this.base64ToArrayBuffer(res.data.content);
            let fileUrl = window.URL.createObjectURL(
              new Blob([sampleArray], { type: "text/csv;charset=utf-8;" })
            );
            var fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.setAttribute("download", res.data.fileName);
            document.body.appendChild(fileLink);
            fileLink.click();
          }
        })
        .catch((error) => {
          if (error) {
            this.toastMessage =
              "An Unexpected Error occurred while downloading import failures.";
            this.toastType = "error";
            this.loaderFlag = false;
            this.toastFlag++;
          }
        });
    },

    base64ToArrayBuffer(base64) {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes;
    },

    close() {
      this.$emit("close");
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
  },

  validations: function () {
    return {
      file: { required },
    };
  },

  computed: {},
};
</script>

<style lang="scss" scoped>

.column-grid {
  div {
    display: inline-block;
    float: right;
    max-width: 150px;
  }
}

.filePickerRow {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
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
    border: 1px solid black;
  }

  tr:not(:first-child):hover {
    opacity: 1;
    background-color: #e1e1e1;
  }
}

.dot {
  height: 8px;
  width: 8px;
  background-color: rgb(105, 255, 67);
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.dot-red {
  height: 8px;
  width: 8px;
  background-color: rgb(255, 42, 42);
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
</style>