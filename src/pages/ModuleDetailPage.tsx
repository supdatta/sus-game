import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PixelCard } from "@/components/ui/pixel-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// --- Existing Mindmap Imports ---
import waterMindmap1 from "@/assets/water-mindmap-1.png";
import waterMindmap2 from "@/assets/water-mindmap-2.png";
import waterMindmap3 from "@/assets/water-mindmap-3.png";
import waterMindmap4 from "@/assets/water-mindmap-4.png";
import forestMindmap1 from "@/assets/forest-mindmap-1.png";
import forestMindmap2 from "@/assets/forest-mindmap-2.png";

// --- Energy Mindmap Imports (ensuring .jpg extension) ---
import EnergyMindmap1 from "@/assets/Energy-Mindmap-1.jpg";
import EnergyMindmap2 from "@/assets/Energy-Mindmap-2.jpg";
import EnergyMindmap3 from "@/assets/Energy-Mindmap-3.jpg";
import EnergyMindmap4 from "@/assets/Energy-Mindmap-4.jpg";
import EnergyMindmap5 from "@/assets/Energy-Mindmap-5.jpg";

// --- NEW SDG Mindmap Imports (assuming .jpg extension) ---
import SDG_Mindmap_1 from "@/assets/SDG-Mindmap-1.jpg";
import SDG_Mindmap_2 from "@/assets/SDG-Mindmap-2.jpg";
import SDG_Mindmap_3 from "@/assets/SDG-Mindmap-3.jpg";
import SDG_Mindmap_4 from "@/assets/SDG-Mindmap-4.jpg";
import SDG_Mindmap_5 from "@/assets/SDG-Mindmap-5.jpg";

import completionImage from "@/assets/completion_image.svg";

// --- STATIC DATA INTERFACES ---
interface SectionContent {
  title: string;
  content: string;
  points: string[];
  image?: string;
}

interface ModuleDetailContent {
  executiveSummary: string;
  sections: SectionContent[];
}

interface ModuleContent {
  title: string;
  youtubeId: string;
  content: ModuleDetailContent;
  mindmaps: { title: string; image: string }[];
}

const waterConservationContent: ModuleContent = {
    title: "Water Conservation",
    youtubeId: "rqF39vL9gmY",
    content: {
      executiveSummary: "The world is on the precipice of a severe, short-term water Crisis. According to projections from the United Nations Water Agency, two-thirds of the global population—over five billion people—will be living in \"stressed water conditions\" within the next nine years.",
      sections: [
        {
          title: "1. The Imminent Threat of Global Water Stress",
          content: "The challenge of water scarcity is no longer a long-term sustainability issue but an urgent, short-term crisis that will directly affect the current generation.",
          points: [
            "Definition of Water Stress: A state where there is \"simply not enough water for agricultural, industrial, and domestic uses.\"",
            "Scale of the Crisis: The United Nations Water Agency forecasts that in nine years, two-thirds of the world's population will face water stress.",
            "Projected 2030 Scenario includes dried landscapes, diminishing food availability, non-potable tap water, and potential social conflict."
          ]
        },
        {
          title: "2. Core Drivers of the Water Crisis", 
          content: "The global crisis is exacerbated by overconsumption, pollution, and environmental pressures.",
          points: [
            "Running the Tap: Leaving the tap on while brushing teeth can waste up to 12 liters of water each time.",
            "Long Showers: Can consume between 6 to 45 liters of water per minute.",
            "Dripping Taps: A single leaking tap can waste up to 15 liters of water per day.",
            "Pollution from industrial discharge, agricultural runoff, and household products contaminate freshwater sources."
          ]
        },
        {
          title: "3. Framework for Sustainable Water Management",
          content: "A holistic and proactive approach is required to shift from the current trajectory of crisis.",
          points: [
            "Paradigm Shift: Transition from a culture of water consumption to one of conservation and stewardship.",
            "Key Pillars: Reduce water waste, improve water quality, ensure equitable access.",
            "Agricultural Focus: Agriculture accounts for over 70% of all freshwater use worldwide."
          ]
        },
        {
          title: "4. Technological and Collaborative Solutions",
          content: "Innovation and international partnership are essential to augmenting water supplies.",
          points: [
            "Smart Irrigation Systems: Use sensors and IoT to monitor soil moisture and optimize water use.",
            "Desalination Technologies: Remove salt from seawater to augment freshwater supplies.",
            "International Collaboration: 60% of world's freshwater flow crosses political boundaries."
          ]
        },
        {
          title: "5. The Power of Individual Action",
          content: "While systemic solutions are vital, the collective power of individual actions cannot be understated.",
          points: [
            "Bridging the Awareness Gap: The water crisis will directly impact the current population within nine years.",
            "The \"One Drop\" Philosophy: Individual contributions create ripple effects across billions of people.",
            "Every person has the power to contribute to the solution and protect the world's most precious resource."
          ]
        }
      ] as SectionContent[]
    },
    mindmaps: [
      { title: "Impending Global Water Crisis", image: waterMindmap1 },
      { title: "Solving the Global Water Crisis", image: waterMindmap2 },
      { title: "Individual Actions Solve Water Crisis", image: waterMindmap3 },
      { title: "Addressing Water Pollution from Common Soaps", image: waterMindmap4 }
    ]
  };

