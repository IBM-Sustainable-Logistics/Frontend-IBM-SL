import React from "react";
import Hero from "../components/hero.tsx";

/**
 * This is the terms and conditions page
 */
const Terms = () => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="terms-and-conditions px-4 sm:px-8 lg:px-16">
        <h2 className="text-3xl font-bold mt-8 mb-4">Terms and Conditions</h2>
        <p>
          These Terms and Conditions ("Terms") govern your use of our website.
          By accessing or using the site, you agree to be bound by these Terms.
          If you do not agree with any part of these Terms, you must not access
          the site.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          1. Intellectual Property Rights
        </h3>
        <p>
          Unless otherwise indicated, the site and all content and other
          materials on the site, including, without limitation, the logo, and
          all designs, text, graphics, pictures, information, data, software,
          sound files, other files, and the selection and arrangement thereof
          (collectively, "Site Content") are the proprietary property of IBM or
          our licensors or users and are protected by copyright, trademark,
          patent, and other intellectual property and proprietary rights laws.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          2. User Representations
        </h3>
        <p>
          By using the site, you represent and warrant that:
        </p>
        <ul className="list-disc list-inside">
          <li>
            All registration information you submit will be true, accurate,
            current, and complete.
          </li>
          <li>
            You will maintain the accuracy of such information and promptly
            update such registration information as necessary.
          </li>
          <li>
            You have the legal capacity and you agree to comply with these
            Terms.
          </li>
          <li>You are not under the age of 13.</li>
          <li>
            You will not access the site through automated or non-human means,
            whether through a bot, script, or otherwise.
          </li>
          <li>
            You will not use the site for any illegal or unauthorized purpose.
          </li>
          <li>
            Your use of the site will not violate any applicable law or
            regulation.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          3. Prohibited Activities
        </h3>
        <p>
          You may not access or use the site for any purpose other than that for
          which we make the site available. The site may not be used in
          connection with any commercial endeavors except those that are
          specifically endorsed or approved by us. Prohibited activity includes,
          but is not limited to:
        </p>
        <ul className="list-disc list-inside">
          <li>
            Systematically retrieving data or other content from the site to
            create or compile, directly or indirectly, a collection,
            compilation, database, or directory without written permission from
            us.
          </li>
          <li>
            Making any unauthorized use of the site, including collecting
            usernames and/or email addresses of users by electronic or other
            means for the purpose of sending unsolicited email, or creating user
            accounts by automated means or under false pretenses.
          </li>
          <li>
            Using a buying agent or purchasing agent to make purchases on the
            site.
          </li>
          <li>
            Using the site to advertise or offer to sell goods and services.
          </li>
          <li>
            Circumventing, disabling, or otherwise interfering with
            security-related features of the site, including features that
            prevent or restrict the use or copying of any Content or enforce
            limitations on the use of the site and/or the Content contained
            therein.
          </li>
          <li>Engaging in unauthorized framing of or linking to the site.</li>
          <li>
            Tricking, defrauding, or misleading us and other users, especially
            in any attempt to learn sensitive account information such as user
            passwords.
          </li>
          <li>
            Making improper use of our support services or submitting false
            reports of abuse or misconduct.
          </li>
          <li>
            Engaging in any automated use of the system, such as using scripts
            to send comments or messages, or using any data mining, robots, or
            similar data gathering and extraction tools.
          </li>
          <li>
            Interfering with, disrupting, or creating an undue burden on the
            site or the networks or services connected to the site.
          </li>
          <li>
            Attempting to impersonate another user or person or using the
            username of another user.
          </li>
          <li>Selling or otherwise transferring your profile.</li>
          <li>
            Using any information obtained from the site in order to harass,
            abuse, or harm another person.
          </li>
          <li>
            Using the site as part of any effort to compete with us or otherwise
            using the site and/or the Content for any revenue-generating
            endeavor or commercial enterprise.
          </li>
          <li>
            Deciphering, decompiling, disassembling, or reverse engineering any
            of the software comprising or in any way making up a part of the
            site.
          </li>
          <li>
            Attempting to bypass any measures of the site designed to prevent or
            restrict access to the site, or any portion of the site.
          </li>
          <li>
            Harassing, annoying, intimidating, or threatening any of our
            employees or agents engaged in providing any portion of the site to
            you.
          </li>
          <li>
            Deleting the copyright or other proprietary rights notice from any
            Content.
          </li>
          <li>
            Copying or adapting the site’s software, including but not limited
            to Flash, PHP, HTML, JavaScript, or other code.
          </li>
          <li>
            Uploading or transmitting (or attempting to upload or to transmit)
            viruses, Trojan horses, or other material, including excessive use
            of capital letters and spamming (continuous posting of repetitive
            text), that interferes with any party’s uninterrupted use and
            enjoyment of the site or modifies, impairs, disrupts, alters, or
            interferes with the use, features, functions, operation, or
            maintenance of the site.
          </li>
          <li>
            Uploading or transmitting (or attempting to upload or to transmit)
            any material that acts as a passive or active information collection
            or transmission mechanism, including without limitation, clear
            graphics interchange formats ("gifs"), 1×1 pixels, web bugs,
            cookies, or other similar devices (sometimes referred to as
            "spyware" or "passive collection mechanisms" or "pcms").
          </li>
          <li>
            Except as may be the result of standard search engine or Internet
            browser usage, using, launching, developing, or distributing any
            automated system, including without limitation, any spider, robot,
            cheat utility, scraper, or offline reader that accesses the site, or
            using or launching any unauthorized script or other software.
          </li>
          <li>
            Disparaging, tarnishing, or otherwise harming, in our opinion, us
            and/or the site.
          </li>
          <li>
            Using the site in a manner inconsistent with any applicable laws or
            regulations.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          4. Contribution License
        </h3>
        <p>
          By posting your Contributions to any part of the site or making
          Contributions accessible to the site by linking your account from the
          site to any of your social networking accounts, you automatically
          grant, and you represent and warrant that you have the right to grant,
          to us an unrestricted, unlimited, irrevocable, perpetual,
          non-exclusive, transferable, royalty-free, fully-paid, worldwide
          right, and license to host, use, copy, reproduce, disclose, sell,
          resell, publish, broadcast, retitle, archive, store, cache, publicly
          perform, publicly display, reformat, translate, transmit, excerpt (in
          whole or in part), and distribute such Contributions (including,
          without limitation, your image and voice) for any purpose, commercial,
          advertising, or otherwise, and to prepare derivative works of, or
          incorporate into other works, such Contributions, and grant and
          authorize sublicenses of the foregoing. The use and distribution may
          occur in any media formats and through any media channels.
        </p>
        <p>
          This license will apply to any form, media, or technology now known or
          hereafter developed, and includes our use of your name, company name,
          and franchise name, as applicable, and any of the trademarks, service
          marks, trade names, logos, and personal and commercial images you
          provide. You waive all moral rights in your Contributions, and you
          warrant that moral rights have not otherwise been asserted in your
          Contributions.
        </p>
        <p>
          We do not assert any ownership over your Contributions. You retain
          full ownership of all of your Contributions and any intellectual
          property rights or other proprietary rights associated with your
          Contributions. We are not liable for any statements or representations
          in your Contributions provided by you in any area on the site. You are
          solely responsible for your Contributions to the site and you
          expressly agree to exonerate us from any and all responsibility and to
          refrain from any legal action against us regarding your Contributions.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          5. Guidelines for Reviews
        </h3>
        <p>
          We may provide you areas on the site to leave reviews or ratings. When
          posting a review, you must comply with the following criteria:
        </p>
        <ul className="list-disc list-inside">
          <li>
            You should have firsthand experience with the person/entity being
            reviewed.
          </li>
          <li>
            Your reviews should not contain offensive profanity, or abusive,
            racist, offensive, or hate language.
          </li>
          <li>
            Your reviews should not contain discriminatory references based on
            religion, race, gender, national origin, age, marital status, sexual
            orientation, or disability.
          </li>
          <li>
            Your reviews should not contain references to illegal activity.
          </li>
          <li>
            You should not be affiliated with competitors if posting negative
            reviews.
          </li>
          <li>
            You should not make any conclusions as to the legality of conduct.
          </li>
          <li>You may not post any false or misleading statements.</li>
          <li>
            You may not organize a campaign encouraging others to post reviews,
            whether positive or negative.
          </li>
        </ul>
        <p>
          We may accept, reject, or remove reviews in our sole discretion. We
          have absolutely no obligation to screen reviews or to delete reviews,
          even if anyone considers reviews objectionable or inaccurate. Reviews
          are not endorsed by us, and do not necessarily represent our opinions
          or the views of any of our affiliates or partners. We do not assume
          liability for any review or for any claims, liabilities, or losses
          resulting from any review. By posting a review, you hereby grant to us
          a perpetual, non-exclusive, worldwide, royalty-free, fully-paid,
          assignable, and sublicensable right and license to reproduce, modify,
          translate, transmit by any means, display, perform, and/or distribute
          all content relating to reviews.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          6. Mobile Application License
        </h3>
        <p>
          <strong>Use License:</strong>{" "}
          If you access the site via a mobile application, then we grant you a
          revocable, non-exclusive, non-transferable, limited right to install
          and use the mobile application on wireless electronic devices owned or
          controlled by you, and to access and use the mobile application on
          such devices strictly in accordance with the terms and conditions of
          this mobile application license contained in these Terms.
        </p>
        <ul className="list-disc list-inside">
          <li>
            Make any modification, adaptation, improvement, enhancement,
            translation, or derivative work from the application.
          </li>
          <li>
            Violate any applicable laws, rules, or regulations in connection
            with your access or use of the application.
          </li>
          <li>
            Remove, alter, or obscure any proprietary notice (including any
            notice of copyright or trademark) posted by us or the licensors of
            the application.
          </li>
          <li>
            Use the application for any revenue generating endeavor, commercial
            enterprise, or other purpose for which it is not designed or
            intended.
          </li>
          <li>
            Make the application available over a network or other environment
            permitting access or use by multiple devices or users at the same
            time.
          </li>
          <li>
            Use the application for creating a product, service, or software
            that is, directly or indirectly, competitive with or in any way a
            substitute for the application.
          </li>
          <li>
            Use the application to send automated queries to any website or to
            send any unsolicited commercial e-mail.
          </li>
          <li>
            Use any proprietary information or any of our interfaces or our
            other intellectual property in the design, development, manufacture,
            licensing, or distribution of any applications, accessories, or
            devices for use with the application.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          7. Term and Termination
        </h3>
        <p>
          These Terms shall remain in full force and effect while you use the
          site. Without limiting any other provision of these terms, we reserve
          the right to, in our sole discretion and without notice or liability,
          deny access to and use of the site (including blocking certain IP
          addresses), to any person for any reason or for no reason, including
          without limitation for breach of any representation, warranty, or
          covenant contained in these terms or of any applicable law or
          regulation. We may terminate your use or participation in the site or
          delete any content or information that you posted at any time, without
          warning, in our sole discretion.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          8. Modifications and Interruptions
        </h3>
        <p>
          We reserve the right to change, modify, or remove the contents of the
          site at any time or for any reason at our sole discretion without
          notice. However, we have no obligation to update any information on
          our site. We also reserve the right to modify or discontinue all or
          part of the site without notice at any time. We will not be liable to
          you or any third party for any modification, price change, suspension,
          or discontinuance of the site.
        </p>
        <p>
          We cannot guarantee the site will be available at all times. We may
          experience hardware, software, or other problems or need to perform
          maintenance related to the site, resulting in interruptions, delays,
          or errors. We reserve the right to change, revise, update, suspend,
          discontinue, or otherwise modify the site at any time or for any
          reason without notice to you. You agree that we have no liability
          whatsoever for any loss, damage, or inconvenience caused by your
          inability to access or use the site during any downtime or
          discontinuance of the site. Nothing in these terms will be construed
          to obligate us to maintain and support the site or to supply any
          corrections, updates, or releases in connection therewith.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          9. Corrections
        </h3>
        <p>
          There may be information on the site that contains typographical
          errors, inaccuracies, or omissions, including descriptions, pricing,
          availability, and various other information. We reserve the right to
          correct any errors, inaccuracies, or omissions and to change or update
          the information on the site at any time, without prior notice.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          10. Disclaimer
        </h3>
        <p>
          The site is provided on an as-is and as-available basis. You agree
          that your use of the site and our services will be at your sole risk.
          To the fullest extent permitted by law, we disclaim all warranties,
          express or implied, in connection with the site and your use thereof,
          including, without limitation, the implied warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement. We make no warranties or representations about the
          accuracy or completeness of the site's content or the content of any
          websites linked to the site and we will assume no liability or
          responsibility for any (1) errors, mistakes, or inaccuracies of
          content and materials, (2) personal injury or property damage, of any
          nature whatsoever, resulting from your access to and use of the site,
          (3) any unauthorized access to or use of our secure servers and/or any
          and all personal information and/or financial information stored
          therein, (4) any interruption or cessation of transmission to or from
          the site, (5) any bugs, viruses, trojan horses, or the like which may
          be transmitted to or through the site by any third party, and/or (6)
          any errors or omissions in any content and materials or for any loss
          or damage of any kind incurred as a result of the use of any content
          posted, transmitted, or otherwise made available via the site. We do
          not warrant, endorse, guarantee, or assume responsibility for any
          product or service advertised or offered by a third party through the
          site, any hyperlinked website, or any website or mobile application
          featured in any banner or other advertising, and we will not be a
          party to or in any way be responsible for monitoring any transaction
          between you and any third-party providers of products or services. As
          with the purchase of a product or service through any medium or in any
          environment, you should use your best judgment and exercise caution
          where appropriate.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          11. Limitations of Liability
        </h3>
        <p>
          In no event will we or our directors, employees, or agents be liable
          to you or any third party for any direct, indirect, consequential,
          exemplary, incidental, special, or punitive damages, including lost
          profit, lost revenue, loss of data, or other damages arising from your
          use of the site, even if we have been advised of the possibility of
          such damages. Notwithstanding anything to the contrary contained
          herein, our liability to you for any cause whatsoever and regardless
          of the form of the action, will at all times be limited to the lesser
          of the amount paid, if any, by you to us during the one (1) month
          period prior to any cause of action arising or $100.00 USD. Certain US
          state laws and international laws do not allow limitations on implied
          warranties or the exclusion or limitation of certain damages. If these
          laws apply to you, some or all of the above disclaimers or limitations
          may not apply to you, and you may have additional rights.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          12. Indemnification
        </h3>
        <p>
          You agree to defend, indemnify, and hold us harmless, including our
          subsidiaries, affiliates, and all of our respective officers, agents,
          partners, and employees, from and against any loss, damage, liability,
          claim, or demand, including reasonable attorneys’ fees and expenses,
          made by any third party due to or arising out of: (1) your
          Contributions; (2) use of the site; (3) breach of these Terms; (4) any
          breach of your representations and warranties set forth in these
          Terms; (5) your violation of the rights of a third party, including
          but not limited to intellectual property rights; or (6) any overt
          harmful act toward any other user of the site with whom you connected
          via the site. Notwithstanding the foregoing, we reserve the right, at
          your expense, to assume the exclusive defense and control of any
          matter for which you are required to indemnify us, and you agree to
          cooperate, at your expense, with our defense of such claims. We will
          use reasonable efforts to notify you of any such claim, action, or
          proceeding which is subject to this indemnification upon becoming
          aware of it.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          13. User Data
        </h3>
        <p>
          We will maintain certain data that you transmit to the site for the
          purpose of managing the performance of the site, as well as data
          relating to your use of the site. Although we perform regular routine
          backups of data, you are solely responsible for all data that you
          transmit or that relates to any activity you have undertaken using the
          site. You agree that we shall have no liability to you for any loss or
          corruption of any such data, and you hereby waive any right of action
          against us arising from any such loss or corruption of such data.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          14. Electronic Communications, Transactions, and Signatures
        </h3>
        <p>
          Visiting the site, sending us emails, and completing online forms
          constitute electronic communications. You consent to receive
          electronic communications, and you agree that all agreements, notices,
          disclosures, and other communications we provide to you
          electronically, via email and on the site, satisfy any legal
          requirement that such communication be in writing. You hereby agree to
          the use of electronic signatures, contracts, orders, and other
          records, and to electronic delivery of notices, policies, and records
          of transactions initiated or completed by us or via the site. You
          hereby waive any rights or requirements under any statutes,
          regulations, rules, ordinances, or other laws in any jurisdiction
          which require an original signature or delivery or retention of
          non-electronic records, or to payments or the granting of credits by
          any means other than electronic means.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          15. Miscellaneous
        </h3>
        <p>
          These Terms and any policies or operating rules posted by us on the
          site or in respect to the site constitute the entire agreement and
          understanding between you and us. Our failure to exercise or enforce
          any right or provision of these Terms shall not operate as a waiver of
          such right or provision. These Terms operate to the fullest extent
          permissible by law. We may assign any or all of our rights and
          obligations to others at any time. We shall not be responsible or
          liable for any loss, damage, delay, or failure to act caused by any
          cause beyond our reasonable control. If any provision or part of a
          provision of these Terms is determined to be unlawful, void, or
          unenforceable, that provision or part of the provision is deemed
          severable from these Terms and does not affect the validity and
          enforceability of any remaining provisions. There is no joint venture,
          partnership, employment or agency relationship created between you and
          us as a result of these Terms or use of the site. You agree that these
          Terms will not be construed against us by virtue of having drafted
          them. You hereby waive any and all defenses you may have based on the
          electronic form of these Terms and the lack of signing by the parties
          hereto to execute these Terms.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          16. GDPR Compliance
        </h3>
        <p>
          We are committed to protecting your personal data and respecting your
          privacy. In accordance with the General Data Protection Regulation
          (GDPR), we ensure the following:
        </p>
        <ul className="list-disc list-inside">
          <li>
            <strong>Data Collection:</strong>{" "}
            We collect and process personal data only for specified, explicit,
            and legitimate purposes. The types of personal data we collect
            include [list types of personal data, e.g., name, email address,
            etc.].
          </li>
          <li>
            <strong>Legal Basis for Processing:</strong>{" "}
            We process your personal data based on your consent, the necessity
            to perform a contract, compliance with a legal obligation, or our
            legitimate interests.
          </li>
          <li>
            <strong>Data Subject Rights:</strong>{" "}
            You have the right to access, rectify, erase, restrict processing
            of, and object to the processing of your personal data. You also
            have the right to data portability and to lodge a complaint with a
            supervisory authority.
          </li>
          <li>
            <strong>International Data Transfers:</strong>{" "}
            If we transfer your personal data outside the EU, we will ensure
            appropriate safeguards are in place, such as standard contractual
            clauses or Privacy Shield certification.
          </li>
          <li>
            <strong>Data Retention:</strong>{" "}
            We retain your personal data only for as long as necessary to
            fulfill the purposes for which it was collected or as required by
            law.
          </li>
          <li>
            <strong>Consent:</strong>{" "}
            Where consent is the basis for processing, you have the right to
            withdraw your consent at any time.
          </li>
          <li>
            <strong>Security Measures:</strong>{" "}
            We implement appropriate technical and organizational measures to
            protect your personal data from unauthorized access, disclosure,
            alteration, or destruction.
          </li>
          <li>
            <strong>Breach Notification:</strong>{" "}
            In the event of a data breach, we will notify the relevant
            supervisory authority and affected individuals as required by law.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">
          17. Contact Us
        </h3>
        <p>
          In order to resolve a complaint regarding the site or to receive
          further information regarding use of the site, please contact us at:
        </p>
        <p>
          <br />
          Email: <a href="mailto:tanda@itu.dk">tanda@itu.dk</a>
          <br />
        </p>
      </section>
    </main>
  );
};

export default Terms;
