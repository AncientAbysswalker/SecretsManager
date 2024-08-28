
var i = 0;
function move() {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 15);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                if (width > 50 && width < 65 && Math.random() < 0.70) {
                    return;
                }
            
                
                width++;
                elem.style.width = width + "%";
            }
        }
    }
}

move();