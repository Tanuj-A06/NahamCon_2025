js-beautify
(v1.15.4)
Beautify JavaScript, JSON, React.js, HTML, CSS, SCSS, and SASS

Enable Dark Mode

Beautify JavaScript
Beautify Code (ctrl‑enter)

Copy to Clipboard
 
Download
 
Select All
 
Clear
 No file chosen
Options

Indent with 4 spaces

Allow 5 newlines between tokens

Do not wrap lines

Braces with control statement
HTML <style>, <script> formatting:


Add one indent level
   End script and style with newline?
Support e4x/jsx syntax
Use comma-first list style?
Detect packers and obfuscators? (unsafe)
Preserve inline braces/code blocks?
Keep array indentation?
Break lines on chained methods?
Space before conditional: "if(x)" / "if (x)"
Unescape printable chars encoded as \xNN or \uNNNN?
Use JSLint-happy formatting tweaks?
Indent <head> and <body> sections?
Keep indentation on empty lines?
Use a simple textarea for code input? 
Additional Settings (JSON):

{}
Your Selected Options (JSON):

{
  "indent_size": "4",
  "indent_char": " ",
  "max_preserve_newlines": "5",
  "preserve_newlines": true,
  "keep_array_indentation": false,
  "break_chained_methods": false,
  "indent_scripts": "normal",
  "brace_style": "collapse",
  "space_before_conditional": true,
  "unescape_strings": false,
  "jslint_happy": false,
  "end_with_newline": true,
  "wrap_line_length": "0",
  "indent_inner_html": false,
  "comma_first": false,
  "e4x": false,
  "indent_empty_lines": false
}
Created by Einar Lielmanis, maintained and evolved by Liam Newman.

All of the source code is completely free and open, available on GitHub under MIT licence, and we have a command-line version, python library and a node package as well.

We use the wonderful CodeMirror syntax highlighting editor, written by Marijn Haverbeke.

Made with a great help of many contributors. Special thanks to:
Jason Diamond, Patrick Hof, Nochum Sossonko, Andreas Schneider, Dave Vasilevsky, Vital Batmanov, Ron Baldwin, Gabriel Harrison, Chris J. Shull, Mathias Bynens, Vittorio Gambaletta, Stefano Sanfilippo and Daniel Stockman.

1
const requiredGrains = 7,
2
    targetPositions = [{
3
        x: 367,
4
        y: 238,
5
        colorHue: 0
6
    }, {
7
        x: 412,
8
        y: 293,
9
        colorHue: 40
10
    }, {
11
        x: 291,
12
        y: 314,
13
        colorHue: 60
14
    }, {
15
        x: 392,
16
        y: 362,
17
        colorHue: 120
18
    }, {
19
        x: 454,
20
        y: 319,
21
        colorHue: 240
22
    }, {
23
        x: 349,
24
        y: 252,
25
        colorHue: 280
26
    }, {
27
        x: 433,
28
        y: 301,
29
        colorHue: 320
30
    }],
31
    tolerance = 15,
32
    hueTolerance = 20;
33
let particles = [],
34
    grid = [],
35
    isMousePressed = !1,
36
    colorIndex = 0,
37
    flagRevealed = !1,
38
    targetIndicatorsVisible = !1,
39
    gravityStopped = !1;
