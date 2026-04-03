#!/usr/bin/env bash
set -euo pipefail

# Content Extraction Script
# Reads source .txt/.md files from Spiral!! and creates structured Markdown
# with YAML frontmatter in docs/archive/extracted/

BASE="/Users/4jp/Workspace/organvm-iii-ergon/sovereign-systems--elevate-align"
SRC="$BASE/docs/archive/source-bundle/Spiral!!"
DEST="$BASE/docs/archive/extracted"

# Function to create an extracted file
# Args: source_file dest_category dest_filename title nodes readiness pillar
extract_file() {
  local src_file="$1"
  local dest_cat="$2"
  local dest_name="$3"
  local title="$4"
  local nodes="$5"
  local readiness="$6"
  local pillar="$7"
  local source_folder="$8"
  local source_filename
  source_filename="$(basename "$src_file")"

  local dest_path="$DEST/$dest_cat/$dest_name"

  # Read original content
  local content=""
  if [[ -f "$src_file" ]]; then
    content="$(cat "$src_file")"
  fi

  # Write extracted file
  cat > "$dest_path" << FRONTMATTER
---
title: "$title"
source_file: "$source_filename"
source_folder: "$source_folder"
nodes: [$nodes]
readiness: "$readiness"
pillar: "$pillar"
extracted: 2026-04-03
---

$content
FRONTMATTER

  echo "  -> $dest_cat/$dest_name"
}

echo "=== HEALTH (29 .txt/.md files) ==="

extract_file "$SRC/health/ChatGPT-30 Day Acupressure Routine.txt" \
  "health" "30-day-acupressure-routine.md" \
  "Acupressure for money blocks, self-doubt, fear" "2, 9, 10, 13" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Aerosols and cleaning products.txt" \
  "health" "aerosols-and-cleaning-products.md" \
  "IG captions: chemical exposure + inflammation" "6, 8" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Alzheimer's 373_ Increase Explained.txt" \
  "health" "alzheimers-373-increase-explained.md" \
  "Fact-check BCBSA 2020 report, ages 30-44" "8, 6" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Birth control resources guide.txt" \
  "health" "birth-control-resources-guide.md" \
  "BC effects, books, podcasts, nutrient depletion, alternatives" "5, 7, 6" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Body Trust and Shifts.txt" \
  "health" "body-trust-and-shifts.md" \
  "Menstrual cycle shifts, intimacy, friendship boundaries" "3, 4, 10, 5" "Raw" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Bubble Butt Fitness Guide.txt" \
  "health" "bubble-butt-fitness-guide.md" \
  "Cycle-synced glute plan, hormone-friendly meals" "5, 6, 13" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Chlorine absorption time.txt" \
  "health" "chlorine-absorption-time.md" \
  "Chlorine skin absorption science, DBPs, timelines" "6, 8" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Cortisol stress carousel.txt" \
  "health" "cortisol-stress-carousel.md" \
  "IG carousel: cortisol as disease root, 90-sec reset" "2, 1, 8" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Cymascope and healing frequencies.txt" \
  "health" "cymascope-and-healing-frequencies.md" \
  "CymaScope, cymatics, sound-vibration healing claims" "9, 12, 13" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Endometriosis causes and practices.txt" \
  "health" "endometriosis-causes-and-practices.md" \
  "Western + TCM causes, acupuncture evidence" "5, 9, 7" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Fascia and emotions explained.txt" \
  "health" "fascia-and-emotions-explained.md" \
  "Fascia-emotion link, chakra mapping, spiral line" "13, 2, 9" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Feel Good First script.txt" \
  "health" "feel-good-first-script.md" \
  "IG Reel script + caption, Maslow's hierarchy" "1, 11" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Gut Rebuilding Diet Plan.txt" \
  "health" "gut-rebuilding-diet-plan.md" \
  "Cycle-based gut rebuild, supplements, exercise" "7, 5, 6" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-hEDS symptoms and diagnosis.txt" \
  "health" "heds-symptoms-and-diagnosis.md" \
  "Hypermobile EDS, misdiagnosis, fascia connection" "9, 13, 3" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Hemorrhoids and Daily Discomfort.txt" \
  "health" "hemorrhoids-and-daily-discomfort.md" \
  "U.S. prevalence stats: IBS, constipation, migraines" "6, 1, 8" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Heroine_s Healing Journey.txt" \
  "health" "heroines-healing-journey.md" \
  "E-A-U Spiral Blueprint: 8-stage heroine's journey" "14, 10, 4, 11" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Hormone Cycle Guide.txt" \
  "health" "hormone-cycle-guide.md" \
  "Free ebook outline: cycle tracking, phase nutrition" "5, 6, 7" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Hormones ! eating ! cycles.txt" \
  "health" "hormones-eating-cycles.md" \
  "Empty export" "" "Empty" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Hydration and blood sugar.txt" \
  "health" "hydration-and-blood-sugar.md" \
  "Root-Cause Pyramid, Square Zero = hydration" "6, 1, 2" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Hydration and Inflammation Video.txt" \
  "health" "hydration-and-inflammation-video.md" \
  "60-sec video script for sales" "6, 8" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Inflammation Self-Check Questions.txt" \
  "health" "inflammation-self-check-questions.md" \
  "5-question self-assessment for water sales" "3, 6" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Medical research gender gap.txt" \
  "health" "medical-research-gender-gap.md" \
  "Fact-check: gender gap in research, J. Marion Sims" "4, 8, 10" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Milk source in the US.txt" \
  "health" "milk-source-in-the-us.md" \
  "U.S. milk/beef sourcing, import data, welfare" "6, 8" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Neurodivergence and autoimmune links.txt" \
  "health" "neurodivergence-and-autoimmune-links.md" \
  "ATP/metabolic waste hypothesis (speculative)" "9, 7" "Raw" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Parasite cleanse diet tips.txt" \
  "health" "parasite-cleanse-diet-tips.md" \
  "Diet protocol during cleanse, anti-parasite foods" "7, 6" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Period related rest plans.txt" \
  "health" "period-related-rest-plans.md" \
  "Phrases for communicating period rest needs" "5, 4" "Ready" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Sonoluminescence phenomenon explained.txt" \
  "health" "sonoluminescence-phenomenon-explained.md" \
  "Sound through water creates light, physics" "12, 9" "Partial" "Physical" "health"

