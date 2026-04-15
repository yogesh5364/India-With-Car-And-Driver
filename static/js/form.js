/* ============================================================
   FORMS.JS — Google Sheets Integration + Validation
   ============================================================ */

// REPLACE this URL after deploying your Google Apps Script
const SHEET_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

/**
 * Validate a single form group
 * @param {HTMLElement} group - .form-group element
 * @returns {boolean}
 */
function validateGroup(group){
  const input = group.querySelector('input,select,textarea');
  if(!input) return true;
  const val = input.value.trim();
  let valid = true;

  if(input.hasAttribute('required') && !val) valid=false;
  if(input.type==='email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) valid=false;
  if(input.type==='tel' && val && !/^[6-9]\d{9}$/.test(val.replace(/\D/g,''))) valid=false;

  group.classList.toggle('has-error', !valid);
  return valid;
}

/**
 * Submit a form to Google Sheets
 * @param {HTMLFormElement} form
 * @param {string} popupId - success popup id
 */
async function submitToSheet(form, popupId){
  const btn = form.querySelector('[type=submit]');
  const groups = form.querySelectorAll('.form-group');
  let allValid=true;
  groups.forEach(g=>{ if(!validateGroup(g)) allValid=false; });
  if(!allValid) return;

  const orig = btn.textContent;
  btn.disabled=true;
  btn.textContent='Sending...';

  try{
    const data = new FormData(form);
    data.append('timestamp', new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}));
    await fetch(SHEET_URL,{method:'POST',body:data,mode:'no-cors'});
    form.reset();
    if(popupId) window.showPopup(popupId);
  } catch(e){
    alert('Something went wrong. Please call us directly at +91-9829807075');
  } finally{
    btn.disabled=false;
    btn.textContent=orig;
  }
}

// ── ATTACH TO ALL .contact-form ──
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.contact-form').forEach(form=>{
    const popupId = form.dataset.popup || 'success-popup';
    // Live validation
    form.querySelectorAll('.form-group input,.form-group select,.form-group textarea')
      .forEach(input=>{
        input.addEventListener('blur',()=>validateGroup(input.closest('.form-group')));
        input.addEventListener('input',()=>{
          if(input.closest('.form-group').classList.contains('has-error'))
            validateGroup(input.closest('.form-group'));
        });
      });
    form.addEventListener('submit',e=>{
      e.preventDefault();
      submitToSheet(form, popupId);
    });
  });

  // Popup close buttons
  document.querySelectorAll('[data-close-popup]').forEach(btn=>{
    btn.addEventListener('click',()=>window.hidePopup(btn.dataset.closePopup));
  });
  // close on overlay click
  document.querySelectorAll('.popup-overlay').forEach(overlay=>{
    overlay.addEventListener('click',e=>{
      if(e.target===overlay) overlay.classList.remove('active');
    });
  });
});