import { Component, Fragment } from "react";
import { Support } from "../cssComponents/Support";
import * as emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
import { Button, FormGroup } from 'reactstrap';
//import { ISupportProps } from "../models/ISupportProps";
//import { ISupportState } from "../models/ISupportState";
init("user_EXb9DCu4js07untJgFSES");

class SupportComponent extends Component
{
    state = {
        name: '',
        email: '',
        subject: '',
        message: '',
    }
    //this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);

    handleSubmit(e: any)
    {
        e.preventDefault();

        const {
            email, subject, message
        } = this.state;

        const templateParams = {
            from_name: email,
            to_name: 'Tradealysis',
            subject: subject,
            message: message,
        };

        emailjs.send(
            'service_2l7h6dd',
            'template_8oc48yn',
            templateParams,
            'user_EXb9DCu4js07untJgFSES'
        );
        
        this.resetForm();
    }

    resetForm()
    {
        this.setState({
            name: '',
            email: '',
            subject: '',
            message: '',
        });
    }

    handleChange = (param: any, e: any) =>
    {
        this.setState({
            [param]: e.target.value
        });
    }

    render(): JSX.Element
    {
        return (
            <Fragment>
                <Support.SECTION>
                    <>
                    <h1 className="p-heading1">Get in Touch</h1>
                    <Support.FORM onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup controlId="formBasicEmail">
                            <Support.LABEL className="text-muted">Email address</Support.LABEL>
                            <Support.INPUT
                                type="email"
                                name="email"
                                value={this.state.email}
                                className="text-primary"
                                onChange={this.handleChange.bind(this, 'email')}
                                placeholder="Enter email"
                            />
                        </FormGroup>
                        <FormGroup controlId="formBasicName">
                            <Support.LABEL className="text-muted">Name</Support.LABEL>
                            <Support.INPUT
                                type="text"
                                name="name"
                                value={this.state.name}
                                className="text-primary"
                                onChange={this.handleChange.bind(this, 'name')}
                                placeholder="Name"
                            />
                        </FormGroup>
                        <FormGroup controlId="formBasicSubject">
                            <Support.LABEL className="text-muted">Subject</Support.LABEL>
                            <Support.INPUT
                                type="text"
                                name="subject"
                                className="text-primary"
                                value={this.state.subject}
                                onChange={this.handleChange.bind(this, 'subject')}
                                placeholder="Subject"
                            />
                        </FormGroup>
                        <FormGroup controlId="formBasicMessage">
                            <Support.LABEL className="text-muted">Message</Support.LABEL>
                            <Support.INPUT_TWO
                                type="textarea"
                                name="message"
                                className="text-primary"
                                value={this.state.message}
                                onChange={this.handleChange.bind(this, 'message')}
                            />
                        </FormGroup>
                        <Button variant="primary" type="submit">
              Submit
                        </Button>
                    </Support.FORM>
                    </>
                    </Support.SECTION>
            </Fragment>
        );
    }
}

export { SupportComponent };
