require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// var md5 = require('md5');
const bcrypt = require('bcrypt');

var User = require('../models/user.model');

module.exports = {
  login: function(req, res) {
    res.render('auth/login');
  },
  postLogin: async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    try {
      var user = await User.findOne({email: email});
      if(!user) {
        res.render('auth/login', {
          errors: [
            'User does not exist.'
          ],
          values: req.body
        });
        return;
      };
      if (!user.wrongLoginCount) {
        await User.findByIdAndUpdate(user.id, {
          wrongLoginCount: 0
        });
      }
      if(user.wrongLoginCount >= 3) {
        const msg = {
          to: user.email,
          from: 'vanmiu170797@gmail.com',
          subject: 'Login Library',
          text: 'you have exeeded the maximum number of login attempts. Your account is locked now.',
          html: '<strong>You have exeeded the maximum number of login attempts. Your account is locked now.</strong>',
        };
        sgMail.send(msg);

        res.render('auth/login', {
          errors: [
            'You have exceeded the maximum number of login attempts.'
          ]
        });
        return;
      }
      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        user.wrongLoginCount++;
        res.render('auth/login', {
          errors: [
            'Wrong password.'
          ],
          values: req.body
        });
        return;
      }
      await User.findOneAndUpdate({email: email}, {wrongLoginCount: 0});
      res.cookie('userId', user._id, {signed: true});
    } catch(err) {
      console.log(err);
    }
    res.redirect('/');
  }
}