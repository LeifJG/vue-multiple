import conf from './conf';
import wx from 'weixin-js-sdk';
import axios from 'axios';
import promise from 'es6-promise';
promise.polyfill();
const protocol = location.protocol;
var oproto = Object.prototype;
var serialize = oproto.toString;
var Rxports = {
	/**
	  * 封装axios，减少学习成本，参数基本跟jq ajax一致
	  * @param {String} type			请求的类型，默认post
	  * @param {String} url				请求地址
	  * @param {String} time			超时时间
	  * @param {Object} data			请求参数
	  * @param {String} dataType		预期服务器返回的数据类型，xml html json ...
	  * @param {Object} headers			自定义请求headers
	  * @param {Function} success		请求成功后，这里会有两个参数,服务器返回数据，返回状态，[data, res]
	  * @param {Function} error		发送请求前
	  * @param return
	*/
	ajax: function (opt) {//全局ajax方法，封装成和jquery的ajax方法差不多。
		var opts = opt || {};
		if (!opts.url) {
			alert('请填写接口地址');
			return false;
		}
		axios({
			method: opts.type || 'post',
			url: opts.url,
			params: opts.data || {},
			headers: opts.headers || {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
			// 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
			//baseURL:`${protocol}//${location.host}`,
			//baseURL:`https://m.meiyi.ai`,
			baseURL: '/api',
			timeout: opts.time || 10 * 100000,
			responseType: opts.dataType || 'json',
			data: opts.formdata || {},//formdata，传大量数据的时候使用。
		}).then(function (res) {
			if (res.status == 200) {
				if (opts.success) {
					opts.success(res.data, res);
				}
			} else {
				if (data.error) {
					opts.error(error);
				} else {
					console.log('好多人在访问呀，请重新试试[timeout]');
				}
			}
		}).catch(function (error) {
			console.log(error);
			if (opts.error) {
				opts.error(error);
			} else {
				console.log('好多人在访问呀，请重新试试[timeout]');
			}
		});
	},
	/*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
	isArrayLike: function (obj) {
		if (!obj)
			return false
		var n = obj.length
		if (n === (n >>> 0)) { //检测length属性是否为非负整数
			var type = serialize.call(obj).slice(8, -1)
			if (/(?:regexp|string|function|window|global)$/i.test(type))
				return false
			if (type === "Array")
				return true
			try {
				if ({}.propertyIsEnumerable.call(obj, "length") === false) { //如果是原生对象
					return /^\s?function/.test(obj.item || obj.callee)
				}
				return true
			} catch (e) { //IE的NodeList直接抛错
				return !obj.window //IE6-8 window
			}
		}
		return false
	},
	/*遍历数组与对象,回调的第一个参数为索引或键名,第二个或元素或键值*/
	each: function (obj, fn) {
		var That = this;
		if (obj) { //排除null, undefined
			var i = 0
			if (That.isArrayLike(obj)) {
				for (var n = obj.length; i < n; i++) {
					if (fn(i, obj[i]) === false)
						break
				}
			} else {
				for (i in obj) {
					if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
						break
					}
				}
			}
		}
	},
	/**
	  * 获取url传过来的参数
	  * @param name 	获取的参数
	  * @param Url 		自定义获取参数的链接
	  * @param return
	*/
	getUrlQuery: function (name, Url) {//获取url内的参数。
		//URL GET 获取值
		const reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i"),
			url = Url || location.href;
		if (reg.test(url))
			//console.log(decodeURI(RegExp.$2.replace(/\+/g, " ")).slice('?')[0]);
			return decodeURI(RegExp.$2.replace(/\+/g, " ").split("#")[0].split("?")[0]);
		return "";
	},
	//字数过滤器
	filterString: function (str, len) {//字数过滤器，超出字数显示“...”。
		if (str == null) {
			return ' ';
		} else {
			if (str.length > len) {
				return str.substring(0, len) + "...";
			} else if (!str.length) {
				return '无';
			} else {
				return str;
			}
		}
	},
	removeHTMLTag: function (str) {
		str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
		str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
		//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
		str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
		return str;
	},
	baseFn: function () {//全局事件，不需要DOM渲染完成后执行的全局方法。
		document.documentElement.style.fontSize = document.documentElement.clientWidth < 768 ? document.documentElement.clientWidth / 7.5 + 'px' : 100 + 'px';
		let sid = this.getUrlQuery('sid');
		if (sid) {
			sessionStorage.setItem('sid', sid);
		}
	},
	baseDomFn: function () {//全局事件，需要在DOM渲染完成后再执行的全局方法。

	},
	addHandler: function (element, type, handler) {//添加事件监听器。
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	getCookie: function (name) {//获取cookie
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	},
	getPartnerToken() {
		let meiyi_partner = localStorage.meiyi_partner ? localStorage.meiyi_partner : false;
		return meiyi_partner;
	},
	checkPhone: function (phone, error = false, type = 0) { //正则检测手机号格式
		if (!(/^1[3|4|5|7|8|9][0-9]{9}$/.test(phone))) {
			return error;
		} else if (type == 1) {
			return false;
		} else {
			return true;
		}
	},
	isCardNo: function (idCard, error) {//正则检测身份证格式
		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
		let reg = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/;
		if (reg.test(idCard) === false) {
			return error;
		} else {
			return false;
		}
	},
	compare: function (val, type = 'desc') { //type等于desc的时候为降序,默认是降序。 排序方法
		return function (obj1, obj2) {
			const val1 = obj1[val], val2 = obj2[val];
			if (type == 'desc') {
				return val1 <= val2 ? 1 : -1;
			} else {
				return val1 <= val2 ? -1 : 1;
			}
		}
	},
	setSeoFn(title = 'vue', keywords = 'vue', description = 'vue') {
		let head = document.getElementsByTagName('head')[0];
		let oTitle = document.getElementsByTagName('title')[0];
		let oKeywords = document.createElement('meta');
		let oDescription = document.createElement('meta');
		oKeywords['name'] = 'keywords';
		oKeywords['content'] = keywords;
		oDescription['name'] = 'description';
		oDescription['content'] = description;
		oTitle.innerText = title;
		head.appendChild(oKeywords);
		head.appendChild(oDescription);
	}
};
export default Rxports;