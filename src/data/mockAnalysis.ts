import { 
  AgentMeta, 
  BlindSpotItem, 
  DecisionAnalysisMap, 
  DecisionData, 
  ExampleDecision, 
  KeyInsights, 
  PerspectiveId, 
  ReflectionCoverage, 
  ReflectionQuestion, 
  AgentStructuredOutput 
} from "@/types/decision";

export const AGENT_PERSPECTIVES: AgentMeta[] = [
  {
    id: "goal",
    name: "Goal",
    number: 1,
    category: "Strategic",
    iconName: "Target",
    description: "Evaluates the underlying objectives, core motives, and clear definition of success.",
  },
  {
    id: "requirements",
    name: "Requirements",
    number: 2,
    category: "Strategic",
    iconName: "ClipboardCheck",
    description: "Examines prerequisite criteria, constraints, and must-have conditions.",
  },
  {
    id: "costResources",
    name: "Cost / Resources",
    number: 3,
    category: "Resources & Risks",
    iconName: "Coins",
    description: "Quantifies capital, mental energy, time, and emotional bandwidth required.",
  },
  {
    id: "benefits",
    name: "Benefits / Expected Value",
    number: 4,
    category: "Strategic",
    iconName: "TrendingUp",
    description: "Analyzes direct upside, asymmetric gains, and realistic payoff potential.",
  },
  {
    id: "risks",
    name: "Risks",
    number: 5,
    category: "Resources & Risks",
    iconName: "ShieldAlert",
    description: "Uncovers downside scenarios, black swan vulnerabilities, and failure modes.",
  },
  {
    id: "uncertainty",
    name: "Uncertainty",
    number: 6,
    category: "Resources & Risks",
    iconName: "HelpCircle",
    description: "Distinguishes known unknowns from unverified speculations and volatility.",
  },
  {
    id: "assumptions",
    name: "Assumptions",
    number: 7,
    category: "Validation",
    iconName: "Layers",
    description: "Surfaces implicit beliefs treated as facts without active verification.",
  },
  {
    id: "evidence",
    name: "Evidence",
    number: 8,
    category: "Validation",
    iconName: "FileSearch",
    description: "Audits the validity, recency, and sample size of data behind the reasoning.",
  },
  {
    id: "alternatives",
    name: "Alternatives",
    number: 9,
    category: "Validation",
    iconName: "GitFork",
    description: "Explores competing paths, creative compromises, and unconsidered choices.",
  },
  {
    id: "timeHorizon",
    name: "Time Horizon",
    number: 10,
    category: "Systemic & Future",
    iconName: "Hourglass",
    description: "Aligns short-term gratification with long-term compound outcomes.",
  },
  {
    id: "tradeoffs",
    name: "Trade-offs",
    number: 11,
    category: "Systemic & Future",
    iconName: "Scale",
    description: "Weighs what must be compromised or sacrificed to pursue this avenue.",
  },
  {
    id: "stakeholders",
    name: "Stakeholders / Other People",
    number: 12,
    category: "Systemic & Future",
    iconName: "Users",
    description: "Considers impact on family, partners, colleagues, and dependent parties.",
  },
  {
    id: "cognitiveBiases",
    name: "Cognitive Biases",
    number: 13,
    category: "Validation",
    iconName: "BrainCircuit",
    description: "Detects confirmation bias, recency bias, sunk cost fallacy, or FOMO.",
  },
  {
    id: "reversibility",
    name: "Reversibility",
    number: 14,
    category: "Systemic & Future",
    iconName: "Undo2",
    description: "Distinguishes one-way doors from two-way doors and analyzes exit costs.",
  },
  {
    id: "opportunityCost",
    name: "Opportunity Cost",
    number: 15,
    category: "Resources & Risks",
    iconName: "Compass",
    description: "Identifies what other valuable pursuits are forfeited by committing.",
  },
];

