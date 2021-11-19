import { Component, Fragment } from "react";
import { AxiosResponse } from "axios";
import { Home } from "../cssComponents/Home";
import DataIcon from "../images/dataIcon3.jpg";
import DataIcon_S from "../images/dataIcon3_Selected.jpg";
import { IHomeComponent } from "../models/IHomeComponent";
import { v4 as uuid } from "uuid";
import { IoIosCloseCircle } from 'react-icons/io';
import { api } from "../constants/globals";
import Swal from 'sweetalert2';

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
		 api.get("userSessionsGet", {
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
        Swal.fire({
		  title: `Do you want to Delete ${ sessionID}`,
		  footer: "You won't be able to revert this!",
		  icon: 'warning',
		  showDenyButton: true,
		  showCancelButton: false,
		  confirmButtonText: 'Yes',
		  denyButtonText: `No`,
        }).then((result) =>
        {
		  if (result.isConfirmed)
            {
				const theKey = localStorage.getItem("Key");
				const reportVal = localStorage.getItem("reportsId");
				if (reportVal === sessionID)
				{
					localStorage.removeItem("reportsId");
					this.render();
				}
				 api.get("removeSessionForUser", {
					params: {
						key: `${theKey}`,
						session: `${sessionID}`,
					}
				}).then((response) =>
				{
					Swal.fire(
					{
						title: 'Removed: ' + sessionID,
						timer: 600,
					})
					.then((res) => {
						this.forceUpdate();
						window.location.href = "/";
					});
				});
		  }
			else
			{
				Swal.fire({title:'Not Removed: ' + sessionID, timer:600,});
			}
        })
		.catch((err) =>
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
