// رقم الواتساب بصيغة دولية بدون + أو أصفار (غيّريه لرقمك)
const WHATSAPP_NUMBER = "966570261304";
const STORE_NAME = "رفّه";

const waLink = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  // تحديث روابط الواتساب الرئيسية
  const greet = `مرحباً ${STORE_NAME}، أرغب بالاستفسار عن العبايات.`;
  document.getElementById("waMain").href = waLink(greet);
  document.getElementById("waFloat").href = waLink(greet);

  // السنة في الفوتر
  document.getElementById("year").textContent = new Date().getFullYear();

  // الترويسة عند التمرير
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // قائمة الجوال
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    nav.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      nav.classList.remove("open");
    })
  );

  // ظهور العناصر عند التمرير
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  // فلترة المنتجات
  const chips = document.querySelectorAll(".chip");
  const products = document.querySelectorAll(".product");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      products.forEach((p) => {
        const show = filter === "all" || p.dataset.cat === filter;
        p.classList.toggle("hide", !show);
        if (show) p.classList.add("show");
      });
    })
  );

  // اختيار اللون: يغيّر لون العباءة في الصورة
  products.forEach((product) => {
    const art = product.querySelector(".abaya");
    const swatches = product.querySelectorAll(".sw");
    const firstColor = art.style.color;

    swatches.forEach((sw) => {
      if (sw.dataset.color && sw.style.getPropertyValue("--c") &&
          art.style.color.replace(/\s/g, "") === hexToRgb(sw.dataset.color)) {
        sw.classList.add("active");
      }
      sw.addEventListener("click", () => {
        swatches.forEach((s) => s.classList.remove("active"));
        sw.classList.add("active");
        art.style.color = sw.dataset.color;
        product.dataset.color = sw.getAttribute("aria-label") || "";
      });
    });
    if (!product.querySelector(".sw.active") && swatches[0]) {
      swatches[0].classList.add("active");
    }
    product.dataset.color = (product.querySelector(".sw.active") || {}).ariaLabel || "";
    void firstColor;
  });

  // طلب المنتج عبر واتساب
  document.querySelectorAll(".order").forEach((btn) =>
    btn.addEventListener("click", () => {
      const card = btn.closest(".product");
      const name = card.dataset.name;
      const price = card.dataset.price;
      const activeSw = card.querySelector(".sw.active");
      const color = activeSw ? activeSw.getAttribute("aria-label") : "";
      const msg =
        `مرحباً ${STORE_NAME} 🌟\n` +
        `أرغب بطلب: ${name}\n` +
        (color ? `اللون: ${color}\n` : "") +
        `السعر: ${price} ر.س\n` +
        `أرجو تزويدي بالمقاسات المتوفرة.`;
      window.open(waLink(msg), "_blank", "noopener");
    })
  );

  // عدّاد الأرقام
  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ar-EG");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  // حركة خفيفة للعباءة الرئيسية مع الماوس
  const hero = document.querySelector(".hero");
  const heroArt = document.querySelector(".hero-art");
  if (hero && heroArt && window.matchMedia("(hover:hover)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      heroArt.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
});

// تحويل hex إلى rgb للمقارنة
function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgb(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255})`;
}