export const EXAMPLE_DECISIONS: ExampleDecision[] = [
  {
    title: "Should I accept this job offer?",
    category: "Career",
    decision: "I'm thinking about accepting an offer at a fast-growing series B startup for a 25% salary bump.",
    reasoning: "The pay is higher than my current position and the product seems innovative, even though it requires relocation and longer hours.",
  },
  {
    title: "Should I switch my college?",
    category: "Education",
    decision: "I want to transfer to an out-of-state university with a higher prestige ranking in computer science.",
    reasoning: "A top-tier brand name on my resume might open more tech interviews, even though tuition will be double and I lose my existing peer network.",
  },
  {
    title: "Should I invest in this company?",
    category: "Investing",
    decision: "I should invest in this company because the company is growing quickly.",
    reasoning: "Their revenue doubled in the last 12 months, customer sentiment is overwhelmingly positive on social media, and I don't want to miss the rally.",
  },
  {
    title: "Should I buy this laptop?",
    category: "Personal Finance",
    decision: "I am considering purchasing the latest top-spec $3,500 workstation laptop on installment credit.",
    reasoning: "It will future-proof my productivity for video editing and coding, even though my current 2-year-old machine still runs decently.",
  },
  {
    title: "Should I start my own business?",
    category: "Entrepreneurship",
    decision: "I'm debating quitting my corporate consulting job to launch a boutique AI strategy agency.",
    reasoning: "Demand for enterprise AI advisory is at an all-time high, and I feel unfulfilled executing bureaucratic projects for someone else.",
  },
];

export const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    id: "q1",
    question: "What evidence suggests this trajectory will continue?",
    helper: "Think about empirical data, structural moats, macro trends, and verified supporting evidence.",
    suggestedFocus: "Evidence & Assumptions",
  },
  {
    id: "q2",
    question: "What could cause this outcome to slow down or fail?",
    helper: "Think about external headwinds, execution risks, competition, and operational friction.",
    suggestedFocus: "Risks & Uncertainty",
  },
  {
    id: "q3",
    question: "Are there better risk-adjusted alternatives for your resources?",
    helper: "Consider other avenues, staged commitments, or unexamined paths you haven't yet compared.",
    suggestedFocus: "Alternatives & Opportunity Cost",
  },
  {
    id: "q4",
    question: "How much downside or loss are you genuinely comfortable with?",
    helper: "Think about your psychological drawdown tolerance, reserve runway, and worst-case scenario.",
    suggestedFocus: "Reversibility & Cost",
  },
];

/**
 * Extensible analysis generator.
 * In production, this can be swapped with:
 * const response = await fetch('/api/analyze', { method: 'POST', body: JSON.stringify({ decision, reasoning }) });
 */
