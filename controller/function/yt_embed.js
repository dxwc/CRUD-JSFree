const format_1 = new RegExp
(
    `(?:^|\\s+)https:\\/\\/(?:www|m)\\.youtube\\.com\\/watch\\?` +
    `(?:.+\\&|)v=([a-zA-Z0-9_\\-]{11})(?:(\\&.*)|(?:(\\s+|$)))`
);

const format_2 = new RegExp
(
    `(?:^|\\s+)https:\\/\\/youtu.be\\/([a-zA-Z0-9_\\-]{11})(?:(\\?.*)|(?:(\\s+|$)))`
);

const format_3 = new RegExp
(
    `(?:^|\\s+)https:\\/\\/www\\.(?:youtube|youtube\\-nocookie)*\\.com\\/embed\\/` +
    `([a-zA-Z0-9_\\-]{11})(?:(\\?.*)|(?:(\\s+|$)))`
);


function replacer(matched, id)
{
    return `<div class='video'><iframe
width="560"
height="315"
src="https://www.youtube-nocookie.com/embed/${id}?rel=0"
frameborder="0"
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen></iframe></div><div><a target='_blank' class='meta_info' href='${matched.trim()}'>${matched.trim()}</a></div><br>`
}

function embed(input_text)
{
    return input_text
    .replace(format_1, replacer)
    .replace(format_2, replacer)
    .replace(format_3, replacer);
}

module.exports = embed;