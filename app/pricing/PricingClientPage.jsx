"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Icon, SiteFooter, SiteHeader } from "../components/SiteChrome";
import { useCart } from "../hooks/useCart";
import { useRouter } from "next/navigation";
import useScrollReveal from "../hooks/useScrollReveal";
import { useVisibility } from "../context/VisibilityContext";
import PageHiddenNotice from "../components/PageHiddenNotice";

const defaultCpTiers = [
  {
    id: "cp_80l",
    name: "Project Upto ₹80 Lakh",
    scope: "Project upto ₹80 Lakh",
    ticketRange: "Upto ₹80 Lakh",
    price: 75000,
    priceDisplay: "75,000",
    period: "for 3 Months",
    monthlyEffective: "₹25,000 Effective per Month",
    subtitle: "Affordable & Mid-Segment Residential Units",
    icon: "apartment",
    popular: false
  },
  {
    id: "cp_1_5cr",
    name: "Project ₹80 Lakh to ₹1.5 Cr",
    scope: "Project ₹80 Lakh to ₹1.5 Cr",
    ticketRange: "₹80 Lakh - ₹1.5 Cr",
    price: 90000,
    priceDisplay: "90,000",
    period: "for 3 Months",
    monthlyEffective: "₹30,000 Effective per Month",
    subtitle: "Premium 2 & 3 BHK Homes & Developments",
    icon: "domain",
    popular: true
  },
  {
    id: "cp_3cr",
    name: "Project ₹1.5 Cr to ₹3 Cr",
    scope: "Project ₹1.5 Cr to ₹3 Cr",
    ticketRange: "₹1.5 Cr - ₹3 Cr",
    price: 150000,
    priceDisplay: "1.5 Lakh",
    period: "for 3 Months",
    monthlyEffective: "₹50,000 Effective per Month",
    subtitle: "High-End Luxury Homes & Commercial Spaces",
    icon: "corporate_fare",
    popular: false
  },
  {
    id: "cp_above_3cr",
    name: "Project Above ₹3 Cr & Builders",
    scope: "Project Above ₹3 Cr / Builders",
    ticketRange: "Above ₹3 Cr & Builders",
    price: 200000,
    priceDisplay: "2 Lakh",
    period: "for 3 Months",
    monthlyEffective: "₹66,667 Effective per Month",
    subtitle: "Ultra-Luxury Estates & Builder Flagship Launches",
    icon: "location_city",
    popular: false
  }
];

const defaultPillars = [
  {
    title: "WhatsApp Marketing + Quality Data",
    desc: "Automated broadcast, instant brochure sharing & verified buyer database",
    icon: "chat"
  },
  {
    title: "AI Promotional Videos",
    desc: "AI-assisted cinematic walkthroughs, teasers & high-engagement social reels",
    icon: "memory"
  },
  {
    title: "Lead Verification & Qualification Support",
    desc: "Proactive buyer outreach, tele-calling & phone qualification for inquiries",
    icon: "filter_alt"
  },
  {
    title: "Meta Ads, Google & YouTube Ads + Associate Channel",
    desc: "High-intent buyer campaigns across Meta, Google & YouTube plus CP network activation",
    icon: "bar_chart"
  }
];

const defaultDeliverables = [
  { title: "WhatsApp Marketing + Quality Data", desc: "Automated broadcast, instant brochure sharing & verified buyer data", icon: "chat" },
  { title: "Leads Calling & Verification", desc: "Proactive buyer outreach, tele-calling & phone qualification for inquiries", icon: "call" },
  { title: "Project Website & Landing Page", desc: "High-CRO launch microsite with floor plans & automated lead capture funnels", icon: "desktop_windows" },
  { title: "Meta & Youtube & Google Ads", desc: "High-intent buyer campaigns across Meta (FB & IG), Google Search & YouTube Ads", icon: "bar_chart" },
  { title: "Reels & Short-Form Content", desc: "Engaging property reels showcasing amenities, site progress & walkthroughs", icon: "smart_display" },
  { title: "AI Promotional Videos", desc: "AI-assisted cinematic property walkthroughs, teasers & social promo videos", icon: "memory" },
  { title: "Associated Channels", desc: "Channel partner network collaboration & broker channel activation support", icon: "handshake" },
  { title: "Campaign Monitoring & Optimization", desc: "Daily ad tracking, continuous ROAS scaling & weekly verified CPL reporting", icon: "troubleshoot" }
];

