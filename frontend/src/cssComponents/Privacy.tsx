import { Component } from "react";
import sty from "styled-components";

class Privacy extends Component
{
	public static readonly SECTION = sty.section `
		border-style: solid; 
		border-color: black; 
		border-width: thin; 
		background-color: rgb(200,200,200);
		display: flex;
		flex-direction: column;
		justify-content: flex-start; 
		align-items: left;
		height: 35vw;
		width: 100%;
		border-radius: 10px;
		font-size: 20px;
	`;
	
	public static readonly LEFTHOME = sty.section `
		display: inline-flex;
		text-align: center;
		flex-direction: column;
		background-color: white;
		font-size: 1em; 
		text-decoration: none;
		color: Black;
		margin: 2%; 
		height: 75vh;
		width: 95%;
		border-radius: 10px;
	`;
	
	
}
export { Privacy };
 
