import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { IReportsProps } from "./models/IReportsProps";
import { IReportsState } from "./models/IReportsState";
import { ReportsComponent } from "./components/ReportsComponent";
import { StrategiesComponent } from "./components/StrategiesComponent";
import { HomeComponent } from "./components/HomeComponent";
import { HomeImportComponent } from "./components/HomeImportComponent";
import { Overview } from "./components/Overview";
import { SupportComponent } from "./components/SupportComponent";
import { AboutComponent } from "./components/AboutComponent";
import { PrivacyPolicyComponent } from "./components/PrivacyPolicyComponent";
import { LoginComponent } from "./components/LoginComponent";
import { AccountSettingsComponent } from "./components/AccountSettingsComponent";
import { NavBarComponent } from "./components/NavBarComponent";
import { NavBarLoginComponent } from "./components/NavBarLoginComponent";
import { FooterComponent } from "./components/FooterComponent";
import { FooterLoginComponent } from "./components/FooterLoginComponent";

class App extends Component<IReportsProps, IReportsState>
{
	private loginComponent: LoginComponent;
	
	constructor(props: IReportsProps)
	{
	    super(props);
	    this.loginComponent = new LoginComponent(props);
	}
	public getLoginState():boolean
	{
	    return this.loginComponent.getLoginState();
	}
	
	render(): JSX.Element
	{
	    let elements: JSX.Element;
		
	    if (this.getLoginState())
	    {
	        elements =
			(
			    <React.Fragment>
			        <BrowserRouter>
			           <NavBarComponent/>
			            <Switch>
			                <Route path="/report"><ReportsComponent /></Route>
			                <Route path="/strategies"><StrategiesComponent /></Route>
			                <Route path="/overview"> <Overview /></Route>
			                <Route path="/support"><SupportComponent/></Route>
			                <Route path="/about"><AboutComponent/></Route>
			                <Route path="/privacy"><PrivacyPolicyComponent/></Route>
			                <Route path="/login"><Redirect to="/" /></Route>
			                <Route path="/account"><AccountSettingsComponent/></Route>
			                <Route path="/input1"><HomeImportComponent /></Route>
			                <Route path="/home"><Redirect to="/" /></Route>
			                <Route path="/"><HomeComponent /></Route>
			            </Switch>
			            <FooterComponent/>
			        </BrowserRouter>
			    </React.Fragment>
			);
	    }
	    else
	    {
	        elements =
			(
			    <React.Fragment>
			        <BrowserRouter>
			            <NavBarLoginComponent/>
			            <Switch>
			                <Route path="/report"><Redirect to="/login" /></Route>
			                <Route path="/strategies"><Redirect to="/login" /></Route>
			                <Route path="/overview"><Redirect to="/login" /></Route>
			                <Route path="/support"><SupportComponent/></Route>
			                <Route path="/about"><AboutComponent/></Route>
			                <Route path="/privacy"><PrivacyPolicyComponent/></Route>
			                <Route path="/login">{ this.loginComponent.render() }</Route>
			                <Route path="/account"><AccountSettingsComponent/></Route>
			                <Route path="/input1"><Redirect to="/login" /></Route>
			                <Route path="/home"><Redirect to="/" /></Route>
			                <Route path="/"><Redirect to="/login" /></Route>
			            </Switch>
			           <FooterLoginComponent/>
			        </BrowserRouter>
			    </React.Fragment>
			);
	    }
	    return elements;
	}
}
export { App };
