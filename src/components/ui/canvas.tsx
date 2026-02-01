// @ts-nocheck
/* eslint-disable */

function n(e) {
    this.init(e || {});
}
n.prototype = {
    init: function (e) {
        this.phase = e.phase || 0;
        this.offset = e.offset || 0;
        this.frequency = e.frequency || 0.001;
        this.amplitude = e.amplitude || 1;
    },
    update: function () {
        this.phase += this.frequency;
        return (this.offset + Math.sin(this.phase) * this.amplitude);
    },
    value: function () {
        return this.offset + Math.sin(this.phase) * this.amplitude;
    },
};

let ctx: CanvasRenderingContext2D | null = null;
let f: any = null;
let pos = { x: 0, y: 0 };
let lines: any[] = [];
const E = {
    debug: true,
    friction: 0.45,
    trails: 60,
    size: 80,
    dampening: 0.015,
    tension: 0.995,
};

function Node() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
}

function Line(e) {
    this.init(e || {});
}

Line.prototype = {
    init: function (e) {
        this.spring = e.spring + 0.1 * Math.random() - 0.05;
        this.friction = E.friction + 0.01 * Math.random() - 0.005;
        this.nodes = [];
        for (let i = 0; i < E.size; i++) {
            const t = new Node();
            t.x = pos.x;
            t.y = pos.y;
            this.nodes.push(t);
        }
    },
    update: function () {
        let e = this.spring;
        let t = this.nodes[0];
        t.vx += (pos.x - t.x) * e;
        t.vy += (pos.y - t.y) * e;
        for (let i = 0; i < this.nodes.length; i++) {
            t = this.nodes[i];
            if (i > 0) {
                const n = this.nodes[i - 1];
                t.vx += (n.x - t.x) * e;
                t.vy += (n.y - t.y) * e;
                t.vx += n.vx * E.dampening;
                t.vy += n.vy * E.dampening;
            }
            t.vx *= this.friction;
            t.vy *= this.friction;
            t.x += t.vx;
            t.y += t.vy;
            e *= E.tension;
        }
    },
    draw: function () {
        let e, t;
        let nx = this.nodes[0].x;
        let ny = this.nodes[0].y;
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        for (let a = 1; a < this.nodes.length - 2; a++) {
            e = this.nodes[a];
            t = this.nodes[a + 1];
            nx = 0.5 * (e.x + t.x);
            ny = 0.5 * (e.y + t.y);
            ctx.quadraticCurveTo(e.x, e.y, nx, ny);
        }
        e = this.nodes[this.nodes.length - 2];
        t = this.nodes[this.nodes.length - 1];
        ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
        ctx.stroke();
        ctx.closePath();
    },
};

function onMousemove(e: MouseEvent | TouchEvent) {
    function initLines() {
        lines = [];
        for (let i = 0; i < E.trails; i++) {
            lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
        }
    }

    function handleMove(e: MouseEvent | TouchEvent) {
        if ('touches' in e && e.touches) {
            pos.x = e.touches[0].pageX;
            pos.y = e.touches[0].pageY;
        } else if ('clientX' in e) {
            pos.x = e.clientX;
            pos.y = e.clientY;
        }
        e.preventDefault();
    }

    function handleTouchStart(e: TouchEvent) {
        if (e.touches.length === 1) {
            pos.x = e.touches[0].pageX;
            pos.y = e.touches[0].pageY;
        }
    }

    document.removeEventListener("mousemove", onMousemove as any);
    document.removeEventListener("touchstart", onMousemove as any);
    document.addEventListener("mousemove", handleMove as any);
    document.addEventListener("touchmove", handleMove as any);
    document.addEventListener("touchstart", handleTouchStart as any);
    handleMove(e);
    initLines();
    render();
}

function render() {
    if (!ctx || !(ctx as any).running) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ",90%,50%,0.015)";
    ctx.lineWidth = 12;

    for (let t = 0; t < E.trails; t++) {
        const line = lines[t];
        line.update();
        line.draw();
    }

    (ctx as any).frame++;
    requestAnimationFrame(render);
}

function resizeCanvas() {
    if (!ctx) return;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
}

export const renderCanvas = function () {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    if (!ctx) return;

    (ctx as any).running = true;
    (ctx as any).frame = 1;

    f = new n({
        phase: Math.random() * 2 * Math.PI,
        amplitude: 85,
        frequency: 0.0008,
        offset: 285,
    });

    document.addEventListener("mousemove", onMousemove as any);
    document.addEventListener("touchstart", onMousemove as any);
    document.body.addEventListener("orientationchange", resizeCanvas);
    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("focus", () => {
        if (ctx && !(ctx as any).running) {
            (ctx as any).running = true;
            render();
        }
    });

    window.addEventListener("blur", () => {
        if (ctx) {
            (ctx as any).running = true;
        }
    });

    resizeCanvas();
};

export const stopCanvas = function () {
    if (ctx) {
        (ctx as any).running = false;
    }
};
