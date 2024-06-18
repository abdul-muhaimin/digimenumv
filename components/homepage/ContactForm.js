import { Button } from '@/components/ui/button';

const ContactForm = () => {
  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-brandBlack mb-8">Contact Us</h2>
        <form className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
              Name
            </label>
            <input className="w-full p-3 text-sm border rounded" type="text" id="name" name="name" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
              Email
            </label>
            <input className="w-full p-3 text-sm border rounded" type="email" id="email" name="email" required />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="message">
              Message
            </label>
            <textarea className="w-full p-3 text-sm border rounded" id="message" name="message" rows="4" required></textarea>
          </div>
          <Button size="lg" className="bg-brandYellow text-brandBlack">Send Message</Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
