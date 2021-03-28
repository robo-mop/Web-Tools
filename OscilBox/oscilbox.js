// Normal Helpers

function print(x)
{
    console.log(x);
}

function map(val, lb, ub, lv, uv)
{
    return lv + (val-lb)*(uv-lv)/(ub-lb);
}

// Actual OscilBox

class OscilBox
{
    constructor(canvas_element, box_count, box_width=undefined, standard_height=150, variant_height=50, time_factor=0.1, variant_angle=Math.PI)
    {
        this.canvas = canvas_element;
        this.canvas.width = canvas_element.clientWidth;
        this.canvas.height = canvas_element.clientHeight;
        this.box_count = box_count;
        this.standard_height = standard_height;
        this.variant_height = variant_height;
        this.time_factor = time_factor;
        this.variant_angle = variant_angle;
        
        // Constants
        // the multipliers mean: 1 unit in the skewed x axis produces x_mult change in the X axis, y_mult change in the Y axis
        this.x_mult = Math.cos(Math.PI/6) ** 2;
        this.y_mult = Math.cos(Math.PI/6) * Math.sin(Math.PI/6);
        
        // Presets
        this.DARK = [0, 0, 0];
        this.MAIN = [152, 152, 152];
        this.LIGHT = [255, 255, 255];
        
        // Calculate Shit
        this.W = this.canvas.width, this.H = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");
        this.box_width = box_width==undefined?Math.min(parseInt(this.W/this.x_mult/this.box_count), parseInt(this.H/this.y_mult/this.box_count)):box_width;
        this.center_height = this.H/2 + this.box_count/2*this.box_width*this.y_mult;
        this.max_d = Math.hypot((this.box_count-1)/2, (this.box_count-1)/2);
        
        // Variables used everywhere
        this.t = 0;
        this.c_x = -1, this.c_y = -1;
        this.offsetHeight = -1;
    }
    
    /*
    Recalculates constants
    */
    clean_up()
    {
        this.W = this.canvas.width, this.H = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");
        this.box_width = Math.min(parseInt(this.W/this.x_mult/this.box_count), parseInt(this.H/this.y_mult/this.box_count));
        this.center_height = this.H/2 + this.box_count/2*this.box_width*this.y_mult;
        this.max_d = Math.hypot((this.box_count-1)/2, (this.box_count-1)/2);
    }
    
    paint(obj)
    {
        this.t += 1;
        this.ctx.clearRect(0, 0, this.W, this.H);
        // setBackground(...BKG);
        for(let i = this.box_count-1; i >= 0; --i)
        {
            for(let j = this.box_count-1; j >= 0; --j)
            {
                this.offsetHeight = map(this.distance(i, j), 0, this.max_d, -this.variant_angle, this.variant_angle);
                this.box(i*this.box_width/2, j*this.box_width/2, this.box_width, this.box_width, this.standard_height + this.variant_height*Math.sin(this.t*this.time_factor + this.offsetHeight));
            }
        }
    }
    
    /*
    The box will be centered at x, y btw
    */
    box(x, y, size_x, size_y, size_z)
    {
        this.c_x = this.W/2+(this.x_mult*(x-y));
        this.c_y = this.center_height-this.y_mult*(x+y);
        // Draw left body
        this.setColor(...this.DARK);
        this.start();
        this.ctx.lineTo(this.c_x, this.c_y-(size_z/2 - this.y_mult*size_y/2)); // Top face bottom
        this.ctx.lineTo(this.c_x, this.c_y+(size_z/2 + this.y_mult*size_y/2)); // Bottom
        this.ctx.lineTo(this.c_x - this.x_mult*size_x/2, this.c_y+(size_z/2)); // Bottom Left
        this.ctx.lineTo(this.c_x - this.x_mult*size_x/2, this.c_y-(size_z/2)); // Top Left
        this.stop();
        this.ctx.fill();
        
        // Draw right body
        this.setColor(...this.LIGHT);
        this.start();
        this.ctx.lineTo(this.c_x, this.c_y-(size_z/2 - this.y_mult*size_y/2)); // Top face bottom
        this.ctx.lineTo(this.c_x, this.c_y+(size_z/2 + this.y_mult*size_y/2)); // Bottom
        this.ctx.lineTo(this.c_x + this.x_mult*size_x/2, this.c_y+(size_z/2)); // Bottom Right
        this.ctx.lineTo(this.c_x + this.x_mult*size_x/2, this.c_y-(size_z/2)); // Top Right
        this.stop();
        this.ctx.fill();
        
        // Draw Head
        this.setColor(...this.MAIN);
        this.start();
        this.ctx.moveTo(this.c_x, this.c_y-(size_z/2 + this.y_mult*size_y/2));
        this.ctx.lineTo(this.c_x - this.x_mult*size_x/2, this.c_y-(size_z/2));
        this.ctx.lineTo(this.c_x, this.c_y-(size_z/2 - this.y_mult*size_y/2));
        this.ctx.lineTo(this.c_x + this.x_mult*size_x/2, this.c_y-(size_z/2));
        this.stop();
        this.ctx.fill();
    }
    
    distance(ox, oy)
    {
        return Math.hypot(ox-(this.box_count-1)/2, oy-(this.box_count-1)/2);
    }
    
    /*
    DEPRECATED code because I removed the function call and did the calculation directly in box()
    */
    p_pos(x, y)
    {
        let new_x = this.x_mult*(x-y);
        let new_y = this.y_mult*(x+y);
        return [new_x, new_y];
    }
    
    setColor(r, g, b)
    {
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    }
    
    start()
    {
        this.ctx.beginPath();
    }
    
    stop()
    {
        this.ctx.closePath();
    }
    
    drawRect(x, y, width, height)
    {
        start();
        this.ctx.rect(x, y, width, height);
        this.ctx.stroke();
        stop();
    }
    
    fillRect(x, y, width, height)
    {
        start();
        this.ctx.rect(x, y, width, height);
        this.ctx.fill();
        stop();
    }
    
    drawCenteredRect(x, y, width, height)
    {
        start();
        this.ctx.rect(x-width/2, y-height/2, width, height);
        this.ctx.stroke();
        stop();
    }
    
    fillCenteredRect(x, y, width, height)
    {
        start();
        this.ctx.rect(x-width/2, y-height/2, width, height);
        this.ctx.fill();
        stop();
    }
    
    drawOval(x, y, width, height=-1)
    {
        start();
        if (height==-1) this.ctx.arc(x, y, width, 0, 2*Math.PI);
        else this.ctx.ellipse(x+width, y+height, width, height, 0, 0, 2*Math.PI);
        this.ctx.stroke();
        stop();
    }
    
    fillOval(x, y, width, height=-1)
    {
        start();
        if (height==-1) this.ctx.arc(x, y, width, 0, 2*Math.PI);
        else this.ctx.ellipse(x+width, y+height, width, height, 0, 0, 2*Math.PI);
        this.ctx.fill();
        stop();
    }
    
    setBackground(r, g, b)
    {
        setColor(r, g, b);
        fillRect(0, 0, W, H);
    }

    setPrimary(r, g, b)
    {
        this.MAIN = [r, g, b];
        this.DARK = this.MAIN.map((val)=>{
            return val/2;
        });
        this.LIGHT = this.MAIN.map((val)=>{
            return val + (255-val)/2;
        });
    }
}
