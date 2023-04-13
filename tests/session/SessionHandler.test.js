"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
var lib_1 = require("../../lib");
describe('SessionHandler', function () {
    var mockRequest;
    var mockResponse;
    var nextFunction = jest.fn();
    beforeEach(function () {
        mockRequest = {};
        mockResponse = {
            json: jest.fn().mockReturnThis()
        };
    });
    it('should return 401 if no session_cookie is present', function () {
        lib_1.SessionHandler.validateSession(mockRequest, mockResponse, nextFunction);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
});
