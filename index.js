const axios = require('axios')
const QRCode = require('qrcode')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// error throwers
const checkToken = async (payload) =>{
    if (!payload.token) return new Error('Object instance is not validated. Please run init() first.')
    const validToken = await axios.post('https://paperstack-drab.vercel.app/api/package/tokenvalidation',{
        "email": payload.email,
        "token": payload.token,
    }).catch((err)=>{
        console.log(err.data || err)
    })
    if (validToken.data.valid == false) return new Error('Invalid token. rerun init() to replace with a valid token')
    else {
        return true
    }
}

const arrCheck = (arrToCheck) =>{
    for (let i = 0 ;i < arrToCheck.length; i++){
        if (typeof arrToCheck[i] == 'string' && arrToCheck[i].trim() == '') throw new Error('Insufficient or empty arguements')
        if (!arrToCheck[i]) throw new Error('Insufficient or empty credetials')
    }
}

// main class
class item{
    constructor(email, password, clientSecret, clientID){
        //new object creation
        const reqField = [email, password, clientSecret, clientID]
        arrCheck(reqField)
        this.email = email
        this.password = password
        this.clientSecret = clientSecret
        this.clientID = clientID
    }
    async init(){
        const reqField = [this.email, this.password, this.clientSecret, this.clientID]
        arrCheck(reqField)
        // fetch user verification
        const userverification = await axios.post('https://paperstack-drab.vercel.app/api/package/uservalidation', 
        {
            "email": this.email,
            "password": this.password,
            "clientS3cret": this.clientSecret,
            "clientID": this.clientID
        }
        ).catch((err)=>{
            console.log(err.data || err)
        })
        if (userverification.data.user == false) throw new Error('Invalid credentials')
        else {
            this.token = userverification.data.salt
            console.log('Instance validated')
            return true
        }
    }
    async upsertUser(id){
        const reqField = [this.email, this.password, this.clientSecret, this.clientID]
        arrCheck(reqField)
        if (!this.token || (typeof this.token =='string' && this.token.trim() == '')) throw new Error('Empty token. Run init() first')
        if (!id) throw new Error('id is required')
        if (typeof id !== 'string') throw new TypeError('"id" should be a "string"')
        if (await checkToken(this)){
            try {
                const res = await axios.post('https://paperstack-drab.vercel.app/api/package/upsertuser',{
                // const res = await axios.post('http://localhost:3000/api/package/upsertuser',{
                    "userId": id,
                    "clientInstance": this,
                }).catch((err)=>{
                    console.log(err.data || err)
                })
                if (res.data.status !== 'success') console.log(res.data.log)
                if (res.data.status == 'success') {
                    console.log('User upserted')
                    return res.data
                }
            } catch (error) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
    async createOTPGenerator (id, expiry) {
        if (!id || (typeof id == 'string' && id.trim() == '')) throw new Error('id" is required (type: String)')
        if (!expiry || (typeof expiry !== 'number')) throw new Error('Expiry" is required (type: number, qr duration of validity in seconds)')
        if (await checkToken(this)){
            try {
                const res = await axios.post('https://paperstack-drab.vercel.app/api/package/createotpgenerator',{
                // const res = await axios.post('http://localhost:3000/api/package/createotpgenerator',{
                    "userId": id,
                    "expiry": expiry,
                    "clientInstance": this,
                }).catch((err)=>{
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
            } catch (error) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
    async allowGenerateOTP (id){
        if (!id || (typeof id == 'string' && id.trim() == '')) throw new Error('id" is required (type: String)')
        if (await checkToken(this)){
            try {
                const res = await axios.post('https://paperstack-drab.vercel.app/api/package/allowgeneration',{
                // const res = await axios.post('http://localhost:3000/api/package/allowgeneration',{
                    "userId": id,
                    "clientInstance": this,
                }).catch((err)=>{
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
            } catch (error) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
    async verifyOTP (id, otp){
        if (!id || (typeof id == 'string' && id.trim() == '')) throw new Error('id" is required (type: String)')
        if (!otp || (typeof otp == 'string' && otp.trim() == '')) throw new Error('otp" is required (type: String)')
        if (await checkToken(this)){
            try {
                const res = await axios.post('https://paperstack-drab.vercel.app/api/package/otpverification',{
                // const res = await axios.post('http://localhost:3000/api/package/otpverification',{
                    "userId": id,
                    "otp": otp,
                    "clientInstance": this,
                }).catch((err)=>{
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
            } catch (error) {
                console.error(error.message)
                return error
            }
        } else return new Error('Invalid Token, run init()')
    }
}


module.exports = item