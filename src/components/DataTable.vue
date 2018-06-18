<template>
  <div id="DataTable" class='relative'>
      <table class='w-100 relative'>
        <thead class='bb b--light-silver'>
            <tr class='flex'>
              <th v-for='(i,index) in TableHead'
                  :key='i' 
                  :class='{"_flx_15" : index <3,"_flx_1" : index >3 }'>{{i}}</th> 
            </tr>
        </thead>
        <tbody v-if='ViewType === "Employee"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'>
                <td class='_flx_15 flex justify-evenly items-center'>
                    <input type='checkbox' :value='i.travelAgencyUsersId' v-model='ToDelete'>&nbsp;&nbsp;&nbsp;
                    <span>
                        {{ i.virtualName }}
                    </span>
                </td>
                <td class='_flx_15'>{{ (i.department !== null ) ? i.department.departmentName : '<span class="light-red">Unassigned</span>' }}</td>
                <td class='_flx_15'>{{ (i.designation !== null ) ? i.designation.label : '<span class="light-red">Unassigned</span>' }}</td>
                <td class='_flx_1'>{{ (i.benefitBundle !== null) ? i.benefitBundle.label : '<span class="light-red">Unassigned</span>' }}</td>
                <td class='_flx_1 tc'>{{ (i.hierarchyId !== null) ? i.hierarchyId : '<span class="light-red">Unassigned</span>' }}</td>
                <td class='_flx_1'>
                    <button class="btn btn-xs btn-primary" @click='sendThis(i)'>Edit</button>
                </td>
            </tr>
            <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Employees Available </td>
            </tr>
        </tbody>
        <tbody v-if='ViewType === "Department"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'>
                <td class="_flx_15">{{ i.departmentName }}</td>
                <td class="_flx_15">{{ i.departmentCode }}</td>
                <td class='_flx_15'><button class='btn --green' @click='sendThis(i)'>Edit</button></td>
             </tr>
             <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Departments Available</td>
            </tr>
        </tbody>
        <tbody v-if='ViewType === "Designation"'>
            <tr class='flex bb b--light-silver'
                v-for='(i,index) in List'
                :key='index'>
                <td class="_flx_15">{{ i.designationName }}</td>
                <td class="_flx_15">{{ i.department.departmentName }}</td>                
                <td class="_flx_15">{{ i.benefitBundle.label }}</td>
                <td class="_flx_1">{{ i.hierarchyId }}</td>
                <!-- <td class="_flx_1">{{ i.department.label }}</td> -->
                <td class='_flx_1'><button class='btn --green' @click='sendThis(i)'>Edit</button></td>
             </tr>
             <tr class='flex justify-center bb b--light-silver' v-if='List.length === 0'>
                <td colspan='6' class='gray tc w-100'>No Designation Available</td>
            </tr>
        </tbody>
        <transition name='fade'>
            <tfooter class='bg-white' v-if='ToDelete.length > 0'>
                <div class='fr w-10 tc ba b--light-gray pa1' >
                    <button><i class='fa fa-trash'></i></button>
                </div>
            </tfooter>
        </transition>
      </table>
      
  </div>
</template>

<script>
import api from '../assets/api'
//https://api.myjson.com/bins/xn8bm
export default {
  name: 'DataTable',
  props : {
      ListData : {
          type: Array,
          default: function(){
              return []
          }
      },
      ViewType : {
          type: String,
          default: 'Employee'
      },
      Query: {
          type: String,
          default: ''
      }
  },
  data(){
      return {
        EmployeeHeading: ['Employee','Department','Designation','Policy','Hierarchy','Actions'],
        DepartmentHeading: ['Department','Code','Action'],
        DesignationHeading: ['Designation','Department','Policy','Hierarchy','Actions'],
        ToDelete:[],
        ActiveRow: {}
      }
  },

  watch : {
      'ToDelete' : function(val){
              this.$emit('dataChecked',val);
      }
  },

  computed : {
      List(){
          if(this.Query !== ''){
          var regex = new RegExp(this.Query.toString().toLowerCase(),'g');
          var self = this;
          return this.ListData.filter(x => {
              if(self.ViewType === 'Employee') return regex.test(x.virtualName.toString().toLowerCase())
              if(self.ViewType === 'Department') return regex.test(x.departmentName.toString().toLowerCase())
              if(self.ViewType === 'Designation') return regex.test(x.label)
          })
          }else{
              return this.ListData
          }
      },
      TableHead(){
          if(this.ViewType === 'Employee') return this.EmployeeHeading
          if(this.ViewType === 'Department') return this.DepartmentHeading
          if(this.ViewType === 'Designation') return this.DesignationHeading

      },
  },

  methods: {
      sendThis: function(data){
          this.ActiveRow = data; 
          this.$emit('rowClicked',data);
      },

      DeleteAll: function(){
          var self = this;
          if(confirm('Are you Sure to delete the Selected employees?')){
            $.post(api.deleteAll,{dataId : this.ToDelete}).done(function(data){
                alert('successfully Deleted');
                self.$emit('ActionDone')
            }).fail(x=> alert(x));
          }
      },
  }
}
</script>

<style>
#DataTable{
 height: 100%;
}
table{
    height: 100%;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
}
thead{ height : 40px; flex: 0 0 0 ; }

tbody{
/* flex: 1 0 0 ;  */
overflow-y:auto;
height: calc(100% - 95px);
}
td,th{
    padding: 10px;
    text-align: left;
}
tr th, tr td { flex:1 0 0; align-self: baseline;}

</style>
