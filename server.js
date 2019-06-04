require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const algoliasearch = require('algoliasearch');
const clientAlgolia = algoliasearch(process.env.RESULTS_APP_ID, process.env.RESULTS_ADMIN_API_KEY);

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(cors());

app.get('/api/settings', (req, res) => {
    res.json({
        appId: process.env.RECORDS_APP_ID,
        searchApiKey: process.env.RECORDS_SEARCH_API_KEY,
        indexName: process.env.RECORDS_INDEX_NAME,
        attributesToDisplay: process.env.RECORDS_ATTRIBUTES.split(',').map(attr => attr.trim()),
        imageAttribute: process.env.RECORDS_IMAGE_ATTRIBUTE,
        queries: process.env.QUERIES.split(',').map(query => query.trim())
    })
});

app.post('/api/answers', (req, res) => {
    const { appId, indexName, user, query, status, comment, timestamp } = req.body;

    const indexAlgolia = clientAlgolia.initIndex(`${appId}_${indexName}_${user}`);

    indexAlgolia.addObject({
        objectID: query,
        query,
        status,
        comment,
        timestamp
    }, (err, { objectID }) => {
        res.json('Answer saved');
    });
});

app.get('/api', function (req, res) {
    res.json('Relevance Scoring Tool API v1')
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

app.listen(process.env.PORT || 8080, function () {
    console.log('Relevance Scoring Tool API v1 started.')
});