function calculateAll() {
  const vol = parseFloat(document.getElementById('volume').value);
  const clType = document.getElementById('clType').value;
  const curCL = parseFloat(document.getElementById('currentCL').value) || 0;
  const tarCL = parseFloat(document.getElementById('targetCL').value) || 0;
  const curPH = parseFloat(document.getElementById('currentPH').value) || 0;
  const tarPH = parseFloat(document.getElementById('targetPH').value) || 0;

  if (!vol || vol <= 0) {
    alert("CRITICAL: Please enter a valid Pool Volume to proceed.");
    return;
  }

  const resBox = document.getElementById('resultBox');
  resBox.style.display = "block";

  let clDose = 0;
  let phDose = 0;
  let procedureHTML = "";

  // 1. CHLORINE CALCULATION & SOP
  const clGap = tarCL - curCL;
  if (clGap > 0) {
    const factor = (clType === "70") ? 1.5 : 1.11;
    clDose = (vol / 1000) * clGap * factor;
    document.getElementById('clResult').innerText = clDose.toFixed(1) + "g";
    
    procedureHTML += `
      <div class="sop-step">
        <strong>PHASE 1: CHLORINE SANITIZATION</strong>
        1. Pag-andam og limpyo nga plastic bucket nga puno og tubig pool.<br>
        2. Isagol ang <b>${clDose.toFixed(1)}g</b> nga Chlorine sa balde. <i>Ayaw kini idirekta og itsa sa pool.</i><br>
        3. Gamit og plastic stirrer, tunawon ang granules pag-ayo hangtod wala nay makita nga puti sa ilawom.<br>
        4. I-bubo ang sagol samtang naglakaw palibot sa pool edges.
      </div>`;
  } else {
    document.getElementById('clResult').innerText = "STABLE";
    procedureHTML += `<div class="sop-step"><strong>PHASE 1: CHLORINE</strong> Ang lebel sa sanitizer stable. No action required.</div>`;
  }

  // 2. PH CALCULATION & SOP
  const phGap = curPH - tarPH;
  if (phGap > 0.05) {
    phDose = (vol / 10000) * (phGap * 10) * 100;
    document.getElementById('phResult').innerText = phDose.toFixed(0) + "ml";
    
    procedureHTML += `
      <div class="sop-step">
        <strong>PHASE 2: PH ACIDIFICATION (LOWERING)</strong>
        1. Siguruha nga ang pump/filtration nagdagan.<br>
        2. Sukda ang <b>${phDose.toFixed(0)}ml</b> nga Muriatic Acid.<br>
        3. I-bubo ang acid sa <b>lawom nga bahin (Deep End)</b> sa pool. Likayi ang pagbubo duol sa mga skimmer, hagdan, o metal fittings.<br>
        4. Paabuta ang "Total Turnover" sa tubig sulod sa 4 ka oras.
      </div>`;
  } else if (curPH < 7.2) {
    document.getElementById('phResult').innerText = "LOW pH";
    procedureHTML += `<div class="sop-step"><strong>PHASE 2: WARNING</strong> Ubos ra kaayo ang pH (${curPH}). Ayaw pagbutang og acid. Gamit og Soda Ash kon gikinahanglan.</div>`;
  } else {
    document.getElementById('phResult').innerText = "BALANCED";
    procedureHTML += `<div class="sop-step"><strong>PHASE 2: PH LEVEL</strong> Ang acidity sa tubig balanced. No action required.</div>`;
  }

  // 3. FINAL SAFETY PROTOCOL
  procedureHTML += `
    <div class="sop-step" style="border-left-color: var(--main-red)">
      <strong>PHASE 3: SAFETY & RE-TESTING</strong>
      - <b>WARNING:</b> Ayaw gyud isagol ang Chlorine ug Muriatic Acid sa usa ka balde. Kini makamugna og Toxic Chlorine Gas.<br>
      - Paabuta og <b>6 ka oras</b> una tugotan ang mga tawo nga maligo.<br>
      - I-retest ang tubig human sa turnover period aron ma-confirm ang bag-ong levels.
    </div>`;

  document.getElementById('procedureText').innerHTML = procedureHTML;
  resBox.scrollIntoView({ behavior: 'smooth' });
}

function convertML() {
  const ml = document.getElementById('mlInput').value;
  document.getElementById('ltOutput').value = ml ? (ml / 1000).toFixed(3) + " Liters" : "";
}

function resetAll() {
  document.querySelectorAll('input[type="number"]').forEach(i => i.value = '');
  document.getElementById('targetCL').value = '2.0';
  document.getElementById('targetPH').value = '7.4';
  document.getElementById('resultBox').style.display = "none";
}