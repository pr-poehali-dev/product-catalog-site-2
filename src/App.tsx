import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { Slider } from "@/components/ui/slider";

type Page = "home" | "catalog" | "contacts";

const PRODUCT_IMAGE = "https://cdn.poehali.dev/projects/f850495b-662d-4fd1-b6d1-c5aadff00943/files/dc9e5b2e-7bd2-4fed-9a98-7cad53bab7a8.jpg";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  material: string;
  inStock: boolean;
  tag?: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Объект А-17", category: "Электроника", price: 12900, material: "Металл", inStock: true, tag: "НОВ" },
  { id: 2, name: "Форма Б-3", category: "Аксессуары", price: 4500, material: "Пластик", inStock: true },
  { id: 3, name: "Структура В-9", category: "Мебель", price: 34000, material: "Дерево", inStock: false, tag: "ХИТ" },
  { id: 4, name: "Элемент Г-22", category: "Электроника", price: 8700, material: "Металл", inStock: true },
  { id: 5, name: "Деталь Д-5", category: "Аксессуары", price: 2100, material: "Ткань", inStock: true, tag: "−20%" },
  { id: 6, name: "Блок Е-11", category: "Мебель", price: 55000, material: "Металл", inStock: true },
  { id: 7, name: "Узел Ж-7", category: "Электроника", price: 19500, material: "Пластик", inStock: false },
  { id: 8, name: "Модуль З-1", category: "Аксессуары", price: 6800, material: "Кожа", inStock: true, tag: "НОВ" },
  { id: 9, name: "Система И-4", category: "Мебель", price: 27300, material: "Дерево", inStock: true },
];

const CATEGORIES = ["Все", "Электроника", "Аксессуары", "Мебель"];
const MATERIALS = ["Все", "Металл", "Пластик", "Дерево", "Ткань", "Кожа"];
const MAX_PRICE = 60000;

function formatPrice(p: number) {
  return p.toLocaleString("ru-RU") + " ₽";
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("Все");
  const [material, setMaterial] = useState("Все");
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (category !== "Все" && p.category !== category) return false;
      if (material !== "Все" && p.material !== material) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (onlyInStock && !p.inStock) return false;
      return true;
    });
  }, [category, material, priceRange, onlyInStock]);

  const nav = (p: Page) => { setPage(p); setMenuOpen(false); };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-body">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => nav("home")} className="font-display text-xl font-bold tracking-[0.3em] uppercase">
            <span className="text-[#0ABFBC]">MIKA</span>
            <span className="text-white">STORE</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {(["home", "catalog", "contacts"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => nav(p)}
                className={`font-display text-sm tracking-[0.2em] uppercase transition-all duration-200 ${page === p ? "text-[#0ABFBC]" : "text-white/50 hover:text-white"}`}
              >
                {p === "home" ? "Главная" : p === "catalog" ? "Каталог" : "Контакты"}
              </button>
            ))}
          </div>

          <button
            onClick={() => nav("catalog")}
            className="hidden md:flex items-center gap-2 bg-[#0ABFBC] text-[#0a0a0a] font-display text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 hover:bg-white transition-colors"
          >
            <Icon name="ShoppingBag" size={14} />
            Смотреть всё
          </button>

          <button className="md:hidden text-white/70" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a] px-6 py-4 flex flex-col gap-4">
            {(["home", "catalog", "contacts"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => nav(p)}
                className={`font-display text-sm tracking-[0.2em] uppercase text-left transition-all ${page === p ? "text-[#0ABFBC]" : "text-white/60"}`}
              >
                {p === "home" ? "Главная" : p === "catalog" ? "Каталог" : "Контакты"}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-16">
        {page === "home" && <HomePage onNavigate={nav} />}
        {page === "catalog" && (
          <CatalogPage
            products={filtered}
            category={category} setCategory={setCategory}
            material={material} setMaterial={setMaterial}
            priceRange={priceRange} setPriceRange={setPriceRange}
            onlyInStock={onlyInStock} setOnlyInStock={setOnlyInStock}
          />
        )}
        {page === "contacts" && <ContactsPage />}
      </main>
    </div>
  );
}

