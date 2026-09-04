'use strict';

const mediaRoot = '../videos/';
const list = document.getElementById('project-list');
const dialog = document.getElementById('player');
const fullVideo = document.getElementById('full-video');
const playerError = document.getElementById('player-error');
const toggle = document.getElementById('preview-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const visiblePreviews = new Set();
let previewsEnabled = !reducedMotion.matches && !navigator.connection?.saveData;
let returnFocus = null;
let previewObserver = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderWork(work) {
  const figure = element('figure', `work${work.orient === 'v' ? ' vertical' : ''}`);
  const button = element('button', 'frame');
  button.type = 'button';
  button.dataset.slug = work.slug;
  button.setAttribute('aria-label', `Смотреть: ${work.title}`);
  const poster = element('img');
  poster.src = `${mediaRoot}${work.slug}.jpg`;
  poster.alt = '';
  poster.loading = 'lazy';
  poster.decoding = 'async';
  const preview = element('video', 'preview');
  preview.dataset.src = `${mediaRoot}${work.slug}.preview.mp4`;
  preview.poster = poster.src;
  preview.muted = true;
  preview.loop = true;
  preview.playsInline = true;
  preview.preload = 'none';
  preview.tabIndex = -1;
  preview.setAttribute('aria-hidden', 'true');
  preview.addEventListener('error', () => { preview.hidden = true; });
  const icon = element('span', 'play-icon');
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<svg viewBox="0 0 20 20"><path d="M5 2 18 10 5 18Z"/></svg>';
  button.append(poster, preview, icon);
  button.addEventListener('click', () => openPlayer(work, button));
  figure.append(button, element('figcaption', '', work.title));
  return figure;
}

function renderProject(project, index) {
  const section = element('article', 'case');
  section.id = project.id;
  section.setAttribute('aria-labelledby', `${project.id}-title`);
  const meta = element('div', 'case-meta');
  const kicker = element('p', 'case-kicker');
  kicker.append(element('span', 'case-num', String(index + 1).padStart(2, '0')));
  const kind = {client: 'Заказчик', project: 'Проект', original: 'Авторский проект', test: 'Тестовое задание'};
  kicker.append(element('span', '', kind[project.kind] || 'Проект'));
  const title = element('h3', 'case-title', project.client || project.title);
  title.id = `${project.id}-title`;
  const theses = element('ul', 'case-theses');
  project.theses.forEach(thesis => theses.append(element('li', '', thesis)));
  if (!project.theses.length) theses.setAttribute('aria-hidden', 'true');
  const description = element('p', 'case-description', project.description);
  if (!project.description) description.setAttribute('aria-hidden', 'true');
  const media = element('div', `case-media${project.works.length === 1 ? ' single' : ''}`);
  project.works.forEach(work => media.append(renderWork(work)));
  meta.append(kicker, title, theses, description);
  section.append(meta, media);
  return section;
}

function syncPreviews() {
  toggle.setAttribute('aria-pressed', String(previewsEnabled));
  toggle.textContent = previewsEnabled ? 'Превью: вкл.' : 'Превью: выкл.';
  document.querySelectorAll('video.preview').forEach(video => {
    if (previewsEnabled && !dialog.open && !document.hidden && visiblePreviews.has(video) && !video.hidden) {
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}

function initPreviews() {
  previewObserver?.disconnect();
  visiblePreviews.clear();
  previewObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visiblePreviews.add(entry.target);
      else visiblePreviews.delete(entry.target);
    });
    syncPreviews();
  }, {threshold: .25});
  document.querySelectorAll('video.preview').forEach(video => previewObserver.observe(video));
  toggle.hidden = false;
  syncPreviews();
}

function startFullVideo() {
  fullVideo.play().catch(error => {
    if (!dialog.open || error.name === 'AbortError' || error.name === 'NotAllowedError') return;
    playerError.hidden = false;
  });
}

function openPlayer(work, trigger) {
  returnFocus = trigger;
  playerError.hidden = true;
  document.getElementById('player-title').textContent = work.title;
  dialog.classList.toggle('vertical', work.orient === 'v');
  fullVideo.poster = `${mediaRoot}${work.slug}.jpg`;
  fullVideo.src = `${mediaRoot}${work.slug}.mp4`;
  dialog.showModal();
  document.body.classList.add('player-open');
  syncPreviews();
  startFullVideo();
}

document.getElementById('close-player').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  fullVideo.pause();
  fullVideo.removeAttribute('src');
  fullVideo.load();
  document.body.classList.remove('player-open');
  returnFocus?.focus({preventScroll: true});
  returnFocus = null;
  syncPreviews();
});
fullVideo.addEventListener('contextmenu', event => event.preventDefault());
fullVideo.addEventListener('error', () => { if (dialog.open) playerError.hidden = false; });
document.getElementById('retry-video').addEventListener('click', () => {
  playerError.hidden = true;
  fullVideo.load();
  startFullVideo();
});
toggle.addEventListener('click', () => { previewsEnabled = !previewsEnabled; syncPreviews(); });
reducedMotion.addEventListener('change', () => { previewsEnabled = !reducedMotion.matches && !navigator.connection?.saveData; syncPreviews(); });
document.addEventListener('visibilitychange', syncPreviews);

async function loadProjects() {
  list.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error(`Projects: HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.projects)) throw new Error('Projects must be an array');
    const projects = data.projects.map(renderProject);
    list.replaceChildren(...projects);
    document.getElementById('project-count').textContent = String(projects.length).padStart(2, '0');
    if (!projects.length) list.append(element('p', 'status', 'Проекты скоро появятся.'));
    initPreviews();
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  } catch (error) {
    const message = element('div', 'status');
    message.setAttribute('role', 'alert');
    message.append(element('p', '', 'Не удалось загрузить проекты. Проверьте соединение и попробуйте ещё раз.'));
    const retry = element('button', 'button', 'Повторить загрузку');
    retry.type = 'button';
    retry.addEventListener('click', loadProjects);
    message.append(retry);
    list.replaceChildren(message);
    console.error(error);
  } finally {
    list.setAttribute('aria-busy', 'false');
  }
}

loadProjects();
