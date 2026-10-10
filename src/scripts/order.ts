// Order form: opens from any [data-order] button, keeps the price live and
// submits to FormSubmit (emails the order). No payment is taken on the site.
type Config = { prices: Record<string, Record<string, number>>; shipping: number; inbox: string; email: string; lang: 'sr' | 'en'; shop: string };

export function initOrder(dialog: HTMLDialogElement) {
  const form = dialog.querySelector('form')!;
  const cfg: Config = JSON.parse(form.dataset.config!);
  const msgs = (dialog.querySelector('#order-msgs') as HTMLElement).dataset;
  const $ = <T extends Element>(sel: string) => form.querySelector(sel) as unknown as T;
  const poster = $<HTMLSelectElement>('[name=poster]');
  const format = $<HTMLSelectElement>('[name=format]');
  const size = $<HTMLSelectElement>('[name=size]');
  const qty = $<HTMLInputElement>('[name=qty]');
  const frameRow = $<HTMLElement>('[data-frame]');
  const img = dialog.querySelector('#order-img') as HTMLImageElement;
  const total = dialog.querySelector('#order-total')!;
  const status = $<HTMLElement>('.status');
  const done = dialog.querySelector('.done') as HTMLElement;

  // After a successful send: replace the form with a confirmation + order summary.
  const showDone = (demo: boolean) => {
    const L = form.querySelectorAll('label');
    const lab = (name: string) => ([...L].find((l) => l.querySelector(`[name=${name}]`))?.childNodes[0]?.textContent ?? name).trim();
    const val = (name: string) => {
      const el = form.querySelector(`[name=${name}]`) as HTMLSelectElement | HTMLInputElement;
      return el instanceof HTMLSelectElement ? el.selectedOptions[0]?.text.trim() : el.value;
    };
    const rows: [string, string][] = [[lab('poster'), val('poster')], [lab('format'), val('format')], [lab('size'), val('size')]];
    if (!frameRow.hidden) rows.push([lab('frame'), val('frame')]);
    rows.push([lab('qty'), val('qty')], [lab('name'), val('name')], [lab('phone'), val('phone')]);
    const dl = dialog.querySelector('#order-summary')!;
    dl.innerHTML = '';
    for (const [k, v] of rows) { const d = document.createElement('div'); d.innerHTML = '<dt></dt><dd></dd>'; d.children[0].textContent = k; d.children[1].textContent = v; dl.append(d); }
    const tot = document.createElement('div'); tot.className = 'total'; tot.innerHTML = '<dt></dt><dd></dd>';
    tot.children[0].textContent = dialog.querySelector('.total .mono')?.textContent ?? ''; tot.children[1].textContent = total.textContent ?? '';
    dl.append(tot);
    (done.querySelector('.demo') as HTMLElement).hidden = !demo;
    form.hidden = true;
    done.hidden = false;
    dialog.scrollTop = 0;
    (done.querySelector('.btn') as HTMLElement).focus();
  };
  const submit = $<HTMLButtonElement>('.submit');
  const money = (n: number) => `${n.toLocaleString(cfg.lang === 'sr' ? 'sr-RS' : 'en-US')} RSD`;

  const update = () => {
    const opt = poster.selectedOptions[0];
    if (opt?.dataset.img) img.src = opt.dataset.img;
    frameRow.hidden = !['framed', 'edition'].includes(format.value);
    const q = Math.max(1, Math.min(20, parseInt(qty.value, 10) || 1));
    total.textContent = money(cfg.prices[format.value][size.value] * q + cfg.shipping);
  };
  form.addEventListener('change', update);
  form.addEventListener('input', update);

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest<HTMLElement>('[data-order]');
    if (btn) {
      e.preventDefault();
      const d = btn.dataset;
      if (d.poster) poster.value = d.poster;
      if (d.format) format.value = d.format;
      if (d.size) size.value = d.size;
      if (d.frame) ($<HTMLSelectElement>('[name=frame]')).value = d.frame;
      if (d.qty) qty.value = d.qty;
      status.textContent = '';
      form.hidden = false;
      done.hidden = true;
      update();
      dialog.showModal();
      return;
    }
    if ((e.target as Element).closest('[data-close]') || e.target === dialog) dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.classList.remove('err');
    let firstBad: HTMLElement | null = null;
    for (const el of form.querySelectorAll<HTMLInputElement>('input[required], select[required]')) {
      const bad = el.type === 'checkbox' ? !el.checked : !el.checkValidity() || !el.value.trim();
      el.setAttribute('aria-invalid', String(bad));
      if (bad && !firstBad) firstBad = el;
    }
    if (firstBad) {
      status.classList.add('err');
      status.textContent = msgs.required!;
      firstBad.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.botcheck) return;
    const { botcheck, terms, ...fields } = data;
    const payload = {
      _subject: `${cfg.shop} - ${poster.selectedOptions[0].text.trim()} / ${format.selectedOptions[0].text} / ${size.value} cm`,
      _template: 'table',
      _replyto: data.email,
      ...fields,
      terms_accepted: terms ? 'yes' : 'no',
      poster_name: poster.selectedOptions[0].text.trim(),
      shipping: money(cfg.shipping),
      total: total.textContent,
      language: cfg.lang,
    };

    submit.disabled = true;
    submit.firstChild!.textContent = submit.dataset.sending! + ' ';
    try {
      if (!cfg.inbox) {
        console.info('[order demo]', payload);
        await new Promise((r) => setTimeout(r, 700));
        showDone(true);
      } else {
        const res = await fetch(`https://formsubmit.co/ajax/${cfg.inbox}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (String(json.success) !== 'true') throw new Error(json.message);
        showDone(false);
      }
      form.reset();
      update();
    } catch (err) {
      console.error(err);
      status.classList.add('err');
      status.textContent = `${msgs.error} ${cfg.email}`;
    } finally {
      submit.disabled = false;
      submit.firstChild!.textContent = submit.dataset.label! + ' ';
    }
  });

  update();
}
