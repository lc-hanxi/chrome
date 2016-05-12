var num = localStorage.number || '12657';
document.getElementById('num').value = num;
document.getElementById('save').onclick = function(){
    localStorage.number = document.getElementById('num').value;
    alert('±£´æ³É¹¦¡£');
}

