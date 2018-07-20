import React, { Component } from 'react';
import { css } from 'emotion';
import { LanguageContext } from './LanguageContext';
import { color } from './Theme';
import base from '../base';

const main = css({
	display: 'flex',
	flexDirection: 'column',

	'.contact-input': {
		display: 'flex',
		flexDirection: 'column',
	},

	'.input-error': {
		borderColor: 'red',
	},

	'input, textarea, button': {
		height: '3em',
		margin: '0.5em 0',
		borderRadius: '0.5em',
		border: '1px solid',
		padding: '0.4em'
	},

	textarea: {
		height: '8em',
	},

	button: {
		color: color,
		background: '#202d44',
		fontSize: '1em',
		height: '2.5em',
		border: `1px solid ${color}`,
	},

	'button:hover': {
		background: '#394a5a',
	},

	'@media all and (min-width: 1280px)': {
		button: {
			width: '20em',
			margin: 'auto',
			height: '2.2em',
			marginTop: '1em'
		}
	}
});

class Contact extends Component {
	constructor() {
		super();
		this.contactRef = React.createRef();

		this.state = {
			name: '',
			subject: '',
			email: '',
			message: '',
			errors: {}
		}
	}

	validate = () => {
		const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		const errors = {
			email: !regex.test(this.state.email),
			name: this.state.name === "",
			message: this.state.message === ""
		};
		this.setState({ errors });
		const isDisabled = Object.keys(errors).some(x => errors[x]);
		return !isDisabled;
	}

	handleEmailChange = (e) => {
		this.setState({ email: e.target.value }, () => this.validate());
	}

	handleNameChange = (e) => {
		this.setState({ name: e.target.value }, () => this.validate());
	}

	handleMessageChange = (e) => {
		this.setState({ message: e.target.value }, () => this.validate());
	}

	isFormValid = () => {
		const errors = this.validate(this.state.name, this.state.email, this.state.message);
		const isDisabled = Object.keys(errors).some(x => errors[x]);
		return !isDisabled;
	}

	handleSubmit = e => {
		e.preventDefault();

		if (!this.validate())
			return;

		base.push('messages', {
			data: {
				name: this.state.name,
				subject: this.state.subject,
				email: this.state.email,
				message: this.state.message,
				date: new Date().toString()
			}
		}).then(r => {
			console.log('Message sent!');
			let { name, subject, email, message } = this.state;
			name = subject = email = message = '';
			this.setState({ name, subject, email, message });

		})
			.catch(e => {
				console.log(`Error sending message ${e}`);
			});
	}

	render() {
		return (
			<LanguageContext.Consumer>
				{({ langText }) => (
					<section id="contact" className={main}>
						<p>{langText.contact.content}</p>
						<form className="contact-input" onSubmit={this.handleSubmit.bind(this)}>
							<input
								type="text"
								name="name"
								placeholder="Name (required)"
								autoComplete="name"
								onChange={this.handleNameChange}
								value={this.state.name}
								className={this.state.errors.name ? "input-error" : ""} />
							<input type="text"
								name="subject"
								placeholder="Subject"
								value={this.state.subject}
								ref={this.subjectRef} />
							<input type="email"
								name="email"
								placeholder="Email (required)"
								autoComplete="email"
								onChange={this.handleEmailChange}
								value={this.state.email}
								className={this.state.errors.email ? "input-error" : ""} />
							<textarea
								rows="5"
								placeholder="Message (required)"
								onChange={this.handleMessageChange}
								value={this.state.message}
								className={this.state.errors.message ? "input-error" : ""}>
							</textarea>
							<button type="submit">Submit</button>
						</form>
					</section>
				)}
			</LanguageContext.Consumer>
		)
	}
}

export default Contact;