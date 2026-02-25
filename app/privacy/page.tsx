import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy",
  description:
    "HumanizeAI privacy policy. How we collect, use and protect your personal data. Google login, data subject rights.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function Datenschutz() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <p className="mb-4 text-gray-400 mt-10">
            We take the protection of your personal data very seriously. Your privacy is important to us, and we treat your personal data confidentially and in accordance with the statutory data protection regulations as well as this privacy policy.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Collection and Processing of Personal Data</h2>
          <p className="mb-4 text-gray-400">
            We collect and process personal data only to the extent necessary to provide a functional website as well as our content and services.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Rights of the Data Subject</h2>
          <p className="mb-4 text-gray-400">
            You have the right to obtain information about the data stored about you at any time, including its origin and recipients as well as the purpose of the data processing.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Google Login</h2>
          <p className="mb-4 text-gray-400">
            If you log in via Google, we gain access to certain information from your Google account, such as your name and email address. This information is used solely for authentication and to improve our services.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Contact</h2>
          <p className="mb-4 text-gray-400">
            If you have any questions about data protection, you can contact us at any time using the contact details provided in the imprint.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
