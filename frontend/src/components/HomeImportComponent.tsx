import { Component, Fragment } from "react";
import { Import } from "../cssComponents/Import";
import { AxiosResponse } from "axios";
import { IHomeImportComponentState } from "../models/IHomeImportComponentState";
import Dropzone from "react-dropzone";
import { api } from "../constants/globals";

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
        this.onDrop = this.onDrop.bind(this);
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
    
    importFile(): void
    {
        if (!this.state.selectedFile)
        {
            return;
        }

        const formData: FormData = new FormData();

        formData.append("sourceName", "TDAmeritrade");
        formData.append("file", this.state.selectedFile);

        api.post("parseCSV", {
            data: formData
        }).then((response: AxiosResponse<any>) =>
        {
            console.log(response.data);
            // TODO: Add verification of data step
            // TODO: After verifying data, upload data to database
        }).catch((err) =>
        {
            console.error(err);
        }).finally(() =>
        {
            // TODO: Redirect to home.
        });
    }

    onDrop(files: any): void
    {
        if (files.length > 0)
        {
            this.setState({
                selectedFile: files[0]
            });
        }
    }

    render(): JSX.Element
    {
        const {
            selectedFile
        } = this.state;
        return (
            <Fragment>
                <Dropzone onDrop={this.onDrop} multiple={false}>
                    {({
                        getRootProps, getInputProps
                    }) => (
                        <section>
                            <Import.IMPORT_DIV {...getRootProps({
                            })} onSubmit={e => e.preventDefault()}>
                                <input {...getInputProps()} onChange={this.handleFileSelection} />
                                {selectedFile && selectedFile.name ? (
                                    <Import.SELECT_FILE_DIV>
                                        {selectedFile && selectedFile.name}
                                    </Import.SELECT_FILE_DIV>
                                ) : (
                                    "Drag and drop file here, or click to select file"
                                )}
                            </Import.IMPORT_DIV>
                            <Import.FORM_BOTTOM_DIV>
                                <Import.FORM_BOTTOM_DIV_INPUT type="submit" id="myfile2" onClick={this.importFile}/>
                            </Import.FORM_BOTTOM_DIV>
                        </section>
                    )}
                </Dropzone>
            </Fragment>

        );
    }
}
export { HomeImportComponent };
