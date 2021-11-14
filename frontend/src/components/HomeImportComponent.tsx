import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Home } from "../cssComponents/Home";
import { Import } from "../cssComponents/Import";
import axios from "axios";
import { IHomeImportComponentState } from "../models/IHomeImportComponentState";

class HomeImportComponent extends Component<any, IHomeImportComponentState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            selectedFile: null
        };

        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.importFile = this.importFile.bind(this);
    }

    handleFileSelection(event: React.ChangeEvent<HTMLInputElement>): void
    {
        if (event.target.files)
        {
            this.setState({
                selectedFile: event.target.files[0]
            });
        }
    }
    
    async importFile(): Promise<void>
    {
        if (!this.state.selectedFile)
        {
            return;
        }

        const formData: FormData = new FormData();

        formData.append("sourceName", "TDAmeritrade");
        formData.append("file", this.state.selectedFile);

        try
        {
            const parsedData = (await axios({
                method: "POST",
                url: "http://localhost:3001/parseCSV",
                data: formData
            })).data;

            const newCollName: string = (await axios({
                method: "GET",
                url: "http://localhost:3001/createNewSessionForUser",
                params: {
                    key: localStorage.getItem("Key"),
                    collectionName: this.state.selectedFile.name
                }
            })).data;

            await axios({
                method: "POST",
                url: "http://localhost:3001/postTableDB",
                data: {
                    data: {
                        table: parsedData,
                        coll: `${newCollName}_stock_data`
                    }
                }
            });

            localStorage.setItem("reportsId", newCollName);
        }
        catch (err)
        {
            console.error(err);
        }

        window.location.href = "/report";
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
                        <div className="formBlock">
                            <Import.FORM onSubmit={e => e.preventDefault()}>
                                <div className="INNER_FORM">
                                    <Import.FORM_TOP_DIV>
                                        <Import.FORM_TOP_DIV_LABEL>Select broker's file to import:</Import.FORM_TOP_DIV_LABEL>
                                        <Import.FORM_TOP_DIV_INPUT type="file" id="myfile" name="file_input" onChange={this.handleFileSelection} />
                                    </Import.FORM_TOP_DIV>
                                    <Import.FORM_BOTTOM_DIV>
                                        <Import.FORM_BOTTOM_DIV_INPUT type="submit" id="myfile2" onClick={this.importFile}/>
                                    </Import.FORM_BOTTOM_DIV>
                                </div>
                            </Import.FORM>
                        </div>
                    </Home.RIGHT_HOME>
                </Home.SECTION>
            </Fragment>
        );
    }
}
export { HomeImportComponent };
