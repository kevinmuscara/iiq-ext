const change_title = () => {
  const ticket_number = document.querySelector('div.ticket-detail span[ng-bind="$ctrl.Ticket.TicketNumber"]');
  if(!ticket_number) {
    const asset_tag = document.querySelector(`[ng-bind="$ctrl.Asset.AssetTag"]`);
    if(!asset_tag) {
      return;
    }
    document.title = `#${asset_tag.textContent}`;
    return;
  }

  document.title = `#${ticket_number.textContent}`;
}
