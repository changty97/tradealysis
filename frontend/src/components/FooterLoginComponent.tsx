import { Component, Fragment } from "react";
import { Footer } from "../cssComponents/Footer";

class FooterLoginComponent extends Component
{
    render(): JSX.Element
    {
        return (
            <Fragment>
                <Footer.FOOTER>
                    <div>
                        <Footer.FOOTER_DIV_UL>
                            <Footer.FOOTER_DIV_UL_LI><Footer.A_LINK href="/support">Support</Footer.A_LINK></Footer.FOOTER_DIV_UL_LI>
                            <Footer.FOOTER_DIV_UL_LI><Footer.A_LINK href="/about">About</Footer.A_LINK></Footer.FOOTER_DIV_UL_LI>
                            <Footer.FOOTER_DIV_UL_LI><Footer.A_LINK href="./privacy">Privacy Policy</Footer.A_LINK></Footer.FOOTER_DIV_UL_LI>
                        </Footer.FOOTER_DIV_UL>
                    </div>
                </Footer.FOOTER>
            </Fragment>
        );
    }
}
export { FooterLoginComponent };
