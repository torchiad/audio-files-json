<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sound Manifest</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #f5f5f0;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: #111;
    padding: 40px;
  }

  h1 {
    font-size: 13px;
    font-weight: normal;
    color: #999;
    margin-bottom: 24px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  label {
    color: #999;
    width: 100px;
    flex-shrink: 0;
  }

  input[type="text"] {
    background: none;
    border: none;
    border-bottom: 1px solid #ccc;
    padding: 4px 0;
    font-family: inherit;
    font-size: 13px;
    color: #111;
    outline: none;
    width: 320px;
  }

  input[type="text"]:focus { border-bottom-color: #111; }

  button {
    background: none;
    border: 1px solid #ccc;
    font-family: inherit;
    font-size: 13px;
    color: #111;
    padding: 4px 12px;
    cursor: pointer;
  }

  button:hover { border-color: #111; }

  #status { color: #999; }

  #run {
    margin-top: 20px;
    background: #111;
    color: #f5f5f0;
    border: none;
    padding: 6px 20px;
    cursor: pointer;
    display: none;
  }

  #run:hover { background: #333; }

  #output {
    margin-top: 28px;
    display: none;
  }

  #output-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
    color: #999;
  }

  #copy {
    border: none;
    color: #999;
    padding: 0;
    text-decoration: underline;
  }

  #copy:hover { color: #111; border: none; }

  textarea {
    width: 100%;
    height: 400px;
    background: #fff;
    border: 1px solid #ddd;
    font-family: inherit;
    font-size: 12px;
    color: #111;
    padding: 16px;
    resize: vertical;
    outline: none;
  }

  .note {
    margin-top: 32px;
    color: #bbb;
    font-size: 11px;
  }
</style>
</head>
<body>

<h1>sound-manifest-gen</h1>

<div class="row">
  <label>game name</label>
  <input type="text" id="gameName" placeholder="PDCWorldDartsChampionship-Sounds" spellcheck="false" />
</div>

<div class="row">
  <label>folder</label>
  <button id="pickFolder">choose folder</button>
  <span id="status"></span>
</div>

<button id="run">generate</button>

<div id="output">
  <div id="output-bar">
    <span id="count"></span>
    <button id="copy">copy</button>
  </div>
  <textarea id="json" readonly spellcheck="false"></textarea>
</div>

<p class="note">Chrome / Edge only — uses the File System Access API. No files are uploaded; only filenames are read.</p>

<script>
  const gameNameInput = document.getElementById('gameName');
  const pickBtn = document.getElementById('pickFolder');
  const status = document.getElementById('status');
  const runBtn = document.getElementById('run');
  const outputEl = document.getElementById('output');
  const jsonEl = document.getElementById('json');
  const copyBtn = document.getElementById('copy');
  const countEl = document.getElementById('count');

  let files = [];

  pickBtn.addEventListener('click', async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      files = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.m4a')) {
          files.push(entry.name);
        }
      }
      files.sort();
      status.textContent = files.length ? `${files.length} .m4a files` : 'no .m4a files found';
      checkReady();
    } catch (e) {
      if (e.name !== 'AbortError') status.textContent = 'error reading folder';
    }
  });

  gameNameInput.addEventListener('input', checkReady);

  function checkReady() {
    runBtn.style.display = (gameNameInput.value.trim() && files.length) ? 'block' : 'none';
  }

  runBtn.addEventListener('click', () => {
    const name = gameNameInput.value.trim();
    const assetPath = `./resource/sounds/game/${name}/m4a/`;
    const result = {};
    files.forEach(filename => {
      const key = filename.replace(/\.m4a$/i, '');
      result[key] = { filepath: `${assetPath}${key}.m4a` };
    });
    jsonEl.value = JSON.stringify(result, null, 2);
    countEl.textContent = `${files.length} entries`;
    outputEl.style.display = 'block';
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(jsonEl.value).then(() => {
      copyBtn.textContent = 'copied';
      setTimeout(() => copyBtn.textContent = 'copy', 1500);
    });
  });
</script>
</body>
</html>