const forestConservationContent: ModuleContent = {
    title: "Forest Conservation",
    youtubeId: "ZG3iTtu66cw",
    content: {
      executiveSummary: "This briefing document synthesizes an analysis of the critical role forests play on economic, environmental, and social fronts, while also highlighting the severe threats they face from deforestation and unsustainable management. Forests provide essential ecosystem services, acting as the planet's primary buffer against climate change, housing 80% of terrestrial life, and supporting the livelihoods of approximately two billion rural people.",
      sections: [
        {
          title: "1. The Triad of Forest Benefits",
          content: "Analysis of forestry initiatives reveals that forests deliver a comprehensive suite of benefits that can be categorized as economic, environmental, and social.",
          points: [
            "Economic Advantages: Forests provide renewable materials, source of energy, and support employment in rural areas.",
            "Environmental Services: Critical for carbon sequestration, water system protection, and biodiversity conservation.",
            "Social and Well-being Contributions: Offer recreation spaces, mental health benefits, and educational resources."
          ]
        },
        {
          title: "2. The Global Crisis: Deforestation and Its Drivers",
          content: "Despite their immense value, forests are being lost at an alarming rate, posing a direct threat to global climate stability.",
          points: [
            "Scale of the Problem: Humans have wiped out 80% of the planet's original forest cover.",
            "Primary Drivers: Agriculture for meat production and monoculture crops like palm oil and soy.",
            "Human Cost: Approximately two billion rural people depend directly on forests for their survival."
          ]
        },
        {
          title: "3. Defining a Forest: Ecosystems vs. Monocultures",
          content: "A critical distinction exists between a true forest and a tree plantation, with significant implications for environmental policy.",
          points: [
            "Healthy Forest Ecosystem: Contains biodiversity, maintains soil health, and participates in the carbon cycle.",
            "Detriment of Monocultures: Lack biodiversity, cause soil degradation, and can become net carbon emitters.",
            "Policy Implications: Over 800 definitions of forest exist, making environmental protection decisions vitally important."
          ]
        },
        {
          title: "4. Sustainable Management: The Forest Ecosystem Services (FES) Approach",
          content: "A progressive management model that shifts focus from timber production to managing forests for complete ecosystem benefits.",
          points: [
            "Community-Centric Focus: Projects address primary local concerns like water scarcity.",
            "Local Management Strategy: Communities manage forests through protected zones and water conservation.",
            "Tangible Outcomes: Improved water access, better agricultural yields, and community empowerment."
          ]
        },
        {
          title: "5. Pathways to Forest Protection and Restoration",
          content: "A multi-pronged approach involving communities, consumers, and governments is required to reverse deforestation trends.",
          points: [
            "Empower Local and Indigenous Communities: When communities are empowered, forests are guaranteed to survive.",
            "Reform Consumer Demand: Consuming less meat directly reduces demand for deforestation.",
            "Policy and Advocacy: Support reforestation laws and question whether governments count monocultures as forests."
          ]
        }
      ] as SectionContent[]
    },
    mindmaps: [
      { title: "The Interconnected Benefits of Forests", image: forestMindmap1 },
      { title: "Deforestation: A Global Crisis", image: forestMindmap2 }
    ]
};

