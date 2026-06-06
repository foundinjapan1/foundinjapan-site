// What We Found — dynamic loader from GitHub + category filter

const REPO = "foundinjapan1/foundinjapan-site";
const BRANCH = "main";
const FOLDER = "_found";
const API = "https://api.github.com/repos/" + REPO + "/contents/" + FOLDER + "?ref=" + BRANCH;

const grid = document.getElementById("foundGrid");
const emptyState = document.getElementById("foundEmpty");
const filterBtns = document.querySelectorAll(".filter-btn");

let allCards = [];
let activeFilter = "all";

function parseFrontMatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  match[1].split("\n").forEach(function(line) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  });
  return data;
}

function parsePhotos(text) {
  const photos = [];
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return photos;
  const lines = match[1].split("\n");
  let inPhotos = false;
  lines.forEach(function(line) {
    if (line.trim() === "photos:") { inPhotos = true; return; }
    if (inPhotos) {
      if (line.match(/^[a-z]/i) && !line.startsWith(" ") && !line.startsWith("-")) {
        inPhotos = false; return;
      }
      const photoMatch = line.match(/photo:\s*(.+)/);
      if (photoMatch) photos.push(photoMatch[1].trim().replace(/^["']|["']$/g, ""));
    }
  });
  return photos;
}

const CATEGORY_LABELS = {
  "food-drink": "Food & Drink",
  "shops-markets": "Shops & Markets",
  "shrines-temples": "Shrines & Temples",
  "events": "Events",
  "places-sights": "Places & Sights"
};

function buildCard(data, photos) {
  const category = data.category || "food-drink";
  const label = CATEGORY_LABELS[category] || category;
  const hasMultiple = photos.length > 1;

  let imgHTML = "";
  if (photos.length > 0) {
    photos.forEach(function(src, i) {
      imgHTML += "<img src='" + src + "' alt='' loading='lazy' class='carousel-img" + (i === 0 ? " active" : "") + "' />";
    });
  } else {
    imgHTML = "<div style='height:200px;background:#e8e0d4;display:flex;align-items:center;justify-content:center;color:#999;font-size:0.85rem;'>No photo</div>";
  }

  const mapsLink = data.maps_url
    ? "<a href='" + data.maps_url + "' target='_blank' class='found-link found-link-map'><span>◎</span> Google Maps</a>"
    : "";
  const videoLink = data.video_url
    ? "<a href='" + data.video_url + "' target='_blank' class='found-link found-link-video'><span>▶</span> Watch Video</a>"
    : "";

  const card = document.createElement("div");
  card.className = "found-card";
  card.dataset.category = category;
  card.innerHTML =
    "<div class='found-card-img" + (hasMultiple ? " carousel" : "") + "' data-index='0'>" +
    imgHTML +
    "<span class='found-card-tag'>" + label + "</span>" +
    "</div>" +
    "<div class='found-card-body'>" +
    "<div class='found-card-meta'>" +
    "<span class='found-card-location'>" + (data.location || "") + "</span>" +
    "<span class='found-card-date'>" + (data.date || "") + "</span>" +
    "</div>" +
    "<h3 class='found-card-name'>" + (data.title || "Untitled") + "</h3>" +
    "<p class='found-card-note'>" + (data.note || "") + "</p>" +
    "<div class='found-card-links'>" + mapsLink + videoLink + "</div>" +
    "</div>";
  return card;
}

function initCarousel(cardEl) {
  const imgs = cardEl.querySelectorAll(".carousel-img");
  if (imgs.length <= 1) return;
  const wrap = cardEl.querySelector(".found-card-img");
  let idx = 0;

  const prev = document.createElement("button");
  prev.className = "carousel-btn carousel-prev";
  prev.innerHTML = "&#8249;";
  const next = document.createElement("button");
  next.className = "carousel-btn carousel-next";
  next.innerHTML = "&#8250;";

  const dots = document.createElement("div");
  dots.className = "carousel-dots";
  imgs.forEach(function(_, i) {
    const d = document.createElement("button");
    d.className = "carousel-dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", function() { goTo(i); });
    dots.appendChild(d);
  });

  wrap.appendChild(prev);
  wrap.appendChild(next);
  wrap.appendChild(dots);

  function goTo(n) {
    imgs[idx].classList.remove("active");
    dots.children[idx].classList.remove("active");
    idx = (n + imgs.length) % imgs.length;
    imgs[idx].classList.add("active");
    dots.children[idx].classList.add("active");
  }

  prev.addEventListener("click", function() { goTo(idx - 1); });
  next.addEventListener("click", function() { goTo(idx + 1); });
}

function applyFilter(filter) {
  activeFilter = filter;
  let visible = 0;
  allCards.forEach(function(card) {
    const match = filter === "all" || card.dataset.category === filter;
    if (match) {
      card.style.display = "flex";
      visible++;
      setTimeout(function() {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 20);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(8px)";
      setTimeout(function() { card.style.display = "none"; }, 250);
    }
  });
  if (emptyState) emptyState.style.display = visible === 0 ? "block" : "none";
}

filterBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    filterBtns.forEach(function(b) { b.classList.remove("active"); });
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});

async function loadFoundEntries() {
  grid.innerHTML = "<p style='color:#999;font-size:0.9rem;padding:2rem 0;'>Loading...</p>";
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error("Failed to fetch folder");
    const files = await res.json();
    const mdFiles = files.filter(function(f) { return f.name.endsWith(".md"); });
    grid.innerHTML = "";
    allCards = [];
    await Promise.all(mdFiles.map(async function(file) {
      const r = await fetch(file.download_url);
      const text = await r.text();
      const data = parseFrontMatter(text);
      const photos = parsePhotos(text);
      const card = buildCard(data, photos);
      allCards.push(card);
      grid.appendChild(card);
      initCarousel(card);
    }));
    if (allCards.length === 0) {
      if (emptyState) emptyState.style.display = "block";
    } else {
      applyFilter(activeFilter);
    }
  } catch(err) {
    grid.innerHTML = "<p style='color:#999;font-size:0.9rem;padding:2rem 0;'>Could not load entries.</p>";
    console.error(err);
  }
}

loadFoundEntries();
