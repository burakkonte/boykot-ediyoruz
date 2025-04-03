import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { XCircle, CheckCircle, Search, X, MessageSquare, ChevronDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Google Fonts için font importları
import WebFont from "webfontloader";

// Marka listesi (sadece CHP’nin boykot çağrısı yaptığı markalar)

// Marka listesi (İhlas Haber Ajansı eklendi)
const brandList = [
  "TRT",
  "CNN Türk",
  "A Haber",
  "Beyaz TV",
  "NTV",
  "Star TV",
  "Kral FM",
  "Türkiye Gazetesi",
  "Akşam Gazetesi",
  "Yeni Şafak",
  "Nusr-Et",
  "Günaydın Restoran",
  "EspressoLab",
  "D&R",
  "İdefix",
  "Turkuaz Yayınevi",
  "Demirören AVM",
  "Kilim Mobilya",
  "İhlas Ev Aletleri",
  "Ülker",
  "Milli Piyango",
  "misli.com",
  "iddia.com",
  "ETS Tur",
  "Volkswagen",
  // Yeni eklenen markalar
  "Anadolu Ajansı",
  "Dbl",
  "Audi",
  "Beyaz",
  "Doğuş",
  "BirGün FM",
  "Naber",
  "Skoda",
  "TGRT",
  "DHA",
  "HBR",
  "aTV",
  "Sabah",
  "Kanal D",
  "Demirören",
  "Turkuvaz",
  "Milliyet",
  "Misli",
  "İkadaş",
  "İhlas Panorama",
  "İhlas Haber Ajansı" // Yeni eklenen marka
];

// Marka kategorileri (İhlas Haber Ajansı eklendi)
const brandCategories = {
  "TRT": "Medya",
  "CNN Türk": "Medya",
  "A Haber": "Medya",
  "Beyaz TV": "Medya",
  "NTV": "Medya",
  "Star TV": "Medya",
  "Kral FM": "Medya",
  "Türkiye Gazetesi": "Medya",
  "Akşam Gazetesi": "Medya",
  "Yeni Şafak": "Medya",
  "Nusr-Et": "Restoran",
  "Günaydın Restoran": "Restoran",
  "EspressoLab": "Kafe",
  "D&R": "Yayıncılık",
  "İdefix": "Yayıncılık",
  "Turkuaz Yayınevi": "Yayıncılık",
  "Demirören AVM": "Perakende",
  "Kilim Mobilya": "Perakende",
  "İhlas Ev Aletleri": "Perakende",
  "Ülker": "Gıda",
  "Milli Piyango": "Şans Oyunları",
  "misli.com": "Bahis",
  "iddia.com": "Bahis",
  "ETS Tur": "Turizm",
  "Volkswagen": "Otomotiv",
  // Yeni eklenen markalar için kategoriler
  "Anadolu Ajansı": "Medya",
  "Dbl": "Medya",
  "Audi": "Otomotiv",
  "Beyaz": "Medya",
  "Doğuş": "Otomotiv",
  "BirGün FM": "Medya",
  "Naber": "Medya",
  "Skoda": "Otomotiv",
  "TGRT": "Medya",
  "DHA": "Medya",
  "HBR": "Medya",
  "aTV": "Medya",
  "Sabah": "Medya",
  "Kanal D": "Medya",
  "Demirören": "Perakende",
  "Turkuvaz": "Medya",
  "Milliyet": "Medya",
  "Misli": "Bahis",
  "İkadaş": "Perakende",
  "İhlas Panorama": "Yayıncılık",
  "İhlas Haber Ajansı": "Medya" // Yeni eklenen marka
};

// Marka boykot nedenleri ve alternatifler (İhlas Haber Ajansı eklendi)
const brandReasons = {
  "TRT": {
    reason: "Kamu yayıncılığı tarafsızlığını yitirdiği için boykot edilmektedir.",
    alt: "Halk TV"
  },
  "CNN Türk": {
    reason: "Tarafsız yayıncılık ilkesine aykırı olarak hükümet yanlısı yayın yaptığı gerekçesiyle boykot edilmektedir.",
    alt: "Halk TV"
  },
  "A Haber": {
    reason: "İktidar propagandası yaptığı gerekçesiyle boykot edilmektedir.",
    alt: "Halk TV"
  },
  "Beyaz TV": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Halk TV"
  },
  "NTV": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Halk TV"
  },
  "Star TV": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Fox TV"
  },
  "Kral FM": {
    reason: "İktidara yakınlığı ve taraflı medya organlarına reklam verdiği için boykot edilmektedir.",
    alt: "Power FM"
  },
  "Türkiye Gazetesi": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Sözcü Gazetesi"
  },
  "Akşam Gazetesi": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Cumhuriyet Gazetesi"
  },
  "Yeni Şafak": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "BirGün Gazetesi"
  },
  "Nusr-Et": {
    reason: "Sahibi Nusret’in siyasi duruşu nedeniyle boykot edilmektedir.",
    alt: "Günaydın Et"
  },
  "Günaydın Restoran": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Köşebaşı"
  },
  "EspressoLab": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Local Coffee Shops"
  },
  "D&R": {
    reason: "Demirören Grubu’na ait olması nedeniyle boykot edilmektedir.",
    alt: "Kitapyurdu"
  },
  "İdefix": {
    reason: "Demirören grubuna bağlı olduğu için boykot edilmektedir.",
    alt: "BKM Kitap"
  },
  "Turkuaz Yayınevi": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Can Yayınları"
  },
  "Demirören AVM": {
    reason: "Demirören Grubu’na ait olması nedeniyle boykot edilmektedir.",
    alt: "Bağımsız mağazalar"
  },
  "Kilim Mobilya": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "İstikbal"
  },
  "İhlas Ev Aletleri": {
    reason: "İhlas Holding’in hükümete yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Arçelik"
  },
  "Ülker": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Eti"
  },
  "Milli Piyango": {
    reason: "Devlet destekli şans oyunlarının etik dışı algılanması nedeniyle boykot edilmektedir.",
    alt: "Bağımsız piyango girişimleri"
  },
  "misli.com": {
    reason: "Kamu destekli bahis yapısı nedeniyle boykot edilmektedir.",
    alt: "Bahigo (sorumluluk alarak kullanılması tavsiye edilir)"
  },
  "iddia.com": {
    reason: "Kamu destekli kumar platformu olarak boykot edilmektedir.",
    alt: "Alternatif önerilmemektedir."
  },
  "ETS Tur": {
    reason: "İktidara yakın yatırımlar ve medya sponsorluğu nedeniyle boykot edilmektedir.",
    alt: "Jolly Tur"
  },
  "Volkswagen": {
    reason: "İktidara yakınlığı ve taraflı medya organlarına reklam verdiği için boykot edilmektedir.",
    alt: "Toyota"
  },
  "Anadolu Ajansı": {
    reason: "Kamu kuruluşu olarak tarafsızlığını yitirdiği ve iktidar yanlısı yayın yaptığı gerekçesiyle boykot edilmektedir.",
    alt: "Halk TV"
  },
  "Dbl": {
    reason: "İktidara yakın medya kuruluşuyla bağlantılı olduğu için boykot edilmektedir.",
    alt: "Power FM"
  },
  "Audi": {
    reason: "İktidara yakın reklam politikaları nedeniyle boykot edilmektedir.",
    alt: "Toyota"
  },
  "Beyaz": {
    reason: "İktidara yakın yayın politikaları nedeniyle boykot edilmektedir.",
    alt: "Fox TV"
  },
  "Doğuş": {
    reason: "İktidara yakın grup şirketi olması nedeniyle boykot edilmektedir.",
    alt: "Ford"
  },
  "BirGün FM": {
    reason: "İktidara yakınlık ve taraflı yayıncılık nedeniyle boykot edilmektedir.",
    alt: "Power FM"
  },
  "Naber": {
    reason: "İktidara yakın medya kuruluşuyla ilişkilendirildiği için boykot edilmektedir.",
    alt: "Sözcü"
  },
  "Skoda": {
    reason: "İktidara yakın reklam politikaları nedeniyle boykot edilmektedir.",
    alt: "Renault"
  },
  "TGRT": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Halk TV"
  },
  "DHA": {
    reason: "Tarafsız haber politikası izlememek ve iktidar yanlısı yayın yapmak nedeniyle boykot edilmektedir.",
    alt: "Anka Haber Ajansı"
  },
  "HBR": {
    reason: "Demirören Grubu’na bağlı olarak iktidar yanlısı yayın yaptığı gerekçesiyle boykot edilmektedir.",
    alt: "BirGün"
  },
  "aTV": {
    reason: "İktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Fox TV"
  },
  "Sabah": {
    reason: "İktidara yakın yayın politikaları nedeniyle boykot edilmektedir.",
    alt: "Cumhuriyet"
  },
  "Kanal D": {
    reason: "İktidara yakınlık ve taraflı yayıncılık nedeniyle boykot edilmektedir.",
    alt: "Sözcü"
  },
  "Demirören": {
    reason: "Demirören Grubu’nun iktidara yakınlığı nedeniyle boykot edilmektedir.",
    alt: "Bağımsız mağazalar"
  },
  "Turkuvaz": {
    reason: "İktidara yakın medya grubu olması nedeniyle boykot edilmektedir.",
    alt: "Can Yayınları"
  },
  "Milliyet": {
    reason: "İktidara yakın yayın politikaları nedeniyle boykot edilmektedir.",
    alt: "Sözcü"
  },
  "Misli": {
    reason: "Kamu destekli bahis yapısı nedeniyle boykot edilmektedir.",
    alt: "Bahigo (sorumlulukla)"
  },
  "İkadaş": {
    reason: "İktidara yakın grup şirketi ile ilişkilendirildiği için boykot edilmektedir.",
    alt: "Bağımsız mağazalar"
  },
  "İhlas Panorama": {
    reason: "İhlas Holding’in hükümete yakınlığı nedeniyle boykot edilmektedir.",
    alt: "BKM Kitap"
  },
  "İhlas Haber Ajansı": {
    reason: "İhlas Holding’in iktidara yakınlığı ve tarafsızlıktan uzak haber politikaları nedeniyle boykot edilmektedir.",
    alt: "Anka Haber Ajansı" // Alternatif olarak tarafsız bir haber ajansı önerildi
  }
};

