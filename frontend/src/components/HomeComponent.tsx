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
import { LoadingComponent } from "./LoadingComponent";

class HomeComponent extends Component<any, IHomeComponent>
{
    constructor(props: any)
    {
        super(props);
        this.state = {
            reportsId: null,
            sessionList: [],
            loading: false
        };
        this.updateSessionList = this.updateSessionList.bind(this);
		this.clickReportIcon = this.clickReportIcon.bind(this);
		this.changeReportName = this.changeReportName.bind(this);
    }

    componentDidMount(): void
    {
        this.updateSessionList();
    }
	
    private async updateSessionList(): Promise<void>
    {
        const theKey = localStorage.getItem("Key");

        this.setState({
            loading: true
        });

        return await api.get("userSessionsGet", {
            params: {
                key: `${theKey}`,
            }
        }).then((response: AxiosResponse<string[]>) =>
        {
            this.setState({
                sessionList: response.data
            });
            return;
        }).catch((err) =>
        {
            console.error(err);
        }).finally(() =>
        {
            this.setState({
                loading: false
            });
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
                }

                this.setState({
                    loading: true
                });

				 api.get("removeSessionForUser", {
                    params: {
                        key: `${theKey}`,
                        session: `${sessionID}`,
                    }
                }).then((response) =>
                {
                    this.setState({
                        loading: false
                    });
                    Swal.fire(
                        {
                            title: `Removed: ${  sessionID}`,
                            timer: 600,
                            showConfirmButton: false,
                        })
                        .then(() =>
                        {
                            return this.updateSessionList();
                        });
                });
		  }
            else
            {
                Swal.fire({
                    title: `Not Removed: ${  sessionID}`,
                    timer: 600,
                    showConfirmButton: false
                });
            }
        })
            .catch((err) =>
            {
                console.error(err);
            });
    }

	private changeReportName(sessionID: string):void {
		let theNewFileName = "";
		const theKey = localStorage.getItem("Key");
		Swal.fire({
		  title: "Change File Name: '" + sessionID + "'",
		  input: 'text',
		  showCancelButton: true,
		  showLoaderOnConfirm: true,
		  confirmButtonText: 'Change',
		  preConfirm: (newFileName:string) => {
			return api.get("/changeSessionName", {
				params: { key: theKey, sid: `${sessionID}`, newSid:`${newFileName}` }
			})
			  .then((response:AxiosResponse<boolean>) => {
				if (response && !response.data) {
				  throw new Error("Invalid Entry")
				}
				theNewFileName = newFileName;
				return;
			  })
			  .catch((error:Error) => { Swal.showValidationMessage( `Request Failed: ${error}` ) })
		  },
		  allowOutsideClick: () => !Swal.isLoading()
		}).then((result) => {
		  if (result.isConfirmed) {
			  if(localStorage.getItem("reportsId") === sessionID) {
				  localStorage.setItem("reportsId", theNewFileName);
			  }
			  Swal.fire({
                title: `Changed ${sessionID} to ${theNewFileName}`,
                timer: 600,
                showConfirmButton: false
              })
			  .then(() =>
			  {
				  this.updateSessionList();
			  });
		  }
		});
	}
	
    render(): JSX.Element
    {
        return (
            <Fragment>
                {this.state.loading ? <LoadingComponent /> : null}
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
								   <div>
                                        <br/>
                                        <Home.DATA_ICON src={icon} alt={theKey} onClick={() => this.clickReportIcon(session)} />
                                        <Home.DATA_ICON_TEXT_DIV onClick={() => this.changeReportName(session)}>{session}</Home.DATA_ICON_TEXT_DIV>
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
