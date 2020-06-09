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
	const displayUrl = /\"display_url\":\"([^"]+)\"/
	let imageUrl = displayUrl.exec(document.body.outerHTML)[1]
	imageUrl = imageUrl.split("\\u0026").join("&")
	document.addEventListener("contextmenu", function(e){
		replaceImage(imageUrl)
	}, false)
}else{
	console.log("Unknown site: " + document.domain)
}
