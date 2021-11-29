var http = require('http');
const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

// instantiate an express app
const app = express();

 // create reusable transporter object using the default SMTP transport
 let trans = nodemailer.createTransport({
  host: "mail.ablazelabs.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "wendafrash@ablazelabs.com", // generated ethereal user
    pass: "wende@127ET", // generated ethereal password
  },
  debug: true,
  logger: true
});

// verify connection configuration
trans.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  app.post("/send", (req, res) => {
    //1.
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
      console.log(fields);
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString();
      });
  
      //2. You can configure the object however you want
      const mail = {
        from: '"Fred Foo 👻" <wendafrash@ablazelabs.com>', // sender address
        to: "wendebuzu@gmail.com, wendebuzu@hotmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      };

      //3.
      trans.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send("Something went wrong.");
        } else {
          res.status(200).send("Email successfully sent to recipient!");
        }
      });
    });
  });

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    switch (req.url) {
        case "/app/":
            res.writeHead(200);
            var message = 'It works!\n',
            version = 'NodeJS ' + process.versions.node + '\n',
            response = [message, version].join('\n');
            res.end(response);
            break;
        case "/app/send":
            //1.
            let form = new multiparty.Form();
            let data = {};
            form.parse(req, function (err, fields) {
                console.log(fields);
                Object.keys(fields).forEach(function (property) {
                    data[property] = fields[property].toString();
                });
  
              //2. You can configure the object however you want
              const mail = {
                from: '"Ablazelabs" <wendafrash@ablazelabs.com>', // sender address
                to: "wendebuzu@gmail.com",
                subject: data.subject,
                text: `${data.name} <${data.email}> \n${data.message}`,
                };

              //3.
              trans.sendMail(mail, (err, data) => {
                if (err) {
                  res.writeHead(500);
                  res.end("Something went wrong.");
                  console.log(err);
                  
                } else {
                  res.status(200).send("Email successfully sent to recipient!");
                }
              });
            });
            //res.end(response);
            break;
    }    
   
});


// server.listen();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});