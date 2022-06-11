class Sensor {

    constructor(car) {
        this.car=car;
        this.rayCount=25;
        this.rayLength=150; //length of sensor detection
        this.raySpread=Math.PI/2; //45 degrees of spread between rays

        this.rays=[];
        this.readings=[];
    }

    update(roadBorders,traffic) {
        this.#castRays();
        this.readings=[];
        for(let i=0; i<this.rays.length; i++) {
            this.readings.push(this.#getReading(this.rays[i], roadBorders,traffic));
        }
    }

    #getReading(ray, roadBorders,traffic) {
        let touches=[];
        

        for(let i=0; i<roadBorders.length; i++) {
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
            if(touch) { //if a touch was found
                touches.push(touch);
            }
        }

        for(let i=0; i<traffic.length; i++) {
            const poly= traffic[i].polygon;
            for(let j=0; j<poly.length; j++) {
                const touch = getIntersection(ray[0], ray[1], poly[j], poly[(j+1) % poly.length]);
                if(touch) { //if a touch was found
                    touches.push(touch);
                }
            }
            
        }

        if(touches.length==0) {
            return null;
        }
        else {
            const offsets= touches.map(e=>e.offset); //retrieves the offset of each touch and puts it in list
            const minOffset=Math.min(...offsets); //finds the minimum of all offsets
            return touches.find(e=>e.offset==minOffset); //finds the touch that belongs to this offset and returns it as the reading
        }
    }

    #castRays()
    {
        this.rays=[];
        for(let i=0; i<this.rayCount; i++) {
            const rayAngle= lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount==1? 0.5 : i/(this.rayCount-1))+this.car.angle;

            //set the start and end between each ray
            const start={x:this.car.x, y:this.car.y};
            const end= {x:this.car.x-Math.sin(rayAngle)*this.rayLength, y:this.car.y-Math.cos(rayAngle)*this.rayLength};
            this.rays.push([start,end]);
        }
    }

    draw(ctx) {
        for(let i=0; i<this.rayCount; i++) {
            let end= this.rays[i][1];
            if(this.readings[i]) { //if there is a reading
                end=this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="red";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}