extract_file "$SRC/health/ChatGPT-Sulphur benefits and history.txt" \
  "health" "sulphur-benefits-and-history.md" \
  "Glutathione, MSM, hot springs, alchemy" "9, 6, 13" "Partial" "Physical" "health"

extract_file "$SRC/health/Gemini-Cellular Reprogramming Through Voice.md" \
  "health" "cellular-reprogramming-through-voice.md" \
  "30-day voice-to-cells protocol (speculative)" "12, 2, 13, 9" "Partial" "Physical" "health"

extract_file "$SRC/health/Gemini-FDA_s _Just a Little Bit_ Carcinogens.md" \
  "health" "fda-just-a-little-bit-carcinogens.md" \
  "HIMYM meme: FDA-approved carcinogens" "6, 8" "Ready" "Physical" "health"

echo ""
echo "=== MINDSET (37 .txt files) ==="

extract_file "$SRC/mindset/ChatGPT-Affirmation Track for Abundance.txt" \
  "mindset" "affirmation-track-for-abundance.md" \
  "Spoken affirmation script, \$2,500 receiving" "1, 2, 10, 12" "Ready" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Alchemy and Spiritual Symbolism.txt" \
  "mindset" "alchemy-and-spiritual-symbolism.md" \
  "Philosopher's Stone, inner alchemy from The Alchemist" "12, 14" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Anger Processing Guide.txt" \
  "mindset" "anger-processing-guide.md" \
  "Feel or Free emotional sorting practice" "2, 3, 9" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Ask Integrate Reflect Method.txt" \
  "mindset" "ask-integrate-reflect-method.md" \
  "AIR Method for balancing curiosity + implementation" "3, 5, 11" "Partial" "Identity" "mindset"

extract_file "$SRC/mindset/ChatGPT-Attracting Wealth with Mindset.txt" \
  "mindset" "attracting-wealth-with-mindset.md" \
  "Money and Law of Attraction reel summary" "12, 10" "Raw" "Financial" "mindset"

