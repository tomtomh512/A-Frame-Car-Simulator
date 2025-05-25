class Car {
    constructor(x, z, angle, length) {
        this.position = new Vector(x, z);   // x and z position of car (y irrelevant)
        this.angle = angle;     // Degrees
        this.length = length;

        this.y = 0.5;

        this.velocity = new Vector(0, 0);
        this.max_velocity = 25;

        this.acceleration = 0;
        this.max_acceleration = 50;
        this.brake_deceleration = 30;
        this.free_deceleration = 5;

        this.steering = 0;      // Degrees; Positive = Left; Negative = Right
        this.max_steering = 25;

        this.model = document.createElement("a-box");
        this.model.setAttribute("color", "red");
        this.model.setAttribute("depth", length);
        this.model.setAttribute("position", `${x} ${this.y} ${z}`);
        this.model.setAttribute("rotation", `0 ${angle} 0`);
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
        this.model.setAttribute("position", `${this.position.x} ${this.y} ${this.position.z}`);
        this.model.setAttribute("rotation", `0 ${this.angle + 90} 0`);
    }

}