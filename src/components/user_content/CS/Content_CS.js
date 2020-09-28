import React from "react";
import {Redirect, Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import ChangePassword from "../Change_password";

const CSContent = () => {
    return(
        <div>
            <Switch>
                <Route exact path='/user/change-password' component={ChangePassword} />
            </Switch>
        </div>
    )
}

export default CSContent