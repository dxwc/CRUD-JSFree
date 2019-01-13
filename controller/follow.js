let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');

router.post('/follow/:user_name', (req, res) =>
{
    if(!req.isAuthenticated())
    {
        let obj = {};
        obj.info = `আপনাকে আগে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে`;
        return render(req, res, 'error', obj, false, 400);
    }

    op.create_follow(req.session.passport.user.id, req.params.user_name)
    .then(() =>
    {
        return res.redirect(`/user/` + req.session.passport.user.uname);
    })
    .catch((err) =>
    {
        console.error(err);
        return render
        (
            req,
            res,
            'error',
            { info : `দুঃখিত, কোথাও গরমিল হয়েছে। ` +
            `আবার চেষ্টা করে দেখতে পারেন অথবা নিচে যোগাযোগ লিংক এ চাপ দিয়ে ` +
            `পরিচালকদের জানাতে পারেন।` },
            false,
            500
        );
    });
});

module.exports = router;