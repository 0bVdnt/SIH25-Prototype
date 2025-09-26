PS ID - SIH25039 
Organisation - Ministry of Earth Sciences (MoES) 
problem statement - Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics 
Disaster Management Software 

1. Problem Statement

India is among the most ocean-hazard-prone nations. Cyclones, floods, storm surges, and oil spills cause ₹25,000+ crore in annual losses and thousands of casualties.

Current systems (MOSDAC, NDMA, SACHET):

One-way (top-down alerts only).
Internet-dependent → fail during power/telecom outages.
Lack a citizen → authority feedback loop.
Cannot process unstructured social media chatter.
Core gap: Secure, resilient, two-way communication + AI-driven verification.

2. Proposed Solution – Tarang Netra

A unified software + communication platform enabling citizen participation, live social sensing, and predictive analytics.

Core Modules

Citizen Reporting Interface
Mobile & web app for hazard reports with geo-tagged photos, videos, or audio.
Multi-step form → structured, easy, multilingual.
Unified Hub
Data fusion engine combining:
Satellite feeds (ISRO, NOAA, NASA).
LoRa mesh & satellite terminals.
Social media NLP streams.

Volunteer/NGO reports.

Outputs validated ground-truth map.
Dynamic Dashboard
GIS-based, color-coded risk layers.
Categorized by hazard type.

Predictive hazard timeline (12–24 hr lead).

LoRa Mesh + Satellite Network

LoRa Mesh: resilient low-power, long-range coverage for coastal villages.

Satellite Fallback: fishing boats/offshore vessels → SOS + alerts beyond towers.

Ensures last-mile + deep sea coverage.

Social Media & NLP Analytics
BERT/DistilBERT classify hazard chatter; sentiment + urgency analysis.

Proactive Social Media Bot: detects hazard posts and mentions of government handles, sends DMs to collect structured reports.

Filters fake/misleading content; integrates into dashboard.

Call Bot & WhatsApp Integration

Toll-free IVR converts citizen voice reports to text using Whisper+NLP.
WhatsApp bot provides two-way chat; auto-detects hazard type and location.
Ensures inclusivity across literacy and tech access levels.

Predictive Analytics

DBSCAN clustering → live hazard hotspots.
LSTM/ARIMA → time-series risk forecasting.
Prophet models → escalation probability curves.

Volunteer Hub

NGOs & trained responders validate incidents.
Resource request & last-mile relief coordination.

3. Technical Architecture

Backend: FastAPI (Python), PostgreSQL (Neon), Celery+Kafka.
Frontend: React + Vite, Tailwind, Leaflet/Mapbox.
ML/NLP: Hugging Face transformers, OpenCV (image/video verification).
Comms: WebSockets for real-time; SMS/WhatsApp APIs for alerts.
Offline/Edge: LoRaWAN nodes, IoT sync, satellite fallback.

4. Problem Addressed

Data Gaps Closed: Citizen + social + satellite fusion.
Faster Response: Alerts issued in seconds; 15–40% quicker.
Resilient Communication: LoRa + satellite keeps system alive in blackouts.
Accuracy Improved: ML + volunteer validation filter fake reports.
Trust Built: Citizens engaged as active “sentinels.”

5. Innovation & Uniqueness

Beyond bots/apps: true bi-directional communication.
Live Sentiment Analysis: panic detection in seconds.
Hybrid Network Model: telecom + LoRa + satellite.
Proactive Social Media Engagement: platform pulls data from citizen posts.
Scalable & Modular: extends to floods, landslides, wildfires.

6. Feasibility & Viability

Pilot (12–18 months): Odisha & Tamil Nadu, in partnership with INCOIS/NGOs.
Phase 2: Expand to 10 coastal states (~170M people).
Phase 3: Regional (Bangladesh, Sri Lanka, Maldives – ~250M).

Costs:
Dev + pilot: ₹40–50 lakh.
Ops: ₹8–10 lakh/year.
HR: ₹20–25 lakh/year (~12 experts).

7. Impact & Benefits

Response Lag Cut 60% → faster rescue, fewer casualties.
Economic Savings: ₹1,000–2,000 crore annually.
Citizen Awareness: 55–75% preparedness boost.
Life Saving: 15-min early alerts can save up to 80% of lives.
Trust Ecosystem: transparent citizen-agency collaboration.
Offline Resilience: LoRa + satellite ensure continuous coverage.
Long-Term: pattern detection → policy improvements, resilient communities.

8. Business & Adoption Model

Free Pilot: NGO + government adoption.
Govt Integration: NDMA/INCOIS early warning hub.
Private Sector Tier: Ports, insurers, shipping (~₹200–300 crore market).
Sustainability: Public–private partnership + government support.

9. Outcomes

Situational Awareness: live fused hazard map.
Timely Alerts: SMS/WhatsApp/satellite alerts reduce chaos.
Smarter Authority Decisions: consolidated dashboards.
Community Empowerment: safe zone maps, evacuation guides.
Reliability: ML + volunteer validation ensures trusted data.
Inclusivity: multi-channel citizen access.
Long-Term Impact: pattern recognition → policy & preparedness.

10. References

UNESCO/IOC Tsunami Early Warning Systems.

IPCC Climate Reports (2021/22).
NDMA India Guidelines.
NOAA Tsunami Research.