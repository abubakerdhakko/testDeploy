<template>
  <div>
    <SDialog title="Cost" :persistent="true" :width="600" @close="close">
      <div class="c-grid">
          <SInput
          label="Name"
          v-model="cost.description"
          :error="$v.cost.description.$error ? 'Required' : ''"
        />
        <SSelect
          label="Category"
          v-model="cost.category"
          :source="[
            { name: 'Travel Cost' },
            { name: 'Tax Cost' },
            { name: 'Labor Cost' },
            { name: 'Extra Cost' },
          ]"
          resultsValue="name"
          resultsDisplay="name"
          :autocomplete="false"
          :error="$v.cost.category.$error ? 'Required' : ''"
        />
        <SInput
          label="Qty"
          v-model="cost.costQuantity"
          type="number"
          :error="$v.cost.costQuantity.$error ? 'Required' : ''"
        />
      
        <SInput
          :label="'Unit Cost ('+currency+')'" 
          v-model="cost.amount"
          type="number"
          :error="$v.cost.amount.$error ? 'Required' : ''"
        />
         <SInput
          :label="'Total Tax ('+currency+')'" 
          v-model="cost.taxAmount"
          type="number"
          :error="$v.cost.taxAmount.$error ? 'Required' : ''"
        />
      </div>
      <div>
         <SButton
         v-if="type"
          style=" width: 150px; padding: 24px 30px"
          title="Update"
          @click="updateCost"
        />
        <SButton
        v-else
          style=" width: 150px; padding: 24px 30px"
          title="Save"
          @click="addCost"
        />
       
      </div>
    </SDialog>
  </div>
</template>
<script>
import WorkOrderService from "../../../services/WorkOrderService";
import { required } from "vuelidate/lib/validators";
export default {
  name: "AddCost",
  data() {
    return {
      currentUserDetails: "",
      cost: {
        description:"",
        category:"",
        costQuantity:null,
        amount:null,
        taxAmount:null,
        index:0
      },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    updateCost(){
  this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.cost.issueUUID = this.$route.params.issueID;
      this.cost.reportable = true;
      this.cost.addedByUserName = this.currentUserDetails.profile.firstName +" " +this.currentUserDetails.profile.lastName;
      this.cost.addedByUserUUID = this.currentUserDetails.profile.userid;
      let data = {
        cost: this.cost,
        workOrderUUID: this.workOrder.uuid,
      };
      WorkOrderService.updateCost(data)
        .then((res) => {
          if (res.data.responseCode === "200") {
            alert("Update Cost Successfully")
            this.$emit("updateCost");
            this.index++
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addCost() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.cost.issueUUID = this.$route.params.issueID;
      this.cost.reportable = true;
      this.cost.addedByUserName =  this.currentUserDetails.profile.firstName +  " " +  this.currentUserDetails.profile.lastName;
      this.cost.addedByUserUUID = this.currentUserDetails.profile.userid;
      let data = {
        cost: this.cost,
        workOrderUUID: this.workOrder.uuid,
      };
      WorkOrderService.addCost(data)
        .then((res) => {
          if (res.data.responseCode === "200") {
            alert("Add Cost Successfully")
            this.$emit("createCost");
            this.index++
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {},
  created() {    
    console.log(this.costs);
    if(this.type === true){
      this.cost = this.costs
    }
    this.currentUserDetails = JSON.parse(
      localStorage.getItem("currentUserDetails")
    );
  },
  validations: function () {
    return {
      cost: {
        category: { required },
        costQuantity: { required },
        description: { required },
        amount: { required },
        taxAmount:{required}
      },
    };
  },

  components: {},
  props: {
    issueUUID: {},
    workOrder: {},
    currency:{},
    type:{},
    costs:{},
  },
};
</script>

<style lang="scss" scoped>
.c-grid {
  padding: 24px 30px;
  padding-bottom: 0px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  row-gap: 16px;
}
</style>