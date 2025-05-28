class Car {
    constructor(x, z, angle, length, max_velocity, acceleration_factor, max_acceleration, brake_deceleration, free_deceleration, steering_factor, max_steering) {
        this.position = new Vector(x, z);   // x and z position of car (y irrelevant)
        this.angle = angle;     // Degrees
        this.length = length;

        this.velocity = new Vector(0, 0);
        this.max_velocity = max_velocity;

        this.acceleration_factor = acceleration_factor;
        this.acceleration = 0;
        this.max_acceleration = max_acceleration;
        this.brake_deceleration = brake_deceleration;
        this.free_deceleration = free_deceleration;

        this.steering_factor = steering_factor; // x degrees per second
        this.steering = 0;      // Degrees; Positive = Left; Negative = Right
        this.max_steering = max_steering;

        this.y = 0.5;   // Only needed for setting position
        this.angleOffset = 90;

        this.obj = document.createElement("a-entity");
        this.obj.setAttribute("position", `${this.position.x} ${this.y} ${this.position.z}`);
        this.obj.setAttribute("rotation", `0 ${this.angle + this.angleOffset} 0`);

        this.model = document.createElement("a-gltf-model");
        this.obj.appendChild(this.model);

        this.hitbox = document.createElement("a-box");
        this.obj.appendChild(this.hitbox);

        // Use this to line up wheels
        // this.measureWheelBase = document.createElement("a-box");
        // this.measureWheelBase.setAttribute("height", 2.75);
        // this.measureWheelBase.setAttribute("width", 3.5);
        // this.measureWheelBase.setAttribute("depth", this.length);
        // this.measureWheelBase.setAttribute("color", "green");
        // this.measureWheelBase.setAttribute("opacity", "0.5");
        // this.measureWheelBase.setAttribute("shader", "flat");
        // this.obj.appendChild(this.measureWheelBase);
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