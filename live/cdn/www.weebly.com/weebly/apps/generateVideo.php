<!DOCTYPE html>
<html>
<head><script src="/gdpr/gdprscript.js?buildTime=1790976150"></script>

		<title>Weebly - Create a free website and a free blog</title>

	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

		<meta name="description" content="Weebly makes it surprisingly easy to create a high-quality website, blog or online store. Over 25 million people use Weebly to bring their unique ideas to life." />

		<link rel="stylesheet" type="text/css" href="//cdn2.editmysite.com/css/videojs/video.4.3.css?buildtime=1790976150" />
		<link rel="stylesheet" type="text/css" href="https://cdn2.editmysite.com/fonts/Open_Sans/font.css?2" />
		<link rel="stylesheet" type="text/css" href="//cdn2.editmysite.com/css/video.css?buildtime=1790976150" />

		<script type="text/javascript" src="https://cdn2.editmysite.com/js/jquery-2.1.4.min.js?buildTime=1790976150"></script>
		<script type="text/javascript" src="//cdn1.editmysite.com/libraries/prototype/1.7-custom/prototype.min.js?3"></script>
		<script type="text/javascript" src="//cdn1.editmysite.com/editor/libraries/weebly_utils.js"></script>
		<script type="text/javascript" src="//cdn1.editmysite.com/editor/libraries/weebly_utils_ajax.js"></script>
		<script type="text/javascript" src="//cdn1.editmysite.com/weebly/libraries/videojs/video.4.3.js?buildtime=1790976150"></script>


</head>
<body class="height-282 align-left">
	<script>
	document.createElement('video');document.createElement('audio');
	videojs.options.flash.swf = '//www.weebly.com/weebly/libraries/videojs/video-js.swf?buildTime=1790976150';
</script>
<style type="text/css">
	@font-face {
		font-family: 'ProximaNova';
		src: url('//cdn2.editmysite.com/fonts/Proxima-Light/267447_4_0.eot');
		src: url('//cdn2.editmysite.com/fonts/Proxima-Light/267447_4_0.eot?#iefix') format('embedded-opentype'),
		     url('//cdn2.editmysite.com/fonts/Proxima-Light/267447_4_0.woff') format('woff'),
		     url('//cdn2.editmysite.com/fonts/Proxima-Light/267447_4_0.ttf') format('truetype');
	}
	body {margin: 0px; padding: 0px;}
</style>
<div class="video-js-holder">
	<video id="video-0"  poster="" class="video-js vjs-big-play-centered" style="display: none;">
		<source src="" type="video/mp4" />
	</video>