extract_file "$SRC/mindset/ChatGPT-Balancing Masculine and Feminine.txt" \
  "mindset" "balancing-masculine-and-feminine.md" \
  "Yin/yang balance during breakup recovery" "5, 2, 3" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Blindspots Gaps and Cons.txt" \
  "mindset" "blindspots-gaps-and-cons.md" \
  "5 blindspots, 5 gaps, 5 shadows + integration" "3, 4, 10" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Ego Integration and Overcoming.txt" \
  "mindset" "ego-integration-and-overcoming.md" \
  "Freudian + Jungian + Eastern ego, 5-step process" "9, 4, 14" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Emotional misattunement explanation.txt" \
  "mindset" "emotional-misattunement-explanation.md" \
  "Relationship conflict, emotional boundaries" "2, 3, 10" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Entrepreneurship Development Recommendations.txt" \
  "mindset" "entrepreneurship-development-recommendations.md" \
  "Career fields, high-ticket affiliate strategy" "11" "Raw" "Financial" "mindset"

extract_file "$SRC/mindset/ChatGPT-Ether Concepts Explained.txt" \
  "mindset" "ether-concepts-explained.md" \
  "Fifth element across science/metaphysics/alchemy" "12" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Fear of Being Seen.txt" \
  "mindset" "fear-of-being-seen.md" \
  "Visibility wounds, witch wound, somatic healing" "10, 2, 9, 13" "Partial" "Identity" "mindset"

extract_file "$SRC/mindset/ChatGPT-Frozen Feelings and Support.txt" \
  "mindset" "frozen-feelings-and-support.md" \
  "Emotional freeze/shutdown, somatic prompts" "2, 9, 1" "Ready" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Happiness as a state.txt" \
  "mindset" "happiness-as-a-state.md" \
  "Reel concept: 4 pillars of well-being" "1, 8, 13" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Healing Growth Blueprint 1.0 idea phase .txt" \
  "mindset" "healing-growth-blueprint-1-0.md" \
  "Meta-architecture of the Spiral product itself" "ALL" "Partial" "Cross-cutting" "mindset"

extract_file "$SRC/mindset/ChatGPT-Inner Child Healing.txt" \
  "mindset" "inner-child-healing.md" \
  "Pool incident mirror, fawning, reparenting" "9, 2, 10" "Ready" "Identity" "mindset"

extract_file "$SRC/mindset/ChatGPT-Insecurity and Self-Respect.txt" \
  "mindset" "insecurity-and-self-respect.md" \
  "Relationship insecurity, self-respect reframe" "3, 10, 4" "Raw" "Identity" "mindset"

extract_file "$SRC/mindset/ChatGPT-Manifestation Mastery Secrets.txt" \
  "mindset" "manifestation-mastery-secrets.md" \
  "5-step manifestation protocol + vision board" "12, 2, 1" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Masculine Feminine Balance Tracker.txt" \
  "mindset" "masculine-feminine-balance-tracker.md" \
  "Yang/Yin task lists, daily check-in template" "5, 3, 11" "Ready" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Masculine vs Feminine Balance.txt" \
  "mindset" "masculine-vs-feminine-balance.md" \
  "Real-time yin check-in, affirmation, regulation" "5, 1, 13" "Ready" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Meal Planning and Budgeting Help.txt" \
  "mindset" "meal-planning-and-budgeting-help.md" \
  "Budget meal plans, veggie incorporation" "6, 7" "Ready" "Physical" "mindset"

extract_file "$SRC/mindset/ChatGPT-Money block removal guide.txt" \
  "mindset" "money-block-removal-guide.md" \
  "6 categories, diagnostic questionnaire, clearing tools" "10, 9, 12" "Partial" "Financial" "mindset"

extract_file "$SRC/mindset/ChatGPT-Neuro-signatures and Pruning Explained.txt" \
  "mindset" "neuro-signatures-and-pruning-explained.md" \
  "Brain wiring, neural pruning, neurodivergent brains" "2, 8" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Overexplaining and Conciseness Tips.txt" \
  "mindset" "overexplaining-and-conciseness-tips.md" \
  "Roots of overexplaining, 5-min confidence drill" "4, 13, 10" "Ready" "Identity" "mindset"