/* ─────────────── HOME ─────────────── */
function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const features = [
    { icon: "Car", label: "Бесплатная доставка", desc: "В черте города" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#0ABFBC]/5 blur-[80px]" />
          <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-[#E8153A]/5 blur-[60px]" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#0ABFBC]/10 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full py-20">
          <div className="animate-fade-in opacity-0" style={{ animationDelay: "0ms" }}>
            <div className="inline-flex items-center gap-2 border border-[#0ABFBC]/30 px-3 py-1 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0ABFBC] animate-pulse" />
              <span className="font-display text-xs tracking-[0.3em] text-[#0ABFBC] uppercase">Новая коллекция 2026</span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.9] uppercase mb-6">
              <span className="text-white">ФОРМА</span>
              <br />
              <span className="text-[#0ABFBC]">И</span>
              <br />
              <span className="text-white">СМЫСЛ</span>
            </h1>

            <p className="font-body text-white/50 text-lg mb-8 max-w-md leading-relaxed">
              Каталог предметов на пересечении функциональности и эстетики. Каждый объект — отдельный манифест.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => onNavigate("catalog")}
                className="font-display text-sm font-bold tracking-[0.2em] uppercase bg-[#0ABFBC] text-[#0a0a0a] px-8 py-4 hover:bg-white transition-all duration-200 hover:scale-105"
              >
                Открыть каталог
              </button>
              <button className="font-display text-sm tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors flex items-center gap-2">
                Узнать больше <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>

          <div className="animate-fade-in opacity-0 relative" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <div className="absolute inset-0 border border-[#0ABFBC]/20 translate-x-3 translate-y-3" />
              <img
                src={PRODUCT_IMAGE}
                alt="Продукт"
                className="w-full aspect-square object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-4 -right-4 z-20 bg-[#E8153A] px-4 py-2">
                <span className="font-display text-white text-xs font-bold tracking-[0.2em] uppercase">−20% сегодня</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-[#0ABFBC]/10 py-3 overflow-hidden bg-[#0ABFBC]/5">
        <div className="flex gap-0 animate-marquee whitespace-nowrap">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 pr-8">
              {Array(6).fill("MIKASTORE").map((t, j) => (
                <span key={j + i} className="font-display text-xs tracking-[0.4em] text-[#0ABFBC]/50 uppercase">{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 gap-0 border border-[#1a1a1a]">
          {features.map((f) => (
            <div
              key={f.label}
              className="p-8 group hover:bg-[#0ABFBC]/5 transition-colors duration-300"
            >
              <div className="w-10 h-10 border border-[#0ABFBC]/30 flex items-center justify-center mb-4 group-hover:border-[#0ABFBC] group-hover:bg-[#0ABFBC]/10 transition-all duration-300">
                <Icon name={f.icon} size={18} className="text-[#0ABFBC]" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-wider uppercase mb-2">{f.label}</h3>
              <p className="text-white/40 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-4xl font-bold uppercase">
            Разделы <span className="text-[#0ABFBC]">каталога</span>
          </h2>
          <button
            onClick={() => onNavigate("catalog")}
            className="text-white/40 text-sm hover:text-[#0ABFBC] transition-colors flex items-center gap-1 font-display tracking-wider"
          >
            Все товары <Icon name="ArrowRight" size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Электроника", count: 3, color: "#0ABFBC", icon: "Cpu" },
            { name: "Аксессуары", count: 3, color: "#E8153A", icon: "Watch" },
            { name: "Мебель", count: 3, color: "#FFE100", icon: "Armchair" },
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => onNavigate("catalog")}
              className="relative border border-[#1a1a1a] p-8 text-left transition-all duration-300 group overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(ellipse at 50% 100%, ${cat.color}15, transparent 70%)` }}
              />
              <Icon name={cat.icon} size={32} style={{ color: cat.color }} className="mb-4 relative z-10" />
              <div className="font-display text-xl font-bold uppercase mb-1 relative z-10">{cat.name}</div>
              <div className="text-white/30 text-sm relative z-10">{cat.count} товара</div>
              <Icon name="ArrowUpRight" size={16} className="absolute top-6 right-6 text-white/20 group-hover:text-white/60 transition-colors" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─────────────── CATALOG ─────────────── */
interface CatalogProps {
  products: Product[];
  category: string; setCategory: (v: string) => void;
  material: string; setMaterial: (v: string) => void;
  priceRange: number[]; setPriceRange: (v: number[]) => void;
  onlyInStock: boolean; setOnlyInStock: (v: boolean) => void;
}

function CatalogPage({ products, category, setCategory, material, setMaterial, priceRange, setPriceRange, onlyInStock, setOnlyInStock }: CatalogProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <div className="font-display text-xs tracking-[0.3em] uppercase text-[#0ABFBC] mb-3">Категория</div>
        <div className="space-y-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 text-sm font-body transition-all border-l-2 ${category === c ? "bg-[#0ABFBC]/10 text-[#0ABFBC] border-[#0ABFBC]" : "text-white/40 hover:text-white hover:bg-white/5 border-transparent"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-display text-xs tracking-[0.3em] uppercase text-[#0ABFBC] mb-3">Цена</div>
        <Slider min={0} max={MAX_PRICE} step={500} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
        <div className="flex justify-between text-xs text-white/40">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <div className="font-display text-xs tracking-[0.3em] uppercase text-[#0ABFBC] mb-3">Материал</div>
        <div className="flex flex-wrap gap-2">
          {MATERIALS.map((m) => (
            <button
              key={m}
              onClick={() => setMaterial(m)}
              className={`px-3 py-1 text-xs font-display tracking-wider uppercase transition-all border ${material === m ? "border-[#0ABFBC] text-[#0ABFBC] bg-[#0ABFBC]/10" : "border-[#2a2a2a] text-white/40 hover:border-white/30 hover:text-white"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button onClick={() => setOnlyInStock(!onlyInStock)} className="flex items-center gap-3 group">
          <div className={`w-4 h-4 border transition-all flex items-center justify-center ${onlyInStock ? "bg-[#0ABFBC] border-[#0ABFBC]" : "border-[#2a2a2a] group-hover:border-white/50"}`}>
            {onlyInStock && <Icon name="Check" size={10} className="text-[#0a0a0a]" />}
          </div>
          <span className="text-sm text-white/60 group-hover:text-white transition-colors">Только в наличии</span>
        </button>
      </div>

      <button
        onClick={() => { setCategory("Все"); setMaterial("Все"); setPriceRange([0, MAX_PRICE]); setOnlyInStock(false); }}
        className="font-display text-xs tracking-[0.2em] uppercase text-white/30 hover:text-[#E8153A] transition-colors flex items-center gap-2"
      >
        <Icon name="RotateCcw" size={12} /> Сбросить фильтры
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-display text-xs tracking-[0.4em] uppercase text-[#0ABFBC] mb-2">Весь ассортимент</div>
          <h1 className="font-display text-5xl font-bold uppercase">КАТАЛОГ</h1>
        </div>
        <div className="text-white/30 text-sm font-body">{products.length} из {PRODUCTS.length} товаров</div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel />
        </aside>

        <div className="flex-1 min-w-0">
          <button
            className="lg:hidden w-full flex items-center justify-between border border-[#1a1a1a] px-4 py-3 mb-6 text-sm font-display tracking-wider uppercase hover:border-[#0ABFBC]/30 transition-colors"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span className="flex items-center gap-2 text-white/60">
              <Icon name="SlidersHorizontal" size={16} /> Фильтры
            </span>
            <Icon name={filterOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-white/40" />
          </button>
          {filterOpen && (
            <div className="lg:hidden border border-[#1a1a1a] p-6 mb-6">
              <FilterPanel />
            </div>
          )}

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Icon name="SearchX" size={48} className="text-white/10 mb-4" />
              <p className="font-display text-xl uppercase text-white/20">Ничего не найдено</p>
              <p className="text-white/30 text-sm mt-2">Попробуйте изменить параметры фильтра</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="border border-[#1a1a1a] group card-hover cursor-pointer animate-fade-in opacity-0"
      style={{ animationDelay: `${index * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden aspect-square bg-[#111]">
        <img
          src={PRODUCT_IMAGE}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${hovered ? "scale-105 grayscale-0" : "grayscale"}`}
        />
        {product.tag && (
          <div className="absolute top-3 left-3 z-10 bg-[#E8153A] px-2 py-0.5">
            <span className="font-display text-white text-[10px] font-bold tracking-[0.3em] uppercase">{product.tag}</span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="font-display text-xs tracking-[0.4em] uppercase text-white/50 border border-white/20 px-3 py-1">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-display font-semibold uppercase tracking-wider text-sm">{product.name}</div>
            <div className="text-white/30 text-xs mt-0.5">{product.category} · {product.material}</div>
          </div>
          <div className="font-display font-bold text-[#0ABFBC] text-sm flex-shrink-0 ml-2">{formatPrice(product.price)}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── CONTACTS ─────────────── */
function ContactsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <div className="font-display text-xs tracking-[0.4em] uppercase text-[#0ABFBC] mb-2">Свяжитесь с нами</div>
          <h1 className="font-display text-5xl font-bold uppercase mb-8">
            КОН<span className="text-[#0ABFBC]">ТАК</span>ТЫ
          </h1>

          <div className="space-y-6">
            {[
              { icon: "Phone", label: "Телефон", value: "+7 (999) 000-00-00", href: "tel:+79990000000" },
              { icon: "Mail", label: "Email", value: "info@katalog.ru", href: "mailto:info@katalog.ru" },
            ].map((c) => (
              <a key={c.label} href={c.href} className="flex items-start gap-4 group">
                <div className="w-10 h-10 border border-[#1a1a1a] flex items-center justify-center flex-shrink-0 group-hover:border-[#0ABFBC]/30 transition-colors">
                  <Icon name={c.icon} size={16} className="text-[#0ABFBC]" />
                </div>
                <div>
                  <div className="font-display text-xs tracking-[0.2em] uppercase text-white/30 mb-0.5">{c.label}</div>
                  <div className="text-white/80 text-sm group-hover:text-[#0ABFBC] transition-colors">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="flex gap-3 mt-10">
            <a
              href="https://t.me/+79081866405"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#1a1a1a] px-4 py-2.5 text-white/40 hover:border-[#0ABFBC]/40 hover:text-[#0ABFBC] transition-all"
            >
              <Icon name="Send" size={15} />
              <span className="font-display text-xs tracking-[0.2em] uppercase">Telegram</span>
            </a>
            <a
              href="https://web.max.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#1a1a1a] px-4 py-2.5 text-white/40 hover:border-[#E8153A]/40 hover:text-[#E8153A] transition-all"
            >
              <Icon name="MessageSquare" size={15} />
              <span className="font-display text-xs tracking-[0.2em] uppercase">MAX</span>
            </a>
          </div>
        </div>

        <div className="border border-[#1a1a1a] p-8">
          <div className="font-display text-sm tracking-[0.3em] uppercase text-white/30 mb-6">Написать нам</div>
          <div className="space-y-4">
            {[
              { label: "Имя", type: "text", placeholder: "Ваше имя" },
              { label: "Email", type: "email", placeholder: "mail@example.com" },
              { label: "Телефон", type: "tel", placeholder: "+7 (___) ___-__-__" },
            ].map((f) => (
              <div key={f.label}>
                <label className="font-display text-[10px] tracking-[0.3em] uppercase text-white/30 mb-1.5 block">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#0ABFBC]/40 transition-colors font-body"
                />
              </div>
            ))}
            <div>
              <label className="font-display text-[10px] tracking-[0.3em] uppercase text-white/30 mb-1.5 block">Сообщение</label>
              <textarea
                rows={4}
                placeholder="Ваш вопрос или пожелание..."
                className="w-full bg-transparent border border-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-[#0ABFBC]/40 transition-colors font-body resize-none"
              />
            </div>
            <button className="w-full bg-[#0ABFBC] text-[#0a0a0a] font-display text-sm font-bold tracking-[0.3em] uppercase py-4 hover:bg-white transition-colors mt-2">
              Отправить сообщение
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}