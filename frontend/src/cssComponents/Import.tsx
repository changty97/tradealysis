import { Component } from "react";
//import { Link } from "react-router-dom";
import sty from "styled-components";

class Import extends Component
{
	
	public static readonly FORM = sty.form `
		background-color:wheat; 
		border-style: solid;
		border-color: rgb(97,97,97); 
		border-font: 1px; 
		border-radius: 5px; 
		font-family: Arial, sans-serif;
		padding: 7%;
		position:relative; left:3vw; top: 10%;
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
		max-width: 75%; max-height: 11vh;
		min-width: 46vw; min-height: 8vh;
	`;
	
	public static readonly FORM_TOP_DIV = sty.div `
		font-size: 160%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
		flex-wrap: wrap;	
	`;
	
	public static readonly FORM_TOP_DIV_LABEL = sty.label `
		display: inline-flex;
		margin-right: 3%;	
	`;
	
	public static readonly FORM_TOP_DIV_INPUT = sty.input `
		display: inline-flex;
	`;
	
	public static readonly FORM_BOTTOM_DIV = sty.div `
		font-size: 160%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: center;
		margin-top: 2%;
	`;
	
	public static readonly FORM_BOTTOM_DIV_INPUT = sty.input `
		display: inline-flex;
	`;
	
	
	
}
export { Import };
