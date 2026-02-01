// ================== Lenis 초기 설정 ==================
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

// ================== 커스텀 스크롤바 구현 ==================

$(function() { // 문서 준비 완료 후 실행
    const $container = $('#custom-scrollbar-container');
    const $thumb = $('#custom-scrollbar-thumb');

    let isDragging = false;
    let startY;
    let startScrollTop;
    let maxTranslate; // Thumb이 이동할 수 있는 최대 거리

    // 1. Thumb 높이 계산 및 설정
    function setThumbHeight() {
        const viewportHeight = window.innerHeight;
        const contentLimit = lenis.limit; 
        const containerHeight = $container.outerHeight();

        // 전체 내용 대비 현재 화면 비율
        const ratio = viewportHeight / (contentLimit + viewportHeight); 
        const thumbHeight = ratio * containerHeight;

        const minThumbHeight = 50; 
        $thumb.css('height', Math.max(thumbHeight, minThumbHeight) + 'px');
        
        // Thumb 높이가 변경되었으므로 최대 이동 거리도 다시 계산
        maxTranslate = containerHeight - $thumb.outerHeight();
    }

    // 2. Lenis 스크롤 이벤트 발생 시 Thumb 위치 업데이트
    lenis.on('scroll', (e) => {
        // 드래그 중이 아닐 때만 Lenis의 스크롤 이벤트를 반영
        if (isDragging) return; 

        const progress = e.progress;
        const translateY = progress * maxTranslate;

        // jQuery의 .css()를 사용하여 CSS transform 적용
        $thumb.css('transform', `translateY(${translateY}px)`);
    });

    // 3. 드래그 기능 이벤트 핸들러 (jQuery Events)

    // 드래그 시작 (mousedown)
    $thumb.on('mousedown', function(e) {
        e.preventDefault();
        
        isDragging = true;
        startY = e.clientY; 
        
        // 현재 적용된 transform 값 가져오기
        const transformMatrix = $thumb.css('transform');
        const matrix = new DOMMatrix(transformMatrix);
        startScrollTop = matrix.m42; // translateY 값 추출

        $('body').css('user-select', 'none'); // 텍스트 선택 방지
        $thumb.css('cursor', 'grabbing');
    });

    // 드래그 중 (mousemove) - document에 이벤트 바인딩
    $(document).on('mousemove', function(e) {
        if (!isDragging) return;

        const deltaY = e.clientY - startY; 
        let newTranslateY = startScrollTop + deltaY;
        
        // 경계값 제한
        newTranslateY = Math.max(0, Math.min(newTranslateY, maxTranslate));

        // Thumb 위치 업데이트 (시각적)
        $thumb.css('transform', `translateY(${newTranslateY}px)`);
        
        // Lenis 스크롤 이동 (실제)
        const progress = newTranslateY / maxTranslate;
        const actualScrollPosition = progress * lenis.limit; 
        
        // duration: 0 으로 설정하여 드래그 느낌을 살림
        lenis.scrollTo(actualScrollPosition, { duration: 0 });
    });

    // 드래그 종료 (mouseup) - document에 이벤트 바인딩
    $(document).on('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            $('body').css('user-select', '');
            $thumb.css('cursor', 'grab');
        }
    });

    // 초기 설정 및 창 크기 변경 시 재설정
    setThumbHeight();
    $(window).on('resize', setThumbHeight);
});

// ================== header ==================
const utilMenu = document.querySelector('.util-menu');
const langBtn  = utilMenu.querySelector('button:nth-child(2)');
const langMenu = utilMenu.querySelector('.lang-menu');

langBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // document 클릭 방지
    langMenu.classList.toggle('active');
});

document.addEventListener('click', () => {
    langMenu.classList.remove('active');
});

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

// ================== footer family site 슬라이드 업다운 ==================
const $button = $('#familySiteBtn');
const $list = $('#familySiteList');
const $icon = $button.find('.icon');

$button.on('click', function() {
    $list.slideToggle(300, function() {
        if ($list.is(':visible')) {
            $icon.text('remove');
        }
        else {
            $icon.text('add');
        }
    });
});