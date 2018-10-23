<template>
  <div class='flex flex-column' style='height:100%;'>
    <div class="flex cursor tab-head">
      <div class="w-50 tc pa3 b "
        :class='{"act-tab" : View === "DH"}'
        @click='View = "DH"'>Designation Hierarchy</div>
      <div class="w-50 tc pa3 b "
        :class='{"act-tab" : View === "EH"}'
        @click='View = "EH"'>Employee Hierarchy</div>
    </div>
    <!-- Designation work area -->
    <section class="pa1 work-area" v-if ='View === "DH"'>
      <ol class="sortable flex flex-column">
        <li v-for='i in DesignList' :key='i.designationId'>
          <div>{{i.designationName}}
           <span class='fr flex '><span>Approver</span>&nbsp; <input type='checkbox' v-model='i.isApprover' /></span>
          </div>
          </li>
      </ol>
      <pre class='fr'>{{DesignList}}</pre>
    </section>
    <!-- Employee work area -->
    <section class="pa1 work-area flex flex-column" v-else>
      <div class='flex w-100 pa1' style='height:100px'>
        <div class="w-50 flex justify-center tc"><div class='sub-tab pa2 w-75'>Employee List</div></div>
        <div class="w-50 flex justify-center tc"><div class='sub-tab pa2 w-75'>Approvers</div></div>
      </div>
      <!-- Employee list -->
      <div class="w-50 flex flex">
        <ul class='flex flex-column w-100'>
          <li class='employee-item  pa3 cursor'
              :class='{"act-emp": i.travelAgencyUsersId === ActiveEmp}' 
              v-for='i in EmpList' :key='i.travelAgencyUsersId'
              @click='GetDesign(i.travelAgencyUsersId)'>
            <div class='b pa1'>{{i.travelAgencyNameTemp}} {{i.virtualName}}</div>
            <div class='gray pa1'>{{i.designation.label}}</div>
          </li>
        </ul>
      </div>

      <div class="w-50 flex flex-column" style='border-left:1px solid #ddd;'></div>
    </section>
    
    <!-- <button @click='sam'>get</button> -->

  </div>
</template>

<script>
export default {
  name: 'Approvals',
  props: {
    DesignList: {
      type: Array,
      default: function(){
        return []
      }
    },
    EmpList: {
      type: Array,
      default: () => []
    }
  },
  methods:{
    sam(){
      console.log($('.sortable').nestedSortable('toArray'))
    },
    GetDesign: function(id){
      this.ActiveEmp = id;
    }
  },
  mounted(){
    const self = this
    
      if(self.DesignList.length > 0){
        $(function(){
          $('.sortable').nestedSortable({
              handle: 'div',
              items: 'li',
              toleranceElement: '> div',
              placeholder: 'PLace here'
            });
          });
      }
    
  },
  data () {
    return {
      View: 'DH',
      ActiveEmp: ''

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}
ol {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  margin:5px;
  padding:5px;
}
.sortable > li > div{
  border:1px solid #ddd;
  background-color: #dddddd52;
  padding:5px;
  width:250px;
  border-radius: 5px;
}
a {
  color: #42b983;
}
.dd-item{
  border:1px solid #ddd;
  padding:5px;
}
.tab-head{
  height:45px;
}
.work-area{
  flex: 1 0 0 ;
  overflow: auto;
}
.employee-item{
  padding:1 rem;
  border-bottom: 1px solid #ddd;
}
.act-emp{
  background-color: lightblue;
}
.sub-tab{
  border:1px solid #ddd;
  border-radius: 10px ;
  background-color: #dddddd52;
}
</style>
