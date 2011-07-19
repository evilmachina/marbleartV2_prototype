(function($){
	$.fn.tinycircleslider = function(options){
		var defaults = { 
			radius: 140, // Used to determine the size of the circleslider
			callback: null, // function that executes after every move
			startAngle: 0
		};
		var options = $.extend(defaults, options);
	
		var oCircle = $(this);
		var oCircleX = oCircle.outerWidth();
		var oCircleY = oCircle.outerHeight();
		var oThumb = $('.thumb', oCircle)[0];
		var oThumbX = $(oThumb).outerWidth();
		var oThumbY = $(oThumb).outerHeight();
		var oOverview = $('.overview', oCircle);
	    var iOrginalAngle = options.orginalAngle;
		var iDegrees = 0;
	    
		this.each(function(){
		            function setPossision(degree){
							console.log("set poss " + degree);
							iDegrees = degree;
							var angle = degree * (Math.PI/180);
							oThumb.style.top = Math.round(-Math.cos(angle) * options.radius + (oCircleY /2 - oThumbY /2)) + 'px';
							oThumb.style.left = Math.round(Math.sin(angle) * options.radius + (oCircleX /2 - oThumbX /2)) + 'px';
					}
		            $.fn.tinycircleslider.externalsetPossision = function(degree) {
		                setPossision(degree);
		            }
		        });
	
		
	
	    return this.each(function(){
			initialize();
		
		});
			
			function initialize(){
				//	setPossision(options.startAngle);
				setEvents();
			};
			function setEvents(){
				oThumb.onmousedown = start;
				oThumb.ontouchstart = function(oEvent){
					oEvent.preventDefault();
					oThumb.onmousedown = null;
					start(oEvent);
					return false;
				}
			};	
			function start(oEvent){
					$(document).mousemove(drag);
					document.ontouchmove = function(oEvent){
						$(document).unbind('mousemove');
						drag(oEvent);
					};
					document.onmouseup = oThumb.onmouseup = end;
					oThumb.ontouchend = document.ontouchend = function(oEvent){
						document.onmouseup = oThumb.onmouseup = null;
						end(oEvent);
					}
					return false;
			};
			function end(oEvent){
				$(document).unbind('mousemove');
				document.ontouchmove = document.ontouchend = document.onmouseup = oThumb.onmouseup = oThumb.ontouchend = null;
				return false;
			};
			function drag(oEvent){
				oEvent.preventDefault();
				if(typeof(oEvent.touches) != 'undefined' && oEvent.touches.length == 1){ 
				    var oEvent = oEvent.touches[0]; 
				}
				var oPos = {
					x: oEvent.pageX - oCircle.offset().left - (oCircleX / 2),
					y: oEvent.pageY - oCircle.offset().top - (oCircleY / 2)
				}
				
				iOrginalAngle = Math.atan2(oPos.x, -oPos.y);
				moved(iOrginalAngle);
				
				
				return false;
			};
			
			function moved(angle){
				var newDegrees = Math.round( angle * 180 / Math.PI);
				newDegrees = newDegrees < 0 ? newDegrees +360 : newDegrees;
				
				var moved = newDegrees - iDegrees; 
				
				if((moved >= 0 && moved < 10) || moved < -350)
				{
					angle = newDegrees * (Math.PI/180);
					
					iDegrees = iDegrees === 360 ? 0: iDegrees + 1;
					
					if(typeof options.callback == 'function')options.callback.call(this, iDegrees);
				}
			};
			
			
		  
	};
})(jQuery);