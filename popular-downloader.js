const path = require('path');
const fs = require('fs');
const rp = require('request-promise');
const filetype = ['video', 'image'];

//Set initial properties(with encoding equal null being binary encoding) for media request-promise object’s options property
let optionsMedia = {
    uri: '',
    headers: {
        'Content-Type': '',
        'User-Agent': 'Request-Promise'
    },
    encoding: null

};

//Set initial properties(with json parsing for response) for reddit popular json request-promise object’s options property
const optionsJSON = {
    uri: 'https://reddit.com/r/popular.json',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};


(async () => {
    try {
        //Extracts media images or hosted videos (excludes embedded video) info such as url path,file type, and article id from popular-reddit json
        let resp = await rp(optionsJSON);
        let data = [];
        await resp.data.children.forEach(
            (element, index) => {
                let item = element.data;
                if (item.post_hint === undefined) {
                    return;
                } else if (item.post_hint.includes(filetype[0]) && item.is_video) {


                    data.push(mediaInfo(item, filetype[0]));


                    console.log('Hey its a video!')

                } else if (item.post_hint.includes(filetype[1])) {


                    data.push(mediaInfo(item, filetype[1]));



                    console.log('Hey its a image!')
                }
            });

        //Writes to file as a json all the file and download info for media that are images or video within the popular reddit json.
        const dataPath = path.join(__dirname, 'popular-articles-media-file-info.json');
        fs.writeFile(dataPath, JSON.stringify(data), (err) => {
            if (err) throw err;
        });



        //Cycles through the array of media download and file info and downloads file to download directory.
        data.forEach(async (element) => {
            try {


                let body = await rp(element.options);
                fs.writeFile(element.downloadPath, body, { encoding: 'binary' }, (err) => {
                    if (err) throw err;
                    console.log('wrote all data to file');
                });



            } catch (err) {
                throw err;
            }



        });





    } catch (err) {
        throw err;
    }


})();

//Takes some object with info and media type and returns an object with media file and download information as properties. Also 'scrubber_media_url' is use due to smaller file size.
function mediaInfo(item, type) {

    let fileUrl = type === filetype[0] ? item.media.reddit_video.scrubber_media_url : item.url;
    let fileExt = type === filetype[0] ? '.mp4' : `.${fileUrl.split('.').slice(-1)}`;
    let fileName = `${item.id + fileExt}`;
    optionsMedia.uri = fileUrl;
    optionsMedia.headers["Content-Type"] = type === filetype[0] ? `video/${fileExt.slice(1)}` : `image/${fileExt.slice(1)}`;
    return {
        type,
        fileUrl,
        fileExt,
        fileName,
        options: JSON.parse(JSON.stringify(optionsMedia)),
        downloadPath: path.join(__dirname, `\\downloads\\${fileName}`)
    };
}
