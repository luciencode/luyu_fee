$(document).ready(function(){
	$('.ljzc').click(function(){
		$('.sign-login').hide();
		$('.sign-saomiao').hide();
		$('.sign-zhaohui').hide();
		$('.sign-reg').show();
	});
	$('.wjmm').click(function(){
		$('.sign-login').hide();
		$('.sign-reg').hide();
		$('.sign-saomiao').hide();
		$('.sign-zhaohui').show();
	});
	
	$('.ljdl').click(function(){
		$('.sign-reg').hide();
		$('.sign-saomiao').hide();
		$('.sign-zhaohui').hide();
		$('.sign-login').show();
	});
	$('.smdl').click(function(){
		$('.sign-saomiao').fadeIn();
	});
	$('.closea').click(function(){
		$('.sign-saomiao').fadeOut();
	});
	$.ajax({
		url:pjaxtheme + 'inc/ajax.php?a=ajax',
		type:'post', 
		dataType:'json', 
		success:update_page
	});
	$(".login_logout").click(function(){
		$.get(pjaxtheme + "inc/ajax.php?a=ajax_logout");
		$('.login-nav').show();
		$('.logout-nav').hide();
		$('#user-login').show();
		$('#user-div').hide();
	});
	
    $('#send_ajax').click(function (){
		var username = $('#input1').val();
		var age = $('#input2').val();
		if (username == '') {
			$('#contentdiv_a').css('margin-top','-12px').html('<font color="#87CEFA">帐号不能为空</font>');  
			return false;
		}
		if (age == '') {
			$('#contentdiv_a').css('margin-top','-12px').html('<font color="#87CEFA">密码不能为空</font>');   
			return false;
		}
		var params = $('#formtest').serialize();
		$.ajax({
			url:pjaxtheme + 'inc/ajax.php?a=login',
			type:'post', 
			dataType:'json', 
			data:params, 
			success:function(data){
				update_page(data);
                $('#content').length ? setTimeout(function(){$.pjax.reload('#content',{fragment:'#content',timeout:6000})},0):'';
				if(data.code=='200'){
					location.reload();
				}
			}
			
		});
	update_page(1);
	});
    $('#re_ajax').click(function (){
		var usrName = $("input[name=reusername]").val().replace(/(^\s*)|(\s*$)/g, "");
		var eml = $("input[name=regemail]").val().replace(/(^\s*)|(\s*$)/g, "");
		var pwd = $("input[name=repassword]").val().replace(/(^\s*)|(\s*$)/g, "");
		var pwd2 = $("input[name=repassword2]").val().replace(/(^\s*)|(\s*$)/g, "");
		var yzm = $("input[name=reimgcode]").val().replace(/(^\s*)|(\s*$)/g, "");		
		if(usrName.length>12 || pwd.length>12){
			$('#contentdiv_b').css('margin-top','-12px').html('<font color="#87CEFA">用户名和密码都不能>12位</font>'); 
			$('#recode').attr('src','/include/lib/checkcode.php');
			return false;
		}
		if(usrName.match(/\s/) || pwd.match(/\s/)){
			$('#contentdiv_b').css('margin-top','-12px').html('<font color="#87CEFA">用户名和密码中不能有空格</font>'); 
			$('#recode').attr('src','/include/lib/checkcode.php');
			return false;
		}
		if(usrName == '' || pwd == ''){
			$('#contentdiv_b').css('margin-top','-12px').html('<font color="#87CEFA">用户名或密码不能为空</font>'); 
			$('#recode').attr('src','/include/lib/checkcode.php');
			return false;
		}
		 if(yzm == ''){
			$('#contentdiv_b').css('margin-top','-12px').html('<font color="#87CEFA">验证码都不能为空</font>'); 
			$('#recode').attr('src','/include/lib/checkcode.php');
			 return false;
		 }
		if(usrName.length < 5 || pwd.length < 5){
			$('#contentdiv_b').css('margin-top','-12px').html('<font color="#87CEFA">用户名和密码都不能小于5位</font>'); 
			$('#recode').attr('src','/include/lib/checkcode.php');
			return false;
		}
		if(pwd != pwd2){
			$('#contentdiv_b').css('margin-top','-12px').html('<font color="#87CEFA">两次输入密码不相等</font>'); 
			$('#recode').attr('src','/include/lib/checkcode.php');
			return false;
		}
		var params = $('#refrom').serialize();
		$.ajax({
			url:pjaxtheme + 'inc/ajax.php?a=re',
			type:'post',
			dataType:'json',
			data:params,
			success:re_page
		});
		$('#contentdiv_b').html('<font color="#87CEFA">login.....</font>');
	});
});
function qq_login_ok(type) {
	if(type == 1){
		window.location.reload();
	}else{
		$.ajax({
			url:metatheme + 'inc/ajax.php?a=ajax',
			type:'post', 
			dataType:'json', 
			success:update_page
		});
	}
}


