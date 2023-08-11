export const openWindow = (url: string) => {
	const width = 500,
		height = 650,
		dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX,
		dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY,
		screenWidth = window.innerWidth
			? window.innerWidth
			: document.documentElement.clientWidth
			? document.documentElement.clientWidth
			: screen.width,
		screenHeight = window.innerHeight
			? window.innerHeight
			: document.documentElement.clientHeight
			? document.documentElement.clientHeight
			: screen.height,
		left = screenWidth / 2 - width / 2 + dualScreenLeft,
		top = screenHeight / 2 - height / 2 + dualScreenTop;
	// Open window to authenticate
	window.open(url, "_blank", `popup=1, width=${width}, height=${height}, top=${top}, left=${left}`);
};
