import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom';
import ViewCasesSA from "../case_management/Cases";
import ViewCaseDetailsSA from "../case_management/Case_details";
import ChangePassword from "../Change_password";
import Peoples from "../people_mangement/Peoples";
import AddPeoples from "../people_mangement/Add_people";
import AddEmployee from "../employee_management/Add_employee";
import EmployeeDetails from "../employee_management/Employee_details";
import EmployeeRoles from "../employee_management/Roles_employee";
import ViewEmployees from "../employee_management/View_employees";
import PeopleDetails from "../people_mangement/People_details";
import Proposals from "../case_management/Proposals";
import SATransactions from "../payments/Transactions";

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

                <Route exact path='/sadmin/peoples' component={Peoples} />
                <Route exact path="/sadmin/people/add" component={AddPeoples} />
                <Route exact path="/sadmin/people/:id" component={PeopleDetails} />
                <Route exact path='/sadmin/proposals/:id' component={Proposals} />

                <Route exact path="/sadmin/transactions" component={SATransactions} />
            </Switch>
        </div>
    )
}

export default SAContent