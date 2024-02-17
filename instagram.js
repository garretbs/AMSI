console.log('Instagram!');
let mediaContainer = null;
let mediaObjects = null;
const downloadButton = document.createElement('button');
downloadButton.innerHTML = 'Download';
downloadButton.onclick = function() {

	let carousel = null;
	mediaObjects = [];
	let objects = document.querySelectorAll('[data-content-len]');
	objects.forEach((object) => mediaObjects.push(JSON.parse(object.textContent)));

	mediaObjects.forEach((object) => {
		if(carousel) return;

		// TODO: This logic seems sound, but it seems like navigating to other pages in the same tab will result in
		// stale data here...
		const media = object?.require?.[0]?.[3]?.[0]?.__bbox?.require?.[0]?.[3]?.[1]?.__bbox.result?.data;
		carousel = media?.xdt_api__v1__media__shortcode__web_info?.items[0].carousel_media;
		if(!carousel) return;

		carousel.forEach((displayItem) => {
			const videos = displayItem.video_versions;
			if(videos) {
				open(videos[0].url, '_blank');
				return;
			}

			const images = displayItem.image_versions2;
			if(images) {
				open(images.candidates[0].url, '_blank');
				return;
			}
		});
	});
};

let currentUrl = null;
function checkForMedia() {
	mediaContainer = document.evaluate('//section/main/div/div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
	// If there is no media container div, or we're still on the same page, don't add the download button
	if(!mediaContainer || window.location.href === currentUrl) return;

	currentUrl = window.location.href;
	mediaContainer.append(downloadButton);
}
setInterval(checkForMedia, 1000);