const defaultFaqs = [
  {
    question: "How are the Channel Partner (CP) plans structured?",
    answer: "Our CP plans are specifically tailored to the ticket size of your properties: (1) Project upto ₹80 Lakh at ₹75,000 for 3 Months, (2) Project ₹80 Lakh to ₹1.5 Cr at ₹90,000 for 3 Months, (3) Project ₹1.5 Cr to ₹3 Cr at ₹1.5 Lakh for 3 Months, and (4) Project Above ₹3 Cr & Builders at ₹2 Lakh for 3 Months. Each package provides a dedicated 3-month growth engine."
  },
  {
    question: "What is included across all CP marketing plans?",
    answer: "Every plan includes WhatsApp Marketing + Quality Data, AI Promotional Videos, Lead Verification & Qualification Support, Meta Ads, Google & YouTube Ads management, Project Landing Pages, Reels & Short-Form Content, Associated Channels network activation, and daily Campaign Optimization with weekly CPL reporting."
  },
  {
    question: "Does the package fee include advertising budget or is it separate?",
    answer: "The package fee covers agency execution, creative production, video generation, landing page development, tele-calling lead qualification, and strategic management for the full 3-month cycle. Ad spend (paid directly to Meta and Google) is separate so you maintain 100% control over your daily ad budget without markups."
  },
  {
    question: "How does the Associated Channels collaboration work?",
    answer: "Through Associated Channels, we provide verified real estate marketing expertise, structured channel partner alignment, broker channel activation, and proven lead qualification funnels designed to deliver more quality leads, stronger brand presence, better project visibility, and end-to-end sales support."
  },
  {
    question: "How does the Lead Verification and Qualification support work?",
    answer: "We ensure your sales team never wastes time on junk or fake inquiries. Our dedicated qualification team calls and WhatsApp-verifies every incoming inquiry to confirm the buyer's budget, preferred unit configuration (e.g., 2 BHK, 3 BHK, Penthouse), location interest, and buying timeframe before handing them over or booking a site visit."
  },
  {
    question: "How quickly will our campaigns and landing pages go live?",
    answer: "We execute rapidly. Your custom project landing page, ad creatives, WhatsApp funnels, and campaigns will be fully configured and live within 5 to 7 business days from onboarding and collateral collection."
  },
  {
    question: "Do we get complete ownership of the landing page, videos, and leads?",
    answer: "Yes, 100%. All landing pages, domain configurations, AI promotional videos, ad creative designs, and prospective buyer databases belong exclusively to your firm."
  },
  {
    question: "How do I get started with a Channel Partner Plan?",
    answer: "Select your ticket-size plan from the grid, click 'Select Plan & Buy Now' to initiate onboarding online, message us on WhatsApp, or call our team directly at 9096090701. We will schedule a kickoff session within 24 hours."
  }
];

