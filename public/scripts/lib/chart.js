//total

Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, .75, 1),
                bcolor = Raphael.hsb(start, 1, 1),
                ms = 500,
                delta = 30,
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 0}),
                txt = {font: '12px Helvetica, Arial'},
                txt = paper.text(cx + (r + delta + 40) * Math.cos(-popangle * rad), cy + (r + delta + 5) * Math.sin(-popangle * rad), labels[j]).attr({fill: bcolor, stroke: "none", opacity: 0, "font-size": 20});
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                txt.stop().animate({opacity: 1}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "elastic");
                txt.stop().animate({opacity: 0}, ms);
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
            start += .1;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};

$(function () {
    var values = [],
        labels = [];
    $("#total-table p").each(function () {
        values.push(parseInt($("em", this).text(), 10));
        labels.push($("i", this).text());
    });
    $("table").hide();
    Raphael("total-rap", 400, 300).pieChart(200, 150, 90, values, labels, "#fff");
});


/*
//profit
Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
    color = color || "#000";
    var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    return this.path(path.join(",")).attr({stroke: color});
};


function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
    var l1 = (p2x - p1x) / 2,
        l2 = (p3x - p2x) / 2,
        a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
        b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
    a = p1y < p2y ? Math.PI - a : a;
    b = p3y < p2y ? Math.PI - b : b;
    var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
        dx1 = l1 * Math.sin(alpha + a),
        dy1 = l1 * Math.cos(alpha + a),
        dx2 = l2 * Math.sin(alpha + b),
        dy2 = l2 * Math.cos(alpha + b);
    return {
        x1: p2x - dx1,
        y1: p2y + dy1,
        x2: p2x + dx2,
        y2: p2y + dy2
    };
}
// Grab the data
var labels = [],
    data = [];
$("#profit-table i").each(function () {
    labels.push($(this).html());
});
$("#profit-table em").each(function () {
    data.push($(this).html());
});

// Draw

var width = 800,
    height = 250,
    leftgutter = 30,
    bottomgutter = 20,
    topgutter = 20,
    colorhue = .6 || Math.random(),
    color = "hsl(" + [colorhue, .5, .5] + ")",
    r = Raphael("profit-rap", width, height),
    //txt = {font: '12px Helvetica, Arial', fill: "#000"},
    //txt1 = {font: '10px Helvetica, Arial', fill: "#000"},
    //txt2 = {font: '12px Helvetica, Arial', fill: "#000"},
    X = (width - leftgutter) / labels.length,
    max = Math.max.apply(Math, data),
    Y = (height - bottomgutter - topgutter) / max;
//r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#000");
var path = r.path().attr({stroke: color, "stroke-width": 4, "stroke-linejoin": "round"}),
    bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
    label = r.set(),
    lx = 0, ly = 0,
    is_label_visible = false,
    leave_timer,
    blanket = r.set();

//label.push(r.text(60, 12, "24 hits").attr(txt));
//label.push(r.text(60, 27, "12 August 2015").attr(txt1).attr({fill: color}));
//label.hide();
//var frame = r.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();

var p, bgpp;
for (var i = 0, ii = labels.length; i < ii; i++) {
    var y = Math.round(height - bottomgutter - Y * data[i]),
        x = Math.round(leftgutter + X * (i + .5))
        //t = r.text(x, height - 6, labels[i]).attr(txt);//.toBack();
    if (!i) {
        p = ["M", x, y, "C", x, y];
        bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
    }
    if (i && i < ii - 1) {
        var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
            X0 = Math.round(leftgutter + X * (i - .5)),
            Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
            X2 = Math.round(leftgutter + X * (i + 1.5));
        var a = getAnchors(X0, Y0, x, y, X2, Y2);
        p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
    }
    //var dot = r.circle(x, y, 4).attr({fill: "#333", stroke: color, "stroke-width": 2});
    //blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
    //var rect = blanket[blanket.length - 1];
}
p = p.concat([x, y, x, y]);
bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
path.attr({path: p});
bgp.attr({path: bgpp});
//label[0].toFront();
//label[1].toFront();
//blanket.toFront();
*/