// --- NEW MODULE CONTENT: Energy Conservation ---
const energyConservationContent: ModuleContent = {
    title: "Energy Conservation",
    youtubeId: "vWvVl-SFFdk",
    content: {
      executiveSummary: "The global need for energy is the driving force behind modern economies and a central point of geopolitical strategy. As consumption patterns intensify, the practice of energy conservation emerges not as a choice but as a necessity for long-term survival and stability.",
      sections: [
        {
          title: "1. The Imperative for Energy Conservation",
          content: "The global need for energy is the driving force behind modern economies and a central point of geopolitical strategy. As consumption patterns intensify, the practice of energy conservation emerges not as a choice but as a necessity for long-term survival and stability.",
          points: [
            "Energy Conservation: The practice of reducing energy consumption while achieving the same level of productivity or comfort.",
            "Sustainability: Described as \"surviving for a longer duration of time with the same amount of comfort with the same amount of energy.\"",
            "Sustainable Energy Strategy: An action plan that combines energy efficiency, energy conservation, and the replacement of fossil fuels with renewable sources. It aims to meet the needs of the present \"without compromising the future.\""
          ]
        },
        {
          title: "1.2. The Scale of Global Energy Demand",
          content: "The global energy market represents an enormous economic and political force. Dr. Arvind Dhingra highlights that the market is valued at US$20 billion and that \"wars are being fought to control the resources which give us energy.\"",
          points: [
            "Projected Growth: Energy demand is projected to grow at a rate of 15% or more up to the year 2030.",
            "Historical Consumption Increase: The demand for energy has grown exponentially. While villages in India had little to no electricity in 1947, today, nearly every household has multiple energy-consuming appliances, including refrigerators, televisions, mobile phones, induction cookers, and microwaves."
          ]
        },
        {
          title: "1.3. Alignment with Global Development Goals",
          content: "The importance of energy is formally recognized within the United Nations' 17 Strategic Developmental Goals, with several goals directly encompassing energy access, sustainability, and climate action.",
          points: [
            "UN Goal",
            "Description",
            "Goal 7: Ensure access to affordable, reliable, sustainable, and modern energy for all.",
            "Goal 9: Build resilient infrastructure, promote sustainable industrialization, and foster innovation.",
            "Goal 12: Ensure sustainable consumption and production patterns.",
            "Goal 13: Take urgent action to combat climate change and its impact."
          ]
        },
        {
            title: "2. The Multi-Faceted Benefits of Conservation",
            content: "Energy conservation delivers a wide array of interconnected benefits that impact the environment, economy, and society.",
            points: [] // No direct points for this main section title
        },
        {
            title: "2.1. Environmental Benefits",
            content: "",
            points: [
                "Climate Change Mitigation: Reducing energy consumption significantly lowers greenhouse gas emissions, which are the primary contributors to climate change.",
                "Resource Preservation: Conservation lessens the reliance on finite, non-renewable fossil fuels, ensuring that these resources remain available for future generations.",
                "Improved Public Health: By reducing the burning of fossil fuels, conservation leads to improved air quality, which in turn reduces air pollution and associated health risks, creating healthier communities."
            ]
        },
        {
            title: "2.2. Economic Advantages",
            content: "",
            points: [
                "Cost Savings: Reduced energy consumption directly lowers utility bills for households, businesses, and governments. These savings can be redirected to other critical sectors like education, healthcare, and infrastructure.",
                "Technological Innovation: A focus on energy efficiency drives demand for renewable energy technologies, stimulating research and development in solar, wind, and hydroelectric power.",
                "Job Creation: The growing demand for sustainable energy solutions creates significant employment opportunities within the renewable energy sector."
            ]
        },
        {
            title: "2.3. Social and Geopolitical Stability",
            content: "",
            points: [
                "Enhanced Energy Security: By reducing dependence on foreign energy sources, nations can achieve a more stable and reliable energy supply.",
                "Reduced Vulnerability: Greater energy independence diminishes a nation's exposure to volatile price fluctuations and geopolitical tensions related to energy-rich regions."
            ]
        },
        {
            title: "3. Practical Strategies for Energy Conservation",
            content: "Effective energy conservation can be implemented across all sectors of society, from individual households to large-scale industries and municipalities.",
            points: [] // No direct points for this main section title
        },
        {
            title: "3.1. Individual and Domestic Actions",
            content: "Simple behavioral changes can have a cumulative and significant impact on energy consumption.",
            points: [
                "Use the Switch: The \"first and foremost thing\" is the electrical switch. Turn off lights and fans when leaving a room, especially in an office setting where individuals do not directly pay the bill.",
                "Power Down Electronics: Shut down computer screens when not in use. A television switched off only by a remote continues to consume 2 to 3 watts of power per hour; it should be turned off from the main switch.",
                "Optimize Air Conditioning: Air conditioners are \"major guzzlers\" of energy. Setting the temperature to a comfortable 26-27°C can save substantial energy. An experiment in a 300-house village found that raising the AC temperature by just one degree for one hour resulted in saving several kilowatt-hours of energy.",
                "Vehicle Efficiency: Turn off car, scooter, or motorcycle engines when stopped at a red light or stuck in traffic to conserve fuel."
            ]
        },
        {
            title: "3.2. Industrial, Commercial, and Agricultural Sectors",
            content: "Significant energy-saving potential exists in large-scale operations. It is estimated that up to 23% of energy can be saved across an entire economy, with sector-specific potential of 30% in agriculture and 20% in domestic and commercial areas.",
            points: [
                "Energy Audits: Conducting energy audits helps identify key areas where energy can be saved and managed more efficiently.",
                "Efficient Building Design: In India, the Energy Conservation Building Code (ECBC) dictates how construction can minimize energy consumption. However, a significant gap remains, as the Energy Performance Index (EPI) for commercial spaces in India is around 400 kWh/m², compared to the world standard of 120 kWh/m².",
                "Industrial Machinery: Instead of repeatedly rewinding a failed motor, which reduces its efficiency by 5% each time, industries should match the size of the motor to the load it carries.",
                "Municipal Management: The use of timers or photo sensors on streetlights can prevent them from remaining on during daylight hours, saving a significant amount of energy at a very low cost."
            ]
        },
        {
            title: "4. Renewable Energy: Promise and Pragmatism",
            content: "The transition to renewable energy is a critical part of a sustainable strategy, but it must be approached with a clear understanding of its challenges and limitations. Conservation remains the most direct and problem-free solution.",
            points: [] // No direct points for this main section title
        },
        {
            title: "4.1. The Shift to Renewables",
            content: "There is a clear global trend away from fossil fuels. In India, for example, reliance on fossil fuels has decreased from approximately 75% to 54%, with the share of solar and wind power growing. The United States has also made significant strides, becoming nearly 40% more energy-efficient since the OPEC oil crisis of the 1970s.",
            points: [] // No points specified for this sub-section
        },
        {
            title: "4.2. \"Common Sense\" Challenges",
            content: "Despite their benefits, renewable energy installations can create new problems.",
            points: [
                "Residential Impact: In a southern Swedish village, the construction of a large wind farm led to complaints from residents about loud noise and a \"disturbing strobe light effect.\"",
                "Practical Solutions: Proposed solutions include placing smaller turbines in residential areas and siting larger, more disruptive machines farther away from homes."
            ]
        },
        {
            title: "4.3. The Policy-Practice Gap",
            content: "Government policy plays a crucial role in the adoption of renewables. In the U.S., government support for renewable technologies still \"lags far behind subsidies for nuclear, oil, or coal.\" This has led to the sentiment that after pioneering much of the technology, the U.S. is now \"giving away the store\" by not maintaining even modest investment levels.",
            points: [] // No points specified for this sub-section
        },
        {
            title: "4.4. The Primacy of Conservation",
            content: "The most powerful insight is that reducing demand is the most efficient strategy. As stated in the National Geographic source, \"The single biggest change in our economy over the past 30 years...has been the change in our energy use.\" The easiest way to avoid the problems associated with any energy source is to simply \"need less of it.\"",
            points: [] // No points specified for this sub-section
        },
        {
            title: "5. A Framework for Action: The Ant Philosophy",
            content: "Dr. Arvind Dhingra proposes a motivational framework for conservation inspired by the behavior of ants, which emphasizes persistence, foresight, positivity, and collective effort.",
            points: [
                "1. Never Quit: Ants will always find a way to their destination. Similarly, one should never stop looking for ways to save energy and contribute to sustainability.",
                "2. Think Winter all Summer: Ants use the summer to store food for the winter. This teaches the importance of being realistic and planning ahead. Individuals and institutions should set clear, measurable targets for energy reduction.",
                "3. Think Summer all Winter: During difficult times, ants remember that better days will return. This principle encourages staying positive and recognizing that periods of energy scarcity can be overcome through conservation and innovation.",
                "4. Do All That You Can: A single ant can carry many times its own weight, and together, ants can move large objects. This illustrates that even small, individual efforts, when combined, can achieve massive results in energy conservation"
            ]
        }
      ] as SectionContent[]
    },
    mindmaps: [
      { title: "The Imperative for Energy Conservation", image: EnergyMindmap1 },
      { title: "Multi-Faceted Benefits of Conservation", image: EnergyMindmap2 },
      { title: "Practical Strategies for Energy Conservation", image: EnergyMindmap3 },
      { title: "Renewable Energy: Promise & Pragmatism", image: EnergyMindmap4 },
      { title: "A Framework for Action: The Ant Philosophy", image: EnergyMindmap5 }
    ]
};

