var urlName = document.URL
var urlSplit = urlName.split('/')
var pageName = urlSplit.pop()

function replaceImage(newImageUrl){
	document.location.href = newImageUrl
}

if(/tumblr\.com/i.test(document.domain)){
	console.log("Tumblr!")
	if((!/_1280\.(png|gif|jpg)$/.test(pageName))){ //so we don't constantly reload
		replaceImage(urlName.replace(/_\d+\.(png|gif|jpg)$/, "_1280.$1"))
	}
}
//Get max res twimg image
else if(/pbs\.twimg\.com/i.test(document.domain)){
	console.log("Twimg!")
	if(/profile_images/.test(urlName)){ //if profile image
		console.log("Profile image")
		if(/_\d+x\d+/.test(pageName)){
			urlName = urlName.replace(/_\d+x\d+/i, "")
			replaceImage(urlName)
		}
	}
	else if(/\?format=[A-Za-z]+.*/.test(urlName)){ // New UI images
		console.log("New UI image")
		urlName = urlName.replace(/\?format=([A-Za-z]+).*/, ".$1:orig")
		replaceImage(urlName)
	}else if((!/:orig$/i.test(pageName))){ //if not already an :orig image
		console.log("Regular image")
		urlName = urlName.replace(/:large$/i, "")
		urlName += ":orig"
		replaceImage(urlName)
	}else{
		console.log("Unknown twimg image type?")
	}
}
//Get max res ytimg thumbnail
else if(/i\.ytimg\.com/i.test(document.domain)){
	console.log("ytimg thumbnail")
	if((!/maxresdefault.jpg$/i.test(pageName))){ //if not already a maxresdefault.jpg
		console.log("Regular image")
		urlName = urlName.replace(/hqdefault.jpg(.*)$/i, "maxresdefault.jpg")
		replaceImage(urlName)
	}
}
//Get max res instagram image when right click
else if(/instagram\.com/i.test(urlName)){
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
		if(!backButtonElement) {
			resultsIndex = 0;
		}else if(!nextButtonElement) {
			resultsIndex = results.length - 1;
		} else {
			resultsIndex = 1;
		}
		open(results[resultsIndex].src, '_blank');
	};

	let currentUrl = null;
	function checkForMedia() {
		mediaContainer = document.evaluate('/html/body/div[1]/div/div[1]/div/div[1]/div/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
		// If there is no media container div, or we're still on the same page, don't add the download button
		if(!mediaContainer || window.location.href === currentUrl) return;
		currentUrl = window.location.href;
		mediaContainer.append(downloadButton);
	}
	setInterval(checkForMedia, 1000);
}else if (/cdn.okccdn.com/i.test(urlName)){
	console.log("OK Cupid CDN")
	if(/400x400/i.test(urlName)){
		urlName = urlName.replace(/400x400\/400x400\/([^/])+\/([^/]+)/i, "$2/$2/$1/$2")
		replaceImage(urlName)
	}
}else if (/tiktok.com/i.test(urlName)){
	console.log("Tiktok video");
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
	const videoControlsXPath = '/html/body/div[2]/div[2]/div[2]/div[1]/div[3]/div[1]/div[1]/div[3]';
	let videoControlsContainer = null;
	function checkForVideo() {
		videoControlsContainer = document.evaluate(videoControlsXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
		// If there is no video container div, or we're still on the same page, don't add the download button
		if(!videoControlsContainer || window.location.href === currentUrl) return;
		currentUrl = window.location.href;
		videoControlsContainer.append(downloadButton);
	}
	setInterval(checkForVideo, 1000);
	
}else if (/redd\.it/i.test(urlName)){
	console.log("Reddit");
	if((!/i\.redd\.it\/.*[^.]+\.(png|gif|jpg)$/.test(urlName))) { // So we don't constantly reload
		urlName = urlName.replace("preview", "i");
		urlName = urlName.replace(/\/(([^.])+\.(png|gif|jpg)).*/, "\/$1")
		replaceImage(urlName)
	}
}else{
	console.log("Unknown site: " + document.domain)
}
