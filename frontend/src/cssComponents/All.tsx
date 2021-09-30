import { Component } from "react";
import sty from "styled-components";

class All extends Component
{
	public static readonly HTML = sty.html ` 
		background-color: rgb(170,170,170);                /** Set background of html **/
		font: normal 10px Arial, sans-serif;      			 /** Set font default **/
	`;

	public static readonly HTML_BODY = sty.body ` 
		margin: 0% 5% 0% 5%;                               /** Set body default margin **/
	`;
}
export { All };
