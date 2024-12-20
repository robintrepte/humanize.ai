import { Header } from "@/components/Header";

export default function Datenschutz() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Datenschutzerklärung</h1>
          <p className="mb-4 text-gray-400 mt-10">
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Ihre Privatsphäre ist uns wichtig, und wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p className="mb-4 text-gray-400">
            Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Rechte der betroffenen Person</h2>
          <p className="mb-4 text-gray-400">
            Sie haben das Recht, jederzeit Auskunft über die zu Ihrer Person gespeicherten Daten zu erhalten, einschließlich deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Google Login</h2>
          <p className="mb-4 text-gray-400">
            Wenn Sie sich über Google anmelden, erhalten wir Zugriff auf bestimmte Informationen aus Ihrem Google-Konto, wie z.B. Ihren Namen und Ihre E-Mail-Adresse. Diese Informationen werden ausschließlich zur Authentifizierung und zur Verbesserung unserer Dienste verwendet.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Discord Login</h2>
          <p className="mb-4 text-gray-400">
            Bei der Anmeldung über Discord erhalten wir Zugriff auf bestimmte Informationen aus Ihrem Discord-Konto, wie z.B. Ihren Benutzernamen und Ihre E-Mail-Adresse. Diese Informationen werden ausschließlich zur Authentifizierung und zur Verbesserung unserer Dienste verwendet.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Kontakt</h2>
          <p className="mb-4 text-gray-400">
            Bei Fragen zum Datenschutz können Sie uns jederzeit unter den im Impressum angegebenen Kontaktdaten kontaktieren.
          </p>
        </div>
      </main>
    </div>
  );
}
