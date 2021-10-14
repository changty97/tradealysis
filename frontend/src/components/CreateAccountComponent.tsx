import { Component, Fragment } from "react";

class CreateAccountComponent extends Component<any, any>
{
    render(): JSX.Element
    {
	    return (
	        <Fragment>
	            
	            <section>
	                <form>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username"/>
                        <br/>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password"/>
                        <br/>
                        <input type="submit" value="Submit"/>
						
                    </form>
	            </section>
				
	        </Fragment>
	    );
    }
}
export { CreateAccountComponent };