extract_file "$SRC/mindset/ChatGPT-Overwhelm to Clarity.txt" \
  "mindset" "overwhelm-to-clarity.md" \
  "Brain dump to stability/expansion/vision sorting" "3, 11, 5" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Rendering Explained.txt" \
  "mindset" "rendering-explained.md" \
  "Consciousness as rendering engine, simulation" "12" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Romanticized Reality of Change.txt" \
  "mindset" "romanticized-reality-of-change.md" \
  "Metamorphosis metaphor, caterpillar dissolution" "14, 4" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Self-awareness and love.txt" \
  "mindset" "self-awareness-and-love.md" \
  "Self-love as prerequisite, Master of Love" "10, 3" "Raw" "Identity" "mindset"

extract_file "$SRC/mindset/ChatGPT-Self-soothing in Adulthood.txt" \
  "mindset" "self-soothing-in-adulthood.md" \
  "Attachment styles, self-soothing origins" "9, 2" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Send PDF to Kindle.txt" \
  "mindset" "send-pdf-to-kindle.md" \
  "Technical utility" "" "N/A" "Cross-cutting" "mindset"

extract_file "$SRC/mindset/ChatGPT-Shift Your Mindset.txt" \
  "mindset" "shift-your-mindset.md" \
  "IG caption: thoughts to beliefs to reality" "1, 4" "Ready" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Success and small habits.txt" \
  "mindset" "success-and-small-habits.md" \
  "Compound Effect quotes for captions" "8, 11" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-TM and Kundalini Energy.txt" \
  "mindset" "tm-and-kundalini-energy.md" \
  "CIA Gateway Process, TM, Kundalini phases" "12, 2, 13" "Partial" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Vibration Frequency Exploration.txt" \
  "mindset" "vibration-frequency-exploration.md" \
  "Cymatics, Schumann Resonance, acoustic levitation" "12" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Vision board creation guide.txt" \
  "mindset" "vision-board-creation-guide.md" \
  "Dream state brain dump (truck, land, horse, etc.)" "12, 11" "Raw" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Visionary Life Breakdown.txt" \
  "mindset" "visionary-life-breakdown.md" \
  "Week in highest self visualization script" "12, 11, 14" "Ready" "Inner" "mindset"

extract_file "$SRC/mindset/ChatGPT-Yin energy explained.txt" \
  "mindset" "yin-energy-explained.md" \
  "IG captions, toxic masculinity CTA" "5, 13" "Ready" "Inner" "mindset"

extract_file "$SRC/mindset/IMPORTANT COMPONET!ChatGPT-Inner child book concept (1).txt" \
  "mindset" "inner-child-book-concept.md" \
  "Full book concept, 5 parts, 11 chapters" "1, 2, 5, 9, 10, 13, 14" "Partial" "Cross-cutting" "mindset"

echo ""
echo "=== BUSINESS (15 .txt files) ==="

extract_file "$SRC/business/ChatGPT-100 sales strategy.txt" \
  "business" "100-sales-strategy.md" \
  "90-day Enagic water sales playbook" "11" "Partial" "Financial" "business"

extract_file "$SRC/business/ChatGPT-20!80 rule focus.txt" \
  "business" "20-80-rule-focus.md" \
  "80/20 prioritization for \$10k months" "1, 5, 11" "Partial" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Astrology Social Media Strategy !!!!!.txt" \
  "business" "astrology-social-media-strategy.md" \
  "Chart-based IG/FB/TikTok strategy" "3, 5, 11" "Partial" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Credit Report Review Guide.txt" \
  "business" "credit-report-review-guide.md" \
  "Pull credit, dispute errors, utilization" "6, 10" "Raw" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Dream retreat vision.txt" \
  "business" "dream-retreat-vision.md" \
  "Retreat + Spiral classes vision, funnel priorities" "12, 14" "Raw" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Financial Freedom Blueprint.txt" \
  "business" "financial-freedom-blueprint.md" \
  "12-step phased path to independence" "4, 6, 10" "Ready" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Idea Implementation Strategies.txt" \
  "business" "idea-implementation-strategies.md" \
  "Vision-to-action: MVV, parking lot, 30-day sprint" "5, 8, 11" "Ready" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Income Projections and Strategies.txt" \
  "business" "income-projections-and-strategies.md" \
  "17-day projection, launch checklist" "6, 11" "Partial" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Instagram grid visualization.txt" \
  "business" "instagram-grid-visualization.md" \
  "Empty" "" "Empty" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Job Transition Advice.txt" \
  "business" "job-transition-advice.md" \
  "Identity transition, NS integration post-rest" "1, 2, 3" "Partial" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Novel Funnel Strategies.txt" \
  "business" "novel-funnel-strategies.md" \
  "Market saturation, authentic positioning" "11, 13" "Partial" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Plastic Water Label Design.txt" \
  "business" "plastic-water-label-design.md" \
  "Image request (label)" "7" "Raw" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Sales momentum plan.txt" \
  "business" "sales-momentum-plan.md" \
  "3-phase: foundation/GHL, soft launch, follow-up" "11" "Partial" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Wagyu Post Conversion Tips.txt" \
  "business" "wagyu-post-conversion-tips.md" \
  "3 FB caption templates for water" "11, 13" "Ready" "Financial" "business"

