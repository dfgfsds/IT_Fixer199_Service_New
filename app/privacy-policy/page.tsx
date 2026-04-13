'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShieldAlert, Info, Settings, Lock, FileText, Smartphone, Mail, Globe, Phone, Building } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#101242]/10 selection:text-[#101242]">
      <Header />

      <main className="flex-1">
        {/* Intro Section */}
        <section className="relative pt-20 pb-16 bg-slate-50 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#101242]/5 text-[#101242] text-xs font-black uppercase tracking-widest shadow-sm border border-[#101242]/10">
              <ShieldAlert className="w-4 h-4" />
              Privacy Policy
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1a1c2e] tracking-tight leading-tight">
              Privacy & <span className="text-[#101242]">Data Protection</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
              Your privacy matters to us at IT Fixer @199.
            </p>
            <p className="text-sm text-slate-400 font-medium">
              Last updated on May 26, 2025
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

            <div className="prose prose-slate max-w-none space-y-4">
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                This privacy policy sets out how <span className="font-bold text-[#1a1c2e]">FTDS INDIA PRIVATE LIMITED</span> uses and protects any information that you give when you visit our website and/or purchase from us.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                We are committed to ensuring that your privacy is protected. Any information you provide will only be used in accordance with this privacy statement.
              </p>
            </div>

            {/* Policy Blocks */}
            <div className="space-y-12">

              {/* Block 1 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6 text-[#101242]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">1. Information We Collect</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'Name',
                      'Contact information including email address',
                      'Demographic information such as postcode, preferences, and interests',
                      'Other information relevant to customer surveys and/or offers'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#101242] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Block 2 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Settings className="w-6 h-6 text-[#101242]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">2. How We Use Your Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    {[
                      'Internal record keeping',
                      'Improve our products and services',
                      'Send promotional emails about new offers and services',
                      'Conduct market research via email, phone, or mail',
                      'Customize the website based on your interests'
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#101242] mt-2 shrink-0" />
                        <span className="text-sm font-bold text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Block 3 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-[#101242]" />
                </div>
                <div className="space-y-4 pt-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">3. Data Security</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    We are committed to ensuring that your information is secure. Suitable measures have been implemented to prevent unauthorized access or disclosure.
                  </p>
                </div>
              </div>

              {/* Block 4 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-[#101242]" />
                </div>
                <div className="space-y-4 pt-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">4. Cookies</h2>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Cookies are small files placed on your device to help analyze web traffic and improve user experience.
                  </p>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    You can choose to accept or decline cookies through your browser settings.
                  </p>
                </div>
              </div>

              {/* Block 5 */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#101242]" />
                </div>
                <div className="space-y-4 pt-2 w-full">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">5. Controlling Your Personal Information</h2>
                  <ul className="space-y-3 mt-4">
                    {[
                      'You may opt-out of direct marketing anytime',
                      'You can contact us to update or correct your information',
                      'We do not sell or distribute your personal data unless required by law'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#101242] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Support Box */}
            <div className="bg-[#101242]/5 border border-[#101242]/10 rounded-[32px] p-8 sm:p-12 space-y-6 mt-16 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#101242]/10">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1a1c2e]">Contact Us</h2>
                  <p className="text-slate-500 font-medium">
                    If you have any concerns about your data, please reach out to us:
                  </p>
                </div>
                <a
                  href="mailto:ftdigitalsolutionspvtltd@gmail.com"
                  className="inline-block bg-[#101242] text-center text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all transform active:scale-95 shadow-md shadow-red-900/10"
                >
                  Email Support Team
                </a>
              </div>

              <div className="flex flex-wrap justify-evenly gap-8 w-full pt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Building className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Brand</span>
                  </div>
                  <p className="font-bold text-[#1a1c2e]">IT Fixer @199</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Website</span>
                  </div>
                  <a href="https://www.itfixer199.com" className="font-bold text-[#101242] hover:text-[#1a1c2e] transition-colors">itfixer199.com</a>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Phone</span>
                  </div>
                  <a href="tel:8754844270" className="font-bold text-[#1a1c2e] hover:text-[#101242] transition-colors">8754844270</a>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Email</span>
                  </div>
                  <a href="mailto:ftdigitalsolutionspvtltd@gmail.com" className="font-bold text-[#101242] hover:text-[#1a1c2e] transition-colors break-words">ftdigitalsolutionspvtltd@gmail.com</a>
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
