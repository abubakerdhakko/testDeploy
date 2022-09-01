<template>
  <div>
    <SCard :border="true" :shadow="true">
      <div style="padding: 24px 30px">
        <div class="column-grid-1">
          <span><strong>Service Request Detail</strong></span>
        </div>

        <div class="column-grid-3">
          <SInput
            label="Service Request Name"
            v-model="serviceRequestObj.issueName"
            :readonly="serviceRequestObj.status == 'reported' || this.pramQstatus == 'ignored'"
            :error="getFormErrorMessage($v.serviceRequestObj.issueName)"
          />

          <SSelect
            label="Asset Category*"
            v-model="serviceRequestObj.assetCategory"
            :source="assetCategoryOptions"
            resultsValue="label"
            resultsDisplay="label"
            :autocomplete="true"
            @selected="onAssetCategorySelect"
            class="service-padding"
            :error="getFormErrorMessage($v.serviceRequestObj.assetCategory)"
            @clear="clearSelectedAssetCategory"
            :readonly="serviceRequestObj.status == 'reported' || this.pramQstatus == 'ignored'"

          />
            <!-- :disabled="assetNameDisable" -->
          <SSelect
            label="Asset Name*"
            v-model="serviceRequestObj.assetName"
            :source="assetNameOptions"
            resultsValue="label"
            resultsDisplay="label"
            :autocomplete="true"
            class="service-padding"
            @selected="onAssetNameSelect"

            @clear="clearSelectedAssetName"
            :key="`category${refreshComp}`"
            :readonly="serviceRequestObj.status == 'reported' || this.pramQstatus == 'ignored'"
            :error="getFormErrorMessage($v.serviceRequestObj.assetName)"
          /> 

          <SSelect
            label="Priority*"
            v-model="serviceRequestObj.priority"
            :source="priorityOptions"
            resultsValue="label"
            resultsDisplay="label"
            :autocomplete="true"
            class="service-padding"
            @clear="clearSelectedPriority"
            :readonly="serviceRequestObj.status == 'reported' || this.pramQstatus == 'ignored'"
            :error="getFormErrorMessage($v.serviceRequestObj.priority)"
          />

          <SInput
            label="Submitted By"
            v-model="serviceRequestObj.reportedBy"
            :readonly="serviceRequestObj.assetName !== 'New'"
          />
          <SInput
            label="Created At"
            v-model="serviceRequestObj.reportedAt"
            :readonly="serviceRequestObj.assetName !== 'New'"
          />

          <SSelect
            label="Status*"
            v-model="serviceRequestObj.status"
            :source="stausOptionSource"
            resultsValue="value"
            resultsDisplay="label"
            :autocomplete="true"
            class="service-padding"
            @selected="onSelectedStatus"
            @clear="clearSelectedStatus"
            :readonly="serviceRequestObj.status == 'reported' "
            :error="getFormErrorMessage($v.serviceRequestObj.status)"
          />
          <STextarea
            label="Comments"
            v-model="serviceRequestObj.issueDescription"
            :rows="5"
            :columns="15"
            :readonly="$route.name == 'service-requests-edit' && serviceRequestObj.status == 'reported' ? true : false"
            :error="getFormErrorMessage($v.serviceRequestObj.issueDescription)"
          />

          <STextarea
            label="Ignore Comments"
            v-if="serviceRequestObj.status == 'ignored'"
            v-model="serviceRequestObj.ignoreComments"
            :rows="5"
            :columns="15"
            :readonly="true"

          />
          <!-- <SButton
            v-if="disableFields"
            title="Update Service Request"
            @click="updateServiceRequest"
          /> -->
        </div>
      </div>
    </SCard>
  

  </div>
</template>

