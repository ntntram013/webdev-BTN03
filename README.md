# Store & User Page 

---

Some notes that you should read:

- *`Users' password`*: for easy testing, all the users should have *the same password*. Password will be encrypted in database (you can't read it). I can tell you that all the user has the password of  **12345**. ( ͡~ ͜ʖ ͡°) shhhh ~ 

- *`Email activation link`*: by default, the activation link is 'http://localhost:5000/user/confirm/'. So that, before deploying on Heroku, please change it to 'https://team468-bookstore.herokuapp.com/user/confirm/' *(at line 88 in userController.js)*. One more thing, turn off Antivirus because it sucks.
