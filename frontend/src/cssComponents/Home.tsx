import { Component } from "react";
import sty from "styled-components";

/**
	HomeComponent CSS
**/
class Home extends Component
{
	public static readonly SECTION = sty.section `
		display: flex;
		flex-direction: row;
		justify-content: flex-start; 
		align-items: flex-start;
		height: 35vw;
		width: 100%;
		flex-shrink: 2;
		margin: auto;
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
	public static readonly RIGHT_HOME = sty.div `
		box-shadow: 1px 1px 5px #aaaaaa;
		background-color: #f3f3f3;
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		align-content: flex-start;
		width: 100%;
		margin: 0 5%;
		overflow: auto;
	`;
	public static readonly DATA_ICON_DIV = sty.div `
		display:flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		margin: 2.5%;
	`;

	public static readonly DATA_ICON_TEXT_DIV = sty.div `
		text-align: center;
		font-size: 2.2vh;
		text-decoration: none;
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
	public static readonly HEADER = sty.h1 `
		margin: 1% 5%;
	`;
}
export { Home };
