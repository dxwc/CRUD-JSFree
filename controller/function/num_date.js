const dict = /* put keys with s before non s ones */
{
    '1' : `১`,
    '2' : `২`,
    '3' : `৩`,
    '4' : `৪`,
    '5' : `৫`,
    '6' : `৬`,
    '7' : `৭`,
    '8' : `৮`,
    '9' : `৯`,
    '0' : `০`,
    'ago' : 'আগে',
    'a few' : `কয়েক`,
    'an ': `এক `,
    'a ': `এক `,
    'seconds' : `সেকেন্ড`,
    'second' : `সেকেন্ড`,
    'minutes' : `মিনিট`,
    'minute' : `মিনিট`,
    'hours' : `ঘণ্টা`,
    'hour' : `ঘণ্টা`,
    'days' : `দিন`,
    'day' : `দিন`,
    'weeks' : `সপ্তাহ`,
    'week' : `সপ্তাহ`,
    'months' : `মাস`,
    'month' : `মাস`,
    'years' : `বছর`,
    'year'  : `বছর`
}

module.exports = (input) =>
{
    return input.replace
    (
        new RegExp(Object.keys(dict).join('|'),'gi'),
        (found) => dict[found]
    );
}