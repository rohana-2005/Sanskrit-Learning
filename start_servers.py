#!/usr/bin/env python3
"""
Sanskrit Learning System - Easy Startup Script
This script starts all servers needed for the Sanskrit Learning System
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def run_command(command, description):
    """Run a command and print status"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - Success")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - Failed: {e}")
        if e.stdout:
            print(f"   Output: {e.stdout}")
        if e.stderr:
            print(f"   Error: {e.stderr}")
        return False

def check_python():
    """Check if Python is available"""
    try:
        result = subprocess.run([sys.executable, "--version"], capture_output=True, text=True)
        print(f"✅ Python found: {result.stdout.strip()}")
        return True
    except:
        print("❌ Python not found")
        return False

def install_requirements():
    """Install Python requirements"""
    requirements_file = Path("requirements.txt")
    if requirements_file.exists():
        return run_command(f"{sys.executable} -m pip install -r requirements.txt", 
                         "Installing Python dependencies")
    else:
        print("⚠️  requirements.txt not found, skipping dependency installation")
        return True

def main():
    print("🕉️ Sanskrit Learning System Startup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("backend").exists():
        print("❌ Please run this script from the Sanskrit-Learn-System root directory")
        print("   Current directory:", os.getcwd())
        return False
    
    # Check Python
    if not check_python():
        return False
    
    # Install requirements
    if not install_requirements():
        print("❌ Failed to install requirements. You may need to install them manually:")
        print(f"   {sys.executable} -m pip install -r requirements.txt")
        return False
    
    print("\n🚀 Starting servers...")
    print("=" * 50)
    
    # Change to backend directory
    os.chdir("backend")
    
    # Start the main app which will start all other servers
    print("🔄 Starting main server (this will also start all game servers)...")
    print("   - Main Dashboard: http://localhost:5000")
    print("   - Sentence Game Server: http://localhost:5001") 
    print("   - Verb Game Server: http://localhost:5002")
    print("\n📝 Note: Start your React frontend separately:")
    print("   cd frontend && npm run dev")
    print("\n⚡ Press Ctrl+C to stop all servers")
    print("=" * 50)
    
    try:
        # Run the main app.py which starts all servers
        subprocess.run([sys.executable, "app.py"], check=True)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
    except Exception as e:
        print(f"❌ Error running servers: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
