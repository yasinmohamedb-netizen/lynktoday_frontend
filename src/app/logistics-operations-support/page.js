import Link from 'next/link';
import styles from './page.module.css';

const services = [
  ['01', 'Shipment Tracking', 'Track milestones, ETAs, delays and exceptions so your team does not have to chase every update.'],
  ['02', 'Documentation Support', 'Prepare, organize and verify shipment-related documents and operational files.'],
  ['03', 'Data & System Updates', 'Handle TMS/ERP data entry, shipment updates and operational records.'],
  ['04', 'Customer Communication', 'Support routine shipment updates, email coordination and status follow-ups.'],
  ['05', 'Carrier & Vendor Follow-up', 'Handle routine operational communication with carriers, vendors and partners.'],
  ['06', 'Reports & Administration', 'Prepare shipment reports, pending-task lists, billing support and other admin work.']
];

const audiences = ['Freight Forwarders', 'Customs Brokers', '3PL Companies', 'NVOCCs', 'Logistics Companies'];

export default function LogisticsOperationsSupportPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.brand}>LynkToday</Link>
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
          </nav>
          <Link href="/login" className={styles.loginButton}>Login / Sign Up</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>LYNKTODAY BUSINESS SERVICE</span>
            <h1>Logistics Operations Support <span>from India.</span></h1>
            <p className={styles.heroLead}>
              Your extended operations team for the work that keeps shipments moving,
              but keeps your people busy.
            </p>
            <p className={styles.heroText}>
              Support for freight forwarders, customs brokers, 3PLs and logistics
              companies — starting with a defined workflow and scaling when it works.
            </p>
            <div className={styles.heroActions}>
              <a href="#contact" className={styles.primaryButton}>Talk to Us</a>
              <a href="#how-it-works" className={styles.secondaryButton}>See How It Works</a>
            </div>
            <div className={styles.trustRow}>
              <span>Logistics-focused</span>
              <i />
              <span>India-based support</span>
              <i />
              <span>Start with a pilot</span>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroCardTop}>
              <span className={styles.liveDot} />
              <span>OPERATIONS SUPPORT</span>
            </div>
            <h2>Give your team more time for customers and growth.</h2>
            <p>We can take on repetitive operational workflows while your core team stays focused on higher-value work.</p>
            <div className={styles.heroChecklist}>
              {['Shipment tracking & updates', 'Documentation support', 'Data entry & system updates', 'Customer communication', 'Carrier & vendor follow-up', 'Reports & administration'].map(item => (
                <div key={item}><span>✓</span>{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>WHAT WE CAN HANDLE</span>
          <h2>Take repetitive work off your operations team.</h2>
          <p>Start with the workflow that consumes the most time. We can support the process remotely from India.</p>
        </div>
        <div className={styles.serviceGrid}>
          {services.map(([number, title, text]) => (
            <article key={title} className={styles.serviceCard}>
              <span className={styles.serviceNumber}>{number}</span>
              <div className={styles.serviceIcon} aria-hidden="true">
                {number === '01' ? '↗' : number === '02' ? '□' : number === '03' ? '▤' : number === '04' ? '✉' : number === '05' ? '↔' : '▥'}
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <span className={styles.sectionEyebrowLight}>THE IDEA IS SIMPLE</span>
          <h2>Your U.S. team handles the relationship. <span>We help handle the workload.</span></h2>
          <p>Not generic virtual assistance. A logistics-focused support model built around the repetitive work inside freight and trade operations.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>WHO WE SUPPORT</span>
          <h2>Built for companies moving international freight.</h2>
        </div>
        <div className={styles.audienceGrid}>
          {audiences.map((audience, index) => (
            <div key={audience} className={styles.audienceCard}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{audience}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.sectionCompact}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>WHY LYNKTODAY</span>
          <h2>Flexible enough to start small.</h2>
        </div>
        <div className={styles.benefitGrid}>
          <div><strong>Logistics Knowledge</strong><p>Support designed around freight forwarding and international trade workflows.</p></div>
          <div><strong>Cost Efficient</strong><p>Extend operational capacity without immediately adding another full-time U.S. employee.</p></div>
          <div><strong>Flexible Support</strong><p>Start with one workflow and expand the scope as your requirements grow.</p></div>
          <div><strong>India-Based Operations</strong><p>Reliable remote operational support from India with a defined process.</p></div>
        </div>
      </section>

      <section id="how-it-works" className={styles.sectionCompact}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>HOW IT WORKS</span>
          <h2>Start with one workflow. Prove it. Then scale.</h2>
        </div>
        <div className={styles.processGrid}>
          <div><span>01</span><strong>Tell us what takes time</strong><p>Show us the repetitive operational tasks your team handles today.</p></div>
          <div><span>02</span><strong>Define the workflow</strong><p>Agree on responsibilities, process, turnaround time and communication.</p></div>
          <div><span>03</span><strong>Start with a pilot</strong><p>Give us a limited workflow or shipment volume to evaluate.</p></div>
          <div><span>04</span><strong>Scale when ready</strong><p>Expand the scope when the process works for your team.</p></div>
        </div>
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactInner}>
          <div>
            <span className={styles.sectionEyebrowLight}>LET'S TALK OPERATIONS</span>
            <h2>What could your team stop doing manually?</h2>
            <p>Tell us about the workflow you want to outsource. We can discuss a practical pilot.</p>
          </div>
          <div className={styles.contactActions}>
            <a href="mailto:operations@lynktoday.com?subject=Logistics%20Operations%20Support" className={styles.primaryButton}>Start a Conversation</a>
            <span>operations@lynktoday.com</span>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <strong>LynkToday</strong>
          <span>Logistics &amp; International Trade</span>
          <Link href="/">Back to LynkToday</Link>
        </div>
      </footer>
    </main>
  );
}
