const { Engine, Render, World, Bodies, Events } = Matter;

const engine = Engine.create();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const switchWidth = 60;
const switchHeight = 30;
const borderRadius = 15;

const switchColor = "#7071E8";
const switchOnColor = "#7071E8";
const switchOffColor = "#ddd";
const knobColor = "#fff";

let isSwitchOn = false;

function drawSwitch() {
    const switchX = canvas.width / 2 - switchWidth / 2;
    const switchY = canvas.height / 2 - switchHeight / 2;

    ctx.beginPath();
    ctx.moveTo(switchX + borderRadius, switchY);
    ctx.lineTo(switchX + switchWidth - borderRadius, switchY);
    ctx.arc(switchX + switchWidth - borderRadius, switchY + borderRadius, borderRadius, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(switchX + switchWidth, switchY + switchHeight - borderRadius);
    ctx.arc(switchX + switchWidth - borderRadius, switchY + switchHeight - borderRadius, borderRadius, 0, 0.5 * Math.PI);
    ctx.lineTo(switchX + borderRadius, switchY + switchHeight);
    ctx.arc(switchX + borderRadius, switchY + switchHeight - borderRadius, borderRadius, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(switchX, switchY + borderRadius);
    ctx.arc(switchX + borderRadius, switchY + borderRadius, borderRadius, Math.PI, 1.5 * Math.PI);
    ctx.fillStyle = isSwitchOn ? switchOnColor : switchOffColor;
    ctx.fill();

    const knobX = isSwitchOn ? switchX + switchWidth - 20 : switchX + 20;
    ctx.fillStyle = knobColor;
    ctx.beginPath();
    ctx.arc(knobX, switchY + switchHeight / 2, 10, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFF";
    ctx.font = "20px Arial";
    ctx.fillText("Switch Gravity", canvas.width / 2, switchY - 20);
}

function toggleSwitch(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const switchX = canvas.width / 2 - switchWidth / 2;
    const switchY = canvas.height / 2 - switchHeight / 2;

    if (clickX > switchX && clickX < switchX + switchWidth && clickY > switchY && clickY < switchY + switchHeight) {
        isSwitchOn = !isSwitchOn;
        engine.world.gravity.y = isSwitchOn ? 1 : -1;
    }
}

canvas.addEventListener("click", toggleSwitch);

const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false
    }
});

const circle1 = Bodies.circle(200, 200, 30, { restitution: 1 });
const circle2 = Bodies.circle(400, 200, 30, { restitution: 1 });
const circle3 = Bodies.circle(600, 200, 30, { restitution: 1 });

const square1 = Bodies.rectangle(200, 400, 50, 50, { restitution: 1 });
const square2 = Bodies.rectangle(400, 400, 50, 50, { restitution: 1 });
const square3 = Bodies.rectangle(600, 400, 50, 50, { restitution: 1 });

const triangle1 = Bodies.polygon(200, 600, 3, 30, { restitution: 1 });
const triangle2 = Bodies.polygon(400, 600, 3, 30, { restitution: 1 });
const triangle3 = Bodies.polygon(600, 600, 3, 30, { restitution: 1 });

engine.world.gravity.y = -0.05;
World.add(engine.world, [
    circle1, circle2, circle3,
    square1, square2, square3,
    triangle1, triangle2, triangle3
]);

const offset = 25;
const width = render.options.width;
const height = render.options.height;

const bounds = [
    Bodies.rectangle(width / 2, -offset, width + 2 * offset, 2 * offset, { isStatic: true }),
    Bodies.rectangle(width / 2, height + offset, width + 2 * offset, 2 * offset, { isStatic: true }),
    Bodies.rectangle(-offset, height / 2, 2 * offset, height + 2 * offset, { isStatic: true }),
    Bodies.rectangle(width + offset, height / 2, 2 * offset, height + 2 * offset, { isStatic: true })
];

World.add(engine.world, bounds);

Events.on(render, 'afterRender', () => {
    drawSwitch();
});

Engine.run(engine);
Render.run(render);