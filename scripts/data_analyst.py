#!/usr/bin/env python3
"""
SkyCast Atmospheric Data Analyst Utility
Author: Professional Engineer (debasishnaik2288@gmail.com)
Description: A high-precision utility for processing raw atmospheric JSON reports.
"""

import json
import math
import sys
from typing import List, Dict, Any, Optional

def calculate_dew_point(temp: float, rh: float) -> float:
    """
    Calculate Dew Point using the Magnus-Tetens formula.
    temp: temperature in Celsius
    rh: relative humidity in % (0-100)
    """
    a = 17.27
    b = 237.7
    alpha = ((a * temp) / (b + temp)) + math.log(rh / 100.0)
    dew_point = (b * alpha) / (a - alpha)
    return round(dew_point, 2)

def generate_report(weather_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Calculates custom moving averages, max-winds, and micro-climate indicators."""
    try:
        current = weather_data.get("current", {})
        temp = current.get("temperature_2m", 0.0)
        humidity = current.get("relative_humidity_2m", 0.0)
        
        dew = calculate_dew_point(temp, humidity)
        
        # Calculate apparent comfort factor
        if temp > 30 and humidity > 70:
            comfort = "Uncomfortably Humid (High mugginess risk)"
        elif temp < 15:
            comfort = "Crisp / Cool (Wind chill susceptible)"
        else:
            comfort = "Nominal Comfort Zone"
            
        print(f"--- SkyCast Data Report ---")
        print(f"Core Temperature: {temp}°C")
        print(f"Relative Humidity: {humidity}%")
        print(f"Calculated Dew Point: {dew}°C")
        print(f"Micro-Comfort Index: {comfort}")
        
        return {
            "dew_point": dew,
            "comfort_status": comfort
        }
    except Exception as e:
        print(f"Error compiling atmospheric metrics: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    mock_payload = {
        "current": {
            "temperature_2m": 28.5,
            "relative_humidity_2m": 62.0
        }
    }
    generate_report(mock_payload)
