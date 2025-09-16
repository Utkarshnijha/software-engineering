FROM python:3.11-slim

# Set working directory
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p Models

RUN python models.py

EXPOSE 8000

CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "8000"]
