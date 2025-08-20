// Angelic Philosophical Questions
const angelicQuestions = [
    "What does it mean to truly exist in this vast universe?",
    "If time is but a construct of human perception, what is the nature of eternity?",
    "What is the essence of consciousness, and where does the soul reside?",
    "In the grand tapestry of existence, what role do you believe you play?",
    "What is the nature of love, and how does it transcend the physical realm?",
    "If you could speak to your future self, what would you ask?",
    "What does it mean to be free in a world bound by cause and effect?",
    "How do you define truth, and is it absolute or relative?",
    "What is the purpose of suffering in the human experience?",
    "If you could choose one virtue to embody for eternity, what would it be?",
    "What is the relationship between mind and matter?",
    "How do you understand the concept of infinity?",
    "What does it mean to be authentic in a world of masks?",
    "If you could witness any moment in history, what would you choose?",
    "What is the nature of beauty, and why does it move us so deeply?",
    "How do you define wisdom, and where does it come from?",
    "What is the meaning of death in the cycle of life?",
    "If you could ask the universe one question, what would it be?",
    "What is the essence of creativity, and how does it connect us to the divine?",
    "How do you understand the concept of destiny versus free will?"
];

// Chat state
let currentQuestionIndex = 0;
let isWaitingForResponse = false;

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const particlesContainer = document.getElementById('particles');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    startConversation();
    setupEventListeners();
});

// Create angelic particles
function initializeParticles() {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    // Create new particles periodically
    setInterval(createParticle, 3000);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = startY - Math.random() * 300 - 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 2;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${startX}px;
        top: ${startY}px;
        animation: float ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, (duration + delay) * 1000);
}

// Start the conversation with the angel
function startConversation() {
    setTimeout(() => {
        addMessage(angelicQuestions[currentQuestionIndex], 'angel');
        currentQuestionIndex = (currentQuestionIndex + 1) % angelicQuestions.length;
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    chatForm.addEventListener('submit', handleUserSubmit);
    
    // Add some interactivity to the title
    const title = document.querySelector('.title');
    title.addEventListener('mouseenter', () => {
        title.classList.add('glow');
    });
    title.addEventListener('mouseleave', () => {
        title.classList.remove('glow');
    });
    
    // Hamburger menu functionality
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const menuOverlay = document.getElementById('menuOverlay');
    
    hamburgerIcon.addEventListener('click', () => {
        hamburgerIcon.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    });
    
    // Close button functionality
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
        hamburgerIcon.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
    
    // Close menu when clicking outside
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            hamburgerIcon.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            hamburgerIcon.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    });
}

// Handle user form submission
function handleUserSubmit(e) {
    e.preventDefault();
    
    const userMessage = userInput.value.trim();
    if (!userMessage || isWaitingForResponse) return;
    
    // Add user message
    addMessage(userMessage, 'user');
    userInput.value = '';
    
    // Show typing indicator
    isWaitingForResponse = true;
    showTypingIndicator();
    
    // Simulate angel thinking and responding
    setTimeout(() => {
        hideTypingIndicator();
        const nextQuestion = angelicQuestions[currentQuestionIndex];
        addMessage(nextQuestion, 'angel');
        currentQuestionIndex = (currentQuestionIndex + 1) % angelicQuestions.length;
        isWaitingForResponse = false;
    }, 2000 + Math.random() * 2000); // Random delay between 2-4 seconds
}

// Add a message to the chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    messageContent.appendChild(messageText);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add entrance animation
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message angel typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    
    const typingText = document.createElement('p');
    typingText.className = 'message-text';
    typingText.innerHTML = '<span class="loading"></span> The angel is contemplating your response...';
    
    typingContent.appendChild(typingText);
    typingDiv.appendChild(typingContent);
    chatMessages.appendChild(typingDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Add some ambient effects
function addAmbientEffects() {
    // Subtle background glow effect
    const videoOverlay = document.querySelector('.video-overlay');
    let glowIntensity = 0.3;
    let increasing = true;
    
    setInterval(() => {
        if (increasing) {
            glowIntensity += 0.001;
            if (glowIntensity >= 0.4) increasing = false;
        } else {
            glowIntensity -= 0.001;
            if (glowIntensity <= 0.2) increasing = true;
        }
        
        videoOverlay.style.background = `linear-gradient(
            135deg,
            rgba(0, 0, 0, ${0.3 + glowIntensity}) 0%,
            rgba(25, 25, 112, ${0.2 + glowIntensity * 0.5}) 50%,
            rgba(0, 0, 0, ${0.4 + glowIntensity}) 100%
        )`;
    }, 50);
}

// Initialize ambient effects
setTimeout(addAmbientEffects, 3000);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        userInput.focus();
    }
});

// Add some random angelic whispers (subtle text effects)
function addAngelicWhispers() {
    const whispers = [
        "✧",
        "✦",
        "✩",
        "✪",
        "✫"
    ];
    
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            const whisper = document.createElement('div');
            whisper.textContent = whispers[Math.floor(Math.random() * whispers.length)];
            whisper.style.cssText = `
                position: fixed;
                color: rgba(255, 255, 255, 0.3);
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: fadeInOut 3s ease-in-out forwards;
            `;
            
            document.body.appendChild(whisper);
            
            setTimeout(() => {
                if (whisper.parentNode) {
                    whisper.parentNode.removeChild(whisper);
                }
            }, 3000);
        }
    }, 5000);
}

// Add CSS for angelic whispers
const whisperStyle = document.createElement('style');
whisperStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        50% { opacity: 0.6; transform: scale(1.2) rotate(180deg); }
        100% { opacity: 0; transform: scale(0.8) rotate(360deg); }
    }
`;
document.head.appendChild(whisperStyle);

// Start angelic whispers
setTimeout(addAngelicWhispers, 5000);

// Add some interactive background effects
document.addEventListener('mousemove', function(e) {
    const wings = document.querySelector('.angel-wings');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Subtle wing movement based on mouse position
    wings.style.transform = `translate(-50%, -50%) rotateX(${(y - 0.5) * 5}deg) rotateY(${(x - 0.5) * 5}deg)`;
});

// Add welcome message after a delay
setTimeout(() => {
    addMessage("Welcome, seeker. I am here to guide you through the depths of your own consciousness. What shall we explore today?", 'angel');
}, 2000);
