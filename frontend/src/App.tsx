import { Component } from "react";
import { ReportsComponent } from "./components/ReportsComponent";
import { StrategiesComponent } from "./components/StrategiesComponent";
import { HomeComponent } from "./components/HomeComponent";
import { HomeImportComponent } from "./components/HomeImportComponent";


import { Overview } from "./components/Overview";
import { SupportComponent } from "./components/SupportComponent";
import { AboutComponent } from "./components/AboutComponent"; //PrivacyPolicyComponent
import { PrivacyPolicyComponent } from "./components/PrivacyPolicyComponent";

import { LoginComponent } from "./components/LoginComponent";
import { AccountSettingsComponent } from "./components/AccountSettingsComponent";

import { BrowserRouter, Route, Switch } from 'react-router-dom';

class App extends Component
{
    render(): JSX.Element
    {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path="/report">
                            <ReportsComponent/>
                        </Route>
                        <Route path="/strategies">
                            <StrategiesComponent/>
                        </Route>
                        <Route path="/overview">
                            <Overview/>
                        </Route>
                        <Route path="/support">
                            <SupportComponent/>
                        </Route>
                        <Route path="/about">
                            <AboutComponent/>
                        </Route>
                        <Route path="/privacy">
                            <PrivacyPolicyComponent/>
                        </Route>
                        <Route path="/login">
                            <LoginComponent/>
                        </Route>
                        <Route path="/account">
                            <AccountSettingsComponent/>
                        </Route>
						//HomeImportComponent
                        <Route path="/input1">
                            <HomeImportComponent/>
                        </Route>
                        <Route path="/home">
                            <HomeComponent/>
                        </Route>
                        <Route path="/">
                            <HomeComponent/>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export { App };
