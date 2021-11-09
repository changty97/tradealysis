import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { IReportsProps } from "./models/IReportsProps";
import { ReportsComponent } from "./components/ReportsComponent";
import { StrategiesComponent } from "./components/StrategiesComponent";
import { HomeComponent } from "./components/HomeComponent";
import { HomeImportComponent } from "./components/HomeImportComponent";
import { Overview } from "./components/Overview";
import { SupportComponent } from "./components/SupportComponent";
import { AboutComponent } from "./components/AboutComponent";
import { PrivacyPolicyComponent } from "./components/PrivacyPolicyComponent";
import { LoginComponent } from "./components/LoginComponent";
import { CreateAccountComponent } from "./components/CreateAccountComponent";
import { AccountSettingsComponent } from "./components/AccountSettingsComponent";
import { NavBarComponent } from "./components/NavBarComponent";
import { NavBarLoginComponent } from "./components/NavBarLoginComponent";
import { FooterComponent } from "./components/FooterComponent";
import { FooterLoginComponent } from "./components/FooterLoginComponent";
import { IAppState } from './models/IAppState';
import axios from "axios";

class App extends Component<IReportsProps, IAppState>
{
    constructor(props: IReportsProps)
    {
	    super(props);
	    this.state = {
	        reportsId: null
	    };
        this.componentIsMounting();
        this.setFocus = this.setFocus.bind(this);
    }
	
    async componentIsMounting() : Promise<void>
    {
        const theKey = localStorage.getItem("Key");
        if (theKey)
        {
            return await axios.get('http://localhost:3001/usernameFromKeyGET', {
                params: {
                    key: `${theKey}`,
                }
            })
                .then((res) =>
                {
                    this.setFocus(res.data);
                })
                .catch((err: Error) =>
                {
                    return Promise.reject(err);
                });
        }
    }

    private setFocus(id: string): void
    {
        this.setState({
            reportsId: id
        });
    }
	
    render(): JSX.Element
    {
        const theKey = localStorage.getItem("Key");
	    let elements: JSX.Element;
	    if (theKey !== null )
	    {
	        if (theKey !== "")
	        {
	            elements =
				(
				    <React.Fragment>
				        <BrowserRouter>
						   <NavBarComponent user={this.state.reportsId}/>
				            <Switch>
				                <Route path="/report"><ReportsComponent reportsId={this.state.reportsId}/></Route>
				                <Route path="/strategies"><StrategiesComponent /></Route>
				                <Route path="/overview"> <Overview /></Route>
				                <Route path="/support"><SupportComponent/></Route>
				                <Route path="/about"><AboutComponent/></Route>
				                <Route path="/privacy"><PrivacyPolicyComponent/></Route>
				                <Route path="/login"><Redirect to="/" /></Route>
				                <Route path="/account"><AccountSettingsComponent/></Route>
				                <Route path="/createaccount"><Redirect to="/" /></Route>
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
	            localStorage.clear();
	            elements = this.render();
	            return elements;
	        }
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
			                <Route path="/login"><LoginComponent/></Route>
			                <Route path="/account"><AccountSettingsComponent/></Route>
			                <Route path="/createaccount"><CreateAccountComponent/></Route>
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
