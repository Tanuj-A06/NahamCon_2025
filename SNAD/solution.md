![image](/SNAD/img/Screenshot%202025-05-25%20210610.png)

Fire up the container and visit the site.

![image](/SNAD/img/Screenshot%202025-05-25%20210756.png)

Nothing intresting on the website.

Inspecting the source code. The script.js script looks intresting.

I have attached the beautified js file for further inspection.

What caught my eye was the following:

```
const requiredGrains = 7, targetPositions = [{ x: 367, y: 238, colorHue: 0 }, { x: 412, y: 293, colorHue: 40 }, { x: 291, y: 314, colorHue: 60 }, { x: 392, y: 362, colorHue: 120 }, { x: 454, y: 319, colorHue: 240 }, { x: 349, y: 252, colorHue: 280 }, { x: 433, y: 301, colorHue: 320 }]

toggelGravity()

injectSand()
```

The logic of the web-page is, that if teh perticular positions have a perticular colour in it the flag will be revealed.

Thus using injectSand(x,y,hue) with the traget positions.

![image](/SNAD/img/Screenshot%202025-05-25%20212217.png)

Injecting the sand gives us the flag.