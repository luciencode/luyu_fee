$(document).ready(function () {
    ajax_url = jsui.uri+'user/reg.php';
    edit_ajax_url = jsui.uri + 'user/edit.php?action=update';
    var _tipstimer;

    function tips(str) {
        if (!str) return false
        _tipstimer && clearTimeout(_tipstimer)
        $('.user-tips').html(str).animate({
            top: 0
        }, 220)
        _tipstimer = setTimeout(function () {
            $('.user-tips').animate({
                top: -30
            }, 220)
        }, 5000)
    }

    $('.container-user').on('click', function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement
        var _ta = $(target)

        if (_ta.parent().attr('evt')) {
            _ta = $(_ta.parent()[0])
        } else if (_ta.parent().parent().attr('evt')) {
            _ta = $(_ta.parent().parent()[0])
        }

        var type = _ta.attr('evt')

        if (!type || _ta.hasClass('disabled')) return

        switch (type) {

            case 'postnew.submit':

                var form = _ta.parent().parent().parent()
                var inputs = form.serializeObject()
                var title = $.trim(inputs.post_title)
                var url = $.trim(inputs.post_url)
                var content = $.trim(inputs.post_content)


                if (!title || title.length > 50) {
                    tips('标题不能为空，且小于50个字符');
                    return
                }

                if (!content || content.length > 10000 || content.length < 10) {
                    tips('文章内容不能为空，且介于10-10000字之间');
                    return
                }

                if (!url && url.length > 200) {
                    tips('来源链接不能大于200个字符');
                    return
                }

                $.ajax({
                    type: 'POST',
                    url: ajax_url,
                    data: inputs,
                    dataType: 'json',
                    success: function (data) {

                        if (data.msg) {
                            tips(data.msg)
                        }

                        if (data.error) {
                            return
                        }

                        form.find('.form-control').val('')
                        if( data.goto ){ location.href = data.goto;}
                        location.hash = 'posts/draft'
                    }
					
                });

                break;

            case 'password.submit':
                var form = _ta.parent().parent().parent()
                var inputs = form.serializeObject()

                if (!inputs.action) {
                    return
                }

                if (!inputs.password || inputs.password.length < 6) {
                    tips('新密码不能为空且至少6位')
                    return
                }

                if (inputs.password !== inputs.password2) {
                    tips('两次密码输入不一致')
                    return
                }

                if (inputs.passwordold === inputs.password) {
                    tips('新密码和原密码不能相同')
                    return
                }

                $.ajax({
                    type: 'POST',
                    url: ajax_url,
                    data: inputs,
                    dataType: 'json',
                    success: function (data) {

                        if (data.error) {
                            if (data.msg) {
                                tips(data.msg)
                            }
                            return
                        }

                        tips('修改成功！下次登录请使用新密码！')
                        if( data.goto ){ location.href = data.goto;}
                        $('input:password').val('')
                    }
                });

                break;
            case 'info.submit':
                var form = _ta.parent().parent().parent()
                var inputs = form.serializeObject()
                if (!inputs.action) {return}
                if (!/.{2,20}$/.test(inputs.nickname)) {tips('昵称限制在2-20字内');return}
                if( !inputs.email ){tips('邮箱不能为空');return}
                if( !is_mail(inputs.email) ){tips('邮箱格式错误');return}
                var fm = new FormData()
                fm.append('nickname', inputs.nickname)
                fm.append('email', inputs.email)
                fm.append('photo', inputs.photo)
                var img= document.blooger.img.files[0]
                if (img) {fm.append('img', img)}
                $.ajax({
                    type: 'POST',
                    url: edit_ajax_url,
                    data: fm, // FormData Object
                    dataType: 'json',
                    contentType: false, //禁止设置请求类型
                    processData: false, //禁止jquery对DAta数据的处理,默认会处理
                    success: function (data) {
                        if (data.error) {
                            if (data.msg) {
                                tips(data.msg)
                            }
                            return
                        }
                        tips('修改成功！');
                        if( data.goto ){ location.href = data.goto;}
                        cache_userdata = null
                    }
                });
                break;
        }
    })
})


		$(".xgzl").on('click',function(){
		$(".form-xg").attr("disabled",false);  
		$(".hide-xg,.hide-ps").show();
		$(".fasex").hide();
		$(this).hide();
	});
	$(".qxxg").on('click',function(){
		$(".form-xg").attr("disabled","disabled");  
		$(".hide-xg,.hide-ps").hide();
		$(".xgzl,.fasex").show();
	});
$("#wx_pay").on('click',function(){
	$(".wxpay").show();
	$(".alipay").hide();
});	
$("#ali_pay").on('click',function(){
	$(".alipay").show();
	$(".wxpay").hide();
});	



	$('#user_vip').on('click',function(){
		$('#user_vip').attr('disabled','disabled');
		$.ajax({
			url:metatheme + 'inc/ajax.php?a=vipxf',
			type:'post',
			dataType:'json',
			success:ajax_update
		});
	});
	$('#user_novip').on('click',function(){
		$('#user_novip').attr('disabled','disabled');
		$.ajax({
			url:metatheme + 'inc/ajax.php?a=openvip',
			type:'post',
			dataType:'json',
			success:ajax_update
		});
	});


