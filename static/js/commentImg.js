(function($){
	$.fn.commentImg = function(options){
		var defaults = {
			activeClass: 'current',
			imgNavBox:'.photos-thumb',
			imgViewBox:'.photo-viewer'
		};
		var opts = $.extend({},defaults, options);

		this.each(function(){
			var _this =$(this),
				imgNav =_this.find(opts.imgNavBox).children(),
				imgViewBox =_this.find(opts.imgViewBox),
				src = '',
				img = new Image();
				
			function setViewImg(viewSrc){
				img.src = viewSrc;
	            img.onload = function () {
	                               
	                imgViewBox.show(0,function(){
	                	$(this).css({ "width": "100%", "height": "auto" }).find("img").attr('src', src);
	                });					
	            }	            
			}
			imgViewBox.hide();
			imgNav.on("click",function(){
				$(this).toggleClass(opts.activeClass).siblings().removeClass(opts.activeClass);			
				if($(this).hasClass(opts.activeClass)){
					src = $(this).attr('data-src');	
		            setViewImg(src);
				}else{
					imgViewBox.css({ "width": 0, "height": 0 }).hide();
				}
			});
			
			imgViewBox.on("click",function(){
				imgNav.removeClass(opts.activeClass);			
				$(this).css({ "width": 0, "height": 0 }).hide();
			});
			
	        
				
		})
	
	}

})(jQuery);


///


function focusEle(ele){
	try {document.getElementById(ele).focus();}
	catch(e){}
}
function updateEle(ele,content){
	document.getElementById(ele).innerHTML = content;
}
function timestamp(){
	return new Date().getTime();
}
var XMLHttp = {  
	_objPool: [],
	_getInstance: function () {
		for (var i = 0; i < this._objPool.length; i ++) {
			if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4) {
				return this._objPool[i];
			}
		}
		this._objPool[this._objPool.length] = this._createObj();
		return this._objPool[this._objPool.length - 1];
	},
	_createObj: function(){
		if (window.XMLHttpRequest){
			var objXMLHttp = new XMLHttpRequest();
		} else {
			var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
			for(var n = 0; n < MSXML.length; n ++){
				try{
					var objXMLHttp = new ActiveXObject(MSXML[n]);
					break;
				}catch(e){}
			}
		}
		if (objXMLHttp.readyState == null){
			objXMLHttp.readyState = 0;
			objXMLHttp.addEventListener('load',function(){
				objXMLHttp.readyState = 4;
				if (typeof objXMLHttp.onreadystatechange == "function") {  
					objXMLHttp.onreadystatechange();
				}
			}, false);
		}
		return objXMLHttp;
	},
	sendReq: function(method, url, data, callback){
		var objXMLHttp = this._getInstance();
		with(objXMLHttp){
			try {
				if (url.indexOf("?") > 0) {
					url += "&randnum=" + Math.random();
				} else {
					url += "?randnum=" + Math.random();
				}
				open(method, url, true);
				setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				send(data);
				onreadystatechange = function () {  
					if (objXMLHttp.readyState == 4 && (objXMLHttp.status == 200 || objXMLHttp.status == 304)) {  
						callback(objXMLHttp);
					}
				}
			} catch(e) {
				alert('emria:error');
			}
		}
	}
};
function sendinfo(url,node){
	updateEle(node,"<div class='cal_loading'>&nbsp;</div>");
	XMLHttp.sendReq('GET',url,'',function(obj){updateEle(node,obj.responseText);});
}
function loadr(url,tid){
	url = url+"&stamp="+timestamp();
	var r=document.getElementById("r_"+tid);
	var rp=document.getElementById("rp_"+tid);
	if (r.style.display=="block"){
		r.style.display="none";
		rp.style.display="none";
	} else {
		r.style.display="block";
		r.innerHTML = '<span style=\"background-color:#FFFFE5;text-align:center;font-size:12px;color:#666666;\">加载中...</span>';
		XMLHttp.sendReq('GET',url,'',function(obj){r.innerHTML = obj.responseText;rp.style.display="block";});
	}
}
function reply(url,tid){
	var rtext=document.getElementById("rtext_"+tid).value;
	var rname=document.getElementById("rname_"+tid).value;
	var rcode=document.getElementById("rcode_"+tid).value;
	var rmsg=document.getElementById("rmsg_"+tid);
	var rn=document.getElementById("rn_"+tid);
	var r=document.getElementById("r_"+tid);
	var data = "r="+rtext+"&rname="+rname+"&rcode="+rcode+"&tid="+tid;
	XMLHttp.sendReq('POST',url,data,function(obj){
		if(obj.responseText == 'err1'){rmsg.innerHTML = '(回复长度需在140个字内)';
		}else if(obj.responseText == 'err2'){rmsg.innerHTML = '(昵称不能为空)';
		}else if(obj.responseText == 'err3'){rmsg.innerHTML = '(验证码错误)';
		}else if(obj.responseText == 'err4'){rmsg.innerHTML = '(不允许使用该昵称)';
		}else if(obj.responseText == 'err5'){rmsg.innerHTML = '(已存在该回复)';
		}else if(obj.responseText == 'err0'){rmsg.innerHTML = '(禁止回复)';
		}else if(obj.responseText == 'succ1'){rmsg.innerHTML = '(回复成功，等待管理员审核)';
		}else{r.innerHTML += obj.responseText;rn.innerHTML = Number(rn.innerHTML)+1;rmsg.innerHTML=''}});
}
function re(tid, rp){
	var rtext=document.getElementById("rtext_"+tid).value = rp;
	focusEle("rtext_"+tid);
}
function commentReply(pid,c){
	var response = document.getElementById('comment-post');
	document.getElementById('comment-pid').value = pid;
	document.getElementById('cancel-reply').style.display = '';
	c.parentNode.parentNode.appendChild(response);
}
function cancelReply(){
	var commentPlace = document.getElementById('comment-place'),response = document.getElementById('comment-post');
	document.getElementById('comment-pid').value = 0;
	document.getElementById('cancel-reply').style.display = 'none';
	commentPlace.appendChild(response);
}

function cal_margin(links,dp_id){
	var count,menus,cal_width;
	cal_width = 85;//初始子导航的宽度(px)，可根据需要修改
	menus=document.getElementById('dropmenus'+dp_id);		
	count=links.offsetWidth-cal_width;
	menus.style.width=cal_width+'px';
	menus.style.marginLeft=count/2+'px';
}



/**
*	获取QQ信息
*/
function getqqinfo(){
	let qqnum = $('#qqnum').val();
	if(qqnum){
		$('#loging').html('正在获取QQ信息 <img src="https://api.dyboy.cn/static/img/loadqq.gif">');
		$.get('/?qqnum='+qqnum,function(data){
			$('#loging').html('');
			$('#comname').val(data.nickname);
			if(data.qemail == '暂无该QQ信息' || data.qemail == '请输入正确的QQ号码'){
				$('#commail').val('');
				$('#qqnum').val('');
				$('#qqnum').focus();
			}
			else{
				$('#commail').val(data.qemail);
				$('#comment').focus();
			}
		})
	}
}

