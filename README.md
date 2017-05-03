# Kwiki

This is a collaborative wiki-style notes app for express, originally designed for managing table-top games. It is configurable and hackable.

This app uses:
- jQuery
- lodash
- express
- brunch
- simplemde


## Getting started

1. Clone the repository
2. run `npm install`
3. run `brunch build`
4. run `npm start` to start the server

## Using the App:

The app is (currently) very quick and dirty. To use the app, start the server, open a browser to `localhost:3000` (if no `$PORT` is set) and click the new item button to create a new item. A simplemde markdown editor will appear and you can create a new note. You can use mustache style tags to call macros when the item is rendered. These should look like this:

```markdown
## This is a valid markdown title.

This is some markdown text. This is a tag: {#Tag}
Tags are useful for sorting and filtering.
{{macro:parameter:parameter2}}
```

## Modifying the app to suit your needs

All of the front-end code resides in `app`.

Most of the modifications will be in the `app/macros.js` file. Simply update the exported object to include new properties for new macros you would like to be able to insert. The key of any newly added macro objects will then be the name of the macro. The html property of the macro should be a function that returns the html you want to display. You can then add either an apply or a click method that contains code that can be run either when the macro is rendered, or when the html element is clicked.

Any styling can be done by appending style rules to the `app.css` file.

## Notes

This app is written targeting modern browsers, so if you wish to target older browsers, add babel to the brunch-config to preprocess the front-end assets.

The app as written does not use any authentication, so it is deeply insecure. This is fine for a personal note app running locally, but because the app is written using express, passport can be easily integrated.
