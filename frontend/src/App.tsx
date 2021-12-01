import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { IReportsProps } from "./models/IReportsProps";
import { ReportsComponent } from "./components/ReportsComponent";
import { StrategiesComponent } from "./components/StrategiesComponent";
import { HomeComponent } from "./components/HomeComponent";
import { HomeImportComponent } from "./components/HomeImportComponent";
import { OverviewComponent } from "./components/OverviewComponent";
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
import { LandingComponent } from "./components/LandingComponent";
import { IAppState } from './models/IAppState';
import { api } from "./constants/globals";
import { AxiosResponse } from 'axios';
import { AES256 } from "./Encryption/AES256";
import * as crypto from "crypto-js";

class App extends Component<IReportsProps, IAppState>
{
    constructor(props: IReportsProps)
    {
	    super(props);
	    this.state = {
            username: null
	    };
        this.logout = this.logout.bind(this);
    }
	
    private encryptTest(): void
    {
	    const mssg = `Hello How are you doing today?`;
        const pssd = "pass1";
        const hashPssd = crypto.SHA3(pssd, {outputLength: 512}).toString();
			

		const aes:AES256 = AES256.getInstance();				
        const sKey = aes.generateKey(hashPssd);  // we will store this in our db. First 32 chars is salt val, followed by 64 key vals				
        const ec = aes.encryption(mssg, sKey);  // how to encrypt
		const dcb = aes.decryption(ec, sKey);          // how to decrypt
        console.log(`CypherText: ${  ec}\nDecrypt: ${  dcb}`);

	} 
	
    componentDidMount() : void
    {
        const theKey:string|null = localStorage.getItem("Key");
        if (theKey)
        {
            api.get('/usernameFromKeyGET', {
                params: {
                    key: `${theKey}`,
                }
            })
                .then((res:AxiosResponse<string>) =>
                {
                    if (!res || !res.data || res.data === "")
                    {
                        this.logout();
                    }
                    else
                    {
                        this.setState({
                            username: res.data
                        });
                        this.encryptTest();
                     
						
                    }
                })
                .catch((err: Error) =>  console.error(`Error @ App.componentDidMount():${  err}`));
        }
    }
	
    private logout() : void
    {
	    localStorage.clear();
	    window.location.href = "/login";
    }
	
    render(): JSX.Element
    {
        const theKey = localStorage.getItem("Key");
	    let elements: JSX.Element;
	    if (theKey)
	    {
	        if (theKey !== "")
	        {
	            elements =
				(
				    <React.Fragment>
				        <BrowserRouter>
						   <NavBarComponent user={this.state.username}/>
				            <Switch>
				                <Route path="/report"><ReportsComponent/></Route>
				                <Route path="/strategies"><StrategiesComponent /></Route>
				                <Route path="/overview"> <OverviewComponent /></Route>
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
			                <Route path="/home"><LandingComponent /></Route>
			                <Route path="/"><LandingComponent /></Route>
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
