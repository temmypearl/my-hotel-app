import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", subject: "", message: "" });
    // Show success message
    alert("Thank you for your message. We'll get back to you shortly!");
  };

  return (
    <div className="bg-[#121212] text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <img 
            src="https://duruthemes.com/demo/html/cappa/demo1-dark/img/slider/3.jpg" 
            alt="Contact Us" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="px-4 max-w-3xl">
            <h1 className="text-lg tracking-[6px] uppercase text-[#aa8453]">GET IN TOUCH</h1>
            <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-6">Contact Us</h2>
            <div className="h-[1px] w-16 bg-[#aa8453] mx-auto mb-6"></div>
            <p className="text-white/80 max-w-2xl mx-auto">
              We're here to assist you with any inquiries or reservations. Reach out to our team for personalized service.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information & Form Section */}
      <div className="py-24 px-4 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h3 className="text-3xl font-serif mb-8">Contact Information</h3>
              <p className="text-white/70 mb-12">
                Our dedicated team is available to assist you with any questions, reservations, or special requests. 
                We look forward to welcoming you to our luxury hotel.
              </p>

              <div className="space-y-8">
                {/* Address */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                      <MapPin className="text-[#aa8453] size-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Hotel Address</h4>
                    <p className="text-white/70">
                    Conference Centre Building, Chaptel Road, <br /> University of Ibadan, Ibadan, Nigeria
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                      <Phone className="text-[#aa8453] size-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Reservation</h4>
                    <p className="text-white/70">
                      Reservations: +1 (234) 567 8901<br />
                      Front Desk: +1 (234) 567 8902
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                      <Mail className="text-[#aa8453] size-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Email Us</h4>
                    <p className="text-white/70">
                      info@luxuryhotel.com<br />
                      reservations@luxuryhotel.com
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#aa8453]/20 flex items-center justify-center">
                      <Clock className="text-[#aa8453] size-6" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-serif mb-2">Working Hours</h4>
                    <p className="text-white/70">
                      Front Desk: 24/7<br />
                      Concierge: 7:00 am - 11:00 pm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-3xl font-serif mb-8">Get in Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-white/80 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#252525] border border-[#333] px-4 py-3 text-white focus:outline-none focus:border-[#aa8453] transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white/80 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#252525] border border-[#333] px-4 py-3 text-white focus:outline-none focus:border-[#aa8453] transition-colors"
                      placeholder="Your Email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-white/80 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#252525] border border-[#333] px-4 py-3 text-white focus:outline-none focus:border-[#aa8453] transition-colors"
                    placeholder="Subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-white/80 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full bg-[#252525] border border-[#333] px-4 py-3 text-white focus:outline-none focus:border-[#aa8453] transition-colors"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <div>
                  <button 
                    type="submit"
                    className="bg-[#aa8453] hover:bg-[#96744a] text-white flex items-center justify-center gap-2 py-4 px-8 uppercase tracking-wider text-sm transition-colors duration-300"
                  >
                    <span>Send Message</span>
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="h-[500px] w-full bg-[#1a1a1a]">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4392579213723!2d3.8909498748799794!3d7.4170983126037175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10398552ad5ee9b1%3A0xc2ae126a95a4c483!2sUniversity%20of%20Ibadan%20Conference%20Centre!5e0!3m2!1sen!2sng!4v1713237685782!5m2!1sen!2sng" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Location"
        ></iframe>
      </div>

      {/* Reservation CTA Section */}
      <div className="bg-[#151515] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h4 className="text-[#aa8453] uppercase tracking-wide mb-3">LUXURY EXPERIENCE</h4>
          <h3 className="text-3xl md:text-4xl font-serif mb-6">Make a Reservation</h3>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto">
            For the ultimate luxury experience, book your stay directly with us to receive exclusive benefits and personalized service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="tel:+12345678901" 
              className="bg-transparent border border-[#aa8453] text-[#aa8453] hover:bg-[#aa8453] hover:text-white py-3 px-8 uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              <span>Call Now</span>
            </a>
            <button className="bg-[#aa8453] hover:bg-[#96744a] text-white py-3 px-8 uppercase tracking-wider text-sm transition-colors duration-300">
              Book Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;