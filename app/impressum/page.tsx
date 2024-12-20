import { Header } from "@/components/Header";

export default function Impressum() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Impressum</h1>
          <h2 className="text-2xl font-bold mb-2 mt-10">Angaben gemäß § 5 TMG:</h2>
          <p className="text-gray-400">Robin Trepte</p>
          <p className="text-gray-400">Am Sandtorpark 3</p>
          <p className="text-gray-400">20457 Hamburg</p>
          <p className="mb-4 text-gray-400">Deutschland</p>
          <p className="mb-4 text-gray-400">E-Mail: mail(at)tretu.de</p>
          <p className="mb-4 text-gray-400 italic">
            Hinweis: Um Spam-E-Mails zu vermeiden, haben wir das „@“ in unserer Mail-Adresse mit „(at)“ ersetzt. Bitte verwenden Sie stattdessen wieder das „@“, wenn Sie uns kontaktieren möchten.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Inhaltlich Verantwortlicher gem. § 55 RStV</h2>
          <p className="mb-4 text-gray-400">Robin Trepte</p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Hinweis auf EU-Streitschlichtung</h2>
          <p className="mb-4 text-gray-400">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline">https://ec.europa.eu/consumers/odr</a>
            <br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
          <h2 className="text-2xl font-bold mb-2 mt-10">Haftungsausschluss (Disclaimer)</h2>
          <h3 className="text-xl font-bold mb-2">Haftung für Inhalte</h3>
          <p className="mb-4 text-gray-400">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="mb-4 text-gray-400">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
          <h3 className="text-xl font-bold mb-2">Haftung für Links</h3>
          <p className="mb-4 text-gray-400">
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
          </p>
          <p className="mb-4 text-gray-400">
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
          <h3 className="text-xl font-bold mb-2">Urheberrecht</h3>
          <p className="mb-4 text-gray-400">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
          <p className="mb-4 text-gray-400">
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </div>
      </main>
    </div>
  );
}
