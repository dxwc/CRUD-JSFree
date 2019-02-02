let Parser = require('rss-parser');
let parser = new Parser();
let fs     = require('fs');
let path   = require('path');

let urls =
[
    {
        channel_id : `UC8NcXMG3A3f2aFQyGTpSNww`,
        to_search : `Channel i NEWS ||`
    },
    {
        channel_id : `UC2P5Fd5g41Gtdqf0Uzh8Qaw`,
        to_search : `Rtv News`
    },
    {
        channel_id : `UChPD2BQ2dJ-w00klQQkc-Qg`,
        to_search : `পর্ব`
    }
];

const json_file_path = path.join(path.dirname(__filename), 'news.json');

async function get_one_from_feed(url, to_search)
{
    try
    {
        let feed = await parser.parseURL(url);
        for(let i = 0; i < feed.items.length; ++i)
        {
            if(feed.items[i].title.indexOf(to_search) !== -1)
            {
                return ({
                    id : feed.items[i].id.substring(9),
                    title: feed.items[i].title
                });
            }
        }
    }
    catch(err) { console.error(err) }
}

async function save_file()
{
    try
    {
        let vid = [];
        for(let i = 0; i < urls.length; ++i)
        {
            let res = await get_one_from_feed
            (
                `https://www.youtube.com/feeds/videos.xml?` +
                `channel_id=${urls[i].channel_id}`,
                urls[i].to_search
            );

            if(res) vid.push(res);
        };

        fs.writeFileSync(json_file_path, JSON.stringify(vid));
        console.log('(: collected and saved news video feed json :)');
    }
    catch(err)
    {
        console.error(err);
    }
}

save_file();

setInterval(save_file, 30 * 60 * 1000); // every 30 minute