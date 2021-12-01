import { Component, Fragment } from "react";
//import { Support } from "../cssComponents/Support";
import * as emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
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
                <>
                    <h1 className="p-heading1">Get in Touch</h1>
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <FormGroup controlId="formBasicEmail">
                            <Label className="text-muted">Email address</Label>
                            <Input
                                type="email"
                                name="email"
                                value={this.state.email}
                                className="text-primary"
                                onChange={this.handleChange.bind(this, 'email')}
                                placeholder="Enter email"
                            />
                        </FormGroup>
                        <FormGroup controlId="formBasicName">
                            <Label className="text-muted">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={this.state.name}
                                className="text-primary"
                                onChange={this.handleChange.bind(this, 'name')}
                                placeholder="Name"
                            />
                        </FormGroup>
                        <FormGroup controlId="formBasicSubject">
                            <Label className="text-muted">Subject</Label>
                            <Input
                                type="text"
                                name="subject"
                                className="text-primary"
                                value={this.state.subject}
                                onChange={this.handleChange.bind(this, 'subject')}
                                placeholder="Subject"
                            />
                        </FormGroup>
                        <FormGroup controlId="formBasicMessage">
                            <Label className="text-muted">Message</Label>
                            <Input
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
                    </Form>
                </>
            </Fragment>
        );
    }
}

export { SupportComponent };
