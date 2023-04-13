import {NextFunction, Request, Response} from "express";
import {SessionHandler} from "../../lib";
import {Session, SessionData} from "express-session";

describe('SessionHandler', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: NextFunction = jest.fn();

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis()
		};
	});

	it('should return 401 Unauthorized if no session is present', () => {
		SessionHandler.validateSession(mockRequest as Request, mockResponse as Response, nextFunction);
		expect(mockResponse.json).toHaveBeenCalledWith({error: 'Session not found'});
		expect(mockResponse.status).toHaveBeenCalledWith(401);
	});

	it('should call the next function', () => {
		mockRequest.session = {} as Session & Partial<SessionData> & { id: string };

		SessionHandler.validateSession(mockRequest as Request, mockResponse as Response, nextFunction);
		expect(mockResponse.json).not.toHaveBeenCalled();
		expect(mockResponse.status).not.toHaveBeenCalledWith();
		expect(nextFunction).toHaveBeenCalled();
	});
});
