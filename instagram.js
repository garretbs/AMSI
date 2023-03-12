console.log("Instagram!");
let mediaContainer = null;
let downloadButton = document.createElement('button');
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
	let backButtonElement = document.querySelector('[aria-label="Go Back"]');
	let nextButtonElement = document.querySelector('[aria-label="Next"]');
	if(backButtonElement) {
		resultsIndex = 1;
	} else {
		resultsIndex = 0;
	}
	open(results[resultsIndex].src, '_blank');
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