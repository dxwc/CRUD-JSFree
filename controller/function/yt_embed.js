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
allowfullscreen></iframe></div><div><a target='_blank' class='meta_info' href='${matched.trim()}'>${matched.trim()}</a></div>`
}

module.exports = (md_post) =>
{
    let default_linkopen_renderer =
    md_post.renderer.rules.link_open || function(tokens, idx, options, env, self)
    {
        return self.renderToken(tokens, idx, options);
    };

    md_post.renderer.rules.link_open = function(tokens, idx, options, env, self)
    {
        if
        (
            tokens.length > idx + 1 &&
            tokens[idx + 1].type == 'text' &&
            tokens[idx + 1].content &&
            (
                format_1.test(tokens[idx + 1].content) ||
                format_2.test(tokens[idx + 1].content) ||
                format_3.test(tokens[idx + 1].content)
            )
        )
        {
            return '';
        }
        else
        {
            return default_linkopen_renderer(tokens, idx, options, env, self);
        }
    }

    let default_linktext_renderer =
    md_post.renderer.rules.text || function(tokens, idx, options, env, self)
    {
        return self.renderToken(tokens, idx, options);
    };

    md_post.renderer.rules.text = function(tokens, idx, options, env, self)
    {
        if
        (
            tokens.length > 1 &&
            tokens[idx - 1] &&
            tokens[idx - 1].type === 'link_open' &&
            tokens[idx].content
        )
        {
            return tokens[idx].content
            .replace(format_1, replacer)
            .replace(format_2, replacer)
            .replace(format_3, replacer);
        }
        else
        {
            return default_linktext_renderer(tokens, idx, options, env, self);
        }
    }


    let default_linkclose_renderer =
    md_post.renderer.rules.link_close || function(tokens, idx, options, env, self)
    {
        return self.renderToken(tokens, idx, options);
    };

    md_post.renderer.rules.link_close = function(tokens, idx, options, env, self)
    {
        if
        (
            tokens.length > 1 &&
            tokens[idx - 1].type == 'text' &&
            tokens[idx - 1].content &&
            (
                format_1.test(tokens[idx - 1].content) ||
                format_2.test(tokens[idx - 1].content) ||
                format_3.test(tokens[idx - 1].content)
            )
        )
        {
            return '';
        }
        else
        {
            return default_linkclose_renderer(tokens, idx, options, env, self);
        }
    }
}