extract_file "$SRC/business/ChatGPT-Website Launch and App Timeline.txt" \
  "business" "website-launch-and-app-timeline.md" \
  "Empty" "" "Empty" "Financial" "business"

echo ""
echo "=== WATER (14 .txt/.md files) ==="

extract_file "$SRC/water/ChatGPT-2.5 pH Acidic Water.txt" \
  "water" "2-5-ph-acidic-water.md" \
  "Hypochlorous acid IG slides, strep story" "7, 9" "Ready" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Dissolved hydrogen concentration.txt" \
  "water" "dissolved-hydrogen-concentration.md" \
  "K8 H2 levels, independent vs manufacturer claims" "7" "Raw" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Eczema Skin Water Protocol.txt" \
  "water" "eczema-skin-water-protocol.md" \
  "Step-by-step eczema water protocol" "6, 9" "Ready" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Ionized water benefits.txt" \
  "water" "ionized-water-benefits.md" \
  "H2 as antioxidant, pH debunking, PubMed refs" "7, 9" "Partial" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Kangen Water and Ear Aches.txt" \
  "water" "kangen-water-and-ear-aches.md" \
  "Ear protocol (no ear canal use, safer alts)" "9" "Partial" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Kangen Water Content Ideas.txt" \
  "water" "kangen-water-content-ideas.md" \
  "10 reel scripts + 5 FB posts + captions" "11, 13" "Ready" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Molecular Hydrogen for Athletes.txt" \
  "water" "molecular-hydrogen-for-athletes.md" \
  "Pitch template for UFC fighter" "11" "Raw" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Water hub design.txt" \
  "water" "water-hub-design.md" \
  "Full Water Hub architecture: quiz, 5 branches" "11, 12" "Partial" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Water Hub Framework Breakdown.txt" \
  "water" "water-hub-framework-breakdown.md" \
  "Landing page flow, quiz branching" "11, 12" "Raw" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Water Memory and Energy.txt" \
  "water" "water-memory-and-energy.md" \
  "Structured water, EZ water, Emoto (contested)" "12" "Partial" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Water Retention in ERW.txt" \
  "water" "water-retention-in-erw.md" \
  "Dead-end research inquiry" "7" "Raw" "Physical" "water"

extract_file "$SRC/water/ChatGPT-Water Sales Strategy Plan.txt" \
  "water" "water-sales-strategy-plan.md" \
  "Full sales system: content, DM scripts, cold calls" "11" "Partial" "Financial" "water"

extract_file "$SRC/water/ChatGPT-Well Water Costs.txt" \
  "water" "well-water-costs.md" \
  "Well economics" "6" "Raw" "Physical" "water"

extract_file "$SRC/water/Gemini-Hydrogen Water_ Science, Health, and Business.md" \
  "water" "hydrogen-water-science-health-and-business.md" \
  "Webinar transcript: oxidative stress, H2, business" "7, 9, 11" "Partial" "Physical" "water"

extract_file "$SRC/water/Gemini-Water Crystals, Love, and Pseudoscience.md" \
  "water" "water-crystals-love-and-pseudoscience.md" \
  "Emoto critique + metaphorical value" "12" "Ready" "Physical" "water"

echo ""
echo "=== TIME-ASTRO (9 .txt files) ==="