</div>
<script>
	// Because the iFrame eats the clicks
	if ('') {
		Event.observe(document, 'mouseup', function(e) {
			parent.postMessage({
				type: 'videoClick',
				ucfid: '0'
			}, '*');
		});
	}
	var currVideo = jQuery('.video-js-holder');
	var ie8Mode = false;
	var videoTimeHolder;
	var flashMode = false;
	var videojs = (typeof videojs == 'undefined' ? parent.videojs : videojs);
	// Check for flv videos that didn't get encoded.
	var videoPlayer = videojs("video-0", {
		"controls": true,
		"autoplay": false,
		'techOrder': ['html5','flash'],
		"preload": "none",
		"poster": "",
		"width": 501,
		"height": 282
	}, function(){
		// IE8 won't trigger the video finishing its load and doesn't display background images correctly.
		if (ie8Mode) {
			var actualRatio = currVideo.find('.vjs-poster').width()/currVideo.find('.vjs-poster').height();
			var currImage = currVideo.find('.vjs-poster img');
			var imageRatio = currImage.width()/currImage.height();
	
			if (imageRatio > 1 && imageRatio > actualRatio) {
				currImage.css({
					'width': '100%',
					'height': 'auto'
				});
			}
			else {
				currImage.css({
					'width': 'auto',
					'height': '100%'
				});
			}
			currImage.show();
		}
		else if (currVideo.find('.vjs-using-native-controls').length) {
			currVideo.find('video').show();
		}
		else {
			currVideo.find('.vjs-poster').css({
				'background-image': "url('')",
				'background-repeat': 'no-repeat',
				'background-position': 'center'
			});
		}
	
		currVideo.find('.vjs-seek-handle').append('<div class="vjs-current-time-holder"><div class="vjs-current-time-value">0:00</div></div>');
		videoTimeHolder = currVideo.find('.vjs-current-time-value');
	
		currVideo.find('.vjs-progress-control').css('right', '-=30');
	});
	
	flashMode = videoPlayer.ia == "Flash";
	
	if (flashMode) {
		currVideo.addClass('finished-loading-video');
	}
	
	videoPlayer.on('play', function() {
		currVideo.find('video').show();
		if (currVideo.hasClass('finished-loading-video')) currVideo.find('.vjs-control-bar').show();
	});
	
	// Handles narrow videos where controls don't fit
	videoPlayer.on('pause', function() {
		if (
				currVideo.find('.vjs-control-bar').width() < 300 &&
				!currVideo.find('.video-js').hasClass('vjs-fullscreen')
			) {
	
			currVideo.find('.vjs-big-play-button').one('click', function() {
					jQuery(this).hide();
					videoPlayer.play();
				})
				.show();
		}
	});
	
	videoPlayer.on('timeupdate', function() {
		var currTime = ~~videoPlayer.currentTime();
	
		var hours = ~~(currTime / 3600);
		var minutes = ~~((currTime % 3600) / 60);
		var seconds = currTime % 60;
	
		var finalTime = "";
	
		if (hours) {
		    finalTime += hours + ":" + (minutes < 10 ? "0" : "");
		}
	
		finalTime += minutes + ":" + (seconds < 10 ? "0" : "");
		finalTime += seconds;
		videoTimeHolder.text(finalTime);
	});
	
	// Place control bars in the right places and get rid of loading indicator
	videoPlayer.on('loadedmetadata', function() {
		positionControlBar();
	});
	
	videoPlayer.on('fullscreenchange', function() {
		positionControlBar(currVideo.find('.video-js').hasClass('vjs-fullscreen'));
	});
	
	videoPlayer.on('error', function() {
		currVideo.find('video, .vjs-control-bar').hide();
		currVideo.find('.vjs-loading-spinner').hide();
		currVideo.find('.vjs-poster').show();
		videoPlayer.off();
		currVideo.find('.vjs-big-play-button')
			.addClass('finished-loading-video video-error');
	});
	
	function positionControlBar(isFullScreen) {
		// Flash videos don't give us these attributes and render from CSS
		if (flashMode) return false;
	
		var actualVideo = currVideo.find('video');
		if (isNaN(actualVideo.get(0).videoHeight)) {
			currVideo.find('.vjs-control-bar').hide();
			return false;
		}
	
		var actualWidth = actualVideo.width();
		var actualRatio = actualWidth/currVideo.find('video').height();
		var videoRatio = actualVideo.get(0).videoWidth/actualVideo.get(0).videoHeight;
		var computedBackground = '';
		var computedWidth,
			computedLeft,
			computedBottom;
	
		if (isFullScreen) {
			computedWidth = currVideo.find('.vjs-control-bar').width() >= 400 ? currVideo.find('.vjs-control-bar').width() : 400;
			currVideo.find('.vjs-play-control, .vjs-progress-control, .vjs-download-video').show();
			computedBottom = 0;
			computedLeft = (screen.width - computedWidth)/2,
			computedBackground = 'none';
		}
		else {
			//Place control bar based on orientation of video and how it fits in the frame. This is for wider videos/frames.
			if (videoRatio > 1 && videoRatio > actualRatio) {
				computedWidth = actualWidth;
				computedLeft = 0;
				computedBottom = actualWidth * (actualVideo.get(0).videoHeight/actualVideo.get(0).videoWidth);
				computedBottom = (actualVideo.height() - computedBottom)/2;
			}
			else {
				computedWidth = actualVideo.height() * (actualVideo.get(0).videoWidth/actualVideo.get(0).videoHeight);
				computedLeft = (actualWidth -computedWidth)/2;
				computedBottom = 0;
			}
		}
	
		// Handles narrow videos where all controls don't fit
		if (computedWidth < 300) {
			currVideo.find('.vjs-play-control, .vjs-duration, .vjs-progress-control, .vjs-download-video').hide();
		}
	
		currVideo.find('.vjs-control-bar').css({
			'width': computedWidth,
			'bottom': computedBottom,
			'left': computedLeft,
			'background': computedBackground
		});
	
		if (currVideo.find('.vjs-playing').length) currVideo.find('.vjs-control-bar').show();
	
		currVideo.addClass('finished-loading-video');
	}</script>
	


</body>
</html>