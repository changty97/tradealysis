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

	public static readonly IMPORT_DIV = sty.div `
		text-align: center;
		font-size: x-large;
		padding: 30px;
		border: 3px dashed #eeeeee;
		background-color: #fafafa;
		color: #bdbdbd;
		cursor: pointer;
		margin: 5% 20%;
		height: 200px;
	`;

	public static readonly SELECT_FILE_DIV = sty.div `
		color: #000; 
		font-weight: bold;
	`;
	
	public static readonly FORM_TOP_DIV_LABEL = sty.label `
		display: inline-flex;
		margin-right: 3%;	
	`;
	
	public static readonly FORM_TOP_DIV_INPUT = sty.input `
		display: inline-block;
		text-decoration: none;
		font-size: 1.2vw;
		border: none;
		color: black;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 2px;
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
		display: inline-block;
		text-decoration: none;
		font-size: 1.2vw;
		background-color: #008CBA;
		border: none;
		color: black;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		font-size: 16px;
		margin: 4px auto 2px;
		cursor: pointer;
		border-radius: 2px;
		&:hover {
			background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0 0);
		}
	`;
	
}
export { Import };
