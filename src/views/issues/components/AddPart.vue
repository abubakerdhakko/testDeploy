<template>
  <div>
    <SDialog title="Part" :persistent="true" :width="600" @close="close">
      <div class="column-grid-2">
        <SInput
          label="Part Name"
          v-model="part.partName"
          :error="$v.part.partName.$error ? 'Required' : ''"
        />
        <SInput
          label="Qty"
          v-model="part.quantity"
          type="number"
          :error="$v.part.quantity.$error ? 'Required' : ''"
        />
        <SInput
          :label="'Unit Cost ('+currency+')'"
          v-model="part.cost.amount"
          type="number"
          :error="$v.part.cost.amount.$error ? 'Required' : ''"
        />
        <SInput
          :label="'Total tax ('+currency+')'"
          v-model="part.cost.taxAmount"
          type="number"
          :error="$v.part.cost.taxAmount.$error ? 'Required' : ''"
          
        />
      </div>
      <div>
         <SButton
          v-if="type"
          style=" width: 150px; padding: 24px 30px"
          title="Update"
          @click="updatePart"
        />
        <SButton
          v-else
          style=" width: 150px; padding: 24px 30px"
          title="Save"
          @click="addPart"
        />
      </div>
    </SDialog>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import WorkOrderService from '../../../services/WorkOrderService';
export default {
  name: "AddPart",
  data() {
    return {
      currentUserDetails: "",
      part: {
        cost:{
          amount:0,
          taxAmount:0,
        },
        quantity:0
      },
      resolutionUUID: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    updatePart(){
       this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let data = {
        partName: this.part.partName,
        issueUUID:  this.$route.params.issueID,
        quantity: this.part.quantity,
        uuid:this.part.uuid,
        partUUID: "dummy-part-uuid-link-with-inventory", //TODO: partUUID is to be set when their are parts and inventory in project
        addedByUserName:  this.currentUserDetails.profile.firstName +  " " +  this.currentUserDetails.profile.lastName,
        addedByUserUUID: this.currentUserDetails.profile.userid,
        cost: {
          amount: this.part.cost.amount,
          addedByUserName: this.currentUserDetails.profile.firstName +  " " +  this.currentUserDetails.profile.lastName,
          addedByUserUUID: this.currentUserDetails.profile.userid,
          taxAmount: this.part.cost.taxAmount,
          description: "Part cost",

        },
      };

     this.parts = data
      let addPartRequest = {
        partUsed: data,
        issueUUID:  this.$route.params.issueID,
        workOrderUUID: this.workOrder.uuid,
        resolutionUUID: this.resolutionUUID,
      };
      WorkOrderService.updatePart(addPartRequest)
        .then((res) => {
          console.log(res);
          if (res.data.responseCode === "200") {
            alert("update Part Successfully")
            this.$emit("UpdatePart");
          }
        })
        .catch((err) => {
          console.log(err);
        });

    },

    addPart() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let data = {
        partName: this.part.partName,
        issueUUID: this.$route.params.issueID,
        quantity: this.part.quantity,
        partUUID: "dummy-part-uuid-link-with-inventory", //TODO: partUUID is to be set when their are parts and inventory in project
        addedByUserName: this.currentUserDetails.profile.firstName + " " + this.currentUserDetails.profile.lastName,
        addedByUserUUID: this.currentUserDetails.profile.userid,
        cost: {
          amount: this.part.cost.amount,
          addedByUserName:  this.currentUserDetails.profile.firstName +  " " +  this.currentUserDetails.profile.lastName,
          addedByUserUUID: this.currentUserDetails.profile.userid,
          taxAmount: this.part.cost.taxAmount,
          description: "Part cost",
        },
      };
      console.log(data);
   //  this.parts = data
      let addPartRequest = {
        partUsed: data,
        issueUUID: this.$route.params.issueID,
        workOrderUUID: this.workOrder.uuid,
        resolutionUUID: this.resolutionUUID,
      };
      console.log("add part",addPartRequest);
      WorkOrderService.addPart(addPartRequest)
        .then((res) => {
          console.log(res);
          if (res.data.responseCode === "200") {
            alert("add Part Successfully")
            this.$emit("createPart");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
   // console.log("",this.parts);
  },
  created() {
    this.currentUserDetails = JSON.parse(localStorage.getItem("currentUserDetails"));
    if(this.type===true){
      this.part=this.parts;
     }
     WorkOrderService.getResolutionsByWorkOrderUUID(
      this.workOrder.uuid
    )
      .then((res) => {
        for (let i = 0; i < res.data.resolutions.length; i++) {
          if (
            res.data.resolutions[i].workOrderUUID ===  this.workOrder.uuid
          ) {
            this.resolutionUUID = res.data.resolutions[i].uuid;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });

  },
  validations: function () {
    return {
      part: {
        partName: { required },
        quantity: { required },
        cost:{
        amount: { required },
        taxAmount: { required },
        }
          },
    };
  },

  components: {},
  props: {
    issueUUID: {},
    currency:{},
    type:{},
    parts:{},
    workOrder: {},
  },
};
</script>

<style lang="scss" scoped>
</style>