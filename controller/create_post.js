let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.get('/post', (req, res) =>
{
    return render(req, res, 'create_post');
});

router.post('/post', async (req, res) =>
{
    if(!req.isAuthenticated())
    {
        req.body.info = `লিখতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে`;
        return render(req, res, 'create_post', req.body);
    }

    if(!req.body.hasOwnProperty('content'))
    {
        return render(req, res, 'create_post', null, false, 401);
    }

    req.body.content = req.body.content.trim();

    if(!req.body.content.length)
    {
        return render(req, res, 'create_post', null, false, 401);
    }

    try
    {
        let id = await op.create_post
                (req.body.content, req.session.passport.user.id);
        return res.status(200).redirect(`/post/` + id);
    }
    catch(err)
    {
        if(err.code === 'TIME_LIMIT')
        {
            req.body.info = `নতুন লেখা জমা দিতে আরো ` +
                            `${err.message} সেকেন্ড অপেক্ষা করতে হবে`;
            return render(req, res, 'create_post', req.body, false, 429)
        }

        console.log(req.session.passport, err);
        req.body.info = `কোথাও সমস্যা হয়েছে, আবার চেষ্টা করতে পারেন অথবা পরিচালকদের সাথে যোগাযোগ `
        + `করতে পারেন`;
        return render(req, res, 'create_post', req.body, false, 500);
    }
});

module.exports = router;