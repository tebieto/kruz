var mongoose = require('mongoose');
var config = require('../config');

// Create authenticated Authy and Twilio API clients
var authy = require('authy')(config.AUTHY_KEY);
var twilioClient = require('twilio')(config.TWILIO_API_SID, config.TWILIO_API_TOKEN);

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    phone_number: {type: String, required: true, unique: true},
    phone_verified: {type: Boolean, default: false},
    updated_date: { type: Date, default: Date.now },
    country_code: {
        type: String,
        required: true,
    },
    authyId: String,
});


// Send a verification token to the user (two step auth for login)
UserSchema.methods.sendAuthyToken = function(cb) {
    var self = this;

    twilioClient.verify.services(config.TWILIO_VERIFICATION_SERVICE)
             .verifications
             .create({to: self.country_code+''+self.phone_number, channel: 'sms'})
             .then(verification => cb.call(self, null))
             .catch(err=> cb.call(self, err))
};

// Test a 2FA token
UserSchema.methods.verifyAuthyToken = function(otp, cb) {
    var self = this;
    twilioClient.verify.services(config.TWILIO_VERIFICATION_SERVICE)
    .verificationChecks
    .create({to: self.country_code+''+self.phone_number, code: otp})
    .then(response => cb.call(self, null, response))
    .catch(err => cb.call(self, err, response))
};

// Send a text message via twilio to this user
UserSchema.methods.sendMessage = function(message, cb) {
    var self = this;
    cb.call(self, null)
};

UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
  
    return jwt.sign({
      phone_number: this.phone_number,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, config.APP_SECRET);
  }
  
  UserSchema.methods.toAuthJSON = function() {
    return {
      _id: this._id,
      phone_number: this.phone_number,
      token: this.generateJWT(),
    };
  };
  

module.exports = mongoose.model('User', UserSchema);