import { BRAND_NAME, SUPPORT_EMAIL } from "@/lib/brand";

export const TERMS_LAST_UPDATED = "May 29, 2026";

/** Legal operator name shown in Terms (customize for your entity). */
export const LEGAL_OPERATOR = "Deepchq, Inc.";

const app = BRAND_NAME;
const operator = LEGAL_OPERATOR;

export type TermsBlock = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: { id: string; text: string }[];
  bullets?: string[];
};

export const TERMS_SECTIONS: TermsBlock[] = [
  {
    id: "general",
    title: "In General",
    items: [
      {
        id: "1.1",
        text: `These Terms of Use (“Terms”) are the conditions for accessing and using ${app} (“${app} / Website / App”). Please read the Terms below. By accessing or using our Services, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please do not use our Services.`,
      },
      {
        id: "1.2",
        text: `These Terms apply to ${app}’s apps available on Google Play Store and Apple App Store, its official website, and ${app}’s official social media accounts.`,
      },
      {
        id: "1.3",
        text: `${app} is operated by ${operator} (“we”, “us”, “our”). These Terms constitute the legal and binding agreement between ${operator} and the User.`,
      },
    ],
  },
  {
    id: "definitions",
    title: "Definitions",
    paragraphs: ["For the purposes of these Terms, the following definitions apply:"],
    bullets: [
      `App: The mobile application belonging to ${app}.`,
      `Search: Searches conducted using ${app}, solely from public sources. Data from private sources is not included.`,
      `Social Media: Social networking platforms or online communities created and operated by ${app}.`,
      `User: Any individual or entity that accesses or uses the Services, including visitors and registered users.`,
      `Website: The official website operated by ${app}. Third-party links, advertisements, sponsors, and other services on the website are not included in this definition.`,
    ],
  },
  {
    id: "general-terms",
    title: "General Terms of Use",
    items: [
      {
        id: "3.1",
        text: `By accessing or using ${app}, the User agrees that these Terms, other policies, conditions, disclaimers, and all texts stated herein are deemed read and accepted. No separate declaration of acceptance is required. Upon acceptance, all information, services, and tools accessible through the application are offered to the User.`,
      },
      {
        id: "3.2",
        text: `The User represents that they are of legal age to use ${app}.`,
      },
      {
        id: "3.3",
        text: `Users who cannot fulfill the conditions in these Terms and the Privacy Policy should not download or use ${app}. If the User is not of the required age or is subject to a legal restriction, they must not use ${app}, as any acceptance would lack legal validity.`,
      },
    ],
  },
  {
    id: "tracking",
    title: "Tracking of the Terms of Use",
    items: [
      {
        id: "4.1",
        text: `${app} is developed and updated to provide the best possible service. We may change these Terms from time to time at our sole discretion, or introduce new services and conditions.`,
      },
      {
        id: "4.2",
        text: `We try to give reasonable notice of material changes. Users should review these Terms each time they access ${app}. Updated Terms enter into force on the date of publication. Continued access after changes constitutes acceptance.`,
      },
    ],
  },
  {
    id: "content",
    title: "Use of Content and Services",
    items: [
      {
        id: "5.1",
        text: `Use of ${app} is subject to these Terms and applicable law.`,
      },
      {
        id: "5.2",
        text: `We do not guarantee the accuracy or reliability of third-party sites, apps, or services linked from ${app} and assume no liability for them. Users must comply with third-party policies.`,
      },
      {
        id: "5.3",
        text: `Users may not sell products or services, run commercial advertisements, or engage in commercial activities through ${app} without our prior written approval.`,
      },
      {
        id: "5.4",
        text: `Users may access the service via the website, by downloading the app from Apple App Store or Google Play Store, or by subscribing through our web checkout.`,
      },
      {
        id: "5.5",
        text: `${app} offers weekly, quarterly, and annual subscription packages. Cancellation may be done at any time via the app store, account settings, or by contacting support.`,
      },
      {
        id: "5.6",
        text: `Subscription packages are as presented on the Pricing screen at purchase and offered as-is. We may change future packages. As services develop, new packages may be offered.`,
      },
      {
        id: "5.7",
        text: `We may determine contents and features offered on ${app} and may present the website and services with advertisements. We are not liable for third-party ad content.`,
      },
      {
        id: "5.8",
        text: `We are not responsible for advertising or use of third-party links on the website.`,
      },
      {
        id: "5.9",
        text: `${app} is an AI-based service for searches about things, people, and public figures from publicly available sources only. Users can review source links after searches. As an AI-based service, information may be incomplete, inaccurate, or out of date. Users should validate results using reference links and additional research. Outputs may not be completely original due to the nature of the service. Users acknowledge use of AI and public-source limitations.`,
      },
      {
        id: "5.10",
        text: `If information is incorrect or incomplete, users may report it via the feedback options in the app or by emailing ${SUPPORT_EMAIL}. We encourage reports to improve our services.`,
      },
    ],
  },
  {
    id: "responsibility",
    title: "Responsibility for the Use of the App",
    items: [
      {
        id: "6.1",
        text: `We take reasonable data security measures in line with applicable privacy law. See our Privacy Policy for details.`,
      },
      {
        id: "6.2",
        text: `The User is responsible for their device, internet access, and service providers. We are not liable where use is affected by the User’s equipment or connectivity.`,
      },
      {
        id: "6.5",
        text: `We may specify devices or versions on which ${app} may be used and may limit access on unsupported devices.`,
      },
      {
        id: "6.6",
        text: `Updates and maintenance may temporarily limit access. The User will not have claims against us for scheduled or emergency downtime.`,
      },
      {
        id: "6.7",
        text: `Device information may be recorded to recognize Users and restore sessions. Features may be unavailable if cookies or storage are cleared.`,
      },
      {
        id: "6.8",
        text: `We may add paid features or separate subscription tiers. Users acknowledge that future features may not be included in every plan.`,
      },
      {
        id: "6.9",
        text: `The person using the app is presumed to be the account holder or someone with permission. Users are responsible for account security and unauthorized activity, including unauthorized purchases.`,
      },
      {
        id: "6.10",
        text: `We are not responsible for loss arising from unauthorized account access. Accounts are personal and may not be transferred to third parties.`,
      },
      {
        id: "6.11",
        text: `Each account is for a single user. We are not responsible for consequences of account sharing.`,
      },
      {
        id: "6.12",
        text: `We do not warrant accuracy or completeness of search results. We are not liable for direct or indirect damages, including loss of profits, arising from use of content—including misuse or reliance on results.`,
      },
      {
        id: "6.13",
        text: `Links to social platforms are for reference only. There is no partnership or sponsorship with those platforms. ${app} compiles publicly available information.`,
      },
      {
        id: "6.14",
        text: `Searches are for informational purposes only. Any other use may result in termination and legal action.`,
      },
    ],
  },
  {
    id: "history",
    title: "Search History",
    items: [
      {
        id: "7.1",
        text: `Search history may be retained for a limited period as described in our Privacy Policy. Users may run new searches to refresh information.`,
      },
      {
        id: "7.2",
        text: `Using outputs for non-informational, commercial, immoral, or illegal purposes is prohibited. Users accept responsibility for their use.`,
      },
    ],
  },
  {
    id: "subscription",
    title: "Subscription and Payment",
    items: [
      {
        id: "8.1",
        text: `Unless canceled before renewal, subscriptions automatically continue for the selected billing period.`,
      },
      {
        id: "8.2",
        text: `Weekly, quarterly, and annual plans are indexed to pricing shown at signup. New plans offered later may not apply retroactively.`,
      },
      {
        id: "8.2b",
        text: `Weekly memberships provide access for one week, renew automatically, and may be canceled at any time.`,
      },
      {
        id: "8.3",
        text: `Annual memberships provide access for one year, renew automatically, and may be canceled at any time.`,
      },
      {
        id: "8.4",
        text: `After cancellation, access continues until the end of the paid period, then expires.`,
      },
      {
        id: "8.5",
        text: `Refunds for app-store purchases follow Apple or Google policies. Web subscriptions via Stripe are subject to our Refund Policy. We do not store full payment card data.`,
      },
    ],
  },
  {
    id: "warranty",
    title: "No Warranty and Limitations",
    items: [
      {
        id: "9.1",
        text: `${app} and its content are provided “as is” without warranties to the fullest extent permitted by law.`,
      },
      {
        id: "9.2",
        text: `We do not guarantee that ${app} is error-free, secure, or free of viruses or harmful components.`,
      },
      {
        id: "9.3",
        text: `Without limitation, we are not liable for: inability to use the service; accuracy or quality of content; transactions through ${app}; errors or omissions; unauthorized access to accounts; or other service-related problems—even if we were advised of possible harm.`,
      },
      {
        id: "9.4",
        text: `To the fullest extent permitted by law, we are not liable for indirect or consequential damages. Total liability for claims relating to the app is limited to the lesser of (a) twice the annual membership paid by the User, or (b) three times the weekly membership paid in the twelve months before the claim. Claims must be brought within one (1) year of the event giving rise to the claim.`,
      },
    ],
  },
  {
    id: "privacy",
    title: "Personal Data and Privacy",
    items: [
      {
        id: "10.1",
        text: `Protection of personal data is important to us. See our Privacy Policy for how we process your data.`,
      },
    ],
  },
  {
    id: "ip",
    title: "Intellectual and Industrial Property Rights",
    items: [
      {
        id: "11.1",
        text: `Intellectual property in the website, app, content, images, materials, functions, and tools belongs to ${operator} or its licensors.`,
      },
      {
        id: "11.2",
        text: `We own promotional materials, designs, logos, text, and other materials presented through ${app}.`,
      },
      {
        id: "11.3",
        text: `Users may not copy, reproduce, distribute, publish, or create derivative works from the app or its content without permission.`,
      },
      {
        id: "11.4",
        text: `Elements may not be used for commercial purposes without written permission.`,
      },
      {
        id: "11.5",
        text: `We grant a non-exclusive, non-transferable, revocable license for personal use of the app. No other IP rights are granted.`,
      },
    ],
  },
  {
    id: "prohibited",
    title: "Prohibited Uses",
    items: [
      {
        id: "12.1",
        text: `Prohibited uses include: illegal or immoral purposes; encouraging illegal acts; violating regulations; infringing IP; harassment, defamation, or discrimination; false or misleading information; malware; scraping or spam; circumventing security; FCRA-regulated uses (employment, credit, tenant screening); stalking or harassment.`,
      },
      {
        id: "12.2",
        text: `We may suspend or terminate access for unlawful content or conduct, including but not limited to: illegal pornography; drug sales; prescription drug sales; terrorism or hate content; insults damaging our reputation; IP infringement; unauthorized copying or redistribution; security attacks.`,
      },
      {
        id: "12.3",
        text: `Users must not automate requests beyond normal human use.`,
      },
      {
        id: "12.4",
        text: `Reverse engineering or attempting to obtain source code is prohibited.`,
      },
      {
        id: "12.5",
        text: `We may investigate violations and cooperate with authorities. Access may be terminated and data shared as required by law.`,
      },
      {
        id: "12.7",
        text: `To report unauthorized use of our content elsewhere, contact ${SUPPORT_EMAIL}.`,
      },
      {
        id: "12.8",
        text: `To report violations by other users, contact ${SUPPORT_EMAIL}. We may restrict or remove accounts after review.`,
      },
    ],
  },
  {
    id: "violation",
    title: "Violation of Terms",
    items: [
      {
        id: "13.1",
        text: `Failure to comply with these Terms or policies may result in suspension or termination without notice, and removal of stored information. Failure to enforce a provision does not waive our rights.`,
      },
    ],
  },
  {
    id: "termination",
    title: "Termination and Survival",
    items: [
      {
        id: "14.1",
        text: `We may suspend or terminate access if the User violates Terms, lacks legal capacity, payment fails, regulators require it, force majeure occurs, results are misused, or content is copied without authorization.`,
      },
      {
        id: "14.2",
        text: `Users may request termination by emailing ${SUPPORT_EMAIL}. Account deletion may also be available in-app. Some data may be retained as required by law.`,
      },
      {
        id: "14.3",
        text: `Provisions on privacy and intellectual property survive termination.`,
      },
    ],
  },
  {
    id: "records",
    title: "Records",
    items: [
      {
        id: "15.1",
        text: `Our electronic records (including logs and notifications) may constitute evidence in disputes regarding use of ${app}.`,
      },
    ],
  },
  {
    id: "integrity",
    title: "Integrity",
    items: [
      {
        id: "16.1",
        text: `If any provision is held unlawful, remaining provisions remain in effect.`,
      },
    ],
  },
  {
    id: "law",
    title: "Governing Law and Dispute Resolution",
    items: [
      {
        id: "17.1",
        text: `Disputes relating to use of ${app} are governed by the laws of the Republic of Turkey. Users connecting from outside Turkey accept Turkish law for disputes arising from use of ${app}, to the extent permitted by applicable mandatory consumer protections in their country of residence.`,
      },
      {
        id: "17.2",
        text: `Disputes shall be finally settled by arbitration under the Istanbul Arbitration Centre Arbitration Rules with a sole arbitrator. The law applicable to the merits shall be the laws of Turkey. Place of arbitration: Izmir. Language of arbitration: English.`,
      },
    ],
  },
  {
    id: "contact",
    title: "Information and Communication",
    items: [
      {
        id: "18.1",
        text: `Questions about these Terms: ${SUPPORT_EMAIL}`,
      },
    ],
  },
];
