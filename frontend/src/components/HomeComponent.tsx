import { Component, Fragment } from "react";
import { IReportsProps } from "../models/IReportsProps";
import { IReportsState } from "../models/IReportsState";
// import { Link } from "react-router-dom";
import { NavBarComponent } from "./NavBarComponent";
import {FooterComponent1 } from "./FooterComponent1";

import dataIcon from "../images/dataIcon.jpg";


class HomeComponent extends Component<IReportsProps, IReportsState>
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
                <html>
                    <body>
                        <header id="allHeader"><NavBarComponent/></header>
                        <section>
                            <div className="leftHome">
                                <div className="leftHomeMainListDiv noWrap">
                                    <ul className="leftHomeMainList pageOn">
                                        <li>Home</li>
                                    </ul>
                                    <ul className="leftHomeMainList">
                                        <button>Import Broker Files</button>
                                    </ul>
                                </div>
                            </div>
                            <div className="rightHome">
                                <div className="dataIconDiv">
                                    <img src={dataIcon} className="dataIcon" />		
                                </div>
                            </div>
                        </section>
						<footer>
							<FooterComponent1/>
						</footer>
                    </body>
                </html>
            </Fragment>
        );
    }
}
export { HomeComponent };
