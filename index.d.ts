/**
 * @name item
 * @summary Creates client instance using user credentials. It is recommended to store the credentials on the ENV
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} clientSecret - client secret
 * @param {string} clientID - clientID
 * @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 */
declare class item {
    email: string;
    password: string;
    clientSecret: string;
    clientID: string;
    token: string | null;
    constructor(email: string, password: string, clientSecret: string, clientID: string);
    /**
     * @name init
     * @description verifies the created instance from the constructor
     * @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 * client.init()
     */
    init(): Promise<boolean>;
    /**
     * @name upsertUser
     * @summary Schema 1 of using QR&OTP.
     * @description returns an object containing a QRCode in the form base64 string that can be rendered to an image containing the
     raw otp when decoded. The raw otp is also in the object as a string if you just need an otp. Requires init()
     * @param {string} id - a unique ID which will be used later as reference when verifying the OTP
     * @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 * client.init().then(()=>{
 * client.upsertUser('dummyUser')
 * })
     */
    upsertUser(id: string): Promise<any>;
    /**
     * @name createOTPGenerator
     * @summary Schema 2 of QR&OTP: generation of OTP generator
     * @description returns an object containing a QRCode in the form base64 string that can be rendered to an image containing the
     link for the OTP generator valid until expiry. The link is also in the object as a string.Requires init()
     * @param {string} id - a unique ID which will be used later as reference when verifying the OTP
     * @param {number} expiry - Duration that the generator is valid in seconds. It is recommended to use large time periods on production e.g 24 hours to 1 week
     * @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 * client.init().then(()=>{
 * client.createOTPGenerator('dummyUser', 86400)
 * })
     */
    createOTPGenerator(id: string, expiry: number): Promise<any>;
    /**
     * @name allowGenerateOTP
     * @summary Schema 2 of QR&OTP: Allows generation of OTP in a previously created Generator(associated with id) that is not expired
     * @description Requires init() and createOTPGenerator
     * @param {string} id - a unique ID which was used to create a generator earlier
     * @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 * client.init().then(()=>{
 * client.allowGenerateOTP('dummyUser')
 * })
     */
    allowGenerateOTP(id: string): Promise<any>;
    /**
     * @name verifyOTP
     * @summary Validation of OTP
     * @description Can be used with the OTP from either of the 2 schemas. Requires init() and an OTP string.
     * @param {string} id - a unique ID which was used to create a generator earlier
     * @param {string} otp - OTP string from the user
     @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 * client.init().then(()=>{
 * client.verifyOTP('dummyUser', 'OTPString')
 * })
     */
    verifyOTP(id: string, otp: string): Promise<any>;
    /**
     * @name checkUserStatus
     * @summary Check current instance of a user using its unique ID
     * @param {string} id - a unique ID
     * @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 * client.init().then(()=>{
 * client.checkUserstatus('dummyUser')
 * })
     */
    checkUserStatus(id: string): Promise<any>;
}
export default item;
