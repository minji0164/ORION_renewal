// 스크롤 라이브러리
document.addEventListener('DOMContentLoaded', function() {
    const lenis = new Lenis({
        duration: 1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    })
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
});

// 슬라이드 라이브러리
document.addEventListener('DOMContentLoaded', function () {
    const splide = new Splide('#main-slide', {
        type: 'loop',                   // 슬라이드 반복
        autoplay: true,                 // 자동 재생
        rewind: true,                   // 끝나면 처음으로
        interval: 5000,                 // 슬라이드 간 간격(ms)
        pauseOnHover: false,            // 마우스 올려도 멈추지 않음
        pauseOnFocus: false,            // 포커스되어도 멈추지 않음
        arrows: false,                  // 좌우 화살표 숨김
        pagination: false,              // 하단 페이지네이션 숨김
        speed: 800,                     // 슬라이드 전환 속도
        perPage : 1,
        resetProgress: false, // 프로그레스 리셋 방지
        intersection: {       // 뷰포트에 보일 때만 자동재생
            inView: {
                autoplay: true,
            },
            outView: {
                autoplay: false,
            },
        },
    });

    const bars = document.querySelectorAll('.slide-progress .bar');
    // 슬라이드에 따라 활성 막대 갱신
    function updateProgress(index) {
        bars.forEach((bar, i) => {
            bar.classList.toggle('active', i === index);
        });
    }
    // 막대 클릭 시 슬라이드 이동
    bars.forEach((bar) => {
        bar.addEventListener('click', () => {
            const index = parseInt(bar.dataset.index);
            splide.go(index);
        });
    });
    splide.on('mounted move', () => {
        updateProgress(splide.index);
    });

    // 정지/재생 토글 버튼
    const toggleButton = splide.root.querySelector('.slide-toggle-btn');
    const icon = toggleButton.querySelector('.slide-toggle-btn .icon');
    splide.on('autoplay:play', function () {
    toggleButton.setAttribute('aria-label', 'Pause autoplay');
    icon.textContent = 'pause'; 
    });

    splide.on('autoplay:pause', function () {
    toggleButton.setAttribute('aria-label', 'Start autoplay');
    icon.textContent = 'play_arrow'; 
    });
    toggleButton.addEventListener( 'click', function () {
        var Autoplay = splide.Components.Autoplay;
        if ( Autoplay.isPaused() ) {
            Autoplay.play();
        } else {
            Autoplay.pause();
        }
    });

    splide.mount();
    
});