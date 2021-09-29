import { Component } from "react";
import sty from "styled-components";

class About extends Component
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
		height: 100%;
		width: 100%;
	`;
	
	public static readonly LEFTHOME = sty.div `
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: white;
		font-size: 250%; 
		text-decoration: none;
		color: black;
		margin: 2%; 
		height: 450px; 
		width: 40%;
		border-radius: 10px;
	`;
	
	public static readonly LEFTHOME_H1 = sty.h1 `
		font-size: 1.3em;
		margin-left: 1%;
		margin-right: 1%;
	`;
	
	public static readonly LEFTHOME_DIV_IMG = sty.img `
		margin-left: 1%;
		margin-right: 2%;
		margin-top: 3%;
		margin-bottom: 10%;
		max-width: 95%;
		min-width: 30vh;
		max-height:45vh;
		min-height: 60%;
	`;
	
	public static readonly ABOUT_RIGHT_HOME = sty.div `
		display: flex;
		text-align: left;
		flex-direction: column;
		justify-content: flex-start;  
		background-color: white;
		border-radius: 10px;
		margin: 2%;
		margin-left: 0;
		padding-left: 50px;
		font-size:20px;
		height: 450px;  
		width: 70%; 
	`;
}
export { About };
 
