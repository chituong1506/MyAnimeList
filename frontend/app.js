function toggleForm(formId) {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('forgot-form').classList.add('hidden');
    document.getElementById(formId).classList.remove('hidden');
}

document.getElementById('register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            const otp = prompt(data.message + "\n\nNhập mã OTP 6 số của bạn vào ô bên dưới:");

            if (otp) {
                const verifyRes = await fetch('http://localhost:3000/api/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });

                const verifyData = await verifyRes.json();
                
                if (verifyRes.ok) {
                    alert("Xác thực thành công! Bây giờ bạn có thể đăng nhập.");
                    toggleForm('login-form');
                } else {
                    alert("Lỗi: " + verifyData.error);
                }
            }
        } else {
            alert("Lỗi: " + data.error);
        }
    } catch (err) {
        alert("Lỗi kết nối đến Server!");
    }
});

document.getElementById('login').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Tính năng Đăng nhập đang được xây dựng!");
});

document.getElementById('forgot').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Tính năng Quên mật khẩu đang được xây dựng!");
});