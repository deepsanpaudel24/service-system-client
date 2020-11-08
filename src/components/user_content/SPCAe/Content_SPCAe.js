import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import ChangePassword from "../Change_password";

//clients related imports
import AddClients from "../client_management/Add_Clients";
import Clients from "../client_management/Clients";
import ClientDetails from "../client_management/Client_details";

//Employee Related imports
import AddEmployee from "../employee_management/Add_employee";
import EmployeeDetails from "../employee_management/Employee_details";
import EmployeeRoles from "../employee_management/Roles_employee";
import ViewEmployees from "../employee_management/View_employees";

//services related imports
import AddService from "../service_management/Add_Service";
import EditService from "../service_management/Edit_service";
import Services from "../service_management/Services";

//Cases related import 
import ViewCasesemp from "../case_management/Cases_employees";
import ViewCaseDetailsSP from "../case_management/Case_SP_details";
import ReplyCaseRequest from "../case_management/Case_SP_reply";

const SPCAeContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/user/change-password' component={ChangePassword} />
                <Route exact path='/user/employees' component={ViewEmployees} />
                <Route exact path='/user/add-employee' component={AddEmployee} />
                <Route exact path='/user/employee/:id' component={EmployeeDetails} />
                <Route exact path='/user/employee/roles/:id' component={EmployeeRoles} />

                <Route exact path='/user/cases' component={ViewCasesemp} />
                <Route exact path='/user/case/:id' component={ViewCaseDetailsSP} />
                <Route exact path='/user/case/reply/:id' component={ReplyCaseRequest} />

                <Route exact path='/user/services' component={Services} />
                <Route exact path='/user/add-service' component={AddService} />
                <Route exact path='/user/edit-service/:id' component={EditService} />

                <Route exact path="/user/clients" component={Clients} />
                <Route exact path="/user/client/add" component={AddClients} />
                <Route exact path="/user/client/:id" component={ClientDetails} />
            </Switch>
        </div>
    )
}

export default SPCAeContent