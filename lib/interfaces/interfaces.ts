import { Session } from 'express-session';

export type AuthorizerFunction = (session: Session) => Promise<boolean>;
export interface ILogger {
	info(message: string): void;
	error(message: string, error: Error): void;
}