// --- PLACEHOLDER for Renewable Energy (Kept as is, as requested) ---
const renewableEnergyContent: ModuleContent = {
    title: "Renewable Energy",
    youtubeId: "Txxp8_iV-tM", // Example YouTube video ID
    content: {
      executiveSummary: "This module explores the power of solar, wind, and other renewable energy sources. Content for this section is pending.",
      sections: [
        {
          title: "1. Introduction to Renewable Energy",
          content: "Content for this section will be added soon.",
          points: [
            "What are renewables?",
            "Difference from fossil fuels."
          ]
        }
      ]
    },
    mindmaps: [
      // Add mindmap imports and objects here when ready
    ]
};

// --- NEW MODULE CONTENT: SDG Part 1 ---
const sdgPart1Content: ModuleContent = {
  title: "SDG Part 1: Core Framework and Social Equity",
  youtubeId: "ETqEJMYAfJ0",
  content: {
    executiveSummary: "The Sustainable Development Goals (SDGs) represent a comprehensive and universal agenda adopted by the United Nations and its member countries to address the world's most pressing challenges. This framework consists of 17 interconnected goals with a core mission to eradicate poverty, protect the planet, and ensure prosperity for all people by the year 2030. The SDGs provide a detailed roadmap for tackling complex issues ranging from human dignity and social equity—such as ending hunger and providing quality education—to ensuring environmental sustainability through climate action and responsible consumption. Central to the framework is the principle of shared responsibility, emphasizing that success requires a global partnership involving governments, the private sector, and civil society. The 17th goal, \"Partnerships for the Goals,\" underscores that collaboration is fundamental to achieving the entire agenda. The sources stress that individual actions, however small, are crucial components of this collective effort, empowering every person to contribute to a more sustainable and equitable future.",
    sections: [
      {
        title: "Core Framework of the Sustainable Development Goals",
        content: "The Sustainable Development Goals are presented as \"17 goals to transform our world\" and \"the world’s best plan\" to address fundamental global issues. This initiative, adopted by the United Nations, establishes a list of 17 priorities with specific targets to be reached by 2030.",
        points: [
          "The Three Pillars of the Mission: The overarching goal of the SDGs is structured around three core ambitions:",
          "1. Eradicate Poverty: To end poverty in all its forms and dimensions.",
          "2. Protect the Planet: To combat climate change and preserve natural resources and ecosystems.",
          "3. Ensure Prosperity for All: To foster peaceful, just, and inclusive societies with economic, social, and technological progress.",
          "Shared Responsibility: A recurring theme is that achieving these goals is a collective responsibility. Success hinges on the active participation of all sectors of society, including:",
          "Governments: At local, national, and international levels.",
          "Businesses: Through sustainable practices and innovation.",
          "Society: Encompassing every individual's contribution to a more sustainable lifestyle."
        ]
      },
      {
        title: "Thematic Analysis of Key Goals and Challenges",
        content: "The 17 SDGs address a wide spectrum of interconnected global challenges. The following analysis groups the goals by core themes, presenting the definitions, problems, and statistical evidence outlined in the source materials.",
        points: []
      },
      {
        title: "Human Dignity and Social Equity",
        content: "This theme covers the foundational goals aimed at ensuring basic human needs and rights are met for everyone.",
        points: []
      },
      {
        title: "SDG 1: No Poverty",
        content: "Poverty is defined as a situation that prevents people from meeting their basic needs—such as food, clean water, a home, or healthcare—due to a lack of resources, going \"far beyond the lack of income.\"",
        points: [
          "Scope: According to UN data, almost half of the world's population lives in these conditions.",
          "Vulnerable Groups: The majority of people living in poverty are women and children. Factors like limited access to education and skilled labor exacerbate the situation for millions of women.",
          "Impact on Children: One in four children globally suffers from stunted growth due to poor nutrition."
        ]
      },
      {
        title: "SDG 2: Zero Hunger",
        content: "Hunger refers not only to the physical sensation of needing to eat but also to the \"lack of Basic Foods for adequate nutrition.\"",
        points: [
          "Scope: More than 800 million people worldwide suffer from this situation daily, with the problem primarily affecting African and Asian countries.",
          "Causes: Wars, as well as environmental, economic, and health crises, are cited as primary causes of hunger and inequality.",
          "Impact on Children: Over 26 million children under the age of five suffer from malnutrition."
        ]
      },
      {
        title: "SDG 3: Good Health and Well-being",
        content: "This goal emphasizes that providing a healthy life and well-being is \"essential for sustainable development.\"",
        points: [
          "Key Issues: Millions of people die annually because they cannot access medicine or medical care.",
          "Progress and Challenges: While life expectancy has increased and maternal deaths during childbirth have decreased by almost 65% in recent years, access to adequate healthcare remains a significant challenge, particularly in developing countries. Childhood nutrition is cited as having a major impact on adult health."
        ]
      },
      {
        title: "SDG 4: Quality Education",
        content: "Defined as the process that gives people access to knowledge, education is framed as a \"basic right for children, adolescents, and adults all over the world.\"",
        points: [
          "Access Crisis: More than 260 million children worldwide are not attending school.",
          "Barriers: Major obstacles include poverty (forcing children to work), long distances to schools in developing countries, and armed conflicts.",
          "Inequality: In some parts of the world, girls do not have the same opportunities as boys to attend school. Furthermore, according to UNESCO, 16% of adults globally are illiterate."
        ]
      },
      {
        title: "Equality and Justice",
        content: "These goals focus on dismantling systemic inequalities and building peaceful, inclusive societies.",
        points: []
      },
      {
        title: "SDG 5: Gender Equality",
        content: "Defined as a state where \"everyone has the same opportunities, rights, and privileges no matter what their gender is.\" The fight has historically focused on women achieving the same rights as men.",
        points: [
          "Statistical Evidence of Inequality:",
          "Only 13% of private land in the world is owned by women.",
          "More than 750 million girls get married before they become adults.",
          "Women earn less money than men for the same jobs."
        ]
      }
    ] as SectionContent[]
  },
  mindmaps: [
    { title: "The Sustainable Development Goals Framework", image: SDG_Mindmap_1 },
    { title: "Human Dignity and Social Equity SDGs", image: SDG_Mindmap_2 }
  ]
};

