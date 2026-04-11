'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Scale, Shield, AlertCircle, CreditCard, FileText, Globe, Package, User, RefreshCw, Award, Link as LinkIcon, Mail, Phone, Building } from 'lucide-react'

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#800000]/10 selection:text-[#800000]">
      <Header />

      <main className="flex-1">
        {/* Intro Section */}
        <section className="relative pt-20 pb-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#800000]/5 text-[#800000] text-xs font-black uppercase tracking-widest shadow-sm border border-[#800000]/10">
              <Scale className="w-4 h-4" />
              Legal Document
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1a1c2e] tracking-tight leading-tight">
              Terms & <span className="text-[#800000]">Conditions</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-slate-400 font-medium">
              Last Updated: May 26, 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

            <div className="prose prose-slate max-w-none space-y-4">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Welcome to <span className="font-bold text-[#1a1c2e]">FTDS INDIA PRIVATE LIMITED</span> ("Company", "we", "our", or "us").
                By accessing our website <span className="font-bold text-[#1a1c2e]">itfixer.in</span> or using our services, you agree to be bound by the following Terms and Conditions.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                If you do not agree with these terms, please do not use our website or services.
              </p>
            </div>

            {/* Policy Blocks */}
            <div className="space-y-12">

              {/* Block 1 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">1. Use of Website</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'Content is for general information and may change without notice',
                      'You agree to use the website only for lawful purposes',
                      'Unauthorized use may result in legal action'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#800000] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 2 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">2. Products and Services</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'All services are subject to availability',
                      'We may modify or discontinue services without notice',
                      'Prices may change anytime',
                      'We reserve the right to correct pricing or description errors'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#800000] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 3 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">3. User Information</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'You must provide accurate and complete information',
                      'You are responsible for maintaining account confidentiality',
                      'Report unauthorized access immediately',
                      'Usage is governed by our Privacy Policy'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#800000] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 4 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">4. Payments and Billing</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'Payments must be made via approved methods',
                      'Provide accurate billing details',
                      'Failed payments may result in service cancellation'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#800000] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 5 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">5. Cancellation and Refund Policy</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'Refund eligibility depends on service terms',
                      'Approved refunds will be processed within a reasonable time',
                      'We may refuse refunds if terms are violated'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#800000] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 6 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">6. Intellectual Property</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    All content including text, images, logos, and software belongs to FTDS INDIA PRIVATE LIMITED. Unauthorized use is prohibited.
                  </p>
                </div>
              </div>

              {/* Block 7 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">7. Limitation of Liability</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'We do not guarantee uninterrupted or error-free service',
                      'We are not liable for any damages arising from usage',
                      'Use of website is at your own risk'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#800000] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 8 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <LinkIcon className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">8. Third-Party Links</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Our website may contain links to third-party websites. We are not responsible for their content or policies.
                  </p>
                </div>
              </div>

              {/* Block 9 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">9. Security</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    We use reasonable security measures but cannot guarantee complete data security over the internet.
                  </p>
                </div>
              </div>

              {/* Block 10 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">10. Governing Law</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    These terms are governed by the laws of India. Any disputes will fall under Indian jurisdiction.
                  </p>
                </div>
              </div>

              {/* Block 11 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#800000]" />
                </div>
                <div className="space-y-4 pt-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">11. Changes to Terms</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    We may update these Terms at any time. Continued use of the website means you accept those changes.
                  </p>
                </div>
              </div>

            </div>

            {/* Support Box */}
            <div className="bg-[#800000]/5 border border-[#800000]/10 rounded-[32px] p-8 sm:p-12 space-y-6 mt-16 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#800000]/10">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">Contact Information</h2>
                  <p className="text-slate-500 font-medium">
                    For any questions regarding these Terms, please reach out to us:
                  </p>
                </div>
                <a
                  href="mailto:ftdigitalsolutionspvtltd@gmail.com"
                  className="inline-block bg-[#800000] text-center text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all transform active:scale-95 shadow-md shadow-red-900/10"
                >
                  Contact Support
                </a>
              </div>

              <div className="flex flex-wrap justify-evenly gap-8 w-full pt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Website</span>
                  </div>
                  <a href="https://www.itfixer199.com" className="font-bold text-[#800000] hover:text-[#1a1c2e] transition-colors">itfixer199.com</a>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Phone</span>
                  </div>
                  <a href="tel:8754844270" className="font-bold text-[#1a1c2e] hover:text-[#800000] transition-colors">8754844270</a>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Email</span>
                  </div>
                  <a href="mailto:ftdigitalsolutionspvtltd@gmail.com" className="font-bold text-[#800000] hover:text-[#1a1c2e] transition-colors break-words">ftdigitalsolutionspvtltd@gmail.com</a>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
