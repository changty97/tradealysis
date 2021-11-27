import { Component, Fragment } from "react";
import { Import } from "../cssComponents/Import";
import { IHomeImportComponentState } from "../models/IHomeImportComponentState";
import Dropzone from "react-dropzone";
import { api } from "../constants/globals";
import { LoadingComponent } from "./LoadingComponent";

class HomeImportComponent extends Component<any, IHomeImportComponentState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            selectedFile: null,
            loading: false
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
    
    async importFile(): Promise<void>
    {
        if (!this.state.selectedFile)
        {
            return;
        }

        this.setState({ loading: true });
        
        try
        {
            const formData: FormData = new FormData();
            const key: string = localStorage.getItem("Key") || "";
            
            formData.append("sourceName", "TDAmeritrade");
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
        finally {
            this.setState({ loading: false });
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
