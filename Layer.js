		nc.Layer = function(){
			this._panel = document.createElement('div');
			this._panel.style.position = 'absolute';
			this._panel.className = 'priceLayer';
			
			this._msgPanel = document.createElement('span');
			this._msgPanel.className = 'price';
			
			this._panel.appendChild(this._msgPanel);
			document.getElementById('cvs').appendChild(this._panel);
			
			this.hide();
		};
		nc.Layer.prototype = {
			show: function(){
				this._panel.style.display = 'block';
				this._panel.style.opacity = 0;
				$(this._panel).animate({opacity: 1}, 500);
			},
			hide: function(){
				this._panel.style.display = 'none';
			},
			pos: function(pos){
				if(!pos) return;
				this._panel.style.top = nc.addPx(pos.y);
				this._panel.style.left = nc.addPx(pos.x);
			},
			showMsg: function(msg, x, y){
				this._msgPanel.innerHTML = msg;
				this.pos({x: x, y: y});
				this.show();
			}
		};
