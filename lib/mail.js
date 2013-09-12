'use strict';

 /*                        ` '
  *                         * -
  *        _________________)`
  *       /`.{circulate},-'/
  *      /   `.    _,-'   /    A template-based
  *     /   ,-'`.-'.     /    bulk e-mail sending
  *    /_,-'        `.  /    solution.
  *   /'______________`/
  */

var text = require('./text');
var config = require('./config');
var transport = require('./connection');

var log = console.log;
var err = console.error;

exports.send = function(recipients, subjectTemplate, textTemplate, htmlTemplate,
            callback) {
    var connection = transport.getInstance(),
        recipient = recipients.pop(),
        mailOptions = text.formatMailOptions({
            from: config.Email.SENDER,
            to: recipient.email,
            subject: subjectTemplate,
            text: textTemplate,
            html: htmlTemplate
        });

    console.log('Sending mail to "' + recipient.email + '"...');

    // send mail with defined transport object
    connection.sendMail(mailOptions, function(error/*, response*/) {
        if (error) {
            err(
                'Failed to send message to "' +
                recipient.email +
                '". Will retry in 10 seconds...'
            );

            log(error);

            recipients.push(recipient);

            setTimeout(function() {
                callback();
            }, config.Timeout.SMTP_FAILURE_RETRY);

            callback();
        } else {
            log('Message sent to "' + recipient.email + '"');

            callback();
        }
    });
};