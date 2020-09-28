import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import ViewCasesSA from "../case_management/Cases";
import ViewCaseDetailsSA from "../case_management/Case_details";
import ChangePassword from "../Change_password";
import AddEmployee from "../employee_management/Add_employee";
import ViewEmployees from "../employee_management/View_employees";

const SAContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/sadmin/change-password' component={ChangePassword} />
                <Route exact path='/sadmin/employees' component={ViewEmployees} />
                <Route exact path='/sadmin/add-employee' component={AddEmployee} />
                <Route exact path='/sadmin/cases' component={ViewCasesSA} />
                <Route exact path='/sadmin/case/:id' component={ViewCaseDetailsSA} />
            </Switch>
        </div>
    )
}

export default SAContent