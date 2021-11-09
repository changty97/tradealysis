import axios, { AxiosResponse } from "axios";
import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Home } from "../cssComponents/Home";
import DataIcon from "../images/dataIcon3.jpg";
import { IHomeComponent } from "../models/IHomeComponent";
import { ISession } from "../models/ISession";
import { v4 as uuid } from "uuid";

class HomeComponent extends Component<any, IHomeComponent>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            sessionList: []
        };
    }

    componentDidMount(): void
    {
        axios({
            method: "GET",
            url: "http://localhost:3001/getSessionList",
        }).then((response: AxiosResponse<ISession[]>) =>
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
                <Home.SECTION>
                    <Home.LEFT_HOME>
                        <Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                            <Home.LEFT_HOME_MAIN_LIST_PAGEON>
                                <li>Home</li>
                            </Home.LEFT_HOME_MAIN_LIST_PAGEON>
                            <Home.LEFT_HOME_MAIN_LIST>
                                <Link to="/input1"><Home.IMPORT_BUTTON>Import Broker Files</Home.IMPORT_BUTTON></Link>
                            </Home.LEFT_HOME_MAIN_LIST>
                        </Home.LEFT_HOME_MAIN_LIST_DIV_NOWRAP>
                    </Home.LEFT_HOME>
                    <Home.RIGHT_HOME>
                        {this.state.sessionList.map((session: ISession) =>
                        {
                            return (
                                <Home.DATA_ICON_DIV
                                    key={uuid()}
                                    onClick={() => localStorage.setItem("focusedSessionId", session.sessionId)}
                                >
                                    <Link to="/report">
                                        <Home.DATA_ICON src={DataIcon} alt={session.name} height="50%"/>
                                        <div>{session.sessionId}</div>
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
