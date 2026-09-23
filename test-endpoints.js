const fetch = globalThis.fetch;

async function testAll() {
  const root = await (await fetch("http://localhost:3000/")).text();
  console.log("Root HTML length:", root.length);

  const endpoints = [
    "/src/main.tsx",
    "/src/App.tsx",
    "/src/context/SubscriptionContext.tsx",
    "/src/components/landing/LandingPage.tsx",
    "/src/components/landing/LandingHeader.tsx",
    "/src/components/landing/HeroSection.tsx",
    "/src/components/landing/ValuePropositionGrid.tsx",
    "/src/components/landing/CurriculumPreviewSection.tsx",
    "/src/components/landing/ExamArchiveSection.tsx",
    "/src/components/landing/LiveClassroomSpotlight.tsx",
    "/src/components/landing/TestimonialsSection.tsx",
    "/src/components/landing/LandingFooter.tsx",
    "/src/components/landing/AuthModal.tsx",
    "/src/components/subscription/PaywallModal.tsx"
  ];
  for (const ep of endpoints) {
    const res = await fetch("http://localhost:3000" + ep);
    console.log(ep, "->", res.status);
    if (res.status !== 200) {
      console.log("ERROR on", ep, await res.text());
    }
  }
}
testAll().catch(console.error);