export function mockAnalysis(decision: string, reasoning: string): DecisionData {
  const lower = (decision + " " + reasoning).toLowerCase();
  const isInvestment = lower.includes("invest") || lower.includes("stock") || lower.includes("company") || lower.includes("growth");
  const isJob = lower.includes("job") || lower.includes("career") || lower.includes("offer") || lower.includes("startup");
  const isCollege = lower.includes("college") || lower.includes("university") || lower.includes("school") || lower.includes("degree");
  const isBusiness = lower.includes("business") || lower.includes("agency") || lower.includes("quit") || lower.includes("founder");

  let analysisMap: DecisionAnalysisMap;
  let detailed: Record<PerspectiveId, AgentStructuredOutput>;
  let blindSpots: BlindSpotItem[];
  let questions: string[];

  if (isInvestment) {
    analysisMap = {
      goal: "The immediate goal appears to be capital growth, but the acceptable level of risk and target returns are not clearly defined.",
      requirements: "You haven't specified the minimum liquidity buffer or holding period required before capital is needed elsewhere.",
      costResources: "The exact amount of capital and how much loss you can comfortably tolerate have not been specified.",
      benefits: "You have highlighted rapid growth, but the margin of safety relative to valuation multiples remains unexamined.",
      risks: "Growth could decelerate due to competitive displacement, changing macro interest rates, regulatory intervention, or execution bottlenecks.",
      uncertainty: "There is high uncertainty regarding customer retention durability and unit economics once expansion slows.",
      assumptions: "You appear to assume that historical revenue expansion will naturally compound into the foreseeable future.",
      evidence: "Your reasoning relies heavily on the company's recent past growth without auditing audited financial statements or churn metrics.",
      alternatives: "Other investment opportunities and diversified index or fixed-income benchmarks have not been comparatively evaluated.",
      timeHorizon: "The expected investment duration and milestone check-ins have not been clearly established.",
      tradeoffs: "Higher growth potential may come coupled with elevated volatility, valuation multiple compression, or illiquidity.",
      stakeholders: "Other financial obligations, family dependencies, or debt obligations may affect how much risk is genuinely appropriate.",
      cognitiveBiases: "Your reasoning may be influenced by recency bias (overweighting recent quarters) and fear of missing out (FOMO).",
      reversibility: "Consider how quickly and frictionlessly you could liquidate or hedge the position if your thesis breaks down.",
      opportunityCost: "Capital locked into this position cannot simultaneously be deployed into lower-risk or higher-conviction opportunities.",
    };

    detailed = {
      goal: {
        finding: "Capital appreciation is implied, but target ROI and drawdown guardrails are undefined.",
        severity: "medium",
        explanation: "Without a clear quantitative target and stop-loss horizon, it is difficult to determine when to take profits or cut losses.",
        question: "What specific financial milestone determines whether this investment was successful?",
        confidence: 0.92,
      },
      requirements: {
        finding: "Liquidity criteria and cash reserve requirements are omitted.",
        severity: "medium",
        explanation: "Allocating funds without an emergency buffer risks forced liquidation at market bottoms.",
        question: "Do you have 6-12 months of liquid reserves independent of this capital allocation?",
        confidence: 0.88,
      },
      costResources: {
        finding: "Position sizing and downside capital tolerance are unquantified.",
        severity: "high",
        explanation: "Over-sizing a speculative growth allocation exposes the broader portfolio to disproportionate variance.",
        question: "What percentage of your total net worth would this single investment represent?",
        confidence: 0.94,
      },
      benefits: {
        finding: "Expected value calculation is missing realistic downside scenarios.",
        severity: "medium",
        explanation: "Focusing solely on upside multiples skews risk-reward asymmetry.",
        question: "What would the return profile look like if growth drops from 100% to 20% next year?",
        confidence: 0.91,
      },
      risks: {
        finding: "Multiple systemic, regulatory, and competitive risks are unaddressed.",
        severity: "high",
        explanation: "Fast-growing sectors attract well-funded incumbents and pricing pressure.",
        question: "How easily could a larger competitor replicate their core value proposition?",
        confidence: 0.95,
      },
      uncertainty: {
        finding: "Customer churn rates and moat sustainability are unknown.",
        severity: "medium",
        explanation: "Early top-line acceleration can conceal underlying retention decay.",
        question: "What is their net revenue retention and organic customer acquisition cost?",
        confidence: 0.87,
      },
      assumptions: {
        finding: "Historical velocity is assumed to predict future compounding.",
        severity: "high",
        explanation: "Growth rarely progresses linearly; market saturation curves invariably impose deceleration.",
        question: "What structural moat ensures this growth rate persists past the next two quarters?",
        confidence: 0.96,
      },
      evidence: {
        finding: "Heavily reliant on surface metrics and recent sentiment.",
        severity: "high",
        explanation: "Social buzz and past 12-month top-line figures do not reveal balance-sheet health.",
        question: "Have you analyzed their cash burn rate, gross margins, and debt obligations?",
        confidence: 0.93,
      },
      alternatives: {
        finding: "Benchmark assets and peer companies have not been contrasted.",
        severity: "medium",
        explanation: "Investing here carries opportunity risk against safer or better-valued alternatives.",
        question: "How does this asset compare to low-cost broad index funds or market leaders?",
        confidence: 0.89,
      },
      timeHorizon: {
        finding: "Short-term momentum is conflated with long-term ownership.",
        severity: "medium",
        explanation: "A swing trade requires completely different risk controls than a multi-year buy-and-hold.",
        question: "Are you planning to hold through a 40% intermediate price correction?",
        confidence: 0.90,
      },
      tradeoffs: {
        finding: "Volatility tolerance traded for potential alpha.",
        severity: "medium",
        explanation: "Pursuing exponential returns brings substantial psychological stress and portfolio volatility.",
        question: "Are you willing to endure extended drawdowns without panic selling?",
        confidence: 0.86,
      },
      stakeholders: {
        finding: "Shared financial goals or co-dependent commitments are unaddressed.",
        severity: "low",
        explanation: "Individual investment decisions often ripple into shared family finances or joint commitments.",
        question: "Will the potential loss of this capital impact any commitments made to partners or dependents?",
        confidence: 0.84,
      },
      cognitiveBiases: {
        finding: "Susceptible to Recency Bias, Survivorship Bias, and FOMO.",
        severity: "high",
        explanation: "Recent upward stock momentum frequently triggers psychological urgency to participate without rigorous valuation.",
        question: "Would you still consider buying if the price stayed flat for the next 18 months?",
        confidence: 0.95,
      },
      reversibility: {
        finding: "Liquidity and exit criteria need explicit pre-commitment.",
        severity: "medium",
        explanation: "Entering without an exit plan increases the likelihood of emotionally driven selling during volatility.",
        question: "What specific operational metrics or events would cause you to exit this position?",
        confidence: 0.91,
      },
      opportunityCost: {
        finding: "Forfeiture of alternative capital deployment.",
        severity: "medium",
        explanation: "Every dollar locked here is unavailable for debt repayment, emergency buffer, or subsequent market downturn discounts.",
        question: "What is the single most attractive alternative use for this specific sum of capital?",
        confidence: 0.89,
      },
    };

    blindSpots = [
      {
        id: "bs-1",
        title: "Assuming future growth will mirror the past",
        severity: "high",
        explanation: "You appear to project recent trajectory forward without accounting for market saturation, slowing consumer demand, or competitive counter-measures.",
        relatedPerspective: "Assumptions & Evidence",
      },
      {
        id: "bs-2",
        title: "No valuation multiples or price discipline considered",
        severity: "high",
        explanation: "A phenomenal company can still be a disastrous investment if bought at an excessive valuation multiple that leaves zero margin of safety.",
        relatedPerspective: "Cost / Resources & Trade-offs",
      },
      {
        id: "bs-3",
        title: "Lack of worst-case downside analysis",
        severity: "medium",
        explanation: "Your reasoning focuses exclusively on upside potential while overlooking the maximum tolerable drawdown and potential exit friction.",
        relatedPerspective: "Risks & Reversibility",
      },
    ];

    questions = [
      "What verifiable evidence suggests this growth rate can sustainably continue?",
      "What market, economic, or execution factors could cause growth to decelerate sharply?",
      "Have you compared this opportunity with safer, risk-adjusted alternative assets?",
      "How much capital loss or volatility can you realistically absorb without distress?",
    ];
  } else if (isJob) {
    analysisMap = {
      goal: "The goal centers on compensation uplift, but career trajectory, cultural fit, and mentorship depth are less defined.",
      requirements: "You may want to verify work-life expectations, runway of the company, and team retention rates.",
      costResources: "The physical, mental, and relocation expenses may offset a portion of the nominal salary increase.",
      benefits: "Higher immediate compensation is noted, but equity vesting schedules and dilution risks should be scrutinized.",
      risks: "Startups carry runway risk, leadership turnover, and potential burnout from long, unmoderated working hours.",
      uncertainty: "There is uncertainty about product-market fit longevity and internal engineering culture.",
      assumptions: "You appear to assume that higher compensation will inherently correlate with greater job satisfaction.",
      evidence: "Your perception of innovation may be formed from public PR and recruiter pitches rather than direct developer reviews.",
      alternatives: "Negotiating a raise or promotion in your current position, or interviewing with established tech firms, has not been weighed.",
      timeHorizon: "Consider whether this move serves your 3-year skill development or is primarily a short-term compensation boost.",
      tradeoffs: "Higher pay and growth upside are explicitly traded against personal time, work-life balance, and established routine.",
      stakeholders: "Relocation and extended hours directly impact partners, family members, and local support networks.",
      cognitiveBiases: "You may be experiencing the 'Grass is Greener' syndrome and anchoring heavily on the nominal dollar difference.",
      reversibility: "If the new environment turns toxic, consider how easily you could transition back to your previous company or peer network.",
      opportunityCost: "Accepting this role commits your prime working hours away from personal projects, family, or other potential offers.",
    };

    detailed = {
      goal: {
        finding: "Salary increase is prioritized over long-term autonomy and learning curves.",
        severity: "medium",
        explanation: "Evaluating an offer purely on headline cash can overlook toxic management and stagnation.",
        question: "Does this role teach you high-leverage skills you couldn't acquire where you are now?",
        confidence: 0.90,
      },
      requirements: {
        finding: "Runway and equity terms remain unverified.",
        severity: "high",
        explanation: "Joining a startup without auditing months of cash runway creates sudden employment risk.",
        question: "How many months of cash runway does the company have before needing their next funding round?",
        confidence: 0.94,
      },
      costResources: {
        finding: "Relocation friction and increased cost of living may erode the 25% bump.",
        severity: "medium",
        explanation: "Moving expenses, state taxes, and higher local rent can reduce net discretionary savings.",
        question: "What is the net take-home difference after adjusting for local tax and living costs?",
        confidence: 0.88,
      },
      benefits: {
        finding: "Title growth and equity upside require realistic discount rates.",
        severity: "low",
        explanation: "Startup equity often ends up worth less than projected due to liquidation preferences.",
        question: "What is the total share count and preferred liquidation overhang on common stock?",
        confidence: 0.86,
      },
      risks: {
        finding: "Burnout risk from extended hours combined with relocation stress.",
        severity: "high",
        explanation: "Underestimating the compounding strain of longer hours in an unfamiliar city.",
        question: "What safeguards will you maintain to prevent physical and mental exhaustion?",
        confidence: 0.92,
      },
      uncertainty: {
        finding: "Direct manager style and day-to-day autonomy are unknown.",
        severity: "medium",
        explanation: "People rarely leave bad jobs; they leave unsupportive managers.",
        question: "Have you backchannel-checked your prospective manager with former team members?",
        confidence: 0.90,
      },
      assumptions: {
        finding: "Assuming higher compensation compensates for longer work hours.",
        severity: "high",
        explanation: "If hourly commitment jumps by 30%, your effective hourly rate may actually decrease.",
        question: "What is your hourly earning rate when calculated across projected weekly hours?",
        confidence: 0.95,
      },
      evidence: {
        finding: "Relies primarily on recruiter assurances rather than engineering team audits.",
        severity: "medium",
        explanation: "Recruitment messaging emphasizes innovation while downplaying tech debt and churn.",
        question: "What did current employees mention when asked about on-call schedules and crunch periods?",
        confidence: 0.89,
      },
      alternatives: {
        finding: "Counter-offers and lateral internal moves have not been tested.",
        severity: "medium",
        explanation: "Leveraging your existing tenure might yield similar compensation without relocation friction.",
        question: "Could your current company match a portion of this offer or adjust your trajectory?",
        confidence: 0.87,
      },
      timeHorizon: {
        finding: "Evaluating through a 1-year lens rather than a 3-5 year portfolio.",
        severity: "medium",
        explanation: "Frequent job transitions can add resume friction if startup tenures are short.",
        question: "Where does this role position you in the job market in 36 months?",
        confidence: 0.88,
      },
      tradeoffs: {
        finding: "Sacrificing personal time and social capital for career acceleration.",
        severity: "high",
        explanation: "Relocating severs existing community anchors during high-pressure work periods.",
        question: "Are you willing to rebuild your social circle from scratch while working overtime?",
        confidence: 0.91,
      },
      stakeholders: {
        finding: "Significant impact on personal relationships and dependents.",
        severity: "high",
        explanation: "Relocation directly alters the daily routines of loved ones and close friends.",
        question: "Have you openly discussed the relocation trade-offs with those directly affected?",
        confidence: 0.93,
      },
      cognitiveBiases: {
        finding: "Anchoring bias on the headline percentage increase.",
        severity: "medium",
        explanation: "The psychological appeal of '25% more' obscures hidden friction points.",
        question: "If the salary bump were only 10%, would you still find this role compelling?",
        confidence: 0.91,
      },
      reversibility: {
        finding: "Moderate reversibility; relocation creates logistical lock-in.",
        severity: "medium",
        explanation: "Breaking a 12-month apartment lease and moving back carries non-trivial costs.",
        question: "What is your fallback plan if the company undergoes layoffs within 6 months?",
        confidence: 0.90,
      },
      opportunityCost: {
        finding: "Closing off other potential offers in your current city.",
        severity: "low",
        explanation: "Committing early may preclude other opportunities currently in pipeline.",
        question: "Are there other interviews or prospects you would have to prematurely cancel?",
        confidence: 0.85,
      },
    };

    blindSpots = [
      {
        id: "bs-job-1",
        title: "Effective hourly rate may actually decrease",
        severity: "high",
        explanation: "A 25% salary bump paired with 40% longer hours and relocation expenses can result in lower hourly compensation and higher net expenses.",
        relatedPerspective: "Cost / Resources & Trade-offs",
      },
      {
        id: "bs-job-2",
        title: "Company financial runway and burn rate unverified",
        severity: "high",
        explanation: "Series B startups are vulnerable to macro venture contractions; joining without verifying audited cash runway creates sudden layoff vulnerability.",
        relatedPerspective: "Risks & Requirements",
      },
      {
        id: "bs-job-3",
        title: "Relocation toll on personal support network",
        severity: "medium",
        explanation: "Moving away from family, friends, and support systems while taking on high-pressure work hours compounds psychological fatigue.",
        relatedPerspective: "Stakeholders & Reversibility",
      },
    ];

    questions = [
      "What is your net financial gain after accounting for relocation, local taxes, and extended working hours?",
      "What concrete evidence confirms the company has at least 18-24 months of stable cash runway?",
      "Have you explored whether your current employer would match terms or adjust your trajectory?",
      "If the work environment proves incompatible, what is your 6-month exit strategy?",
    ];
  } else {
    // General thoughtful breakdown for any decision
    analysisMap = {
      goal: "The primary objective is clear on the surface, but the underlying core emotional or strategic driver remains partially unarticulated.",
      requirements: "You haven't explicitly outlined the mandatory constraints and non-negotiable boundaries necessary for a healthy outcome.",
      costResources: "The true resource commitment—including emotional energy, cognitive focus, and auxiliary capital—has not been fully budgeted.",
      benefits: "You have focused on the most visible positive upside, while downstream secondary and tertiary advantages remain unexplored.",
      risks: "Worst-case scenario failure modes, external surprises, and unhedged vulnerabilities have not been systematically listed.",
      uncertainty: "Key assumptions have been treated as certainties despite depending on variables beyond your direct personal control.",
      assumptions: "One foundational assumption in your reasoning appears to be that current conditions and sentiment will remain steady.",
      evidence: "Your current perspective relies primarily on anecdotal observations or intuitive feelings rather than comprehensive comparative data.",
      alternatives: "A false binary ('do it or don't do it') may be constraining your choices; phased or hybrid alternatives have not been contrasted.",
      timeHorizon: "The balance between short-term relief and compound 3-to-5 year positioning has not been deliberately synchronized.",
      tradeoffs: "Pursuing this path requires explicitly deprioritizing another important facet of your time or capital.",
      stakeholders: "The ripple effects on people who depend on your presence, stability, or financial contributions should be examined.",
      cognitiveBiases: "Your thinking may be influenced by confirmation bias (seeking only validating signals) or status-quo anxiety.",
      reversibility: "You may want to consider how easily you could walk back this decision if unexpected complications emerge (one-way vs two-way door).",
      opportunityCost: "By committing your focus here, you forfeit the bandwidth to pursue parallel opportunities with potentially higher leverage.",
    };

    detailed = {
      goal: {
        finding: "Underlying core motivation deserves clearer articulation.",
        severity: "low",
        explanation: "Differentiating between reactive desires and core values leads to far more durable choices.",
        question: "What deep outcome are you truly trying to achieve through this action?",
        confidence: 0.88,
      },
      requirements: {
        finding: "Non-negotiable boundaries have not been codified.",
        severity: "medium",
        explanation: "Without clear constraints, decisions tend to drift and consume more resources than intended.",
        question: "What are your absolute deal-breakers and boundary lines for this path?",
        confidence: 0.87,
      },
      costResources: {
        finding: "Hidden cognitive and emotional costs are unbudgeted.",
        severity: "medium",
        explanation: "Decisions carry continuous attention costs long after the initial choice is finalized.",
        question: "How much daily cognitive bandwidth will managing this decision demand from you?",
        confidence: 0.89,
      },
      benefits: {
        finding: "Upside expectations may be optimistic without margin for error.",
        severity: "low",
        explanation: "Healthy choices remain beneficial even when outcomes reach only 60% of best-case targets.",
        question: "Would this choice still be worthwhile if benefits were 30% lower than expected?",
        confidence: 0.85,
      },
      risks: {
        finding: "Unhedged vulnerabilities and worst-case scenarios need scrutiny.",
        severity: "high",
        explanation: "Unanticipated compounding risks are the primary cause of regret in high-stakes decisions.",
        question: "What is the single most damaging outcome that could unfold, and can you survive it?",
        confidence: 0.93,
      },
      uncertainty: {
        finding: "Variables outside your direct control treated as dependable constants.",
        severity: "high",
        explanation: "External dependencies introduce fragility when unexpected shocks occur.",
        question: "Which critical factor in your plan relies entirely on other people or outside events?",
        confidence: 0.91,
      },
      assumptions: {
        finding: "Core premises accepted without rigorous stress-testing.",
        severity: "high",
        explanation: "Premises feel intuitive until actively challenged with counter-examples.",
        question: "What must be universally true for your chosen path to actually succeed?",
        confidence: 0.94,
      },
      evidence: {
        finding: "Reliance on recent subjective feelings rather than objective benchmarks.",
        severity: "medium",
        explanation: "Emotions are valuable guides but fluctuate rapidly under stress and fatigue.",
        question: "What concrete third-party data or historical track record supports your reasoning?",
        confidence: 0.88,
      },
      alternatives: {
        finding: "Potential false dilemma without intermediate or phased options.",
        severity: "medium",
        explanation: "Most binary decisions can be reframed into experiments, staged rollouts, or creative compromises.",
        question: "Is there a smaller, lower-stakes experiment you could run before full commitment?",
        confidence: 0.90,
      },
      timeHorizon: {
        finding: "Short-term emotional impulse vs compound long-term trajectory.",
        severity: "medium",
        explanation: "Decisions that solve immediate friction often introduce compounding long-term debt.",
        question: "How will you evaluate this decision when reflecting back on it in 5 years?",
        confidence: 0.89,
      },
      tradeoffs: {
        finding: "Unacknowledged sacrifice of time, flexibility, or capital.",
        severity: "medium",
        explanation: "Saying yes to this option implies an implicit no to something else.",
        question: "What valuable activity, relationship, or project must receive less attention as a result?",
        confidence: 0.90,
      },
      stakeholders: {
        finding: "Indirect impact on peers, family, or partners unexamined.",
        severity: "low",
        explanation: "Our choices rarely exist in a vacuum; secondary parties bear implicit consequences.",
        question: "Who else will experience the consequences of this decision, positive or negative?",
        confidence: 0.86,
      },
      cognitiveBiases: {
        finding: "Potential confirmation bias and optimism bias detected.",
        severity: "medium",
        explanation: "The human mind naturally collects arguments supporting an existing preference.",
        question: "Have you actively sought out the strongest argument against your own preference?",
        confidence: 0.92,
      },
      reversibility: {
        finding: "Exit cost and retreat complexity have not been mapped out.",
        severity: "medium",
        explanation: "Two-way doors can be executed quickly; one-way doors require deep pre-mortems.",
        question: "If you decide to reverse course 90 days from now, what is the exact cost and penalty?",
        confidence: 0.91,
      },
      opportunityCost: {
        finding: "Alternative allocations of bandwidth left unconsidered.",
        severity: "medium",
        explanation: "Energy invested here cannot be recouped to capitalize on subsequent opportunities.",
        question: "What other pursuit could deliver greater compound fulfillment with similar effort?",
        confidence: 0.88,
      },
    };

    blindSpots = [
      {
        id: "bs-gen-1",
        title: "Treating subjective intuition as verified evidence",
        severity: "high",
        explanation: "Your reasoning leans on how things feel in the moment rather than independently documented track records or objective benchmarks.",
        relatedPerspective: "Evidence & Assumptions",
      },
      {
        id: "bs-gen-2",
        title: "Overlooking hidden recurring resource commitments",
        severity: "medium",
        explanation: "Initial entry costs are easy to see, but ongoing cognitive strain, maintenance, and attention drain are often overlooked.",
        relatedPerspective: "Cost / Resources & Trade-offs",
      },
      {
        id: "bs-gen-3",
        title: "Framing the dilemma as an all-or-nothing binary",
        severity: "medium",
        explanation: "Instead of testing a reversible pilot or staged rollout, you may be forcing a total commitment before gathering real-world feedback.",
        relatedPerspective: "Alternatives & Reversibility",
      },
    ];

    questions = [
      "What verified evidence supports the belief that this will produce the outcome you expect?",
      "What external shocks or dependencies could disrupt your projected outcome?",
      "What reversible small test or phased commitment could you execute first?",
      "If this turns out to be mistaken, what is your maximum tolerable downside?",
    ];
  }

  const result: DecisionData = {
    id: "dec-" + Date.now(),
    createdAt: Date.now(),
    title: decision.slice(0, 60) + (decision.length > 60 ? "..." : ""),
    decision,
    reasoning,
    analysis: analysisMap,
    detailedAnalysis: detailed,
    blindSpots,
    questions,
    reflections: {},
    coverage: {
      evidence: 68,
      risks: 72,
      alternatives: 54,
      assumptions: 80,
      uncertainty: 62,
    },
    metrics: {
      blindSpotsCount: blindSpots.length,
      risksCount: 4,
      assumptionsCount: 2,
      missingInfoCount: 5,
    },
  };

  return result;
}

