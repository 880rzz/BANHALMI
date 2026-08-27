/* BANHALMI Touch Link State Authority 2026-08-27
   Prevent iOS/Safari sticky :hover from leaving partner cards in the desktop
   gold-hover state after a tap. Desktop hover remains unchanged. */
@media (hover:none), (pointer:coarse){
  html body main a.partner-card,
  html body main a.partner-card:hover,
  html body main a.partner-card:active,
  html body main a.partner-card:focus{
    color:#fff!important;
    border-color:rgba(255,255,255,.18)!important;
  }
  html body main a.partner-card .partner-name,
  html body main a.partner-card:hover .partner-name,
  html body main a.partner-card:active .partner-name,
  html body main a.partner-card:focus .partner-name{
    color:#fff!important;
    -webkit-text-fill-color:#fff!important;
  }
}
