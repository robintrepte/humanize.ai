import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function Impressum() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Imprint</h1>
          <h2 className="text-2xl font-bold mb-2 mt-10">Information according to § 5 TMG:</h2>
          <p className="text-gray-400">FollowerX GmbH</p>
          <p className="text-gray-400">Bei St. Annen 1</p>
          <p className="text-gray-400">20457 Hamburg</p>
          <p className="mb-4 text-gray-400">Germany</p>
          <p className="text-gray-400">Register Court: Hamburg</p>
          <p className="text-gray-400">Registration Number: HRB 166452</p>
          <p className="text-gray-400">Authorized Managing Directors: Robin Trepte & Lukas Tumpak</p>
          <p className="mb-4 text-gray-400">VAT Identification Number according to § 27a UStG: DE343792884</p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Contact:</h2>
          <p className="text-gray-400">Phone: +49 160 4522230</p>
          <p className="mb-4 text-gray-400">Email: business(at)followerpilot.de</p>
          <p className="mb-4 text-gray-400 italic">
            Please note that we do NOT offer customer service or support at these addresses, phone numbers, or this email address!
          </p>
          <p className="mb-4 text-gray-400 italic">
            Note: To avoid spam emails, we have replaced the "@" in our email address with "(at)". Please use the "@" again when contacting us.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Notice on EU Dispute Resolution</h2>
          <p className="mb-4 text-gray-400">
            The European Commission provides a platform for online dispute resolution (ODR): <a href="http://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline">http://ec.europa.eu/consumers/odr</a>
            <br />
            Our email address can be found above in the imprint.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Disclaimer</h2>
          <h3 className="text-xl font-bold mb-2">Liability for Content</h3>
          <p className="mb-4 text-gray-400">
            As a service provider, we are responsible for our own content on these pages according to § 7 para.1 TMG under general laws. However, according to §§ 8 to 10 TMG, we are not obligated as a service provider to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
          </p>
          <p className="mb-4 text-gray-400">
            Obligations to remove or block the use of information under general laws remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific infringement. Upon becoming aware of such legal violations, we will remove this content immediately.
          </p>
          <h3 className="text-xl font-bold mb-2">Liability for Links</h3>
          <p className="mb-4 text-gray-400">
            Our offer contains links to external third-party websites, on whose content we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at the time of linking.
          </p>
          <p className="mb-4 text-gray-400">
            A permanent content control of the linked pages is, however, not reasonable without concrete evidence of a violation of the law. Upon becoming aware of legal violations, we will remove such links immediately.
          </p>
          <h3 className="text-xl font-bold mb-2">Copyright</h3>
          <p className="mb-4 text-gray-400">
            The content and works created by the site operators on these pages are subject to German copyright law. The duplication, processing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.
          </p>
          <p className="mb-4 text-gray-400">
            Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is marked as such. Should you nevertheless become aware of a copyright infringement, we ask for a corresponding notice. Upon becoming aware of legal violations, we will remove such content immediately.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
