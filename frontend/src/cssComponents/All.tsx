import { Component } from "react";
import sty from "styled-components";

/**
	CSS Used With Most FrontEnd Components
**/
class All extends Component
{
	public static readonly HTML = sty.html ` 
		background-color: rgb(170,170,170);
		font: normal 10px Arial, sans-serif;
	`;

	public static readonly HTML_BODY = sty.body ` 
		margin: 0% 5% 0% 5%;
	`;
}
export { All };
