import { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Home } from "../cssComponents/Home";
import { Import } from "../cssComponents/Import";
import { tableProps } from "../constants/tableProps";
import { IHomeImportComponentState } from "../models/IHomeImportComponentState";
import axios from "axios";
// import { tableProps } from "../constants/tableProps";

class HomeImportComponent extends Component<any, IHomeImportComponentState>
{

    constructor(props: any)
    {
        super(props);
        this.state = {
            tableProps,
        };

        this.convertImportedData = this.convertImportedData.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }
    // TO DO: Call this after file is imported
    //          creates an array of objects that resembles spreadsheet data structure
    
    convertImportedData(importedFile: any): void
    {
        console.log(Buffer.from(importedFile));
        axios.get(`http://localhost:3001/getTableDB`, {
            params: {
                sourceName: "TDAmeritrade",
                file: {
                    fieldname: 'file',
                    originalname: importedFile.name,
                    encoding: '7bit',
                    mimetype: 'text/csv',
                    buffer: Buffer.from(importedFile),
                    size: 173762
                }
            }
        }).then((response) =>
        {
            console.log(response.data);
            return;
        });
        console.log(`The Imported Data: ${  this.state.tableProps.data}`);
        return;
    }

    /*
    handleChange(event:Event): void
    {
        console.log("Selected file - ${event.target.files[0].name}");
    }
    
*/
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
                            <Import.FORM action="./home.html">
                                <div className="INNER_FORM">
                                    <Import.FORM_TOP_DIV>
                                        <Import.FORM_TOP_DIV_LABEL>Select broker's file to import:</Import.FORM_TOP_DIV_LABEL>
                                        <Import.FORM_TOP_DIV_INPUT type="file" id="myfile" name="file_input" onChange={(e) =>
                                        {
                                            this.convertImportedData(e.currentTarget.files);
                                        }}/>
                                    </Import.FORM_TOP_DIV>
                                    <Import.FORM_BOTTOM_DIV>
                                        <Import.FORM_BOTTOM_DIV_INPUT type="button" id="myfile2" onClick={this.convertImportedData}/>
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
