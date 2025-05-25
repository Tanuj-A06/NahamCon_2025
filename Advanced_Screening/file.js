async function requestAccessCode() {
    const email = document.getElementById('email').value;
    if (email) {
        try {
            const response = await fetch('/api/email/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                document.getElementById('modal').classList.add('active');
            } else {
                alert("Failed to send email. Please try again.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }
}

async function verifyCode() {
    const code = document.getElementById('code').value;
    if (code.length === 6) {
        try {
            const response = await fetch('/api/validate/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await response.json();
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
    }
}