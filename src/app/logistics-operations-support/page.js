import Link from 'next/link';
import styles from './page.module.css';

const services = [
  {
    title: 'Shipment Tracking',
    text: 'Monitor shipment milestones, ETAs, delays and exceptions.'
  },
  {
    title: 'Documentation Support',
    text: 'Prepare, organize and verify shipment-related documents.'
  },
  {
    title: 'Data & System Updates',
    text: 'Handle TMS/ERP data entry, shipment updates and records.'
  },
  {
    title: 'Customer Communication',
    text: 'Support routine shipment updates and operational emails.'
  },
  {
    title: 'Carrier & Vendor Follow-up',
    text: 'Handle routine operational coordination and follow-ups.'
  },
  {
    title: 'Reports & Administration',
    text: 'Prepare shipment reports, pending-task lists and admin support.'
  }
];

const audiences = [
  'Freight Forwarders',
  'Customs Brokers',
  '3PL Companies',
  'NVOCCs',
  'Logistics Companies'
];

export default function LogisticsOperationsSupportPage() {
  return (
    <main id="top" className={styles.page}>


      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              LYNKTODAY LOGISTICS OPERATIONS SUPPORT
            </span>
            <h1>Your logistics operations team in India.</h1>
            <p className={styles.heroText}>
              Reliable back-office support for freight forwarders,
              customs brokers, 3PLs and logistics companies.
            </p>
            <p className={styles.heroSubtext}>
              Reduce repetitive operational work and let your team focus
              on customers, sales and growth.
            </p>

            <div className={styles.heroActions}>
              <a href="#contact" className={styles.primaryButton}>
                Talk to Us
              </a>
              <a href="#services" className={styles.secondaryButton}>
                Explore Services
              </a>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <span className={styles.panelLabel}>BUILT FOR LOGISTICS</span>
            <h2>Extend your operations without adding another full-time team.</h2>
            <p>
              Start with a defined workflow or a small pilot, evaluate the
              process and scale when you are ready.
            </p>
          </div>
        </div>
      </section>

      <section id="services" className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>WHAT WE CAN HANDLE</span>
          <h2>Logistics work that can be handled remotely.</h2>
          <p>
            We support day-to-day operational tasks that take time away
            from your core logistics team.
          </p>
        </div>

        <div className={styles.serviceGrid}>
          {services.map((service, index) => (
            <article key={service.title} className={styles.serviceCard}>
              <div className={styles.serviceNumber}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className={styles.darkInner}>
          <div>
            <span className={styles.sectionEyebrowLight}>WHY LYNKTODAY</span>
            <h2>Logistics understanding, not generic virtual assistance.</h2>
            <p>
              The service is designed around freight forwarding and
              international logistics workflows.
            </p>
          </div>

          <div className={styles.points}>
            <div>
              <strong>Logistics Knowledge</strong>
              <span>Support built around real logistics processes.</span>
            </div>
            <div>
              <strong>Cost Efficient</strong>
              <span>Extend operational capacity without immediate U.S. hiring.</span>
            </div>
            <div>
              <strong>Flexible Support</strong>
              <span>Start with one workflow and expand as requirements grow.</span>
            </div>
            <div>
              <strong>India-Based Operations</strong>
              <span>Access dedicated operational support from India.</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>WHO WE SUPPORT</span>
          <h2>Designed for logistics businesses.</h2>
        </div>

        <div className={styles.audienceGrid}>
          {audiences.map((audience) => (
            <div key={audience} className={styles.audienceCard}>
              {audience}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>HOW IT WORKS</span>
          <h2>Start small. Prove the workflow. Scale when ready.</h2>
        </div>

        <div className={styles.processGrid}>
          <div className={styles.processCard}>
            <span>01</span>
            <h3>Tell us what takes time</h3>
            <p>Share the repetitive operational tasks your team currently handles.</p>
          </div>
          <div className={styles.processCard}>
            <span>02</span>
            <h3>Define the workflow</h3>
            <p>Agree on responsibilities, process, turnaround time and communication.</p>
          </div>
          <div className={styles.processCard}>
            <span>03</span>
            <h3>Start with a pilot</h3>
            <p>Give us a limited workflow or shipment volume to evaluate.</p>
          </div>
          <div className={styles.processCard}>
            <span>04</span>
            <h3>Scale when ready</h3>
            <p>Expand the scope or dedicated support when the process works for you.</p>
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactCard}>
          <div>
            <span className={styles.sectionEyebrow}>START A CONVERSATION</span>
            <h2>Have operational work piling up?</h2>
            <p>
              Tell us what your team is spending time on. We can discuss
              whether it is a good fit for remote operational support.
            </p>
          </div>

          <a
            href="mailto:operations@lynktoday.com?subject=Logistics%20Operations%20Support"
            className={styles.contactButton}
          >
            Contact LynkToday
          </a>
        </div>
      </section>


    </main>
  );
}
