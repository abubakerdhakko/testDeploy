<template>
  <div class="main-card">
    <div class="bold">General Details</div>
    <div class="details">
      <div>
        <div class="bold">{{type == 'inspection'?'Inspection':'Work Order'}} #</div>
        <div>{{type == 'inspection'?data.inspectionNumber:data.workOrderNumber}}</div>
      </div>
      
      <div v-if="type == 'inspection'">
        <div class="bold">Inspection Name</div>
        <div>{{data.name}}</div>
      </div>
      
      <div>
        <div class="bold">{{type == 'inspection'?'Submitted Date':'Start Time'}}</div>
        <div>{{data.createdAt | date}}</div>
      </div>

      <div>
        <div class="bold">{{type == 'inspection'?'Inspected By':'Assigned To'}}</div>
        <div>{{ type == 'inspection'?data.submittedByUserName:data.assignedToUserName}}</div>
      </div>

      <div>
        <div class="bold">Status</div>
        <div>{{data.status}}</div>
      </div>
      
      <div v-if="type == 'work order'">
        <div class="bold">Priority</div>
        <div>{{data.priority}}</div>
      </div>

      <div>
        <div class="bold">View Detail</div>
        <div class="icon">
          <img src="../../../assets/icons/Search.svg" @click="viewDetail" alt="">
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
    name: "DetailsCard",

    components: {
    
    },
    props:{
        type:{
            type:String,
            default:'inspection'
        }
    },
    data() {
        return {
            data:{
                // assetUUID: "88af5cad-9691-4fd9-8c7e-fbf2cad82ee0",
                // createdAt: "2021-01-13T09:33:12.000+0000",
                deviceEndTime: "2021-01-13T09:33:11.000+0000",
                deviceStartTime: "2021-01-13T09:31:54.000+0000",
                // id: 4983,
                inspectionNumber: "ERH-INS-005983",
                inspectionReportCategories: [],
                inspectionType: null,
                name: "inspection template1",
                parentInspectionUUID: "01812a5b-c065-4afb-9939-7706635dc122",
                // priority: null,
                serverEndTime: "2021-01-13T09:33:11.000+0000",
                serverStartTime: "2021-01-13T09:31:54.000+0000",
                serviceRequestUUID: null,
                // status: "passed",
                submittedByUserName: "Abdul Rehman",
                submittedByUserUUID: "5c456238-56eb-4f03-ba5d-e80abfe017cc",
                // tenantUUID: "TEST-ORG",
                // uuid: "bd1215b7-8d3a-457d-a7d0-a4cfbbb059f4",
            
                assetUUID: "ce76ec6c-ab05-4ca6-8d33-aaa9c7c3b99c",
                assignedToUserName: "Usama S",
                assignedToUserUUID: "9c0e2f9d-b297-4d04-80cf-23d602767143",
                assignees: [{id: 132, uuid: "9c0e2f9d-b297-4d04-80cf-23d602767143", name: "Usama S", hourlyRate: null}],
                createdAt: "2021-01-13T10:42:30.000+0000",
                elapsedTimeFormatted: "0d 0h 0m",
                endTime: null,
                endUsageAdded: false,
                endUsageType: null,
                endUsageValue: null,
                estimatedTime: null,
                extraCosts: [],
                id: 152,
                issues: [{id: 156, issueNumber: "ERH-ISSUE-001991", uuid: null}],
                planning: {id: 130, initialInspectionUUID: "8d2578b3-5e5d-4dc9-810c-b76e375c6f5f"},
                priority: "High",
                repairInstructions: "[]",
                schedule: "2021-01-13T10:42:29.000+0000",
                shift: "Morning",
                startTime: "2021-01-27T17:18:26.000+0000",
                startUsageAdded: false,
                startUsageType: null,
                startUsageValue: null,
                status: "In Progress",
                tenantUUID: "TEST-ORG",
                uuid: "8be10bd2-e819-4546-a6e0-5b74b867b959",
                workOrderNumber: "ERH-WO-001152",
            }
        };
    },

    methods: {
      viewDetail(){
        this.$emit('view-details');
      }
    },

    created() {

    },

    validations: function() {
        return {

        };
    },

    computed: {

    }

};
</script>

<style lang="scss" scoped>
.main-card {
  display: flex;
  padding: 24px;
  flex-direction: column;
  border: 2px solid var(--very-light-pink);
  border-radius: 4px;
  box-shadow: 0 0 5px var(--very-light-pink);
  font-size: 14px;
  background-color: var(--white);
  cursor: default;


  .details {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
  }
  .icon{
    display: grid;
    justify-content: center;
    img{
      width: 16px;
      height: 16px;
      cursor: pointer;
      opacity: .7;
      transition: all .3s;
    }
    img:hover{
      opacity: 1;
    }
    img:active{
      // height: 17px;
      width: 19px;
    }
  }
}
</style>