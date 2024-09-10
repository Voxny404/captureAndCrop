# Node.js Screen Region Capture and Crop

This Node.js script captures the entire screen, extracts a specific region of interest (ROI) from the screenshot, and saves that cropped region as an image file. The cropped image can then be used to monitor or analyze specific parts of the screen for changes (useful in gaming, automation, etc.).

## Features
- Capture the screen using screenshot-desktop.
- Crop a defined rectangular region from the screenshot.
- Save the cropped region as a PNG file for further analysis or debugging.

## Dependencies
Before running the script, ensure you have the following packages installed:

- screenshot-desktop: For capturing screenshots.
- pngjs: For manipulating PNG images (reading, writing, cropping).

To install these dependencies, run the following command:
````
npm install screenshot-desktop pngjs
````

## How It Works
The script captures the entire screen using the screenshot-desktop package.
A specific region of the screen is defined by coordinates (x, y) along with its width and height.
The script extracts this region from the full screenshot.
The cropped region is saved as a PNG file (diff_{id}.png) in the images directory it will automatically save it in debug mode otherwise it is required to call saveImage()
The function getImage() returns an image buffer of the previous cropped image.

This takes a screenshot.
````
await captureAndCrop.snap();
````
This returns true when a change has been detected otherwise it will be false.

````
captureAndCrop.check("ID", region, options);
````

This saves the image cropped.
````
captureAndCrop.saveImage();
````

This returns the buffer of the previous image
````
captureAndCrop.getImage();
````

## Defining the Region
The region you want to monitor is defined by the following parameters:

- x: The horizontal coordinate of the top-left corner of the region (pixels from the left edge of the screen).
- y: The vertical coordinate of the top-left corner of the region (pixels from the top edge of the screen).
- width: The width of the region in pixels.
- height: The height of the region in pixels.

````
const region = {
  x: 100,     // x coordinate (100 pixels from the left edge)
  y: 100,     // y coordinate (100 pixels from the top edge)
  width: 200, // The region is 200 pixels wide
  height: 150 // The region is 150 pixels tall
};
````
This defines a region starting at coordinates (100, 100) and extending 200 pixels to the right and 150 pixels downward.

## Defining the Options
The available options are the following parameters:

- threshold: The threshold parameter is used to determine the sensitivity of detecting differences between two images. It controls how much difference between pixel values is needed to consider them as "different."
- tolerance: The tolerance parameter is used to control how much color change (or difference in RGB values) between two pixels is allowed before it’s considered a "change."

````
const options =  { 
    threshold: 100, 
    tolerance: 10 
}
````

### Example Use Cases
#### Low threshold/tolerance:
- Detects even the smallest visual changes (e.g., slight color shifts).
- Useful when you want high sensitivity, such as detecting small color changes in a game or subtle animations.
#### High threshold/tolerance:
- Ignores minor changes and focuses on larger visual differences.
- Useful when you want to avoid detecting small, irrelevant changes, such as noise, minor lighting differences, or anti-aliasing artifacts.


## Usage
1. Clone or download the script to your local machine.

2. Install the required dependencies:

````
npm install
````
3. Run the script using Node.js:

````
node index.js
````
This will capture the screen, crop the defined region, and save the image as (diff_{id}.png).

4. View the output: The cropped region image (diff_{id}.png) will be saved in the images directory.

## Example
Suppose you want to monitor a specific area in a game located at coordinates (100, 100) with a size of 200x150 pixels. After running the script, you can open the diff{id}.png file to see that specific area. This can help in detecting changes in the game, automation tasks, or for debugging purposes.