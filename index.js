const captureAndCrop = require("./captureAndCrop");

// Example 
const area = new captureAndCrop();
const area2 = new captureAndCrop()

// options are optional
const options =  { threshold: 100, tolerance: 10 }
const region = {
    x: 100,     // x coordinate (from the left)
    y: 100,     // y coordinate (from the top)
    width: 200, // width of the region
    height: 150 // height of the region
};

area.setIsDebug(true)
area.check("Test1", region, options)
area2.check()

setTimeout(async () =>{
    // detects movement
    const result = await area.check() 
    console.log("INDEX.js result : " + result);
    
    // croped image buffer
    const image = area.getImage();
    console.log(image);

    area.saveImage();
    
}, 2000)