// --- NEW MODULE CONTENT: SDG Part 2 ---
const sdgPart2Content: ModuleContent = {
  title: "SDG Part 2: Equality, Economic Development, and Infrastructure",
  youtubeId: "DdTvj1umbNI",
  content: {
    executiveSummary: "Building upon the foundational principles of human dignity, this module delves into the Sustainable Development Goals (SDGs) that address equality, justice, economic development, and essential infrastructure. It highlights the pervasive nature of inequalities—from wealth disparities to gender wage gaps—and emphasizes the critical role of strong institutions in fostering peace and justice. Furthermore, it explores how decent work, robust industry, innovation, and sustainable urban planning are integral to creating inclusive and thriving societies, especially in developing regions. The content underscores the urgent need to bridge access gaps in basic services while mitigating the environmental impact of urban growth, reinforcing that sustainable progress is interdependent across social, economic, and environmental dimensions.",
    sections: [
      {
        title: "Equality and Justice",
        content: "These goals focus on dismantling systemic inequalities and building peaceful, inclusive societies.",
        points: []
      },
      {
        title: "SDG 5: Gender Equality",
        content: "Defined as a state where \"everyone has the same opportunities, rights, and privileges no matter what their gender is.\" The fight has historically focused on women achieving the same rights as men.",
        points: [
          "Statistical Evidence of Inequality:",
          "Only 13% of private land in the world is owned by women.",
          "More than 750 million girls get married before they become adults.",
          "Women earn less money than men for the same jobs."
        ]
      },
      {
        title: "SDG 10: Reduced Inequalities",
        content: "This goal addresses disparities in treatment and opportunity based on gender, religion, origin, and other factors. Inequality is identified as a cause of poverty, malnutrition, and hunger.",
        points: [
          "Wealth Disparity: The richest 1% of the world's population possesses more wealth than the rest of the global population combined.",
          "Wage Gap: Women can earn up to 75% less than men for performing the same job."
        ]
      },
      {
        title: "SDG 16: Peace, Justice, and Strong Institutions",
        content: "Peace is defined as a state of \"well-being and Harmony,\" while justice guarantees \"that everyone has the same opportunities without discrimination or Prejudice.\" Strong institutions are required to uphold these principles.",
        points: [
          "Conflict's Impact: The number of refugees from conflicts continues to increase annually. More than 25 million school-age children do not attend school because they live in conflict-affected areas."
        ]
      },
      {
        title: "Economic Development and Infrastructure",
        content: "This group of goals targets the creation of sustainable economies and resilient infrastructure that benefits everyone.",
        points: []
      },
      {
        title: "SDG 8: Decent Work and Economic Growth",
        content: "A \"decent job\" is one in which fundamental rights are respected without discrimination and with fair pay. This is presented as \"the way out of poverty.\"",
        points: [
          "Key Targets: The goal aims to end forced labor, slavery, and the use of child labor.",
          "Gender Pay Gap: Men earn an average of 23% more than women in many countries, a disparity referred to as the \"wage gap.\"",
          "Youth Employment: Young people often face significant difficulties in finding work, and the jobs available frequently have poor conditions and low pay."
        ]
      },
      {
        title: "SDG 9: Industry, Innovation, and Infrastructure",
        content: "These three elements are described as \"the basic tools for improving the development, economies, and therefore lives of the people living in the poorest countries.\"",
        points: [
          "Infrastructure Needs: Many developing countries still require quality infrastructure, including roads, sanitation, electricity, and internet access."
        ]
      },
      {
        title: "SDG 11: Sustainable Cities and Communities",
        content: "Sustainability is defined as \"meeting people's needs today in a way that allows people in the future to also meet their needs.\"",
        points: [
          "Urbanization Trends: More than half of the world's population lives in cities.",
          "Environmental Impact: Although cities occupy only 3% of the Earth's surface, they account for 60-80% of energy consumption and 70% of harmful carbon emissions."
        ]
      }
    ] as SectionContent[]
  },
  mindmaps: [
    { title: "Equality and Justice SDGs", image: SDG_Mindmap_3 }
  ]
};

