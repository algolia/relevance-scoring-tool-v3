# Relevance Scoring Tool v3

<p align="center">
  <img src="https://cl.ly/f602133c2012/Screenshot%2525202019-06-04%252520at%25252014.59.08.png">
</p>

Purpose of this tool is to check how relevant Algolia results are. It is mainly used to check relevancy while developing and improving language handling.

## How to setup

The app is available on [http://relevance-scoring-tool.herokuapp.com/](http://relevance-scoring-tool.herokuapp.com/).

You can run only one test from this app, feel free to clone this repository and deploy it to Heroku if you need to run multiple tests simultaneously.

Using the app only requires you to update some environment variables either from a `.env` configuration file or directly from the [Heroku Dashboard](https://dashboard.heroku.com/apps/relevance-scoring-tool/settings).

### Required environment variables

- `RECORDS_APP_ID`: The Application ID that contains the index to test.
- `RECORDS_INDEX_NAME`: The Index name that contains the records to test.
- `RECORDS_SEARCH_API_KEY`: The Search API Key related to the previous App and Index.
- `RECORDS_ATTRIBUTES`: The attributes to display on the front-end (do NOT include the image one here).
- `RECORDS_IMAGE_ATTRIBUTE`: The image attribute to display.

- `RESULTS_APP_ID`: The Application ID that contains the indexes of the results.
- `RESULTS_ADMIN_API_KEY`: The Admin API Key related to the previous _RESULTS_APP_ID_ App.
- `RESULTS_AUTH_CODE`: The password to use to access the /results page.

- `QUERIES`: Comma separated list of queries to test.

## Notes

**It is important NOT TO change the Ranking Formula during the testing period, to ensure all testers have the same results for a given query.**

## Results

Results are pushed per tester on the App previously specified. You can use the data in any want you want afterwards either from the Algolia Dashboard (with faceting and all of that) or from API Clients.

A summary is also available at this address [http://relevance-scoring-tool.herokuapp.com/results](http://relevance-scoring-tool.herokuapp.com/results) from which you can see and download a .csv file. Please note you'll have to add the `?magic=AUTH_CODE` query parameter to access the page.
