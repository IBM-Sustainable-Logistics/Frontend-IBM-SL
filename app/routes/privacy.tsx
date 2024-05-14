import React from "react";
import Hero from "../components/hero.tsx";

const privacy = () => {
    return (
        <main
            className=" min-h-screen flex items-center justify-center"
        >
            <section className="privacy-policy px-4 sm:px-8 lg:px-16">
                <h2 className="text-3xl font-bold mt-8 mb-4">Privacy Policy</h2>
                <p>
                    This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your information when you visit our website.
                    Please read this privacy policy carefully. If you do not
                    agree with the terms of this privacy policy, please do not
                    access the site.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-2">
                    1. Information We Collect
                </h3>
                <p>
                    We may collect information about you in a variety of ways.
                    The information we may collect on the site includes:
                </p>
                <ul className="list-disc list-inside">
                    <li>
                        <strong>Personal Data:</strong> Personally identifiable
                        information, such as your name, shipping address, email
                        address, and telephone number, and demographic
                        information, such as your age, gender, hometown, and
                        interests, that you voluntarily give to us when you
                        register with the site or when you choose to participate
                        in various activities related to the site, such as
                        online chat and message boards.
                    </li>
                    <li>
                        <strong>Derivative Data:</strong> Information our
                        servers automatically collect when you access the site,
                        such as your IP address, your browser type, your
                        operating system, your access times, and the pages you
                        have viewed directly before and after accessing the
                        site.
                    </li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">
                    2. Use of Your Information
                </h3>
                <p>
                    Having accurate information about you permits us to provide
                    you with a smooth, efficient, and customized experience.
                    Specifically, we may use information collected about you via
                    the site to:
                </p>
                <ul className="list-disc list-inside">
                    <li>Create and manage your account.</li>
                    <li>
                        Process your transactions and deliver the services you
                        requested.
                    </li>
                    <li>Email you regarding your account or order.</li>
                    <li>Enable user-to-user communications.</li>
                    <li>Increase the efficiency and operation of the site.</li>
                    <li>
                        Monitor and analyze usage and trends to improve your
                        experience with the site.
                    </li>
                    <li>Notify you of updates to the site.</li>
                    <li>
                        Offer new products, services, and/or recommendations to
                        you.
                    </li>
                    <li>Perform other business activities as needed.</li>
                    <li>
                        Request feedback and contact you about your use of the
                        site.
                    </li>
                    <li>Resolve disputes and troubleshoot problems.</li>
                    <li>Respond to product and customer service requests.</li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">
                    3. Disclosure of Your Information
                </h3>
                <p>
                    We may share information we have collected about you in
                    certain situations. Your information may be disclosed as
                    follows:
                </p>
                <ul className="list-disc list-inside">
                    <li>
                        <strong>By Law or to Protect Rights:</strong> If we
                        believe the release of information about you is
                        necessary to respond to legal process, to investigate or
                        remedy potential violations of our policies, or to
                        protect the rights, property, and safety of others, we
                        may share your information as permitted or required by
                        any applicable law, rule, or regulation.
                    </li>
                    <li>
                        <strong>Third-Party Service Providers:</strong> We may
                        share your information with third parties that perform
                        services for us or on our behalf, including payment
                        processing, data analysis, email delivery, hosting
                        services, customer service, and marketing assistance.
                    </li>
                    <li>
                        <strong>Marketing Communications:</strong> With your
                        consent, or with an opportunity for you to withdraw
                        consent, we may share your information with third
                        parties for marketing purposes, as permitted by law.
                    </li>
                    <li>
                        <strong>Business Transfers:</strong> We may share or
                        transfer your information in connection with, or during
                        negotiations of, any merger, sale of company assets,
                        financing, or acquisition of all or a portion of our
                        business to another company.
                    </li>
                    <li>
                        <strong>Affiliates:</strong> We may share your
                        information with our affiliates, in which case we will
                        require those affiliates to honor this privacy policy.
                        Affiliates include our parent company and any
                        subsidiaries, joint venture partners, or other companies
                        that we control or that are under common control with
                        us.
                    </li>
                    <li>
                        <strong>Business Partners:</strong> We may share your
                        information with our business partners to offer you
                        certain products, services, or promotions.
                    </li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">
                    4. Security of Your Information
                </h3>
                <p>
                    We use administrative, technical, and physical security
                    measures to help protect your personal information. While we
                    have taken reasonable steps to secure the personal
                    information you provide to us, please be aware that despite
                    our efforts, no security measures are perfect or
                    impenetrable, and no method of data transmission can be
                    guaranteed against any interception or other type of misuse.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-2">
                    5. Policy for Children
                </h3>
                <p>
                    We do not knowingly solicit information from or market to
                    children under the age of 13. If we learn that we have
                    collected information from a child under age 13 without
                    verification of parental consent, we will delete that
                    information as quickly as possible. If you become aware of
                    any data we have collected from children under age 13,
                    please contact us using the contact information provided
                    below.
                </p>

                <h3 className="text-2xl font-semibold mt-6 mb-2">
                    6. Your Rights
                </h3>
                <p>
                    You have the right to access, update, or delete the
                    information we have on you. If you are unable to perform
                    these actions yourself, please contact us to assist you.
                </p>
                <ul className="list-disc list-inside">
                    <li>
                        The right to access – You have the right to request
                        copies of your personal data. We may charge you a small
                        fee for this service.
                    </li>
                    <li>
                        The right to rectification – You have the right to
                        request that we correct any information you believe is
                        inaccurate. You also have the right to request that we
                        complete the information you believe is incomplete.
                    </li>
                    <li>
                        The right to erasure – You have the right to request
                        that we erase your personal data, under certain
                        conditions.
                    </li>
                    <li>
                        The right to restrict processing – You have the right to
                        request that we restrict the processing of your personal
                        data, under certain conditions.
                    </li>
                    <li>
                        The right to object to processing – You have the right
                        to object to our processing of your personal data, under
                        certain conditions.
                    </li>
                    <li>
                        The right to data portability – You have the right to
                        request that we transfer the data that we have collected
                        to another organization, or directly to you, under
                        certain conditions.
                    </li>
                </ul>

                <h3 className="text-2xl font-semibold mt-6 mb-2">
                    7. Contact Us
                </h3>
                <p>
                    If you have questions or comments about this Privacy Policy,
                    please contact us at:
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

export default privacy;
