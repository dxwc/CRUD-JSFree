let router = require('express').Router();
let render = require('./function/render.js');
let op     = require('../model/operations.js');
let val    = require('validator');

router.post('/comment', (req, res) =>
{
    if(!req.isAuthenticated())
    {
        req.body.info = `মতামত লিখতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে`;
        return render(req, res, 'create_comment', req.body, false, 400);
    }

    if
    (
        !req.body.post_id ||
        !val.isUUID(req.body.post_id, 4) ||
        !req.body.comment_w ||
        !req.body.comment_w.trim().length
    )
    {
        req.body.info = `সবকিছু ঠিক ভাবে পূরণ করে পাঠানো হয়নি, আবার চেষ্টা করুন`;
        return render(req, res, 'create_comment', req.body, false, 400);
    }

    op.create_comment
    (
        req.body.post_id,
        req.session.passport.user.id,
        req.body.comment_w.trim()
    )
    .then((id) =>
    {
        return res.redirect('/post/'+req.body.post_id+'#'+id);
    })
    .catch((err) =>
    {
        console.log(err);
        req.body.info = `কোনো সমস্যা হয়েছে, আবার চেষ্টা করুন অথবা ` +
        `পরিচালকদের সাথে যোগাযোগ করুন`;
        return render(req, res, 'create_comment', req.body, false, 500);
    });
});

router.get('/reply_to/:id', (req, res) =>
{
    let obj = {};
    if(!req.isAuthenticated())
    {
        obj.info = `জবাব/মতামত লিখতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে`;
        return render(req, res, 'reply_to', obj, false, 400);
    }

    if(!val.isUUID(req.params.id, 4))
    {
        obj.info = `যে মতামতে জবাব লিখতে চাচ্ছেন সেটা খুঁজে পাওয়া যায়নি`;
        return render(req, res, 'reply_to', obj, false, 400);
    }

    op.read_comment(req.params.id)
    .then((result) =>
    {
        return render(req, res, 'reply_to', result);
    })
    .catch((err) =>
    {
        console.error(err);
        req.body.info = `কোনো সমস্যা হয়েছে, ফিরে যেয়ে আবার চেষ্টা করুন অথবা পরিচালকদের `
        + `সাথে যোগাযোগ করুন`;
        return render(req, res, 'reply_to', null, false, 500);
    })
});

router.post('/reply_to/:id', (req, res) =>
{
    if(!req.isAuthenticated())
    {
        req.body.info = `জবাব/মতামত লিখতে নিবন্ধনধারী হিসেবে প্রবেশ করতে হবে`;
        return render(req, res, 'reply_to', req.body, false, 400);
    }

    if
    (
        !val.isUUID(req.params.id, 4) ||
        !req.body.comment_w ||
        !req.body.comment_w.trim().length
    )
    {
        req.body.info = `সবকিছু ঠিক ভাবে পূরণ করে পাঠানো হয়নি, ফিরে যেয়ে আবার চেষ্টা করুন`;
        return render(req, res, 'reply_to', req.body, false, 400);
    }

    let obj;

    op.read_comment(req.params.id)
    .then((result) =>
    {
        if(!result.id || !result.post_id) throw new Error('Comment does not exist');
        obj = result;
    })
    .then(() =>
    {
        return op.create_comment
        (
            obj.post_id,
            req.session.passport.user.id,
            req.body.comment_w.trim(),
            req.params.id
        );
    })
    .then((id) =>
    {
        return res.redirect('/post/' + obj.post_id + '#' + id);
    })
    .catch((err) =>
    {
        console.log(err);
        req.body.info = `কোনো সমস্যা হয়েছে, ফিরে যেয়ে আবার চেষ্টা করুন অথবা পরিচালকদের `
        + `সাথে যোগাযোগ করুন`;
        return render(req, res, 'reply_to', req.body, false, 500);
    });
});

module.exports = router;