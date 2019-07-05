<template>
  <div class="app">
    <section class='sec4 br b--light-silver  ghost-white' id='sidebar'>
      <ul class="flex flex-column-reverse" >
          <li class='p10-20 centering'>
            <a style="text-align:center" :href='global + "/company/fileImport/1"'>
            <span class='tc'>
              <i class="fa fa-cloud-upload" aria-hidden="true"></i><br>
               Import
            </span> </a>
          </li>        
          <li class='p10-20 centering'>
            <a style="text-align:center" :href='global + "/customer/policy/grade"'>
            <span class='tc'>
              <i class="fa fa-cog" aria-hidden="true"></i><br>
              Travel Policy
            </span> </a>
          </li>
          <li class='p10-20 centering'
              :class='{"btn-rev" : ActiveView === "Department"}' @click='ActiveView = "Department",ActiveSubView = ""'>
            <span class='tc'>
              <i class="fa fa-briefcase" aria-hidden="true"></i><br>
              Department
            </span>
          </li>
          <li class='p10-20 centering'
              :class='{"btn-rev" : ActiveView === "Team"}' @click='ActiveView = "Team",ActiveSubView = ""'>
            <span class='tc'>
              <i class="fa fa-users" aria-hidden="true"></i><br>
              Team
            </span>
          </li>
          <li class='p10-20 centering'
              :class='{"btn-rev" : ActiveView === "Designation"}' @click='ActiveView = "Designation"'>
            <span class='tc'>
              <i class="fa fa-briefcase" aria-hidden="true"></i><br>
              Designation
            </span>
          </li>
          <li class='p10-20 centering'
              :class='{"btn-rev" : (ActiveView === "Employee")}' @click='ActiveView = "Employee"'>
            <span class='tc'>
              <i class="fa fa-user" aria-hidden="true"></i><br>
              Traveller
            </span>
          </li>
      </ul>
    </section>
    <!-- first panel -->
    <section class='sec1 flex items-center' >
      <div class='fl w-20 pa3'>
        {{ Found }} {{((ActiveView === "Employee") ? "Traveller" : ActiveView) + '(s)'}} found.
      </div>
      
      <div class='fr w-40 pa3'>
        <div class='fr w-70 flex justify-center items-center' >
          <span class='flex items-center ba b--light-silver w-80'>
            <input type="text" v-model="SearchString" style="border:0;outline:none;" placeholder="Search records" class='pa2 w-80'>
            <i class="fa fa-search pa2 w-20 tc" aria-hidden="true"></i>
          </span>
        </div>
      </div>
      <div class="fr w-40 pa3 tr">
        <button @click='ActiveSubView = "Create"' class="btn btn-xs btn-primary">Add {{(ActiveView === "Employee") ? "Traveller" : ActiveView}}</button>
        <!-- <button v-if='ActiveView === "Department" || ActiveView === "Team"' @click='ActiveView = "Team",ActiveSubView = "Create"' class="btn btn-xs btn-primary">Add Team</button> -->
        <!-- <button v-if='ActiveView === "Employee"' @click='ActiveSubView = "Create"' class="btn ml2 btn-xs btn-primary">Import {{ActiveView}}</button> -->
      </div>
      
    </section>
    <!-- second panel -->
    <section class='sec2 bb b--light-silver flex flex-column' >
      <!-- <div v-if='SearchString !== ""' class='pa1'>Results for <b>{{ SearchString}}</b> <span @click='SearchString = ""' class='fr gray' style="cursor:pointer;">Clear <b>X</b></span></div> -->
      <data-table v-if='ActiveView !== "Approvals"'
                  :ListData='SelectedList'
                  :ViewType='ActiveView'
                  :Query='SearchString'
                  :Extra='DepartList'
                  :NeedToRefresh='NeedToRefreshTable'
                  :subView='ActiveSubView'
                  @rowClicked='setSubView'
                  @TableDataRefreshed ='NeedToRefreshTable = false'
                  @ListChanged ="SetLength"
                  @ActionDone='GetFreshData'></data-table>

      <Approvals :DesignList='DesignList'
                 :EmpList='SourceList'
                 v-if='ActiveView === "Approvals"' />
    </section>
    <!-- Third -->
    <section class='sec3 bl b--light-silver'>
      <data-form :ViewType='ActiveView'
                 :EmpSub='EmpSub' 
                 :ActiveData='ActiveViewData'
                 :SubViewType='ActiveSubView'
                 :DeptData='DepartList'
                 :ApproverData='Approver'
                 @ActionDone='GetFreshData'
                 @CancelViewType='ActiveSubView = "",ActiveSubView = "Create";'
                 :ModeOfWorking='mode'
                 ></data-form>
    </section>
  </div>
</template>

