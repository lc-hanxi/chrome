var d2h = 0; //2h加班次数
var d2_5h = 0; //2.5h加班次数
var d3h = 0; //3h加班次数
var d3_5h = 0; //3.5h加班次数
var dlate = 0; //迟到次数
var dearly = 0; //早退次数
var derr = 0; //异常次数

//最终显示的框架内容
var final_show = document.createElement("div");
final_show.id="cal_data";
var ih = document.createElement("h3");
ih.innerText = "";
final_show.appendChild(ih);
var hids = new Array("2h", "2.5h", "3h", "3.5h");
var sh = new Array(5);
var sl = new Array(5);
for(var i = 0; i < 5; i++){
    sh[i] = document.createElement("h4");
    final_show.appendChild(sh[i]);
    sl[i] = document.createElement("ul");
    final_show.appendChild(sl[i]);
}

//发起数据请求函数
function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

//返回两个时间相差的小时数
function timeDiff(time_st, time_ed){
    return (time_ed.getTime() - time_st.getTime()) / (3600 * 1000);   
}

var weekdays = new Array("日", "一", "二", "三", "四", "五", "六");

function cal_overtime(){
    var lis = document.getElementsByTagName('li');
    for(var i = lis.length - 2; i >= 1 ; i--){
        //var sps = lis[i].innerText.split(' ');
        var sps = new Array();
        var j = 0;
        var htm = lis[i].innerHTML;
        var patt1=new RegExp(">([^ ]+?)<","g");
        var tmp;
        while((tmp=patt1.exec(htm)) != null){
            sps[j] = tmp[1];
            ++j;
        }
        //1： 日期  2: 姓名  4：工号 5： 上班 6：下班 
        if(ih.innerText == ""){
            ih.innerText = "工号：" + sps[4] + "  姓名：" + sps[2]; 
        }       
        //判断当条记录的日期是否为节假日或者周末
        var td = new Date();
        var ta = sps[1].split('-');
        td.setFullYear(ta[0], ta[1] - 1, ta[2]);
        var work_st = sps[5].split(':');
        var work_ed = sps[6].split(':');
        var tt, ovtm = '-';
        if(work_st.length > 1 && work_ed.length > 1){
            var st_time = new Date();
            if(work_st[0] == '12')
                st_time.setHours(13, 0, 0);
            else
                st_time.setHours(work_st[0], work_st[1], work_st[2]);

            var ed_time = new Date();
            ed_time.setHours(work_ed[0], work_ed[1], work_ed[2]);
            ovtm = timeDiff(st_time, ed_time).toFixed(1);
            if(work_st[0] < 12 && work_ed[0] > 12)
                ovtm = ovtm - 1;
        }
       
        if(holdat[ta[2]] == '1')
            tt = sps[1] + "  节假日" + sps[5] + " 至 " + sps[6] + " 时长: " + ovtm + "小时";
        else
            tt = sps[1] + "  星期" + weekdays[td.getDay()] + " " + sps[5] + " 至 " + sps[6] + " 时长: " + ovtm + "小时";
        var sli = document.createElement("li");
        sli.innerText = tt;
        if(holdat[ta[2]] == '1' || td.getDay() == 0 || td.getDay() == 6){ //节假 双休日
            if(work_st.length > 1 && work_ed.length > 1){
                sli.style.color = "blue";
                if(ovtm >= 11.5){//3.5h
                    d3_5h++;
                    sl[3].appendChild(sli);
                }else if(ovtm >= 11){//3h
                    d3h++;
                    sl[2].appendChild(sli);
                }else if(ovtm >= 10.5){//2.5h
                    d2_5h++;
                    sl[1].appendChild(sli);
                }else if(ovtm >= 10){//2h
                    d2h++;
                    sl[0].appendChild(sli);
                }
                var sli2 = sli.cloneNode(true);
                sli2.style.color = "black";
                sl[4].appendChild(sli2);
            }        
        } 
        else{
            if(work_ed.length > 1){
                if(work_ed[0] == '19'){
                    if(work_ed[1] >= '20' && work_ed[1] < '50'){//2h加班
                        d2h++;
                        sl[0].appendChild(sli);
                    }else if(work_ed[1] >= '50'){//2.5h加班
                        d2_5h++;
                        sl[1].appendChild(sli);
                    }
                }else if(work_ed[0] == '20'){
                if(work_ed[1] < '20'){//2.5h加班
                    d2_5h++;
                    sl[1].appendChild(sli);
                }else if(work_ed[1] >= '20' && work_ed[1] < '50'){//3h加班
                    d3h++;
                    sl[2].appendChild(sli);
                }else if(work_ed[1] >= '50'){//3.5h加班
                    d3_5h++;
                    sl[3].appendChild(sli);
                }
                }else if(work_ed[0] > '20'){//3.5h加班
                    d3_5h++;
                    sl[3].appendChild(sli);
                }
            }
        }
    }
    sh[0].innerText = "2小时加班次数: " + d2h;
    sh[1].innerText = "2.5小时加班次数: " + d2_5h;
    sh[2].innerText = "3小时加班次数: " + d3h;
    sh[3].innerText = "3.5小时加班次数: " + d3_5h;
    sh[4].innerText = "休息及节假日加班:";
    document.body.appendChild(final_show);
}
 
var num = localStorage.query_number;
var stm = localStorage.query_start;
var edm = localStorage.query_end;
var days = localStorage.query_days;
var holdat = localStorage.query_holidays;
httpRequest('http://kq.oa.sumavision.com/Users.aspx?act=&Company=&bm=103&WorkerNO=' + num +
            '&sttim=' + stm + '&entim=' + edm + '&orderby=0&pagecount=' + days, 
            function(overtime){
                var nbd = document.body;
                //nbd.style.width = '1000px';
                //nbd.style.background = "#DDFFFF";
                var rdiv = document.createElement("div");
                rdiv.id = "raw_data";
                rdiv.innerHTML = overtime;
                nbd.appendChild(rdiv);
                var a0 = document.getElementsByTagName('a')[0];
                a0.href = 'http://kq.oa.sumavision.com/Users.aspx?act=&Company=&bm=103&WorkerNO=' + num +
                        '&sttim=' + stm + '&entim=' + edm + '&orderby=0&pagecount=' + days + "&intoExcel=true";
                cal_overtime();
});
