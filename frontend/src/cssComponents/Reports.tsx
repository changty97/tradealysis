import sty from "styled-components";
import { Component } from "react";

class Reports extends Component
{
	public static readonly SECTION = sty.section `
		border-style: solid; border-color: black;  border-width: thin; border-radius: 10px; background-color: rgb(200,200,200);
		
		height: 70vh;
		width: 100%;
		overflow: auto;
		margin: 20px;
	`;
	
}
export { Reports };
 
