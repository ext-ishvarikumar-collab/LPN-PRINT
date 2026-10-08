(function() {
  while (document.documentElement.firstChild) {
    document.documentElement.removeChild(document.documentElement.firstChild);
  }

  const head = document.createElement('head');
  const body = document.createElement('body');
  document.documentElement.appendChild(head);
  document.documentElement.appendChild(body);

  const title = document.createElement('title');
  title.textContent = 'IR7 Thermal Label System - Ultra High Performance Pro';
  head.appendChild(title);

  // Load External CDN Libraries (KJUA SVG Vector QR Library & jsPDF)
  const qrScript = document.createElement('script');
  qrScript.src = 'https://cdn.jsdelivr.net/npm/kjua@0.9.0/dist/kjua.min.js';
  head.appendChild(qrScript);

  const pdfScript = document.createElement('script');
  pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  head.appendChild(pdfScript);

  const style = document.createElement('style');
  style.id = 'dynamic-label-style';
  style.textContent = `
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; }
    
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    html, body { 
      width: 100%; 
      min-height: 100vh; 
      background-color: #f8fafc;
      background-image: 
        radial-gradient(at 0% 0%, rgba(239, 68, 68, 0.1) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.1) 0px, transparent 50%),
        linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 100% 100%, 28px 28px, 28px 28px;
      color: #0f172a; 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
    }
    
    .ui-wrapper { 
      max-width: 1380px; 
      margin: 0 auto; 
      padding: 20px 24px; 
      position: relative;
      z-index: 20;
    }

    /* UNIFORM GLASS CONTAINERS */
    .app-header, .card, .card-i-shape, .preview-container { 
      position: relative;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(59, 130, 246, 0.08), rgba(236, 72, 153, 0.08));
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 2px solid #ffffff;
      box-shadow: 0 0 18px rgba(255, 255, 255, 0.6), 0 8px 20px rgba(148, 163, 184, 0.12);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .app-header { 
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 12px 18px;
      border-radius: 14px;
    }

    .app-title-group { position: relative; z-index: 2; display: flex; align-items: center; gap: 12px; }
    .app-badge { 
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.85), rgba(59, 130, 246, 0.85)); 
      color: #fff; 
      font-size: 11px; 
      font-weight: 900; 
      padding: 4px 10px; 
      border-radius: 6px; 
      letter-spacing: 1px;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }
    .app-title { 
      font-size: 20px; 
      font-weight: 900; 
      background: linear-gradient(135deg, #ef4444, #2563eb, #1e293b);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 6s ease infinite;
      letter-spacing: -0.4px; 
    }
    .app-subtitle { font-size: 11px; color: #64748b; font-weight: 600; margin-top: 1px; }
    
    .header-actions { position: relative; z-index: 2; display: flex; align-items: center; gap: 8px; }
    .btn-sm-transparent {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid #ffffff;
      color: #334155;
      font-size: 11px;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-sm-transparent:hover {
      background: #ffffff;
      color: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
    }
    .btn-sm-danger:hover {
      border-color: #ef4444;
      color: #dc2626;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 20px;
      margin-bottom: 20px;
      align-items: stretch;
    }

    .card {
      border-radius: 16px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .card-i-shape {
      border-radius: 24px;
      clip-path: polygon(
        0% 0%, 100% 0%, 100% 22%, 78% 22%, 78% 78%, 100% 78%, 100% 100%, 
        0% 100%, 0% 78%, 22% 78%, 22% 22%, 0% 22%
      );
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
    }

    .card-content {
      position: relative;
      z-index: 2;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .card-i-shape .card-content { align-items: center; }
    .card-i-shape .card-title { justify-content: center; width: 100%; margin-bottom: 4px; }
    .card-i-shape .control-field { width: 64%; margin: 0 auto; text-align: center; }
    .card-i-shape .control-field label { text-align: center; }

    .card-title {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #ef4444, #2563eb, #8b5cf6);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientShift 5s ease infinite;
    }

    .control-field { display: flex; flex-direction: column; gap: 6px; }
    .control-field label { font-size: 11px; font-weight: 800; color: #475569; }
    
    select, input[type="number"], textarea {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #0f172a;
      border: 1.5px solid #ffffff;
      padding: 8px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      outline: none;
      transition: all 0.2s ease;
      width: 100%;
      text-align-last: center;
    }

    select:focus, input[type="number"]:focus, textarea:focus {
      border-color: #2563eb;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
    }

    .custom-size-row { display: none; gap: 6px; align-items: center; justify-content: center; font-weight: 700; color: #64748b; font-size: 11px; }
    .custom-size-row input { text-align: center; }

    .file-dropzone {
      position: relative;
      border: 1.5px dashed rgba(59, 130, 246, 0.6);
      border-radius: 10px;
      padding: 8px;
      text-align: center;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .file-dropzone:hover { 
      border-color: #2563eb; 
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.2);
    }
    .file-dropzone input[type="file"] { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
    .dropzone-text { font-size: 10px; font-weight: 800; color: #2563eb; }

    textarea { height: 140px; font-family: 'SFMono-Regular', Consolas, monospace; line-height: 1.4; resize: vertical; text-align: left; }

    .action-panel { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }

    .btn {
      padding: 9px 14px;
      border-radius: 9px;
      border: none;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.3px;
      cursor: pointer;
      color: #ffffff;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-transform: uppercase;
    }

    .btn-primary { 
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(59, 130, 246, 0.9)); 
      background-size: 150% 150%;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25); 
    }
    .btn-primary:hover { 
      background-position: 100% 0%; 
      transform: translateY(-1px); 
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
    }

    .btn-secondary { 
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      border: 1.5px solid #ffffff;
      color: #1e293b;
      font-weight: 800;
    }
    .btn-secondary:hover { background: #ffffff; color: #2563eb; transform: translateY(-1px); }

    .status-text { font-size: 10px; font-weight: 700; color: #2563eb; margin-top: 1px; }

    .preview-container { border-radius: 16px; padding: 18px; }
    
    .preview-area {
      position: relative;
      z-index: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(10px);
      border: 1.5px dashed rgba(203, 213, 225, 0.8);
      border-radius: 12px;
      min-height: 120px;
      margin-top: 10px;
    }
    
    /* Thermal Label Exact Print Setup */
    .label {
      width: 75mm;
      height: 25mm;
      background: #ffffff;
      color: #000000;
      padding: 1.5mm 2mm;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1.5px solid #000000 !important;
      font-family: Arial, Helvetica, sans-serif;
      overflow: hidden;
    }
    
    .top-row { display: flex; justify-content: space-between; align-items: flex-start; height: 13.5mm; }
    .qr-group { display: flex; gap: 1.2mm; }
    .qr-code { width: 12mm; height: 12mm; display: flex; align-items: center; justify-content: center; }
    .qr-code svg, .qr-code canvas, .qr-code img { width: 100% !important; height: 100% !important; shape-rendering: crispEdges; image-rendering: pixelated; }
    
    .right-meta { text-align: right; color: #000; display: flex; flex-direction: column; align-items: flex-end; }
    .date-text { font-size: 7.5pt; font-weight: 900; line-height: 1; letter-spacing: -0.2px; }
    .time-text { font-size: 7.5pt; font-weight: 900; line-height: 1.1; margin-top: 1px; }
    .store-text { font-size: 6.5pt; font-weight: 800; line-height: 1; margin-top: 1.5px; color: #000; min-height: 8px; }
    
    .grid-box { 
      border: 1.5px solid #000; 
      font-size: 11pt; 
      font-weight: 900; 
      text-align: center; 
      margin-top: 1.5px; 
      padding: 0 4px; 
      display: inline-block; 
      line-height: 1.1;
      min-width: 16px;
      color: #000;
    }
    
    .mid-row { font-size: 9pt; font-weight: 900; letter-spacing: 0.2px; line-height: 1; color: #000; }
    .bot-row { font-size: 8.5pt; font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1; color: #000; min-height: 10px; }

    /* HIGH SPEED PRINTING MEDIA CSS */
    @media print {
      @page {
        size: 75mm 25mm !important;
        margin: 0mm !important;
      }
      html, body {
        width: 75mm !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .app-header, .dashboard-grid, .card-title, .header-actions {
        display: none !important;
      }
      .ui-wrapper {
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: 75mm !important;
        width: 75mm !important;
      }
      .preview-container {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        backdrop-filter: none !important;
      }
      .preview-area {
        display: block !important;
        width: 75mm !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
      }
      .page-break-container {
        width: 75mm !important;
        height: 25mm !important;
        page-break-after: always !important;
        break-after: page !important;
        overflow: hidden !important;
      }
      .page-break-container:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .label {
        width: 75mm !important;
        height: 25mm !important;
        margin: 0 !important;
        border: 1.5px solid #000000 !important;
        background: #ffffff !important;
      }
    }
  `;
  head.appendChild(style);

  // BUILD APPLICATION UI DOM
  const uiWrapper = document.createElement('div');
  uiWrapper.className = 'ui-wrapper';

  const header = document.createElement('div');
  header.className = 'app-header';

  const headerLeft = document.createElement('div');
  headerLeft.className = 'app-title-group';
  headerLeft.innerHTML = `
    <span class="app-badge">IR7 STUDIO</span>
    <div>
      <div class="app-title">Thermal Label Workstation</div>
      <div class="app-subtitle">High-Speed Barcode & LPN Thermal Studio</div>
    </div>
  `;

  const headerActions = document.createElement('div');
  headerActions.className = 'header-actions';

  const btnPdf = document.createElement('button');
  btnPdf.className = 'btn-sm-transparent';
  btnPdf.innerHTML = '📥 Download PDF';
  btnPdf.onclick = () => window.downloadPdf();

  const btnClear = document.createElement('button');
  btnClear.className = 'btn-sm-transparent btn-sm-danger';
  btnClear.innerHTML = '🗑️ Clear DB';
  btnClear.onclick = () => {
    if (confirm('Are you sure you want to clear Local Storage database?')) {
      localStorage.removeItem('LPN_SOURCE_DB');
      sourceList = [];
      rebuildMap();
      alert('Local Storage Database cleared!');
    }
  };

  headerActions.appendChild(btnPdf);
  headerActions.appendChild(btnClear);
  header.appendChild(headerLeft);
  header.appendChild(headerActions);
  uiWrapper.appendChild(header);

  const dashboard = document.createElement('div');
  dashboard.className = 'dashboard-grid';

  const sidebarCard = document.createElement('div');
  sidebarCard.className = 'card-i-shape';

  const sidebarContent = document.createElement('div');
  sidebarContent.className = 'card-content';

  const sidebarTitle = document.createElement('div');
  sidebarTitle.className = 'card-title';
  sidebarTitle.textContent = '⚙️ Configuration & Source';
  sidebarContent.appendChild(sidebarTitle);

  const modeField = document.createElement('div');
  modeField.className = 'control-field';
  modeField.innerHTML = '<label>Generation Mode</label>';
  const modeSelect = document.createElement('select');
  modeSelect.innerHTML = `
    <option value="regular">Regular Mode</option>
    <option value="batch">Batch Mode</option>
  `;
  modeField.appendChild(modeSelect);
  sidebarContent.appendChild(modeField);

  const sizeField = document.createElement('div');
  sizeField.className = 'control-field';
  sizeField.innerHTML = '<label>Paper Dimensions</label>';
  
  const sizeSelect = document.createElement('select');
  sizeSelect.innerHTML = `
    <option value="75x25">75 x 25 mm</option>
    <option value="50x25">50 x 25 mm</option>
    <option value="100x50">100 x 50 mm</option>
    <option value="custom">Custom Size</option>
  `;
  sizeField.appendChild(sizeSelect);

  const customBox = document.createElement('div');
  customBox.className = 'custom-size-row';

  const inputW = document.createElement('input');
  inputW.type = 'number';
  inputW.value = '75';
  inputW.placeholder = 'W (mm)';

  const inputH = document.createElement('input');
  inputH.type = 'number';
  inputH.value = '25';
  inputH.placeholder = 'H (mm)';

  customBox.appendChild(inputW);
  customBox.appendChild(document.createTextNode('×'));
  customBox.appendChild(inputH);
  sizeField.appendChild(customBox);
  sidebarContent.appendChild(sizeField);

  const uploadContainer = document.createElement('div');
  uploadContainer.className = 'control-field';
  uploadContainer.id = 'uploadSection';
  uploadContainer.innerHTML = '<label>Source DB (.CSV / TSV)</label>';

  const dropzone = document.createElement('div');
  dropzone.className = 'file-dropzone';
  dropzone.innerHTML = `<div class="dropzone-text">📁 Drag Source DB File</div>`;
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.csv,.tsv,.txt';
  dropzone.appendChild(fileInput);
  uploadContainer.appendChild(dropzone);

  const statusDiv = document.createElement('div');
  statusDiv.className = 'status-text';
  uploadContainer.appendChild(statusDiv);
  sidebarContent.appendChild(uploadContainer);

  sidebarCard.appendChild(sidebarContent);
  dashboard.appendChild(sidebarCard);

  const mainCard = document.createElement('div');
  mainCard.className = 'card';

  const mainContent = document.createElement('div');
  mainContent.className = 'card-content';

  const mainTitle = document.createElement('div');
  mainTitle.className = 'card-title';
  mainTitle.id = 'inputTitle';
  mainTitle.textContent = '📄 Data Input Stream';
  mainContent.appendChild(mainTitle);

  const textArea = document.createElement('textarea');
  textArea.id = 'inputArea';
  textArea.placeholder = 'date\torderCode\tpicklistId\tstoreCode\ttoteCode\tzone';
  mainContent.appendChild(textArea);

  const actionPanel = document.createElement('div');
  actionPanel.className = 'action-panel';

  const btnGenerate = document.createElement('button');
  btnGenerate.className = 'btn btn-primary';
  btnGenerate.textContent = '⚡ Generate Labels';

  const btnPrint = document.createElement('button');
  btnPrint.className = 'btn btn-secondary';
  btnPrint.textContent = '🖨️ Direct Print';
  btnPrint.onclick = () => window.print();

  actionPanel.appendChild(btnGenerate);
  actionPanel.appendChild(btnPrint);
  mainContent.appendChild(actionPanel);

  mainCard.appendChild(mainContent);
  dashboard.appendChild(mainCard);
  uiWrapper.appendChild(dashboard);

  const previewContainer = document.createElement('div');
  previewContainer.className = 'preview-container';

  const previewTitle = document.createElement('div');
  previewTitle.className = 'card-title';
  previewTitle.style.position = 'relative';
  previewTitle.style.zIndex = '2';
  previewTitle.textContent = '🏷️ Live Print Preview';
  previewContainer.appendChild(previewTitle);

  const previewArea = document.createElement('div');
  previewArea.className = 'preview-area';
  previewArea.id = 'preview';
  previewContainer.appendChild(previewArea);

  uiWrapper.appendChild(previewContainer);
  body.appendChild(uiWrapper);

  let currentWidth = 75;
  let currentHeight = 25;

  const updateDynamicPaperStyle = () => {
    const val = sizeSelect.value;
    if (val === 'custom') {
      customBox.style.display = 'flex';
      currentWidth = parseFloat(inputW.value) || 75;
      currentHeight = parseFloat(inputH.value) || 25;
    } else {
      customBox.style.display = 'none';
      const parts = val.split('x');
      currentWidth = parseFloat(parts[0]);
      currentHeight = parseFloat(parts[1]);
    }
  };

  sizeSelect.addEventListener('change', updateDynamicPaperStyle);
  inputW.addEventListener('input', updateDynamicPaperStyle);
  inputH.addEventListener('input', updateDynamicPaperStyle);

  let sourceList = JSON.parse(localStorage.getItem('LPN_SOURCE_DB') || '[]');
  let sourceMap = new Map();

  const rebuildMap = () => {
    sourceMap.clear();
    sourceList.forEach(item => {
      if (item.storeCode) sourceMap.set(item.storeCode.toLowerCase(), item);
      if (item.dhName) sourceMap.set(item.dhName.toLowerCase(), item);
    });
    statusDiv.textContent = `Local DB Status: ${sourceList.length} Active Records`;
  };
  rebuildMap();

  modeSelect.addEventListener('change', () => {
    const mode = modeSelect.value;
    if (mode === 'batch') {
      uploadContainer.style.display = 'none';
      mainTitle.textContent = '📄 Paste Tote Codes (Line-by-Line)';
      textArea.placeholder = 'toteCode_1\ntoteCode_2\ntoteCode_3';
    } else {
      uploadContainer.style.display = 'flex';
      mainTitle.textContent = '📄 Data Input Stream';
      textArea.placeholder = 'date\torderCode\tpicklistId\tstoreCode\ttoteCode\tzone';
    }
  });

  const parseRows = (text) => {
    return text.trim().split(/\r?\n/).map(row => {
      if (row.includes('\t')) return row.split('\t').map(c => c.trim());
      if (row.includes(',')) return row.split(',').map(c => c.trim());
      return row.split(/\s{2,}/).map(c => c.trim());
    });
  };

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const rows = parseRows(evt.target.result);
      if (rows.length < 2) return;
      
      const headers = rows[0].map(h => h.toLowerCase());
      const dhIdx = headers.findIndex(h => h.includes('dh name'));
      const storeCodeIdx = headers.findIndex(h => h.includes('store code'));
      const gridIdx = headers.findIndex(h => h.includes('grid sequence'));

      sourceList = rows.slice(1).map(r => ({
        dhName: r[dhIdx] || '',
        storeCode: r[storeCodeIdx] || '',
        gridSeq: r[gridIdx] || ''
      }));

      localStorage.setItem('LPN_SOURCE_DB', JSON.stringify(sourceList));
      rebuildMap();
      alert(`Success! ${sourceList.length} records loaded into LocalStorage.`);
    };
    reader.readAsText(file);
  });

  // ULTRA VECTOR HIGH-PRECISION SCANNER QR ENGINE (KJUA SVG RENDER)
  let generatedDataList = [];

  btnGenerate.onclick = () => {
    const rawData = textArea.value;
    while (previewArea.firstChild) {
      previewArea.removeChild(previewArea.firstChild);
    }

    if (!rawData.trim()) {
      alert('Kripya pehle data paste karein!');
      return;
    }

    const currentMode = modeSelect.value;
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    generatedDataList = [];

    if (currentMode === 'batch') {
      const toteLines = rawData.trim().split(/\r?\n/).map(t => t.trim()).filter(t => t.length > 0);
      toteLines.forEach((toteCode, idx) => {
        generatedDataList.push({
          date: dateFormatted,
          timeStr: timeStr,
          matchedStoreCode: 'LPN_BATCH',
          gridSeq: '',
          toteCode: toteCode,
          dhName: '', 
          idx: idx,
          isBatch: true
        });
      });
    } else {
      const rows = parseRows(rawData);
      const dataRows = (rows[0][0].toLowerCase().includes('date')) ? rows.slice(1) : rows;

      dataRows.forEach((row, idx) => {
        if (row.length < 5) return;
        const date = row[0] || dateFormatted;
        const storeCodeInput = row[3] || '';
        const toteCode = row[4] || '';

        const match = sourceMap.get(storeCodeInput.toLowerCase()) || {};

        generatedDataList.push({
          date: date,
          timeStr: timeStr,
          matchedStoreCode: match.storeCode || storeCodeInput,
          gridSeq: match.gridSeq || '',
          toteCode: toteCode,
          dhName: match.dhName || storeCodeInput,
          idx: idx,
          isBatch: false
        });
      });
    }

    let index = 0;
    const chunkSize = 50;

    function renderBatch() {
      const limit = Math.min(index + chunkSize, generatedDataList.length);
      const fragment = document.createDocumentFragment();

      for (let i = index; i < limit; i++) {
        fragment.appendChild(createLabelDOMNode(generatedDataList[i]));
      }

      previewArea.appendChild(fragment);

      // HIGH-DPI ULTRA CRISP VECTOR SVG QR RENDER
      for (let i = index; i < limit; i++) {
        const item = generatedDataList[i];
        const qrText = `${item.toteCode}_${item.date}`;

        ['qr1_', 'qr2_', 'qr3_'].forEach(prefix => {
          const targetNode = document.getElementById(`${prefix}${item.idx}`);
          if (targetNode) {
            targetNode.innerHTML = '';
            
            // KJUA SVG Vector Generation Engine (Zero Pixelation / Instant Scan)
            if (window.kjua) {
              const el = window.kjua({
                render: 'svg',
                text: qrText,
                size: 80,
                fill: '#000000',
                back: '#ffffff',
                crisp: true,
                quiet: 0
              });
              targetNode.appendChild(el);
            } else if (window.QRCode) {
              new QRCode(targetNode, {
                text: qrText,
                width: 50,
                height: 50,
                correctLevel: QRCode.CorrectLevel.M
              });
            }
          }
        });
      }

      index = limit;
      if (index < generatedDataList.length) {
        requestAnimationFrame(renderBatch);
      }
    }

    renderBatch();
  };

  function createLabelDOMNode(data) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'page-break-container';

    const label = document.createElement('div');
    label.className = 'label';

    const topRow = document.createElement('div');
    topRow.className = 'top-row';

    const qrGroup = document.createElement('div');
    qrGroup.className = 'qr-group';

    ['qr1_', 'qr2_', 'qr3_'].forEach(prefix => {
      const qrDiv = document.createElement('div');
      qrDiv.id = `${prefix}${data.idx}`;
      qrDiv.className = 'qr-code';
      qrGroup.appendChild(qrDiv);
    });

    const rightMeta = document.createElement('div');
    rightMeta.className = 'right-meta';

    const dateDiv = document.createElement('div');
    dateDiv.className = 'date-text';
    dateDiv.textContent = data.date;

    const timeDiv = document.createElement('div');
    timeDiv.className = 'time-text';
    timeDiv.textContent = data.timeStr;

    const storeDiv = document.createElement('div');
    storeDiv.className = 'store-text';
    storeDiv.textContent = data.matchedStoreCode;

    rightMeta.appendChild(dateDiv);
    rightMeta.appendChild(timeDiv);
    rightMeta.appendChild(storeDiv);

    if (!data.isBatch && data.gridSeq) {
      const gridBox = document.createElement('div');
      gridBox.className = 'grid-box';
      gridBox.textContent = data.gridSeq;
      rightMeta.appendChild(gridBox);
    }

    topRow.appendChild(qrGroup);
    topRow.appendChild(rightMeta);

    const midRow = document.createElement('div');
    midRow.className = 'mid-row';
    midRow.textContent = data.toteCode;

    const botRow = document.createElement('div');
    botRow.className = 'bot-row';
    botRow.textContent = data.dhName;

    label.appendChild(topRow);
    label.appendChild(midRow);
    label.appendChild(botRow);

    pageContainer.appendChild(label);
    return pageContainer;
  }

  // ULTRA FAST DIRECT VECTOR PDF GENERATOR (1000+ LABELS IN SECONDS)
  window.downloadPdf = async () => {
    if (!window.jspdf) {
      alert('Libraries loading, please try again in 2 seconds...');
      return;
    }

    if (generatedDataList.length === 0) {
      alert('Pehle LPN Labels generate karein!');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [currentWidth, currentHeight]
    });

    for (let i = 0; i < generatedDataList.length; i++) {
      const data = generatedDataList[i];
      if (i > 0) doc.addPage([currentWidth, currentHeight], 'landscape');

      // Native Vector Draw Frame
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.rect(0.5, 0.5, currentWidth - 1, currentHeight - 1);

      // Render High DPI Vector SVG QR to PDF Canvas Directly
      const qr1Svg = document.querySelector(`#qr1_${data.idx} svg`);
      if (qr1Svg) {
        const xml = new XMLSerializer().serializeToString(qr1Svg);
        const svg64 = btoa(xml);
        const image64 = 'data:image/svg+xml;base64,' + svg64;

        doc.addImage(image64, 'SVG', 2, 1.5, 12, 12);
        doc.addImage(image64, 'SVG', 15, 1.5, 12, 12);
        doc.addImage(image64, 'SVG', 28, 1.5, 12, 12);
      }

      // Add Text Meta Vector Directly
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(data.date, currentWidth - 2, 4, { align: 'right' });
      doc.text(data.timeStr, currentWidth - 2, 7.5, { align: 'right' });

      doc.setFontSize(7);
      doc.text(data.matchedStoreCode, currentWidth - 2, 10.5, { align: 'right' });

      if (!data.isBatch && data.gridSeq) {
        doc.rect(currentWidth - 12, 12, 10, 4);
        doc.setFontSize(9);
        doc.text(String(data.gridSeq), currentWidth - 7, 15, { align: 'center' });
      }

      // Tote Code & DH Name Text Vector
      doc.setFontSize(10);
      doc.text(String(data.toteCode), 2, 18);

      doc.setFontSize(8);
      const cleanDh = doc.splitTextToSize(String(data.dhName || ''), currentWidth - 4);
      doc.text(cleanDh[0] || '', 2, 22.5);
    }

    doc.save(`IR7_Thermal_Bulk_${generatedDataList.length}_Labels.pdf`);
  };
})();
