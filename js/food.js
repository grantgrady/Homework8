class Food {
    constructor(x, y, size, color1, color2, shape, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.mainColor = color1;
        this.accentColor = color2;
        this.shape = shape; // 0 = circle, 1 = square
        this.type = type;   // "good" or "bad"
        this.collected = false;
        this.floatOffset = random(TWO_PI);
        this.moveTimer = floor(random(60, 180));
    }
    
    display() {
        if (this.collected) return;
        
        push();
        translate(this.x, this.y);
        
        let floatY = sin(frameCount * 0.05 + this.floatOffset) * 3;
        translate(0, floatY);
        
        // Add glow effect based on type
        if (this.type === "good") {
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = "rgba(255, 255, 0, 0.5)";
        } else {
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = "rgba(255, 0, 0, 0.5)";
        }
        
        if (this.shape === 0) {
            // Circle food (berry)
            fill(this.mainColor);
            noStroke();
            ellipse(0, 0, this.size, this.size);
            
            // Highlight
            fill(255, 255, 255, 150);
            ellipse(-3, -3, this.size/4, this.size/4);
            
            // Seeds or details
            fill(this.accentColor);
            for (let i = 0; i < 3; i++) {
                let angle = (TWO_PI / 3) * i;
                let x = cos(angle) * this.size/4;
                let y = sin(angle) * this.size/4;
                ellipse(x, y, 3, 3);
            }
            
            // Add type indicator (small symbol)
            if (this.type === "bad") {
                // Draw X for bad food
                stroke(0);
                strokeWeight(2);
                line(-8, -8, 8, 8);
                line(-8, 8, 8, -8);
            }
        } else {
            // Square food (cracker)
            fill(this.mainColor);
            noStroke();
            rectMode(CENTER);
            rect(0, 0, this.size, this.size, 3);
            
            // Holes
            fill(this.accentColor);
            ellipse(-5, -5, 4, 4);
            ellipse(5, 5, 4, 4);
            ellipse(5, -5, 3, 3);
            ellipse(-5, 5, 3, 3);
            
            // Add type indicator
            if (this.type === "bad") {
                // Draw X for bad food
                stroke(0);
                strokeWeight(2);
                line(-8, -8, 8, 8);
                line(-8, 8, 8, -8);
            }
        }
        
        drawingContext.shadowBlur = 0;
        
        pop();
    }
    
    update() {
        if (this.collected) return;
        
        this.moveTimer--;
        if (this.moveTimer <= 0) {
            this.x = random(100, 700);
            this.y = random(100, 500);
            
            this.moveTimer = floor(random(60, 180));
        }
    }
    
    checkCollection(cx, cy, radius) {
        if (this.collected) return false;
        let d = dist(cx, cy, this.x, this.y);
        return d < radius;
    }
    
    collect() {
        this.collected = true;
    }
    
    respawn() {
        this.collected = false;
        this.x = random(100, 700);
        this.y = random(100, 500);
        this.shape = floor(random(2));
        this.type = random(1) < 0.7 ? "good" : "bad";
        this.moveTimer = floor(random(60, 180));
    }
}
