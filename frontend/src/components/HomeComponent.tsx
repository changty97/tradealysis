import axios, { AxiosResponse } from "axios";
import { Component, Fragment } from "react";
import { Home } from "../cssComponents/Home";
import DataIcon from "../images/dataIcon3.jpg";
import DataIcon_S from "../images/dataIcon3_Selected.jpg";
import { IHomeComponent } from "../models/IHomeComponent";
import { v4 as uuid } from "uuid";
import { IoIosCloseCircle } from 'react-icons/io';
import { SERVICE_URL } from "../constants/globals";

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
            url: `${SERVICE_URL}/userSessionsGet`,
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
	
    private clickReportIcon(sessionID: string):void
    {
        localStorage.setItem("reportsId", sessionID);
        this.setState({
        });
        setTimeout(() =>
        {
            window.location.href = "/report";
        }, 100);
    }
	
    private deleteReportIcon(sessionID:string):void
    {
        const theKey = localStorage.getItem("Key");
        const reportVal = localStorage.getItem("reportsId");
		
        if (reportVal === sessionID)
        {
            localStorage.removeItem("reportsId");
            this.render();
        }
		 axios({
            method: "GET",
            url: `${SERVICE_URL}/removeSessionForUser`,
            params: {
                key: `${theKey}`,
                session: `${sessionID}`,
            }
        }).then((response) =>
        {
            this.forceUpdate();
            window.location.href = "/";
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
                                <Home.DATA_ICON_DIV key={theKey}>
								   <div>
                                        <IoIosCloseCircle size={17} onClick={() => this.deleteReportIcon(session)}/>
                                    </div>
								   <div onClick={() => this.clickReportIcon(session)}>
                                        <br/>
                                        <Home.DATA_ICON src={icon} alt={theKey}/>
                                        <Home.DATA_ICON_TEXT_DIV>{session}</Home.DATA_ICON_TEXT_DIV>
                                    </div>
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
