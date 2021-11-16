import axios, { AxiosResponse } from "axios";
import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Home } from "../cssComponents/Home";
import DataIcon from "../images/dataIcon3.jpg";
import DataIcon_S from "../images/dataIcon3_Selected.jpg";
import { IHomeComponent } from "../models/IHomeComponent";
import { v4 as uuid } from "uuid";

class HomeComponent extends Component<any, IHomeComponent>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            reportsId: null,
            sessionList: []
        };
    }

    componentDidMount(): void
    {
        const theKey = localStorage.getItem("Key");
		 axios({
            method: "GET",
            url: "http://localhost:3001/userSessionsGet",
            params: {
                key: `${theKey}`,
            }
        }).then((response: AxiosResponse<string[]>) =>
        {
            this.setState({
                sessionList: response.data
            });
        }).catch((err) =>
        {
            console.error(err);
        });
    }

    render(): JSX.Element
    {
        return (
            <Fragment>
                <Home.HEADER>Recent Files</Home.HEADER>
                <Home.SECTION>
                    <Home.RIGHT_HOME>
                        {this.state.sessionList.map((session: string) =>
                        {
                            let icon = DataIcon;
                            if (localStorage.getItem("reportsId") === session)
                            {
                                icon = DataIcon_S;
                            }
                            const theKey = uuid();
                            return (
                                <Home.DATA_ICON_DIV key={theKey} onClick={() => localStorage.setItem("reportsId", session)}>
                                    <Link to="/report">
                                        <Home.DATA_ICON src={icon} alt={theKey}/>
                                        <Home.DATA_ICON_TEXT_DIV>{session}</Home.DATA_ICON_TEXT_DIV>
                                    </Link>
                                </Home.DATA_ICON_DIV>

                            );
                        })}
                    </Home.RIGHT_HOME>
                </Home.SECTION>
            </Fragment>
        );
    }
}
export { HomeComponent };
