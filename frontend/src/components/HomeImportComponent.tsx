import React, { Component, Fragment } from "react";
// import { Home } from "../cssComponents/Home";
import { Import } from "../cssComponents/Import";
import axios, { AxiosResponse } from "axios";
import { IHomeImportComponentState } from "../models/IHomeImportComponentState";
import Dropzone from "react-dropzone";

class HomeImportComponent extends Component<any, IHomeImportComponentState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            selectedFile: null
        };

        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleBrowseClick = this.handleBrowseClick.bind(this);
        this.onDrop = this.onDrop.bind(this);
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

    handleBrowseClick(): void
    {
        const fileinput = document.getElementById("myfile");
        if (fileinput)
        {
            fileinput.click();
        }
    }

    onDrop(files: any): void {
        if (files.length > 0) {
          this.setState({ selectedFile: files });
        }
    }

    // upload(): void {
    //     let currentFile = this.state.selectedFile[0];
    
    //     this.setState({
    //       progress: 0,
    //       currentFile: currentFile,
    //     });
    
    //     this.importFile(currentFile)
    //       .then((response: { data: { message: any; }; }) => {
    //         this.setState({
    //           message: response.data.message,
    //         });
    //       })
    //       .then((files: { data: any; }) => {
    //         this.setState({
    //           fileInfos: files.data,
    //         });
    //       })
    //       .catch(() => {
    //         this.setState({
    //           progress: 0,
    //           message: "Could not upload the file!",
    //           currentFile: null,
    //         });
    //       });
    
    //     this.setState({
    //       selectedFile: null,
    //     });
    // }
    
    importFile(): any
    {
        console.log(this.state.selectedFile)
        if (!this.state.selectedFile)
        {
            return;
        }
        const formData: FormData = new FormData();

        formData.append("sourceName", "TDAmeritrade");
        formData.append("file", this.state.selectedFile);

        axios({
            method: "POST",
            url: "http://localhost:3001/parseCSV",
            data: formData
        }).then((response: AxiosResponse) =>
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

    render(): JSX.Element
    {
        const { selectedFile } = this.state;
        return (
            <Fragment>
                <Dropzone onDrop={this.onDrop} multiple={false}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <Import.DIV {...getRootProps({})}>
                                <input {...getInputProps()} />
                                {selectedFile && selectedFile[0].name ? (
                                <Import.SELECT_FILE_DIV>
                                    {selectedFile && selectedFile[0].name}
                                </Import.SELECT_FILE_DIV>
                                ) : (
                                "Drag and drop file here, or click to select file"
                                )}
                            </Import.DIV>
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
