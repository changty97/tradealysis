import { Component } from "react";
//import { Link } from "react-router-dom";
import sty from "styled-components";

class Home extends Component
{
	public static readonly SECTION = sty.section `
		border-style: solid; 
		border-color: black; 
		border-width: thin;
		border-radius: 10px;
		background-color: rgb(200,200,200);
		display: flex;
		flex-direction: row;
		justify-content: flex-start; 
		align-items: flex-start;
		height: 35vw;
		width: 100%;
		flex-shrink: 2;
		margin-bottom: 100px;
	`;
	public static readonly LEFT_HOME = sty.div `
		display: flex-inline;
		flex-direction: column;
		background-color: rgb(50,50,50);
		font-size: 2.5em; 
		text-decoration: none;
		color: white;
		margin: 2%; 
		height: 85%; 
		width: 25%;
		border-radius: 10px;
	`;
	public static readonly LEFT_HOME_MAIN_LIST_DIV_NOWRAP = sty.div `
		display: flex-inline;
		flex-direction: row;
		justify-content: center; 
		align-items: center;
		white-space: nowrap;
	`;
	public static readonly LEFT_HOME_MAIN_LIST = sty.ul `
		margin: 5%;
	`;
	public static readonly LEFT_HOME_MAIN_LIST_PAGEON = sty.ul `
		background-color:rgb(0,0,150);
		font-size: 3.5vh;
		margin: 5%;
		padding: 10% 25% 10% 25%;
		display: flex;
		flex-direction: column;
		justify-content: center; align-items: center;
		list-style-type: none;
		border-radius: 10px;
	`;
	public static readonly IMPORT_BUTTON = sty.button `
		text-decoration: none;
		font-size: 1.2vw;
		background-color: #008CBA;
		border: none;
		color: white;
		padding: 15px 32px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 2px;
	`;
	public static readonly IMPORT_INPUT = sty.input `
		display: none; 
	`;
	public static readonly RIGHT_HOME = sty.div `
		background-color: white; 
		border-radius: 10px; 
		border-style: solid; 
		border-color: black;  
		border-width: thin;
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: flex-start;
		margin: 2%; 
		height: 85%;  
		width: 70%; 
	`;
	public static readonly DATA_ICON_DIV = sty.div `
		display:flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		margin: 2.5%;
	`;
	public static readonly DATA_ICON = sty.img `
		width: 8vw;
		height: auto; 
	`;
	public static readonly DATA_ICON_MAP = sty.map `
		padding: 10px;
	`;
	public static readonly A_LINK = sty.a `
		width: 50%;
	`;
}
export { Home };
