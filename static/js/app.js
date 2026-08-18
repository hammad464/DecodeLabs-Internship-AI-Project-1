/**
 * DecodeLabs Rule-Based AI Chatbot — Frontend Controller
 * Features: Real-time IPO pipeline telemetry, Web Audio synthesis, 
 *           typewriter text stream, knowledge base explorer, and chat export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');
  const messagesContainer = document.getElementById('messagesContainer');
  const typingIndicator = document.getElementById('typingIndicator');
  const sendBtn = document.getElementById('sendBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const exportChatBtn = document.getElementById('exportChatBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const liveLatencyPill = document.getElementById('liveLatencyPill');
  const latencyValue = document.getElementById('latencyValue');
  const welcomeHero = document.getElementById('welcomeHero');

  // IPO Telemetry Elements
  const telemetryRawInput = document.getElementById('telemetryRawInput');
  const telemetrySanitizedInput = document.getElementById('telemetrySanitizedInput');
  const telemetryMatchType = document.getElementById('telemetryMatchType');
  const telemetryMatchedKey = document.getElementById('telemetryMatchedKey');
  const telemetryLatency = document.getElementById('telemetryLatency');
  const nodeHash = document.getElementById('nodeHash');
  const nodeSubstring = document.getElementById('nodeSubstring');
  const nodeFallback = document.getElementById('nodeFallback');
  const statQueriesCount = document.getElementById('statQueriesCount');
  const statRuleCount = document.getElementById('statRuleCount');

  // Knowledge Base Modal Elements
  const kbModalBtn = document.getElementById('kbModalBtn');
  const kbModal = document.getElementById('kbModal');
  const closeKbModalBtn = document.getElementById('closeKbModalBtn');
  const closeKbModalBottomBtn = document.getElementById('closeKbModalBottomBtn');
  const kbSearchInput = document.getElementById('kbSearchInput');
  const kbRulesContainer = document.getElementById('kbRulesContainer');
  const toggleInspectorMobile = document.getElementById('toggleInspectorMobile');
  const inspectorSidebar = document.getElementById('inspectorSidebar');

  // State Management
  let soundEnabled = localStorage.getItem('sfx_enabled') !== 'false';
  let isProcessing = false;
  let totalQueries = 0;
  let conversationHistory = [];
  let knowledgeData = null;

  // Sound Engine (Web Audio API Synthesizer)
  const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error:', e);
    }
  }

  function playSendSound() {
    playTone(520, 'sine', 0.06, 0.04);
    setTimeout(() => playTone(780, 'sine', 0.08, 0.03), 40);
  }

  function playReceiveSound() {
    playTone(600, 'triangle', 0.05, 0.03);
    setTimeout(() => playTone(900, 'sine', 0.1, 0.04), 50);
  }

  // Update Sound Toggle Button
  function updateSoundButtonState() {
    if (soundEnabled) {
      soundToggleBtn.classList.add('active');
      soundToggleBtn.innerHTML = '<i class="ri-volume-up-line"></i>';
      soundToggleBtn.title = 'Sound Effects: Enabled';
    } else {
      soundToggleBtn.classList.remove('active');
      soundToggleBtn.innerHTML = '<i class="ri-volume-mute-line"></i>';
      soundToggleBtn.title = 'Sound Effects: Muted';
    }
  }
  updateSoundButtonState();

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('sfx_enabled', soundEnabled);
    updateSoundButtonState();
    showToast(soundEnabled ? 'Audio feedback enabled' : 'Audio feedback muted');
  });

  // Auto-resize textarea
  messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
  });

  // Keyboard shortcut: Enter to send, Shift+Enter for newline
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  // Handle Form Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = messageInput.value.trim();
    if (!query || isProcessing) return;

    // Reset input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Append User Message
    appendMessage('user', query);
    playSendSound();

    // Call API
    await sendQueryToChatbot(query);
  });

  // Clickable Prompt Chips
  document.querySelectorAll('.prompt-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt');
      if (promptText && !isProcessing) {
        messageInput.value = promptText;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Append Message to Chat Stream
  function appendMessage(sender, text, metadata = null) {
    const row = document.createElement('div');
    row.className = `message-row ${sender}`;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let metaHtml = '';
    if (sender === 'bot') {
      const matchType = metadata ? metadata.match_type : 'direct_hash';
      const matchLabel = matchType === 'direct_hash' ? 'O(1) Hash' :
                         matchType === 'keyword_substring' ? 'Keyword Substring' : 'Fallback Guard';
      const latencyStr = metadata ? `${metadata.latency_ms}ms` : '<0.1ms';

      metaHtml = `
        <div class="msg-meta">
          <span class="match-badge ${matchType}">${matchLabel}</span>
          <span>${latencyStr}</span>
          <span>${timeStr}</span>
          <button class="copy-btn" title="Copy response"><i class="ri-file-copy-line"></i></button>
        </div>
      `;
    } else {
      metaHtml = `
        <div class="msg-meta">
          <span>${timeStr}</span>
        </div>
      `;
    }

    const avatarHtml = sender === 'user' 
      ? `<div class="msg-avatar"><i class="ri-user-3-line"></i></div>`
      : `<div class="msg-avatar"><i class="ri-robot-2-line"></i></div>`;

    row.innerHTML = `
      ${avatarHtml}
      <div class="msg-content-wrapper">
        <div class="msg-bubble">${escapeHtml(text)}</div>
        ${metaHtml}
      </div>
    `;

    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Attach copy button listener
    const copyBtn = row.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
        showToast('Response copied to clipboard!');
      });
    }

    // Save to conversation history
    conversationHistory.push({ sender, text, timestamp: new Date().toISOString(), metadata });
    return row;
  }

  // Typewriter Stream for Bot Messages
  async function streamBotMessage(text, metadata) {
    const row = document.createElement('div');
    row.className = 'message-row bot';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const matchType = metadata ? metadata.match_type : 'direct_hash';
    const matchLabel = matchType === 'direct_hash' ? 'O(1) Hash' :
                       matchType === 'keyword_substring' ? 'Keyword Substring' : 'Fallback Guard';
    const latencyStr = metadata ? `${metadata.latency_ms}ms` : '<0.1ms';

    row.innerHTML = `
      <div class="msg-avatar"><i class="ri-robot-2-line"></i></div>
      <div class="msg-content-wrapper">
        <div class="msg-bubble" id="streamingBubble"></div>
        <div class="msg-meta">
          <span class="match-badge ${matchType}">${matchLabel}</span>
          <span>${latencyStr}</span>
          <span>${timeStr}</span>
          <button class="copy-btn" title="Copy response"><i class="ri-file-copy-line"></i></button>
        </div>
      </div>
    `;

    messagesContainer.appendChild(row);
    const bubble = row.querySelector('#streamingBubble');
    bubble.removeAttribute('id');

    // Typewriter effect
    for (let i = 0; i < text.length; i++) {
      bubble.textContent += text[i];
      if (i % 3 === 0) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      await new Promise(r => setTimeout(r, 6));
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    playReceiveSound();

    const copyBtn = row.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(text);
        showToast('Response copied to clipboard!');
      });
    }

    conversationHistory.push({ sender: 'bot', text, timestamp: new Date().toISOString(), metadata });
  }

  // API Call to Backend
  async function sendQueryToChatbot(rawMessage) {
    isProcessing = true;
    typingIndicator.style.display = 'flex';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: rawMessage })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      typingIndicator.style.display = 'none';

      // Update IPO Live Inspector Telemetry
      updateIpoTelemetry(data);

      // Stream Bot Response
      await streamBotMessage(data.response, data);

    } catch (err) {
      console.error('Chat error:', err);
      typingIndicator.style.display = 'none';
      
      // Fallback local IPO resolution in case of network disconnect
      const localResult = fallbackLocalProcess(rawMessage);
      updateIpoTelemetry(localResult);
      await streamBotMessage(localResult.response, localResult);
    } finally {
      isProcessing = false;
      messageInput.focus();
    }
  }

  // Fallback Local IPO processing if server connection is briefly unavailable
  function fallbackLocalProcess(raw) {
    const cleaned = raw.trim().toLowerCase().replace(/^[^\w\s]+|[^\w\s]+$/g, '');
    let matchType = 'fallback';
    let matchedKey = null;
    let resp = "I do not understand. Type 'help' to see available questions.";

    if (cleaned.includes('project 1')) {
      resp = "Project 1 is the foundation phase of the DecodeLabs AI Internship focused on Control Flow, Logic, and Rule-Based Chatbots.";
      matchType = 'keyword_substring';
      matchedKey = 'project 1';
    } else if (cleaned === 'hello' || cleaned === 'hi' || cleaned === 'hey') {
      resp = "Hello! Welcome to DecodeLabs AI Assistant. How can I help you today?";
      matchType = 'direct_hash';
      matchedKey = cleaned;
    } else if (cleaned.includes('decodelabs')) {
      resp = "DecodeLabs is an AI research & industrial training organization empowering future AI Engineers.";
      matchType = 'keyword_substring';
      matchedKey = 'decodelabs';
    }

    return {
      raw_input: raw,
      sanitized_input: cleaned,
      match_type: matchType,
      matched_key: matchedKey,
      response: resp,
      latency_ms: 0.05
    };
  }

  // Update Real-Time IPO Inspector & Telemetry
  function updateIpoTelemetry(data) {
    totalQueries++;
    statQueriesCount.textContent = totalQueries;

    telemetryRawInput.textContent = `"${data.raw_input}"`;
    telemetrySanitizedInput.textContent = `"${data.sanitized_input}"`;

    // Latency Telemetry
    const latencyStr = `${data.latency_ms} ms`;
    latencyValue.textContent = latencyStr;
    telemetryLatency.textContent = latencyStr;

    // Match Strategy Badge
    if (data.match_type === 'direct_hash') {
      telemetryMatchType.textContent = 'O(1) Direct Hash';
      telemetryMatchType.style.color = '#34d399';
      nodeHash.className = 'algo-node active';
      nodeSubstring.className = 'algo-node';
      nodeFallback.className = 'algo-node';
    } else if (data.match_type === 'keyword_substring') {
      telemetryMatchType.textContent = 'Keyword Substring';
      telemetryMatchType.style.color = '#60a5fa';
      nodeHash.className = 'algo-node';
      nodeSubstring.className = 'algo-node active';
      nodeFallback.className = 'algo-node';
    } else {
      telemetryMatchType.textContent = 'Fallback Guardrail';
      telemetryMatchType.style.color = '#fbbf24';
      nodeHash.className = 'algo-node';
      nodeSubstring.className = 'algo-node';
      nodeFallback.className = 'algo-node active';
    }

    telemetryMatchedKey.textContent = data.matched_key ? `"${data.matched_key}"` : 'None (Default)';
  }

  // Load Knowledge Base Matrix from API
  async function loadKnowledgeBaseMatrix() {
    try {
      const res = await fetch('/api/knowledge-base');
      if (res.ok) {
        knowledgeData = await res.json();
        renderKnowledgeMatrix(knowledgeData.rules);
        if (knowledgeData.total_rules) {
          statRuleCount.textContent = knowledgeData.total_rules;
        }
      }
    } catch (e) {
      console.warn('Failed to load KB from API:', e);
    }
  }

  function renderKnowledgeMatrix(categories, filterQuery = '') {
    kbRulesContainer.innerHTML = '';
    const q = filterQuery.toLowerCase();

    for (const [categoryName, rulesList] of Object.entries(categories)) {
      const filtered = rulesList.filter(r => 
        r.intent.toLowerCase().includes(q) || r.response.toLowerCase().includes(q)
      );

      if (filtered.length === 0) continue;

      const catSection = document.createElement('div');
      catSection.className = 'rule-category-section';

      const catTitle = document.createElement('div');
      catTitle.className = 'category-title';
      catTitle.textContent = `${categoryName} (${filtered.length})`;
      catSection.appendChild(catTitle);

      const grid = document.createElement('div');
      grid.className = 'rules-cards-list';

      filtered.forEach(r => {
        const card = document.createElement('div');
        card.className = 'rule-card';
        card.innerHTML = `
          <div class="rule-card-intent">${escapeHtml(r.intent)}</div>
          <div class="rule-card-response">${escapeHtml(r.response)}</div>
        `;
        card.addEventListener('click', () => {
          kbModal.style.display = 'none';
          messageInput.value = r.intent;
          chatForm.dispatchEvent(new Event('submit'));
        });
        grid.appendChild(card);
      });

      catSection.appendChild(grid);
      kbRulesContainer.appendChild(catSection);
    }

    if (kbRulesContainer.children.length === 0) {
      kbRulesContainer.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); padding: 30px;">No matching rules found for "${escapeHtml(filterQuery)}"</div>`;
    }
  }

  // Knowledge Base Search Filter
  kbSearchInput.addEventListener('input', (e) => {
    if (knowledgeData && knowledgeData.rules) {
      renderKnowledgeMatrix(knowledgeData.rules, e.target.value.trim());
    }
  });

  // Modal Open/Close Controls
  kbModalBtn.addEventListener('click', () => {
    if (!knowledgeData) loadKnowledgeBaseMatrix();
    kbModal.style.display = 'flex';
    kbSearchInput.focus();
  });

  closeKbModalBtn.addEventListener('click', () => kbModal.style.display = 'none');
  closeKbModalBottomBtn.addEventListener('click', () => kbModal.style.display = 'none');
  kbModal.addEventListener('click', (e) => {
    if (e.target === kbModal) kbModal.style.display = 'none';
  });

  // Clear Chat History
  clearChatBtn.addEventListener('click', () => {
    if (conversationHistory.length === 0) return;
    if (confirm('Clear all conversation messages?')) {
      messagesContainer.innerHTML = '';
      messagesContainer.appendChild(welcomeHero);
      conversationHistory = [];
      showToast('Chat history cleared');
    }
  });

  // Export Chat
  exportChatBtn.addEventListener('click', () => {
    if (conversationHistory.length === 0) {
      showToast('No messages to export');
      return;
    }

    let markdown = `# DecodeLabs AI Assistant - Chat History Export\n\n`;
    markdown += `**Exported At:** ${new Date().toLocaleString()}\n`;
    markdown += `**Total Messages:** ${conversationHistory.length}\n\n---\n\n`;

    conversationHistory.forEach((msg) => {
      const senderName = msg.sender === 'user' ? 'User' : 'DecodeLabs AI';
      markdown += `### ${senderName} (${msg.timestamp})\n${msg.text}\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decodelabs_ai_chat_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Conversation exported as Markdown!');
  });

  // Mobile Telemetry Toggle
  if (toggleInspectorMobile) {
    toggleInspectorMobile.addEventListener('click', () => {
      inspectorSidebar.classList.toggle('mobile-active');
      const isVisible = inspectorSidebar.classList.contains('mobile-active');
      toggleInspectorMobile.innerHTML = isVisible 
        ? '<i class="ri-close-circle-line"></i> Hide Telemetry' 
        : '<i class="ri-dashboard-3-line"></i> Toggle Telemetry';
    });
  }

  // Toast Notification Helper
  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="ri-information-line"></i><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Preload Knowledge Base
  loadKnowledgeBaseMatrix();
});
