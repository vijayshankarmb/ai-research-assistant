from core.database import engine

with engine.connect() as conn:
    print("✅ DB connection successful!")