40
​
41
function getRainbowColor() {
42
    return color("hsb(" + (colorIndex = (colorIndex + 5) % 360) + ", 100%, 90%)")
43
}
44
​
45
function getSpecificColor(e) {
46
    return color("hsb(" + e + ", 100%, 90%)")
47
}
48
async function retrieveFlag() {
49
    let e = document.getElementById("flag-container");
50
    e.style.display = "block";
51
    try {
52
        let t = particles.filter(e => e.settled).map(e => ({
53
                x: Math.floor(e.x),
54
                y: Math.floor(e.y),
55
                colorHue: e.colorHue
56
            })),
57
            o = await fetch("/api/verify-ctf-solution", {
58
                method: "POST",
59
                headers: {
60
                    "Content-Type": "application/json"
61
                },
62
                body: JSON.stringify({
63
                    particleData: t
64
                })
65
            }),
66
            i = await o.json(),
67
            r = e.querySelector(".loading");
68
        r && r.remove(), i.success ? (e.querySelector("p").textContent = "SNAD!", document.getElementById("flag-text").textContent = i.flag) : (e.querySelector("p").textContent = i.message, document.getElementById("flag-text").textContent = "", setTimeout(() => {
69
            e.style.display = "none", flagRevealed = !1
70
        }, 3e3))
71
    } catch (l) {
72
        console.error("Error retrieving flag:", l), document.getElementById("flag-text").textContent = "Error retrieving flag. Please try again.";
73
        let s = e.querySelector(".loading");
74
        s && s.remove()
75
    }
76
}
77
​
78
function injectSand(e, t, o) {
79
    if (isNaN(e) || isNaN(t) || isNaN(o)) return console.error("Invalid parameters. Usage: injectSand(x, y, hue)"), !1;
80
    o = (o % 360 + 360) % 360;
81
    let i = new Particle(e, t, {
82
        colorHue: o,
83
        settled: !0,
84
        skipKeyCheck: !0,
85
        vx: 0,
86
        vy: 0
87
    });
88
    particles.push(i);
89
    let r = floor(e),
90
        l = floor(t);
91
    return r >= 0 && r < width && l >= 0 && l < height && (grid[l][r] = !0), i
92
}
93
​
94
function toggleGravity() {
95
    gravityStopped = !gravityStopped, console.log(`Gravity ${gravityStopped ? "stopped" : "resumed"}`)
96
}
97
class Particle {
98
    constructor(e, t, o = {}) {
99
        this.x = void 0 !== o.x ? o.x : e, this.y = void 0 !== o.y ? o.y : t, this.size = o.size || random(2, 4), void 0 !== o.colorHue ? (this.colorHue = o.colorHue, this.color = getSpecificColor(o.colorHue)) : (this.color = getRainbowColor(), this.colorHue = colorIndex), this.vx = void 0 !== o.vx ? o.vx : random(-.5, .5), this.vy = void 0 !== o.vy ? o.vy : random(0, 1), this.gravity = o.gravity || .2, this.friction = o.friction || .98, this.settled = o.settled || !1, o.skipKeyCheck || this.checkSpecialGrain()
100
    }
101
    checkSpecialGrain() {
102
        keyIsDown(82) ? (this.color = getSpecificColor(0), this.colorHue = 0) : keyIsDown(79) ? (this.color = getSpecificColor(40), this.colorHue = 40) : keyIsDown(89) ? (this.color = getSpecificColor(60), this.colorHue = 60) : keyIsDown(71) ? (this.color = getSpecificColor(120), this.colorHue = 120) : keyIsDown(66) ? (this.color = getSpecificColor(240), this.colorHue = 240) : keyIsDown(73) ? (this.color = getSpecificColor(280), this.colorHue = 280) : keyIsDown(86) && (this.color = getSpecificColor(320), this.colorHue = 320)
103
    }
104
    update(e) {
105
        if (this.settled || gravityStopped) return;
106
        this.vy += this.gravity, this.vx *= this.friction;
107
        let t = this.x + this.vx,
108
            o = this.y + this.vy;
109
        (t < 0 || t >= width || o >= height) && (o >= height && (o = height - 1, this.settled = !0), t < 0 && (t = 0), t >= width && (t = width - 1));
110
        let i = min(floor(o) + 1, height - 1),
111
            r = floor(t);
112
        if (i < height && !e[i][r]) this.x = t, this.y = o;
113
        else {
114
            let l = max(r - 1, 0),
115
                s = min(r + 1, width - 1);
116
            i < height && !e[i][l] ? (this.x = t - 1, this.y = o, this.vx -= .1) : i < height && !e[i][s] ? (this.x = t + 1, this.y = o, this.vx += .1) : (this.x = r, this.y = floor(this.y), this.settled = !0)
117
        }
118
        let c = floor(this.x),
119
            a = floor(this.y);
120
        c >= 0 && c < width && a >= 0 && a < height && (e[a][c] = !0)
121
    }
122
    draw() {
123
        noStroke(), fill(this.color), circle(this.x, this.y, this.size)
124
    }
125
}
126
​
127
function setup() {
128
    createCanvas(windowWidth, windowHeight), resetGrid(), document.addEventListener("keydown", function(e) {
129
        "t" === e.key && (targetIndicatorsVisible = !targetIndicatorsVisible), "x" === e.key && toggleGravity()
130
    }), window.injectSand = injectSand, window.toggleGravity = toggleGravity, window.particles = particles, window.targetPositions = targetPositions, window.checkFlag = checkFlag
131
}
132
​
133
function resetGrid() {
134
    grid = [];
135
    for (let e = 0; e < height; e++) {
136
        grid[e] = [];
137
        for (let t = 0; t < width; t++) grid[e][t] = !1
138
    }
139
    flagRevealed = !1;
140
    let o = document.getElementById("flag-container");
141
    o.style.display = "none"
142
}
143
​
144
function draw() {
145
    if (background(30), isMousePressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
146
        for (let e = 0; e < 3; e++) {
147
            let t = new Particle(mouseX + random(-5, 5), mouseY + random(-5, 5));
148
            particles.push(t)
149
        }
150
    if (targetIndicatorsVisible)
151
        for (let o of (stroke(255, 150), strokeWeight(1), targetPositions)) noFill(), stroke(o.colorHue, 100, 100), circle(o.x, o.y, 30);
152
    let i = [];
153
    for (let r = 0; r < height; r++) {
154
        i[r] = [];
155
        for (let l = 0; l < width; l++) i[r][l] = !1
156
    }
157
    for (let s of particles) {
158
        s.update(grid), s.draw();
159
        let c = floor(s.x),
160
            a = floor(s.y);
161
        c >= 0 && c < width && a >= 0 && a < height && (i[a][c] = !0)
162
    }
163
    grid = i, checkFlag(), fill(255), textSize(16), text("Particles: " + particles.length, 10, height - 20)
164
}
165
​
166
function checkFlag() {
167
    if (flagRevealed) return;
168
    let e = 0,
169
        t = [];
170
    for (let o of targetPositions) {
171
        let i = !1;
172
        for (let r of particles)
173
            if (r.settled) {
174
                let l = dist(r.x, r.y, o.x, o.y),
175
                    s = min(abs(r.colorHue - o.colorHue), 360 - abs(r.colorHue - o.colorHue));
176
                if (l < 15 && s < 20) {
177
                    i = !0, t.push({
178
                        targetPos: `(${o.x}, ${o.y})`,
179
                        targetHue: o.colorHue,
180
                        particlePos: `(${Math.floor(r.x)}, ${Math.floor(r.y)})`,
181
                        particleHue: r.colorHue,
182
                        distance: Math.floor(l),
183
                        hueDifference: Math.floor(s)
184
                    });
185
                    break
186
                }
187
            } i && e++
188
    }
189
    e >= 7 && (flagRevealed = !0, console.log("\uD83C\uDF89 All positions correct! Retrieving flag..."), retrieveFlag())
190
}
191
​
192
function mousePressed() {
193
    isMousePressed = !0
194
}
195
​
196
function mouseReleased() {
197
    isMousePressed = !1
198
}
199
​
200
function keyPressed() {
201
    ("c" === key || "C" === key) && (particles = [], resetGrid())
202
}
203
​
204
function windowResized() {
205
    resizeCanvas(windowWidth, windowHeight), resetGrid()
206
}
207
​
