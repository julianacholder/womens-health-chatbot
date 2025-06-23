# Luna Women's Health Chatbot 🌸

A fine-tuned GPT-2 model specialized for women's health support and information, featuring emergency detection, domain-specific responses, and conversation history.

##  Live Demo & Links

- ** Live Demo:** [womens-health-chatbot.vercel.app](https://womens-health-chatbot.vercel.app/)
- ** Video Demo:** [Watch Demo](https://www.loom.com/share/56924f8251a6464bacae14f165c95569?sid=225a5c58-9772-4e70-93da-04def836c7d1)
- ** Model on Hugging Face:** [JCholder/womens-health-chatbot](https://huggingface.co/JCholder/womens-health-chatbot)
- ** Backend API:** [luna-api.railway.app](https://women-health-chatbot-backend-production.up.railway.app/)

##  Project Overview

**Domain:** Women's Health Support  
**Model:** GPT-2 Medium (Fine-tuned)  
**Dataset:** [altaidevorg/women-health-mini](https://huggingface.co/datasets/altaidevorg/women-health-mini)  
**Purpose:** Provide accessible, safe, and supportive women's health information

##  Performance Metrics

- **BLEU Score:** 0.0057
- **Perplexity:** 135.97
- **Domain Relevance:** 0.71
- **Training Loss:** 0.7526
- **Safety Features:** Emergency detection, domain filtering, medical disclaimers

##  Project Structure

```
women-health-chatbot/
├── backend/                        # FastAPI backend
│   ├── main.py                     # FastAPI server with optimizations
│   ├── requirements.txt            # Python dependencies
│   └── README.md                   # Backend setup instructions
├── frontend/                       # Next.js frontend
│   ├── src/
│   │   ├── app/                    # App router pages
│   │   ├── components/             # React components
│   │   ├── hooks/                  # Custom hooks (conversation management)
│   │   └── lib/                    # Auth and utilities
│   ├── package.json                # Node.js dependencies
│   └── README.md                   # Frontend setup instructions
├── notebook/                       # Training and analysis
│   ├── summative-womens-health.ipynb        # Fine-tuning notebook
├── output/                         # Results and visualizations
│   ├── dataset_analysis.png        # Dataset statistics
│   ├── final_results_summary.png   # Performance charts
│   └── model_config.json          # Training configuration
└── README.md                       # This file
```

## 🚀 Quick Setup

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.9+** (for backend)
- **Git** (for cloning)

### 1. Clone the Repository

```bash
git clone https://github.com/julianacholder/women-health-chatbot.git
cd women-health-chatbot
```

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv env

# Activate virtual environment
# Windows:
env\Scripts\activate
# Mac/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The backend will be available at `http://localhost:8000`

**API Endpoints:**
- `GET /health` - Health check
- `POST /chat` - Chat with Luna
- `GET /docs` - Interactive API documentation

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Using the Hosted Version

**Frontend (Vercel):** [luna-health.vercel.app](https://luna-health.vercel.app)
**Backend (Railway):** [luna-api.railway.app](https://luna-api.railway.app)

No setup required - just visit the live demo!

## 🛠️ Development Scripts

### Backend
```bash
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests (if implemented)
pytest

# Check memory usage
python -c "import psutil; print(f'Memory: {psutil.Process().memory_info().rss/1024/1024:.2f}MB')"
```

### Frontend
```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📊 Dataset Information

**Source:** [altaidevorg/women-health-mini](https://huggingface.co/datasets/altaidevorg/women-health-mini)

### Dataset Statistics
- **Total Conversations:** 10,348
- **Training Examples:** 8,278
- **Validation Examples:** 2,070
- **Average Conversation Length:** 2.0 messages
- **Average User Message Length:** 14.4 words
- **Average Assistant Message Length:** 464.9 words

### Topic Distribution
- Pregnancy & Fertility: 35%
- Menstrual Health: 25%
- Contraception: 20%
- General Women's Health: 15%
- Emergency Situations: 5%

## 🎯 Model Performance

### Training Configuration
- **Model Architecture:** GPT-2 Medium (355M parameters)
- **Training Epochs:** 3
- **Learning Rate:** 5e-05
- **Batch Size:** 4
- **Max Length:** 512 tokens
- **Optimizer:** AdamW

### Evaluation Metrics
- **BLEU Score:** 0.0057 (focus on domain relevance over linguistic similarity)
- **Perplexity:** 135.97 (good for specialized domain)
- **Domain Relevance:** 0.71 (71% of responses stay in domain)
- **Safety Score:** 0.95 (95% appropriate emergency responses)

## 💬 Example Conversations

### Example 1: General Health Question
```
User: What causes irregular periods?

Luna: Irregular periods can be caused by several factors including:
• Hormonal changes (PCOS, thyroid issues)
• Stress and lifestyle factors
• Weight changes (significant gain or loss)
• Certain medications
• Underlying health conditions

It's important to track your cycles and discuss any concerns with your healthcare provider for proper evaluation and personalized treatment.

💡 Please consult your healthcare provider for personalized advice.
```

### Example 2: Pregnancy Support
```
User: Is nausea normal in early pregnancy?

Luna: Yes, nausea is very common in early pregnancy! About 70-80% of pregnant women experience morning sickness, which can actually occur at any time of day. 

Key points:
• Usually starts around 6 weeks of pregnancy
• Often improves by 12-14 weeks
• Can range from mild queasiness to severe vomiting
• Consider small, frequent meals and ginger

If you're experiencing severe vomiting or can't keep fluids down, contact your healthcare provider immediately.

💡 Please consult your healthcare provider for personalized advice.
```

### Example 3: Emergency Detection
```
User: I'm having severe bleeding and feel dizzy

Luna: 🚨 Heavy bleeding combined with dizziness can be a medical emergency. Please seek immediate medical attention or call 911. This could indicate a serious condition that requires urgent care.

Do not wait - go to your nearest emergency room or call emergency services immediately.
```

### Example 4: Out-of-Domain Response
```
User: What's the weather like today?

Luna: 🌸 Hey there, I'm Luna, a women's health specialist chatbot 💕. I can help with questions about reproductive health, pregnancy, menstrual health, contraception, fertility, and other women's wellness topics🌈. Could you ask a women's health related question?✨
```

## 🛡️ Safety Features

### 1. Emergency Detection
- Automatic detection of emergency keywords
- Immediate redirection to emergency services
- Keywords include: suicide, severe bleeding, unconscious, overdose

### 2. Domain Boundaries
- Filters non-health related questions
- Gentle redirection to appropriate topics
- Maintains focus on women's health

### 3. Medical Disclaimers
- Every health response includes professional consultation reminder
- Clear statements about educational purpose
- Emphasis on healthcare provider consultation

### 4. Content Filtering
- Response quality checks
- Inappropriate content filtering
- Length and coherence validation

## 🔧 Technical Implementation

### Backend Architecture (FastAPI)
- **Memory Optimization:** Half-precision models, garbage collection
- **Performance:** Response caching, optimized generation parameters
- **Safety:** Request validation, error handling, rate limiting
- **Monitoring:** Memory usage tracking, health checks

### Frontend Architecture (Next.js)
- **Authentication:** Better Auth integration
- **Conversation Management:** Persistent chat history for logged-in users
- **Real-time Chat:** Optimistic updates, loading states
- **Responsive Design:** Mobile-first approach with beautiful UI

### Model Optimizations
```python
# Memory optimizations used in deployment
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,  # 50% memory reduction
    low_cpu_mem_usage=True,     # Efficient loading
    use_cache=True             # Faster generation
)
```

## 📈 Performance Monitoring

### Memory Usage
- **Startup:** ~220MB
- **After Model Loading:** ~900MB
- **During Generation:** ~950MB
- **After Cleanup:** ~900MB

### Response Times
- **Average:** 3-6 seconds
- **Emergency Detection:** <100ms
- **Domain Filtering:** <50ms
- **AI Generation:** 2-5 seconds

## 🌟 Key Features

1. **🤖 Intelligent Responses:** Domain-specific fine-tuning for accurate women's health information
2. **🆘 Emergency Detection:** Automatic identification and appropriate response to crisis situations
3. **💬 Conversation History:** Persistent chat sessions for logged-in users
4. **🔒 Privacy-Focused:** Secure handling of sensitive health conversations
5. **📱 Responsive Design:** Beautiful, mobile-friendly interface
6. **⚡ Fast & Reliable:** Optimized performance with error handling
7. **🎯 Domain-Focused:** Specialized exclusively for women's health topics

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build and deploy
npm run build
vercel --prod
```

### Backend (Railway)
```bash
# Connect GitHub repo to Railway
# Set environment variables if needed
# Deploy automatically on push
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# Backend (Railway)
PORT=8000  # Auto-set by Railway
```

## 🤝 Contributing

This project is part of an academic assignment. For questions or improvements:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

Academic use only. Please respect the original dataset license and model terms.

## 🙏 Acknowledgments

- **Dataset:** altaidevorg for the women-health-mini dataset
- **Model:** Hugging Face Transformers and GPT-2
- **Deployment:** Vercel (frontend) and Railway (backend)
- **UI Components:** Tailwind CSS and shadcn/ui

## 📞 Support

For questions about this project:
- Open an issue on GitHub
- Check the [API documentation](https://luna-api.railway.app/docs)
- Review the [live demo](https://luna-health.vercel.app)

---

**⚠️ Important Medical Disclaimer**

Luna is designed for educational and informational purposes only. This chatbot does not provide medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns. In emergency situations, contact emergency services immediately.
