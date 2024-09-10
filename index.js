const captureAndCrop = require("./captureAndCrop");

// EXAMPLE

// options are optional
const options =  { threshold: 100, tolerance: 10 }
const region = {
    x: 100,     // x coordinate (from the left)
    y: 100,     // y coordinate (from the top)
    width: 200, // width of the region
    height: 150 // height of the region
};

captureAndCrop.setIsDebug(false)

setInterval(async () =>{
    console.clear();
    // Takes a screenshot
    await captureAndCrop.snap() 

    // detects chance in pixels
    const checkArea1 = captureAndCrop.check("Area1", region, options)
    console.log("INDEX.js -- Area 1 check is : %s", checkArea1);

    const checkArea2 = captureAndCrop.check( 
        'Area2',
        {
            x: 300, 
            y: 500,    
            width: 20, 
            height: 15 
        }, { threshold: 10, tolerance: 5 }
    )
    console.log("INDEX.js -- Area 2 check is : %s",checkArea2);
    
    // cropped image buffer
    // const image = captureAndCrop.getImage();
    //console.log(image);

    // saves the image to images
    //captureAndCrop.saveImage();
    
}, 2000)