<script>
import Approvals from '@/components/Approvals'
import DataTable from './components/DataTable'
import DataForm from './components/DataForm'
// import axios from 'axios'
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
      global: global_base_url,
      DepartList: [],
      DesignList: [],
      Approver:[],
      ToDelete: [],
      ActiveView : 'Employee',
      ActiveSubView : '',
      ActiveViewData : {},
      SearchString: '',
      BtnClass: 'f6 dim br2 ph3 pv2 mb2 dib white bg-dark-blue',
      Found: 0,
      NeedToRefreshTable: false,
      EmpSub: 'create',
      url: {
        Employee: 'employees',
        Department: 'department',
        Designation: 'designations'
      },
      mode: {
        "initialSetupStatus": "2",
        "defaultTeam": "",
        "defaultDesignation": "",
        "designationConfigApplicableStatus": "0",
        "travelApprovalStatus": "0",
        "departmentConfigApplicableStatus": "0",
        "travelDeskConfigApplicableStatus": "0"
      }
      
    }
  },

  computed : {
    SelectedList(){
      if(this.ActiveView === 'Employee') return this.SourceList
      if(this.ActiveView === 'Department') return this.DepartList.filter(x => x.parent == "0")
      if(this.ActiveView === 'Designation') return this.DesignList
      if(this.ActiveView === 'Team') return this.DepartList.filter(x => x.parent != "0")
    }
  },

  methods: {
    SetLength: function(data){
      this.Found = data;
    },
    changeViewToDepartment: function(){
      if(this.ActiveView === "Team"){
        this.ActiveView = "Department";
        this.ActiveSubView = "Create"
      }
    },
    setSubView: function(data){
      if("parent" in  data.data){
        if(data.data["parent"] != 0){
           this.ActiveView = "Team"
        }else{
          this.ActiveView = "Department"
        }
       
      }
      this.ActiveViewData = data.data;
      this.ActiveSubView = data.view;
      
      // if(data.view === "Update" || data.view === "Create"){
      //   this.EmpSub = 'create'
      // }
    },
    SetDelete : function(data){
      this.ToDelete = data;
    },
    GetFreshData: function(){
      var self = this;
      this.NeedToRefreshTable = true;
      self.getData(api.emp.read,function(data){
          let resign = data.filter(x => x.resign === '1');
          let noApp = data.filter(x => x.approverList.length === 0 && x.resign !== '1');
          let App = data.filter(x => x.approverList.length !== 0 && x.resign !== '1');
          let temp = noApp.concat(App,resign);
          
           self.SourceList = temp.map(function(x){
             if(x['travelDesk'] === undefined){
               x['travelDesk'] = {label: "",value: ""}
             }
              x["canLetPassApproval"] = (x["canLetPassApproval"] == "1") ? true : false;
             return x
           });
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
          alert("An unexpected error occurred. Please refresh or login again.");
        }
         callback(data)
      }).fail(function(x,s,err){
        
        alert("It seems service not available due to network issue. Please refresh or login again.");
      })
    },
    CreateHistory: function(type){
      const self = this;
      let url  = location.href.split('/').filter(x => x != 'employees' && x != 'department' && x != 'designations').join('/');
      
      history.pushState({liveRoute: type},'Page'+type,url+'/'+type);

    },
  },
  watch: {
    ActiveView: function(val,old){
      let temp = this.ActiveSubView;
      if(val === "Team"){
        return
      }
      if(old !== ""){
        this.CreateHistory(this.url[val]);
      }
      this.ActiveSubView = "";

      if(val === "Department" && old === "Team"){
        this.ActiveSubView = temp
      }
    }
  },

  created(){
    const self  = this;
   
    self.getData(api.emp.read,function(data){
          let resign = data.filter(x => x.resign === '1');
          let noApp = data.filter(x => x.approverList.length === 0 && x.resign !== '1');
          let App = data.filter(x => x.approverList.length !== 0 && x.resign !== '1');
          let temp = noApp.concat(App,resign);
          
           self.SourceList = temp.map(function(x){
             if(x['travelDesk'] === undefined){
               x['travelDesk'] = {label: "",value: ""}
             }
              x["canLetPassApproval"] = (x["canLetPassApproval"] == "1") ? true : false;
             return x
           });
          
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
    self.getData(api.config,function(data){ 
          self.mode = data;
    });
      //for url stuffs
     let arr = location.href.split('/');
     let type = (arr[arr.length -1 ] == 'employees' || arr[arr.length -1 ] == 'department' || arr[arr.length -1 ] == 'designations') ? arr[arr.length -1 ] : 'employees';//get last element
      switch(type){
        case 'employees' : self.ActiveView = 'Employee';break;
        case 'department' : self.ActiveView = 'Department';break;
        case 'designations' : self.ActiveView = 'Designation';break;
        // case 'department' : self.ActiveView = 'Department';break;
      }
    //  this.CreateHistory(type);

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
 *{
        word-wrap: break-word;
      }
</style>
