import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import ViewCasesClient from "../case_management/Cases";
import ViewCaseDetailsClient from "../case_management/Case_details";
import ViewCasesProposalClient from "../case_management/Case_propsals_client";
import CreateCaseRequest from "../case_management/Create_caseRequest";
import ViewProposalDetailsClient from "../case_management/Proposal_Details_clients";
import ChangePassword from "../Change_password";
import AddEmployee from "../employee_management/Add_employee";
import EmployeeDetails from "../employee_management/Employee_details";
import EmployeeRoles from "../employee_management/Roles_employee";
import ViewEmployees from "../employee_management/View_employees";

const CCAContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/user/change-password' component={ChangePassword} />
                <Route exact path='/user/employees' component={ViewEmployees} />
                <Route exact path='/user/add-employee' component={AddEmployee} />
                <Route exact path='/user/employee/:id' component={EmployeeDetails} />
                <Route exact path='/user/employee/roles/:id' component={EmployeeRoles} />
                <Route exact path='/user/cases' component={ViewCasesClient} />
                <Route exact path='/user/create-case-request' component={CreateCaseRequest} />
                <Route exact path='/user/case/:id' component={ViewCaseDetailsClient} />
                <Route exact path='/user/case/proposals/:id' component={ViewCasesProposalClient} />
                <Route exact path='/user/proposal/:id' component={ViewProposalDetailsClient} />
            </Switch>
        </div>
    )
}

export default CCAContent