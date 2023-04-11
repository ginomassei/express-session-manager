import 'express-session';
import { Session } from 'express-session';

declare module 'express-session' {
	export interface SessionData {
		[key: string]: any;
	}
}

export type AuthorizerFunction = (session: Session) => Promise<boolean>;
export interface ILogger {
	info(message: string): void;
	error(message: string, error: Error): void;
}
