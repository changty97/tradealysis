import { Component } from "react";
import sty from "styled-components";

/**
	Privacy CSS
**/
class Privacy extends Component
{
	public static readonly SECTION = sty.section `
		box-shadow: 1px 1px 5px #aaaaaa;
		background-color: #f3f3f3;
		display: flex;
		flex-direction: column;
		justify-content: flex-start; 
		align-items: left;
		height: auto;
		width: auto;
		border-radius: 10px;
		font-size: 15px;
		padding-right: 80px;
        padding-left: 80px;
        padding-bottom: 80px;
	`;
	
	public static readonly LEFTHOME = sty.section `
		display: inline-flex;
		text-align: center;
		flex-direction: column;
		background-color: white;
		font-size: 1em; 
		text-decoration: none;
		color: Black;
		margin: 4%; 
		padding: 1%;
		height: 6vh;
		width: 95%;
		border-radius: 10px;
	`;
}
export { Privacy };
 
