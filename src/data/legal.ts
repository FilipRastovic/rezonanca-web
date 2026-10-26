// Terms of sale + privacy policy (SR + EN). Draft based on the Serbian Consumer Protection Act
// and Personal Data Protection Act - have an accountant/lawyer review before relying on it.
import { SHOP, SELLER, SALES_OPEN, PAYMENTS } from '../config';

const seller = `${SELLER.name}, MB ${SELLER.mb}, PIB ${SELLER.pib}${SELLER.activity ? `, ${SELLER.activity}` : ''}, ${SELLER.address}`;
const cards = PAYMENTS.cards;
const contact = `${SHOP.email} · ${SHOP.phone}`;
const ship = SALES_OPEN ? `${SHOP.shipping} RSD` : '';
export const UPDATED = cards ? '26.10.2026.' : '10.10.2026.';

type Section = { h: string; p: string[] };

export const LEGAL: Record<'sr' | 'en', { terms: { title: string; sections: Section[] }; privacy: { title: string; sections: Section[] }; updated: string }> = {
  sr: {
    updated: 'Последња измена',
    terms: {
      title: 'Услови куповине',
      sections: [
        { h: 'Продавац', p: [`Продавац је ${seller}. Контакт: ${contact}.`] },
        { h: 'Поручивање и закључење уговора', p: ['Поруџбину шаљеш преко обрасца на сајту. Уговор је закључен када ти потврдимо поруџбину телефоном или имејлом, најкасније у року од 24 сата. До потврде поруџбину можеш слободно да измениш или откажеш.'] },
        { h: 'Цене и плаћање', p: [`Цене су исказане у динарима (RSD) и коначне су: продавац није у систему ПДВ-а. На цену се додаје поштарина${ship ? ' од ' + ship : ' по ценовнику курирске службе'}, коју плаћа купац. ${cards ? 'Плаћаш платном картицом (Visa, Mastercard, Maestro, DinaCard) на сајту, поузећем куриру при преузимању, или уплатом на рачун након потврде поруџбине.' : 'На сајту се не плаћа и не уносе се подаци о картици: плаћаш поузећем, куриру при преузимању, или уплатом на рачун након потврде поруџбине.'}`,
          ...(cards ? [
            'Плаћање картицом обрађује Raiffeisen банка а.д. Београд. Податке о картици уносиш на заштићеној страници банке, уз проверу Visa Secure или Mastercard Identity Check. Поверљиви подаци се преносе у шифрованом облику (TLS) и ни у једном тренутку нису доступни продавцу. Картица се задужује у динарима.',
            'Износ поруџбине се при плаћању резервише на твојој картици, а наплаћује тек када пошаљемо пошиљку. Одмах после плаћања, успешног или неуспешног, на имејл добијаш потврду са бројем поруџбине и статусом трансакције.',
          ] : [])] },
        { h: 'Израда и испорука', p: ['Принтови се израђују 3–5 радних дана. Испорука курирском службом на територији Србије траје 1–2 радна дана. О тачном року обавештавамо те при потврди поруџбине. Шаљемо само на адресе у Србији.'] },
        ...(cards ? [{ h: 'Повраћај средстава', p: [
          'Ако поруџбину откажеш пре слања, резервација на картици се поништава и износ се не наплаћује. Време ослобађања резервисаних средстава зависи од банке која је издала картицу.',
          'У случају враћања робе и повраћаја средстава купцу који је платио платном картицом, делимично или у целости, без обзира на разлог враћања, повраћај вршимо искључиво преко Visa, Mastercard, Maestro и DinaCard метода плаћања: банка на наш захтев враћа средства на рачун корисника картице. Ако си платио/ла поузећем или уплатом, новац враћамо на твој текући рачун.',
        ] }] : []),
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
        { h: 'Које податке прикупљамо', p: ['Само оно што унесеш у образац за поруџбину (име и презиме, телефон, имејл, адресу и напомену) или на листу чекања (имејл или телефон и рад који те занима). Не прикупљамо податке о картици.' + (cards ? ' Од банке после плаћања картицом добијамо само статус трансакције, ауторизациони код, референтни број и последње четири цифре картице. Ове податке, уз податке о поруџбини, адреси и IP адреси са које је поручено, чувамо 13 месеци, како то захтевају правила картичног пословања.' : '')] },
        { h: 'Зашто их користимо', p: ['Да бисмо потврдили, израдили и испоручили твоју поруџбину и били у контакту око ње (правни основ: извршење уговора), односно да бисмо ти јавили када рад са листе чекања крене у продају (правни основ: твоја сагласност, коју можеш повући у сваком тренутку). Не шаљемо друге рекламне поруке.'] },
        { h: 'Коме их дајемо', p: ['Курирској служби (име, адреса, телефон) ради испоруке, сервису FormSubmit који поруџбину из обрасца прослеђује на наш имејл,' + (cards ? ' Raiffeisen банци и њеном процесору картица ради плаћања картицом, сервису Cloudflare на ком се чува запис о поруџбини и сервису Resend који шаље потврде на имејл,' : '') + ' и - само ако прихватиш колачиће - сервисима Meta (Facebook/Instagram), Google и Microsoft (Clarity) за мерење посета и огласа. Податке не продајемо.'] },
        { h: 'Колико их чувамо', p: ['Онолико колико је потребно за поруџбину и евентуалне рекламације, као и колико налажу прописи о рачуноводству.'] },
        { h: 'Твоја права', p: ['Имаш право да тражиш увид у своје податке, исправку, брисање или ограничење обраде, као и да уложиш приговор. Ако сматраш да су ти права повређена, можеш се обратити Поверенику за информације од јавног значаја и заштиту података о личности.'] },
        { h: 'Колачићи', p: ['Ако на банеру изабереш „Прихвати“, сајт учитава Meta Pixel, Google Analytics и Microsoft Clarity. Они бележе које странице посећујеш и да ли си се пријавио на листу чекања или поручио, како бисмо мерили посете и успех огласа. Clarity бележи и кретање миша, кликове и скроловање како бисмо видели шта на сајту не ради добро; текст који уносиш у поља обрасца се не снима. Ако унесеш имејл или телефон, Meta га у прегледачу претвара у шифровани запис (hash) и користи само за повезивање са налогом. Ако изабереш „Одбиј“, ништа од овога се не учитава. Избор можеш да промениш у сваком тренутку преко линка „Колачићи“ у дну странице. Корпа и избор колачића чувају се само у твом прегледачу.'] },
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
        { h: 'Prices and payment', p: [`Prices are in Serbian dinars (RSD) and are final: the seller is not registered for VAT. Shipping${ship ? ' of ' + ship : ' at the courier’s rates'} is added and paid by the customer. ${cards ? 'You pay by payment card (Visa, Mastercard, Maestro, DinaCard) on the site, cash on delivery to the courier, or by bank transfer after we confirm the order.' : 'Nothing is paid on the site and no card details are entered: you pay cash on delivery to the courier, or by bank transfer after we confirm the order.'}`,
          ...(cards ? [
            'Card payments are processed by Raiffeisen banka a.d. Beograd. You enter your card details on the bank’s secure page, with Visa Secure or Mastercard Identity Check verification. Confidential data is transmitted encrypted (TLS) and is never available to the seller. Your card is charged in Serbian dinars (RSD).',
            'The order amount is reserved on your card when you pay and only charged once we ship your parcel. Right after paying, successfully or not, you receive an email confirmation with your order number and the transaction status.',
          ] : [])] },
        { h: 'Production and delivery', p: ['Prints are made in 3–5 business days. Courier delivery within Serbia takes 1–2 business days. We confirm the exact timing when we confirm your order. We only ship to addresses in Serbia.'] },
        ...(cards ? [{ h: 'Refunds', p: [
          'If you cancel your order before it ships, the reservation on your card is released and nothing is charged. How quickly the reserved funds are released depends on the bank that issued your card.',
          'If goods are returned and a customer who paid by payment card is refunded, in part or in full and for whatever reason, the refund is made only through the Visa, Mastercard, Maestro and DinaCard payment methods: at our request the bank returns the funds to the cardholder’s account. If you paid cash on delivery or by transfer, we refund your bank account.',
        ] }] : []),
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
        { h: 'What we collect', p: ['Only what you enter in the order form (name, phone, email, address and note) or on the waitlist (email or phone and the piece you’re interested in). We never collect card details.' + (cards ? ' After a card payment the bank only sends us the transaction status, authorisation code, reference number and the last four digits of the card. We keep these, together with the order, address and the IP address it was placed from, for 13 months, as card scheme rules require.' : '')] },
        { h: 'Why we use it', p: ['To confirm, produce and deliver your order and stay in touch about it (legal basis: performance of a contract), or to tell you when a waitlisted piece goes on sale (legal basis: your consent, which you can withdraw at any time). We send no other marketing messages.'] },
        { h: 'Who we share it with', p: ['The courier (name, address, phone) for delivery, FormSubmit, the service that forwards the order form to our email,' + (cards ? ' Raiffeisen Bank and its card processor for card payments, Cloudflare, where the order record is stored, and Resend, which sends the email confirmations,' : '') + ' and - only if you accept cookies - Meta (Facebook/Instagram), Google and Microsoft (Clarity), to measure visits and ads. We never sell your data.'] },
        { h: 'How long we keep it', p: ['As long as needed for the order and any complaints, and as long as accounting regulations require.'] },
        { h: 'Your rights', p: ['You may request access to your data, correction, deletion or restriction of processing, and you may object. If you believe your rights have been violated, you can contact the Serbian Commissioner for Information of Public Importance and Personal Data Protection.'] },
        { h: 'Cookies', p: ['If you choose “Accept” on the banner, the site loads the Meta Pixel, Google Analytics and Microsoft Clarity. They record which pages you visit and whether you joined the waitlist or ordered, so we can measure visits and how our ads perform. Clarity also records mouse movement, clicks and scrolling so we can see what isn’t working on the site; what you type into form fields is not recorded. If you enter an email or phone, Meta turns it into an encrypted hash in your browser and uses it only to match your account. If you choose “Decline”, none of this loads. You can change your choice at any time via the “Cookies” link at the bottom of the page. Your cart and cookie choice are stored only in your browser.'] },
      ],
    },
  },
};
