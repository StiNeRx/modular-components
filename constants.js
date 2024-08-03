
//  Email tokens and constants

const API_TOKEN = 'f135c11110fdb26fecd31a69c6c7c632';
const SENDER_EMAIL = "mailtrap@demomailtrap.com";
const RECIPENT_EMAIL = "stinerzx@gmail.com";
const ENDPOINT_URL = "https://send.api.mailtrap.io/";
const SENDER_NAME = 'testing mailtrap email service';
const ATTACHMENT_PATH = './testFile.xlsx'
const ATTACHMENT_NAME = 'testFiles.xlsx';
const SUBJECT = 'test Functionality of email component with attachments';
const RECORDED_MESSAGE = 'this is the attached email that will only update the previous record in the excel file';


//  Excel constants

const HEADER_CELLS = [
    {key : 'name', header : 'name' },
    {key :'email', header : 'email'},
    {key : 'message', header : 'message'},
    {key : 'website', header : 'website'}
    ];

const ROW_VALUES = {
    name  :   'tanmay',
    email :   'tanmay@tanmay.com',
    message :   'tanmay is tanmay',
    website :   'tanmay.com'
   };

const SHEET = 'Test Sheet';

// STATUS RESPONSES

const STATUS_SUCCESS = 200;
const STATUS_INTERNAL_SERVER_ERROR = 500;
const STATUS_NOT_FOUND = 404;
const STATUS_FORBIDDEN = 403;


//  other constant


exports.API_TOKEN = API_TOKEN;
exports.SENDER_EMAIL = SENDER_EMAIL;
exports.RECIPENT_EMAIL = RECIPENT_EMAIL;
exports.ENDPOINT_URL = ENDPOINT_URL;
exports.SENDER_NAME = SENDER_NAME;
exports.ATTACHMENT_PATH = ATTACHMENT_PATH;
exports.ATTACHMENT_NAME = ATTACHMENT_NAME;
exports.SUBJECT = SUBJECT; 
exports.RECORDED_MESSAGE = RECORDED_MESSAGE;
exports.SHEET = SHEET; 
exports.ROW_VALUES = ROW_VALUES; 
exports.HEADER_CELLS = HEADER_CELLS;
exports.STATUS_SUCCESS = STATUS_SUCCESS;
exports.STATUS_INTERNAL_SERVER_ERROR = STATUS_INTERNAL_SERVER_ERROR;
exports.STATUS_NOT_FOUND = STATUS_NOT_FOUND;
exports.STATUS_FORBIDDEN = STATUS_FORBIDDEN;