<script>
import { AssetManagementService } from "../../../services/AssetManagementService";
import { Functions } from "@/shared/Functions";
import { required } from "vuelidate/lib/validators";
export default {
  name: "AssetSummary",

  components: { 
  },

  data() {
    return {
      editCheck: "",
      refreshComp: 0,
      assetCategory: "",
      assetCategoryOptions: [],
      assetNameDisable: false,
      allAssetData: [],
      // assets items
      assetName: "",
      assetNameOptions: [],
      assetNameUuid: "",
      priority: "",
      priorityOptions: [
        { label: "Low" },
        { label: "Medium" },
        { label: "High" },
      ],
      shiftOptions: [
        { label: "Morning" },
        { label: "Afternoon" },
        { label: "Evening" },
      ],
      stausOptions: [
        { label: "Open" },
        { label: "Closed" },
        { label: "In progress	" },
      ],
      stausOptionSource: [
        // { label: "New" },
        // { label: "Active" },
        // { label: "Ignore" },
      ],
      pramQstatus: "",
      modelInstruction: "Ignore Service Request",
      IgnoreIssueValue: false,
    };
  },

  props: {
    assetInfo: {},
    serviceRequestObj: {},
    disableFields: {},
  },

  methods: {
    /* Select List Events */
    onAssetCategorySelect(obj) {
      this.assetNameOptions = this.allAssetData;
      let tempAssetNameOption = [];
      for (let index = 0; index < this.assetNameOptions.length; index++) {
        if (this.assetNameOptions[index].type === obj.value) {
          tempAssetNameOption.push(this.assetNameOptions[index]);
        }
      }
      this.assetNameOptions = [];
      this.assetNameOptions = tempAssetNameOption;
      this.assetNameDisable = false;
    },
    // get all categories
    getAllCategories(currentUserDetails) {
      AssetManagementService.getAllAssetCategories(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          for (let index = 0; index < res.data.categories.length; index++) {
            let obj = {
              id: res.data.categories[index].id,
              categoryUUID: res.data.categories[index].uuid,
              label: res.data.categories[index].name,
            };
            this.assetCategoryOptions.push(obj);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // clear categories
    clearSelectedAssetCategory() {
      this.serviceRequestObj.assetCategory = "";
      this.assetCategory = "";
      this.serviceRequestObj.assetName = "";
      this.assetNameUuid = "";
      this.serviceRequestObj.assetUUID="";
      this.assetNameOptions = [];
      this.refreshComp++;
    },
    // getAllAsset
    getAllAsset(currentUserDetails) {
      AssetManagementService.getAllAssets(
        currentUserDetails.profile.organizationId
      )
        .then((res) => {
          for (let index = 0; index < res.data.assets.length; index++) {
            let obj = {
              uuid: res.data.assets[index].uuid,
              categoryUUID: res.data.assets[index].categoryUUID,
              label: res.data.assets[index].name,
              type: res.data.assets[index].type,
              assetNumber: res.data.assets[index].assetNumber,
            };
            this.allAssetData.push(obj);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onAssetNameSelect(obj) {
      this.assetNameUuid = obj.selectedObject.uuid;
      this.serviceRequestObj.assetUUID = this.assetNameUuid

      // this.assetInfo = obj.selectedObject;
    },

    clearSelectedAssetName() {
      this.assetNameUuid = "";
      this.assetName = "";
      this.serviceRequestObj.assetName = "";
      this.serviceRequestObj.assetUUID="";
    },

    //priorty
    clearSelectedPriority() {
      // this.priority = "";
      this.serviceRequestObj.status = "";
    },
    clearSelectedStatus() {
      this.Status = "";
      // this.serviceRequestObj.priority = "";
    },
    onSelectedStatus(value){
      this.Status = value.value;
    // console.log('this.Status',this.Status)
   },

    getFormErrorMessage(fieldValidation) {
      if (fieldValidation.$dirty) {
        return Functions.getFormFieldErrorMessage(fieldValidation);
      }
    },

  },
  validations: function () {
    return {
                
      serviceRequestObj: {
        issueName:{required},
        assetCategory:{required},
        assetName:{required},
        issueDescription:{required},
        priority: { required },
        status: { required },       
        // workOrder: {
        //   priority: { required },
        //   shift: { required },
        //   schedule: { required },
        //   status: { required },
        //   assignedToUserName: { required },
        // },
      },
      
    };
  },
  created() {
  },   
  mounted() {

     if(this.$route.params.status !== undefined){
      localStorage.setItem("paramStatus", this.$route.params.status);
     } 
    this.pramQstatus = localStorage.getItem("paramStatus")

    this.stausOptionSource = [
      // { label: "New" },
      {label: this.pramQstatus == "ignored"?"Active":"New",value:"New"},
      // {label:"Ignore",value:"ignored"},
    ]
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
    this.getAllCategories(this.currentUserDetails);
    this.getAllAsset(this.currentUserDetails);
  },
  computed: {},
};
</script>

<style lang="scss" scoped></style>
