import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";

class FooterComponent1 extends Component<IReportsProps, IReportsState>
{
    constructor(props: IReportsProps)
    {
        super(props);
        this.state = {
            url: ""
        };
    }
	
    render(): JSX.Element
    {
        return (
            <Fragment>
                <div>
                    <ul>
                        <li><a href="./account1.html">Your Account</a></li>
                        <li><a href="/support">Support</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="./privacy.html">Privacy Policy</a></li>
                    </ul>
                </div>
            </Fragment>
        );
    }
}
export { FooterComponent1 };
