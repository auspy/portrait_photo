export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-700">
            By accessing or using Picture Outline Generator ("the Software"),
            you agree to be bound by these Terms and Conditions. If you disagree
            with any part of these terms, you do not have permission to use the
            Software.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. API Usage Terms</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">2.1 API Access</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Access to API endpoints requires proper authentication</li>
                <li>API usage must comply with rate limiting policies</li>
                <li>API access may be revoked for terms violation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">2.2 Usage Limits</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Supported formats: PNG and JPG images only</li>
                <li>Maximum file size and request limits may apply</li>
                <li>Fair usage policy enforced to prevent abuse</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Open Source License
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              This software is licensed under the GNU Affero General Public
              License v3.0 (AGPL-3.0). By using this software, you agree to:
            </p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>
                Make your source code available if you modify and use this
                software in a network service
              </li>
              <li>Include the original copyright notice</li>
              <li>License your modifications under AGPL-3.0</li>
              <li>Provide a link to the source code</li>
            </ul>
          </div>
        </section>

        <section id="refund">
          <h2 className="text-2xl font-semibold mb-4">4. Refund Policy</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              Refunds are provided at the sole discretion of Picture Outline
              Generator and on a case-by-case basis and may be refused. Picture
              Outline Generator will refuse a refund request if we find evidence
              of fraud, refund abuse, or other manipulative behaviour that
              entitles Picture Outline Generator to counterclaim the refund.
            </p>
            <p className="text-gray-700">
              This does not affect your rights as a Consumer in relation to
              Products which are not as described, faulty or not fit for
              purpose.
            </p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>All refund requests will result in license deactivation</li>
              <li>
                Contact Picture Outline Generator support for refund processing
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Restrictions</h2>
          <p className="text-gray-700 mb-2">You may not:</p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Modify, reverse engineer, or decompile the Software</li>
            <li>Remove any copyright or proprietary notices</li>
            <li>Transfer your license to another party</li>
            <li>Use the Software for illegal purposes</li>
            <li>Attempt to bypass license validation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Updates and Maintenance
          </h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Software updates are provided via Sparkle framework</li>
            <li>Updates are optional but recommended</li>
            <li>Technical support is provided for the current version only</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Warranty Disclaimer
          </h2>
          <p className="text-gray-700 uppercase">
            The Software is provided "as is", without warranty of any kind,
            express or implied. The developers of Picture Outline Generator make
            no warranties, claims or representations and expressly disclaim all
            such warranties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-700">
            In no event shall the developers of Picture Outline Generator be
            liable for any special, incidental, indirect or consequential
            damages whatsoever arising out of or in any way related to the use
            of or inability to use the Software.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Attribution</h2>
          <p className="text-gray-700">
            When using this software, proper attribution is required as follows:
            "Based on Picture Outline Generator by Kshetez Vinayak, Licensed
            under AGPL-3.0"
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            10. Contact Information
          </h2>
          <p className="text-gray-700">
            For support, questions about these terms, or refund requests, please
            contact us through our support channels.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p className="text-gray-700">
            These terms shall be governed by and construed in accordance with
            the laws of the applicable jurisdiction, without regard to its
            conflict of law provisions.
          </p>
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
