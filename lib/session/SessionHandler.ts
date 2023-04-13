import session from 'express-session';
import { cookieDurationInHours } from '../utils/cookie.utils';
import { isSecureEnv } from '../utils/env.utils';
import { StatusCodes } from 'http-status-codes';
import { AuthorizerFunction, ILogger } from '../interfaces/interfaces';
import { NextFunction, Response, Request } from 'express';

export class SessionHandler {
	private static authorizers: AuthorizerFunction[] = [];
	private static _cookieDurationInHours: number = cookieDurationInHours(1);
	private static _logger: ILogger = console;

	public static create() {
		return session({
			name: 'session_cookie',
			secret: process.env.SESSION_SECRET ?? 'secret',
			resave: false,
			saveUninitialized: false,
			proxy: isSecureEnv(),
			cookie: {
				maxAge: this._cookieDurationInHours,
				httpOnly: true,
				secure: isSecureEnv(),
				sameSite: 'strict',
				domain: process.env.COOKIE_DOMAIN ?? 'localhost',
			},
		});
	}

	public static async validateSession(req: Request, res: Response, next: NextFunction) {
		try {
			const { session } = req;

			if (!session) {
				this.sendError(res, new Error('Session not found'));
				return;
			}

			// Run authorizers. If any of them returns false, the session is invalid.
			SessionHandler.authorizers.forEach((authorizer) => {
				if (!authorizer(session)) {
					throw new Error('Check authorizers');
				}
			});

			return next();
		} catch (error: Error | any) {
			// Destroy the session.
			// this._logger.error('Error validating session', error);
			req.session?.destroy((e) => e && this._logger.error('Error validating session', e));
			return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Session not found' });
		}
	}

	private static sendError(res: Response, error: Error) {
		// this._logger.error('Error', error);
		res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
	}

	public static registerAuthorizers(authorizers: AuthorizerFunction[]) {
		SessionHandler.authorizers = authorizers;
	}

	public set cookieDurationInHours(hours: number) {
		SessionHandler._cookieDurationInHours = cookieDurationInHours(hours);
	}

	public set logger(logger: ILogger) {
		// Check if the logger has the required methods.
		if (!logger.info || !logger.error) {
			throw new Error('Logger must have info and error methods');
		}
		SessionHandler._logger = logger;
	}
}
