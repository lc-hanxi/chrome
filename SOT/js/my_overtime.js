var holdat = new Array();
for(var i = 0; i < 32; i++){
    holdat[i] = '0';
}

var ys = document.getElementById('year');
var ms = document.getElementById('month');
var mdt = new Date();

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


//按设置初始化员工号码
var num = localStorage.number;
num = num ? num : '12657';
document.getElementById("num").value = num;

//初始化选择年月列表，默认为当前月
var yel = document.createElement('option');
yel.text = mdt.getFullYear();
ys.add(yel);

var rc = mdt.getMonth() + 1;
for(var i = 0; i < rc; i++){
    var mel = document.createElement('option');
    mel.text = i + 1;
    if(i == rc - 1)
        mel.selected = "selected";
    ms.add(mel);
}

//初始化选择月的日历，默认为当前月
var ct = document.getElementById("calendar");
ct.addEventListener("mousedown", whichElement);
for(var i = 0; i < 7; i++){
    var rw = ct.insertRow(0);
    for(var j = 0; j < 7; j++){
        var cl = rw.insertCell(j);
        cl.id = (6 - i) * 7 + j;
    }
}

var weekdays = new Array("日", "一", "二", "三", "四", "五", "六");
for(var i = 0; i < 7; ++i){
    ct.rows[0].cells[i].innerText = weekdays[i];
}
showCalendar(mdt.getFullYear(), mdt.getMonth());

//按月份显示日历
function showCalendar(year, month){
    for(var i = 1; i < 7; i++){
        for(var j = 0; j < 7; j++){
          ct.rows[i].cells[j].innerText = "";
          ct.rows[i].cells[j].style.background = "white";
          ct.rows[i].cells[j].style.color = "black";
        }
    }
    for(var i = 0; i < 32; i++){
        holdat[i] = '0';
    }
    var ldt = new Date();
    ldt.setFullYear(year, month, 1); 
    var st = ldt.getDay();
    var days = jscript.datetime.getNumberDaysInMonth(month + 1, year);
    var row = 1;
    for(var i = 0; i < days; i++){
        ct.rows[row].cells[st].innerText = i + 1;
        ++st;
        if(st >= 7){
            st = 0;
            ++row;
        }
    }
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


document.getElementById('month').onchange = function(){
    var yearSel = document.getElementById('year');
    var monSel = document.getElementById('month');
    var year = yearSel.options[yearSel.selectedIndex].text;
    var month= monSel.options[monSel.selectedIndex].text;
    showCalendar(year, month - 1);
}

//返回两个时间相差的小时数
function timeDiff(time_st, time_ed){
    return (time_ed.getTime() - time_st.getTime()) / (3600 * 1000);   
}

function cal_overtime(){
    var lis = document.getElementsByTagName('li');
    for(var i = lis.length - 2; i >= 1 ; i--){
        var sps = lis[i].innerText.split(' ');
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

var capture = 0;

document.getElementById('calculate').onclick = function(){
    if(capture == 1)
	    return;
    capture = 1;
    var num = document.getElementById('num').value;
    var yearSel = document.getElementById('year');
    var monSel = document.getElementById('month');
    var year = yearSel.options[yearSel.selectedIndex].text;
    var month = monSel.options[monSel.selectedIndex].text;
    var days = jscript.datetime.getNumberDaysInMonth(month, year);
    var stm = year + '-' + month + '-1';
    var edm = year + '-' + month + '-' + days;
    httpRequest('http://kq.oa.sumavision.com/Users.aspx?act=&Company=&bm=103&WorkerNO=' + num +
                '&sttim=' + stm + '&entim=' + edm + '&orderby=0&pagecount=' + days, 
    function(overtime){
        //document.write(overtime);
        while(document.body && document.body.lastChild){
            document.body.remove(document.body.lastChild);
        }
        var nbd = document.createElement("body");
        document.body = nbd;
        nbd.style.width = '1000px';
        nbd.style.background = "#DDFFFF";
        var rdiv = document.createElement("div");
        rdiv.id = "raw_data";
        rdiv.innerHTML = overtime;
        nbd.appendChild(rdiv);
        var a0 = document.getElementsByTagName('a')[0];
        a0.href = 'http://kq.oa.sumavision.com/Users.aspx?act=&Company=&bm=103&WorkerNO=' + num +
                '&sttim=' + stm + '&entim=' + edm + '&orderby=0&pagecount=' + days + "&intoExcel=true";
        cal_overtime();
    });
}

function whichElement(e){
    var targ;
    if (!e) 
        var e = window.event;
    if (e.target) 
        targ = e.target;
    else if (e.srcElement) 
        targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;
    if(targ.id >= 7 && targ.innerText != ""){
        if(targ.style.background != "black"){
            targ.style.background = "black";
            targ.style.color = "white";
            holdat[targ.innerText] = 1;
        }
        else{
            targ.style.background = "white";
            targ.style.color = "black";
            holdat[targ.innerText] = 0;
        }
    }
}






