const screenshot = require('screenshot-desktop');
const fs = require('fs');
const { PNG } = require('pngjs');

class ImageChangeDetection {
    constructor() {
        this.id = "defaut"
        this.isDebug = false;
        this.prevScreenshot = null;
        this.options = { threshold: 100, tolerance: 10 }
        this.region = {
            x: 100,     // x coordinate (from the left)
            y: 100,     // y coordinate (from the top)
            width: 200, // width of the region
            height: 150 // height of the region
        };
    }
    
    setIsDebug(bool) {
        this.isDebug = bool;
    }

    getImage() {
      const img = this.prevScreenshot ? PNG.sync.read(this.prevScreenshot) : null;
      const diff = this.#cropImage(img, this.region);
      return PNG.sync.write(diff);
    }

    saveImage() {
      if (!this.prevScreenshot) return console.log("CaptureAndCrop failed to save image!");
      
      this.#saveDiffImage(PNG.sync.read(this.prevScreenshot)) 
    }

    check(id, region, options) {
        if (id) this.#setId(id)
        if (region) this.#setRegion(region);
        if (options) this.#setOptions(options);

        return screenshot({ format: 'png' }).then((imgBuffer) => {
          const img1 = this.prevScreenshot ? PNG.sync.read(this.prevScreenshot) : null;
          const img2 = PNG.sync.read(imgBuffer);
            
          let isImageChanged = false; 

          if (img1) {
            const colorChangeCount = this.#compareImagesForColorChangeInRegion(img1, img2, this.region, this.options.tolerance);
            
            if (colorChangeCount > this.options.threshold) { // threshold for action

              if (this.isDebug) console.log('ID: %s Significant color change detected in region!', this.id);
              
              isImageChanged = true;
            }
          }
      
          this.#debuggMode(img2)
      
          this.prevScreenshot = imgBuffer;  // Save the current screenshot for the next comparison
          return isImageChanged;
        }).catch(console.error);
        
    }

    #getId() {
      return this.id.replace('\x1B[32m', '').replace('\x1B[0m', '')
    }

    #setId(id) {
        this.id = "\x1b[32m"+ id + "\x1b[0m"
    }

    #setOptions({threshold, tolerance}) {
        if (threshold) this.options.threshold = threshold;
        if (tolerance) this.options.tolerance = tolerance;
    }

    #setRegion({x, y, width, height}) {
        if (x) this.region.x = x;
        if (y) this.region.y = y;
        if (width) this.region.width = width;
        if (height) this.region.height = height;
    }

    #compareImagesForColorChangeInRegion = (img1, img2, region, tolerance = 10) => {
        const { x, y, width, height } = region;
        let colorChangeCount = 0;
        
        // Loop through the defined region only
        for (let row = y; row < y + height; row++) {
          for (let col = x; col < x + width; col++) {
            const idx = (row * img1.width + col) * 4;  // Calculate the index in the pixel array
            
            const pixel1 = [img1.data[idx], img1.data[idx + 1], img1.data[idx + 2]]; // RGB of img1
            const pixel2 = [img2.data[idx], img2.data[idx + 1], img2.data[idx + 2]]; // RGB of img2
      
            if (this.#pixelHasColorChanged(pixel1, pixel2, tolerance)) {
              colorChangeCount++;
            }
          }
        }
        
        return colorChangeCount;
    };

    #pixelHasColorChanged = (pixel1, pixel2, tolerance = 10) => {
        const rDiff = Math.abs(pixel1[0] - pixel2[0]);
        const gDiff = Math.abs(pixel1[1] - pixel2[1]);
        const bDiff = Math.abs(pixel1[2] - pixel2[2]);
      
        return rDiff > tolerance || gDiff > tolerance || bDiff > tolerance;
    };

    #cropImage(image, region) {
        const cropped = new PNG({ width: region.width, height: region.height });
      
        for (let row = 0; row < region.height; row++) {
          for (let col = 0; col < region.width; col++) {
            // Calculate the source index in the original image
            const idxSource = ((region.y + row) * image.width + (region.x + col)) * 4;
      
            // Calculate the index in the cropped image
            const idxTarget = (row * region.width + col) * 4;
      
            // Copy RGBA values from source to target
            cropped.data[idxTarget] = image.data[idxSource];       // Red
            cropped.data[idxTarget + 1] = image.data[idxSource + 1]; // Green
            cropped.data[idxTarget + 2] = image.data[idxSource + 2]; // Blue
            cropped.data[idxTarget + 3] = image.data[idxSource + 3]; // Alpha
          }
        }
      
        return cropped;
    }

    #saveDiffImage(img) {
        if (!img) return console.log("Image is empty!");
        
        const diff = this.#cropImage(img, this.region);
      
        // Save the diff image
        fs.writeFileSync(`./images/diff_${this.#getId()}.png`, PNG.sync.write(diff));
        console.log('ID: %s Difference image saved as diff.png', this.id);
    }

    #debuggMode(img) {
        if (this.isDebug) {
            this.#saveDiffImage(img)
        } 
    }
    
}

module.exports = ImageChangeDetection;