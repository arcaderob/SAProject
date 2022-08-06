# SAProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.5.

## Run Application (Development server for scedemic purposes)

* Clone/copy the repo to a location on your local and navigate into the folder.
* Run `npm i` to install the dependencies.
* Run `npm run start` to start the backend and frontend server pieces
* Navigate to `http://localhost:4200/` to access the app.

## Using the app
### Buying/Selling
* Enter a symbol (eg GOOG) and click "Get price"
* The enter a number of shares and click Buy or Sell
* Then refresh the page and see your changes in the table
### Generating a Report
* Enter a symbol for while you have performed transactions
* Click Generate Report and observe the data in the table
* Click Save Report to save a CSV of the data
### Adding or Removing Notifications
* Enter a symbol (eg GOOG) and select Higher or Lower
* Enter a dollar amount and click Add Notification
* The app will check the dollar amount (every 4 mins) and if it goes higher or lower than the amount you set, you will recieve a browser notification.
* Click Clear Notifications to remove all notificaitons
### Rebuilding Projections
* Enter the name of a symbol for which you already have transactions
* Enter a new dollar amount that you would like to manually set (so that the projection has the wrong value)
* Enter the name of the symbol you want to rebuild in the Rebuild Symbol input and click Rebuild
* Upon refreshing the page, you will see that the DB has gone through all the events and rebuild the projection