function update_page(json) {
	if(json==1){
	   $('#contentdiv_a').css('margin-top','-12px').html('<font color="#87CEFA">login.........</font>');
   }
   if(json.code=='200'){
		$('.modal').modal('hide');						
		$('.login-nav').hide();
		$('.logout-nav').show();
		$('.login-nav').hide();
		$('.logout-nav').show();
		$('#myLogin').hide();
	}else if(json.code=='201' || json.code=='202' || json.code=='203'){
		$('#code').attr('src','/include/lib/checkcode.php');
		$('#contentdiv_a').css('margin-top','-12px').html('<font color="#87CEFA">' + json.info + '</font>');
	}
}
function re_page(json) {
   if(json.code=='200'){
		$('#contentdiv_b').html('<font color="#87CEFA">' + json.info + '</font>');
		setTimeout(function () {$('.rbtn').val("");$('#contentdiv_b').html("")},500);
		setTimeout(function () {$('.sign-reg').hide();$('.sign-login').show()},800);
		$('#code').attr('src','/include/lib/checkcode.php');
	}else{
		$('#recode').attr('src','/include/lib/checkcode.php');
		$('#contentdiv_b').css('margin-top','-12px').html('<font color="#87CEFA">' + json.info + '</font>');
	}
}


$(".ljdl,.wjmm,.ljzc,.closea,.close").click(function() {
		clearTimeout(interval1);
	});
	$(".smdl").click(function() {
		qqlogin()
	});
	var interval1;
	function qqlogin(){

		$('#contentdiv_c').html("请稍等");
		getqrpic();
		interval1=setInterval(autologin,1000);
	}	
	function getqrpic(){
		var getvcurl='/?plugin=gslogin&do=qrcode&r='+Math.random(1);
		$.get(getvcurl, function(d) {
			if(d.saveOK ==0){
				$('#picdiv').attr('qrsig',d.qrsig);
				$('#picdiv').html('<img onclick="autologin()" src="data:image/png;base64,'+d.data+'" style="width:100%;height:auto" title="点击刷新">');
				$('#contentdiv_c').html("请使用手机QQ扫码");
			}else{
				alert(d.msg);
			}
		});
	}
	function autologin(){
		var qrsig=$('#picdiv').attr('qrsig');
		var c = c || "/?plugin=gslogin&do=qrlogin&qrsig="+decodeURIComponent(qrsig)+"&r=" + Math.random(1);
		$.post(c,{},function(result){
			var msg='请扫描二维码';
			switch(result.code){
				case '0':
					msg = result.data;
					clearTimeout(interval1);
					setTimeout(function(){
						window.location.href="/admin/index.php";
					},2000);
					break;
				case '-1':
					$('#contentdiv_c').html("您未被授权登陆,请联系管理员");
					clearTimeout(interval1);
					break;
				case '1':
					getqrpic();
					$('#contentdiv_c').html("请重新扫描二维码");
					break;
				case '2':
					$('#contentdiv_c').html("请使用手机QQ扫码");
					break;
				case '3':
					$('#contentdiv_c').html("扫码成功,请在手机上确认登陆");
					break;
				default:
					break;
			}
			$('#contentdiv_c').html(msg);
		});
	}
