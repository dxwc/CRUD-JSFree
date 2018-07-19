let db  = require('./connect.js');
let val = require('validator');
let xss = require('xss-filters');
let mom = require('moment');
let uuid = require('uuid');

function get_home_page_list()
{
    return db.query(`SELECT * FROM submission ORDER BY published limit 20`)
    .then((res) =>
    {
        res.forEach((post) =>
        {
            post.title     = xss.inHTMLData(val.unescape(post.title));
            post.content   = xss.inHTMLData(val.unescape(post.content));
            post.published = mom.unix(post.published).fromNow();
        });

        return res;
    });
}

function sign_up(username, password)
{
    return db.one
    (
        `
        INSERT INTO people
        (
            id,
            u_name,
            u_pass,
            joined
        )
        VALUES
        (
            '${uuid.v4()}',
            '${val.escape(username)}',
            '${val.escape(password)}',
            ${new Date().getTime() / 1000}
        )
        RETURNING id
        `
    )
    .then((res) =>
    {
        return res.id;
    })
    .catch((err) =>
    {
        if(err.code == '23505') throw new Error('-1'); // username already exists
        else throw err;
    });
}

function login(username, password)
{
    return db.one
    (
        `
        SELECT id
        FROM people
        WHERE
            u_name='${val.escape(username)}' AND
            u_pass='${val.escape(password)}'
        `
    )
    .then((res) =>
    {
        return res.id;
    });
}

module.exports.get_home_page_list = get_home_page_list;
module.exports.sign_up = sign_up;
module.exports.login = login;
