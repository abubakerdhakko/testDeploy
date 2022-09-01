<template>
  <div class="main-content">
    <div class="button-row pt-16" v-if="fieldTemplate !== ''">
      <div>
        <SButton title="Edit" @click="showEditable" />
      </div>
    </div>

    <div class="field-div" v-if="fields.length !== 0">
      <div v-for="item in fields" :key="item.index">
        <SInput
          :label="item.label"
          v-model="item.fieldValue"
          :readonly="!showFields"
          :type="item.type"
          :source="item.type"
          @input="setFieldValue(item)"
        />
      </div>
      <div class="" v-if="fields.length === 0">
        <strong>No customize category fields available for this asset!</strong>
      </div>
    </div>
    <div class="two-column-grid pt-32" v-if="showFields === true">
      <SButton title="Save" @click="handleSave" />
      <SButton title="Cancel" @click="hideEditable" />
    </div>
  </div>
</template>

<script>
import AssetManagementService from "../../../services/AssetManagementService";
export default {
  name: "CategoryFields",

  components: {},
  props: {
    fields: Array,
    assetFields: Array,
  },
  data() {
    return {
      showFields: false,
      tests: [],
      asset: {},
      fieldTemplate: {},
      snackbarMessage: "",
      originalAssetFields: [],
      currentUserDetails: "",
      assetUuid: "",
    };
  },
  methods: {
    setFieldValue(field) {
      this.assetFields.map((item) => {
        if (item.fieldId === field.uuid) {
          let fieldValues = JSON.parse(item.fieldValue);
          fieldValues.values[0] = field.fieldValue;
          item.fieldValue = JSON.stringify(fieldValues);
        }
      });
      //this.assetFields = this.assetFields;
    },
    renderFields() {
      //	let fieldValue = "(no value found)";
      this.assetFields.map((item) => {
        this.fields.map((item2) => {
          let fieldValue = [];
          if (item.fieldId === item2.uuid) {
            let fieldValues = JSON.parse(item.fieldValue);
            fieldValue = fieldValues.values[0];
            item2.fieldValue = fieldValue;
            //this.fields.push(fieldValue);
          }
        });
      });
    },
    showEditable() {
      this.showFields = true;
      // this.originalAssetFields =  this.assetFields
    },
    hideEditable() {
      this.showFields = false;
    },
    handleSave() {
      let updateAssetFields = {
        assetFields: this.assetFields,
        assetUUID: this.assetUuid,
      };

      AssetManagementService.updateAssetFields(updateAssetFields)
        .then((response) => {
          alert("Updated Successfully");
          //this.setState({ editable: false });

          this.renderFields();
        })
        .catch((error) => {
          if (error.response.status === 406) {
            alert("An unexpected Error Occurred");
          } else {
            alert("An unexpected Error Occurred");
          }
        });
    },
  },

  created() {
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );

    this.assetUuid = localStorage.getItem("AssetUUIDSave");

    this.renderFields();
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
.field-div {
  display: grid;
  grid-template-rows: 1;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 20px;
}
.two-column-grid {
  div {
    display: inline-block;
    float: right;
    max-width: 200px;
    padding-left: 10px;
  }
}
.button-row {
  div {
    display: inline-block;
    float: right;
    max-width: 200px;
    padding-left: 10px;
  }
}
</style>