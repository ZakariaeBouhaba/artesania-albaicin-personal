import { useState } from 'react'
import { enviarMensaje } from '../services/contacto'
import { useLanguage } from '../context/LanguageContext'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

function ContactoPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 80 })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await enviarMensaje(formData)
      setEnviado(true)
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' })
    } catch {
      setError(t.contacto.error)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="bg-[#FDF8F0] min-h-screen">

      {/* CABECERA */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/anadluz.png" alt="Granada" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#5C3D2E]/80" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="text-[#E8C46A] text-xs uppercase tracking-[6px] mb-4">{t.contacto.tag}</p>
          <h1 className="font-serif text-white text-4xl md:text-7xl leading-none">{t.contacto.title}</h1>
          <p className="text-white/60 mt-4 max-w-xl text-sm md:text-base">{t.contacto.subtitle}</p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

        {/* INFO + MAPA */}
        <div data-aos="fade-right">
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-8">{t.contacto.info_tag}</p>
          <div className="flex flex-col gap-6 md:gap-8 mb-10 md:mb-12">
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 border border-[#C9922A] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#C9922A]" />
              </div>
              <div>
                <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-1">{t.contacto.address_label}</p>
                <p className="text-[#5C3D2E] font-serif text-base md:text-lg">{t.contacto.address_street}</p>
                <p className="text-[#8B7355] text-sm">{t.contacto.address_city}</p>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 border border-[#C9922A] flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#C9922A]" />
              </div>
              <div>
                <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-1">{t.contacto.hours_label}</p>
                <p className="text-[#5C3D2E] font-serif text-base md:text-lg">{t.contacto.hours_days}</p>
                <p className="text-[#8B7355] text-sm">{t.contacto.hours_time}</p>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 border border-[#C9922A] flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-[#C9922A]" />
              </div>
              <div>
                <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-1">{t.contacto.phone_label}</p>
                <p className="text-[#5C3D2E] font-serif text-base md:text-lg">+34 958 000 000</p>
              </div>
            </div>
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-10 h-10 md:w-12 md:h-12 border border-[#C9922A] flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-[#C9922A]" />
              </div>
              <div>
                <p className="text-[#C9922A] text-xs uppercase tracking-widest mb-1">{t.contacto.email_label}</p>
                <p className="text-[#5C3D2E] font-serif text-base md:text-lg">hola@artesaniaalbaicin.es</p>
              </div>
            </div>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3178.940025219255!2d-3.5994088240038677!3d37.177896246317815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71fcbf4fcbdc81%3A0x511a6013ba4beea4!2sC.%20Calderer%C3%ADa%20Nueva%2C%20Albaic%C3%ADn%2C%2018010%20Granada%2C%20Espa%C3%B1a!5e0!3m2!1ses!2sma!4v1779105310667!5m2!1ses!2sma"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* FORMULARIO */}
        <div data-aos="fade-left">
          <p className="text-[#C9922A] text-xs uppercase tracking-[4px] mb-8">{t.contacto.form_tag}</p>
          {enviado ? (
            <div className="bg-[#5C3D2E] p-8 md:p-10 text-center">
              <p className="font-serif text-[#E8C46A] text-2xl md:text-3xl mb-4">{t.contacto.success_title}</p>
              <p className="text-white/70 text-sm mb-8">{t.contacto.success_desc}</p>
              <button onClick={() => setEnviado(false)} className="border border-[#E8C46A] text-[#E8C46A] text-xs uppercase tracking-widest px-8 py-3 hover:bg-[#E8C46A] hover:text-[#5C3D2E] transition-colors">
                {t.contacto.success_btn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">{error}</div>}
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">{t.contacto.name_label}</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder={t.contacto.name_placeholder} className="border border-[#F0E0B8] bg-white px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">{t.contacto.email_label}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={t.contacto.email_placeholder} className="border border-[#F0E0B8] bg-white px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">{t.contacto.subject_label}</label>
                <select name="asunto" value={formData.asunto} onChange={handleChange} required className="border border-[#F0E0B8] bg-white px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] transition-colors">
                  <option value="">{t.contacto.subject_placeholder}</option>
                  <option value="informacion">{t.contacto.subject_info}</option>
                  <option value="pedido">{t.contacto.subject_order}</option>
                  <option value="visita">{t.contacto.subject_visit}</option>
                  <option value="otro">{t.contacto.subject_other}</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#C9922A] text-xs uppercase tracking-widest">{t.contacto.message_label}</label>
                <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} required placeholder={t.contacto.message_placeholder} rows={5} className="border border-[#F0E0B8] bg-white px-4 py-3 text-[#5C3D2E] text-sm outline-none focus:border-[#C9922A] transition-colors resize-none" />
              </div>
              <button type="submit" disabled={enviando} className="bg-[#5C3D2E] text-white text-xs uppercase tracking-widest py-4 hover:bg-[#C9922A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {enviando ? t.contacto.sending : t.contacto.send_btn}
              </button>
            </form>
          )}
        </div>

      </section>
    </main>
  )
}

export default ContactoPage