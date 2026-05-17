FROM python:3.11-slim

WORKDIR /app

# Copy requirements first (for caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else
COPY . .

# Expose port 7860 (HuggingFace standard)
EXPOSE 7860

# Run the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]