let router = require('express').Router();
let render = require('./function/render.js');

router.get('/news', async (req, res) =>
{
    let obj = { };
    try { obj.news = require('../news.json') } catch(err) { console.error(err) }
    return render(req, res, 'news', obj);
});

module.exports = router;