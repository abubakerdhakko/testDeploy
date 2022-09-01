<template>
    <div class="pt-32">
        
                <div>
                    <span class="head-title">Events</span><br />
                <span class="subtitle">View events for your work orders and inspections.</span>
                </div>
                <div class="page-content">
                    <div>
                        <Calendar/>
                    </div>
                    <div></div>
                    <div class="events-container">
                        <SToggle
                            v-model="event"
                            :options="source"
                            :tabs="true"
                            :background="'#ffffff'"
                            style="margin-top: 0px !important"
                            @selected="onSelectedEvent"
                            />

                            <!-- :error="$v.model.$error" -->
                        <div class="bold static-text" v-if="event==''">
                            Select an option from above to view its events
                        </div>
                        <div v-if="event== 'work orders'" class="events">
                            <!-- workorders -->
                            <DetailsCard :type="'work order'" @view-details="workOrderDetail"/>
                        </div>
                        <div v-if="event== 'inspections'" class="events">
                            <!-- Inspections -->
                            <DetailsCard :type="'inspection'" @view-details="inspectionDetail"/>
                        </div>
                    </div>
                </div>
    </div>
</template>

<script>
import DetailsCard from "./components/DetailsCard.vue"
export default {
    name: "CalendarSection",

    components: {
        DetailsCard
    },

    data() {
        return {
            event:"work orders",
            source:[
                {label:'Work Orders',value:'work orders'},
                {label:'Inspections', value:'inspections'}
            ]
        };
    },

    methods: {
        onSelectedEvent(val){
            console.log(val);
        },
        inspectionDetail(){
            console.log("inspection Detail clicked")
        },
        workOrderDetail(){
            console.log("Work Order Detail clicked")

        }
    },

    created() {
         document.title = this.$route.meta.title;
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
.page-content{
    display: grid;
    grid-template-columns: 3fr 1fr 8fr;
    margin-top: 32px;

    .events-container{
        min-height: 100vh;
        
        .static-text{
            margin-top: 32px;
            display: flex;
            justify-content: center;
        }

        .events{
            // padding: 24px;
            margin-top:24px;
        }
        // box-shadow: 0 5px 50px 0 var(--very-light-pink);
        // background-color: var(--white);
    }
}
</style>