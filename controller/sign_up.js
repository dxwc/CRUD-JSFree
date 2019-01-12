let router   = require('express').Router();
let passport = require('passport');

let op      = require('../model/operations');
let render  = require('./function/render.js');
let captcha = require('./function/captcha.js');
let safe    = require('./function/encode_safe.js');

router.get('/sign_up', (req, res) =>
{
    return render(req, res, 'sign_up', null, true);
});

router.post('/sign_up', (req, res) =>
{
    // Already logged in:
    if(req.isAuthenticated()) return render(req, res, 'sign_up');

    // Gather input
    let recieved = { };

    if(typeof(req.body.user_name) === 'string' && req.body.user_name.trim().length)
    {
        recieved.user_name = req.body.user_name.trim();
        recieved.user_name = safe(recieved.user_name);
    }
    if(typeof(req.body.password) === 'string' && req.body.password.length)
        recieved.password = req.body.password;

    // If invalid input:
    if(!recieved.hasOwnProperty('user_name') || !recieved.hasOwnProperty('password'))
    {
        recieved.info = `সবকিছু পূরণ করে আবার চেষ্টা করুন`;
        return render(req, res, 'sign_up', recieved, true, 401);
    }

    // Check captcha
    if(!captcha.captcha_is_valid(req))
    {
        recieved.info = `অক্ষরগুলি ঠিক হয়নি, আবার চেষ্টা করুন`;
        return render(req, res, 'sign_up', recieved, true, 409);
    }

    // Valid input

    // Get max of 30 character for username
    let temp = '';
    for(let i = 0; i < recieved.user_name.length; ++i)
    {
        if(i >= 30) break;
        else        temp += recieved.user_name[i];
    }
    recieved.user_name = temp;

    // save in db
    op.sign_up(recieved.user_name, recieved.password)
    .then((id) =>
    {
        // signed up

        req.body.user_name = recieved.user_name;

        // sign user in at the same time :
        passport.authenticate
        (
            'local',
            (err, user, info) =>
            {
                if(err || !user)
                {
                    if(err) console.error(err);

                    return render
                    (
                        req,
                        res,
                        'error',
                        {
                            info : `নিবন্ধন করা হয়েছে কিন্তু নিবন্ধন প্রবেশের কোনো সমস্যা হয়েছে। ` +
                                   `প্রবেশ লিংক এ যেয়ে নিজে ঢোকার চেষ্টা করতে পারেন`
                        },
                        true
                    );
                }
                else
                {
                    req.logIn(user, (err) =>
                    {
                        if(err)
                        {
                            console.error(err);

                            return render
                            (
                                req,
                                res,
                                'error',
                                {
                                    info :
                                    `নিবন্ধন করা হয়েছে কিন্তু নিবন্ধন প্রবেশের কোনো সমস্যা হয়েছে। ` +
                                    `প্রবেশ লিংক এ যেয়ে নিজে ঢোকার চেষ্টা করতে পারেন`
                                },
                                true
                            );
                        }
                        else
                        {
                            delete req.session.captcha_solution;
                            req.session.save((err) =>
                            {
                                if(err) console.error(err);
                                return res.redirect
                                (req.session.previous ? req.session.previous : '/');
                            });
                        }
                    });
                }
            }
        )(req, res);
    })
    .catch((err) =>
    {
        if(err.code === 'USER_EXISTS')
        {
            recieved.info = `ওই নামে অন্য একজনের নিবন্ধন তৈরী আছে। ` +
            `অনুগ্রহ করে নাম বদলিয়ে আবার চেষ্টা করুন`;
            return render(req, res, 'sign_up', recieved, true);
        }
        else
        {
            recieved.info =
            `দুঃখিত, কোথাও কোনো গরমিল হয়েছে। ` +
            `আবার চেষ্টা করে দেখতে পারেন অথবা নিচে যোগাযোগ লিংক এ চাপ দিয়ে ` +
            `পরিচালকদের জানাতে পারেন`;
            return render(req, res, 'sign_up', recieved, true, 500);
        }
    });
});

module.exports = router;