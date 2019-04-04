const local = 'http://localhost/';
function ReturnModel(c,r,u,d){
    const actions = {
        create : c,
        read: r,
        update: u,
        delete: d,
    }
    return  JSON.parse(JSON.stringify(actions))  
}

const BaseUrl = global_base_url + '/employee/';
//emp read dummy data https://api.myjson.com/bins/142woe
const Emp  = ReturnModel(
    BaseUrl + 'employeeCreate',
    BaseUrl + 'employeeJSON',
    BaseUrl + 'employeeUpdate',
    BaseUrl + 'employeeDelete'
);

const Depart = ReturnModel(
    BaseUrl + 'deptCreate',
    // 'http://localhost/',
    BaseUrl + 'deptRead',
    BaseUrl + 'deptUpdate',
    BaseUrl + 'deptDelete'
);
const Design = ReturnModel(
     BaseUrl + 'designationCreate',
     BaseUrl + 'designationRead',
     BaseUrl + 'designationUpdate',
     BaseUrl + 'designationDelete'
);

export default {
    emp: Emp,
    depart: Depart,
    design: Design,
    dropdown: {
        design: BaseUrl + 'designation',
        bundle: BaseUrl + 'employeeBundleId',
    },
    deleteAll : BaseUrl + 'employeeBulkDelete',
    updateBulk : BaseUrl + 'employeeBulkUpdate',
    fileUpload: BaseUrl + 'employeeImport',
    getApprovar: BaseUrl + 'approverList',
    resignEmployee: BaseUrl + 'resign',
    travelDeskList: BaseUrl + 'travelDesk',
    teamOptions: BaseUrl + 'deptProps' 
}