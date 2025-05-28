class Van extends Car {
    constructor(x, z, angle) {
        super(x, z, angle, 3.5, 15, 50, 50, 40, 30, 35, 25);
        this.modelScale = 2.2;

        this.model.setAttribute("src","models/low_poly_van.glb");
        this.model.setAttribute("scale", `${this.modelScale} ${this.modelScale} ${this.modelScale}`);
        // Model offsets
        this.model.setAttribute("position", "0 -0.6 0");
        this.model.setAttribute("rotation", "0 -38.525 0");

        this.hitbox.setAttribute("static-body", "");
        this.hitbox.setAttribute("height", 2.1);
        this.hitbox.setAttribute("width", 2.6);
        this.hitbox.setAttribute("depth", 5.7);
        this.hitbox.setAttribute("opacity", "0");
        this.hitbox.setAttribute("shader", "flat");
        this.hitbox.setAttribute("position", "0 1.2 -0.1");
    }
}