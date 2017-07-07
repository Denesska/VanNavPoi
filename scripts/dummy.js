let lineEnd;
function LineEnd(item) {
    lineEnd = item;
    let x = $(item).attr("x");
    let y = $(item).attr("y");
    let id = $(item).attr("id");
    if (id === "pointA") {
        let line = $(item).next()
        console.log(line);
    } else {
        let line = $(item).prev()
        console.log(line);
    }

    console.log("Selected " + id + ": x=" + x + " & y=" + y)
}
function dragLineEnd(item) {
    const DIV = $(".constructor");
    $(document).mousemove(function (event) {
        let a_mouseX = event.pageX;
        let a_mouseY = event.pageY;
        let r_mouseX = a_mouseX - DIV.offset().left;
        let r_mouseY = a_mouseY - DIV.offset().top;
        let svg = $(item).closest("svg");
        let id = $(item).attr("id");
        if (id === "pointA") {
            let line = $(item).next();
            let svg_width = parseInt($(item).next().next().attr("x"));
            let svg_height = parseInt($(item).next().next().attr("y"));
            if(r_mouseX < 11){
                r_mouseX = 11;
            }
            if(r_mouseY < 11){
                r_mouseY = 11;
            }
            svg.attr({"width": 11+svg_width-r_mouseX, "height":11+svg_height-r_mouseY});
            $(item).attr({"x": r_mouseX - 10, "y": r_mouseY - 10})

        } else {
            let line = $(item).prev();
            if(r_mouseX < 30){
                r_mouseX = 30;
            }
            if(r_mouseY < 30){
                r_mouseY = 30;
            }
            svg.attr({"width": r_mouseX+12, "height": r_mouseY+12});
            line.attr({"x2": r_mouseX, "y2": r_mouseY});
            $(item).attr({"x": r_mouseX - 10, "y": r_mouseY - 10})
           // line.attr("")
        }
        /*
         svg.css({"left": mouseX, "top": mouseY})
         let svg_w = svg.attr("width");
         let svg_h = svg.attr("height");
         let svg_Ax = svg.attr("height");
         let svg_Ay = svg.attr("height");
         let svg_Bx = svg.attr("height");
         let svg_By = svg.attr("height");

         */
    });
    // opreste mousemove
    $(document).mouseup(function () {
        $(document).off("mousemove");
    });
}
