import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import RsvpForm from "@/components/RsvpForm";

export default function RsvpPage() {
  return (
    <>
      <Header />
      <main>
        <Section
          id="rsvp"
          titleEs="RSVP"
          titleEn="RSVP"
          subtitleEs="Confirma tu asistencia para nuestra boda."
          subtitleEn="Confirm your attendance for our wedding."
          variant="alt"
        >
          <RsvpForm />
        </Section>
      </main>
      <Footer />
    </>
  );
}