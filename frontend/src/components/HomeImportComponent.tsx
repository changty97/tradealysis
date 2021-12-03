import { Component, Fragment } from "react";
import { Import } from "../cssComponents/Import";
import { IHomeImportComponentState } from "../models/IHomeImportComponentState";
import Dropzone from "react-dropzone";
import { api } from "../constants/globals";
import { LoadingComponent } from "./LoadingComponent";
import { sources } from "../constants/globals";
import { v4 as uuid } from "uuid";

class HomeImportComponent extends Component<any, IHomeImportComponentState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            selectedSource: sources[0],
            selectedFile: null,
            loading: false
        };

        this.handleFileSelection = this.handleFileSelection.bind(this);
        this.handleSourceSelection = this.handleSourceSelection.bind(this);
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

    handleSourceSelection(event: React.ChangeEvent<HTMLSelectElement>): void {
        this.setState({
            selectedSource: event.target.value
        });
    }
    
    async importFile(): Promise<void>
    {
        if (!this.state.selectedFile)
        {
            return;
        }

        this.setState({
            loading: true
        });
        
        try
        {
            const formData: FormData = new FormData();
            const key: string = localStorage.getItem("Key") || "";
            
            formData.append("sourceName", this.state.selectedSource);
            formData.append("file", this.state.selectedFile);

            const parsedData = (await api.post("parseCSV", formData)).data;
            const newCollName: string = (await api.get("createNewSessionForUser", {
                params: {
                    key,
                    collectionName: this.state.selectedFile.name
                }
            })).data;

            await api.post("postTableDB", {
                data: {
                    key,
                    table: parsedData,
                    coll: newCollName
                }
            });

            localStorage.setItem("reportsId", newCollName);
        }
        catch (err)
        {
            console.error(err);
        }
        finally
        {
            this.setState({
                loading: false
            });
            window.location.href = "/report";
        }

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
                {this.state.loading ? <LoadingComponent/> : null}
                <Dropzone onDrop={this.onDrop} multiple={false}>
                    {({
                        getRootProps, getInputProps
                    }) => (
                        <section>
                            <br/>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontWeight: "bold", fontSize: "16px" }}>Type of file:</div>
                                <br/>
                                <Import.SELECT_DROPDOWN value={this.state.selectedSource} onChange={this.handleSourceSelection}>
                                    {sources.map((sourceName: string) => {
                                        return (
                                            <option key={uuid()} value={sourceName}>
                                                {sourceName}
                                            </option>
                                        );
                                    })}
                                </Import.SELECT_DROPDOWN>
                            </div>
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
