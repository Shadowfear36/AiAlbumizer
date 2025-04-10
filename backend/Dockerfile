FROM python:3.11-slim

WORKDIR /app

#OpenCV dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

RUN chmod +x entrypoint.sh

ENTRYPOINT ["sh", "entrypoint.sh"]