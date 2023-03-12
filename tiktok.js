const VIDEO_CONTROLS_XPATH = '/html/body/div[2]/div[2]/div[2]/div/div[2]/div[1]/div[1]/div[1]/div[5]/div[2]/div[2]';

let videoSource = null;
const getVideoElement = function(node) {
	if (node.nodeName === 'VIDEO') {
		videoSource = node.src;
		return node.src;
	}
	for(let i = 0; i < node.children.length; i++) {
		if(getVideoElement(node.children[i])) break;
	}
	return null;
};

let downloadButton = document.createElement('button');
downloadButton.innerHTML = "Download";
downloadButton.onclick = function() {
	getVideoElement(document);
	open(videoSource, '_blank');
};

let currentUrl = null;

let videoControlsContainer = null;
function checkForVideo() {
	videoControlsContainer = document.evaluate(VIDEO_CONTROLS_XPATH, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
	// If there is no video container div, or we're still on the same page, don't add the download button
	if(!videoControlsContainer || window.location.href === currentUrl) return;
	currentUrl = window.location.href;
	videoControlsContainer.append(downloadButton);
}
setInterval(checkForVideo, 1000); 