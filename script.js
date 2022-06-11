const carCanvas= document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas= document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx= carCanvas.getContext("2d");
const networkCtx= networkCanvas.getContext("2d");
const road=new Road(carCanvas.width/2,carCanvas.width*0.9);
const car = new Car(road.getLaneCenter(1),carCanvas.height/2,carCanvas.width/6,carCanvas.width/4,"ai");
const traffic = [new Car(road.getLaneCenter(1), -100, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -300, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(2), -300, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -500, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(1), -500, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(2), -700, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -700, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -700, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -825, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(1), -850, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(2), -975, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -700, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -1000, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(1), -1300, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(2), -1000, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -1800, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(0), -2200, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(1), -1900, carCanvas.width/6,carCanvas.width/4,"bot",2),
                    new Car(road.getLaneCenter(2), -2200, carCanvas.width/6,carCanvas.width/4,"bot",2),];
let N= 500;
if(localStorage.getItem("n")){
    N= localStorage.getItem("n")
}
let V=0.1;
if(localStorage.getItem("v")){
    V= localStorage.getItem("v")
}
const cars= generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0; i<cars.length; i++) {
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0) {
            NeuralNetwork.mutate(cars[i].brain,V/1000);
        }
    }

}
animate();
const nSlider=document.getElementById("nSlider");
    nSlider.value=localStorage.getItem("n");
const vSlider=document.getElementById("vSlider");
vSlider.value=localStorage.getItem("v");
saveSliders();

function save() {
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function saveSliders(){
    const nSlider=document.getElementById("nSlider");
    //nSlider.value=localStorage.getItem("n");
    const nText=document.getElementById("nslidertext");
    nText.innerHTML="N-value: "+ nSlider.value;
    localStorage.setItem("n",nSlider.value);
   // console.log(localStorage.getItem("n"));

    const vSlider=document.getElementById("vSlider");
    //nSlider.value=localStorage.getItem("n");
    const vText=document.getElementById("vslidertext");
    vText.innerHTML="Variance: "+ vSlider.value/1000;
    localStorage.setItem("v",vSlider.value);
}
function generateCars(N) {
    const cars=[];
    for (let i=1; i<=N; i++) {
        cars.push(new Car(road.getLaneCenter(1),carCanvas.height/2,carCanvas.width/6,carCanvas.width/4,"ai"))
    }
    return cars;
}

function animate(time)
{
    for(let i=0; i<traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for(let i=0; i<cars.length; i++) {
        cars[i].update(road.borders,traffic);
    }

    bestCar= cars.find( car => car.y==Math.min(...(cars.map(c=>c.y))));
    car.update(road.borders,traffic);
    carCanvas.height=window.innerHeight; //causes the page to be blank after each update so car doesn't drag after each update
    networkCanvas.height=window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    
    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++) {
        traffic[i].draw(carCtx,"black");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0; i<cars.length; i++) {
        cars[i].draw(carCtx,"green");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true)
    //console.log(cars.length)
    //car.draw(carCtx,"blue");
    carCtx.restore();
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}