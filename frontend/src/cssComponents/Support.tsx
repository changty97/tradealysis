import sty from "styled-components";
import { Component } from "react";

class Support extends Component
{
	public static readonly SECTION = sty.section `
		border-style: solid; 
		border-color: black; 
		border-width: thin;
		border-radius: 10px;
		background-color: rgb(200,200,200);
		display: flex;
		flex-direction: column;
		justify-content: flex-start; 
		align-items: center;
		height: 400px;
		width: 100%;
		font-size: 20px;
	`;
	
	public static readonly SECTION_DIV = sty.div `
		display: inline-flex;
		max-width: 100%;
		max-height: 80%;
		margin-left: 1%;
		margin-right: 5%;
	`;
	
	public static readonly HORZ_LIST = sty.ul `
		list-style-type: none;
		margin: 2% 2%% 2% 2%;
		padding: 0;
		color:purple;
		font-weight: bold; 
		font-size: 1.2em;
		margin-top: 20px; 
		width: 100%;
	`;
	
	public static readonly FORM = sty.form `
		font-size: 20px;
		font-family: Arial, sans-serif;
		max-width: 80%;
		min-width: 30vh;
		margin: 10px;
	`;
	
	public static readonly TEXTAREA = sty.textarea `
		width: 50vw;
		height: 200px;
		font-size: 20px;
	`;
}
export { Support };
