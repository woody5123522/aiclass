document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    // 導覽列滾動光影變化
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 240, 255, 0.15)';
            navbar.style.background = 'rgba(3, 4, 8, 0.96)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(3, 4, 8, 0.85)';
        }
    });

    // --- 動態星空背景 (Starfield Canvas) ---
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    let stars = [];
    const numStars = 180;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.3,
                alpha: Math.random(),
                twinkleSpeed: (Math.random() * 0.015) + 0.005,
                speedY: (Math.random() * 0.15) + 0.05 // 緩慢漂浮感
            });
        }
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            // 閃爍計算
            star.alpha += star.twinkleSpeed;
            if (star.alpha > 1 || star.alpha < 0.15) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }

            // 緩慢向上移動模擬太空航行
            star.y -= star.speedY;
            if (star.y < 0) {
                star.y = canvas.height;
                star.x = Math.random() * canvas.width;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initStars();
    });

    resizeCanvas();
    initStars();
    animateStars();

    console.log("Transmission received. May the Force be with you.");
});