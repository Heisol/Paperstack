### Developer's Note
This package is for generating OTP with the provider handling the validity and storage of the OTP. This is developed as for a study with the use of QR code with OTPs for improved security. For any questions and suggestions feel free to send an email to [alidejandoandrada@gmail.com]().

---

# Getting Started

### Installation of the Package 
```
npm install paperstack
```
or
```
yarn add paperstack
```
### CDN
```
Not yet implemented
```

---

## Usage
```
const paperstack = require('paperstack')
#or
import paperstack from 'paperstack' //Using ES6
```

### Initialization
An account is needed to be able to use this package (Don't worry, this package is free and no costs are expected down the line). Avoid storing your credentials directly in variable. We recommend storing them in the ENV and access them through process.ENV.variable_name. Sign up [here](https://paperstack-drab.vercel.app/).
Create a separate file to for the package initialization and call init().
```
const paperstack = require('paperstack')

const client = new paperstack(email, password, clientSecret, clientID)
client.init()
.then(()=>{})//Use paperstack methods here
.catch(err=>console.log(err))
```

---

### Schema 1
A simple OTP schema with the OTP in QR option. 
**Generates raw OTP which can be accessed in the object.**
| Parameter | Type | Required | Default Value | Description |
| ----------- | ----------- | ----------- | ----------- | ----------- |
|uniqueId|string|true||A unique ID which will be used later as reference for verification of OTP|

This will return an object containing the OTP and a base64 string that can be rendered to an image which contains the raw OTP.
**OTP verification**

| Parameter | Type | Required | Default Value | Description
| ----------- | ----------- | ----------- | ----------- | ----------- |
|id|string|true||A unique ID for a valid generator|
|OTP|string|true||OTP user input|

OTP verification. Returns a bool. This can be used with either of the 2 schemas

```
client.verifyOTP(id, otp)
```
```
const QR = client.upsertUser(uniqueID)
```

---
### Schema 2 
OTP schema where the user can generate OTP for himself/herself when logging in.

**Create OTP Generator**
Generator is valid for a limited amount of time generation can only be allowed by the developer(Ideally called upon login attempt).

| Parameter | Type | Required | Default Value | Description
| ----------- | ----------- | ----------- | ----------- | ----------- |
|id|string|true| |A unique ID which will be used later as reference for verification of OTP|
|expiry|numbe|true| |Duration of the OTP generator validity in seconds(Roughly 86400 seconds a day).|

Creates an OTP generator. Returns a link that is valid within the Expiry's duration. It is advised for the user to save the QR code instead of the link.

```
client.createOTPGenerator(id, expiry)
```

**Allow OTP generation of valid generator**

| Parameter | Type | Required | Default Value | Description
| ----------- | ----------- | ----------- | ----------- | ----------- |
|id|string|true| |A unique ID for a valid generator|

Allows the valid generator to generate OTPs using the generator link. Valid for only 5 minutes

```
client.allowGenerateOTP(id)
```

---



**Check user status using ID**

| Parameter | Type | Required | Default Value | Description
| ----------- | ----------- | ----------- | ----------- | ----------- |
|id|string|true||A unique ID used earlier to generate and OTP or create a Generator|

Returns an object contaning the current status and details linked to an ID.

```
client.checkUserStatus(id)
```

---

Read more about the documentation at [Paperstack documentation](https://paperstack-drab.vercel.app/app/documentation)