const ACTIVATE_JSON_URL = 'https://api.twitter.com/1.1/guest/activate.json';
const VIDEO_URL = 'https://twitter.com/i/videos/tweet/';
const VIDEO_JSON_URL_SETTINGS = '?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_composer_source=true&include_ext_alt_text=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&send_error_codes=true&count=20&ext=mediaStats%2ChighlightedLabel%2CcameraMoment'
const VIDEO_JSON_URL = 'https://api.twitter.com/1.1/statuses/show.json?id=<number>' + VIDEO_JSON_URL_SETTINGS;
const VIDEO_JSON_URL2 = 'https://api.twitter.com/2/timeline/conversation/<number>.json' + VIDEO_JSON_URL_SETTINGS;
const CSRF_COOKIE_NAME = 'ct0';
const VIDEO_XPATH = '//video';
// These headers are not actually necessary for 1.1, but may be needed for v2.
const headers = {
	'x-twitter-auth-type': 'OAuth2Session',
	'x-twitter-active-user': 'yes',
	'Content-Type': 'application/x-www-form-urlencoded'
};
let apiVersion = '1.1';

function getVideo() {
	// This v2 API endpoint does work, but it requires a developer bearer token. The token obtained from the guest
	// activate JSON will not suffice.
	let url = apiVersion == 'v2' ? VIDEO_JSON_URL2 : VIDEO_JSON_URL;
	sendRequest(url.replace(/<number>/, pageName), 'GET', headers).then((videoInfo) => {
		// TODO: Handle multiple media tweets. extended_entities does not appear to exist for those.
		// It may be the case that the API does not have a pre-existing combined MP4 and instead assembles the m3u8
		// and m4s chunks together on the fly.
		// The video XPath above does technically add a download button below the video on multi posts,
		// but other elements can conceal it. Given that multi video does not work anyway, this is not a huge concern.
		let videos = null;
		if(apiVersion == 'v2') {
			videos = JSON.parse(videoInfo)?.globalObjects.tweets[pageName].extended_entities?.media[0]?.video_info?.variants;
		} else {
			videos = JSON.parse(videoInfo)?.extended_entities?.media[0]?.video_info?.variants;
		}
		if(videos) {
			let maxVideo = null;
			if(videos.length == 1) {
				// Only one video, so go ahead and open it
				maxVideo = videos[0];
			} else {
			let maxBitrate = 0;
				videos.forEach(function(video) {
					if(video.bitrate && video.bitrate > maxBitrate) {
						maxBitrate = video.bitrate;
						maxVideo = video;
					}
				});
			}
			open(maxVideo.url, '_blank');
		}
		downloadButton.disabled = false;
	});
}

let mediaCheck = null;
let downloadButton = document.createElement('button');
downloadButton.innerHTML = "Download";
downloadButton.onclick = function () {
	downloadButton.disabled = true;
	if(headers['Authorization'] && headers['x-csrf-token']) {
		getVideo();
	} else {
		headers['x-csrf-token'] = getCookie(CSRF_COOKIE_NAME);
		if(apiVersion == 'v2') {
			getVideo();
		} else {
			// Get token information, then retrieve video
			let videoUrl = VIDEO_URL + pageName;
			sendRequest(videoUrl, 'GET').then((videoToken) => {
				// Get js script files
				let tokens = videoToken.match(/src="(.*js)/g);
				let jsFileUrl = tokens[0].match(/src="(.*js)/)[1];
				sendRequest(jsFileUrl, 'GET').then((jsFile) => {
					headers['Authorization'] = jsFile.match(/Bearer ([a-zA-Z0-9%-]+)/)[0];
					sendRequest(ACTIVATE_JSON_URL, 'POST', headers).then((guestObjectString) => {
						const guestToken = JSON.parse(guestObjectString).guest_token;
						headers['x-guest-token'] = guestToken;
						getVideo();
					});
				});
			});
		}
	}
}

// For multi video posts, this will only work for the first played video.
function checkForMedia() {
	mediaContainer = document.evaluate(VIDEO_XPATH, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
	if(mediaContainer) {
		getParentElement(mediaContainer, 12).append(downloadButton);
		browser.storage.local.get({
			AMSI_TWITTER_API_VERSION: '1.1'
			},
			function(item) {
				apiVersion = item['AMSI_TWITTER_API_VERSION'];
			}
		);
		browser.storage.local.get({
			AMSI_TWITTER_BEARER_TOKEN: ''
			},
			function(item) {
				headers['Authorization'] = 'Bearer ' + item['AMSI_TWITTER_BEARER_TOKEN'];
			}
		);
		clearInterval(mediaCheck);
	}
}
mediaCheck = setInterval(checkForMedia, 1000);