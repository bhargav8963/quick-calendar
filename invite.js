function buildGCalUrl(){
  if(!lastEv)return'';
  var e=lastEv;
  var f=function(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')};
  var url='https://calendar.google.com/calendar/render?action=TEMPLATE';
  url+='&text='+encodeURIComponent(e.title);
  url+='&dates='+f(e.startDT)+'/'+f(e.endDT);
  if(e.location)url+='&location='+encodeURIComponent(e.location);
  url+='&ctz='+encodeURIComponent(e.timezone);
  return url;
}
function shareWhatsApp(){
  if(!lastEv||!lastBlob)return;
  var e=lastEv;
  var ds=e.startDT.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  var ts=e.startDT.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
  var te=e.endDT.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
  var gcal=buildGCalUrl();
  var txt='\uD83D\uDCC5 *'+e.title+'*\n\n';
  txt+='\uD83D\uDDD3\uFE0F '+ds+'\n';
  txt+='\u23F0 '+ts+' \u2013 '+te+'\n';
  if(e.meetingLink){txt+='\uD83D\uDD17 '+e.meetingLink+'\n'}
  else if(e.location==='Phone Call'){txt+='\uD83D\uDCDE Phone Call\n'}
  txt+='\n\uD83D\uDCC6 *Add to your calendar:*\n'+gcal+'\n\n';
  txt+='\u2709\uFE0F *RSVP:* Reply to this message with\n';
  txt+='\u2705 Going  \u2022  \uD83E\uDD14 Maybe  \u2022  \u274C Can\'t make it';
  // Mobile: try to attach ICS file
  if(navigator.share&&navigator.canShare){
    try{
      var icsFile=new File([lastBlob],lastFn,{type:'text/calendar'});
      var data={text:txt,files:[icsFile]};
      if(navigator.canShare(data)){
        navigator.share(data).catch(function(){waFallback(txt)});
        return;
      }
    }catch(ex){}
  }
  waFallback(txt);
}
function waFallback(txt){
  window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');
}
