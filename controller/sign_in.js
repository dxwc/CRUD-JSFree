let router   = require('express').Router();
let passport = require('passport');

let render  = require('./function/render.js');
let captcha = require('./function/captcha.js');
let safe    = require('./function/encode_safe.js');

router.get('/sign_in', (req, res) =>
{
    return render(req, res, 'sign_in', null, true);
});

router.post('/sign_in', (req, res) =>
{
    // Already logged in:
    if(req.isAuthenticated()) return render(req, res, 'sign_in');

    if
    (
        !req.body.hasOwnProperty('user_name') ||
        !req.body.hasOwnProperty('password')
    )
    {
        req.body.info = `সবকিছু পূরণ করে আবার চেষ্টা করুন`;
        return render(req, res, 'sign_in', req.body, true, 400);
    }

    // Check captcha
    if(!captcha.captcha_is_valid(req))
    {
        req.body.info = `অক্ষরগুলি ঠিক হয়নি, আবার চেষ্টা করুন`;
        return render(req, res, 'sign_in', req.body, true, 409);
    }

    if(req.body.user_name)
    {
        req.body.user_name = safe(req.body.user_name);
    }

    passport.authenticate
    (
        'local',
        (err, user, info) =>
        {
            if(err)
            {
                console.log(err);
                req.body.info =
                `দুঃখিত, কোথাও গরমিল হয়েছে। ` +
                `আবার চেষ্টা করে দেখতে পারেন অথবা নিচে যোগাযোগ লিংক এ চাপ দিয়ে ` +
                `পরিচালকদের জানাতে পারেন।`;
                return render(req, res, 'sign_in', req.body, true, 500);

            }
            if(!user) /* User not found */
            {
                req.body.info =
                `ওই নাম ও গুপ্ত অক্ষর মিলিত কোনো নিবন্ধন পাওয়া যায়নি। ` +
                `নাম ও গুপ্ত অক্ষর ঠিক করে আবার চেষ্টা করতে পারেন।`
                return render(req, res, 'sign_in', req.body, true, 409);
            }
            else
            {
                req.logIn(user, (err) =>
                {
                    if(err)
                    {
                        console.error(err);

                        req.body.info =
                        `দুঃখিত, কোথাও গরমিল হয়েছে। ` +
                        `আবার চেষ্টা করে দেখতে পারেন অথবা নিচে যোগাযোগ লিংক এ চাপ দিয়ে ` +
                        `পরিচালকদের জানাতে পারেন।`;
                        return render(req, res, 'sign_in', req.body, true, 500);
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
});

module.exports = router;