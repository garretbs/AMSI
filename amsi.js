var urlName = document.URL
var urlSplit = urlName.split('/')
var pageName = urlSplit.pop()
//var pageSplit = pageName.split('.')
//var fileType = pageSplit[pageSplit.length-1]

//Get max res Tumblr image (1280 as of version 1.0)
//console.log = function(){}
if(/tumblr\.com/i.test(document.domain)){
	console.log("Tumblr!")
	if((!/_1280\.(png|gif|jpg)$/.test(pageName))){ //so we don't constantly reload
		document.location.href = urlName.replace(/_\d+\.(png|gif|jpg)$/, "_1280.$1")
	}
}
//Get max res twimg image
else if(/pbs\.twimg\.com/i.test(document.domain)){
	console.log("Twimg!")
	if(/profile_images/.test(urlName)){ //if profile image
		console.log("Profile image")
		if(/_\d+x\d+/.test(pageName)){
			urlName = urlName.replace(/_\d+x\d+/i, "")
			document.location.href = urlName
		}
	}else if((!/:orig$/i.test(pageName))){ //if not already an :orig image
		console.log("Regular image")
		urlName = urlName.replace(/:large$/i, "")
		urlName += ":orig"
		document.location.href = urlName
	}else{
		console.log("Unknown twimg image type?")
	}
}
//Get max res instagram image when right click
else if(/instagram\.com/i.test(urlName)){
	console.log("Instagram!")
	//small image starts with "display_resources":[{"src":"small_image_url",
	//large image is <meta property="og:image" content="large_image_url" />
	//console.log("Instagram!")
	document.addEventListener("contextmenu", function(e){
		document.location.href = document.querySelector('meta[property="og:image"]').content
	}, false)
	//window.open(largePicUrl, '_blank')
	//var smallPicData
	//console.log(largePicUrl)
}else{
	console.log("Unknown site: " + document.domain)
}