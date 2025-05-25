class Car {
    constructor(x, z, angle, length) {
        this.position = new Vector(x, z);   // x and z position of car (y irrelevant)
        this.angle = angle;     // Degrees
        this.length = length;

        this.velocity = new Vector(0, 0);
        this.max_velocity = 30;

        this.acceleration = 0;
        this.max_acceleration = 60;
        this.brake_deceleration = 30;
        this.free_deceleration = 30;

        this.steering = 0;      // Degrees; Positive = Left; Negative = Right
        this.max_steering = 20;

        // Tweaks to model
        this.angleOffset = 90;
        this.modelAngleOffset = -38.525;
        this.y = 0.5;   // Only needed for setting position
        this.modelScale = 2;

        this.obj = document.createElement("a-entity");
        this.obj.setAttribute("position", `${this.position.x} ${this.y} ${this.position.z}`);
        this.obj.setAttribute("rotation", `0 ${this.angle + this.angleOffset} 0`);

        this.model = document.createElement("a-gltf-model");
        this.model.setAttribute("src","models/low_poly_sedan.glb");
        this.model.setAttribute("scale", `${this.modelScale} ${this.modelScale} ${this.modelScale}`);
        this.model.setAttribute("position", `0 -0.6 0`);
        this.model.setAttribute("rotation", `0 ${this.modelAngleOffset} 0`);
        this.obj.appendChild(this.model);

        this.hitbox = document.createElement("a-box");
        this.hitbox.setAttribute("static-body", "");
        this.hitbox.setAttribute("height", 2.75);
        this.hitbox.setAttribute("width", 2.5);
        this.hitbox.setAttribute("depth", length + 1);
        this.hitbox.setAttribute("color", "green");
        this.hitbox.setAttribute("opacity", "0");
        this.hitbox.setAttribute("shader", "flat");
        this.hitbox.setAttribute("position", `0 0.75 0`);
        this.obj.appendChild(this.hitbox);
    }

    update(dt) {
        // Linear movement
        this.velocity = this.velocity.add(new Vector(this.acceleration * dt, 0));
        // Limit velocity
        this.velocity.x = Math.max(-this.max_velocity, Math.min(this.velocity.x, this.max_velocity));

        // Steering
        let angular_velocity = 0;

        // If steering angle is zero, angular velocity stays 0
        if (this.steering !== 0) {
            let turning_radius = this.length / Math.sin(degreesToRadians(this.steering));
            angular_velocity = this.velocity.x / turning_radius;
        }

        // Integrate velocity and angular velocity
        let rotated_velocity = this.velocity.rotate(-this.angle);
        this.position = this.position.add(rotated_velocity.multiply(dt));

        this.angle += radiansToDegrees(angular_velocity) * dt;

        // Update model position and rotation
        this.obj.setAttribute("position", `${this.position.x} ${this.y} ${this.position.z}`);
        this.obj.setAttribute("rotation", `0 ${this.angle + this.angleOffset} 0`);
    }

}