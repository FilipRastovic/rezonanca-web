// Terms of sale + privacy policy (SR + EN). Draft based on the Serbian Consumer Protection Act
// and Personal Data Protection Act - have an accountant/lawyer review before relying on it.
import { SHOP, SELLER } from '../config';

const seller = `${SELLER.name}, MB ${SELLER.mb}, PIB ${SELLER.pib}, ${SELLER.address}`;
const contact = `${SHOP.email} · ${SHOP.phone}`;
const ship = `${SHOP.shipping} RSD`;
export const UPDATED = '09.10.2026.';

type Section = { h: string; p: string[] };

export const LEGAL: Record<'sr' | 'en', { terms: { title: string; sections: Section[] }; privacy: { title: string; sections: Section[] }; updated: string }> = {
  sr: {
    updated: 'Последња измена',
    terms: {
      title: 'Услови куповине',
      sections: [
        { h: 'Продавац', p: [`Продавац је ${seller}. Контакт: ${contact}.`] },
        { h: 'Поручивање и закључење уговора', p: ['Поруџбину шаљеш преко обрасца на сајту. Уговор је закључен када ти потврдимо поруџбину телефоном или имејлом, најкасније у року од 24 сата. До потврде поруџбину можеш слободно да измениш или откажеш.'] },
        { h: 'Цене и плаћање', p: [`Цене су исказане у динарима (RSD) и коначне су: продавац није у систему ПДВ-а. На цену се додаје поштарина од ${ship}, коју плаћа купац. На сајту се не плаћа и не уносе се подаци о картици: плаћаш поузећем, куриру при преузимању, или уплатом на рачун након потврде поруџбине.`] },
        { h: 'Израда и испорука', p: ['Принтови се израђују 3–5 радних дана, урамљени радови и метал/акрил 7–10 радних дана. Испорука курирском службом на територији Србије траје 1–2 радна дана. О тачном року обавештавамо те при потврди поруџбине.'] },
        { h: 'Право на одустанак', p: [
          'Имаш право да одустанеш од уговора у року од 14 дана од дана када си примио/ла рад, без навођења разлога. Довољно је да нам пошаљеш јасну изјаву имејлом (нпр. „Одустајем од уговора за поруџбину бр. …“, са именом, адресом и датумом пријема).',
          'Рад враћаш у року од 14 дана од слања изјаве, неоштећен и у оригиналном паковању. Трошак повраћаја сноси купац. Новац враћамо у року од 14 дана од пријема изјаве, а можемо да сачекамо док рад не стигне назад.',
          'Право на одустанак не важи за радове израђене по твојим захтевима (нпр. јединствени сигнал из твог датума, броја или координата), јер су јасно персонализовани.',
        ] },
        { h: 'Рекламације', p: [`Одговарамо за несаобразност рада уговору у року од две године од испоруке. Ако рад стигне оштећен, пошаљи нам фотографију на ${SHOP.email} у року од 7 дана и заменићемо га без трошкова за тебе. На рекламацију одговарамо у року од 8 дана, а решавамо је најкасније у року од 15 дана.`] },
        { h: 'Ауторска права', p: ['Сви радови су ауторска дела. Куповином добијаш физички отисак за личну употребу, а не право на умножавање, штампање или продају рада.'] },
        { h: 'Решавање спорова', p: ['Спорове решавамо договором. Као потрошач имаш право и на вансудско решавање потрошачког спора пред телом за вансудско решавање спорова, у складу са Законом о заштити потрошача.'] },
      ],
    },
    privacy: {
      title: 'Политика приватности',
      sections: [
        { h: 'Руковалац подацима', p: [`Руковалац подацима је ${seller}. Контакт за питања о подацима: ${SHOP.email}.`] },
        { h: 'Које податке прикупљамо', p: ['Само оно што унесеш у образац за поруџбину: име и презиме, телефон, имејл, адресу и напомену. Не прикупљамо податке о картици.'] },
        { h: 'Зашто их користимо', p: ['Искључиво да бисмо потврдили, израдили и испоручили твоју поруџбину и да бисмо били у контакту око ње. Правни основ је извршење уговора. Не шаљемо рекламне поруке без твоје сагласности.'] },
        { h: 'Коме их дајемо', p: ['Курирској служби (име, адреса, телефон) ради испоруке, и сервису FormSubmit који поруџбину из обрасца прослеђује на наш имејл. Податке не продајемо и не дајемо другима.'] },
        { h: 'Колико их чувамо', p: ['Онолико колико је потребно за поруџбину и евентуалне рекламације, као и колико налажу прописи о рачуноводству.'] },
        { h: 'Твоја права', p: ['Имаш право да тражиш увид у своје податке, исправку, брисање или ограничење обраде, као и да уложиш приговор. Ако сматраш да су ти права повређена, можеш се обратити Поверенику за информације од јавног значаја и заштиту података о личности.'] },
        { h: 'Колачићи', p: ['Сајт тренутно не користи колачиће за праћење. Ако уведемо аналитику, ова политика ће бити ажурирана.'] },
      ],
    },
  },
  en: {
    updated: 'Last updated',
    terms: {
      title: 'Terms of sale',
      sections: [
        { h: 'Seller', p: [`The seller is ${seller}. Contact: ${contact}.`] },
        { h: 'Ordering and the contract', p: ['You send an order through the form on the site. The contract is concluded when we confirm your order by phone or email, within 24 hours at the latest. Until then you can freely change or cancel it.'] },
        { h: 'Prices and payment', p: [`Prices are in Serbian dinars (RSD) and are final: the seller is not registered for VAT. Shipping of ${ship} is added and paid by the customer. Nothing is paid on the site and no card details are entered: you pay cash on delivery to the courier, or by bank transfer after we confirm the order.`] },
        { h: 'Production and delivery', p: ['Prints are made in 3–5 business days, framed and metal/acrylic pieces in 7–10 business days. Courier delivery within Serbia takes 1–2 business days. We confirm the exact timing when we confirm your order.'] },
        { h: 'Right of withdrawal', p: [
          'You may withdraw from the contract within 14 days of receiving the piece, without giving a reason. Just send us a clear statement by email (e.g. "I withdraw from the contract for order no. …", with your name, address and date of receipt).',
          'Return the piece within 14 days of sending the statement, undamaged and in its original packaging. Return shipping is paid by the customer. We refund you within 14 days of receiving your statement, and may wait until the piece arrives back.',
          'The right of withdrawal does not apply to pieces made to your specifications (e.g. a unique signal from your date, number or coordinates), as they are clearly personalised.',
        ] },
        { h: 'Complaints', p: [`We are liable for any non-conformity of the piece for two years from delivery. If a piece arrives damaged, email a photo to ${SHOP.email} within 7 days and we will replace it at no cost to you. We reply to complaints within 8 days and resolve them within 15 days at the latest.`] },
        { h: 'Copyright', p: ['All works are protected by copyright. A purchase gives you a physical print for personal use, not the right to copy, reprint or sell the work.'] },
        { h: 'Disputes', p: ['We resolve disputes by agreement. As a consumer you also have the right to out-of-court resolution of consumer disputes, in line with the Serbian Consumer Protection Act.'] },
      ],
    },
    privacy: {
      title: 'Privacy policy',
      sections: [
        { h: 'Data controller', p: [`The data controller is ${seller}. Contact for data questions: ${SHOP.email}.`] },
        { h: 'What we collect', p: ['Only what you enter in the order form: name, phone, email, address and note. We never collect card details.'] },
        { h: 'Why we use it', p: ['Solely to confirm, produce and deliver your order and to stay in touch about it. The legal basis is performance of a contract. We do not send marketing messages without your consent.'] },
        { h: 'Who we share it with', p: ['The courier (name, address, phone) for delivery, and FormSubmit, the service that forwards the order form to our email. We never sell your data or give it to anyone else.'] },
        { h: 'How long we keep it', p: ['As long as needed for the order and any complaints, and as long as accounting regulations require.'] },
        { h: 'Your rights', p: ['You may request access to your data, correction, deletion or restriction of processing, and you may object. If you believe your rights have been violated, you can contact the Serbian Commissioner for Information of Public Importance and Personal Data Protection.'] },
        { h: 'Cookies', p: ['The site currently uses no tracking cookies. If we add analytics, this policy will be updated.'] },
      ],
    },
  },
};
