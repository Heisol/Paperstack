import axios from 'axios'

interface itemType {
    email:string
    password:string
    clientSecret:string
    clientID:string
    token:string|null
}

// error throwers
const checkToken = async (payload:itemType) =>{
    if (!payload.token) return new Error('Object instance is not validated. Please run init() first.')
    const validToken:any = await axios.post('https://paperstack-drab.vercel.app/api/package/tokenvalidation',{
        "email": payload.email,
        "token": payload.token,
    }).catch((err:any)=>{
        console.log(err.data || err)
    })
    if (validToken.data.valid == false) return new Error('Invalid token. rerun init() to replace with a valid token')
    else {
        return true
    }
}

const arrCheck = (arrToCheck:any) =>{
    for (let i = 0 ;i < arrToCheck.length; i++){
        if (typeof arrToCheck[i] == 'string' && arrToCheck[i].trim() == '') throw new Error('Insufficient or empty arguements')
        if (!arrToCheck[i]) throw new Error('Insufficient or empty credetials')
    }
}

// main class
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
class item{
    email:string
    password:string
    clientSecret:string
    clientID:string
    token:string|null
    constructor(email:string, password:string, clientSecret:string, clientID:string){
        //new object creation
        const reqField = [email, password, clientSecret, clientID]
        arrCheck(reqField)
        this.email = email
        this.password = password
        this.clientSecret = clientSecret
        this.clientID = clientID,
        this.token = null
    }
    /**
     * @name init
     * @description verifies the created instance from the constructor
     * @example const paperstack = require('paperstack')
 * const client = new paperstack(process.env.paperstack_EMAIL, process.env.paperstack_PASSWORD, process.env.paperstack_SECRET, process.env.paperstack_ID)
 * client.init()
     */
    async init(){
        const reqField = [this.email, this.password, this.clientSecret, this.clientID]
        arrCheck(reqField)
        // fetch user verification
        const userverification:any = await axios.post('https://paperstack-drab.vercel.app/api/package/uservalidation', 
        {
            "email": this.email,
            "password": this.password,
            "clientS3cret": this.clientSecret,
            "clientID": this.clientID
        }
        ).catch((err:any)=>{
            console.log(err.data || err)
        })
        if (userverification.data.user == false) throw new Error('Invalid credentials')
        else {
            this.token = userverification.data.salt
            console.log('Instance validated')
            return true
        }
    }
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
    //
    async upsertUser(id:string){
        const reqField = [this.email, this.password, this.clientSecret, this.clientID]
        arrCheck(reqField)
        if (!this.token || (typeof this.token =='string' && this.token.trim() == '')) throw new Error('Empty token. Run init() first')
        if (!id) throw new Error('id is required')
        if (typeof id !== 'string') throw new TypeError('"id" should be a "string"')
        if (await checkToken(this)){
            try {
                const res:any = await axios.post('https://paperstack-drab.vercel.app/api/package/upsertuser',{
                // const res = await axios.post('http://localhost:3000/api/package/upsertuser',{
                    "userId": id,
                    "clientInstance": this,
                }).catch((err:any)=>{
                    console.log(err.data || err)
                })
                if (res.data.status !== 'success') console.log(res.data.log)
                if (res.data.status == 'success') {
                    console.log('User upserted')
                    return res.data
                }
            } catch (error:any) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
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
    //
    async createOTPGenerator (id:string, expiry:number) {
        if (!id || (typeof id == 'string' && id.trim() == '')) throw new Error('id" is required (type: String)')
        if (!expiry || (typeof expiry !== 'number')) throw new Error('Expiry" is required (type: number, qr duration of validity in seconds)')
        if (await checkToken(this)){
            try {
                const res:any = await axios.post('https://paperstack-drab.vercel.app/api/package/createotpgenerator',{
                // const res = await axios.post('http://localhost:3000/api/package/createotpgenerator',{
                    "userId": id,
                    "expiry": expiry,
                    "clientInstance": this,
                }).catch((err:any)=>{
                    console.log(err.data || err)
                })
                if (res.data.status !== 'success') {
                    console.log(res.data.log)
                    return false
                }
                if (res.data.status == 'success') {
                    console.log(res.data.log)
                    return res.data
                }
            } catch (error:any) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
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
    //
    async allowGenerateOTP (id:string){
        if (!id || (typeof id == 'string' && id.trim() == '')) throw new Error('id" is required (type: String)')
        if (await checkToken(this)){
            try {
                const res:any = await axios.post('https://paperstack-drab.vercel.app/api/package/allowgeneration',{
                // const res = await axios.post('http://localhost:3000/api/package/allowgeneration',{
                    "userId": id,
                    "clientInstance": this,
                }).catch((err:any)=>{
                    console.log(err.data || err)
                })
                if (res.data.status !== 'success') {
                    console.log(res.data.log)
                    return false
                }
                if (res.data.status == 'success') {
                    console.log('OTP generation allowed for 5 minutes')
                    return res.data
                }
            } catch (error:any) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
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
    //
    async verifyOTP (id:string, otp:string){
        if (!id || (typeof id == 'string' && id.trim() == '')) throw new Error('id" is required (type: String)')
        if (!otp || (typeof otp == 'string' && otp.trim() == '')) throw new Error('otp" is required (type: String)')
        if (await checkToken(this)){
            try {
                const res:any = await axios.post('https://paperstack-drab.vercel.app/api/package/otpverification',{
                // const res = await axios.post('http://localhost:3000/api/package/otpverification',{
                    "userId": id,
                    "otp": otp,
                    "clientInstance": this,
                }).catch((err:any)=>{
                    console.log(err.data || err)
                })
                if (res.data.status !== 'success') {
                    console.log(res.data.log)
                    return false
                }
                if (res.data.status == 'success') {
                    console.log(res.data.log)
                    return true
                }
            } catch (error:any) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
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
    //
    async checkUserStatus (id:string){
        if (!id || (typeof id == 'string' && id.trim() == '')) throw new Error('id" is required (type: String)')
        if (await checkToken(this)){
            try {
                const res:any = await axios.post('https://paperstack-drab.vercel.app/api/package/userstatus',{
                // const res = await axios.post('http://localhost:3000/api/package/userstatus',{
                    "userId": id,
                    "clientInstance": this,
                }).catch((err:any)=>{
                    console.log(err.data || err)
                })
                if (res.data.status !== 'success') {
                    console.log(res.data.log)
                    return false
                }
                else if (res.data.status == 'success') {
                    return res.data
                }
            } catch (error:any) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
}

export default item
