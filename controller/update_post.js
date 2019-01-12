let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');

router.get('/post/:id/update', async (req, res) =>
{
    function invalid(status)
    {
        return render
        (
            req,
            res,
            'update_post',
            {
                info : `লেখা পরিবর্তন করতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে ` +
                       `এবং এই লেখার লেখক হতে হবে।`},
            status ? status : 400
        );
    }

    if(!req.isAuthenticated()) return invalid();

    if(!req.params.id.constructor === String || !val.isUUID(req.params.id, 4))
        return invalid();

    if
    (
        !req.query.username ||
        req.query.username.constructor !== String ||
        req.query.username !== req.session.passport.user.uname
    )
        return invalid();

    try
    {
        let post = await op.read_post(req.params.id, true)
        return render(req, res, 'update_post', post);
    }
    catch(err)
    {
        return invalid(500)
    }
});

router.post('/post/:id/update', async (req, res) =>
{
    function invalid(status)
    {
        req.body.info =
        `লেখা পরিবর্তন করতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে এবং এই লেখার লেখক হতে হবে।`;
        return render(req, res, 'update_post', req.body, status ? status : 400);
    }

    if(!req.isAuthenticated()) return invalid();

    if(req.params.id.constructor !== String || !val.isUUID(req.params.id, 4))
        return invalid();

    if(!req.body.hasOwnProperty('content'))
        return render(req, res, 'update_post', null, false, 401);

    req.body.content = req.body.content.trim();

    if(!req.body.content.length)
        return render(req, res, 'update_post', null, false, 401);

    try
    {
        await op.update_post
              (req.params.id, req.body.content, req.session.passport.user.id);
        return res.status(200).redirect(`/post/` + req.params.id);
    }
    catch(err)
    {
        req.body.info = `দুঃখিত, কোথাও গরমিল হয়েছে। ` +
        `আবার চেষ্টা করে দেখতে পারেন অথবা নিচে যোগাযোগ লিংক এ চাপ দিয়ে ` +
        `পরিচালকদের জানাতে পারেন।`;
        return render(req, res, 'update_post', req.body, false, 500);
    }
});

module.exports = router;