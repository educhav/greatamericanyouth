const express = require('express');
const isbot = require('isbot');
const sqlite = require('sqlite3');
const path = require('path');
const ejs = require('ejs');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/dist/greatamericanyouth'));
const db = new sqlite.Database('greatamericanyouth.db');

const PORT = 4000;

app.use(express.static(__dirname + '/dist/greatamericanyouth'));

app.get('*', (req, res) => {
    const index = path.join(__dirname,'/dist/greatamericanyouth/index.ejs');
    const hostUrl = req.protocol + '://' + req.get('Host');
    const urlPath = req.originalUrl;
    const urlArray = urlPath.split("/");
    const urlName = urlArray[urlArray.length-1];
    if (req.originalUrl.includes("news")) {
        let metadata = {
            title: "Great American Youth",
            description: "Daily news at your will, obedient, submissive",
            thumbnail: "",
            url: "https://greatamericanyouth.com"
        }
        db.get('SELECT * FROM Articles WHERE urlName = ?', [urlName], (err, row) => {
            if (row) {
                metadata = {
                    title: row["title"],
                    description: row["description"],
                    thumbnail: row["thumbnail"],
                    url: hostUrl + urlPath
                };
            }
            res.render(index, 
                metadata);
        });
    }
    else {
        let metadata = {
            title: "Great American Youth",
            description: "Daily news at your will, obedient, submissive",
            thumbnail: "",
            url: "https://greatamericanyouth.com"
        }
        res.render(index, metadata);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});