let router = require('express').Router();
let render = require('./function/render.js');
let qr     = require('querystring');
let op     = require('../model/operations.js');

router.get('/contact/', (req, res) =>
{
    return render(req, res, 'contact');
});

router.get('/contact/:link', (req, res) =>
{
    if(req.params.link && req.params.link.trim().length)
    {
        return render
        (
            req,
            res,
            'contact',
            {
                content : `\n\n\nএই লেখা সম্পর্কে: `
                          + qr.unescape(req.params.link.trim())
                          + '\n'
            }
        );
    }

    return render(req, res, 'contact');
});

router.post('/contact', (req, res) =>
{
    if(!req.isAuthenticated())
    {
        req.body.info = `পাঠাতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে`;
        return render(req, res, 'contact', req.body, false, 400);
    }
    else if(!req.body.content.trim().length)
    {
        req.body.info = `সবকিছু ঠিক ভাবে পূরণ করে আবার চেষ্টা করুন`;
        return render(req, res, 'contact', req.body, false, 400);
    }
    else
    {
        op.create_report(req.session.passport.user.uname, req.body.content)
        .then(() =>
        {
            return render(req, res, 'contact_confirm');
        })
        .catch((err) =>
        {
            console.error(err);
            req.body.info = `কোনো সমস্যা হয়েছে, আবার চেষ্টা করুন অথবা পরিচালকদের সাথে যোগাযোগ করুন`;
            return render(req, res, 'contact', req.body, false, 500);
        });
    }
});

module.exports = router;