$('.zdy_img').on('click',function(){
	$('.up_img_tips').fadeIn();
	$('.up_img_tips').fadeOut(2000);
});
$('.up_img_div').on('click',function(){
	var id = $(this).attr("data-id");
	var url= pjaxtheme + 'inc/ajax.php?a=selectimage';
	$.ajax( {  
			url:url,  
			dataType:'json',  
			type: "POST",  
			data: {"image":id},  
			success: function(data){
				if(data.result=="ok"){
					$("#up-img-touch img").attr("src",data.file);
					var img_name=data.file.split('/')[2];
					console.log(img_name);
					$("#pic").text(img_name);
				}
				swal("温馨提示!", "修改成功", "success");
				$(".modal-backdrop").remove();
				$("body").removeClass('modal-open');
				$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });
			},
			error: function(){
			
				swal("温馨提示!", "修改失败", "error");
			}  
	 }); 
});	
function bangdingok(){
	$('#qq_login').hide();$('#qq_login_jiebang').show();
}
$('#qq_login').on('click',function(){
		window.open(pjaxtheme + "inc/ajax.php?a=qq_bangding", "qq_bangding", "top=200,left=200,height=600, width=800, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
});
$('#qq_login_jiebang').on('click',function(){
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=jie_bang',
		type:'post',
		dataType:'json',
		data:{},
		success:function (data){
			if(data.code=='200'){
				$('#qq_login').show();$('#qq_login_jiebang').hide();
			}
		}
	});
});	
$('.payvip').on("click",function(){
	var key = $("#paykey").val();
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=vip',
		type:'post',
		dataType:'json',
		data:{type:"payvip",key:key},
		success:function (data){
			if(data.code=='200'){
				$('#pay-success').css('display','block');
				$('.pay_info').html(data.data);
				setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 1000);
			}else{
				$('#pay-danger').css('display','block');
				$('.pay_info').html(data.data)
				setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 1000);
			}
		}
	});
});
$('.log_del').on("click",function(){
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=vip',
		type:'post',
		dataType:'json',
		data:{type:"dellog"},
		success:function (data){
			swal("温馨提示!", ""+data.data+"", "success");

			setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 800);
			setTimeout(function () {$("li[role='presentation']:eq(2)").addClass('active').siblings().removeClass('active');}, 900);
			setTimeout(function () {$("div[role='tabpanel']:eq(3)").addClass('active in').siblings().removeClass('active in');}, 900);
		}
	});
});
$('.key_del').on("click",function(){
	var id = $(this).attr("data");
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=vip',
		type:'post',
		dataType:'json',
		data:{type:"delkey",id:id},
		success:function (data){
			swal("温馨提示!", ""+data.data+"", "success");
			
			setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 800);
			setTimeout(function () {$("li[role='presentation']:eq(1)").addClass('active').siblings().removeClass('active');}, 900);
			setTimeout(function () {$("div[role='tabpanel']:eq(2)").addClass('active in').siblings().removeClass('active in');}, 900);
		}
	});
});
$('.input-kami').on("click",function(){
	var time = $("#kamitime").val();
	var num = $("#kaminum").val();
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=vip',
		type:'post',
		dataType:'json',
		data:{type:"addkey",time:time,num:num},
		success:function (data){
			swal("温馨提示!", ""+data.data+"", "success");
		
			setTimeout(function () {$.pjax.reload(pjax_id, {fragment:pjax_id,timeout: 8000 });}, 800);
			setTimeout(function () {$("li[role='presentation']:eq(1)").addClass('active').siblings().removeClass('active');}, 900);
			setTimeout(function () {$("div[role='tabpanel']:eq(2)").addClass('active in').siblings().removeClass('active in');}, 900);
		}
	});
});
$('.addvip').on("click",function(){
	var uid = $(this).attr("data-uid");
	var time = $(this).attr("data-time");
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=vip',
		type:'post',
		dataType:'json',
		data:{type:"addvip",uid:uid,time:time},
		success:function (data){
			swal("温馨提示!", ""+data.data+"", "success");
		
			setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 800);
		}
	});
});
$('.vipbtn').on("click",function(){
	var vip = $(this).attr("data");
		if(vip == 1){
			$(this).attr("data","0");
			$(this).attr("src",pjaxtheme + "static/img/vipoff.png");
			xiugaivip($(this).attr("userid"),"offvip");
		}else{
			$(this).attr("data","1");
			$(this).attr("src",pjaxtheme + "static/img/vipopen.png");
			xiugaivip($(this).attr("userid"),"openvip");
		}
});
$('.vip-xf').on("click",function(){
	var Integral = $(this).attr("data-xf");
	var msg = "操作确认？";  
    if (confirm(msg)==false) return false;
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=vip',
		type:'post',
		dataType:'json',
		data:{type:'payviptime',sort:Integral},
		success:function (data){
			swal("温馨提示!", ""+data.data+"", "success");
			setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 800);
		}
	});
});
function xiugaivip (userid,isopen){
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=vip',
		type:'post',
		dataType:'json',
		data:{uid:userid,type:isopen},
		success:function (data){
			swal("温馨提示!", ""+data.data+"", "success");

			setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 800);
		}
	});
}
$(document).ready(function(){
    $('#update-submit').click(function (){
		var username = $("input[name=username]").val().replace(/(^\s*)|(\s*$)/g, "");
		var name = $("input[name=name]").val().replace(/(^\s*)|(\s*$)/g, "");
		var qq = $("input[name=qq]").val().replace(/(^\s*)|(\s*$)/g, "");
		var email = $("input[name=email]").val().replace(/(^\s*)|(\s*$)/g, "");
		var description = $("textarea[name=description]").val().replace(/(^\s*)|(\s*$)/g, "");
		var nwp = $("input[name=newpass]").val().replace(/(^\s*)|(\s*$)/g, "");
		var rewp = $("input[name=repeatpass]").val().replace(/(^\s*)|(\s*$)/g, "");
		var params = $('#updatefrom').serialize();
		$.ajax({
			url:pjaxtheme + 'inc/ajax.php?a=update',
		type:'post',
			dataType:'json',
			data:params,
			success:ajax_update
		});
		return false;
	});
});

