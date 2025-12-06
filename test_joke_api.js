const { sendResponse } = require('./utils/response');
const handler = require('./api/v1/joke').default;

const mockResponse = () => {
    const res = {};
    res.statusCode = 200;
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.jsonCalledWith = data;
        return res;
    };
    return res;
};

const testApi = async () => {
    const req = {}; // Mock request object
    const res = mockResponse();

    await handler(req, res);

    console.log('API Response:', res.jsonCalledWith);
};

testApi();