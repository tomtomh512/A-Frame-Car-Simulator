let player;
let lastTime = 0;
let keyPressed = {};
let camera;

window.onload = function () {
    const scene = document.querySelector("a-scene");
    player = new Sedan(0, 0, 90);
    scene.appendChild(player.obj);
    camera = document.querySelector("#camera");

    loop();
};

document.addEventListener('keydown', (event) => { keyPressed[event.key] = true });
document.addEventListener('keyup', (event) => { keyPressed[event.key] = false });

function loop() {
    const currentTime = performance.now();
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Move forward and backward
    if (keyPressed['ArrowUp'] || keyPressed['w']) {
        // If moving backward and press UP, apply braking
        if (player.velocity.x < 0) {
            player.acceleration = player.brake_deceleration;
        } else {
            player.acceleration += player.acceleration_factor * dt;
        }

    } else if (keyPressed['ArrowDown'] || keyPressed['s']) {
        // If moving forward and press DOWN, apply braking
        if (player.velocity.x > 0) {
            player.acceleration = -player.brake_deceleration;
        } else {
            player.acceleration -= player.acceleration_factor * dt;
        }

    } else if (keyPressed[' ']) {
        // Apply regular braking if the braking won't reverse velocity
        if (player.brake_deceleration * dt < Math.abs(player.velocity.x)) {
            player.acceleration = -Math.sign(player.velocity.x) * player.brake_deceleration;

        // When the player is moving slowly
        } else {
            if (dt !== 0) {
                // Calculate exact deceleration needed to stop
                player.acceleration = -player.velocity.x / dt;
            } else {
                player.acceleration = 0;
            }
        }

    } else {
        // Same logic as brake deceleration
        if (player.free_deceleration * dt < Math.abs(player.velocity.x)) {
            player.acceleration = -Math.sign(player.velocity.x) * player.free_deceleration;

        } else {
            if (dt !== 0) {
                player.acceleration = -player.velocity.x / dt;
            } else {
                player.acceleration = 0;
            }
        }

    }

    // Limit acceleration
    player.acceleration = Math.max(-player.max_acceleration, Math.min(player.acceleration, player.max_acceleration));

    // Move left and right
    if (keyPressed['ArrowRight'] || keyPressed['d']) {
        player.steering -= player.steering_factor * dt;
    } else if (keyPressed['ArrowLeft'] || keyPressed['a']) {
        player.steering += player.steering_factor * dt;
    } else {
        // Gradually return steering to 0
        if (Math.abs(player.steering) < player.steering_factor * dt) {
            player.steering = 0;
        } else {
            player.steering -= Math.sign(player.steering) * player.steering_factor * dt;
        }
    }

    // Limit steering
    player.steering = Math.max(-player.max_steering, Math.min(player.steering, player.max_steering));

    // Camera
    let camOffset = new Vector(-10, 0).rotate(-player.angle);
    let camX = player.position.x + camOffset.x;
    let camY = player.y + 7;
    let camZ = player.position.z + camOffset.z;

    let camAngleX = -30;
    let camAngleY = player.angle - 90;
    let camAngleZ = 0;

    // let camX = player.position.x;
    // let camY = player.y + 7;
    // let camZ = player.position.z + 10;
    //
    // let camAngleX = -30;
    // let camAngleY = 0;
    // let camAngleZ = 0;

    camera.setAttribute("position", `${camX} ${camY} ${camZ}`);
    camera.setAttribute("rotation", `${camAngleX} ${camAngleY} ${camAngleZ}`);

    player.update(dt);

    requestAnimationFrame(loop);
}