// Arama için normalize edilmiş marka listesi oluşturma (İhlas Haber Ajansı eklendi)
const normalizedBrandList = brandList.map(brand => ({
  original: brand,
  normalized: brand
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
}));

// Diğer kısımlar aynen kalıyor (Fuse.js yapılandırması, App fonksiyonu ve geri kalan kod)

// Fuse.js yapılandırması (daha esnek arama için)
const fuse = new Fuse(normalizedBrandList, {
  keys: ["normalized"],
  threshold: 0.2,
  includeScore: true,
  ignoreLocation: true,
  distance: 100,
});

// Yıldız animasyonu için yardımcı fonksiyonlar
const createStars = (count, canvasWidth, canvasHeight) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.5
    });
  }
  return stars;
};

const animateStars = (ctx, stars, canvasWidth, canvasHeight, isDark) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  stars.forEach(star => {
    star.x += star.speedX;
    star.y += star.speedY;

    if (star.x < 0) star.x = canvasWidth;
    if (star.x > canvasWidth) star.x = 0;
    if (star.y < 0) star.y = canvasHeight;
    if (star.y > canvasHeight) star.y = 0;

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${star.opacity})` : `rgba(100, 100, 100, ${star.opacity})`;
    ctx.fill();
  });
};

function App() {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [placeholder, setPlaceholder] = useState("Marka ara (örneğin, Ülker)...");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showInfoCard, setShowInfoCard] = useState(false);

  const searchRef = useRef(null);
  const feedbackRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const canvasRef = useRef(null);

  const normalizedSearch = search
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
  const searchResults = search
    ? fuse.search(normalizedSearch).map(result => result.item.original)
    : brandList;
  const suggestions = search
    ? fuse.search(normalizedSearch).map(result => result.item.original).slice(0, 5)
    : [];

  const filteredResults = selectedCategory === "Tümü"
    ? searchResults
    : searchResults.filter(brand => brandCategories[brand] === selectedCategory);

  const categories = ["Tümü", ...new Set(Object.values(brandCategories))];

  const currentDate = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Orbitron:400,700", "Exo 2:400,500,600"]
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
      if (feedbackRef.current && !feedbackRef.current.contains(event.target)) {
        setShowFeedback(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!search) setIsFocused(false);
  }, [search]);

  useEffect(() => {
    const placeholders = [
      "Marka ara (örneğin, Ülker)...",
      "Marka ara (örneğin, Nusr-Et)...",
      "Marka ara (örneğin, A Haber)...",
      "Marka ara (örneğin, D&R)...",
      "Marka ara (örneğin, ETS Tur)..."
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setPlaceholder(placeholders[index]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const canvasHeight = canvas.height; // Tanımlama eklendi

    const stars = createStars(200, canvas.width, canvasHeight);

    const animate = () => {
      animateStars(ctx, stars, canvas.width, canvasHeight, darkMode);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  const isDark = darkMode;
  const bgClass = isDark
    ? "bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#121212] text-white"
    : "bg-gradient-to-b from-[#f9f9f9] via-[#f0f0f0] to-[#e6e6e6] text-gray-800";
  const inputClass = isDark
    ? "bg-[#1e1e1e] text-gray-100 border border-[#333] placeholder-gray-500 focus:ring-2 focus:ring-green-400"
    : "bg-white text-gray-800 border border-gray-400 placeholder-gray-500 focus:ring-2 focus:ring-green-500";
  const inputFocusClass = isDark
    ? "border-green-400 bg-[#1e1e1e] text-white placeholder-gray-400 shadow-[0_0_12px_#22c55e55] scale-105"
    : "border-green-500 bg-white text-gray-800 placeholder-gray-500 shadow-[0_0_10px_#22c55e55] scale-105";
  const footerClass = isDark
    ? "text-gray-400 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]"
    : "text-gray-600 drop-shadow-[0_0_2px_rgba(0,0,0,0.1)]";
  const headingClass = isDark
    ? "text-gray-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
    : "text-gray-800 drop-shadow-[0_0_4px_rgba(0,0,0,0.08)]";
  const resultBoxClass = isDark
    ? "bg-[#1a1a1a] border border-gray-700 divide-gray-800"
    : "bg-white border border-gray-300 divide-gray-200";
  const hoverClass = isDark
    ? "hover:bg-gray-800 hover:scale-102 hover:shadow-lg"
    : "hover:bg-gray-100 hover:scale-102 hover:shadow-lg";
  const scrollbarClass = isDark
    ? "scrollbar-thumb-[#333] scrollbar-track-transparent"
    : "scrollbar-thumb-gray-400 scrollbar-track-gray-200";
  const feedbackClass = isDark
    ? "bg-[#1a1a1a] text-gray-100 border-gray-700"
    : "bg-white text-gray-800 border-gray-300";
  const descriptionClass = isDark ? "text-gray-400" : "text-gray-800";
  const altBackgroundClass = isDark ? "bg-green-500/20 text-green-400" : "bg-green-500/30 text-green-600";
  const categoryButtonClass = isDark
    ? "bg-gray-700 text-white hover:bg-gray-600"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  const categoryMenuClass = isDark
    ? "bg-[#1a1a1a] border-gray-700 text-gray-100"
    : "bg-white border-gray-300 text-gray-800";
  const categoryItemClass = isDark
    ? "hover:bg-gray-800 text-gray-400 hover:text-white"
    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800";
  const activeCategoryItemClass = isDark
    ? "bg-gray-800 text-white"
    : "bg-gray-100 text-gray-800";
  const selectedCardBorderClass = isDark ? "border-gray-700" : "border-gray-300";
  const buttonClass = isDark
    ? "bg-gray-700 text-white hover:bg-gray-600 border-gray-600"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-400";
  const mottoClass = isDark
    ? "text-gray-300 opacity-70"
    : "text-gray-600 opacity-70";
  const warningClass = isDark
    ? "text-gray-300 bg-gray-800/50 border-gray-700"
    : "text-gray-700 bg-gray-100/50 border-gray-300";
  const warningCardClass = isDark
    ? "bg-[#1a1a1a] text-gray-200 border-gray-700"
    : "bg-white text-gray-800 border-gray-300";
  const infoIconClass = isDark
    ? "text-gray-400 hover:text-gray-200"
    : "text-gray-600 hover:text-gray-800";

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log("Geri bildirim gönderildi:", feedbackText);
    setFeedbackText("");
    setShowFeedback(false);
  };

  return (
    <div className={`relative min-h-screen ${bgClass} flex flex-col items-center px-2 sm:px-4 md:px-6 text-center transition-all duration-500 font-exo-2`}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{ pointerEvents: "none" }}
      />

      <motion.button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 px-3 py-1 sm:px-5 sm:py-2 md:px-5 md:py-2 rounded-lg border text-xs sm:text-sm md:text-sm font-medium transition-all duration-300 shadow-md bg-opacity-50 backdrop-blur-md ${buttonClass}`} // Mobil için küçültüldü
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? "Açık Tema" : "Koyu Tema"}
      </motion.button>

      <div className="pt-16 sm:pt-32 md:pt-40" /> {/* Mobil için başlık üstü boşluk azaldı */}

      <motion.div
        className="relative z-10 mb-2 sm:mb-4 md:mb-4 flex items-center justify-center gap-2 sm:gap-4 md:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <svg className="w-6 sm:w-10 md:w-10 h-6 sm:h-10 md:h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-12h2v10h-2V5z" />
        </svg>
        <div className={`text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide ${headingClass} font-orbitron`}>
          Boykot Ediyoruz
        </div>
      </motion.div>

      <motion.div
        className={`relative z-10 mb-2 sm:mb-8 md:mb-8 text-sm sm:text-lg md:text-lg font-orbitron ${mottoClass}`} // Mobil için küçültüldü
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Egemenlik Kayıtsız Şartsız Milletindir
      </motion.div>

      <div className="relative z-10 w-full max-w-xs sm:max-w-xl md:max-w-2xl" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 w-5 sm:w-6 md:w-6 h-5 sm:h-6 md:h-6 text-gray-500" />
          <motion.input
            type="text"
            placeholder={placeholder}
            className={`w-full pl-10 sm:pl-14 pr-6 sm:pr-6 py-2 sm:py-4 md:py-4 rounded-2xl shadow-lg border transition-all duration-300 ease-in-out outline-none ring-0 ${isFocused ? inputFocusClass : inputClass}`} // Mobil için padding ve yuvarlaklık ayarlandı
            value={search}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setSearch(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
          {isFocused && suggestions.length > 0 && (
            <motion.div
              className={`absolute z-30 mt-1 sm:mt-1 w-full max-h-32 sm:max-h-40 md:max-h-40 overflow-y-auto rounded-xl ${resultBoxClass} scrollbar-thin ${scrollbarClass}`} // Mobil için max-height ayarlandı
              style={{ top: "100%" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  className={`px-3 sm:px-5 md:px-5 py-2 sm:py-3 md:py-3 text-left cursor-pointer ${hoverClass}`}
                  onMouseDown={() => {
                    setSearch(suggestion);
                    setIsFocused(false);
                  }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {suggestion}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          className={`mt-2 sm:mt-4 md:mt-4 px-2 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-lg border text-xs sm:text-sm md:text-sm ${warningClass}`} // Mobil için küçültüldü
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Bu liste, Cumhuriyet Halk Partisi (CHP) ve Genel Başkan Özgür Özel'in açıklamaları doğrultusunda hazırlanmıştır. Liste zamanla güncellenebilir ve yeni gelişmelere göre değişiklik gösterebilir.
        </motion.div>

        <div className="relative mt-2 sm:mt-4 md:mt-4" ref={categoryMenuRef}>
          <motion.button
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className={`flex items-center gap-1 sm:gap-2 md:gap-2 px-2 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-lg text-xs sm:text-sm md:text-sm font-medium transition-all duration-300 shadow-md ${categoryButtonClass}`} // Mobil için küçültüldü
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {selectedCategory}
            <ChevronDown className={`w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 transform transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`} />
          </motion.button>
          <AnimatePresence>
            {isCategoryMenuOpen && (
              <motion.div
                className={`absolute z-30 mt-1 sm:mt-2 md:mt-2 w-32 sm:w-48 md:w-48 rounded-xl border shadow-lg ${categoryMenuClass}`} // Mobil için width ayarlandı
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {categories.map((category) => (
                  <motion.div
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryMenuOpen(false);
                    }}
                    className={`px-2 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 text-xs sm:text-sm md:text-sm cursor-pointer transition-all duration-200 ${
                      selectedCategory === category ? activeCategoryItemClass : categoryItemClass
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {category}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className={`relative z-20 mt-4 sm:mt-8 md:mt-8 w-full max-h-60 sm:max-h-96 md:max-h-96 overflow-y-auto rounded-xl ${resultBoxClass} scrollbar-thin ${scrollbarClass}`} // Mobil için max-height ayarlandı
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {filteredResults.length > 0 ? (
              filteredResults.map((brand, index) => (
                <motion.div
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`m-2 sm:m-4 md:m-4 px-3 sm:px-6 md:px-6 py-2 sm:py-5 md:py-5 rounded-xl shadow-sm ${hoverClass} transition-all duration-300 focus:outline-none ring-0 ${
                    selectedBrand === brand ? `border-2 ${selectedCardBorderClass}` : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-1 sm:mb-3 md:mb-3">
                    <div className="flex items-center gap-1 sm:gap-3 md:gap-3">
                      <span className="font-semibold text-sm sm:text-lg md:text-lg">{brand}</span>
                      <span className="text-xs sm:text-xs md:text-xs px-1 sm:px-2 md:px-2 py-0.5 sm:py-1 md:py-1 bg-blue-500/20 text-blue-400 rounded-full">
                        {brandCategories[brand]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-2">
                      <XCircle className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 text-red-500" />
                      <span className="text-red-500 font-medium text-xs sm:text-sm md:text-sm">Boykot listesinde</span>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm md:text-sm ${descriptionClass} leading-relaxed`}>
                    <strong>Neden:</strong> {brandReasons[brand]?.reason || "Belirtilmemiş"}
                  </p>
                  <p className={`text-xs sm:text-sm md:text-sm ${descriptionClass} leading-relaxed mt-0.5 sm:mt-1 md:mt-1`}>
                    <strong>Alternatif:</strong>{" "}
                    <motion.span
                      className={`inline-block px-2 sm:px-3 md:px-3 py-0.5 sm:py-1 md:py-1 ${altBackgroundClass} rounded-full text-xs sm:text-sm md:text-sm font-medium`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {brandReasons[brand]?.alt || "Bilgi yok"}
                    </motion.span>
                  </p>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="notfound"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="px-3 sm:px-6 md:px-6 py-2 sm:py-5 md:py-5 text-gray-500 flex justify-between items-center"
              >
                <span className="text-xs sm:text-sm md:text-sm">{search || "Sonuç bulunamadı"}</span>
                <span className="flex items-center gap-1 sm:gap-2 md:gap-2 text-green-500">
                  <CheckCircle className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5" />
                  Boykot listesinde değil
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        className="fixed right-2 sm:right-6 md:right-6 top-1/2 transform -translate-y-1/2 z-40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          onClick={() => setShowFeedback(true)}
          className={`px-2 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-lg border text-xs sm:text-sm md:text-sm font-medium transition-all duration-300 shadow-md bg-opacity-50 backdrop-blur-md ${buttonClass} flex items-center gap-1 sm:gap-2 md:gap-2`} // Mobil için küçültüldü
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5" />
          Geri Bildirim
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showFeedback && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowFeedback(false)}
            />
            <motion.div
              ref={feedbackRef}
              className={`fixed right-0 top-1/2 transform -translate-y-1/2 w-11/12 sm:w-80 md:w-80 p-3 sm:p-6 md:p-6 rounded-l-xl shadow-lg z-50 ${feedbackClass}`} // Mobil için genişlik ayarlandı
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-2 sm:mb-4 md:mb-4">
                <h3 className="text-sm sm:text-lg md:text-lg font-semibold">Geri Bildirim</h3>
                <button onClick={() => setShowFeedback(false)}>
                  <X className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <form onSubmit={handleFeedbackSubmit}>
                <textarea
                  className={`w-full h-24 sm:h-32 md:h-32 p-2 sm:p-3 md:p-3 rounded-lg border ${isDark ? "bg-[#2a2a2a] text-gray-100 border-gray-600" : "bg-gray-100 text-gray-800 border-gray-300"} outline-none resize-none text-sm sm:text-base md:text-base`} // Mobil için küçültüldü
                  placeholder="Görüşlerinizi yazın..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
                <motion.button
                  type="submit"
                  className={`mt-2 sm:mt-4 md:mt-4 w-full px-2 sm:px-4 md:px-4 py-1 sm:py-2 md:py-2 rounded-lg text-xs sm:text-sm md:text-sm font-medium transition-all duration-300 ${buttonClass}`} // Mobil için küçültüldü
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Gönder
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed left-2 sm:left-6 md:left-6 top-1/2 transform -translate-y-1/2 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.button
          onClick={() => setShowInfoCard(!showInfoCard)}
          className={`p-2 sm:p-3 md:p-3 rounded-full shadow-md bg-opacity-50 backdrop-blur-md ${buttonClass}`} // Mobil için küçültüldü
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Info className={`w-4 sm:w-6 md:w-6 h-4 sm:h-6 md:h-6 ${infoIconClass}`} />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showInfoCard && (
          <motion.div
            className={`fixed left-2 sm:left-6 md:left-6 top-1/2 transform -translate-y-1/2 z-50 w-11/12 sm:w-80 md:w-80 p-3 sm:p-6 md:p-6 rounded-xl shadow-lg ${warningCardClass}`} // Mobil için genişlik ayarlandı
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-3">
              <h3 className="text-sm sm:text-lg md:text-lg font-semibold font-orbitron">Bilgilendirme</h3>
              <button onClick={() => setShowInfoCard(false)}>
                <X className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-xs sm:text-sm md:text-sm leading-relaxed mb-1 sm:mb-2 md:mb-2">
              Bu liste, Cumhuriyet Halk Partisi (CHP) ve Genel Başkan Özgür Özel'in açıklamaları doğrultusunda hazırlanmıştır. Liste zamanla güncellenebilir ve yeni gelişmelere göre değişiklik gösterebilir.
            </p>
            <p className="text-xs sm:text-sm md:text-sm leading-relaxed">
              Boykot hakkı, Türkiye Cumhuriyeti Anayasası’nın{" "}
              <a
                href="https://www.tbmm.gov.tr/anayasa/anayasa_1982.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                25. ve 26. maddeleri
              </a>{" "}
              kapsamında düşünce ve ifade özgürlüğü çerçevesinde yasal bir haktır.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={`relative z-10 mt-4 sm:mt-12 md:mt-12 py-2 sm:py-6 md:py-6 ${footerClass}`}>
        <p className="text-xs sm:text-sm md:text-sm">
          © 2025 Boykot Ediyoruz. Tüm hakları saklıdır.
        </p>
        <p className="text-xs sm:text-sm md:text-sm mt-1 sm:mt-2 md:mt-2">
          Son Güncelleme: {currentDate}
        </p>
      </footer>
    </div>
  );
}

export default App;