extract_file "$SRC/time-astro-human design/ChatGPT-13 Month Calendar Query.txt" \
  "time-astro" "13-month-calendar-query.md" \
  "Lunar calendar systems, Mayan/Dreamspell" "5, 12" "Partial" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Astrology and business strategy.txt" \
  "time-astro" "astrology-and-business-strategy.md" \
  "Chart transit analysis for launch timing" "3, 5, 11" "Ready" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Astrology Hormone Moon Planner.txt" \
  "time-astro" "astrology-hormone-moon-planner.md" \
  "2025 planner concept: chart + moon + hormones" "5, 6, 12" "Partial" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Cycle and moon comparison.txt" \
  "time-astro" "cycle-and-moon-comparison.md" \
  "IG story: 4-phase cycle mapped to moon phases" "5, 6, 13" "Ready" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Frequency symbol origins.txt" \
  "time-astro" "frequency-symbol-origins.md" \
  "Fact-check: frequency sigils are modern, not ancient" "12" "Partial" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Moon Day Male Struggles (1).txt" \
  "time-astro" "moon-day-male-struggles.md" \
  "Monday = Moon-day, Garfield as cosmic satire" "5" "Ready" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Spoon bending technique.txt" \
  "time-astro" "spoon-bending-technique.md" \
  "Focus/energy exercise (fringe)" "12" "Raw" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Time, astrology & human design .txt" \
  "time-astro" "time-astrology-and-human-design.md" \
  "Empty" "" "Empty" "Cross-cutting" "time-astro"

extract_file "$SRC/time-astro-human design/ChatGPT-Vedic astrology energy analysis.txt" \
  "time-astro" "vedic-astrology-energy-analysis.md" \
  "Saturn/Ketu, karma processing, Dec 2025" "2, 3" "Partial" "Cross-cutting" "time-astro"

echo ""
echo "=== CONCEPTS (13 .txt files) ==="

extract_file "$SRC/concepts to add in /ChatGPT-Book Concept Breakdown.txt" \
  "concepts" "book-concept-breakdown.md" \
  "Compound Effect + Radical Forgiveness + Happy Pocket distilled" "4, 8, 10, 12" "Ready" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Breakdown of Veblen_s ideas.txt" \
  "concepts" "breakdown-of-veblens-ideas.md" \
  "Theory of Leisure Class + Noah lineages" "4, 12" "Partial" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Creature selves resources.txt" \
  "concepts" "creature-selves-resources.md" \
  "Somatic embodiment, animal wisdom brand concept" "13, 14" "Partial" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Divine Feminine Flow.txt" \
  "concepts" "divine-feminine-flow.md" \
  "Poetic daily rhythm piece" "1, 5, 13" "Ready" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Dopamine vs Oxytocin Dynamics.txt" \
  "concepts" "dopamine-vs-oxytocin-dynamics.md" \
  "Neurochemistry of masc/fem drives" "5, 2" "Ready" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Dopamine vs Oxytocin Energy.txt" \
  "concepts" "dopamine-vs-oxytocin-energy.md" \
  "Life-domain yin/yang checklist" "3, 5" "Ready" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Energy Waves and Oscillations.txt" \
  "concepts" "energy-waves-and-oscillations.md" \
  "Physics: quanta, oscillation, astrology-as-imprint" "12" "Partial" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Gallup Poll usage today.txt" \
  "concepts" "gallup-poll-usage-today.md" \
  "What Gallup is, 1000-person validity" "4" "Raw" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Hunched Back and Past Lives.txt" \
  "concepts" "hunched-back-and-past-lives.md" \
  "Spiritual spinal interpretation, past-life techniques" "9, 13" "Partial" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Idea Implementation Strategies.txt" \
  "concepts" "idea-implementation-strategies-duplicate.md" \
  "DUPLICATE of business/ file" "5, 8, 11" "N/A" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Research.txt" \
  "concepts" "research.md" \
  "Empty" "" "Empty" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Sound Frequency Analysis.txt" \
  "concepts" "sound-frequency-analysis.md" \
  "Audio frequency analysis, NS impact assessment" "2, 12" "Partial" "Cross-cutting" "concepts"

extract_file "$SRC/concepts to add in /ChatGPT-Vision board creation guide.txt" \
  "concepts" "vision-board-creation-guide.md" \
  "Brain dump: truck, land, horse, etc." "10, 12" "Raw" "Cross-cutting" "concepts"

echo ""
echo "=== EXTRACTION COMPLETE ==="
echo ""
echo "Counting extracted files:"
find "$DEST" -name "*.md" -not -path "*/.*" | wc -l