$(document).ready(function(){
    $('#postnew').click(function (){
		var title = $("input[name=post_title]").val().replace(/(^\s*)|(\s*$)/g, "");
		var content = tinyMCE.get('editor_content').getContent();
		var category = $("select[name=post_category]").val().replace(/(^\s*)|(\s*$)/g, "");
			$.ajax({
				type: 'POST',
				url: pjaxtheme + 'inc/ajax.php?a=addlog',
				data: "post_title="+ title + "&post_content=" + content + "&post_category=" + category,
				dataType: 'json',
				success: ajax_addlog
			});
		return false;
	});
});
function ajax_addlog(json) {

swal("温馨提示!", ""+json.info+"", "success");
	if(json.code=='200'){
		setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 500);
	}
}
function ajax_update(json) {
		
		if(json.code=='200'){	
			swal("温馨提示!", ""+json.info+"", "sucess");

			setTimeout(function () {$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });}, 500);
		}else{
			swal("温馨提示!", ""+json.info+"", "error");
		}
	}
	
	
$(function() {
    'use strict';
    var $image = $('#image');
    $image.cropper({
        aspectRatio: '1',
        autoCropArea:0.8,
        preview: '.up-pre-after',
        
    });
    
    var $inputImage = $('#inputImage');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function () {
            var files = this.files;
            var file;

            if (files && files.length) {
               file = files[0];

               if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {
                       URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }

            var fileNames = '';
            $.each(this.files, function() {
                fileNames += '<span class="am-badge">' + this.name + '</span> ';
            });
            $('#file-list').html(fileNames);
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
    $('#up-btn-ok').on('click',function(){
    	var img_src=$image.attr("src");
    	if(img_src==""){
			swal("温馨提示!", "没有选择上传的图片", "error");
    	
    		return false;
    	}
    	
    	var url= pjaxtheme + 'inc/ajax.php?a=upimage';
    	var canvas=$("#image").cropper('getCroppedCanvas');
    	var data=canvas.toDataURL();
        $.ajax( {  
                url:url,  
                dataType:'json',  
                type: "POST",  
                data: {"image":data.toString()},  
                success: function(data, textStatus){
                	if(data.result=="ok"){
                		$("#up-img-touch img").attr("src",data.file);
                		var img_name=data.file.split('/')[2];
                		console.log(img_name);
                		$("#pic").text(img_name);
                	}
					swal("温馨提示!", "头像上传成功！", "success");
					$(".modal-backdrop").remove();
					$("body").removeClass('modal-open');
					$.pjax.reload(pjax_id, {fragment: pjax_id,timeout: 8000 });
                },
                error: function(){
					swal("温馨提示!", "上传文件失败了！", "error");
                
                }  
         });  
    	
    });
    
});
$('.vip_zdy').on('click',function(){
	$(".up-frame-body").show();$('.up_img_body').hide();
});

function imgdefault() {
$(".up_img_body").show();$('.up-frame-body').hide();
}

function rotateimgright() {
$("#image").cropper('rotate', 90);
}

function rotateimgleft() {
$("#image").cropper('rotate', -90);
}

function set_alert_info(content){
	$(".up-tips").html(content);
}

		$('#refund_btn').click(function (){
			money  = $('#money').val();
			var str ="金额错误";
			note = $('#note').val();
			swal("温馨提示!", ""+str+"", "error");
			$.message({ message:'两次输入密码不相等', type:'fa fa-times c-message--error'});
			return false;
		});




