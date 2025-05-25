class Vector {
    constructor(x = 0, z = 0) {
        this.x = x;
        this.z = z;
    }

    clone() {
        return new Vector(this.x, this.z);
    }

    add(v) {
        return new Vector(this.x + v.x, this.z + v.z);
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.z - v.z);
    }

    multiply(scalar) {
        return new Vector(this.x * scalar, this.z * scalar);
    }

    divide(scalar) {
        if (scalar === 0) throw new Error("Cannot divide by zero");
        return new Vector(this.x / scalar, this.z / scalar);
    }

    magnitude() {
        return Math.hypot(this.x, this.z);
    }

    dot(v) {
        return this.x * v.x + this.z * v.z;
    }

    distanceTo(v) {
        return this.subtract(v).magnitude();
    }

    equals(v) {
        return this.x === v.x && this.z === v.z;
    }

    rotate(angleDegrees) {
        const angleRadians = degreesToRadians(angleDegrees);
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);

        return new Vector(this.x * cos - this.z * sin, this.x * sin + this.z * cos);
    }

    toString() {
        return `Vector(${this.x}, ${this.z})`;
    }
}
