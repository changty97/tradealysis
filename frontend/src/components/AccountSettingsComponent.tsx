import { Component, Fragment } from "react";
import { AccountSettings } from "../cssComponents/AccountSettings";

class AccountSettingsComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <AccountSettings.SECTION>
                    <AccountSettings.ACCOUNT_LIST>
                        <AccountSettings.UL_HORIZ_LIST>
                            <AccountSettings.UL_HORIZ_LIST_LI>Account</AccountSettings.UL_HORIZ_LIST_LI>
                        </AccountSettings.UL_HORIZ_LIST>
                        <AccountSettings.FORM>
                            <AccountSettings.LABEL>Account Name:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="text" name="myAccount" id="myAccount" value="My AccountName"/>
                            <AccountSettings.LABEL>First Name:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="text" name="myFName" id="myFName" value="My First Name"/>
                            <AccountSettings.LABEL>Last Name:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="text" name="myLName" id="myLName" value="My Last Name"/>
                            <AccountSettings.LABEL>E-mail:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="email" name="myEmail" id="myEmail" value="myname@gmail.com"/>
                            <AccountSettings.LABEL>Phone:</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="tel" name="Phone" id="Phone" value="(916) 123-4567"/>
                            <AccountSettings.LABEL>Birth Date</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="date" name="myDate" id="myDate"/>
                            <AccountSettings.LABEL>Initial Investment Amount</AccountSettings.LABEL>
                            <AccountSettings.INPUT type="number" name="Initial Investment" id="myIniAmount" min="1" max="100000" value="10000"/>
                            <AccountSettings.INPUT_LAST_OF_TYPE id="mySubmit" type="Submit" value="Save"/>
                        </AccountSettings.FORM>
                    </AccountSettings.ACCOUNT_LIST>
                </AccountSettings.SECTION>
            </Fragment>
        );
    }
}
export { AccountSettingsComponent };
