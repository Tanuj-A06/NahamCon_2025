![image](/Flagdle/img/Screenshot%202025-05-25%20215403.png)

Start the container and visit the site.

![image](/Flagdle/img/Screenshot%202025-05-25%20215551.png)

Use Burp Suite and send POST requests to /guess.

Start with:
``
POST {"guess":"flag{00000000000000000000000000000000}"}
``

Now iterate from '0' to '9' and 'a' to 'z'.

Yes we can automate this via a python script, but my scripting skills aren't too great.

So I sent each and every request to get the flag.