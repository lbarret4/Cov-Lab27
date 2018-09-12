const path = require('path');
const fs = require('fs');
const rp = require('request-promise');
const filetype = ['video', 'image'];

let optionsMedia = {
    uri: '',
    encoding: null

};

const optionsJSON = {
    uri: 'https://reddit.com/r/popular.json',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};


(async () => {
    try {
        let resp = await rp(optionsJSON);
        let data = [];
        await resp.data.children.forEach(
            (element, index) => {
                let item = element.data;
                if (item.post_hint === undefined) {
                    return;
                } else if (item.post_hint.includes(filetype[0]) && item.is_video) {

                    let fileUrl = item.media.reddit_video.scrubber_media_url;
                    let fileExt = '.mp4';
                    let fileName = `file${index + fileExt}`
                    optionsMedia.uri = fileUrl + fileExt;
                    data.push({
                        type: filetype[0],
                        fileUrl,
                        fileExt,
                        fileName,
                        options: JSON.parse(JSON.stringify(optionsMedia)),
                        downloadPath: path.join(__dirname, `\\downloads\\${fileName}`)
                    })

                    // let dataPath = path.join(__dirname,`\\downloads\\file${index}.mp4`);

                    // fs.createWriteStream(dataPath,, (err) => {
                    //         if (err) throw err;
                    //     });
                    console.log('Hey its a video!')

                } else if (item.post_hint.includes(filetype[1])) {

                    let fileUrl = item.url;
                    let fileExt = fileUrl.split('.').slice(-1);
                    let fileName = `file${index + fileExt}`
                    optionsMedia.uri = fileUrl;
                    data.push({
                        type: filetype[1],
                        fileUrl,
                        fileExt,
                        fileName,
                        options: JSON.parse(JSON.stringify(optionsMedia)),
                        downloadPath: path.join(__dirname, `\\downloads\\${fileName}`)
                    });



                    console.log('Hey its a image!')
                }
            });

        const dataPath = path.join(__dirname, 'popular-articles-media-file-info.json');
        fs.writeFile(dataPath, JSON.stringify(data), (err) => {
            if (err) throw err;
        });

        // let body = await rp(optionsMedia);
        //         fs.writeFile(dataPath, body, { encoding: 'binary' }, (err) => {
        //             if (err) throw err;
        //             console.log('wrote all data to file');
        //         });

        // const dataPath = path.join(__dirname, 'popular-articles.json');
        // fs.writeFile(dataPath, JSON.stringify(data), (err) => {
        //     if (err) throw err;
        // });



    } catch (err) {
        throw err;
    }


})();
