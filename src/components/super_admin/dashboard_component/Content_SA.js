import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom';
import ViewCasesSA from "../case_management/Cases";
import ViewCaseDetailsSA from "../case_management/Case_details";
import ChangePassword from "../Change_password";
import AddPeoples from "../client_mangement/Add_people";
import Clients from "../client_mangement/Clients";
import AddEmployee from "../employee_management/Add_employee";
import EmployeeDetails from "../employee_management/Employee_details";
import EmployeeRoles from "../employee_management/Roles_employee";
import ViewEmployees from "../employee_management/View_employees";

const SAContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/sadmin/change-password' component={ChangePassword} />
                <Route exact path='/sadmin/employees' component={ViewEmployees} />
                <Route exact path='/sadmin/add-employee' component={AddEmployee} />
                <Route exact path='/sadmin/employee/:id' component={EmployeeDetails} />
                <Route exact path='/sadmin/employee/roles/:id' component={EmployeeRoles} />
                <Route exact path='/sadmin/cases' component={ViewCasesSA} />
                <Route exact path='/sadmin/case/:id' component={ViewCaseDetailsSA} />

                <Route exact path='/sadmin/peoples' component={Clients} />
                <Route exact path="/sadmin/people/add" component={AddPeoples} />
            </Switch>
        </div>
    )
}

export default SAContent