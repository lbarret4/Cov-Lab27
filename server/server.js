let path = require('path');
let fs = require('fs');

let chirps = [
    {
        time:new Date(2018, 7, 27, 7, 0).toString(),
        user:'Charles',
        content:'I ate the best pizza I ever had!',
    
    },
    {
        time: new Date(2018, 7, 28, 4, 0).toString(),
        user: 'Jemma',
        content: 'Who send greeting cards anymore?',
    },
    {
        time:new Date(2018, 7, 25, 17, 0).toString(),
        user:'Kim',
        content:'I am going to be the card dealer tonight! ',
    },
    {
        time: new Date(2018, 7, 29, 3, 30).toString(),
        user: 'Amanda',
        content:'Music: Radio, CDS, MP3s, Streaming',
    },
    {
        time:new Date(2018, 7, 23, 18,15).toString(),
        user: 'Kenji',
        content:'I left my hair brush at home.',
    },
] ;

let dataPath =path.join(__dirname,'chirps.json');
fs.writeFile(dataPath,JSON.stringify(chirps),(err) => {
    if(err) throw err;
});

fs.readFile(dataPath,(err,data) => {
    if(err) throw err;
    console.log(JSON.parse(data));
})

