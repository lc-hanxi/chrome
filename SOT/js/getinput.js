var holdat = new Array();
for(var i = 0; i < 32; i++){
    holdat[i] = '0';
}

//���·���ʾ����
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

//��������������
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

var ys = document.getElementById('year');
var ms = document.getElementById('month');
var mdt = new Date();

//�����ó�ʼ��Ա������
var num = localStorage.number;
num = num ? num : '12657';
document.getElementById("num").value = num;

//��ʼ��ѡ�������б�Ĭ��Ϊ��ǰ��
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

//��ʼ��������Ĭ��Ϊѡ��ǰ��
var ct = document.getElementById("calendar");
ct.addEventListener("mousedown", whichElement);
for(var i = 0; i < 7; i++){
    var rw = ct.insertRow(0);
    for(var j = 0; j < 7; j++){
        var cl = rw.insertCell(j);
        cl.id = (6 - i) * 7 + j;
    }
}

//��������ʾ����
var weekdays = new Array("��", "һ", "��", "��", "��", "��", "��");
for(var i = 0; i < 7; ++i){
    ct.rows[0].cells[i].innerText = weekdays[i];
}
showCalendar(mdt.getFullYear(), mdt.getMonth());

//ѡ���б����·ݱ仯ʱ������ͬ���仯
document.getElementById('month').onchange = function(){
    var yearSel = document.getElementById('year');
    var monSel = document.getElementById('month');
    var year = yearSel.options[yearSel.selectedIndex].text;
    var month= monSel.options[monSel.selectedIndex].text;
    showCalendar(year, month - 1);
}

//��ȡ�û�������Ϣ������
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
    localStorage.query_number = num;
    localStorage.query_start = stm;
    localStorage.query_end = edm;
    localStorage.query_days = days;
    var que_s = '';
    for(var i = 0; i < 32; ++i){
        que_s += holdat[i];
    }
    localStorage.query_holidays = que_s; 
    chrome.tabs.create({url: 'result.html'});
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

