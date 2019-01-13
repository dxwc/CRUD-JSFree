let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');

router.get('/delete_comment/:id', (req, res) =>
{
    let obj = {};
    if(!req.isAuthenticated())
    {
        obj.info = `মুছে ফেলতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে এবং মতামতের লেখক হতে হবে`;
        return render(req, res, 'error', obj, false, 400);
    }

    if(!val.isUUID(req.params.id, 4))
    {
        obj.info = `মোটামোটি খুঁজে পাওয়া যায়নি`;
        return render(req, res, 'error', obj, false, 500);
    }

    op.read_comment(req.params.id)
    .then((result) =>
    {
        result.info = `নিশ্চিত করুন যে আপনি মোটামোটি মুছতে চাচ্ছেন`;
        if(result.commenter === req.session.passport.user.id)
            return render(req, res, 'delete_preview', result);
        else
            return render
            (
                req,
                res,
                'delete_preview',
                {...result, info: `এটি আপনার লেখা মতামত নয়, আপনি মুছতে পারবেন না` }
            );
    })
    .catch((err) =>
    {
        console.error(err);
        req.body.info = `দুঃখিত, কোথাও গরমিল হয়েছে। ` +
        `আবার চেষ্টা করে দেখতে পারেন অথবা নিচে যোগাযোগ লিংক এ চাপ দিয়ে ` +
        `পরিচালকদের জানাতে পারেন।`;
        return render(req, res, 'delete', null, false, 500);
    })
});

router.post('/confirm_delete/:id', (req, res) =>
{
    if(!req.isAuthenticated() || !val.isUUID(req.params.id, 4))
        return render(req, res, 'error');
    op.delete_comment(req.params.id, req.session.passport.user.id)
    .then(() =>
    {
        if(req.body.post_id) return res.redirect('/post/' + req.body.post_id);
        else                 return render
        (
            req,
            res,
            'error',
            { info :
                `কোথাও গরমিল হয়েছে, কিন্তু আপনার মতামত মোছার পরে হয়েছে। `}
        );
    })
    .catch((err) =>
    {
        return render(req, res, 'error', { info : `দুঃখিত, কোথাও গরমিল হয়েছে। ` +
        `আবার চেষ্টা করে দেখতে পারেন অথবা নিচে যোগাযোগ লিংক এ চাপ দিয়ে ` +
        `পরিচালকদের জানাতে পারেন।` }, false, 500);
    });
});

module.exports = router;