export function calculateCoverage(reflections: Record<string, string>): ReflectionCoverage {
  let count = 0;
  for (const key in reflections) {
    if (reflections[key] && reflections[key].trim().length > 10) {
      count++;
    }
  }

  // Base coverage increases organically with reflection quality
  const multiplier = count / 4; // 0 to 1
  return {
    evidence: Math.min(95, Math.round(55 + multiplier * 35)),
    risks: Math.min(96, Math.round(60 + multiplier * 32)),
    alternatives: Math.min(92, Math.round(45 + multiplier * 42)),
    assumptions: Math.min(98, Math.round(65 + multiplier * 30)),
    uncertainty: Math.min(94, Math.round(50 + multiplier * 38)),
  };
}

export function generateInsights(decisionData: DecisionData): KeyInsights {
  const { decision, reflections, analysis } = decisionData;
  const isInvestment = decision.toLowerCase().includes("invest") || decision.toLowerCase().includes("company");
  const isJob = decision.toLowerCase().includes("job") || decision.toLowerCase().includes("salary");

  const q1 = reflections["q1"] || "";
  const q2 = reflections["q2"] || "";
  const q3 = reflections["q3"] || "";
  const q4 = reflections["q4"] || "";

  let supportedReasoning = "";
  let whatIsUncertain = "";
  let mainBlindSpots = "";
  let whatReflectionAdded = "";

  if (isInvestment) {
    supportedReasoning = "The company has demonstrated strong historical revenue and positive public sentiment, which validates your initial commercial curiosity.";
    whatIsUncertain = "Historical growth rate does not guarantee sustained compounding, especially against macroeconomic shifts, margin compression, and industry competitors.";
    mainBlindSpots = "Valuation multiples were omitted, downside drawdown tolerances were unquantified, and liquid emergency reserves were not pre-allocated.";
    
    if (q1 || q2 || q3 || q4) {
      const snippets: string[] = [];
      if (q1) snippets.push("you examined continuous growth evidence");
      if (q2) snippets.push("you analyzed market and competitive failure risks");
      if (q3) snippets.push("you explored alternative investment allocations");
      if (q4) snippets.push("you identified your specific downside loss tolerance");
      whatReflectionAdded = `Your reflections demonstrated active critical thinking: ${snippets.join(", ")}. You transformed an impulsive momentum reaction into a structured evaluation.`;
    } else {
      whatReflectionAdded = "The user has started considering valuation multiples, market volatility, and comparing risk-adjusted alternative assets before deploying capital.";
    }
  } else if (isJob) {
    supportedReasoning = "The higher compensation package and learning opportunities at an innovative organization provide a legitimate catalyst for career progression.";
    whatIsUncertain = "Startup financial runway, true day-to-day managerial style, and team work-life balance remain unverified by external developer audits.";
    mainBlindSpots = "Effective hourly compensation was not calculated after factoring longer hours, relocation tax brackets, and personal support network dislocation.";
    
    if (q1 || q2 || q3 || q4) {
      whatReflectionAdded = "Your reflections added crucial scrutiny regarding cost-of-living adjustments, burnout prevention, and contingency exit planning.";
    } else {
      whatReflectionAdded = "The user is weighing net take-home pay, team culture, and long-term 3-year skill development against immediate title prestige.";
    }
  } else {
    supportedReasoning = "Your initial intention addresses a clear and genuine desire for improvement, growth, or optimization in your current circumstances.";
    whatIsUncertain = "External variables beyond your direct personal control are treated as reliable constants rather than volatile elements.";
    mainBlindSpots = "Hidden recurring attention costs, worst-case drawdown survivability, and reversible pilot tests were initially overlooked.";
    
    if (q1 || q2 || q3 || q4) {
      whatReflectionAdded = "Your reflections introduced healthy skepticism, uncovered non-negotiable personal boundaries, and identified a lower-risk staging approach.";
    } else {
      whatReflectionAdded = "The reflection phase revealed the importance of clarifying non-negotiables, exploring alternative compromises, and planning for reversibility.";
    }
  }

  return {
    supportedReasoning,
    whatIsUncertain,
    mainBlindSpots,
    whatReflectionAdded,
  };
}

