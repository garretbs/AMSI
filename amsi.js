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
	console.log("Instagram!")
	
	const urlRegex = /\{\"candidates\":\[\{\"width":\d+,\"height\":\d+,\"url\":\"([^"]+)\"\}/
	// Must match above, plus global flag
	const globalUrlRegex = /\{\"candidates\":\[\{\"width":\d+,\"height\":\d+,\"url\":\"([^"]+)\"\}/g
	let imageUrls = document.body.outerHTML.match(globalUrlRegex)
	let linkNav = `<header style="position: absolute; top:0; background-color: #111111; width: 100%; text-align: center; z-index: 9999; padding-bottom: 1em; padding-top: 1em;">`
	let index = 1;
	imageUrls.forEach(imageUrl => {
			let urlMatch = urlRegex.exec(imageUrl)[1];
			urlMatch = urlMatch.split("\\u0026").join("&");
			linkNav += `<a href="${urlMatch}" target="_blank">Click here to open image ${index++}</a>`;
		}
	)
	linkNav += `</header>`
	
	// Let the user call the links manually because:
	// 	a) It's somewhat obstructive to the page's content
	// 	b) Instagram will refuse to load if you muck with the page before it's done
	let gotImageLinks = false;
	document.addEventListener("contextmenu", function(e) {
		if(gotImageLinks) return;
		document.body.outerHTML += linkNav
		gotImageLinks = true;
	}, false)
}else if (/cdn.okccdn.com/i.test(urlName)){
	console.log("OK Cupid CDN")
	if(/400x400/i.test(urlName)){
		urlName = urlName.replace(/400x400\/400x400\/([^/])+\/([^/]+)/i, "$2/$2/$1/$2")
		replaceImage(urlName)
	}
}else{
	console.log("Unknown site: " + document.domain)
}
