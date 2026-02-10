(function() {
  async function fetchAndRenderTicketForRow(row) {
    if (!row) return;

    const link = getRowLink(row);
    if (!link) {
      console.warn('iiq: no ticket link found for row');
      return;
    }

    const modal = getOrCreateTicketModal();
    const iframe = modal.querySelector('iframe');
    const titleEl = modal.querySelector('[data-iiq-modal-title]');

    const resolvedUrl = new URL(link.href, window.location.origin).toString();
    iframe.src = resolvedUrl;
    titleEl.textContent = link.title || link.text || 'Ticket Details';
    showTicketModal(modal);
  }

  function getRowLink(row) {
    if (!row) return null;

    const directHref = row.getAttribute('href') || row.getAttribute('data-href');
    if (directHref) {
      return { href: directHref, text: 'Ticket Details' };
    }

    const anchor = row.querySelector('a[href]');
    if (!anchor) return null;

    const href = anchor.getAttribute('href') || anchor.href;
    if (!href || href === '#' || href.startsWith('javascript:')) return null;

    return {
      href,
      text: (anchor.textContent || '').trim(),
      title: (anchor.getAttribute('title') || '').trim()
    };
  }

  function getOrCreateTicketModal() {
    const existing = document.getElementById('iiq-ticket-iframe-modal');
    if (existing) return existing;

    const modal = document.createElement('div');
    modal.id = 'iiq-ticket-iframe-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(3,26,56,0.45);backdrop-filter:blur(2px);z-index:2147483646;display:none;align-items:center;justify-content:center;';

    const panel = document.createElement('div');
    panel.style.cssText = 'width:min(1200px,92vw);height:min(860px,90vh);background:#ffffff;border-radius:10px;box-shadow:0 20px 60px rgba(3,26,56,0.25);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(0,114,201,0.18);';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(90deg,#0072ce,#005bb5);color:#fff;font-family:Inter,Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;';

    const title = document.createElement('div');
    title.setAttribute('data-iiq-modal-title', '');
    title.textContent = 'Ticket Details';

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Close';
    close.style.cssText = 'border:none;background:rgba(255,255,255,0.15);color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer;';
    close.addEventListener('click', () => hideTicketModal(modal));

    header.appendChild(title);
    header.appendChild(close);

    const frame = document.createElement('iframe');
    frame.setAttribute('title', 'Ticket Detail');
    frame.style.cssText = 'flex:1;border:none;width:100%;height:100%;background:#fff;';

    panel.appendChild(header);
    panel.appendChild(frame);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) hideTicketModal(modal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.style.display === 'flex') {
        hideTicketModal(modal);
      }
    });

    return modal;
  }

  function showTicketModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.dataset.iiqModalOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }

  function hideTicketModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = document.body.dataset.iiqModalOverflow || '';
    delete document.body.dataset.iiqModalOverflow;
  }

  function handleCtrlClickPreview(e) {
    if (!e.ctrlKey) return;
    const row = e.target && e.target.closest ? e.target.closest('spark-grid-row') : null;
    if (!row) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    fetchAndRenderTicketForRow(row).catch(err => console.warn('iiq: ctrl click failed', err));
  }

  document.addEventListener('mousedown', handleCtrlClickPreview, true);
  document.addEventListener('click', handleCtrlClickPreview, true);
})();
