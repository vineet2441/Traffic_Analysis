import os
import json
import random
import numpy as np

CLASSES = ["Two-Wheeler", "Three-Wheeler", "Car", "LCV"]
CLASS_WEIGHTS = [0.45, 0.25, 0.22, 0.08]

def generate_intersection_trajectories(num_frames=900, fps=30.0, width=1920, height=1080):
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)
    json_path = os.path.join(data_dir, "trajectories.json")

    random.seed(42)
    np.random.seed(42)

    routes = [
        # North to South corridor
        {"start": (720, 50), "end": (760, 1030), "speed_mult": 1.1},
        # South to North corridor
        {"start": (1180, 1030), "end": (1140, 50), "speed_mult": 1.0},
        # East to West corridor
        {"start": (1850, 480), "end": (50, 520), "speed_mult": 1.2},
        # West to East corridor
        {"start": (50, 620), "end": (1850, 580), "speed_mult": 0.95},
        # Left turn (West to North)
        {"start": (50, 640), "end": (1120, 50), "speed_mult": 0.8},
        # Right turn (South to East)
        {"start": (1160, 1030), "end": (1850, 600), "speed_mult": 0.85}
    ]

    vehicles = []
    num_vehicles = 42

    for v_id in range(1, num_vehicles + 1):
        v_class = random.choices(CLASSES, weights=CLASS_WEIGHTS)[0]
        route = random.choice(routes)
        
        entry_frame = random.randint(0, int(num_frames * 0.7))
        duration = random.randint(180, 420)
        exit_frame = min(num_frames, entry_frame + duration)

        base_speed = {
            "Two-Wheeler": random.uniform(32.0, 52.0),
            "Three-Wheeler": random.uniform(22.0, 38.0),
            "Car": random.uniform(35.0, 58.0),
            "LCV": random.uniform(20.0, 34.0)
        }[v_class] * route["speed_mult"]

        dimensions = {
            "Two-Wheeler": (36, 65),
            "Three-Wheeler": (55, 80),
            "Car": (75, 130),
            "LCV": (95, 180)
        }[v_class]

        vehicles.append({
            "id": v_id,
            "class": v_class,
            "route": route,
            "entry_frame": entry_frame,
            "exit_frame": exit_frame,
            "base_speed": base_speed,
            "bbox_size": dimensions
        })

    frames_data = []

    for f in range(num_frames):
        timestamp = round(f / fps, 2)
        detections = []

        for v in vehicles:
            if v["entry_frame"] <= f <= v["exit_frame"]:
                progress = (f - v["entry_frame"]) / max(1, (v["exit_frame"] - v["entry_frame"]))
                
                start_x, start_y = v["route"]["start"]
                end_x, end_y = v["route"]["end"]

                # Quadratic bezier curve for realistic turning trajectories
                cx = (start_x + end_x) / 2 + random.uniform(-30, 30)
                cy = (start_y + end_y) / 2 + random.uniform(-30, 30)

                x = (1 - progress)**2 * start_x + 2 * (1 - progress) * progress * cx + progress**2 * end_x
                y = (1 - progress)**2 * start_y + 2 * (1 - progress) * progress * cy + progress**2 * end_y

                # Speed jitter based on traffic congestion
                speed = round(v["base_speed"] + np.sin(f / 20.0) * 4.0 + random.uniform(-1.5, 1.5), 1)

                # Near-miss risk score based on proximity to intersection center (960, 540)
                dist_to_center = np.hypot(x - 960, y - 540)
                risk = round(max(0.0, min(1.0, 1.0 - (dist_to_center / 380.0) + random.uniform(-0.1, 0.1))), 2)

                w, h = v["bbox_size"]
                detections.append({
                    "id": v["id"],
                    "class": v["class"],
                    "x": round(x, 1),
                    "y": round(y, 1),
                    "width": w,
                    "height": h,
                    "speed_kmh": speed,
                    "risk_score": risk
                })

        frames_data.append({
            "frame_index": f,
            "timestamp_sec": timestamp,
            "detections": detections
        })

    with open(json_path, "w", encoding="utf-8") as file:
        json.dump(frames_data, file, indent=2)

    return json_path

if __name__ == "__main__":
    out_file = generate_intersection_trajectories()
    print(f"Generated realistic trajectory dataset: {out_file}")
