let router = require('express').Router();
let render = require('./function/render.js');
let fs     = require('fs');
let path   = require('path');

let json_file = path.join(path.dirname(__filename), '../', 'news.json');

router.get('/news', async (req, res) =>
{
    let obj = { };

    try { obj.news = JSON.parse(fs.readFileSync(json_file)); }
    catch(err) { console.error(err) }

    return render(req, res, 'news', obj);
});

module.exports = router;