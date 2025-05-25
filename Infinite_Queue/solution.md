![image](/Infinite_Queue/img/Screenshot%202025-05-25%20234855.png)

Fire up the container and thercept the request using burp

![image](/Infinite_Queue/img/Screenshot%202025-05-25%20235156.png)

Damn lest see the burp request.

![image](/Infinite_Queue/img/Screenshot%202025-05-25%20235235.png)

So all we need to do now is manipulate the token to get us in the front. Doing this with jwt.io

![image](/Infinite_Queue/img/Screenshot%202025-05-25%20235423.png)

Changing the queue time to 1s and re-sending the request.

![image](/Infinite_Queue/img/Screenshot%202025-05-25%20235528.png)

We trigger an error, ofc cauze we hadent added the jwt secret, which we now posses thanks to the secret.

![image](/Infinite_Queue/img/Screenshot%202025-05-25%20235652.png)

New malipulated request gets us in the front, navigating to /purchase endpoint with the same token,(found from the source code.)

![image](/Infinite_Queue/img/Screenshot%202025-05-25%20235830.png)

It's a PDF!!!

This most certainly contains our flag, saving the raw file as a pdf.

![image](/Infinite_Queue/img/Screenshot%202025-05-26%20000111.png)

That didn't work, so i asked google gemini to make me a script to get that pdf down to me, I have attached the same script.

![image](/Infinite_Queue/img/Screenshot%202025-05-26%20000343.png)

This pdf contained the flag.