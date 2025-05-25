![image](/Advanced_Screening/img/Screenshot%202025-05-25%20232150.png)

Fire up the container and intercept the request from burp-suit.

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20232439.png)

Put a test mail id in the input field to intercept request and now work with it.

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20232610.png)

Intresting, now changing the id to 'test@movieservice.ctf'

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20232725.png)

Nice, inspecting the web-page we also find a js file on which the web-app is running on.

From here we find the logic on which the web-page is working on, i have attached the js file too.

We find 2 endpoints
1) /api/validate/
2) /api/screen-token

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20233130.png)

Here I wasted a lot of time trying to bruteforce the validation code, this was useless, insted directly go to the screen-tocken endpoint and try things out.

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20233310.png)

Intresting we need a user_id, trying with user_id=1

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20233411.png)

Awsome we found somethign, the account had been deactivated.

Now run a sniper attack through Burp to find out for which user_id we get some responce form the web-server.

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20233620.png)

Ready to attack, we start the attack and get a hit!!!

We get something at user_id = 7. Viewing the responce at user_id=7

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20233843.png)

We have a hash, and no this is not the flag, reveiwing the js file we find this:

```
if (response.ok && data.user_id) {
                const tokenResponse = await fetch('/api/screen-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: data.user_id })
                });
                const tokenData = await tokenResponse.json();
                if (tokenResponse.ok && tokenData.hash) {
                    window.location.href = `/screen/?key=${tokenData.hash}`;
                } else {
                    alert("Failed to retrieve screening token.");
                }
            } else {
                alert("Invalid code. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying code:", error);
        }
```

Thus now sending a curl request or visiting this perticular site:

``
http://<challenge_url>/screen/?key=<hash-found>
``

![image](/Advanced_Screening/img/Screenshot%202025-05-25%20234311.png)

We get the flag.