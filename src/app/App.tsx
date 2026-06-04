import { useState, useEffect } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Menu, X, ArrowUpRight, ChevronRight, ShoppingBag } from 'lucide-react';
import Slider from "react-slick";
import { motion, AnimatePresence, useScroll, useSpring, Variants } from "motion/react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Local venue photos (事業内容)
import serviceDining from "../imports/service-dining.jpg";
import serviceBeauty from "../imports/service-beauty.jpg";
import serviceArt from "../imports/service-art.jpg";
import groupMorikura from "../imports/group-morikura.jpg";

// Shared easing — soft "expo out" for an elegant, refined feel
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } }
};

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } }
};

// Masked line reveal — text rises up from behind a clip (overflow-hidden parent)
const lineReveal: Variants = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: 1.1, ease: EASE } }
};

// Viewport config: animate once, trigger slightly before fully in view
const viewportOnce = { once: true, amount: 0.25 } as const;

// Reusable animated section heading (English overline + mincho title + expanding divider)
function SectionHeading({
  en,
  title,
  subtitle,
  dark = false
}: {
  en: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      className="text-center mb-16 md:mb-24"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent}
    >
      <motion.p
        className={`font-cormorant italic text-lg md:text-xl mb-3 ${dark ? 'text-orange-200/70' : 'text-orange-900/50'}`}
        variants={fadeUp}
      >
        {en}
      </motion.p>
      <motion.h2
        className={`font-mincho text-3xl md:text-[2.6rem] font-medium tracking-[0.18em] leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}
        variants={fadeUp}
      >
        {title}
      </motion.h2>
      <motion.div
        className={`h-px mx-auto mt-6 ${dark ? 'bg-orange-200/40' : 'bg-orange-900/40'}`}
        initial={{ width: 0 }}
        whileInView={{ width: 56 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      />
      {subtitle && (
        <motion.p
          className={`mt-6 tracking-[0.1em] ${dark ? 'text-gray-300' : 'text-gray-500'}`}
          variants={fadeUp}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Top scroll-progress bar
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the full-screen mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navigation = [
    { id: 'home', label: 'ホーム' },
    { id: 'news', label: 'ニュース' },
    { id: 'company', label: '会社概要' },
    { id: 'contact', label: 'お問い合わせ' }
  ];

  const scrollToSection = (id: string) => {
    // ホーム → back to top
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    }
    // お問い合わせ shares the footer (company info + TEL) with 会社概要
    const targetId = id === 'contact' ? 'company' : id;
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const heroSliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    customPaging: (i: number) => (
      <div className="w-2 h-2 mx-1 rounded-full bg-white/50 hover:bg-white transition-colors mt-8"></div>
    )
  };

  // Hero = the three pillars of 森蔵: 食 (dining) · 美 (beauty) · 芸術 (art)
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1653259038915-7cf0b7a4dd6c?fm=jpg&q=80&w=1920",
      alt: "厳選された旬の食材による日本料理 — 飲食事業"
    },
    {
      src: "https://images.unsplash.com/photo-1595871151608-bc7abd1caca3?fm=jpg&q=80&w=1920",
      alt: "癒やしと美を追求するプライベートサロン — 美容事業"
    },
    {
      src: "https://images.unsplash.com/photo-1775486133989-365f979d0aaa?fm=jpg&q=80&w=1920",
      alt: "現代アートと伝統工芸が交差するギャラリー — アート事業"
    }
  ];

  const services = [
    {
      title: '飲食部門',
      description: '厳選された旬の食材と、職人の技が織りなす極上の和食体験。洗練された空間で、心に残るひとときをご提供いたします。',
      image: serviceDining
    },
    {
      title: '美容部門',
      description: '最先端の美容技術と、癒やしのトリートメント。お客様本来の美しさを引き出し、心身ともにリフレッシュできる特別な空間です。',
      image: serviceBeauty
    },
    {
      title: 'アート部門',
      description: '現代アートから伝統工芸まで、多様な表現に触れられるギャラリー。感性を刺激し、日常に彩りを添える作品との出会いを創出します。',
      image: serviceArt
    }
  ];

  const websites = [
    {
      name: 'CLUB YATA',
      type: '飲食事業',
      link: 'https://clubyata.jp/',
      image: serviceBeauty,
      description: '厳選された旬の食材を用いた日本料理で、非日常のひとときを。'
    },
    {
      name: 'MORIKURA CLUB',
      type: '美容事業',
      link: 'https://www.morikura.net/club/',
      image: groupMorikura,
      description: '心身の美しさを引き出す、完全予約制のプライベートサロン。'
    },
    {
      name: 'LOBMEYR',
      type: 'アート事業',
      link: 'https://lobmeyr.jp/',
      image: 'https://images.unsplash.com/photo-1565289263318-07ab0319ebb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzc3dhcmUlMjBtb2Rlcm4lMjBhcnR8ZW58MXx8fHwxNzgwNTM2MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: '歴史あるグラスウェアや現代アートが交差するギャラリー空間。'
    }
  ];

  const news = [
    {
      date: '2026.06.01',
      category: 'お知らせ',
      title: '夏の特別メニューのご案内',
      content: 'CLUB YATAにて、旬の食材をふんだんに使用した夏の特別コースのご予約受付を開始いたしました。'
    },
    {
      date: '2026.05.15',
      category: 'イベント',
      title: '新作アートエキシビション開催',
      content: 'LOBMEYRギャラリーにて、国内外で注目を集める若手アーティストの新作展示会を開催いたします。'
    },
    {
      date: '2026.04.20',
      category: 'お知らせ',
      title: 'ECサイト リニューアルオープン',
      content: 'より快適にお買い物をお楽しみいただけるよう、オンラインストアをリニューアルいたしました。'
    }
  ];

  return (
    <div className="grain min-h-screen bg-[#fefaf6] font-sans text-gray-900 selection:bg-orange-200 selection:text-orange-900">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300 origin-left z-[60]"
        style={{ scaleX: progressScaleX }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`font-mincho text-xl md:text-2xl font-medium tracking-[0.2em] transition-colors ${scrolled ? 'text-gray-900' : 'text-white drop-shadow-md'}`}
          >
            株式会社 森蔵
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative text-sm tracking-[0.1em] transition-colors ${scrolled ? 'text-gray-700' : 'text-white drop-shadow-md'}`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ease-out ${scrolled ? 'bg-orange-900' : 'bg-white'}`} />
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 relative z-[70] ${scrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white drop-shadow-md'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </header>

      {/* Full-screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-[60] bg-[#fefaf6] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 p-2 text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="メニューを閉じる"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {/* Brand */}
            <motion.div
              className="px-8 pt-7"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
            >
              <span className="font-mincho text-lg font-medium tracking-[0.2em] text-gray-900">株式会社 森蔵</span>
            </motion.div>

            {/* Nav links — large, centered, staggered */}
            <motion.nav
              className="flex-1 flex flex-col justify-center px-8 gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
              }}
            >
              {navigation.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="group flex items-baseline gap-4 text-left py-4 border-b border-gray-900/10"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
                  }}
                >
                  <span className="text-xs text-orange-900/40 tracking-[0.2em] font-light w-6">
                    0{i + 1}
                  </span>
                  <span className="font-mincho text-2xl font-medium tracking-[0.15em] text-gray-900 group-hover:text-orange-900 transition-colors">
                    {item.label}
                  </span>
                  <ArrowUpRight size={18} className="ml-auto self-center text-gray-300 group-hover:text-orange-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </motion.button>
              ))}
            </motion.nav>

            {/* Footer contact */}
            <motion.div
              className="px-8 pb-10 text-xs text-gray-400 tracking-[0.1em] leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              香川県高松市中野町29番地2号<br />
              TEL: 087-861-6601
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen min-h-[600px] w-full bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Slider {...heroSliderSettings} className="h-full hero-slider">
              {heroImages.map((img, idx) => (
                <div key={idx} className="h-screen w-full relative outline-none">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
                  <ImageWithFallback
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover hero-kenburns"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Brand kanji watermark */}
          <motion.div
            className="absolute inset-0 z-[15] flex items-center justify-center pointer-events-none select-none"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: EASE }}
          >
            <span className="font-mincho text-white/[0.07] text-[40vw] md:text-[28vw] leading-none">森蔵</span>
          </motion.div>

          <motion.div
            className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.16, delayChildren: 0.35 } }
            }}
          >
            {/* Eyebrow kicker */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }
              }}
            >
              <span className="hidden sm:block w-8 h-px bg-white/50" />
              <span className="text-white/80 text-[11px] md:text-xs tracking-[0.45em] font-light uppercase">
                食 &middot; 美 &middot; 芸術
              </span>
              <span className="hidden sm:block w-8 h-px bg-white/50" />
            </motion.div>

            {/* Headline — masked line reveal */}
            <h1 className="font-mincho text-4xl md:text-5xl lg:text-7xl font-normal text-white tracking-[0.18em] leading-[1.4] mb-8 drop-shadow-lg">
              {['豊かさを、', '暮らしの芸術へ。'].map((line, i) => (
                <span key={i} className="block overflow-hidden py-1">
                  <motion.span
                    className="block"
                    variants={lineReveal}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subtitle — masked reveal */}
            <div className="overflow-hidden">
              <motion.p
                className="text-sm md:text-lg text-white/85 tracking-[0.2em] font-light max-w-2xl leading-relaxed drop-shadow-md"
                variants={lineReveal}
              >
                食・美・芸術を通じて、高松から上質なライフスタイルを提案する。
              </motion.p>
            </div>
            <div className="overflow-hidden mt-2">
              <motion.p
                className="text-xs md:text-sm text-white/60 tracking-[0.3em] font-light uppercase drop-shadow-md"
                variants={lineReveal}
              >
                Morizo Co., Ltd.
              </motion.p>
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <span className="text-white/70 text-[10px] tracking-[0.3em]">SCROLL</span>
            <div className="w-px h-12 bg-white/40 overflow-hidden">
              <motion.div
                className="w-full h-1/2 bg-white"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
          <SectionHeading en="Our Business" title="事業内容" />

          <div className="space-y-24 md:space-y-32">
            {services.map((service, index) => {
              const reversed = index % 2 !== 0;
              return (
                <motion.div
                  key={index}
                  className={`flex flex-col gap-10 md:gap-16 items-center ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={staggerParent}
                >
                  <motion.div
                    className="w-full md:w-1/2"
                    variants={{
                      hidden: { opacity: 0, x: reversed ? 60 : -60 },
                      visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE } }
                    }}
                  >
                    <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-8"
                    variants={{
                      hidden: { opacity: 0, x: reversed ? -40 : 40 },
                      visible: { opacity: 1, x: 0, transition: { duration: 1.1, ease: EASE } }
                    }}
                  >
                    <span className="font-cormorant italic text-xl text-orange-900/50 mb-2">
                      0{index + 1} <span className="text-gray-300">/ 0{services.length}</span>
                    </span>
                    <h3 className="font-mincho text-2xl md:text-3xl font-medium tracking-[0.15em] mb-6 border-b border-gray-200 pb-4 inline-block self-start">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-[2] tracking-[0.05em] text-base md:text-lg">
                      {service.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Other Websites Section */}
        <section id="group" className="py-24 md:py-32 bg-white/60 px-6 lg:px-12 border-y border-orange-900/5">
          <div className="max-w-7xl mx-auto">
            <SectionHeading en="Our Group" title="グループ企業" subtitle="各ブランドの公式サイトをご覧ください" />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerParent}
            >
              {websites.map((site, index) => (
                <motion.a
                  key={index}
                  href={site.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border border-orange-900/5 hover:border-orange-900/20 hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden rounded-sm"
                  variants={fadeUp}
                  whileHover={{ y: -8, transition: { duration: 0.4, ease: EASE } }}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <ImageWithFallback
                      src={site.image}
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col flex-grow relative bg-white z-10">
                    <p className="text-xs text-orange-900/60 tracking-[0.2em] mb-3">{site.type}</p>
                    <h3 className="font-cormorant text-3xl font-medium tracking-[0.1em] mb-4">{site.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed tracking-[0.05em] mb-8 flex-grow">
                      {site.description}
                    </p>
                    <div className="inline-flex items-center text-xs tracking-[0.15em] text-gray-900 group-hover:text-orange-900 transition-colors mt-auto">
                      公式サイトへ <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* News and Event Section */}
        <section id="news" className="py-24 md:py-32 px-6 lg:px-12 max-w-5xl mx-auto">
          <SectionHeading en="News &amp; Events" title="ニュース & イベント" />

          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent}
          >
            {news.map((item, index) => (
              <motion.article
                key={index}
                className="bg-white p-8 md:p-10 border border-orange-900/5 hover:shadow-md transition-shadow group rounded-sm"
                variants={fadeUp}
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center mb-4">
                  <div className="flex items-center gap-4 shrink-0">
                    <time className="text-sm font-light tracking-wider text-gray-500">{item.date}</time>
                    <span className="text-xs tracking-[0.1em] px-3 py-1 bg-[#fefaf6] text-orange-900/80 rounded-sm border border-orange-900/10">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-medium tracking-[0.05em] group-hover:text-orange-900 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed tracking-[0.05em] md:pl-[200px]">
                  {item.content}
                </p>
              </motion.article>
            ))}
          </motion.div>

          <div className="mt-12 text-center">
            <button className="group inline-flex items-center gap-2 text-sm tracking-[0.15em] text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-300 pb-1">
              お知らせ一覧を見る <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* EC Site Information Section */}
        <section id="ec" className="py-24 md:py-32 px-6 lg:px-12 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzdG9yZSUyMHNob3BwaW5nfGVufDF8fHx8MTc4MDUzNTk3MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Online Store Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gray-900/80"></div>

          <motion.div
            className="max-w-4xl mx-auto relative z-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerParent}
          >
            <motion.div variants={fadeUp}>
              <ShoppingBag size={48} className="mx-auto mb-8 text-orange-200/80" strokeWidth={1} />
            </motion.div>
            <motion.p
              className="font-cormorant italic text-lg md:text-xl text-orange-200/70 mb-2"
              variants={fadeUp}
            >
              Online Boutique
            </motion.p>
            <motion.h2
              className="font-cormorant text-4xl md:text-6xl font-medium tracking-[0.18em] mb-8"
              variants={fadeUp}
            >
              ONLINE STORE
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 leading-[2] tracking-[0.1em] mb-12 max-w-2xl mx-auto"
              variants={fadeUp}
            >
              株式会社森蔵が厳選した、食・美容・アートにまつわる特別なアイテムをご自宅からご注文いただけます。日常を彩る逸品を、ぜひオンラインストアでお買い求めください。
            </motion.p>
            <motion.a
              href="#"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-gray-900 hover:bg-[#fefaf6] rounded-sm transition-colors tracking-[0.15em] font-medium"
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              オンラインストアへ進む
              <ArrowUpRight size={18} className="ml-2" />
            </motion.a>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        id="company"
        className="bg-white border-t border-gray-200 py-16 px-6 lg:px-12 scroll-mt-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 1, ease: EASE }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="font-mincho text-2xl font-medium tracking-[0.2em] mb-6">株式会社 森蔵</h2>
            <p className="text-sm text-gray-500 leading-loose tracking-[0.05em]">
              〒760-0008<br />
              香川県高松市中野町29番地2号<br />
              高松パークビル11階1-2<br />
              TEL: 087-861-6601 / FAX: 087-861-6602
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-[0.15em] text-gray-900 mb-6">サイトマップ</h3>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm text-gray-500 hover:text-gray-900 tracking-[0.1em] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-[0.15em] text-gray-900 mb-6">関連リンク</h3>
            <ul className="space-y-4">
              {websites.map((site, index) => (
                <li key={index}>
                  <a
                    href={site.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-900 tracking-[0.1em] transition-colors inline-flex items-center"
                  >
                    {site.name} <ArrowUpRight size={12} className="ml-1 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-400 tracking-[0.15em]">
            © 2026 Morizo Co., Ltd. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[10px] text-gray-400 tracking-[0.1em]">
            <a href="#" className="hover:text-gray-900 transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-gray-900 transition-colors">特定商取引法に基づく表記</a>
          </div>
        </div>
      </motion.footer>

      {/* Global styles */}
      <style>{`
        .hero-slider .slick-dots {
          bottom: 40px;
        }
        .hero-slider .slick-dots li {
          margin: 0 4px;
        }
        .hero-slider .slick-dots li.slick-active div {
          background-color: white;
          transform: scale(1.3);
        }
        /* Slow Ken Burns zoom on hero images */
        .hero-kenburns {
          animation: kenburns 12s ease-out infinite alternate;
        }
        @keyframes kenburns {
          from { transform: scale(1); }
          to   { transform: scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-kenburns { animation: none; }
        }
      `}</style>
    </div>
  );
}
