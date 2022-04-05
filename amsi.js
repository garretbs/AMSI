var urlName = document.URL
var urlSplit = urlName.split('/')
var pageName = urlSplit.pop()

function replaceImage(newImageUrl){
	document.location.href = newImageUrl
}

function startNav() {
	return `<header style="position: absolute; top:0; background-color: #111111; width: 100%; text-align: center; z-index: 9999; padding-bottom: 1em; padding-top: 1em;">`;
}

function addNavLink(url, text) {
	return `<a href="${url}" target="_blank" style="color: white;">${text}</a>`
}

function closeNav() {
	return "</header>";
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
	console.log("Instagram!")
	
	const imageRegex = /\{\"candidates\":\[\{\"width":\d+,\"height\":\d+,\"url\":\"([^"]+)\"\}/
	const globalImageRegex = new RegExp(imageRegex.source, "g");
	
	const videoRegex = /\"video_versions\":\[\{\"type":\d+,\"width":\d+,\"height\":\d+,\"url\":\"([^"]+)\"/
	let linkNav = startNav();
	let videoUrl = videoRegex.exec(document.body.outerHTML);
	// Video exists, so get the link for that
	if(videoUrl) {
		videoUrl = videoUrl[1].split("\\u0026").join("&");
		linkNav += addNavLink(videoUrl, "Click here to open video");
	} else {
		// Otherwise fetch the image(s)
		let imageUrls = document.body.outerHTML.match(globalImageRegex);
		let index = 1;
		imageUrls.forEach(imageUrl => {
				let urlMatch = imageRegex.exec(imageUrl)[1];
				urlMatch = urlMatch.split("\\u0026").join("&");
				linkNav += addNavLink(urlMatch, `Click here to open image ${index++}`);
			}
		)
	}
	linkNav += closeNav();
	
	// Let the user call the links manually because:
	// 	a) It's somewhat obstructive to the page's content
	// 	b) Instagram will refuse to load if you muck with the page before it's done
	let gotLinks = false;
	document.addEventListener("contextmenu", function(e) {
		if(gotLinks) return;
		document.body.outerHTML += linkNav
		gotLinks = true;
	}, false)
}else if (/cdn.okccdn.com/i.test(urlName)){
	console.log("OK Cupid CDN")
	if(/400x400/i.test(urlName)){
		urlName = urlName.replace(/400x400\/400x400\/([^/])+\/([^/]+)/i, "$2/$2/$1/$2")
		replaceImage(urlName)
	}
}else if (/tiktok.com/i.test(urlName)){
	console.log("Tiktok video");
	
	const videoRegex = /"downloadAddr":"([^"]+)"/
	const videoLink = videoRegex.exec(document.body.outerHTML)[1].replace(/\\u002F/ig, "\\/");
	
	let linkNav = startNav();
	linkNav += addNavLink(videoLink, "Click here to open video");
	linkNav += closeNav();
	
	let gotVideoLink = false;
	document.addEventListener("contextmenu", function(e) {
		if(gotVideoLink) return;
		document.body.outerHTML += linkNav
		gotVideoLink = true;
	}, false)
	
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
