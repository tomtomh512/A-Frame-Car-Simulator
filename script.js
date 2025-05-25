let car;
let lastTime = 0;
let keyPressed = {};
let camera;

window.onload = function () {
    const scene = document.querySelector("a-scene");
    car = new Car(0, 0, 90, 4);
    scene.appendChild(car.obj);
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
        // Apply regular braking if the braking won't reverse velocity
        if (car.brake_deceleration * dt < Math.abs(car.velocity.x)) {
            car.acceleration = -Math.sign(car.velocity.x) * car.brake_deceleration;

        // When the car is moving slowly
        } else {
            if (dt !== 0) {
                // Calculate exact deceleration needed to stop
                car.acceleration = -car.velocity.x / dt;
            } else {
                car.acceleration = 0;
            }
        }

    } else {
        // Same logic as brake deceleration
        if (car.free_deceleration * dt < Math.abs(car.velocity.x)) {
            car.acceleration = -Math.sign(car.velocity.x) * car.free_deceleration;

        } else {
            if (dt !== 0) {
                car.acceleration = -car.velocity.x / dt;
            } else {
                car.acceleration = 0;
            }
        }

    }

    // Limit acceleration
    car.acceleration = Math.max(-car.max_acceleration, Math.min(car.acceleration, car.max_acceleration));

    // Move left and right
    if (keyPressed['ArrowRight'] || keyPressed['d']) {
        car.steering -= steeringFactor * dt;
    } else if (keyPressed['ArrowLeft'] || keyPressed['a']) {
        car.steering += steeringFactor * dt;
    } else {
        // Gradually return steering to 0
        if (Math.abs(car.steering) < steeringFactor * dt) {
            car.steering = 0;
        } else {
            car.steering -= Math.sign(car.steering) * steeringFactor * dt;
        }

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
