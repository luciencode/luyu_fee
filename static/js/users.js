$('#search').keyup(function(event){
			if(event.keyCode ==13){
			window.location.href='/?user&users&search='+$('#search').val();
			}
		});
		var sum = document.getElementById("name");
		var p1 = document.getElementById("p1");
		var p2 = document.getElementById("p2");
		var status = true;
		var sex = 0;
		sum.onclick = function() {
			if (status){
				sum.style.color = "red";
				sum.innerText = "按用户名称查询";
			} 
				status=!status
				p1.style.display="none";
				p2.style.display="";
		};
		var sum2 = document.getElementById("email");
		var p12 = document.getElementById("p1");
		var p23 = document.getElementById("p3");
		var status2 = true;
		var sex2 = 0;
		sum2.onclick = function() {
			if (status2){
				sum2.style.color = "red";
				sum2.innerText = "按用户邮箱查询";
			} 
				status2=!status2
				p12.style.display="none";
				p23.style.display="";
		};