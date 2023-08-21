console.log("Instagram!");
let mediaContainer = null;
let mediaObject = null;
const downloadButton = document.createElement('button');
downloadButton.innerHTML = "Download";
downloadButton.onclick = function() {
	// Go through children until img/video found
	let results = [];
	const getMediaElement = function(node) {
		if (node.nodeName === 'IMG' || node.nodeName === 'VIDEO') {
			results.push(node);
			return;
		}
		for(let i = 0; i < node.children.length; i++) {
			getMediaElement(node.children[i]);
		}
	};
	getMediaElement(mediaContainer);

	// There can be up to three media found: previous, current, next.		
	// If there is no back button, take the first
	// Else if there is no next button, take the last
	// Otherwise, take the middle
	let resultsIndex = -1;
	const backButtonElement = document.querySelector('[aria-label="Go Back"]');
	const nextButtonElement = document.querySelector('[aria-label="Next"]');
	if(backButtonElement) {
		resultsIndex = 1;
	} else {
		resultsIndex = 0;
	}

	const currentMedia = results[resultsIndex];
	if(currentMedia.nodeName === 'VIDEO') {
		// I don't know of a great way to know which video URLs map to the current media, so just open all of them.
		mediaObject.forEach((object) => {
			const video = object?.require?.[0]?.[3]?.[0]?.__bbox?.require?.[0]?.[3]?.[1]?.__bbox?.result?.data;
			if(!video) return;

			const url = video.xdt_api__v1__media__shortcode__web_info?.items[0].video_versions[0].url;
			if (url) open(url, '_blank');
		});
	} else {
		open(currentMedia.src, '_blank');
	}
};

let currentUrl = null;
function checkForMedia() {
	mediaContainer = document.evaluate('//section/main/div/div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
	// If there is no media container div, or we're still on the same page, don't add the download button
	if(!mediaContainer || window.location.href === currentUrl) return;

	let objects = document.querySelectorAll('[type="application/json"]')
	mediaObject = []
	objects.forEach((object) => mediaObject.push(JSON.parse(object.textContent)));
	currentUrl = window.location.href;
	mediaContainer.append(downloadButton);
}
setInterval(checkForMedia, 1000);