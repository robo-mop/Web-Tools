class MovingPaint
{
    constructor(canvas_element, subdivisions, color="red", bkg_color="white") {
        this.canvas = canvas_element;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx = this.canvas.getContext("2d");
        this.W = this.canvas.width, this.H = this.canvas.height;
        
        this.color = color;
        this.bkg_color = bkg_color;

        this.t = 0;
        this.subdivisions = subdivisions;
        this.phi = [];
        this.y_coords = [];
        for(let i = 0; i < this.subdivisions; ++i)
        {
            this.y_coords.push(this.H*map(Math.random(), 0, 1, i%2==0?0.6:0.4, i%2==0?0.7:0.5));
            this.phi.push(map(Math.random(), 0, 1, 0, Math.PI/2));
        }
    }

    paint()
    {
        this.t += 1;
        this.ctx.clearRect(0, 0, this.W, this.H);
        this.setBackground();
        this.ctx.fillStyle = this.color;
        this.start();
        this.ctx.moveTo(0, 0);

        let div = this.W/this.subdivisions;

        // Do shit with y_coords
        // Even means going down and then arcing up counter-clockwise
        for(let i = 0; i < this.subdivisions; ++i)
        {
            let y = this.y_coords[i] + 50*Math.sin(this.t/50 + this.phi[i]);
            this.ctx.lineTo(div*i, y);
            // Now Arc
            this.ctx.arc(div/2+div*i, y, div/2, Math.PI, 0, i%2==0);
            // this.ctx.moveTo(div*(i+1), y);
        }

        this.ctx.lineTo(this.W, 0);
        this.stop();
        this.ctx.fill();
    }

    handle_resize()
    {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.W = this.canvas.width, this.H = this.canvas.height;

        this.ctx.fillStyle = 'rgba('+this.color.join(", ")+')';
    }
    
    stop()
    {
        this.ctx.closePath();
    }
    
    start()
    {
        this.ctx.beginPath();
    }

    setBackground()
    {
        this.start();
        this.ctx.fillStyle = this.bkg_color;
        this.ctx.rect(0, 0, this.W, this.H);
        this.ctx.fill();
        this.stop();
    }
}