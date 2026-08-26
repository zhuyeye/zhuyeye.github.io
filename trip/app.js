const tabs = document.querySelectorAll('.day-tab');
const panels = document.querySelectorAll('.day-panel');
const toast = document.getElementById('toast');
const checklistInputs = document.querySelectorAll('.check-item input');

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
  const text = `2026国庆景德镇·三清山·上饶·杭州\n\n9/30 深圳→景德镇：晚上抵达，入住休息。\n10/1 景德镇：中国陶瓷博物馆、御窑博物馆、陶溪川。\n10/2 景德镇上午：雕塑瓷厂；下午前往玉山。\n10/3 三清山：金沙索道、巨蟒出山、东方女神、玉台、南清园、阳光海岸；下山后前往上饶，夜逛信江江滨。\n10/4 上饶→杭州：高铁、龙井村、九溪烟树、西湖夜景。\n10/5 灵隐寺、飞来峰、西湖，14:00左右前往萧山机场，18:00航班。\n\n车次、票价和运营时间以官方公告为准。`;
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
