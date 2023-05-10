import { Session } from "express-session";

export type AuthorizerFunction = (session: Session) => AuthorizerResult;

export interface ILogger {
	info(message: string): void;
	error(message: string): void;
}

export type AuthorizerResult = {
	valid: boolean;
	error?: Error;
};
