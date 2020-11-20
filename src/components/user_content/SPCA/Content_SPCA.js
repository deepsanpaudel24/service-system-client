import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom';
import ViewCasesSP from "../case_management/Cases_SP_View";
import ViewCaseDetailsSP from "../case_management/Case_SP_details";
import ReplyCaseRequest from "../case_management/Case_SP_reply";
import UploadContractPaper from "../case_management/Upload_contractpaper";
import ChangePassword from "../Change_password";
import ClientIntakeFormList from "../client_intake_form/ClientIntakeFormList";
import ClientIntakeForm from "../client_intake_form/CreateIntakeForm";
import NewCreateIntakeForm from "../client_intake_form/NewCreateIntakeForm";
import SendIntakeForm from "../client_intake_form/SendClientIntakeForm";
import AddClients from "../client_management/Add_Clients";
import Clients from "../client_management/Clients";
import ClientDetails from "../client_management/Client_details";
import CreateClientCase from "../client_management/Create_client_case";
import ContractDetails from "../contract_management/Contract_Details";
import CreateTask from "../custom_tasks/Add_tasks";
import Tasks from "../custom_tasks/Tasks";
import TaskDetails from "../custom_tasks/Task_details";
import AddEmployee from "../employee_management/Add_employee";
import EmployeeDetails from "../employee_management/Employee_details";
import EmployeeRoles from "../employee_management/Roles_employee";
import ViewEmployees from "../employee_management/View_employees";
import ProfileSetting from "../Profile_setting";
import AddService from "../service_management/Add_Service";
import EditService from "../service_management/Edit_service";
import Services from "../service_management/Services";

const SPCAContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/user/change-password' component={ChangePassword} />
                <Route exact path="/user/profile-setting" component={ProfileSetting} />
                <Route exact path='/user/employees' component={ViewEmployees} />
                <Route exact path='/user/add-employee' component={AddEmployee} />
                <Route exact path='/user/employee/:id' component={EmployeeDetails} />
                <Route exact path='/user/employee/roles/:id' component={EmployeeRoles} />

                <Route exact path='/user/cases' component={ViewCasesSP} />
                <Route exact path='/user/case/:id' component={ViewCaseDetailsSP} />
                <Route exact path='/user/case/reply/:id' component={ReplyCaseRequest} />
                <Route exact path='/user/case/send/contract/:id' component={UploadContractPaper} />
                <Route exact path='/user/contract/:id' component={ContractDetails} />

                <Route exact path='/user/services' component={Services} />
                <Route exact path='/user/add-service' component={AddService} />
                <Route exact path='/user/edit-service/:id' component={EditService} />

                <Route exact path="/user/clients" component={Clients} />
                <Route exact path="/user/client/add" component={AddClients} />
                <Route exact path="/user/client/:id" component={ClientDetails} />
                <Route exact path="/user/client/create-case/:id" component={CreateClientCase} />

                <Route exact path="/user/tasks" component={Tasks} />
                <Route exact path="/user/create-task" component={CreateTask} />
                <Route exact path="/user/tasks/:id" component={TaskDetails} />

                <Route exact path="/user/intake/form/:id" component={ClientIntakeForm} />
                <Route exact path="/user/create-intake-form" component={NewCreateIntakeForm} />
                <Route exact path="/user/intake-form/list" component={ClientIntakeFormList} />
                <Route exact path="/user/client/intake-form-send/:id" component={SendIntakeForm} />
            </Switch>
        </div>
    )
}

export default SPCAContent