export default function PricingClientPage() {
  const { isVisible, isPageVisible } = useVisibility();
  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  const [cpTiers, setCpTiers] = useState(defaultCpTiers);
  const [selectedTierId, setSelectedTierId] = useState("cp_1_5cr");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [industryData, setIndustryData] = useState(null);

  useScrollReveal([]);

  // Fetch dynamic plans from API
  useEffect(() => {
    fetch("/api/industry-plans?t=" + Date.now(), { cache: "no-store" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Offline");
      })
      .then((data) => {
        if (data && Array.isArray(data.industries) && data.industries.length > 0) {
          const re = data.industries.find((i) => i.id === "real-estate") || data.industries[0];
          setIndustryData(re);
          if (Array.isArray(re.cpTiers) && re.cpTiers.length > 0) {
            setCpTiers(re.cpTiers);
            if (!re.cpTiers.some((t) => t.id === selectedTierId)) {
              setSelectedTierId(re.cpTiers[1]?.id || re.cpTiers[0].id);
            }
          }
        }
      })
      .catch((err) => console.warn("Using default CP plans:", err));
  }, []);

  const activeTier = cpTiers.find((t) => t.id === selectedTierId) || cpTiers[1] || cpTiers[0] || defaultCpTiers[1];

  const handleBuyNow = (tierToBuy = activeTier) => {
    clearCart();
    const targetTier = tierToBuy || activeTier;
    const planName = `${targetTier.name} (CP Plan - ₹${targetTier.priceDisplay})`;
    addToCart({
      id: targetTier.id,
      name: planName,
      price: Number(targetTier.price) || 90000,
      period: "/3 months",
      features: [
        `Property Scope: ${targetTier.scope}`,
        targetTier.monthlyEffective,
        "WhatsApp Marketing + Quality Data",
        "Lead Verification & Qualification Support",
        "AI Promotional Videos",
        "Meta Ads, Google & YouTube Ads",
        "Associated Channels Activation"
      ]
    });
    router.push(`/checkout?plan=${encodeURIComponent(planName)}&price=${targetTier.price}`);
  };

  const getWhatsAppInquiryUrl = (tier = activeTier) => {
    const msg = `Hi! I am interested in your Real Estate Channel Partner Marketing Plan for ${tier.scope} (₹${tier.priceDisplay} for 3 Months). Please connect with me.`;
    return `https://wa.me/919096090701?text=${encodeURIComponent(msg)}`;
  };

  if (!isPageVisible("pricing")) {
    return <PageHiddenNotice pageName="Pricing Plans" />;
  }

  const pillars = industryData?.pillars || defaultPillars;
  const deliverables = industryData?.package?.features || defaultDeliverables;
  const faqs = industryData?.faqs || defaultFaqs;

  return (
    <div className="pricing-page-wrapper cp-compressed-page">
      <SiteHeader active="pricing" />

      {/* Main Section: Compressed Real Estate Channel Partner Plans */}
      <section id="plans" className="cp-pricing-hero-section">
        <div className="cp-container">
          {/* Header Banner */}
          <div className="cp-header-block reveal">
            <div className="cp-badge-pill">
              <span className="material-symbols-outlined cp-badge-icon">handshake</span>
              <span>REAL ESTATE CHANNEL PARTNER (CP) PLANS</span>
            </div>
            
            <h1 className="cp-main-title">
              Digital Marketing Partner for <span className="cp-title-accent">Real Estate Channel Partners</span>
            </h1>

            <p className="cp-tagline">
              <span className="cp-tagline-quote">"Your Success Our Business"</span>
              <span className="cp-tagline-sub"> — Targeted 3-month growth engines customized to your property ticket size</span>
            </p>

            {/* Quick Action Pills: Flyer preview modal trigger */}
            <div className="cp-flyer-quick-toggle">
              <button 
                type="button" 
                onClick={() => setShowFlyerModal(true)}
                className="cp-view-flyer-btn"
                title="View original official marketing flyer"
              >
                <span className="material-symbols-outlined">image</span>
                View Official CP Flyer
              </button>
            </div>
          </div>

          {/* 4 Core Pillars Strip (Horizontal / 4 Cards) */}
          <div className="cp-pillars-strip reveal delay-100">
            {pillars.map((pillar, idx) => (
              <div className="cp-pillar-card" key={idx}>
                <div className="cp-pillar-icon-box">
                  <span className="material-symbols-outlined">{pillar.icon || "star"}</span>
                </div>
                <div className="cp-pillar-info">
                  <h3 className="cp-pillar-title">{pillar.title}</h3>
                  <p className="cp-pillar-desc">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 2,2 ROWS PLANS SECTION (2 Rows x 2 Columns Grid) */}
          <div className="cp-grid-section reveal delay-200">
            <div className="cp-grid-header">
              <div className="cp-grid-title-wrap">
                <span className="material-symbols-outlined cp-grid-icon">tune</span>
                <span className="cp-grid-label">SELECT YOUR PROPERTY TICKET SIZE</span>
              </div>
              <span className="cp-grid-hint">Click any card to select tier &amp; proceed</span>
            </div>

            <div className="cp-plans-grid">
              {cpTiers.map((tier) => {
                const isSelected = tier.id === selectedTierId;
                return (
                  <div
                    key={tier.id}
                    className={`cp-plan-card ${isSelected ? "selected" : ""} ${tier.popular ? "popular" : ""}`}
                    onClick={() => setSelectedTierId(tier.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedTierId(tier.id);
                      }
                    }}
                    aria-label={`Select ${tier.scope} Plan`}
                  >
                    {/* Badge top corner if popular */}
                    {tier.popular && (
                      <div className="cp-card-popular-badge">
                        <span className="material-symbols-outlined">hotel_class</span>
                        MOST POPULAR
                      </div>
                    )}

                    {/* Radio / Selection Indicator */}
                    <div className="cp-card-select-indicator">
                      <span className="material-symbols-outlined">
                        {isSelected ? "check_circle" : "radio_button_unchecked"}
                      </span>
                      <span>{isSelected ? "Selected Plan" : "Click to Select"}</span>
                    </div>

                    {/* Building Icon */}
                    <div className="cp-card-icon-wrap">
                      <span className="material-symbols-outlined cp-building-icon">
                        {tier.icon || "apartment"}
                      </span>
                    </div>

                    {/* Scope / Ticket Size Title */}
                    <div className="cp-card-scope-wrap">
                      <span className="cp-scope-prefix">Project Ticket Size</span>
                      <h2 className="cp-card-scope-title">{tier.scope}</h2>
                      {tier.subtitle && <p className="cp-card-subtitle">{tier.subtitle}</p>}
                    </div>

                    {/* Gold Pricing Pill */}
                    <div className="cp-price-pill-wrap">
                      <div className="cp-gold-pill">
                        <span className="cp-pill-currency">₹</span>
                        <span className="cp-pill-amount">{tier.priceDisplay}</span>
                        <span className="cp-pill-period">{tier.period || "for 3 Months"}</span>
                      </div>
                    </div>

                    {/* Monthly Effective Cost */}
                    <div className="cp-card-monthly-box">
                      <span className="material-symbols-outlined">savings</span>
                      <strong>{tier.monthlyEffective}</strong>
                    </div>

                    {/* Action Button inside card */}
                    <div className="cp-card-action">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTierId(tier.id);
                          handleBuyNow(tier);
                        }}
                        className={`cp-card-btn ${isSelected ? "active" : ""}`}
                      >
                        <span className="material-symbols-outlined">rocket_launch</span>
                        {isSelected ? "Proceed with this Plan" : "Choose this Plan"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Tier Summary & Quick Checkout Bar */}
          <div className="cp-checkout-bar reveal delay-250">
            <div className="cp-bar-summary">
              <div className="cp-bar-summary-badge">
                <span className="material-symbols-outlined">check_circle</span>
                <span>Active Selection</span>
              </div>
              <div className="cp-bar-title-row">
                <h3 className="cp-bar-plan-name">{activeTier.scope}</h3>
                <span className="cp-bar-divider">•</span>
                <span className="cp-bar-price">₹{activeTier.priceDisplay}</span>
                <span className="cp-bar-period">({activeTier.period || "for 3 Months"}) + GST</span>
              </div>
              <span className="cp-bar-effective">{activeTier.monthlyEffective}</span>
            </div>

            <div className="cp-bar-actions">
              <button
                type="button"
                onClick={() => handleBuyNow(activeTier)}
                className="cp-bar-btn-buy"
              >
                <span className="material-symbols-outlined">rocket_launch</span>
                Select Plan &amp; Buy Now (₹{activeTier.priceDisplay})
              </button>

              <a
                href={getWhatsAppInquiryUrl(activeTier)}
                target="_blank"
                rel="noopener noreferrer"
                className="cp-bar-btn-wa"
              >
                <span className="material-symbols-outlined">chat</span>
                Inquire on WhatsApp
              </a>

              <a
                href="tel:9096090701"
                className="cp-bar-btn-call"
              >
                <span className="material-symbols-outlined">call</span>
                Call: 9096090701
              </a>
            </div>
          </div>

          {/* Compressed Deliverables & Outcomes Section */}
          <div className="cp-deliverables-compact reveal delay-300">
            {/* Associate Channel Banner */}
            <div className="cp-asicote-card">
              <div className="cp-asicote-header">
                <div className="cp-asicote-brand-wrap">
                  <span className="material-symbols-outlined cp-asicote-icon">handshake</span>
                  <span className="cp-asicote-brand">AI DIGITAL</span>
                  <span className="cp-asicote-sub">ASSOCIATE CHANNEL</span>
                </div>
                <div className="cp-asicote-tag">Included with all 4 Plans</div>
              </div>

              <div className="cp-outcomes-grid">
                <div className="cp-outcome-item">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>More Quality Leads</span>
                </div>
                <div className="cp-outcome-item">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Stronger Brand Presence</span>
                </div>
                <div className="cp-outcome-item">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Better Project Visibility</span>
                </div>
                <div className="cp-outcome-item">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>End-to-End Support</span>
                </div>
              </div>
            </div>

            {/* 8 Core Deliverables in a compact 4x2 grid */}
            <div className="cp-services-section">
              <div className="cp-services-heading">
                <span>WHAT'S INCLUDED IN ALL CP PACKAGES</span>
                <span className="cp-services-count">{deliverables.length} Core Deliverables</span>
              </div>

              <div className="cp-services-grid">
                {deliverables.map((feat, idx) => (
                  <div className="cp-service-card" key={idx}>
                    <div className="cp-service-icon">
                      <Icon name={feat.icon || "check_circle"} />
                    </div>
                    <div className="cp-service-text">
                      <strong>{feat.title}</strong>
                      <p>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Contact Strip */}
          <div className="cp-contact-strip reveal delay-350">
            <a href="tel:9096090701" className="cp-contact-item">
              <span className="material-symbols-outlined">call</span>
              <div>
                <span className="cp-contact-label">CALL US NOW</span>
                <strong>9096090701</strong>
              </div>
            </a>

            <a
              href="https://www.aidigital.biz"
              target="_blank"
              rel="noopener noreferrer"
              className="cp-contact-item"
            >
              <span className="material-symbols-outlined">language</span>
              <div>
                <span className="cp-contact-label">VISIT OUR WEBSITE</span>
                <strong>www.aidigital.biz</strong>
              </div>
            </a>

            <a
              href="https://maps.app.goo.gl/ouQRtxBcSQCpJdZW9"
              target="_blank"
              rel="noopener noreferrer"
              className="cp-contact-item"
            >
              <span className="material-symbols-outlined">location_on</span>
              <div>
                <span className="cp-contact-label">OUR LOCATION</span>
                <strong>Office No: 315, Boulevard Tower, Bramha Corp, Sadhu Vaswani Chowk, Camp, Pune, Maharashtra 411001</strong>
              </div>
            </a>
          </div>

          {/* FAQs Accordion */}
          {faqs && faqs.length > 0 && (
            <div className="cp-faqs-section reveal delay-400">
              <div className="cp-faqs-header">
                <span className="cp-faqs-badge">Got Questions?</span>
                <h2 className="cp-faqs-title">Frequently Asked Questions</h2>
                <p className="cp-faqs-sub">
                  Everything you need to know about our Real Estate Channel Partner marketing engine.
                </p>
              </div>

              <div className="cp-faqs-list">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div className={`cp-faq-item ${isOpen ? "open" : ""}`} key={index}>
                      <button
                        type="button"
                        className="cp-faq-trigger"
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                        aria-expanded={isOpen}
                      >
                        <h3>{faq.question}</h3>
                        <span className="material-symbols-outlined cp-faq-toggle-icon">
                          {isOpen ? "close" : "add"}
                        </span>
                      </button>
                      <div
                        className="cp-faq-content"
                        style={{
                          maxHeight: isOpen ? "500px" : "0",
                          opacity: isOpen ? 1 : 0,
                          padding: isOpen ? "0 24px 20px 24px" : "0 24px 0 24px"
                        }}
                      >
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Official Flyer Modal */}
      {showFlyerModal && (
        <div className="cp-flyer-modal-backdrop" onClick={() => setShowFlyerModal(false)}>
          <div className="cp-flyer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cp-flyer-modal-close"
              onClick={() => setShowFlyerModal(false)}
              aria-label="Close Flyer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="cp-flyer-image-container">
              <Image
                src="/Price_CP.jpg"
                alt="AiDigital Channel Partner Plans Official Flyer"
                width={1086}
                height={1448}
                priority
                className="cp-flyer-image"
              />
            </div>
            <div className="cp-flyer-modal-footer">
              <span>Real Estate Channel Partner Growth Plans • AiDigital</span>
              <button
                type="button"
                onClick={() => {
                  setShowFlyerModal(false);
                  handleBuyNow(activeTier);
                }}
                className="cp-flyer-modal-cta"
              >
                Proceed with Selected Tier (₹{activeTier.priceDisplay})
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
