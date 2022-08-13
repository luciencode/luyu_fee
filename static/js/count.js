
 var luyu_url = blog_url + '/content/templates/luyu_fee/';

document.addEventListener('DOMContentLoaded', () => {


	/* 初始化统计 */
	{
		const category2Dom = document.querySelector('#category2');
		const category2Chart = echarts.init(category2Dom);
		const seriesData = [];
		$('.count_census__basic-item.category2 ul li').each((index, item) => {
			seriesData.push({
				name: item.getAttribute('data-name'),
				value: item.getAttribute('data-value')
			});
		});
		category2Chart.setOption({
			tooltip: {
				trigger: 'item'
			},
			series: [
				{
					type: 'pie',
					roseType: 'area',
					itemStyle: {
						borderRadius: 8
					},
					data: seriesData
				}
			]
		});
	}

	/* 初始化评论统计 */
	{
		const latelyDom = document.querySelector('#lately');
		const latelyChart = echarts.init(latelyDom);
		$.ajax({
			url: luyu_url+'inc/pages.php?tese=pinglun',
			type: 'POST',
			dataType: 'json',
			data: {
				routeType: 'comment_lately'
			},
			success(res) {
				latelyChart.setOption({
					title: {
						subtext: '单位 数量'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
						}
					},
					grid: {
						left: '3%',
						right: '3%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category2',
						axisTick: {
							show: false
						},
						data: res.categories
					},
					yAxis: {
						type: 'value'
					},
					series: {
						name: '数量',
						itemStyle: {
							normal: {
								color: '#91cc75',
								lineStyle: {
									width: 2,
									color: '#91cc75'
								}
							}
						},
						data: res.series,
						type: 'line',
						smooth: true
					}
				});
			}
		});
	}

	/* 初始化归档 */
	{
		let page = 0;
		initFiling();
		function initFiling() {
			if ($('.count_census__filing .button').html() === 'loading...') return;
			$.ajax({
				url: luyu_url +'inc/pages.php?tese=guidang',
				type: 'POST',
				dataType: 'json',
				data: {
					routeType: 'article_filing',
					page: ++page
				},
				success(res) {
					if (!res.length) {
						$('.count_census__filing .item.load').remove();
						return Qmsg.warning('没有更多内容了');
					}
					let htmlStr = '';
					res.forEach(item => {
						htmlStr += `
							<div class="item">
								<div class="tail"></div>
								<div class="head"></div>
								<div class="wrapper">
									<div class="panel">${item.date}<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M21.6 772.8c28.8 28.8 74.4 28.8 103.2 0L512 385.6l387.2 387.2c28.8 28.8 74.4 28.8 103.2 0 28.8-28.8 28.8-74.4 0-103.2L615.2 282.4l-77.6-77.6c-14.4-14.4-37.6-14.4-51.2 0l-77.6 77.6L21.6 669.6c-28.8 28.8-28.8 75.2 0 103.2z" /></svg></div>
									<ol class="panel-body">
										${item.list.map(_ => `<li><a rel="noopener noreferrer" target="_blank" href="${_.permalink}">${_.title}</a></li>`).join('')}
									</ol>
								</div>
							</div>
						`;
					});
					$('#filing').append(htmlStr);
					$('.count_census__filing .button').html('加载更多');
				}
			});
		}
		$('.count_census__filing .content').on('click', '.panel', function () {
			const panelBox = $(this).parents('.content');
			panelBox.find('.panel').not($(this)).removeClass('in');
			panelBox.find('.panel-body').not($(this).siblings('.panel-body')).stop().hide('fast');
			$(this).toggleClass('in').siblings('.panel-body').stop().toggle('fast');
		});
		$('.count_census__filing .button').on('click', function () {
			initFiling();
			$(this).html('loading...');
		});
	}
});