// --- NEW MODULE CONTENT: SDG Part 3 ---
const sdgPart3Content: ModuleContent = {
  title: "SDG Part 3: Environmental Sustainability and Call to Action",
  youtubeId: "fo4qU8-eT_s",
  content: {
    executiveSummary: "The concluding part of the Sustainable Development Goals (SDGs) series focuses on critical environmental sustainability and climate action, alongside the overarching call for global partnerships. This module details the urgent need for clean water and sanitation, affordable and clean energy, and responsible consumption and production patterns to mitigate the destructive effects on our planet. It emphasizes decisive climate action, the protection of marine ecosystems, and the preservation of terrestrial life, highlighting alarming statistics on resource depletion, pollution, and biodiversity loss. Crucially, the module underlines SDG 17, \"Partnerships for the Goals,\" stressing that collective effort from governments, businesses, and individuals is paramount. It empowers individuals with practical actions—from energy conservation to advocacy—to contribute actively to a more sustainable and equitable future.",
    sections: [
      {
        title: "Environmental Sustainability and Climate Action",
        content: "These goals are dedicated to protecting the planet's natural systems, combating climate change, and ensuring resources are managed responsibly.",
        points: []
      },
      {
        title: "SDG 6: Clean Water and Sanitation",
        content: "",
        points: [
          "Access Gaps: One in three people globally do not have access to safe drinking water, and two out of five do not have a place to wash their hands."
        ]
      },
      {
        title: "SDG 7: Affordable and Clean Energy",
        content: "",
        points: [
          "Access Disparity: 13% of the world's population lacks modern electricity services, and approximately 3 billion people depend on wood or coal for cooking and heating.",
          "Climate Impact: Energy production currently contributes to about 60% of all global greenhouse gas emissions."
        ]
      },
      {
        title: "SDG 12: Responsible Consumption and Production",
        content: "Current production and consumption patterns are described as having \"destructive effects on the planet.\"",
        points: [
          "Resource Depletion: If current consumption rates continue, by 2050, humanity will require three times the natural resources available on Earth.",
          "Food Waste: Every year, one-third of all food produced is wasted, despite hunger being a major global problem.",
          "Emissions Growth: Between 1990 and 2020, CO2 and other greenhouse gas emissions increased by 50%."
        ]
      },
      {
        title: "SDG 13: Climate Action",
        content: "Climate change is affecting all countries, causing sea levels to rise and weather phenomena to become more extreme, such as droughts and floods. Urgent action is needed to mitigate these effects.",
        points: []
      },
      {
        title: "SDG 14: Life Below Water",
        content: "Oceans, which cover three-quarters of the Earth's surface and contain 97% of its water, regulate the planet's climate and are home to immense biodiversity.",
        points: [
          "Threats: Rising planetary temperatures, pollution, poor waste management, and illegal/excessive fishing are seriously damaging marine ecosystems."
        ]
      },
      {
        title: "SDG 15: Life on Land",
        content: "Forests are called the \"lungs of the planet\" and are home to over 80% of all terrestrial species.",
        points: [
          "Deforestation: Approximately 13 million hectares of forest—an area equivalent to the surface of Greece—disappear annually due to human activity.",
          "Biodiversity Loss: Of all known animal species, 8% have disappeared, and 22% are in danger of extinction."
        ]
      },
      {
        title: "The Call to Action",
        content: "",
        points: []
      },
      {
        title: "The Role of Partnership (SDG 17)",
        content: "SDG 17, \"Partnerships for the Goals,\" is presented as the fundamental enabler for achieving all other goals. The core message is \"we are stronger together.\" Success requires that governments, businesses, and individuals work in partnership. The fight against global warming is cited as a clear example of a borderless problem that necessitates global cooperation. The source emphasizes that for the goals to be met, richer countries must provide resources, including money and technology, to help less developed countries.",
        points: []
      },
      {
        title: "Individual Contribution",
        content: "The source materials strongly advocate for individual action, outlining concrete steps anyone can take. The UN's \"saving the world a guide for slackers\" guide is mentioned as a resource.",
        points: [
          "Action Category: Energy & Water Conservation - Specific Examples: Turn off lights and unplug appliances; take quick showers instead of baths.",
          "Action Category: Waste Reduction - Specific Examples: Recycle materials; use a refillable water bottle to reduce plastic usage.",
          "Action Category: Sustainable Living - Specific Examples: Use public transportation or ride a bike; donate unused items for a second life.",
          "Action Category: Advocacy - Specific Examples: Learn about the SDGs in reliable media and discuss them with family and friends."
        ]
      },
      {
        title: "Complete List of the 17 Sustainable Development Goals",
        content: "",
        points: [
          "1. No Poverty",
          "2. Zero Hunger",
          "3. Good Health and Well-being",
          "4. Quality Education",
          "5. Gender Equality",
          "6. Clean Water and Sanitation",
          "7. Affordable and Clean Energy",
          "8. Decent Work and Economic Growth",
          "9. Industry, Innovation and Infrastructure",
          "10. Reduced Inequalities",
          "11. Sustainable Cities and Communities",
          "12. Responsible Consumption and Production",
          "13. Climate Action",
          "14. Life Below Water",
          "15. Life on Land",
          "16. Peace, Justice and Strong Institutions",
          "17. Partnerships for the Goals"
        ]
      },
      {
        title: "Resources and Further Information",
        content: "The following resources were cited for learning more about the Sustainable Development Goals:",
        points: [
          "Website: un.org/sustainabledevelopment",
          "Mobile App: sdgsinaction.com",
          "Social Media: @GlobalGoalsUN on Facebook and Twitter (#GlobalGoals)"
        ]
      }
    ] as SectionContent[]
  },
  mindmaps: [
    { title: "Environmental Sustainability SDGs", image: SDG_Mindmap_4 },
    { title: "The Call to Action for SDGs", image: SDG_Mindmap_5 }
  ]
};


