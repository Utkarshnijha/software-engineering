import subprocess

scripts = ["models.py"]

for script in scripts:
    print(f"Running: {script}")
    try:
        subprocess.run(["python", script], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running {script}: {e}")

# Start FastAPI after all models are saved
print("All scripts completed. Starting FastAPI...")
subprocess.run(["uvicorn", "backend:app", "--host", "localhost", "--port", "8000"])
