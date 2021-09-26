import { Component, Fragment } from "react";
import { NavBarComponent } from "./NavBarComponent";
import { FooterComponent } from "./FooterComponent";

class AccountSettingsComponent extends Component
{
	
    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent/>
                <section>
                    <div className="accountlist">
					  <ul id="horizontal-list">
                            <li> <a href="Account1.html">Account</a> </li>
						 
                            <li> <a href="Broker.html">Broker</a> </li>
                            <li> <a href="Other.html">Others</a> </li>
					  </ul>
                        <form>
                            <label>Account Name:</label>
                            <input type="text" name="myAccount" id="myAccount" value="My AccountName"/>
							 
							 <label>First Name:</label>
							 <input type="text" name="myFName" id="myFName" value="My First Name"/>
							
                            <label>Last Name:</label>
                            <input type="text" name="myLName" id="myLName" value="My Last Name"/>
							
                            <label>E-mail:</label>
                            <input type="email" name="myEmail" id="myEmail" value="myname@gmail.com"/>
							
                            <label>Phone:</label>
                            <input type="tel" name="Phone" id="Phone" value="(916) 123-4567"/>
							
                            <label>Birth Date</label>
                            <input type="date" name="myDate" id="myDate"/>
							
                            <label>Initial Investment Amount</label>
                            <input type="number" name="Initial Investment" id="myIniAmount" min="1" max="100000" value="10000"/>
							 
							 <input id="mySubmit" type="Submit" value="Save"/>
                        </form>
                    </div>
                </section>
                <FooterComponent/>
            </Fragment>
        );
    }
}
export { AccountSettingsComponent };
