[![npm version](https://badge.fury.io/js/clappr-markers-plugin.svg)](https://badge.fury.io/js/clappr-heading-plugin)
# Clappr Heading Plugin
A plugin for clappr which allows a clickable heading to be included inside the player. The heading will be visible when the media is stopped, and whilst playing when the control bar is visible.

![Screenshot](screenshot.jpg)

# Usage
Add both Clappr and the heading plugin scripts to your HTML:

```html
<head>
  <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
  <script type="text/javascript" src="dist/clappr-heading-plugin.js"></script>
</head>
```

You can also find the project on npm: https://www.npmjs.com/package/clappr-heading-plugin

Then just add `ClapprHeadingPlugin` into the list of plugins of your player instance, and the options for the plugin go in the `headingPlugin` property as shown below.

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  plugins: {
    core: [ClapprHeadingPlugin]
  },
  headingPlugin: {
    text: "Something really interesting",
    hyperlink: "http://google.com", // optional
    openInNewWindow: true // optional
  }
});
```

The `text` option is the text you want in the heading, `hyperlink` is optional and is the page the user should be taken to if they click the heading. If `hyperlink` is provided then it will default to opening the hyperlink in the same window, but if you set `openInNewWindow` to `true`, the browser will navigate to the hyperlink in a new window instead. The media that is playing is automatically paused when the link is clicked.

# Demo
To run the demo start a web server with the root directory being the root of this repo, and then browse to the "index.html" file in the "demo" folder.

I am also hosting a demo at http://tjenkinson.me/clappr-heading-plugin/

# Development
Install dependencies:

`npm install`

Build:

`npm run build`

Minified version:

`npm run release`
