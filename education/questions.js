export const ASSESSMENT_QUESTIONS = Object.freeze([
  {
    id: "stock-flow",
    concept: "Stock-flow accumulation",
    prompt: "If global CO₂ emissions decline but total anthropogenic inflow remains above total net removal, what happens to atmospheric CO₂?",
    options: [
      "It immediately declines.",
      "It continues to rise, but more slowly.",
      "It stays exactly constant.",
      "The result cannot be related to inflow and removal."
    ],
    correctIndex: 1,
    explanation: "Atmospheric CO₂ is a stock. It rises while total inflow exceeds total removal; lower emissions can reduce the rate of accumulation without reversing it."
  },
  {
    id: "policy-delay",
    concept: "Policy transmission and delay",
    prompt: "Why can fossil-fuel emissions persist for years after a carbon price is introduced?",
    options: [
      "A carbon price has no possible effect on investment.",
      "Existing capital, contracts, expectations, implementation delays, and institutions can mediate how quickly investment and use change.",
      "Atmospheric CO₂ prevents firms from changing technology.",
      "Because extraction and combustion are physically identical events."
    ],
    correctIndex: 1,
    explanation: "In the advanced model, policy acts through expected profitability, investment, retirement, capacity, extraction, inventories, and use. Long-lived stocks and implementation delays prevent an instantaneous response."
  },
  {
    id: "resource-budget",
    concept: "Resources versus climate budget",
    prompt: "Does a very large fossil-carbon resource estimate imply that all of that carbon will eventually be emitted?",
    options: [
      "Yes; a geological resource estimate is a forecast of future emissions.",
      "Yes; resources and proved reserves are the same quantity.",
      "No; resources differ from reserves, economic supply, actual extraction, and a climate-compatible carbon budget.",
      "No; because geological carbon can never be extracted."
    ],
    correctIndex: 2,
    explanation: "The IPCC resource frame is a scale comparison, not a forecast. Physical occurrence, economic recoverability, investment, policy, demand, and climate constraints are distinct."
  },
  {
    id: "history",
    concept: "Path dependence and capital turnover",
    prompt: "How can historical investment affect the effectiveness of a climate policy introduced today?",
    options: [
      "It cannot; only current prices matter.",
      "Past investment leaves stocks of infrastructure, capability, supply chains, and institutional dependence that retire or change over time.",
      "Past investment changes the number of carbon atoms on Earth.",
      "Historical investment matters only for accounting, not behavior."
    ],
    correctIndex: 1,
    explanation: "Long-lived capital and accumulated capabilities can create inertia. This is the core reason the project models stocks rather than treating policy as a direct emissions multiplier."
  },
  {
    id: "extraction-emission",
    concept: "Extraction versus atmospheric emission",
    prompt: "Why does the advanced model separate fossil extraction from atmospheric emissions?",
    options: [
      "Because extracted carbon can pass through inventories, non-combustion uses, process emissions, combustion, and delayed product decay.",
      "Because extracted fossil carbon never reaches the atmosphere.",
      "Because atmospheric carbon is measured in a different physical element.",
      "Only to make the model visually more complicated."
    ],
    correctIndex: 0,
    explanation: "Extraction and emission are distinct processes. Separating them makes the carbon bookkeeping explicit and allows delays and non-combustion uses without violating conservation."
  },
  {
    id: "natural-sinks",
    concept: "Natural sinks",
    prompt: "If atmospheric CO₂ is rising, what does that imply about land and ocean carbon sinks?",
    options: [
      "They must have stopped absorbing carbon entirely.",
      "They must have reached one fixed maximum capacity.",
      "They can still be absorbing carbon; atmospheric CO₂ rises when net anthropogenic inflow exceeds total net removal.",
      "They necessarily emit more carbon than humans."
    ],
    correctIndex: 2,
    explanation: "Rising atmospheric CO₂ does not mean natural sinks have stopped. The relevant stock-flow condition is the balance between total inflow and total net removal."
  }
]);
