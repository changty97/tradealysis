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
                <html>
                    <body>
                        <header id="allHeader"><NavBarComponent /></header>
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
                        <footer>
                            <FooterComponent />
                        </footer>
                    </body>
                </html>
            </Fragment>
        );
    }
}
export { HomeComponent };
