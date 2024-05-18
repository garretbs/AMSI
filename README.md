# Automatic Media Selection Integration
For direct image links, this will automatically fetch and replace the URL for the max resolution image. For direct social media posts featuring media, this will add a download button to fetch the image or video.
## Supported image sites
Twitter single video/GIF posts, pbs.twimg.com, Instagram posts, okccdn.com, static ytimg thumbnails, redd.it images
## Usage
Plug and play. Automatic for direct image links. Social media posts have download buttons added.

If uBlock Origin is installed, it may be necessary to add the following filters under `My Filters`:

```@@||api.twitter.com/1.1/statuses/show.json$xhr```
```@@||api.x.com/1.1/statuses/show.json$xhr```
## Todo
* Tweets with multiple videos/GIFs