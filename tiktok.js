let downloadButton = document.createElement('button');
downloadButton.innerHTML = "Download";
downloadButton.onclick = function() {
	let videoSource = document.querySelector('video');
	videoSource = document.evaluate('source[3]', videoSource, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.src;
	open(videoSource, '_blank');
};

let currentUrl = null;

let videoControlsContainer = null;
function checkForVideo() {
	videoControlsContainer = document.querySelectorAll('[class*=DivRightControlsWrapper]')[0];
	// If there is no video container div, or we're still on the same page, don't add the download button
	if(!videoControlsContainer || window.location.href === currentUrl) return;
	currentUrl = window.location.href;
	videoControlsContainer.append(downloadButton);
}
setInterval(checkForVideo, 1000); 