import session from 'express-session';

const cookieDurationInHours = (hours: number) => hours * 60 * 60 * 1000;

export const isSecureEnv = process.env.NODE_ENV === 'stage' || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'prod';

export const sessionMiddleware = session({
	name: 'session_cookie',
	secret: process.env.SESSION_SECRET ?? 'secret',
	resave: false,
	saveUninitialized: false,
	proxy: isSecureEnv,
	cookie: {
		maxAge: cookieDurationInHours(1),
		httpOnly: true,
		secure: isSecureEnv,
		sameSite: 'strict',
		domain: process.env.COOKIE_DOMAIN,
	},
});
