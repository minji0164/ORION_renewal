// ================== 스크롤 라이브러리 ==================
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

// ================== 비주얼 슬라이드 ==================
const mainSlide = new Splide('#main-slide', {
    type: 'loop',                   // 슬라이드 반복
    autoplay: true,                 // 자동 재생
    rewind: true,                   // 끝나면 처음으로
    interval: 5000,                 // 슬라이드 머무는 시간
    pauseOnHover: false,            // 마우스 올려도 멈추지 않음
    pauseOnFocus: false,            // 포커스되어도 멈추지 않음
    arrows: true,                  // 좌우 화살표 숨김
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
        mainSlide.go(index);
    });
});
mainSlide.on('mounted move', () => {
    updateProgress(mainSlide.index);
});

// 정지/재생 토글 버튼
const toggleButton = mainSlide.root.querySelector('.slide-toggle-btn');
const icon = toggleButton.querySelector('.slide-toggle-btn .icon');
mainSlide.on('autoplay:play', function () {
toggleButton.setAttribute('aria-label', 'Pause autoplay');
icon.textContent = 'pause'; 
});

mainSlide.on('autoplay:pause', function () {
toggleButton.setAttribute('aria-label', 'Start autoplay');
icon.textContent = 'play_arrow'; 
});
toggleButton.addEventListener( 'click', function () {
    var Autoplay = mainSlide.Components.Autoplay;
    if ( Autoplay.isPaused() ) {
        Autoplay.play();
    } else {
        Autoplay.pause();
    }
});

mainSlide.mount();

// ================== BRAND ESSENCE 각 카드 호버 시 이미지 변경 ==================
document.querySelectorAll('.main-brand .content li img').forEach(img => {
    const original = img.src;
    const hover = original.replace('.png', '_hover.png');
    
    img.parentElement.addEventListener('mouseenter', () => {
        img.src = hover;
    });
    img.parentElement.addEventListener('mouseleave', () => {
        img.src = original;
    });
});

// ================== PERFORMANCE 숫자 카운트업 ==================
// CountUp 인스턴스를 저장할 변수
let counters = [];
let hasAnimated = false; // 실행 여부 체크 변수 추가

function startCounters() {
    if (hasAnimated) return; // 이미 실행되었으면 종료
    hasAnimated = true; // 실행 표시

    // 카운터 설정: [id, 목표값, 소수점자리]
    const counterConfigs = [
        { id: 'counter01', endVal: 460 },
        { id: 'counter02', endVal: 4924 },
        { id: 'counter03', endVal: 11 },
        { id: 'counter04', endVal: 475 }
    ];

    // 각 카운터 초기화 및 시작
    counterConfigs.forEach((config, index) => {
        const options = {
            duration: 3,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: '',
            useEasing: true,
            useGrouping: true,
            decimalPlaces: config.decimals
        };

        counters[index] = new countUp.CountUp(config.id, config.endVal, options);
        
        if (!counters[index].error) {
            counters[index].start();
        } else {
            console.error(counters[index].error);
        }
    });
}

new Waypoint({
    element: document.getElementById('counter-section'),
    handler: function(direction) {
        if (direction === 'down') {
            startCounters();
        }
    },
    //offset: '50%'
    offset: 'bottom-in-view' //화면에 보이자마자 실행
});

// ================== BUSINESS 슬라이드 ==================
const businessSlide = new Splide('#main-business-slide', {
    type: '',                   // 슬라이드 반복
    autoplay: false,                 // 자동 재생
    rewind: true,                   // 끝나면 처음으로
    interval: 5000,                 // 슬라이드 머무는 시간
    pauseOnHover: false,            // 마우스 올려도 멈추지 않음
    pauseOnFocus: false,            // 포커스되어도 멈추지 않음
    arrows: false,                  // 좌우 화살표 숨김
    pagination: false,              // 하단 페이지네이션 숨김
    speed: 800,                     // 슬라이드 전환 속도
    perPage : 1,
    gap: '1.25rem',
    fixedWidth: '85%',
    focus: 'center',
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

// 커스텀 텍스트 페이지네이션
const textBars = document.querySelectorAll('.slide-business-progress .bar');

function changeBar(index) {
    textBars.forEach((bar, i) => {
        bar.classList.toggle('active', i === index);
    });
}

textBars.forEach((bar) => {
    bar.addEventListener('click', () => {
        const index = parseInt(bar.dataset.index);
        businessSlide.go(index);
    });
});

businessSlide.on('mounted move', () => {
    changeBar(businessSlide.index);
});

businessSlide.mount();