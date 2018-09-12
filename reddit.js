const path = require('path');
const fs = require('fs');
const rp = require('request-promise');

const options = {
    uri: 'https://reddit.com/r/popular.json',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};

(async () => {
    try {
        let resp = await rp(options);
        let data = []
        await resp.data.children.forEach(
            (element) => {
                let item = element.data;
                data.push(
                    {
                        title: item.title,
                        author: item.author,
                        url: `https://www.reddit.com${item.permalink}`
                    }
                )

            });
       
        const dataPath = path.join(__dirname, 'popular-articles.json');
        fs.writeFile(dataPath, JSON.stringify(data), (err) => {
            if (err) throw err;
        });

        

    } catch (err) {
        throw err;
    }


})();
