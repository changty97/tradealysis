import { Component, Fragment } from "react";
import { NavBarComponent } from "./NavBarComponent";
import { FooterComponent } from "./FooterComponent";

class HomeImportComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <NavBarComponent />
				
				<section>
					<div className="leftHome">				
						<div className="leftHomeMainListDiv noWrap">
							<ul className="leftHomeMainList">
								<li>Home</li>
							</ul>
							<ul className="leftHomeMainList">
								<button className="import-button">
									Import Broker Files
								</button>
							</ul>
						</div>
					</div>
					
					<div className="rightHome">
						<div className="formBlock">
							<form action="./home.html">
							  <label>Select broker's file to import: </label>
							  <input type="file" id="myfile" name="file_input"/><br/><br/>
							  <input type="submit" id="myfile2"/>
							</form>
						</div>
					</div>
					
				</section>
		
				
                <FooterComponent/>
            </Fragment>
        );
    }
}
export { HomeImportComponent };
