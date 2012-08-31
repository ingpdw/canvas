var nc={setCssText:function(a,b){a.style.cssText=b},extend:function(a,b){for(n in b)void 0!==b[n]&&(a[n]=b[n]);return a},addPx:function(a){isNaN(a)&&(a=0);return a+"px"},integer:function(a){return parseInt(a)},getStyle:function(a,b){return"height"===b&&0!==a.offsetHeight?a.offsetHeight:a.style[b]?a.style[b]:a.currentStyle?a.currentStyle[b]:window.getComputedStyle(a,null)[b]},Animate:function(a,b,c){var d=nc.Animate.queue,e=nc.Animate.animate;this._e=a;this._o=c;if(-1!==d.indexOf(this._e))if(this._o.removePrevAnimate)e[d.indexOf(this._e)].terminate();
else return;d.push(this._e);e.push(this);this.style=this._e.currentStyle?this._e.currentStyle:document.defaultView.getComputedStyle(this._e,null);this._styles=b;this.start=+new Date;this.dur=this._o.duration||300;this.cb=this._o.callback||null;this.curr={};this.easing=this._o.easing||nc.Easing.easeInOut;this.end=this.start+this.dur;for(prop in this._styles)this.curr[prop]=this.style[prop];this.interval=setInterval(function(){var a=+new Date,b;for(prop in this._styles)-1!==nc.Animate.STYLE.indexOf(prop)&&
(b=this.easing(a-this.start,nc.integer(this.curr[prop]),nc.integer(this._styles[prop])-nc.integer(this.curr[prop]),this.dur),"opacity"===prop?(this._e.style[prop]=b,this._e.style.filter="alpha(opacity="+100*b+")"):this._e.style[prop]=nc.addPx(b));a>=this.end&&this.terminate()}.binder(this),1E3/60)}};nc.Animate.queue=[];nc.Animate.animate=[];nc.Animate.STYLE=["width","height","top","left","opacity"];
nc.Animate.prototype.remove=function(){var a=nc.Animate.queue,b=a.indexOf(this._e);-1!==b&&a.splice(b,1)};nc.Animate.prototype.terminate=function(){for(prop in this._styles)this._e.style[prop]=this._styles[prop];clearInterval(this.interval);this.cb&&this.cb();this.remove(this._e)};
nc.Easing={ease:function(a,b,c,d){return c*a/d+b},easeIn:function(a,b,c,d){return c*(a/=d)*a+b},easeIn2:function(a,b,c,d){return c*(a/=d)*a*a*a+b},easeOut:function(a,b,c,d){return-c*(a/=d)*(a-2)+b},easeOut2:function(a,b,c,d){return-c*((a=a/d-1)*a*a*a-1)+b},easeInOut:function(a,b,c,d){return 1>(a/=d/2)?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},bounceIn:function(a,b,c,d){return c-nc.Easing.bounceOut(d-a,0,c,d)+b},bounceOut:function(a,b,c,d){return(a/=d)<1/2.75?c*7.5625*a*a+b:a<2/2.75?c*(7.5625*(a-=1.5/2.75)*
a+0.75)+b:a<2.5/2.75?c*(7.5625*(a-=2.25/2.75)*a+0.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+0.984375)+b},elasticIn:function(a,b,c,d,e,f){if(0==a)return b;if(1==(a/=d))return b+c;f||(f=0.3*d);!e||e<Math.abs(c)?(e=c,c=f/4):c=f/(2*Math.PI)*Math.asin(c/e);return-(e*Math.pow(2,10*(a-=1))*Math.sin((a*d-c)*2*Math.PI/f))+b},elasticOut:function(a,b,c,d,e,f){if(0==a)return b;if(1==(a/=d))return b+c;f||(f=0.3*d);if(!e||e<Math.abs(c))var e=c,g=f/4;else g=f/(2*Math.PI)*Math.asin(c/e);return e*Math.pow(2,-10*a)*Math.sin((a*
d-g)*2*Math.PI/f)+c+b}};nc.Event=function(a,b,c){this._node=a;this.type=b;this.handler=c};nc.Event.prototype.remove=function(){nc.Event.removeListener(this._node,this.type,this.handler);this._node=this.handler=void 0};nc.Event.addListener=function(a,b,c){"mousewheel"===b&&nc.isFF&&(b="DOMMouseScroll");a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c);return new nc.Event(a,b,c)};
nc.Event.removeListener=function(a,b,c){a&&(a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent("on"+b,c))};nc.Event.preventDefault=function(a){a=a||window.event;a.preventDefault?a.preventDefault():a.returnValue=!1};nc.Event.stopPropagation=function(a){a=a||window.event;a.stopPropagation?a.stopPropagation():a.cancelBubble=!0};
nc.Canvas=function(a,b){this._panel;this._parent=a instanceof Object?a:document.getElementById(a);this.opts={fillStyle:"#398ea5",lineWidth:2,strokeStyle:"#99cc00",alpha:1,currPoint:{x:0,y:0},pos:{x:0,y:0},size:{w:300,h:150}};nc.extend(this.opts,b);this._init()};
nc.Canvas.prototype={_init:function(){var a=this.opts;this._panel=document.createElement("canvas");this._panel.style.position="absolute";this.setSize(a.size.w,a.size.h);this.setPosition(a.pos.x,a.pos.y);this._parent.appendChild(this._panel);if(!this._panel.getContext)throw Error("canvas\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\ub294 \ube0c\ub77c\uc6b0\uc800\uc785\ub2c8\ub2e4.");},_parentSizeAndPos:function(){var a=this.opts,b=this._parent.style;b.position="relative";b.overflow="hidden";b.width=nc.addPx(a.size.w);
b.height=nc.addPx(a.size.h);b.top=nc.addPx(a.pos.y);b.left=nc.addPx(a.pos.x)},_getCtx:function(){return this._panel.getContext("2d")},_getParent:function(){return this._parent},getPanel:function(){return this._panel},appendTo:function(a){a.appendChild(this._panel);return this},remove:function(){this._panel&&this._panel.parentNode.removeChild(this._panel);this._panel=null},setSize:function(a,b){if(!a&&b)return this;var c=this.opts.size={w:a,h:b},d=c.w,c=c.h;this._panel.width=d;this._panel.height=c;
this._panel.style.width=nc.addPx(d);this._panel.style.height=nc.addPx(c);this._parentSizeAndPos();return this},getSize:function(){return this.opts.size},lineWeight:function(a){this.opts.lineWidth=a;return this},lineColor:function(a){this.opts.strokeStyle=a;return this},bgColor:function(a){if(!a)return this;this.opts.color=a;this._panel.style.backgroundColor=a;return this},color:function(a){this.opts.fillStyle=a;return this},alpha:function(a){this.opts.alpha=a;return this},setPosition:function(a,b){var c=
this.opts.pos={x:a,y:b},d=c.y;this._panel.style.left=nc.addPx(c.x);this._panel.style.top=nc.addPx(d);this._parentSizeAndPos();return this},setDrawImage:function(a,b,c,d,e,f){var g=new Image,h=this;nc.Event.addListener(g,"load",function(){h._getCtx().drawImage(g,b,c,d,e);f&&f()});g.src=a;return this},getPosition:function(){return{x:this._panel.style.left,y:this._panel.style.top}},_getCurrStyle:function(){var a={},b=this.opts;a.lineWidth=b.lineWidth;a.strokeStyle=b.strokeStyle;a.fillStyle=b.fillStyle;
a.alpha=b.alpha;return a},_setEvent:function(){},_setCurrPoint:function(a){this.opts.currPoint=a},_drawRect:function(a){a.parent=this._getParent();a.ctx=this._getCtx();nc.extend(a,this._getCurrStyle());new nc.Rect(a);return this},_drawLine:function(a){var b=this.opts;a.ctx=this._getCtx();nc.extend(a,this._getCurrStyle());a.px=b.currPoint.x;a.py=b.currPoint.y;new nc.Line(a);this._setCurrPoint({x:a.x,y:a.y});return this},_drawText:function(a){a.parent=this._getParent();a.ctx=this._getCtx();nc.extend(a,
this._getCurrStyle());new nc.Text(a);return this},_drawCircle:function(a){a.parent=this._getParent();a.ctx=this._getCtx();nc.extend(a,this._getCurrStyle());new nc.Circle(a);return this},moveTo:function(a,b){this._setCurrPoint({x:a,y:b});return this},lineTo:function(a,b){this._drawLine({x:a,y:b});return this},circle:function(a,b,c,d,e,f){this._drawCircle({cx:a,cy:b,r:c,s:d,e:e,handler:f});return this},strokeRect:function(a,b,c,d,e){this._drawRect({x:a,y:b,w:c,h:d,type:"stroke",handler:e});return this},
rect:function(a,b,c,d,e){this._drawRect({x:a,y:b,w:c,h:d,handler:e});return this},text:function(a,b,c,d,e,f,g){this._drawText({msg:a,x:b,y:c,fontSize:e,fontFamily:d,fontWeight:f,handler:g});return this},text2:function(a,b,c,d,e){this._drawText({msg:a,x:b,y:c,fontSize:d.fontSize,fontFamily:d.family,fontWeight:d.weight,handler:e});return this}};NcCanvas=function(a,b){return new nc.Canvas(a,b)};nc.Shape=function(){};
nc.Shape.prototype={_eventList:["click","mouseover","mouseout"],_init:function(){},_draw:function(){},setColor:function(){},getColor:function(){},_setStyle:function(a,b){a.fillStyle=b.fillStyle;a.strokeStyle=b.strokeStyle;a.lineWidth=b.lineWidth;a.alpha=b.alpha},_addEvent:function(a){if(a&&(a.click||a.mouseover||a.mouseout))for(var b=0;this._eventList[b];b++)a[this._eventList[b]]&&(nc.Event.addListener(this._panel,this._eventList[b],a[this._eventList[b]]),this._panel.style.cursor="pointer")},_setSize:function(a,
b){if(!a&&b)return this;var c=this.opts.size={w:a,h:b},d=c.w,c=c.h;this._panel.width=d;this._panel.height=c;this._panel.style.width=nc.addPx(d);this._panel.style.height=nc.addPx(c);return this},_setPos:function(a,b){var c=this.opts.pos={x:a,y:b},d=c.y;this._panel.style.left=nc.addPx(c.x);this._panel.style.top=nc.addPx(d);return this},appendTo:function(a){a&&a.appendChild(this._panel)}};
nc.Rect=function(a){this._panel;this.opts={type:"fill",fillStyle:"#398ea5",lineWidth:2,strokeStyle:"#99cc00",alpha:1,w:100,h:10,x:0,y:0,nCanvas:!0,ctx:null,parent:null,click:null,mouseover:null,mouseout:null};nc.extend(this.opts,a);this._init();this._addEvent({click:this.opts.click});this._addEvent({mouseover:this.opts.mouseover});this._addEvent({mouseout:this.opts.mouseout})};nc.Rect.prototype=new nc.Shape;nc.Rect.prototype._init=function(){this._draw();this.opts.parent&&this.opts.nCanvas&&this.appendTo(this.opts.parent)};
nc.Rect.prototype._draw=function(){var a=this.opts,b;a.nCanvas?(this._panel=document.createElement("canvas"),this.opts.nCanvas&&(this._panel.style.position="absolute"),this._setSize(a.w,a.h),this._setPos(a.x,a.h),this._panel.style.left=a.x?nc.addPx(a.x):0,this._panel.style.top=a.y?nc.addPx(a.y):0,b=this._panel.getContext("2d"),this._setStyle(b,a),"fill"===a.type?b.fillRect(0,0,a.w,a.h):b.strokeRect(0,0,a.w,a.h)):(a.ctx.fillStyle=a.color,a.ctx.fillRect(a.x,a.y,a.w,a.h))};
nc.Line=function(a){this._panel;this.opts={fillStyle:"#398ea5",lineWidth:2,strokeStyle:"#99cc00",alpha:1,px:100,py:100,x:100,y:100,nCanvas:!1,ctx:null};nc.extend(this.opts,a);this._init()};nc.Line.prototype=new nc.Shape;nc.Line.prototype._init=function(){this._draw()};
nc.Line.prototype._draw=function(){var a=this.opts,b;a.nCanvas||(b=this.opts.ctx,b.fillStyle=a.color,b.strokeStyle=a.strokeStyle,b.lineWidth=a.lineWidth,b.alpha=a.alpha,b.beginPath(),b.moveTo(this.opts.px,this.opts.py),b.lineTo(this.opts.x,this.opts.y),b.closePath(),b.stroke())};
nc.Text=function(a){this._panel;this.opts={fillStyle:"#398ea5",lineWidth:2,strokeStyle:"#99cc00",alpha:1,fontSize:12,fontFamily:"dotum",fontWeight:"bold",x:100,y:12,w:100,h:20,msg:"helloworld",nCanvas:!0,ctx:null,parent:null,click:null,over:null,out:null};nc.extend(this.opts,a);this.opts.font=this.opts.fontWeight+" "+this.opts.fontSize+"px "+this.opts.fontFamily;this._init();this._addEvent({click:this.opts.click});this._addEvent({over:this.opts.over});this._addEvent({out:this.opts.out})};
nc.Text.prototype=new nc.Shape;nc.Text.prototype._init=function(){this._draw();this.opts.parent&&this.opts.nCanvas&&this.appendTo(this.opts.parent)};
nc.Text.prototype._draw=function(){var a=this.opts,b,c;a.nCanvas?(this._panel=document.createElement("canvas"),this.opts.nCanvas&&(this._panel.style.position="absolute"),this._setPos(a.x,a.h),this._panel.style.left=a.x?nc.addPx(a.x):0,this._panel.style.top=a.y?nc.addPx(a.y):0,b=this._panel.getContext("2d"),this._setStyle(b,a),b.font=a.font,b.textBaseline="bottom",c=b.measureText(a.msg),c=c.width,this._setSize(c,21),this._setStyle(b,a),b.font=a.font,b.textBaseline="bottom",b.fillText(a.msg,0,a.fontSize)):
(a.ctx.fillStyle=a.color,a.ctx.fillText(a.msg,a.x,a.y))};nc.Rect.prototype.appendTo=function(a){a&&a.appendChild(this._panel)};
nc.Circle=function(a){this._panel;this.opts={fillStyle:"#398ea5",lineWidth:2,strokeStyle:"#99cc00",alpha:1,cx:0,cy:0,r:100,s:0,e:0,w:0,h:0,x:0,y:0,nCanvas:!0,ctx:null,parent:null,click:null,mouseover:null,mouseout:null};nc.extend(this.opts,a);this.opts.w=this.opts.h=2*this.opts.r+2*this.opts.lineWidth;this.opts.x=this.opts.cx-this.opts.r-this.opts.lineWidth;this.opts.y=this.opts.cy-this.opts.r-this.opts.lineWidth;this.opts.cx=this.opts.cy=this.opts.r+this.opts.lineWidth;this._init();this._addEvent({click:this.opts.handler&&
this.opts.handler.click});this._addEvent({mouseover:this.opts.handler&&this.opts.handler.mouseover});this._addEvent({mouseout:this.opts.handler&&this.opts.handler.mouseout})};nc.Circle.prototype=new nc.Shape;nc.Circle.prototype._init=function(){this._draw();this.opts.parent&&this.opts.nCanvas&&this.appendTo(this.opts.parent)};
nc.Circle.prototype._draw=function(){var a=this.opts,b,c,d;a.nCanvas&&(this._panel=document.createElement("canvas"),this.opts.nCanvas&&(this._panel.style.position="absolute"),this._setSize(a.w,a.h),this._setPos(a.x,a.h),this._panel.style.left=a.x?nc.addPx(a.x):0,this._panel.style.top=a.y?nc.addPx(a.y):0,b=this._panel.getContext("2d"),this._setStyle(b,a),c=a.s*Math.PI/180,d=a.e*Math.PI/180,b.beginPath(),0==a.s&&360==a.e||b.moveTo(a.cx,a.cy),b.arc(a.cx,a.cy,a.r,c,d,!1),b.closePath(),b.fill(),a.lineWidth&&
b.stroke())};nc.Layer=function(){this._panel=document.createElement("div");this._panel.style.position="absolute";this._panel.className="priceLayer";this._msgPanel=document.createElement("span");this._msgPanel.className="price";this._panel.appendChild(this._msgPanel);document.getElementById("cvs").appendChild(this._panel);this.hide()};
nc.Layer.prototype={show:function(){this._panel.style.display="block";this._panel.style.opacity=0;$(this._panel).animate({opacity:1},500)},hide:function(){this._panel.style.display="none"},pos:function(a){a&&(this._panel.style.top=nc.addPx(a.y),this._panel.style.left=nc.addPx(a.x))},showMsg:function(a,b,c){this._msgPanel.innerHTML=a;this.pos({x:b,y:c});this.show()}};