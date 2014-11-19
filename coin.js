/**

MetalMusicCoin Donations are welcome:
	MTLMC: MkB6Pa3tCFE6TX9Mt8e4bCKvN7aQbAD4JY
------------

MIT License (MIT)

Copyright (c) 2013 http://coinwidget.com/ 
Copyright (c) 2013 http://scotty.cc/
Copyright (c) 2014 http://sxcdonate.com
Copyright (c) 2014 http://mtlmcdonate.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

if (typeof MTLMCDonateComCounter != 'number')
var MTLMCDonateComCounter = 0;

if (typeof MTLMCDonateCom != 'object')
var MTLMCDonateCom = {
	source: 'http://mtlmcdonation.metalmusiccoin.pw/widget/'
	, config: []
	, go :function(config) {
		config = MTLMCDonateCom.validate(config);
		MTLMCDonateCom.config[MTLMCDonateComCounter] = config;
		MTLMCDonateCom.loader.jquery();
		document.write('<span data-coinwidget-instance="'+MTLMCDonateComCounter+'" class="MTLMCDONATECOM_CONTAINER"></span>');
		MTLMCDonateComCounter++;
	}
	, validate: function(config) {
		var $accepted = [];
		$accepted['currencies'] = ['MetalMusicCoin'];
		$accepted['counters'] = ['count','amount','hide'];
		$accepted['alignment'] = ['al','ac','ar','bl','bc','br'];
		if (!config.currency || !MTLMCDonateCom.in_array(config.currency,$accepted['currencies']))
			config.currency = 'MetalMusicCoin';
		if (!config.counter || !MTLMCDonateCom.in_array(config.counter,$accepted['counters']))
			config.counter = 'count';
		if (!config.alignment || !MTLMCDonateCom.in_array(config.alignment,$accepted['alignment']))
			config.alignment = 'bl';
		if (typeof config.qrcode != 'boolean')
			config.qrcode = true;
		if (typeof config.auto_show != 'boolean')
			config.auto_show = false;
		if (!config.wallet_address)
			config.wallet_address = 'My '+ config.currency +' wallet_address is missing!';
		if (!config.lbl_button) 
			config.lbl_button = 'Donate';
		if (!config.lbl_address)
			config.lbl_address = 'My MetalMusicCoin Address:';
		if (!config.lbl_count)
			config.lbl_count = 'Donation';
		if (!config.lbl_amount)
			config.lbl_amount = 'MTLMC';
		if (typeof config.decimals != 'number' || config.decimals < 0 || config.decimals > 10)
			config.decimals = 4;

		return config;
	}
	, init: function(){
		MTLMCDonateCom.loader.stylesheet();
		jQuery(window).resize(function(){
			MTLMCDonateCom.window_resize();
		});
		setTimeout(function(){
			/* this delayed start gives the page enough time to 
			   render multiple widgets before pinging for counts.
			*/
			MTLMCDonateCom.build();
		},800);		
	}
	, build: function(){
		$containers = jQuery("span[data-coinwidget-instance]");
		$containers.each(function(i,v){
			$config = MTLMCDonateCom.config[jQuery(this).attr('data-coinwidget-instance')];
			$counter = $config.counter == 'hide'?'':('<span><img src="'+MTLMCDonateCom.source+'icon_loading.gif" width="13" height="13" /></span>');
			$button = '<a class="MTLMCDONATECOM_BUTTON_'+$config.currency.toUpperCase()+'" href="#"><img src="'+MTLMCDonateCom.source+'icon_'+$config.currency+'.png" /><span>'+$config.lbl_button+'</span></a>'+$counter;
			jQuery(this).html($button);
			jQuery(this).find('> a').unbind('click').click(function(e){
				e.preventDefault();
				MTLMCDonateCom.show(this);
			});
		});
		MTLMCDonateCom.counters();
	}
	, window_resize: function(){
		jQuery.each(MTLMCDonateCom.config,function(i,v){
			MTLMCDonateCom.window_position(i);
		});
	}
	, window_position: function($instance){
		$config = MTLMCDonateCom.config[$instance];
		coin_window = "#MTLMCDONATECOM_WINDOW_"+$instance;

			obj = "span[data-coinwidget-instance='"+$instance+"'] > a";
			/* 	to make alignment relative to the full width of the container instead 
			of just the button change this occurence of jQuery(obj) to jQuery(obj).parent(), 
			do the same for the occurences within the switch statement. */
			$pos = jQuery(obj).offset(); 
			switch ($config.alignment) {
				default:
				case 'al': /* above left */
					$top = $pos.top - jQuery(coin_window).outerHeight() - 10;
					$left = $pos.left; 
					break;
				case 'ac': /* above center */
					$top = $pos.top - jQuery(coin_window).outerHeight() - 10;
					$left = $pos.left + (jQuery(obj).outerWidth()/2) - (jQuery(coin_window).outerWidth()/2);
					break;
				case 'ar': /* above right */
					$top = $pos.top - jQuery(coin_window).outerHeight() - 10;
					$left = $pos.left + jQuery(obj).outerWidth() - jQuery(coin_window).outerWidth();
					break;
				case 'bl': /* bottom left */
					$top = $pos.top + jQuery(obj).outerHeight() + 10;
					$left = $pos.left; 
					break;
				case 'bc': /* bottom center */
					$top = $pos.top + jQuery(obj).outerHeight() + 10;
					$left = $pos.left + (jQuery(obj).outerWidth()/2) - (jQuery(coin_window).outerWidth()/2);
					break;
				case 'br': /* bottom right */
					$top = $pos.top + jQuery(obj).outerHeight() + 10;
					$left = $pos.left + jQuery(obj).outerWidth() - jQuery(coin_window).outerWidth();
					break;
			}
		if (jQuery(coin_window).is(':visible')) {
			jQuery(coin_window).stop().animate({'z-index':99999999999,'top':$top,'left':$left},150);
		} else {
			jQuery(coin_window).stop().css({'z-index':99999999998,'top':$top,'left':$left});
		}
	}
	, counter: []
	, counters: function(){
		$addresses = [];
		jQuery.each(MTLMCDonateCom.config,function(i,v){
			$instance = i;
			$config = v;
			if ($config.counter != 'hide')
				$addresses.push($instance+'_'+$config.currency+'_'+$config.wallet_address);
			else {
				if ($config.auto_show) 
					jQuery("span[data-coinwidget-instance='"+i+"']").find('> a').click();
			}
		});
		if ($addresses.length) {
			MTLMCDonateCom.loader.script({
				id: 'MTLMCDONATECOM_INFO'+Math.random()
				, source: (MTLMCDonateCom.source+'lookup.php?data='+$addresses.join('|'))
				, callback: function(){
					if (typeof MTLMCDONATECOM_DATA == 'object') {
						MTLMCDonateCom.counter = MTLMCDONATECOM_DATA;
						jQuery.each(MTLMCDonateCom.counter,function(i,v){
							$config = MTLMCDonateCom.config[i];
							if (!v.count ||v == null) v = {count:0,amount:0};
							jQuery("span[data-coinwidget-instance='"+i+"']").find('> span').html($config.counter=='count'?v.count:(v.amount.toFixed($config.decimals)+' '+$config.lbl_amount));
							if ($config.auto_show) {
								jQuery("span[data-coinwidget-instance='"+i+"']").find('> a').click();
							}
						});
					}
					if (jQuery("span[data-coinwidget-instance] > span img").length > 0) {
						setTimeout(function(){MTLMCDonateCom.counters();},2500);
					}
				}
			});
		}
	}
	, show: function(obj) {
		$instance = jQuery(obj).parent().attr('data-coinwidget-instance');
		$config = MTLMCDonateCom.config[$instance];
		coin_window = "#MTLMCDONATECOM_WINDOW_"+$instance;
		jQuery(".MTLMCDONATECOM_WINDOW").css({'z-index':99999999998});
		if (!jQuery(coin_window).length) {

			$sel = !navigator.userAgent.match(/iPhone/i)?'onclick="this.select();"':'onclick="prompt(\'Select all and copy:\',\''+$config.wallet_address+'\');"';

			$html = ''
				  + '<label>'+$config.lbl_address+'</label>'
				  + '<input type="text" readonly '+$sel+'  value="'+$config.wallet_address+'" />'
				  + '<a class="MTLMCDONATECOM_CREDITS" href="http://mtlmcdonation.metalmusiccoin.pw/" target="_blank">mtlmcdonation.metalmusiccoin.pw/</a>'
  				  + '<a class="MTLMCDONATECOM_WALLETURI" href="'+$config.currency.toLowerCase()+':'+$config.wallet_address+'" target="_blank" title="Click here to send this address to your wallet (if your wallet is not compatible you will get an empty page, close the white screen and copy the address by hand)" ><img src="'+MTLMCDonateCom.source+'icon_wallet.png" /></a>'
  				  + '<a class="MTLMCDONATECOM_CLOSER" href="javascript:;" onclick="MTLMCDonateCom.hide('+$instance+');" title="Close this window">x</a>'
  				  + '<img class="COINWIDGET_INPUT_ICON" src="'+MTLMCDonateCom.source+'icon_'+$config.currency+'.png" width="16" height="16" title="This is a '+$config.currency+' wallet address." />'
				  ;
			if ($config.counter != 'hide') {
				$html += '<span class="MTLMCDONATECOM_COUNT">0<small>'+$config.lbl_count+'</small></span>'
				  	  + '<span class="MTLMCDONATECOM_AMOUNT end">0.00<small>'+$config.lbl_amount+'</small></span>'
				  	  ;				  
			}
			if ($config.qrcode) {
				$html += '<img class="MTLMCDONATECOM_QRCODE" data-coinwidget-instance="'+$instance+'" src="'+MTLMCDonateCom.source+'icon_qrcode.png" width="16" height="16" />'
				  	   + '<img class="MTLMCDONATECOM_QRCODE_LARGE" src="'+MTLMCDonateCom.source+'icon_qrcode.png" width="111" height="111" />'
				  	   ;
			}
			var $div = jQuery('<div></div>');
			jQuery('body').append($div);
			$div.attr({
				'id': 'MTLMCDONATECOM_WINDOW_'+$instance
			}).addClass('MTLMCDONATECOM_WINDOW MTLMCDONATECOM_WINDOW_'+$config.currency.toUpperCase()+' MTLMCDONATECOM_WINDOW_'+$config.alignment.toUpperCase()).html($html).unbind('click').bind('click',function(){
				jQuery(".MTLMCDONATECOM_WINDOW").css({'z-index':99999999998});
				jQuery(this).css({'z-index':99999999999});
			});
			if ($config.qrcode) {
				jQuery(coin_window).find('.MTLMCDONATECOM_QRCODE').bind('mouseenter click',function(){
					$config = MTLMCDonateCom.config[jQuery(this).attr('data-coinwidget-instance')];
					$lrg = jQuery(this).parent().find('.MTLMCDONATECOM_QRCODE_LARGE');
					if ($lrg.is(':visible')) {
						$lrg.hide();
						return;
					}
					$lrg.attr({
						src: MTLMCDonateCom.source +'qr/?address='+$config.wallet_address
					}).show();
				}).bind('mouseleave',function(){
					$lrg = jQuery(this).parent().find('.MTLMCDONATECOM_QRCODE_LARGE');
					$lrg.hide();
				});
			}
		} else {
			if (jQuery(coin_window).is(':visible')) {
				MTLMCDonateCom.hide($instance);
				return;
			}
		}
		MTLMCDonateCom.window_position($instance);
		jQuery(coin_window).show();
		$pos = jQuery(coin_window).find('input').position();
		jQuery(coin_window).find('img.COINWIDGET_INPUT_ICON').css({'top':$pos.top+3,'left':$pos.left+3});
		jQuery(coin_window).find('.MTLMCDONATECOM_WALLETURI').css({'top':$pos.top+3,'left':$pos.left+jQuery(coin_window).find('input').outerWidth()+3});
		if ($config.counter != 'hide') {
			$counters = MTLMCDonateCom.counter[$instance];
			if ($counters == null) {
				$counters = {
					count: 0,
					amount: 0
				};
			}
		 	if ($counters.count == null) $counters.count = 0;
		 	if ($counters.amount == null) $counters.amount = 0;
			jQuery(coin_window).find('.MTLMCDONATECOM_COUNT').html($counters.count+ '<small>'+$config.lbl_count+'</small>');
			jQuery(coin_window).find('.MTLMCDONATECOM_AMOUNT').html($counters.amount.toFixed($config.decimals)+ '<small>'+$config.lbl_amount+'</small>');
		}
		if (typeof $config.onShow == 'function') 
			$config.onShow();
	}
	, hide: function($instance) {
		$config = MTLMCDonateCom.config[$instance];
		coin_window = "#MTLMCDONATECOM_WINDOW_"+$instance;
		jQuery(coin_window).fadeOut();
		if (typeof $config.onHide == 'function') {
			$config.onHide();
		}
	}
	, in_array: function(needle,haystack) {
		for (i=0;i<haystack.length;i++) {
			if (haystack[i] == needle) { 
				return true;
			}
		}
		return false;
	}
	, loader: {
		loading_jquery: false,
		script: function(obj){
			if (!document.getElementById(obj.id)) {
				var x = document.createElement('script');
				x.onreadystatechange = function(){
					switch (this.readyState) {
						case 'complete':
						case 'loaded':
							obj.callback();
							break;
					}
				};
				x.onload = function(){
					obj.callback();
				};
				x.src = obj.source;
				x.id  = obj.id;
				document.lastChild.appendChild(x);
			}
		}
		, stylesheet_loaded: false
		, stylesheet: function(){
			if (!MTLMCDonateCom.loader.stylesheet_loaded) {
				MTLMCDonateCom.loader.stylesheet_loaded = true;
				var $link = jQuery('<link/>');
				jQuery("head").append($link);
				$link.attr({
					id 		: 'MTLMCDONATECOM_STYLESHEET'
					, rel 	: 'stylesheet'
					, type 	: 'text/css'
					, href 	: MTLMCDonateCom.source+'coin.css'
				});
			}
		}
		, jquery: function(){
			if (!window.jQuery && !MTLMCDonateCom.loader.loading_jquery) {
				$prefix = window.location.protocol=='file:'?'http:':'';
				MTLMCDonateCom.loader.script({
					id			: 'MTLMCDONATECOM_JQUERY'
					, source 	: $prefix + '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
					, callback  : function(){
						MTLMCDonateCom.init();
					}
				});
				return;
			}
			MTLMCDonateCom.init();
		}
	}
};