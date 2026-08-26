const tabs = document.querySelectorAll('.day-tab');
const panels = document.querySelectorAll('.day-panel');
const toast = document.getElementById('toast');
const checklistInputs = document.querySelectorAll('.check-item input');
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroIndex = 0;
let heroTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const day = tab.dataset.day;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === day));
  });
});

document.getElementById('printButton').addEventListener('click', () => window.print());

document.getElementById('copyButton').addEventListener('click', async () => {
  const text = `2026国庆景德镇·三清山·上饶·杭州\n\n9/30 深圳→景德镇：晚上抵达，入住全季景德镇北陶溪川酒店。\n10/1 景德镇：中国陶瓷博物馆、御窑博物馆、陶溪川，续住同一酒店。\n10/2 景德镇上午：雕塑瓷厂；下午前往隐泉·HolidayVilla望山观景民宿（三清山港首索道店）。\n10/3 三清山：港首索道上山，西海岸、三清宫、阳光海岸、南清园，金沙索道下山；取行李后前往上饶，夜逛信江江滨，住全季上饶高铁站酒店。\n10/4 上饶→杭州：高铁、龙井村、九溪烟树、西湖夜景，住全季杭州西湖武林广场酒店。\n10/5 灵隐寺、飞来峰、西湖，14:00左右前往萧山机场，18:00航班。\n\n车次、票价和运营时间以官方公告为准。`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('文字行程已复制');
  } catch {
    showToast('当前浏览器不支持自动复制，请使用打印功能');
  }
});

document.getElementById('shareButton').addEventListener('click', async () => {
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, text: '2026国庆景德镇、三清山、上饶、杭州行程攻略', url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('网页地址已复制');
    }
  } catch {
    showToast('分享已取消');
  }
});

function updateProgress() {
  const checked = [...checklistInputs].filter((input) => input.checked).length;
  document.getElementById('progressText').textContent = `${checked} / ${checklistInputs.length}`;
}

checklistInputs.forEach((input, index) => {
  const saved = window.localStorage.getItem(`trip-check-${index}`) === 'true';
  input.checked = saved;
  input.addEventListener('change', () => {
    window.localStorage.setItem(`trip-check-${index}`, input.checked);
    updateProgress();
  });
});

updateProgress();

function showHeroSlide(nextIndex) {
  heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, index) => {
    slide.classList.remove('active');
    if (index === heroIndex) {
      void slide.offsetWidth;
      slide.classList.add('active');
    }
  });
  heroDots.forEach((dot, index) => {
    const active = index === heroIndex;
    dot.classList.toggle('active', active);
    dot.toggleAttribute('aria-current', active);
  });
}

function scheduleHero() {
  window.clearInterval(heroTimer);
  if (reducedMotion.matches || heroSlides.length < 2) return;
  heroTimer = window.setInterval(() => showHeroSlide(heroIndex + 1), 6500);
}

heroDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    showHeroSlide(Number(dot.dataset.slideTo));
    scheduleHero();
  });
});

document.querySelector('.hero').addEventListener('mouseenter', () => window.clearInterval(heroTimer));
document.querySelector('.hero').addEventListener('mouseleave', scheduleHero);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) window.clearInterval(heroTimer);
  else scheduleHero();
});
reducedMotion.addEventListener?.('change', scheduleHero);
scheduleHero();