// --- HELPER CONSTANT ---
const STORAGE_KEY = "completedModules";

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  // State for this component's UI
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedMindmap, setSelectedMindmap] = useState<string | null>(null);
  const [isMindmapModalOpen, setIsMindmapModalOpen] = useState(false);
  
  // --- READ FROM LOCALSTORAGE ON MOUNT ---
  useEffect(() => {
    if (moduleId) {
      const savedStatus = localStorage.getItem(STORAGE_KEY);
      const completed = savedStatus ? JSON.parse(savedStatus) : {};
      if (completed[moduleId]) {
        setIsCompleted(true);
      }
    }
  }, [moduleId]);

  // --- Dynamic Content Selection ---
  let currentContent: ModuleContent;
  if (moduleId === 'water-conservation') {
    currentContent = waterConservationContent;
  } else if (moduleId === 'forest-conservation') {
    currentContent = forestConservationContent;
  } else if (moduleId === 'energy-conservation') {
    currentContent = energyConservationContent;
  } else if (moduleId === 'renewable-energy') {
    currentContent = renewableEnergyContent;
  } else if (moduleId === 'sdg-part-1') { // --- NEW SDG Part 1 ---
    currentContent = sdgPart1Content;
  } else if (moduleId === 'sdg-part-2') { // --- NEW SDG Part 2 ---
    currentContent = sdgPart2Content;
  } else if (moduleId === 'sdg-part-3') { // --- NEW SDG Part 3 ---
    currentContent = sdgPart3Content;
  }
  else {
    // Fallback for an invalid module ID
    return <div>Module not found!</div>;
  }

  const handleMarkComplete = () => {
    if (moduleId) {
      const savedStatus = localStorage.getItem(STORAGE_KEY);
      const completed = savedStatus ? JSON.parse(savedStatus) : {};
      completed[moduleId] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
      setIsCompleted(true);
      navigate('/sus-game/teaching');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto p-4">
        {isCompleted && (
          <div className="mb-8 p-6 bg-green-100 border-4 border-green-500 text-green-800 font-pixel text-center relative">
            <img src={completionImage} alt="Completion" className="mx-auto mb-4 w-24 h-24 pixelated" />
            <h2 className="text-2xl mb-2">Well done, Eco-Warrior!</h2>
            <p className="text-md mb-4">You have successfully completed the "{currentContent.title}" module.</p>
            <PixelButton onClick={() => navigate('/sus-game/teaching')} variant="primary">
              Back to All Modules
            </PixelButton>
          </div>
        )}
        {/* YouTube Video */}
        {currentContent.youtubeId && (
          <div className="mb-8 border-4 border-border p-2 bg-card">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full pixelated"
                src={`https://www.youtube.com/embed/${currentContent.youtubeId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Mindmap Carousel */}
        {currentContent.mindmaps && currentContent.mindmaps.length > 0 && (
          <div className="mb-8">
            <h2 className="font-pixel text-2xl text-foreground mb-4">Mind Maps</h2>
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {currentContent.mindmaps.map((mindmap, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <PixelCard>
                        <div
                          className="flex aspect-square items-center justify-center p-6 cursor-pointer"
                          onClick={() => {
                            setSelectedMindmap(mindmap.image);
                            setIsMindmapModalOpen(true);
                          }}
                        >
                          <img
                            src={mindmap.image}
                            alt={mindmap.title}
                            className="w-full h-full object-contain pixelated"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </div>
                        <p className="font-pixel text-center text-sm text-muted-foreground mt-2">{mindmap.title}</p>
                      </PixelCard>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        {/* Mindmap Modal */}
        {isMindmapModalOpen && selectedMindmap && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setIsMindmapModalOpen(false)}
          >
            <div className="relative bg-card p-4 border-4 border-border max-w-3xl max-h-full overflow-auto"
                 onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-foreground text-2xl font-pixel"
                onClick={() => setIsMindmapModalOpen(false)}
              >
                &times;
              </button>
              <img src={selectedMindmap} alt="Mindmap" className="w-full h-auto pixelated" />
            </div>
          </div>
        )}

        {/* Module Content */}
        <div className="space-y-6">
          <h1 className="font-pixel text-3xl text-foreground mb-4">Learning Content</h1>
          <h2 className="font-pixel text-xl text-orange-700 mb-2">Executive Summary</h2>
          <p className="font-pixel text-muted-foreground text-sm leading-relaxed">
            {currentContent.content.executiveSummary}
          </p>

          {currentContent.content.sections.map((section, index) => (
            <div key={index} className="bg-card p-6 border-4 border-border">
              <h2 className="font-pixel text-xl text-green-700 mb-3">{section.title}</h2>
              <p className="font-pixel text-muted-foreground text-sm leading-relaxed">
                {section.content}
              </p>
              {section.points && section.points.length > 0 && (
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  {section.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="font-pixel text-muted-foreground text-sm leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* ACTION BUTTON */}
        {!isCompleted && (
          <div className="text-center mt-8">
            <PixelButton onClick={handleMarkComplete} variant="primary">
              Mark as Complete
            </PixelButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;