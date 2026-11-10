import Footer from "@/src/components/Footer";
import Nav from "@/src/components/Nav";
import Head from "next/head";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div>
      <Head>
        <title>Privacy Policy - Votar</title>
        <meta
          name="description"
          content="Read Votar's Privacy Policy to understand how we collect, use, and protect your personal information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Privacy Policy - Votar" />
        <meta
          property="og:description"
          content="Learn how Votar handles your personal data and privacy."
        />
        <meta property="og:url" content="https://www.votar.ng/privacy-policy" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.votar.ng/privacy-policy" />
      </Head>
      <div className="max-w-[1300px] mx-auto px-4 lg:px-0 xl:px-10">
        <Nav />
      </div>

      <div className="max-w-[900px] mx-auto px-4 lg:px-0 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#00122F] mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">
            Effective Date: 1st January 2026 &nbsp;&middot;&nbsp;
          </p>
          <p className="text-gray-600 mt-5 text-base leading-relaxed">
            Votar is an electronic voting platform operated by{" "}
            <strong>Konzi Tech Ltd</strong>. We are deeply committed to
            protecting the privacy, dignity, and personal data of every person
            who uses our platform. This Privacy Policy explains exactly what
            data we collect, why we collect it, how we protect it, and the
            rights you hold over it — clearly and without legal jargon. Please
            read it carefully before creating an account or casting a vote.
          </p>
        </div>

        <div className="space-y-12 text-gray-700 text-base leading-relaxed">
          {/* 1 */}
          <section>
            <SectionTitle number={1} title="Who We Are" />
            <p>
              The data controller responsible for your personal information
              collected through the Votar platform is{" "}
              <strong>Konzi Tech Ltd</strong>, trading as <strong>Votar</strong>
              , reachable at{" "}
              <a
                href="mailto:konzitech@gmail.com"
                className="text-[#00122F] underline"
              >
                konzitech@gmail.com
              </a>
              . For privacy and data protection enquiries, you may also contact
              our Data Protection Officer at{" "}
              <a
                href="mailto:Okonirene1@gmail.com"
                className="text-[#00122F] underline"
              >
                Okonirene1@gmail.com
              </a>
              .
            </p>
            <p className="mt-3">
              Your personal data is stored and processed within the Federal
              Republic of Nigeria on Oracle Cloud Infrastructure (OCI Nigeria
              Region). We operate in accordance with the{" "}
              <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> and the
              Nigeria Data Protection Regulation 2019 (NDPR).
            </p>
          </section>

          {/* 2 */}
          <section>
            <SectionTitle number={2} title="Scope of This Policy" />
            <p className="mb-3">
              This Privacy Policy applies to all personal data collected,
              processed, and stored by Konzi Tech Ltd through the Votar
              platform. It covers:
            </p>
            <BulletList
              items={[
                "All visitors to www.votar.ng",
                "Registered voters using the Votar platform to cast votes in any election",
                "Election organisers who create and manage elections on the platform",
                "Candidates nominated in elections managed through Votar",
                "Individuals who contact us through any official Votar channel",
              ]}
            />
            <p className="mt-3">
              This policy applies to both service tiers —{" "}
              <strong>Votar Pro</strong> (for verified, closed elections) and{" "}
              <strong>Free Votar</strong> (for open community voting) — and
              covers data collected via our web application, mobile-responsive
              interface, API integrations, and all associated communication
              channels.
            </p>
            <p className="mt-3 text-sm text-gray-500 border-l-4 border-gray-300 pl-4">
              This policy does not apply to third-party websites or services you
              may access via links on the Votar platform. Those services are
              governed by their own privacy policies.
            </p>
          </section>

          {/* 3 */}
          <section>
            <SectionTitle number={3} title="Information We Collect" />
            <p className="mb-4">
              We collect the minimum personal data necessary to deliver a
              secure, reliable, and transparent e-voting experience.
            </p>

            <Subsection title="Account Registration & Identity Data">
              <BulletList
                items={[
                  "Full legal name",
                  "Email address",
                  "Phone number (used for OTP delivery and identity verification)",
                  "Password (stored exclusively as a bcrypt hash — we never store your plaintext password)",
                  "Date of registration",
                  "Account role (voter, organiser, candidate, administrator)",
                ]}
              />
            </Subsection>

            <Subsection title="Election Participation Data">
              <BulletList
                items={[
                  "Voter registration status for a specific election",
                  "Confirmation of identity verification (verified / unverified status — not the verification document itself, unless explicitly required by the organiser and consented to by you)",
                  "Election participation timestamp (date and time you accessed the ballot)",
                  "A cryptographic receipt hash uniquely identifying your ballot submission — this hash cannot be reverse-engineered to reveal how you voted",
                ]}
              />
            </Subsection>

            <Subsection title="Organiser & Election Management Data">
              <BulletList
                items={[
                  "Organisation name and type",
                  "Election title, description, candidate list, and configuration settings",
                  "Voter roll (list of eligible voters imported or added by the organiser)",
                  "Election results data (candidate vote totals published at the close of the election)",
                ]}
              />
            </Subsection>

            <Subsection title="Technical & Device Data">
              <BulletList
                items={[
                  "IP address (logged at login and vote submission for security and fraud prevention purposes)",
                  "Browser type and version",
                  "Device type (desktop / mobile) and operating system",
                  "Session tokens and authentication tokens",
                  "API request logs including endpoint, timestamp, HTTP method, and response code",
                ]}
              />
            </Subsection>

            <Subsection title="Communication Data">
              <BulletList
                items={[
                  "Messages you send to our support team via email or any official contact channel",
                  "OTP delivery logs (phone number, timestamp, delivery status — not the OTP value itself)",
                  "Transactional email delivery logs (email address, email type, timestamp, delivery status)",
                ]}
              />
            </Subsection>

            <Subsection title="Payment Data (Organisers Only)">
              <p>
                We collect payment reference numbers and transaction
                status/timestamps. Card and banking data is handled entirely by
                Paystack (PCI-DSS Level 1 certified) — no card data ever reaches
                Votar servers.
              </p>
            </Subsection>

            <Subsection title="Data We Do Not Collect">
              <p>
                Votar does <strong>not</strong> collect your vote choice (see
                Section 5), national identity numbers (NIN) or BVN unless
                specifically required and lawfully authorised, biometric data,
                or sensitive personal data categories (health, religion,
                political opinion, ethnicity) unless explicitly disclosed by
                you. We operate on a principle of data minimisation — if we do
                not need it to deliver the service, we do not collect it.
              </p>
            </Subsection>
          </section>

          {/* 4 */}
          <section>
            <SectionTitle
              number={4}
              title="How & Why We Use Your Information"
            />
            <p className="mb-4">
              We process your personal data only for specific, documented
              purposes. For each purpose, we rely on a lawful basis under the
              Nigeria Data Protection Act 2023 (NDPA).
            </p>
            <ol className="space-y-4 list-decimal list-inside marker:font-semibold marker:text-[#00122F]">
              {[
                [
                  "Account creation & authentication",
                  "To create your Votar account, verify your identity, and securely log you in using password + OTP / TOTP multi-factor authentication.",
                  "Performance of contract; Legitimate interest",
                ],
                [
                  "Election access & voter verification",
                  "To confirm your eligibility to vote, issue your ballot, record your participation, and prevent duplicate votes.",
                  "Performance of contract; Legitimate interest",
                ],
                [
                  "OTP & transactional communications",
                  "To send one-time passwords, election access codes, registration confirmations, results notifications, and security alerts via SMS and email.",
                  "Performance of contract; Legitimate interest",
                ],
                [
                  "Election management",
                  "To enable organisers to configure elections, manage voter rolls, monitor participation, and publish certified results.",
                  "Performance of contract",
                ],
                [
                  "Platform security & fraud prevention",
                  "To detect and prevent unauthorised access, abuse, duplicate voting, bot activity, and other fraudulent behaviour.",
                  "Legitimate interest; Legal obligation",
                ],
                [
                  "Technical operation & improvement",
                  "To maintain uptime, diagnose errors, improve platform performance, and resolve technical issues.",
                  "Legitimate interest",
                ],
                [
                  "Audit trail maintenance",
                  "To maintain a tamper-evident, append-only log of all election system events for integrity verification and post-election review.",
                  "Legal obligation; Legitimate interest",
                ],
                [
                  "Legal compliance",
                  "To comply with applicable Nigerian laws, respond to lawful regulatory or law enforcement requests, and maintain required records.",
                  "Legal obligation",
                ],
                [
                  "Customer support",
                  "To respond to your enquiries, resolve disputes, and provide technical assistance.",
                  "Performance of contract; Legitimate interest",
                ],
                [
                  "Payment processing (organisers)",
                  "To facilitate payment for election services via Paystack and bank transfers.",
                  "Performance of contract",
                ],
              ].map(([purpose, description, basis]) => (
                <li key={String(purpose)}>
                  <span className="font-semibold text-[#00122F]">
                    {purpose}
                  </span>
                  <p className="mt-1 ml-5 text-gray-600">{description}</p>
                  <p className="mt-1 ml-5 text-sm text-gray-400">
                    Lawful basis: {basis}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-gray-500 border-l-4 border-gray-300 pl-4">
              We do not use your personal data for advertising, marketing
              profiling, or sale to data brokers.
            </p>
          </section>

          {/* 5 */}
          <section>
            <SectionTitle
              number={5}
              title="Ballot Secrecy & Election-Specific Privacy"
            />
            <p className="mb-4">
              This is the most fundamental privacy guarantee of any voting
              platform. Votar is architecturally designed so that no person —
              including Votar&apos;s own engineers, the election organiser, or
              any system administrator — can determine how any individual voter
              voted. This is not a policy statement alone; it is a technical
              guarantee built into the platform&apos;s architecture.
            </p>

            <Subsection title="How Ballot Secrecy Works">
              <p className="mb-3">
                When you cast your vote, Votar applies a cryptographic
                separation principle:
              </p>
              <BulletList
                items={[
                  "Your vote choice is stored separately from your identity as a voter.",
                  "Your identity record is updated only to confirm you participated — not what choice you made. This prevents duplicate voting while preserving anonymity.",
                  "A cryptographic SHA-256 receipt hash is generated to confirm your ballot was received. This hash cannot be reverse-engineered to reveal your vote.",
                  "Ballot data and voter participation records are stored in separate database tables with no direct linkage that would permit re-identification.",
                ]}
              />
            </Subsection>

            <Subsection title="What the Election Organiser Can See">
              <p className="mb-3">Election organisers can access:</p>
              <BulletList
                items={[
                  "The list of registered voters for their election (names and contact details they themselves provided or imported)",
                  "Which voters have participated — used for turnout tracking and closing the election",
                  "Aggregate vote totals per candidate or option — published at the close of the election",
                ]}
              />
              <p className="mt-3">
                Election organisers <strong>cannot</strong> see how any
                individual voter voted. Votar&apos;s platform technically
                prevents linking any specific voter to any specific vote choice.
                This is enforced at the database level, not merely by policy.
              </p>
            </Subsection>

            <Subsection title="Votar Employee Access">
              <p className="mb-3">
                Votar employees and engineers have access to platform
                infrastructure for operational and maintenance purposes only.
                All employee access is restricted by role-based access control
                (RBAC), fully logged in an append-only audit trail, and subject
                to signed confidentiality and data protection agreements. No
                Votar employee can determine how any individual voted.
              </p>
            </Subsection>
          </section>

          {/* 6 */}
          <section>
            <SectionTitle
              number={6}
              title="Data Sharing & Third-Party Disclosure"
            />
            <p className="mb-4">
              We do not sell, rent, trade, or otherwise commercially transfer
              your personal data to any third party. We share data only in the
              following limited circumstances:
            </p>
            <ol className="space-y-4 list-decimal list-inside marker:font-semibold marker:text-[#00122F]">
              <li>
                <span className="font-semibold text-[#00122F]">
                  With Election Organisers
                </span>
                <p className="mt-1 ml-5 text-gray-600">
                  When you participate in an election, the organiser can access
                  the information described in Section 5. By participating, you
                  acknowledge that the organiser has access to your registration
                  details and participation status. Organisers are themselves
                  bound by applicable data protection obligations.
                </p>
              </li>
              <li>
                <span className="font-semibold text-[#00122F]">
                  With Third-Party Service Providers
                </span>
                <p className="mt-1 ml-5 text-gray-600">
                  We engage carefully selected technology providers who act as
                  data processors under our instruction. They are contractually
                  bound by data processing agreements that restrict their use of
                  your data to the specific purpose for which it is shared. See
                  Section 7 for the full list.
                </p>
              </li>
              <li>
                <span className="font-semibold text-[#00122F]">
                  For Legal & Regulatory Compliance
                </span>
                <p className="mt-1 ml-5 text-gray-600">
                  We may disclose your personal data to law enforcement
                  agencies, regulatory authorities, or courts where required by
                  applicable Nigerian law or a valid court order. In such cases,
                  we will verify the legal validity of the request, disclose
                  only the minimum data required, and notify you to the extent
                  permitted by law.
                </p>
              </li>
              <li>
                <span className="font-semibold text-[#00122F]">
                  Business Transfers
                </span>
                <p className="mt-1 ml-5 text-gray-600">
                  In the event of a merger, acquisition, or sale of Konzi Tech
                  Ltd or its assets, your personal data may be transferred to
                  the successor entity. We will provide advance notice and any
                  successor entity will be bound by the terms of this Privacy
                  Policy.
                </p>
              </li>
              <li>
                <span className="font-semibold text-[#00122F]">
                  With Your Consent
                </span>
                <p className="mt-1 ml-5 text-gray-600">
                  We may share your personal data with any other third party
                  where we have obtained your explicit, informed, and
                  freely-given consent. You may withdraw this consent at any
                  time by contacting konzitech@gmail.com.
                </p>
              </li>
            </ol>
          </section>

          {/* 7 */}
          <section>
            <SectionTitle number={7} title="Third-Party Service Providers" />
            <p className="mb-4">
              The following third-party services are currently used to operate
              the Votar platform. Each provider acts as a data processor under
              our instruction and is bound by a data processing agreement.
            </p>
            <ul className="space-y-4">
              {[
                {
                  provider: "Oracle Cloud Infrastructure (OCI)",
                  role: "Cloud hosting, database, object storage, backup, and secrets management. All data remains within Nigeria (OCI Nigeria Region).",
                },
                {
                  provider: "Termii (Primary SMS Gateway)",
                  role: "Delivery of OTPs and voter notifications via SMS. NCC-registered Nigerian SMS provider.",
                },
                {
                  provider: "Twilio (Fallback SMS Gateway)",
                  role: "Backup SMS delivery for OTPs if the primary gateway is unavailable. Governed by Standard Contractual Clauses.",
                },
                {
                  provider: "Zoho (Email Delivery)",
                  role: "Delivery of transactional emails — confirmations, results, and security alerts. Encrypted in transit via TLS.",
                },
                {
                  provider: "Paystack (Payment Processing)",
                  role: "Processing organiser subscription and election service payments. PCI-DSS Level 1 certified. No card data reaches Votar servers.",
                },
                {
                  provider: "GitHub Actions (CI/CD)",
                  role: "Automated code testing, security scanning, and deployment pipeline. No production voter data is used in CI/CD environments.",
                },
              ].map(({ provider, role }) => (
                <li key={provider} className="border-l-4 border-gray-200 pl-4">
                  <p className="font-semibold text-[#00122F]">{provider}</p>
                  <p className="text-gray-600 text-sm mt-1">{role}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              We review our sub-processor list regularly. Any material changes
              will be reflected in an updated version of this Privacy Policy,
              and users will be notified as described in Section 16.
            </p>
          </section>

          {/* 8 */}
          <section>
            <SectionTitle number={8} title="Data Transfers & Residency" />
            <p className="mb-3">
              Your personal data is stored and processed within the Federal
              Republic of Nigeria on Oracle Cloud Infrastructure&apos;s Nigeria
              region. All voter and election data is subject to Nigerian law and
              remains within Nigerian territory.
            </p>
            <p className="mb-3">
              Where sub-processors such as Twilio and Zoho may process limited
              technical data (such as an OTP delivery request or an email
              address) outside Nigeria, such transfers are governed by
              contractual data processing agreements, Standard Contractual
              Clauses (SCCs), and transmission exclusively over encrypted
              channels (TLS 1.3).
            </p>
            <p>
              No electoral content data — vote records, ballot data, or election
              audit logs — ever leaves Nigerian territory.
            </p>
          </section>

          {/* 9 */}
          <section>
            <SectionTitle number={9} title="Data Retention & Deletion" />
            <p className="mb-4">
              We retain your personal data only for as long as is necessary for
              the purposes for which it was collected, or as required by
              applicable Nigerian law.
            </p>
            <ul className="space-y-3">
              {[
                [
                  "Account data",
                  "Duration of account + 12 months post-closure",
                ],
                [
                  "Voter participation records",
                  "12 months after election close date",
                ],
                [
                  "Ballot data (anonymised vote records)",
                  "36 months after election close date",
                ],
                ["Audit event logs", "36 months after election close date"],
                ["OTP delivery logs", "6 months"],
                ["Transactional email logs", "6 months"],
                ["Support communications", "24 months after ticket closure"],
                ["Technical / server logs", "90 days (rolling)"],
                [
                  "Payment records (organisers)",
                  "7 years — as required by Nigerian financial record-keeping obligations under CAMA 2020",
                ],
              ].map(([category, period]) => (
                <li
                  key={String(category)}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
                >
                  <span className="font-medium text-[#00122F] min-w-[260px]">
                    {category}
                  </span>
                  <span className="text-gray-500 text-sm">{period}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Upon expiry of the applicable retention period, personal data is
              securely and permanently deleted or irreversibly anonymised. You
              may request early deletion by exercising your Right to Erasure
              under Section 12.
            </p>
          </section>

          {/* 10 */}
          <section>
            <SectionTitle number={10} title="Security Measures" />
            <p className="mb-4">
              Konzi Tech Ltd implements a comprehensive, layered security
              programme to protect your data against unauthorised access,
              disclosure, alteration, and destruction.
            </p>

            <Subsection title="Technical Controls">
              <BulletList
                items={[
                  "Transport Encryption: All data between your browser and Votar is encrypted using TLS 1.3. HTTP connections are automatically redirected to HTTPS.",
                  "Data Encryption at Rest: All voter PII stored in our database is encrypted using AES-256-GCM.",
                  "Password Security: Passwords are stored as bcrypt hashes with a work factor of 12 — never in readable form.",
                  "Multi-Factor Authentication: Voter accounts require OTP verification. Organiser and administrator accounts require TOTP-based authenticator app verification.",
                  "JWT Authentication: Session tokens are signed with RS256 asymmetric cryptography and expire after 15 minutes. Refresh tokens rotate on every use.",
                  "Secrets Management: All cryptographic keys and API credentials are stored in Oracle Cloud Vault (HSM-backed) — never in source code.",
                  "Web Application Firewall (WAF): Deployed at the network perimeter with the OWASP Core Rule Set.",
                  "DDoS Protection: OCI network-level DDoS protection is active at all times.",
                  "Rate Limiting: API endpoints are rate-limited to prevent brute-force and automated abuse.",
                  "Brute-Force Lockout: Accounts are automatically locked after five consecutive failed login attempts.",
                ]}
              />
            </Subsection>

            <Subsection title="Organisational Controls">
              <BulletList
                items={[
                  "Role-Based Access Control (RBAC): Staff access only the systems and data required for their specific role, reviewed quarterly.",
                  "Append-Only Audit Log: All system events and administrative actions are recorded in an audit log that cannot be altered. A secondary copy is maintained in OCI Logging.",
                  "Penetration Testing: Regular automated vulnerability scanning (OWASP ZAP) and periodic security assessments.",
                  "Dependency Management: All third-party software dependencies are scanned for known CVEs in CI/CD. High or critical CVEs block deployment.",
                  "Incident Response: A documented incident response plan with defined escalation procedures and response time targets.",
                ]}
              />
            </Subsection>

            <p className="text-sm text-gray-500 border-l-4 border-gray-300 pl-4">
              Despite our best efforts, no internet-based system can guarantee
              absolute security. If you suspect your Votar account has been
              compromised, please contact us immediately at konzitech@gmail.com.
            </p>
          </section>

          {/* 11 */}
          <section>
            <SectionTitle number={11} title="Cookies & Tracking Technologies" />
            <p className="mb-4">
              Votar uses a small number of strictly necessary technical cookies
              and session tokens to operate the platform securely. We do not use
              advertising cookies, tracking pixels, or behavioural profiling
              technologies.
            </p>
            <ul className="space-y-4">
              {[
                {
                  name: "Session Cookie",
                  type: "Strictly Necessary",
                  description:
                    "Maintains your authenticated session while you are actively using the platform. Expires on browser close.",
                },
                {
                  name: "Refresh Token Cookie",
                  type: "Strictly Necessary",
                  description:
                    "An HTTP-only, SameSite=Strict cookie that allows session renewal without re-login. Rotates on every use. Expires after 7 days or on logout.",
                },
                {
                  name: "CSRF Token",
                  type: "Strictly Necessary",
                  description:
                    "Cross-Site Request Forgery protection token embedded in authenticated forms. Per-session duration.",
                },
                {
                  name: "Preference Cookie",
                  type: "Functional",
                  description:
                    "Stores your language and display preferences if you have set them. Expires after 12 months.",
                },
              ].map(({ name, type, description }) => (
                <li key={name} className="border-l-4 border-gray-200 pl-4">
                  <p className="font-semibold text-[#00122F]">
                    {name}{" "}
                    <span className="text-xs font-normal text-gray-400 ml-2">
                      {type}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We do not use Google Analytics, Facebook Pixel, or any similar
              third-party tracking technology. Because we use only strictly
              necessary and functional cookies, we do not display a cookie
              consent banner — these are required for the platform to function.
              If we ever introduce optional cookies, we will obtain your prior
              consent.
            </p>
          </section>

          {/* 12 */}
          <section>
            <SectionTitle number={12} title="Your Rights as a Data Subject" />
            <p className="mb-4">
              Under the Nigeria Data Protection Act 2023 (NDPA) and the Nigeria
              Data Protection Regulation (NDPR), you have the following rights
              with respect to your personal data:
            </p>
            <ol className="space-y-4 list-decimal list-inside marker:font-semibold marker:text-[#00122F]">
              {[
                [
                  "Right to Information",
                  "You have the right to be informed about how your personal data is collected, used, and shared — which this Privacy Policy fulfils.",
                ],
                [
                  "Right of Access",
                  "You may request a copy of all personal data we hold about you (a Subject Access Request). Email konzitech@gmail.com to submit a request.",
                ],
                [
                  "Right to Rectification",
                  "If any personal data we hold is inaccurate or incomplete, you may have it corrected via your account settings or by contacting us.",
                ],
                [
                  "Right to Erasure",
                  "You may request deletion of your personal data, subject to legal retention obligations (e.g. audit logs required by law).",
                ],
                [
                  "Right to Restrict Processing",
                  "You may request that we limit how we use your data while a dispute about its accuracy or our legitimate interests is being resolved.",
                ],
                [
                  "Right to Data Portability",
                  "You may request your personal data in a structured, machine-readable format (JSON or CSV) for transfer to another service.",
                ],
                [
                  "Right to Object",
                  "You may object to processing based on legitimate interests. We will cease processing unless we can demonstrate compelling grounds.",
                ],
                [
                  "Right to Withdraw Consent",
                  "Where we rely on your consent as a legal basis, you may withdraw it at any time without affecting the lawfulness of prior processing.",
                ],
                [
                  "Right to Lodge a Complaint",
                  "If you believe we have violated your data protection rights, you may lodge a complaint with the Nigeria Data Protection Commission (NDPC) at www.ndpb.gov.ng.",
                ],
              ].map(([right, description]) => (
                <li key={String(right)}>
                  <span className="font-semibold text-[#00122F]">{right}</span>
                  <p className="mt-1 ml-5 text-gray-600">{description}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-gray-500">
              We will respond to all verified data subject requests within 30
              days of receipt. In complex cases, this may be extended by a
              further 60 days with prior notice. We will never charge a fee
              unless a request is manifestly unfounded or excessive.
            </p>
          </section>

          {/* 13 */}
          <section>
            <SectionTitle number={13} title="Children's Privacy" />
            <p className="mb-3">
              The Votar platform is not intended for use by persons under the
              age of 18. We do not knowingly collect or process the personal
              data of minors. All users are required to confirm they are 18
              years of age or older at the point of registration.
            </p>
            <p>
              If you are a parent or guardian and believe your child has created
              a Votar account, please contact us immediately at
              konzitech@gmail.com. Upon verification, we will promptly delete
              the account and all associated personal data. Note that for
              elections conducted by student associations or educational
              institutions, the organising institution is responsible for
              ensuring appropriate voter age eligibility rules are applied.
            </p>
          </section>

          {/* 14 */}
          <section>
            <SectionTitle
              number={14}
              title="Automated Decision-Making & Profiling"
            />
            <p className="mb-3">
              Votar does not make any automated decisions about you that produce
              legal or similarly significant effects. We do not use profiling,
              machine learning, or artificial intelligence to evaluate, score,
              or classify individual users in ways that affect their rights,
              eligibility, or access to services.
            </p>
            <p className="mb-3">
              Automated processes on the platform are limited to:
            </p>
            <BulletList
              items={[
                "Duplicate vote detection — a database-level constraint that prevents the same voter from casting more than one ballot in the same election.",
                "Brute-force lockout — automatic temporary account lockout after five consecutive failed login attempts. Contact support to unlock your account.",
                "Rate limiting — automatic throttling of API requests to prevent abuse.",
              ]}
            />
            <p className="mt-3">
              If an automated security process incorrectly restricts your
              access, you have the right to request human review by contacting
              konzitech@gmail.com.
            </p>
          </section>

          {/* 15 */}
          <section>
            <SectionTitle number={15} title="Third-Party Links" />
            <p>
              The Votar platform may contain links to external websites,
              election result pages hosted by organising bodies, or
              documentation resources. These external sites are not operated by
              Konzi Tech Ltd and are not governed by this Privacy Policy. We
              have no control over, and accept no responsibility for, their
              content, privacy practices, or data security. We encourage you to
              review the privacy policy of any external site you visit.
            </p>
          </section>

          {/* 16 */}
          <section>
            <SectionTitle number={16} title="Updates to This Privacy Policy" />
            <p className="mb-3">
              We review and update this Privacy Policy periodically to reflect
              changes in our data practices, legal requirements, and platform
              features. The version number and effective date at the top of this
              document will always reflect the most current version.
            </p>
            <p className="mb-3">
              Where we make material changes — changes that significantly affect
              how we collect, use, or share your personal data — we will notify
              you by displaying a prominent notice on the platform at login,
              sending an email notification to the address associated with your
              account, and where required by law, obtaining your renewed consent
              before the changes take effect.
            </p>
            <p>
              Your continued use of the Votar platform after the effective date
              of a revised Privacy Policy constitutes your acceptance of the
              updated terms. If you do not agree with any updates, you should
              discontinue use of the platform and contact us to delete your
              account. All previous versions of this Privacy Policy are archived
              and available upon request.
            </p>
          </section>

          {/* 17 */}
          <section>
            <SectionTitle number={17} title="How to Contact Us" />
            <p className="mb-4">
              If you have any questions, concerns, or requests relating to this
              Privacy Policy or the handling of your personal data, please reach
              out to us. We are committed to responding promptly and resolving
              all data protection matters seriously and respectfully.
            </p>
            <ul className="space-y-2 text-sm">
              {[
                [
                  "General, Privacy & Security Enquiries",
                  "konzitech@gmail.com",
                ],
                ["Data Protection Officer", "Okonirene1@gmail.com"],
                ["Company Website", "www.votar.ng"],
                [
                  "Response Commitment",
                  "We acknowledge enquiries within 2 business days and aim to resolve them within 30 days.",
                ],
                [
                  "Nigeria Data Protection Commission",
                  "www.ndpb.gov.ng (for escalated complaints)",
                ],
              ].map(([label, value]) => (
                <li
                  key={String(label)}
                  className="flex flex-col sm:flex-row sm:gap-3"
                >
                  <span className="font-medium text-[#00122F] min-w-[260px]">
                    {label}
                  </span>
                  <span className="text-gray-600">{value}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 p-6 text-center">
              <p className="text-[#00122F] font-semibold text-lg">
                Your privacy is not a compliance checkbox — it is a core
                principle of how Votar operates.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Thank you for trusting us with your voice.
              </p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const SectionTitle = ({ number, title }: { number: number; title: string }) => (
  <div className="mb-5">
    <h2 className="text-xl font-bold text-[#00122F]">
      {number}. {title}
    </h2>
    <div className="mt-2 h-px bg-gray-200" />
  </div>
);

const Subsection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-5">
    <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
    {children}
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 list-disc list-inside marker:text-[#00122F] text-gray-600">
    {items.map((item, i) => (
      <li key={i} className="pl-1">
        {item}
      </li>
    ))}
  </ul>
);

export default PrivacyPolicy;
