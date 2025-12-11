import { useState, useCallback, memo } from "react";
import { Send, User, Mail, MessageSquare, FileText } from "lucide-react";


const Contact = memo(() => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "name":
        return value.trim().length < 2 ? "Name must be at least 2 characters" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Please enter a valid email" : "";
      case "subject":
        return value.trim().length < 3 ? "Subject must be at least 3 characters" : "";
      case "message":
        return value.trim().length < 10 ? "Message must be at least 10 characters" : "";
      default:
        return "";
    }
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      
      // You can add success notification here
      console.log("Form submitted successfully:", formData);
      
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateField]);

  const inputClasses = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-transparent transition-all duration-200 will-change-auto";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <section className="py-24 bg-gray-50" id="contact">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Get in Touch
          </h2>
          <div className="w-24 h-1 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ready to work together? I'd love to hear about your project and discuss how we can bring your vision to life.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className={labelClasses}>
                <User className="inline w-4 h-4 mr-2" aria-hidden="true" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`${inputClasses} ${errors.name ? 'border-red-300 focus:ring-red-400/50' : ''}`}
                required
                autoComplete="name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className={labelClasses}>
                <Mail className="inline w-4 h-4 mr-2" aria-hidden="true" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`${inputClasses} ${errors.email ? 'border-red-300 focus:ring-red-400/50' : ''}`}
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className={labelClasses}>
                <FileText className="inline w-4 h-4 mr-2" aria-hidden="true" />
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What's this about?"
                className={`${inputClasses} ${errors.subject ? 'border-red-300 focus:ring-red-400/50' : ''}`}
                required
              />
              {errors.subject && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.subject}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className={labelClasses}>
                <MessageSquare className="inline w-4 h-4 mr-2" aria-hidden="true" />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell me about your project, timeline, and any specific requirements..."
                className={`${inputClasses} resize-none ${errors.message ? 'border-red-300 focus:ring-red-400/50' : ''}`}
                required
              />
              {errors.message && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] will-change-transform"
                aria-describedby={errors.submit ? "submit-error" : undefined}
              >
                <span className="inline-flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" aria-hidden="true"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </span>
              </button>
              
              {errors.submit && (
                <p id="submit-error" className="mt-3 text-sm text-red-600" role="alert">
                  {errors.submit}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";

export default Contact;