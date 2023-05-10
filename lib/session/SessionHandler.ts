import session from "express-session";
import { cookieDurationInHours } from "../utils/cookie.utils";
import { isSecureEnv } from "../utils/env.utils";
import { AuthorizerFunction, ILogger } from "../interfaces/interfaces";
import { NextFunction, Response, Request } from "express";
import { HttpCode } from "../models/HttpCode";
/**
 * Session handler.
 * @class
 * @public
 * @static
 * @name SessionHandler
 * @description
 * This class is used to handle the session.
 * It is used to validate the session and to create the session.
 * Remember to call the registerAuthorizers method to register the authorizers.
 * Use SessionHandler.create() to create the session.
 * Use SessionHandler.validateSession to validate the session. Put this middleware before the routes you want to protect.
 */
export class SessionHandler {
	private static authorizers: AuthorizerFunction[] = [];
	private static _cookieDurationInHours: number = cookieDurationInHours(1);
	private static _logger: ILogger = console;

	public static create() {
		return session({
			name: "session_cookie",
			secret: process.env.SESSION_SECRET ?? "secret",
			resave: false,
			saveUninitialized: false,
			proxy: isSecureEnv(),
			cookie: {
				maxAge: this._cookieDurationInHours,
				httpOnly: true,
				secure: isSecureEnv(),
				sameSite: "strict",
				domain: process.env.COOKIE_DOMAIN ?? "localhost",
			},
		});
	}

	/**
	 * Validate the session.
	 * @param req
	 * @param res
	 * @param next
	 */
	public static async validateSession(req: Request, res: Response, next: NextFunction) {
		try {
			const { session } = req;

			if (!session) {
				SessionHandler.sendError(res, new Error("Session not found"));
				return;
			}

			// Run authorizers. If any of them returns false, the session is invalid.
			SessionHandler.authorizers.forEach((authorizer) => {
				const { valid, error } = authorizer(session);
				if (!valid) {
					SessionHandler.sendError(res, error ?? new Error("Session not valid"));
					return;
				}
			});

			return next();
		} catch (error: Error | any) {
			// Destroy the session.
			SessionHandler._logger.error("Error validating session");
			req.session?.destroy((e) => e && SessionHandler._logger.error("Error validating session"));
			return res.status(HttpCode.OK).json({ error: "Session not found" });
		}
	}

	private static sendError(res: Response, error: Error) {
		SessionHandler._logger.error(error.message);
		res.status(HttpCode.UNAUTHORIZED).json({ error: error.message });
	}

	/**
	 * Register the authorizers.
	 * An authorizer is a function that receives the session and returns a boolean.
	 * Perform the validation of the session according to your needs and business logic.
	 * @param authorizers The authorizers.
	 */
	public static registerAuthorizers(authorizers: AuthorizerFunction[]) {
		SessionHandler.authorizers = authorizers;
	}

	/**
	 * Set the cookie duration in hours.
	 * @param cookieDuration The duration in hours.
	 */
	public set cookieDuration(cookieDuration: number) {
		SessionHandler._cookieDurationInHours = cookieDurationInHours(cookieDuration);
	}

	/**
	 * Set a custom logger.
	 * @param logger
	 */
	public static setLogger(logger: ILogger) {
		// Check if the logger has the required methods.
		if (!logger.info || !logger.error) {
			throw new Error("Logger must have info and error methods");
		}
		SessionHandler._logger = logger;
	}
}
