tbfine(function (){

return {
	init: function (){
	　　$('.commentlist .url').attr('target','_blank')

		$('.commnet-user-change').on('click', function(){
			$('#comment-author-info').slideDown(300)
        	$('#comment-author-info input:first').focus()
		})

		/* 
	     * comment
	     * ====================================================
	    */
	    var edit_mode = '0',
	        txt1 = '<div class="comt-tip comt-loading">评论提交中...</div>',
	        txt2 = '<div class="comt-tip comt-error">#</div>',
	        txt3 = '">',
	        cancel_edit = '取消编辑',
	        edit,
	        num = 1,
	        comm_array = [];
	    comm_array.push('');

	    $comments = $('#comments-title');
	    $cancel = $('#cancel-comment-reply-link');
	    cancel_text = $cancel.text();
	    $submit = $('#commentform #submit');
	    $submit.attr('disabled', false);
	    $('.comt-tips').append(txt1 + txt2);
	    $('.comt-loading').hide();
	    $('.comt-error').hide();
	    $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
	    $('#commentform').submit(function() {
	        $('.comt-loading').slideDown(300);
	        $submit.attr('disabled', true).fadeTo('slow', 0.5);
	        if (edit) $('#comment').after('<input type="text" name="edit_id" id="edit_id" value="' + edit + '" style="display:none;" />');
	        $.ajax({
	            url: '/index.php?action=addcom',
	            data: $(this).serialize(),
	            type: $(this).attr('method'),
	            error: function(request) {
	                $('.comt-loading').slideUp(300);
	                $('.comt-error').slideDown(300).html(request.responseText);
	                setTimeout(function() {
	                        $submit.attr('disabled', false).fadeTo('slow', 1);
	                        $('.comt-error').slideUp(300)
	                    },
	                    3000)
	            },
	            success: function(data) {
	                $('.comt-loading').slideUp(300);
	                comm_array.push($('#comment').val());
	                $('textarea').each(function() {
	                    this.value = ''
	                });
	                var t = addComment,
	                    cancel = t.I('cancel-comment-reply-link'),
	                    temp = t.I('wp-temp-form-div'),
	                    respond = t.I(t.respondId),
	                    post = t.I('comment_post_ID').value,
	                    parent = t.I('comment-pid').value;
	                if (!edit && $comments.length) {
	                    n = parseInt($comments.text().match(/\d+/));
	                    $comments.text($comments.text().replace(n, n + 1))
	                }
	                new_htm = '" id="new_comm_' + num + '"></';
	                new_htm = (parent == '0') ? ('\n<ol style="clear:both;" class="commentlist commentnew' + new_htm + 'ol>') : ('\n<ul class="children' + new_htm + 'ul>');
	                ok_htm = '\n<span id="success_' + num + txt3;
	                ok_htm += '</span><span></span>\n';

	                if (parent == '0') {
	                    if ($('#postcomments .commentlist').length) {
	                        $('#postcomments .commentlist').before(new_htm);
	                    } else {
	                        $('#respond').after(new_htm);
	                    }
	                } else {
	                    $('#respond').after(new_htm);
	                }

	                $('#comment-author-info').slideUp()

	                // console.log( $('#new_comm_' + num) )
	                $('#new_comm_' + num).hide().append(data);
	                $('#new_comm_' + num + ' li').append(ok_htm);
	                $('#new_comm_' + num).fadeIn(1000);
	                /*$body.animate({
	                        scrollTop: $('#new_comm_' + num).offset().top - 200
	                    },
	                    500);*/
	                $('#new_comm_' + num).find('.comt-avatar .avatar').attr('src', $('.commentnew .avatar:last').attr('src'));
	                countdown();
	                num++;
	                edit = '';
	                $('*').remove('#edit_id');
	                cancel.style.display = 'none';
	                cancel.onclick = null;
	                t.I('comment-pid').value = '0';
	                if (temp && respond) {
	                    temp.parentNode.insertBefore(respond, temp);
	                    temp.parentNode.removeChild(temp)
	                }
	            }
	        });
	        return false
	    });
	    addComment = {
	        moveForm: function(commId, parentId, respondId, postId, num) {
	            var t = this,
	                div, comm = t.I(commId),
	                respond = t.I(respondId),
	                cancel = t.I('cancel-comment-reply-link'),
	                parent = t.I('comment-pid'),
	                post = t.I('comment_post_ID');
	            if (edit) exit_prev_edit();
	            num ? (t.I('comment').value = comm_array[num], edit = t.I('new_comm_' + num).innerHTML.match(/(comment-)(\d+)/)[2], $new_sucs = $('#success_' + num), $new_sucs.hide(), $new_comm = $('#new_comm_' + num), $new_comm.hide(), $cancel.text(cancel_edit)) : $cancel.text(cancel_text);
	            t.respondId = respondId;
	            postId = postId || false;
	            if (!t.I('wp-temp-form-div')) {
	                div = document.createElement('div');
	                div.id = 'wp-temp-form-div';
	                div.style.display = 'none';
	                respond.parentNode.insertBefore(div, respond)
	            }!comm ? (temp = t.I('wp-temp-form-div'), t.I('comment-pid').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.parentNode.insertBefore(respond, comm.nextSibling);
	            $body.animate({
	                    scrollTop: $('#respond').offset().top - 180
	                },
	                400);
	                // pcsheight()
	            if (post && postId) post.value = postId;
	            parent.value = parentId;
	            cancel.style.display = '';
	            cancel.onclick = function() {
	                if (edit) exit_prev_edit();
	                var t = addComment,
	                    temp = t.I('wp-temp-form-div'),
	                    respond = t.I(t.respondId);
	                t.I('comment-pid').value = '0';
	                if (temp && respond) {
	                    temp.parentNode.insertBefore(respond, temp);
	                    temp.parentNode.removeChild(temp)
	                }
	                this.style.display = 'none';
	                this.onclick = null;
	                return false
	            };
	            try {
	                t.I('comment').focus()
	            } catch (e) {}
	            return false
	        },
	        I: function(e) {
	            return document.getElementById(e)
	        }
	    };

	    function exit_prev_edit() {
	        $new_comm.show();
	        $new_sucs.show();
	        $('textarea').each(function() {
	            this.value = ''
	        });
	        edit = ''
	    }
	    var wait = 15,
	        submit_val = $submit.val();

	    function countdown() {
	        if (wait > 0) {
	            $submit.val(wait);
	            wait--;
	            setTimeout(countdown, 1000)
	        } else {
	            $submit.val(submit_val).attr('disabled', false).fadeTo('slow', 1);
	            wait = 15
	        }
	    }
	}
}

});
$(function () {
        $(".comt-main-img").commentImg({
			imgNavBox:'.photos-thumb', 
			imgViewBox:'.photo-viewer'
        });
    });
   
//评论内图片缩放



    function grin(tag) {
    	var myField;
    	tag = ' ' + tag + ' ';
        if (document.getElementById('comment') && document.getElementById('comment').type == 'textarea') {
    		myField = document.getElementById('comment');
    	} else {
    		return false;
    	}
    	if (document.selection) {
    		myField.focus();
    		sel = document.selection.createRange();
    		sel.text = tag;
    		myField.focus();
    	}
    	else if (myField.selectionStart || myField.selectionStart == '0') {
    		var startPos = myField.selectionStart;
    		var endPos = myField.selectionEnd;
    		var cursorPos = endPos;
    		myField.value = myField.value.substring(0, startPos)
    					  + tag
    					  + myField.value.substring(endPos, myField.value.length);
    		cursorPos += tag.length;
    		myField.focus();
    		myField.selectionStart = cursorPos;
    		myField.selectionEnd = cursorPos;
    	}
    	else {
    		myField.value += tag;
    		myField.focus();
    	}
    }

       //图片图床上传
		$(document).ready(function() {
			$('.picurl > input').bind('focus mouseover',
			function() {
				if (this.value) {
					this.select()
				}
			});
			$("input[type='file']").change(function(e) {
				images_upload(this.files)
			});
			var obj = $('body');
			obj.on('dragenter',
			function(e) {
				e.stopPropagation();
				e.preventDefault()
			});
			obj.on('dragover',
			function(e) {
				e.stopPropagation();
				e.preventDefault()
			});
			obj.on('drop',
			function(e) {
				e.preventDefault();
				images_upload(e.originalEvent.dataTransfer.files)
			})
		});
		var images_upload = function(files) {
			var comt = document.getElementById('comment') || 0;
			var comt_dis =document.getElementById("comt_file");
			var flag = 0;
			$(files).each(function(key, value) {
				$('#comt_ins_err')[0].innerHTML = '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i> 上传中...';
				image_form = new FormData();
				image_form.append('file', value);
				console.log(image_form);
				$.ajax({
					url: jsui.www + '/sinaimg?type=multipart',
					type: 'POST',
					data: image_form,
					mimeType: 'multipart/form-data',
					contentType: false,
					cache: false,
					processData: false,
					dataType: 'json',
					success: function(data) {
						if (data.code == '200') {
							flag++;
							if (typeof data.pid != 'null') {
								comt.value += '[img]https://ww2.sinaimg.cn/large/' + data['pid']+ '[/img]';
								$('#comt_ins_err')[0].innerHTML = '<i class="fa fa-check-circle"></i> 上传成功';
                                comt_dis.onclick = '';
						        $('#comt_file').css('color','#d8d8d8');
							   
							}

						} else {
							alert(data.msg);
							$('#comt_ins_err')[0].innerHTML = '<i class="fa fa-exclamation-triangle"></i> 上传失败'
						}
					},
					error: function(XMLResponse) {
						$('#comt_ins_err')[0].innerHTML = '<i class="fa fa-exclamation-triangle"></i> 上传失败';
						alert("error:" + XMLResponse.responseText)
					}
				})
			})
		};
		document.onpaste = function(e) {
			var data = e.clipboardData;
			for (var i = 0; i < data.items.length; i++) {
				var item = data.items[i];
				if (item.kind == 'file' && item.type.match(/^image\//i)) {
					var blob = item.getAsFile();
					images_upload(blob)
				}
			}
		}



//表情颜色弹窗
$(document).ready(function () {   
	$("#comment-smiley").click(function(){   
		$("#smiley").toggle(500);   
	});  
	$("#font-color").click(function(){   
		$("#fontcolor").toggle(500);   
	});   
});   
 //qq获取资料
$(function(){
 inlojv_js_getqqinfo();
});
function setCookie(a,c){var b=30;var d=new Date();d.setTime(d.getTime()+b*24*60*60*1000);document.cookie=a+"="+escape(c)+";expires="+d.toGMTString()}
function getCookie(b){var a,c=new RegExp("(^| )"+b+"=([^;]*)(;|$)");if(a=document.cookie.match(c)){return unescape(a[2])}else{return null}}
function inlojv_js_getqqinfo(){
 if(getCookie('user_avatar') && getCookie('user_qq') ){ 
 $('#comt-qq').val(getCookie('user_qq'));
 }
 $('#comt-qq').on('blur',function(){
 var qq=$('#comt-qq').val(); 
 $('#email').val($.trim(qq)+'@qq.com'); 
 $.ajax({
 type: 'get',
 url:jsui.uri+'/inc/mo_qqinfo.php?type=getqqnickname&qq='+qq, 
 dataType: 'jsonp',
 jsonp: 'callback',
 jsonpCallback: 'portraitCallBack',
 success: function(data) {
 // console.log(data);
 $('#author').val(data[qq][6]);
 setCookie('user_qq',qq);
 },
 error: function() {
 $('#comt-qq,#author,#email').val('');
 }
 });
 $.ajax({
 type: 'get',
 url:jsui.uri+'/inc/mo_qqinfo.php?type=getqqavatar&qq='+qq,
 dataType: 'jsonp',
 jsonp: 'callback',
 jsonpCallback: 'qqavatarCallBack',
 success: function(data) { 
 $('.comt-title img').attr('src',data[qq]);
 setCookie('user_avatar',data[qq]); 
 },
 error: function() {
 $('#comt-qq,#author,#email').val(''); 
 }
 });
 });
}


//


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


