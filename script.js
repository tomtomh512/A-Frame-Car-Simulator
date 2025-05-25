let car;
let lastTime = 0;
let keyPressed = {};
let camera;

window.onload = function () {
    const scene = document.querySelector("a-scene");
    car = new Car(0, 0, 90, 4);
    scene.appendChild(car.model);
    camera = document.querySelector("#camera");

    loop();
};

document.addEventListener('keydown', (event) => { keyPressed[event.key] = true });
document.addEventListener('keyup', (event) => { keyPressed[event.key] = false });

let accelerationFactor = 50;
let steeringFactor = 30;    // 30 Degrees per second

function loop() {
    const currentTime = performance.now();
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Move forward and backward
    if (keyPressed['ArrowUp'] || keyPressed['w']) {
        // If moving backward and press UP, apply braking
        if (car.velocity.x < 0) {
            car.acceleration = car.brake_deceleration;
        } else {
            car.acceleration += accelerationFactor * dt;
        }

    } else if (keyPressed['ArrowDown'] || keyPressed['s']) {
        // If moving forward and press DOWN, apply braking
        if (car.velocity.x > 0) {
            car.acceleration = -car.brake_deceleration;
        } else {
            car.acceleration -= accelerationFactor * dt;
        }

    } else if (keyPressed[' ']) {
        // Use brake deceleration when SPACE is pressed
        car.acceleration = -Math.sign(car.velocity.x) * car.brake_deceleration;

    } else {
        // Use free deceleration when nothing is pressed
        car.acceleration = -Math.sign(car.velocity.x) * car.free_deceleration;

    }

    // Limit acceleration
    car.acceleration = Math.max(-car.max_acceleration, Math.min(car.acceleration, car.max_acceleration));

    // Move left and right
    if (keyPressed['ArrowRight'] || keyPressed['d']) {
        car.steering -= steeringFactor * dt;
    } else if (keyPressed['ArrowLeft'] || keyPressed['a']) {
        car.steering += steeringFactor * dt;
    } else {
        car.steering = 0;
    }

    // Limit steering
    car.steering = Math.max(-car.max_steering, Math.min(car.steering, car.max_steering));

    // Camera follow
    const camX = car.position.x;
    const camY = 7
    const camZ = car.position.z + 10;
    camera.setAttribute("position", `${camX} ${camY} ${camZ}`);
    camera.setAttribute("rotation", `-30 0 0`);

    car.update(dt);

    requestAnimationFrame(loop);
}
