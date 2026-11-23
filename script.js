document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // --- 1. 導覽列滾動狀態與當前區塊高亮 ---
    function handleScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentId = '';
        sections.forEach(section => {
            const top = section.offsetTop - 160;
            if (window.scrollY >= top) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- 2. 區塊滾動漸入動畫 ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. 互動式 PCB 軸體矩陣背景 (取代原本的星空畫布) ---
    const canvas = document.getElementById('pcb-canvas');
    const ctx = canvas.getContext('2d');

    const GRID_SIZE = 44;
    const pointer = { x: -9999, y: -9999 };
    const ripples = [];

    let width = 0;
    let height = 0;

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('mousemove', (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        pointer.x = -9999;
        pointer.y = -9999;
    });

    // 點擊時模擬軸體觸發的銅色訊號波紋
    window.addEventListener('mousedown', (e) => {
        ripples.push({
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            maxRadius: 180,
            alpha: 0.45
        });
    });

    function drawPCBGrid() {
        ctx.clearRect(0, 0, width, height);

        const cols = Math.ceil(width / GRID_SIZE) + 1;
        const rows = Math.ceil(height / GRID_SIZE) + 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * GRID_SIZE;
                const y = r * GRID_SIZE;

                const dx = x - pointer.x;
                const dy = y - pointer.y;
                const dist = Math.hypot(dx, dy);

                // 基礎焊點（暗不鏽鋼色）
                let radius = 1.2;
                let fill = 'rgba(226, 232, 240, 0.09)';

                // 滑鼠靠近時亮起銅色/酒紅微光，並畫出局部 PCB 矩陣連線
                if (dist < 170) {
                    const intensity = 1 - dist / 170;
                    radius = 1.2 + intensity * 1.8;
                    fill = `rgba(200, 138, 86, ${0.18 + intensity * 0.65})`;

                    if (c < cols - 1) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + GRID_SIZE, y);
                        ctx.strokeStyle = `rgba(158, 42, 59, ${intensity * 0.28})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                    if (r < rows - 1) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + GRID_SIZE);
                        ctx.strokeStyle = `rgba(200, 138, 86, ${intensity * 0.22})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = fill;
                ctx.fill();
            }
        }

        // 繪製點擊訊號波紋
        for (let i = ripples.length - 1; i >= 0; i--) {
            const rp = ripples[i];
            rp.radius += 5;
            rp.alpha *= 0.94;

            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(200, 138, 86, ${rp.alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            if (rp.alpha < 0.02 || rp.radius >= rp.maxRadius) {
                ripples.splice(i, 1);
            }
        }

        requestAnimationFrame(drawPCBGrid);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawPCBGrid();
});
