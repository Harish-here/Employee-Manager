<template>
  <div class="app">
    <!-- first panel -->
    <section class='sec1 bb b--light-silver flex items-stretch' >
      <div class=' w-30 flex justify-center items-center' >
        <span class='flex  .items-stretch ba b--light-silver w-80'>
          <input type="text" v-model="SearchString" style="border:0;outline:none;" placeholder="Search records" class='pa2 w-80'>
          <i class="fa fa-search pa2 w-20 tc" aria-hidden="true"></i>
        </span>
      </div>
      <div class='bl b--light-silver flex justify-center items-center' style='flex:1 0 0;'>
        <ul class=" flex justify-between w-75">
          <li><a href='http://www.hobse.com/demo/index.php/customer/customer/policy'><button class='btn-spl' >Grade Policy</button></a></li>
          <li><button  class='btn-spl' :class='{"btn-rev" : ActiveView === "Department"}' @click='ActiveView = "Department",ActiveSubView = "Create"'>Department</button></li>
          <li><button class='btn-spl' :class='{"btn-rev" : ActiveView === "Designation"}' @click='ActiveView = "Designation",ActiveSubView = "Create"'>Designation</button></li>
          <li><button class='btn-spl' :class='{"btn-rev" : (ActiveView === "Employee")}' @click='ActiveView = "Employee",ActiveSubView = "Create"'>Employee</button></li>
        </ul>
      </div>
    </section>
    <!-- second panel -->
    <section class='sec2 bb b--light-silver' >
      <!-- <div v-if='SearchString !== ""' class='pa1'>Results for <b>{{ SearchString}}</b> <span @click='SearchString = ""' class='fr gray' style="cursor:pointer;">Clear <b>X</b></span></div> -->
      <data-table v-if='ActiveView !== "Approvals"'
                  :ListData='SelectedList'
                  :ViewType='ActiveView'
                  :Query='SearchString'
                  :Extra='DepartList'
                  :subView='ActiveSubView'
                  @rowClicked='setSubView'
                  @ActionDone='GetFreshData'></data-table>

      <Approvals :DesignList='DesignList'
                 :EmpList='SourceList'
                 v-if='ActiveView === "Approvals"' />
    </section>
    <!-- Third -->
    <section class='sec3 bl b--light-silver'>
      <data-form :ViewType='ActiveView' 
                 :ActiveData='ActiveViewData'
                 :SubViewType='ActiveSubView'
                 :DeptData='DepartList'
                 :ApproverData='Approver'
                 @ActionDone='GetFreshData'
                 @CancelViewType='ActiveSubView = "Create"'
                 ></data-form>
    </section>
  </div>
</template>

<script>
import Approvals from '@/components/Approvals'
import DataTable from './components/DataTable'
import DataForm from './components/DataForm'
// import $.get  from '$.get'
import api from './assets/api'

export default {
  name: 'App',
  components: {
    DataTable,DataForm,Approvals
  },
  data(){
    return {
      SourceList: [],
      DepartList: [],
      DesignList: [],
      Approver:[],
      ToDelete: [],
      ActiveView : 'Employee',
      ActiveSubView : 'Create',
      ActiveViewData : {},
      SearchString: '',
      BtnClass: 'f6 dim br2 ph3 pv2 mb2 dib white bg-dark-blue',
      
    }
  },

  computed : {
    SelectedList(){
      if(this.ActiveView === 'Employee') return this.SourceList
      if(this.ActiveView === 'Department') return this.DepartList
      if(this.ActiveView === 'Designation') return this.DesignList
    }
  },

  methods: {
    setSubView: function(data){
      this.ActiveViewData = data.data;
      this.ActiveSubView = data.view;
    },
    SetDelete : function(data){
      this.ToDelete = data;
    },
    GetFreshData: function(){
      var self = this;
      self.getData(api.emp.read,function(data){
          let resign = data.filter(x => x.resign === '1');
          let noApp = data.filter(x => x.approverList.length === 0 && x.resign !== '1');
          let App = data.filter(x => x.approverList.length !== 0 && x.resign !== '1');
          self.SourceList = noApp.concat(App,resign);
          // console.log(noApp.concat(App));
        
      });
      self.getData(api.depart.read,function(data){
        
          self.DepartList = data;

      });
      self.getData(api.design.read,function(data){
    
          self.DesignList = data;
        
      });
      self.getData(api.getApprovar,function(data){
        self.Approver = data;
      });
      // self.ActiveSubView = 'Create';
    },
    getData: function(url,callback){
      $.get(url).done(x =>{
        try{
          var data = (typeof x === "object") ? x : JSON.parse(x); //development purpose problem
        }catch(e){
          alert("An Unexpected Error occurred. Please try again!");
        }
         callback(data)
      }).fail(function(x,s,err){
        
        alert("Service Not Available due to Network issuse. Please Refresh or Login again.!");
      })
    },
  },

  created(){
    const self  = this;
   
    self.getData(api.emp.read,function(data){
          let resign = data.filter(x => x.resign === '1');
          let noApp = data.filter(x => x.approverList.length === 0 && x.resign !== '1');
          let App = data.filter(x => x.approverList.length !== 0 && x.resign !== '1');
          self.SourceList = noApp.concat(App,resign);
          
    });
    self.getData(api.depart.read,function(data){
      self.DepartList = data;
    });
  
    self.getData(api.design.read,function(data){
      self.DesignList = data;
    });
    self.getData(api.getApprovar,function(data){
      self.Approver = data;
    });
  },
}
</script>

<style src='./assets/app.css'>
/* #app {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr;
  display: -ms-grid;
  min-height: 560px;
  box-shadow: 0px 1px 3px 0px rgba(13, 37, 69, .1);
  padding:5px;
  border: 1px solid  rgba(13, 37, 69, .1);
} */
</style>
