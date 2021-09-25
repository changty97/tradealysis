import { Component, Fragment } from "react";
import { NavBarComponent } from "./NavBarComponent";
import { FooterComponent } from "./FooterComponent";

import dataIcon from "../images/dataIcon.jpg";


class HomeComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent />
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
                            <img src={dataIcon} className="dataIcon" alt="data icon"/>
                        </div>
                    </div>
                </section>
                <FooterComponent />
            </Fragment>
        );
    }
}
export { HomeComponent };