export function generateUpdatedPerspective(decisionData: DecisionData): string {
  const { decision, reflections } = decisionData;
  const lower = decision.toLowerCase();
  
  const q1 = reflections["q1"]?.trim();
  const q2 = reflections["q2"]?.trim();
  const q3 = reflections["q3"]?.trim();
  const q4 = reflections["q4"]?.trim();

  if (lower.includes("invest") || lower.includes("company")) {
    if (q2 || q3 || q4) {
      return `I now realize I must audit the company's valuation multiples, stress-test downside risks against my capital tolerance (${q4 || "defined loss buffer"}), and compare diversified alternatives before making any final allocation.`;
    }
    return "I now realize I need to look at the company's valuation, downside risks, and compare it with other investment options before making a decision.";
  }

  if (lower.includes("job") || lower.includes("career")) {
    if (q2 || q4) {
      return `I recognize that while the salary increase is attractive, I must verify company cash runway, calculate effective hourly earnings with relocation expenses, and confirm managerial alignment before committing.`;
    }
    return "I realize I must weigh the total lifestyle and career trajectory impact—including working hours and culture—rather than anchoring solely on the headline salary increase.";
  }

  if (q1 || q2 || q3 || q4) {
    return `Having examined the blind spots, I now see the importance of testing my underlying assumptions, guarding against worst-case downside, and considering staged or reversible alternatives before finalizing my decision.`;
  }

  return "I now have a multi-perspective understanding of my decision. I will verify my core assumptions, establish clear risk guardrails, and maintain ownership of my final choice.";
}
